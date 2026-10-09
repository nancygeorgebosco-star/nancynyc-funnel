# NancyNYC — private advisory funnel

This is the portable Vercel version of the NancyNYC landing page and six-step application. The existing Manus-hosted `www.nancynyc.com` site is **not** changed by this repository; connect the domain to Vercel only after a separate deployment has been verified.

## What is included

- React/Vite landing page and six-step private advisory application (`client/src/pages/Home.tsx`).
- Local images under `client/public/assets/`, referenced as `/assets/...`; no `/manus-storage/` dependency.
- `api/lead.ts`: Vercel serverless function that checks every submitted field, then delivers the complete application by email via Resend **before** it returns an acceptance receipt. Both investment choices are recorded. On any error, the calendar remains closed and the applicant sees a retry message. No answer is intentionally stored in browser storage or logged by the API.
- Acuity booking embed (owner `33157398`, appointment type `99028191`) with applicant first name, last name, email, and phone prefilled. It mounts only for a ready applicant following an acknowledged lead delivery.

The role, current annual revenue/compensation range, desired transformation and target revenue, venture URL, birth-time availability, legal name, email, phone, investment readiness, and stated bottleneck are all included in the email. **The venture URL and current revenue range are optional**; if omitted, both are sent as empty strings. Provided URLs are validated. The form does **not** ask for a birth certificate or birth date.

## Deploy on Vercel

1. Import the GitHub repository with its root directory set to the **repository root**, not `client/`. Keep the repository private if the source is not intended to be public. `vercel.json` declares the Vite build command `pnpm run build:vercel` and output directory `dist/public`. Leave `/api/lead` routed to Vercel Functions; do not use a catch-all rewrite over it.
2. Configure these **server-side** Vercel Environment Variables for Production (and Preview if desired):
   - `RESEND_API_KEY`: an active [Resend](https://resend.com/docs/api-reference/emails/send-email) sending key.
   - `LEAD_FROM_EMAIL`: an address on a **verified sending domain**, e.g. `NancyNYC <apply@nancynyc.com>` after verifying that domain with Resend.
   - `LEAD_TO_EMAIL`: Nancy’s private receiving email address.
   - Optional `LEAD_ALLOWED_ORIGIN`: exact origin of the deployment, e.g. `https://nancynyc-funnel.vercel.app`. When omitted, the API accepts only the request URL's same-origin browser calls. If set to the production origin, Preview deployments must be configured separately to submit leads.
3. Deploy and test a dummy application **with your permission**. Confirm that the email contains every submitted answer, and that an upstream failure leaves Step 5 visible with no Acuity iframe. Use test data, not actual client details.
4. After verification, connect the desired custom domain on Vercel. Do not point `www.nancynyc.com` to a deployment whose environment variables or email domain have not been verified.

**Important:** Without those environment variables and a verified sender, `/api/lead` returns HTTP 503 and **does not display the booking calendar**. A successful static build alone is not a working production lead funnel. Never place the email API key in the React code or `VITE_*` variables, and do not commit real contact data or secrets.

## Local checks

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm exec vitest run --config vitest.config.ts
pnpm build:vercel
```

`pnpm dev -- --port 3001` serves only Vite's frontend; it does not run the Vercel function. For a complete local application, use `vercel dev` in an authenticated Vercel environment with local development-only email credentials. The browser regression test `node tests/funnel-browser.mjs` uses mocked `/api/lead` responses so it never sends real data; it expects Vite to be running at `http://127.0.0.1:3001`.
