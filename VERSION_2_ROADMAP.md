# IRONFORGE FITNESS — Version 2 Roadmap

**Status:** Stages 2 and 3 implementation code completed locally. Supabase deployment and live integration verification remain blocked until the owner creates/configures a Supabase project.

| Stage | Scope | Status |
|---|---|---|
| 1 | Architecture, Supabase schema, secure intake Edge Function foundation, frontend API client | Code prepared; deployment pending |
| 2 | Interactive timetable, session availability, class booking, free-trial/PT request UI | Implementation complete; live Supabase verification pending |
| 3 | BMI, calorie-needs estimator, fitness goal selector, weekday-based workout planner | Implementation complete locally; browser/device QA pending |
| 4 | Contact/membership backend forms, Resend notifications, confirmation emails | Pending |
| 5 | Cross-page integration, booking CTAs, success/loading/error states, responsive polish | Pending |
| 6 | End-to-end testing, security checks, deployment and documentation | Pending |

## Stage 2 implementation
- Live timetable retrieval through the public-intake Edge Function.
- Day and program filters, capacity/availability display, and class booking request modal.
- Atomic class-capacity enforcement through the `create_class_booking` database function.
- Free-trial and personal-training request modal with date/time preferences, goal, experience, and trainer context.
- Booking requests remain `pending` until gym staff confirms them.
- Fixed Edge Function GET handling so timetable requests are handled before POST JSON parsing.
- Server-side validation for preferred date and time.

## Stage 3 implementation
- Adult BMI estimator with screening-only disclaimer.
- Mifflin–St Jeor daily maintenance calorie estimator with adult age limits.
- Goal and experience-level selection.
- Choose 2–6 actual weekdays for a sample weekly workout structure.
- Local save/restore, clear plan, and print/save PDF.
- Safe localStorage handling when browser storage is unavailable.

## Acceptance gates
- Do not mark a stage live until deployment and relevant end-to-end tests pass.
- Preserve the existing Version 1 design and pages.
- Do not show a booking as confirmed merely because a request was submitted; use `pending` until gym staff confirms it.
- Keep all service-role and email-provider secrets server-side.
- Use the Lagos timezone for gym session display and preferred appointment dates.

## Setup required from project owner
- The Supabase project URL and publishable key are configured in `js/v2/backend-config.js`; deploy the migrations and Edge Function using `SUPABASE_DEPLOYMENT.md`.
- Apply both SQL migrations in `supabase/migrations/` in filename order.
- Deploy `supabase/functions/public-intake` and configure `SUPABASE_SERVICE_ROLE_KEY` plus `ALLOWED_ORIGIN` as Edge Function secrets.
- Keep the service-role key private; never put it in browser JavaScript or GitHub.
- Confirm the production domain and real gym timetable before public launch.
