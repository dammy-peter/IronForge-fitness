# IronForge Fitness — Supabase deployment

The frontend is now configured with the Supabase project URL and **publishable** key supplied by the project owner. The publishable key is intended to be visible in browser code. No secret/service-role key is included in this repository.

Project reference: `sjyabrutzqsfifboduzu`

## 1. Apply the database migrations

In the Supabase Dashboard, open **SQL Editor** for this project and run these files in this exact order:

1. `supabase/migrations/202611120001_version_2_foundation.sql`
2. `supabase/migrations/202611120002_class_schedule_seed.sql`

The second migration inserts a demonstration timetable for the next 28 days. Replace this sample schedule with IronForge's actual approved timetable before accepting real customer bookings.

## 2. Deploy the Edge Function

Install the Supabase CLI, then run these commands from the `I-forge` project directory:

```bash
supabase login
supabase link --project-ref sjyabrutzqsfifboduzu
supabase functions deploy public-intake --no-verify-jwt
```

`verify_jwt` is disabled for this function because the public website accepts unauthenticated visitor requests. The function performs its own validation, honeypot check and rate limiting. Privileged database operations use the server-side secret key and must never be moved into browser code.

## 3. Configure the allowed website origin

Supabase provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to deployed Edge Functions automatically. The function uses that server-side credential internally; you do not need to copy it into the project or share it.

For production, restrict the CORS origin to the actual deployed website origin:

```bash
supabase secrets set ALLOWED_ORIGIN="https://YOUR-ACTUAL-DOMAIN"
```

For local preview, use the exact local origin you serve the site from. The current function defaults to `*` until an allowed origin is configured; this is not a substitute for the function's server-side validation and rate limiting. Never put a service-role/secret key in frontend code or GitHub.

## 4. Verify deployment

After deployment, test:

- `GET https://sjyabrutzqsfifboduzu.supabase.co/functions/v1/public-intake?action=sessions` (send the publishable key in the `apikey` header).
- Confirm the response contains scheduled sessions.
- Submit one test class booking and confirm a `pending` row appears in `public.bookings`.
- Submit a free-trial request and a personal-training request; confirm both create pending booking rows.
- Submit a contact enquiry and membership enquiry; confirm rows appear in `public.enquiries`.
- Test invalid email/phone, past dates, missing session IDs, full sessions and rate limiting.
- Confirm direct anonymous reads/writes to `bookings` and `enquiries` are denied.

A successful HTTP response alone is not sufficient: verify the expected database row and capacity behavior in the Supabase Dashboard.

## 5. Important launch notes

- The browser publishable key is public by design; RLS and the Edge Function protect data.
- Never expose `service_role`, `sb_secret_...`, database passwords or Resend API keys in frontend code or GitHub.
- Class booking requests remain `pending` until gym staff confirms them.
- The seeded timetable is demo data and must be replaced before launch.
- Email notifications are not configured yet; Stage 4 will add the email provider and notification flow.
