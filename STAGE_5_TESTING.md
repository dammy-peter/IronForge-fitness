# IRONFORGE FITNESS — Version 2 Stage 5 Integration Test Plan

Stage 5 connects conversion paths across the existing static pages. The implementation is local until the updated frontend is deployed to Vercel and the updated `public-intake` Edge Function is redeployed to Supabase.

## Deployment

1. Deploy the updated project to Vercel (push the project repository or upload the updated project using the existing deployment workflow).
2. Redeploy the updated Edge Function:

   ```bash
   npx supabase functions deploy public-intake --no-verify-jwt
   ```

3. Keep `ALLOWED_ORIGIN`, `RESEND_API_KEY`, `EMAIL_FROM`, and `GYM_NOTIFICATION_EMAIL` configured in Supabase Edge Function secrets. Do not put provider secrets in browser files.
4. Confirm the Edge Function deployment is successful before running submission tests.

## Cross-page acceptance tests

| Starting page | Action | Expected result |
|---|---|---|
| Any page announcement bar | Select **Get Started** | Free-trial request modal opens on the current page |
| Membership | Select a plan CTA | Membership enquiry modal opens with the selected plan visible |
| Class detail | Select **Book a Free Trial** | Free-trial modal shows the current program name; submitted booking stores program slug/name |
| Trainer detail | Select **Train with this coach** | Personal-training modal identifies the selected coach; request stores trainer slug/name |
| Trainers | Select **Request Personal Training** | General personal-training request modal opens |
| Fitness Tools | Generate or restore a workout plan, then select **Discuss My Plan With a Coach** | Coaching modal carries the plan goal and experience level |
| Contact | Submit a valid enquiry | Enquiry is stored and customer/gym emails are attempted |
| Classes / Home timetable | Book an available session | Booking request is stored as pending until staff confirmation |

## Database verification

- Membership and contact enquiries: `public.enquiries`
- Free-trial and personal-training requests: `public.bookings`
- Timetable class bookings: `public.bookings` plus the corresponding session booking count
- Verify trainer/program context on free-trial/PT booking records where supplied.

## Email verification

Check the gym notification inbox and the customer test inbox. Confirm the message includes the request reference and any supplied plan, coach, program, fitness goal, experience level, preferred date and time.

Email delivery is separate from database persistence. If Resend is temporarily unavailable, the saved request must remain in Supabase and the Edge Function logs should show the email failure.

## Release gate

Do not mark Stage 5 as live until the Vercel deployment, Edge Function deployment, database writes, and the applicable email tests have passed. Stage 6 remains responsible for broader mobile/browser QA, RLS/security review, abuse testing and final production-readiness checks.
