# Pre-deployment Website Review Checklist

Use this checklist before deploying to ensure all pages, features, and functions operate smoothly.

## Automated Checks (run in order)

1. **Install and build**
   ```bash
   npm ci   # or npm install
   npm run build
   ```
   Resolve any TypeScript or ESLint **errors** (warnings may be acceptable).

2. **Lint and typecheck**
   ```bash
   npm run lint
   npm run typecheck
   ```

3. **Tests**
   ```bash
   npm test
   ```
   For smoke tests (API routes), run `npm run dev` in another terminal first so the dev server is on `localhost:3000`, then run `npm test`.

## Fixes Applied (pre-deployment review)

- **Education back link:** `app/(public)/education/[slug]/page.tsx` — "Back to Education Hub" now links to `/resources/education` (was `/education`, which 404’d).
- **Consultant AI Chat API:** Added `app/api/ai/chat/route.ts` — proxies GET/POST to `/api/chat` so the consultant AI Chat page works.
- **Consultant AI stub routes:** Added stub routes that return `503` with "This feature is coming soon." for:
  - `/api/ai/meetings/transcribe`, `/api/ai/meetings/summarize`
  - `/api/ai/meeting-assistant/optimize`
  - `/api/ai/dashboards/insights`, `/api/ai/gantt/optimize`
  - `/api/ai/docs/generate`, `/api/ai/docs/enhance`
  - `/api/ai/workflows/generate`, `/api/ai/projects/generate`
- **Referral image assets:** Moved from `app/(public)/referral/image/` to `public/images/referral/` and removed the app folder (files in `app/` are not served as static assets).
- **Jest setup:** Removed TypeScript-only syntax from `jest.setup.js` so Jest runs without parse errors.
- **Env-validator test:** Added `__resetEnvConfigForTesting()` and used it in the "env helpers" test so `env.isDevelopment` reflects the test’s `NODE_ENV`.

## Manual Testing Checklist

Before launch, verify:

- [ ] **All pages load** — Home, About, FAQ, Contact, Resources, Blog, Education hub, Careers, Apply, Calculator, Debt consolidation, Loans (personal, business, working-capital), Privacy, Terms, Disclaimer, Referral, Client login, CRM login.
- [ ] **Dynamic routes** — At least one blog slug, one education slug, one career slug, one loan id (e.g. `/blog/effective-interest-rate-calculation-singapore`, `/resources/education/personal-loan-interest-singapore`, `/careers/business-development-consultant`, `/loans/1`).
- [ ] **Links and buttons** — Header/footer nav, dropdowns (Loans, Calculator, Contact), CTA buttons, "Back to" links, internal links on listing pages.
- [ ] **Forms** — Contact, Personal loan, Business loan, Careers apply, Referral; submit and confirm success or expected error handling.
- [ ] **Mobile and desktop** — Layout, hamburger menu, tap targets, no horizontal scroll.
- [ ] **Console** — No uncaught errors or 404s in the browser console on key flows.
- [ ] **Consultant area** (if applicable) — Login, dashboard, AI Chat (should hit `/api/ai/chat`); other AI features may show "Coming soon" or similar from stub APIs.

## Test Results (last run)

- **Build:** `npm run build` — success (warnings only).
- **Lint:** `npm run lint` — success (warnings only).
- **Typecheck:** `npm run typecheck` — success.
- **Tests:** `npm test` — 10 passed (2 suites). Smoke tests skip if dev server is not running on localhost:3000.

Run the automated steps and this manual checklist before each deployment.
