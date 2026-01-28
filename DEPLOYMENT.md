# Deployment Guide

## Current Status
- ✅ Next.js 14 application ready to deploy
- ✅ Git repository initialized and connected
- ✅ Contact, Referral, Careers, Personal Loan, Business Loan forms send to sales@brillianceadvisory.sg via Resend (set RESEND_API_KEY and optionally SALES_EMAIL)
- ✅ Build, lint, typecheck, and tests pass
- ⚠️ No database configured

## Deploy today (checklist)

1. **From your machine**
   - `npm run build` — must pass
   - `git add . && git commit -m "Ready for deploy" && git push origin main` (or your branch)

2. **Vercel**
   - [vercel.com](https://vercel.com) → New Project → Import your repo → Deploy (defaults are fine).

3. **After first deploy**
   - Project → Settings → Environment Variables. Add:
     - `RESEND_API_KEY` (from [resend.com](https://resend.com)) — required for form emails
     - `SALES_EMAIL` (optional, default: sales@brillianceadvisory.sg)
     - `NEXT_PUBLIC_WHATSAPP_NUMBER` (optional, e.g. 6591234567)
   - Redeploy so the new build uses these env vars.

4. **Smoke test**
   - Open the live URL; click Home, About, Contact, Apply, one loan page, Calculator.
   - Submit the contact form once; confirm success message and (if Resend is set) email at SALES_EMAIL.

## Quick Deploy to Vercel (Recommended - No Database Needed)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub/GitLab/Bitbucket** (if not already):
   ```bash
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign up/login

3. **Click "New Project"**

4. **Import your Git repository**

5. **Configure project:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

6. **Click "Deploy"** - Done! 🚀

Your site will be live in ~2 minutes with a URL like `your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts - it's that simple!
```

## Deploy to Netlify (Alternative)

1. **Push code to Git** (if not already)
   ```bash
   git push origin main
   ```

2. **Go to [netlify.com](https://netlify.com)** and sign up/login

3. **Add new site → Import from Git**

4. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `.next` (or `out` if using static export)

5. **Deploy!**

## Do You Need a Database?

### Currently: **NO** ✅
Your forms simulate submissions - they don't actually save data anywhere. The site works perfectly without a database.

### If You Want to Store Form Submissions Later:

You have several options:

#### Option 1: Add Database to Next.js (Recommended when needed)
- **PostgreSQL** (via Vercel Postgres, Supabase, or AWS RDS)
- **MongoDB** (via MongoDB Atlas)
- **Firebase** (Google's backend-as-a-service)

#### Option 2: Use a Form Service (Easiest)
- **Formspree** - Free tier available, just add action URL to forms
- **EmailJS** - Send form data to email
- **Zapier** - Connect forms to Google Sheets, etc.

#### Option 3: AWS MCP (More Complex)
- Requires AWS account setup
- Need to configure API Gateway, Lambda, DynamoDB/RDS
- More control but more setup

## Next Steps (Choose One)

### 🚀 Quick Deploy (No Database)
1. Push code: `git push origin main`
2. Deploy to Vercel (see Option 1 above)
3. Your site is live!

### 📊 Deploy + Add Database Later
1. Deploy to Vercel (see above)
2. When ready, we can add:
   - Form submission storage
   - User authentication
   - Dynamic content

### 🏗️ Deploy with AWS
If you specifically need AWS:
1. Set up AWS account
2. Configure AWS credentials
3. Set up deployment pipeline
4. Configure database (RDS, DynamoDB, etc.)

## Current Form Status

- **Contact** ([/contact](app/(public)/contact)) → `POST /api/submit-contact` → email to sales@
- **Referral** ([/referral](app/(public)/referral)) → `POST /api/submit-referral` → email to sales@
- **Careers apply** ([/careers/apply](app/(public)/careers/apply)) → `POST /api/submit-careers` → email to sales@
- **Personal / Business loan** ([/apply](app/(public)/apply)) → `POST /api/submit-personal-loan` or `submit-business-loan` → email to sales@

Set `RESEND_API_KEY` (and optionally `SALES_EMAIL`, default `sales@brillianceadvisory.sg`) for emails to be sent.

## Testing forms and WhatsApp

1. **Email forms**  
   With dev server running and `RESEND_API_KEY` set in `.env.local`, run:
   ```bash
   node scripts/test-form-submissions.mjs
   ```
   Then check **sales@brillianceadvisory.sg** (or your `SALES_EMAIL`) for 5 test emails (contact, referral, careers, personal loan, business loan).

2. **WhatsApp**  
   Set `NEXT_PUBLIC_WHATSAPP_NUMBER` (e.g. `6591234567`) in `.env.local` so the chatbot, referral page “Prefer WhatsApp?” link, and any WhatsApp buttons use your number. Then:
   - Open the site, click “Chat with us”, request an appointment and submit → WhatsApp should open with your number.
   - On [/referral](app/(public)/referral), click “Message us on WhatsApp” → same number.

3. **Manual UI test**  
   Visit each page, fill the form with real or test data, submit, and confirm you see the success screen and (if Resend is configured) receive the email.

## Questions?

- **Just want it live?** → Use Vercel (5 minutes)
- **Need to store form data?** → We can add database integration
- **Need AWS?** → We can set up AWS deployment pipeline
