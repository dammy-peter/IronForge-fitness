-- Generate the next 28 days of demo class sessions from the Version 1 timetable.
-- Replace/extend this schedule with the gym's approved real timetable before launch.
insert into public.class_sessions (
  class_slug, class_name, trainer_slug, trainer_name, starts_at,
  duration_minutes, capacity, booking_cutoff_hours
)
select
  s.class_slug,
  s.class_name,
  s.trainer_slug,
  s.trainer_name,
  ((d::date + s.start_time) at time zone 'Africa/Lagos'),
  s.duration_minutes,
  s.capacity,
  1
from generate_series(current_date, current_date + 28, interval '1 day') as d
cross join (values
  (1, time '06:00', 'strength-training', 'Strength Training', 'david-okafor', 'David Okafor', 60, 20),
  (2, time '18:00', 'hiit', 'HIIT', 'amaka-johnson', 'Amaka Johnson', 45, 18),
  (3, time '19:00', 'boxing', 'Boxing', 'chidi-nwosu', 'Chidi Nwosu', 60, 16),
  (4, time '06:00', 'functional-training', 'Functional Training', 'michael-adeyemi', 'Michael Adeyemi', 50, 18),
  (5, time '18:00', 'strength-training', 'Strength Training', 'david-okafor', 'David Okafor', 60, 20),
  (6, time '09:00', 'mobility', 'Mobility & Recovery', 'grace-abiodun', 'Grace Abiodun', 50, 16)
) as s(iso_day, start_time, class_slug, class_name, trainer_slug, trainer_name, duration_minutes, capacity)
where extract(isodow from d) = s.iso_day
on conflict (class_slug, starts_at) do nothing;

create or replace function public.get_public_class_sessions(p_from timestamptz default now(), p_until timestamptz default now() + interval '30 days')
returns table (
  id uuid,
  class_slug text,
  class_name text,
  trainer_slug text,
  trainer_name text,
  starts_at timestamptz,
  duration_minutes integer,
  capacity integer,
  booked_count bigint,
  available_spots bigint
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    s.id, s.class_slug, s.class_name, s.trainer_slug, s.trainer_name,
    s.starts_at, s.duration_minutes, s.capacity,
    count(b.id) filter (where b.status in ('pending', 'confirmed')) as booked_count,
    greatest(s.capacity - count(b.id) filter (where b.status in ('pending', 'confirmed')), 0) as available_spots
  from public.class_sessions s
  left join public.bookings b on b.session_id = s.id
  where s.status = 'scheduled' and s.starts_at >= p_from and s.starts_at < p_until
  group by s.id
  order by s.starts_at asc;
$$;

revoke all on function public.get_public_class_sessions(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.get_public_class_sessions(timestamptz, timestamptz) to service_role;
