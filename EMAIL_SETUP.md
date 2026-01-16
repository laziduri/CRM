# Email Setup Guide

This guide will help you set up email functionality for the loan application forms.

## Step-by-Step Setup

### 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (you get 3,000 emails/month free)
3. Verify your email address

### 2. Get Your API Key

1. Once logged in, go to [API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "Brilliance Advisory Website")
4. Copy the API key (it starts with `re_`)

### 3. Set Up Your Domain (Optional but Recommended)

For production, you should verify your domain:

1. Go to [Domains](https://resend.com/domains) in Resend
2. Click "Add Domain"
3. Enter `brillianceadvisory.sg`
4. Follow the DNS setup instructions to add the required records
5. Wait for verification (usually takes a few minutes)

**Note:** Until your domain is verified, you can use Resend's test domain, but emails will be limited. For production, domain verification is required.

### 4. Configure Environment Variables

#### For Local Development:

1. Create a `.env.local` file in the root of your project:
   ```bash
   RESEND_API_KEY=re_your_api_key_here
   ```

2. Replace `re_your_api_key_here` with your actual API key from Resend

#### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Your Resend API key (starts with `re_`)
4. Select all environments (Production, Preview, Development)
5. Click **Save**

### 5. Test the Form

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/apply`
3. Fill out and submit a test form
4. Check your email at `admin@brillianceadvisory.sg`

## Email Configuration

The forms are configured to send emails to: **admin@brillianceadvisory.sg**

To change the recipient email, edit these files:
- `app/api/submit-personal-loan/route.ts` (line 40)
- `app/api/submit-business-loan/route.ts` (line 40)

Change the `to` field in the `resend.emails.send()` call.

## Troubleshooting

### Emails Not Sending

1. **Check API Key:** Make sure your `RESEND_API_KEY` is set correctly
2. **Check Domain:** If using a custom domain, ensure it's verified in Resend
3. **Check Console:** Look for errors in your browser console or server logs
4. **Check Resend Dashboard:** Go to [Resend Logs](https://resend.com/emails) to see email delivery status

### Common Issues

- **"Invalid API Key"**: Double-check your API key in the environment variables
- **"Domain not verified"**: Verify your domain in Resend or use Resend's test domain temporarily
- **"Rate limit exceeded"**: You've hit the free tier limit (3,000 emails/month)

## Production Checklist

- [ ] Resend account created
- [ ] API key obtained
- [ ] Domain verified in Resend (recommended)
- [ ] Environment variable set in Vercel
- [ ] Test form submission works
- [ ] Email received at admin@brillianceadvisory.sg

## Support

If you encounter issues:
1. Check the [Resend Documentation](https://resend.com/docs)
2. Review server logs for error messages
3. Check Resend dashboard for email delivery status
