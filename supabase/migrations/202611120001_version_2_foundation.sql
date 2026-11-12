-- IRONFORGE FITNESS — Version 2 backend foundation
-- Apply this migration in the Supabase SQL Editor or with Supabase CLI.

create extension if not exists pgcrypto;
create schema if not exists private;

-- A scheduled occurrence of a program. The public site can display these
-- records; only trusted server-side code may create or modify them.
create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  class_slug text not null,
  class_name text not null,
  trainer_slug text,
  trainer_name text,
  starts_at timestamptz not null,
  duration_minutes integer not null default 60 check (duration_minutes between 10 and 240),
  capacity integer not null default 20 check (capacity between 1 and 500),
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled', 'completed')),
  booking_cutoff_hours integer not null default 1 check (booking_cutoff_hours between 0 and 168),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (class_slug, starts_at)
);

create index if not exists class_sessions_starts_at_idx
  on public.class_sessions (starts_at) where status = 'scheduled';
create index if not exists class_sessions_class_slug_idx
  on public.class_sessions (class_slug);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.class_sessions(id) on delete set null,
  booking_type text not null check (booking_type in ('class', 'free_trial', 'personal_training')),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) between 7 and 30),
  class_slug text,
  class_name text,
  trainer_slug text,
  trainer_name text,
  preferred_date date,
  preferred_time text,
  experience_level text,
  fitness_goal text,
  notes text check (notes is null or char_length(notes) <= 2000),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'waitlisted', 'completed')),
  source_page text,
  idempotency_key text unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint booking_session_type_check check (
    (booking_type = 'class' and session_id is not null)
    or (booking_type <> 'class')
  )
);

create index if not exists bookings_session_status_idx on public.bookings (session_id, status);
create index if not exists bookings_email_created_idx on public.bookings (lower(email), created_at desc);
create index if not exists bookings_status_created_idx on public.bookings (status, created_at desc);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  enquiry_type text not null check (enquiry_type in ('contact', 'membership')),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) between 7 and 30),
  subject text check (subject is null or char_length(subject) <= 160),
  message text not null check (char_length(message) between 10 and 4000),
  membership_plan_slug text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'spam')),
  source_page text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists enquiries_type_created_idx on public.enquiries (enquiry_type, created_at desc);
create index if not exists enquiries_status_created_idx on public.enquiries (status, created_at desc);

-- Private rate-limit storage. Never expose this schema to anon/authenticated roles.
create table if not exists private.intake_rate_limits (
  id bigserial primary key,
  fingerprint text not null,
  created_at timestamptz not null default timezone('utc', now())
);
create index if not exists intake_rate_limits_fingerprint_created_idx
  on private.intake_rate_limits (fingerprint, created_at desc);

-- Service-role-only rate-limit operation; the private schema itself does not
-- need to be exposed through the Supabase REST API.
create or replace function public.consume_intake_rate_limit(p_fingerprint text)
returns boolean
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_count integer;
begin
  delete from private.intake_rate_limits
  where created_at < timezone('utc', now()) - interval '1 day';

  select count(*) into v_count
  from private.intake_rate_limits
  where fingerprint = p_fingerprint
    and created_at >= timezone('utc', now()) - interval '10 minutes';

  if v_count >= 8 then
    return false;
  end if;

  insert into private.intake_rate_limits (fingerprint) values (p_fingerprint);
  return true;
end;
$$;

revoke all on function public.consume_intake_rate_limit(text) from public, anon, authenticated;
grant execute on function public.consume_intake_rate_limit(text) to service_role;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists class_sessions_touch_updated_at on public.class_sessions;
create trigger class_sessions_touch_updated_at before update on public.class_sessions
for each row execute function public.touch_updated_at();
drop trigger if exists bookings_touch_updated_at on public.bookings;
create trigger bookings_touch_updated_at before update on public.bookings
for each row execute function public.touch_updated_at();
drop trigger if exists enquiries_touch_updated_at on public.enquiries;
create trigger enquiries_touch_updated_at before update on public.enquiries
for each row execute function public.touch_updated_at();

-- No browser role can read or write these tables directly. The Edge Function
-- uses the service-role key stored as a Supabase secret, never in the website.
alter table public.class_sessions enable row level security;
alter table public.bookings enable row level security;
alter table public.enquiries enable row level security;
alter table private.intake_rate_limits enable row level security;

revoke all on public.class_sessions from anon, authenticated;
revoke all on public.bookings from anon, authenticated;
revoke all on public.enquiries from anon, authenticated;
revoke all on private.intake_rate_limits from anon, authenticated;
revoke all on schema private from public, anon, authenticated;

-- Atomic capacity-aware reservation. Edge Function calls this using service role.
create or replace function public.create_class_booking(
  p_session_id uuid,
  p_full_name text,
  p_email text,
  p_phone text,
  p_notes text default null,
  p_source_page text default 'classes.html',
  p_idempotency_key text default null
)
returns table (booking_id uuid, booking_status text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_session public.class_sessions%rowtype;
  v_active_count integer;
  v_booking_id uuid;
begin
  select * into v_session
  from public.class_sessions
  where id = p_session_id and status = 'scheduled'
  for update;

  if not found then
    raise exception 'SESSION_NOT_AVAILABLE';
  end if;

  if v_session.starts_at <= now() + make_interval(hours => v_session.booking_cutoff_hours) then
    raise exception 'BOOKING_CLOSED';
  end if;

  if p_idempotency_key is not null then
    select id into v_booking_id from public.bookings where idempotency_key = p_idempotency_key;
    if v_booking_id is not null then
      return query select v_booking_id, 'pending'::text;
      return;
    end if;
  end if;

  select count(*) into v_active_count
  from public.bookings
  where session_id = p_session_id and status in ('pending', 'confirmed');

  if v_active_count >= v_session.capacity then
    raise exception 'SESSION_FULL';
  end if;

  insert into public.bookings (
    session_id, booking_type, full_name, email, phone, class_slug, class_name,
    trainer_slug, trainer_name, notes, source_page, idempotency_key
  ) values (
    p_session_id, 'class', trim(p_full_name), lower(trim(p_email)), trim(p_phone),
    v_session.class_slug, v_session.class_name, v_session.trainer_slug,
    v_session.trainer_name, nullif(trim(p_notes), ''), p_source_page, p_idempotency_key
  ) returning id into v_booking_id;

  return query select v_booking_id, 'pending'::text;
end;
$$;

revoke all on function public.create_class_booking(uuid, text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.create_class_booking(uuid, text, text, text, text, text, text) to service_role;
