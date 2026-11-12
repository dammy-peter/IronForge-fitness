# IronForge Fitness — Version 2 Architecture

## Direction
Version 2 upgrades the existing static multi-page site into an interactive gym business website. It retains HTML, CSS and vanilla JavaScript and adds Supabase PostgreSQL + Edge Functions for trusted server-side intake. It is not yet a member-management platform; member accounts, recurring billing, trainer/admin dashboards and QR check-in remain Version 3 scope.

## Runtime architecture

```text
Browser (HTML/CSS/Vanilla JS)
  └── js/v2/api.js
       └── HTTPS POST /functions/v1/public-intake
            └── Supabase Edge Function (Deno)
                 ├── input validation + honeypot + rate limit
                 ├── Supabase service-role client (server secret only)
                 ├── PostgreSQL: bookings / enquiries / class_sessions
                 └── Resend email notifications (Stage 4)
```

The browser must never contain a Supabase service-role key or Resend API key. The browser submits to the Edge Function using only the public anon/publishable key. RLS is enabled and direct browser access to private business tables is revoked. All privileged writes happen server-side.

## Database entities
- `class_sessions`: individual scheduled class occurrences, capacity and booking cutoff.
- `bookings`: class, free-trial and personal-training requests; new requests are `pending` until the gym confirms them.
- `enquiries`: contact and membership enquiries with a simple operational status.
- `private.intake_rate_limits`: private rate-limit fingerprints used by the Edge Function.

## Submission contract
`POST /functions/v1/public-intake` accepts a `type` of `contact`, `membership`, `class`, `free_trial`, or `personal_training`. The function validates the payload, applies a honeypot and rate limit, writes through the service role, and returns a reference plus status. Class bookings use the database `create_class_booking` function to lock a session row and enforce capacity atomically.

## Environment and deployment
1. Create a Supabase project.
2. Apply `supabase/migrations/202611120001_version_2_foundation.sql`.
3. Configure `js/v2/backend-config.js` with the project URL and public anon/publishable key.
4. Set Edge Function secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and later `RESEND_API_KEY`, `ALLOWED_ORIGIN`.
5. Deploy `supabase/functions/public-intake`.
6. Host the static website over HTTPS. The static site can remain on Vercel or Netlify.

## Security boundaries
- No service-role or email-provider secrets in frontend files.
- RLS enabled on all business tables.
- No anon/authenticated table policies for private business records.
- Validate all user-controlled values in the Edge Function and again with database constraints.
- Apply request rate limiting and honeypot checks.
- Do not expose booking customer data through public read endpoints.
- Pending booking requests are not confirmed reservations.

## Version boundaries
V2: timetable, class booking requests, free-trial and PT requests, fitness calculators, workout planner, contact/membership enquiries, email notifications and integration QA.

V3: member authentication, member dashboard, recurring payment/subscriptions, admin/trainer dashboards, attendance QR, member workout history and analytics.
