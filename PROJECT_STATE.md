# Project State — IRONFORGE FITNESS

## Version 1
Version 1 frontend foundation is preserved from the supplied `I-forge.zip`: 12 static pages, shared CSS design system, centralized gym configuration, data-driven program/trainer/blog/membership content, gallery filtering/lightbox and responsive layouts.

## Version 2 current state
- [x] Latest Version 1 ZIP extracted and inspected.
- [x] Version 2 architecture documented.
- [x] Supabase migration drafted for class sessions, bookings, enquiries and private rate limits.
- [x] RLS enabled and direct public table access revoked in migration.
- [x] Atomic capacity-aware class booking database function added.
- [x] Public intake Edge Function foundation added (validation, honeypot, rate limiting, contact/membership/booking writes).
- [x] Frontend backend configuration and API client added.
- [x] Owner-provided Supabase project URL and publishable key configured in the frontend.
- [x] Environment and setup documentation added.
- [x] Live timetable API action added to the Edge Function.
- [x] Demo class-session seed migration added for the existing six-day timetable.
- [x] Capacity-aware public session listing added.
- [x] Responsive live timetable with day/program filters added to Home and Classes pages.
- [x] Class booking request modal and pending-status submission flow added.
- [x] Supabase SQL migrations applied by project owner.
- [x] `public-intake` Edge Function deployed by project owner; production origin configuration was requested.
- [ ] Redeploy updated Stage 4 `public-intake` function after setting Resend secrets.
- [x] Stage 2 free-trial and personal-training request modal added with preferred date/time and trainer context.
- [x] Stage 2 Edge Function GET handling corrected and server-side date/time validation added.
- [ ] Stage 2 live backend verification and final acceptance (requires Supabase deployment).
- [x] Fitness Tools page added with BMI estimator and adult calorie-needs estimate.
- [x] Goal/experience-level/weekday-based workout planner with local save and print/PDF support.
- [x] Fitness Tools added to desktop/mobile navigation and sitemap.
- [x] Dedicated Fitness Tools page added and linked in desktop/mobile navigation.
- [x] BMI estimator implemented with adult-reference disclaimers.
- [x] Mifflin–St Jeor calorie-needs estimator implemented.
- [x] Goal/experience/weekday-based workout planner implemented with local save and print.
- [x] Stage 3 planner upgraded to select actual weekdays (2–6), with plan restore and safer localStorage handling.
- [ ] Stage 3 browser/device QA and content review.
- [x] Membership plan CTAs open a selected-plan enquiry modal rather than redirecting to Contact.
- [x] Membership enquiries submit to Supabase and store the selected plan slug.
- [x] Contact form submits to Supabase rather than using a demo-only success state.
- [x] Resend email notification and customer acknowledgement flow implemented server-side in the Edge Function.
- [x] Email delivery status is returned separately so email-provider failure does not lose stored submissions.
- [ ] Configure Resend API key, verified sender and gym notification inbox; redeploy updated Edge Function.
- [ ] Live test contact, membership, class, free-trial and personal-training submissions and email delivery.
- [ ] Stage 5 cross-page integration.
- [ ] Stage 6 end-to-end QA and deployment.

## Latest static checks
- JavaScript syntax checks passed for all project browser modules.
- All 13 HTML pages parsed successfully with Python's HTML parser.
- All local script and stylesheet references resolve.
- `sitemap.xml` parses as valid XML.
- Version 2 intake script is loaded on all 13 pages; free-trial and personal-training CTAs are wired to the request modal.
- Frontend Supabase project configuration is present. The project owner confirmed both SQL migrations and the first `public-intake` deployment succeeded. The updated Stage 4 function still needs redeployment, and live form/email behavior has not yet been verified.

## Important constraints
- Keep the current HTML/CSS/vanilla-JS stack.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` in browser code or Git.
- Booking submissions are pending requests until gym staff confirms them.
- V3-only scope: member login/dashboard, payments/subscriptions, admin/trainer dashboards, QR check-in and member progress tracking.

## Next action
Set the production `ALLOWED_ORIGIN`, configure Resend secrets (`RESEND_API_KEY`, `EMAIL_FROM`, `GYM_NOTIFICATION_EMAIL`), redeploy `public-intake`, and run live contact/membership/booking/email tests. Then complete cross-page integration and browser/device QA.
