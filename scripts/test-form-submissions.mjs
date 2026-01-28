#!/usr/bin/env node
/**
 * Test script: POSTs sample data to all form APIs so you can verify
 * emails arrive at sales@brillianceadvisory.sg (or SALES_EMAIL).
 *
 * Prerequisites:
 * - Dev server running: npm run dev
 * - .env.local has RESEND_API_KEY set (and optionally SALES_EMAIL)
 *
 * Run: node scripts/test-form-submissions.mjs
 * Base URL defaults to http://localhost:3000; override with BASE_URL.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const tests = [
  {
    name: 'Contact form',
    url: `${BASE_URL}/api/submit-contact`,
    body: {
      name: 'Test Contact User',
      email: 'test-contact@example.com',
      phone: '91234567',
      message: 'This is an automated test from test-form-submissions.mjs. Please ignore.',
    },
  },
  {
    name: 'Referral form',
    url: `${BASE_URL}/api/submit-referral`,
    body: {
      yourName: 'Test Referrer',
      yourContact: '91234567',
      yourEmail: 'test-referral@example.com',
      affiliation: 'Non-Staff',
      partnerName: '',
      consultantName: '',
      friendName: 'Referred Friend',
      friendContact: '98765432',
      propertyDetails: 'Personal loan, ~50k.',
    },
  },
  {
    name: 'Careers application',
    url: `${BASE_URL}/api/submit-careers`,
    body: {
      fullName: 'Test Applicant',
      email: 'test-careers@example.com',
      phone: '91234567',
      position: 'consultant',
      resume: 'test-resume.pdf',
      coverLetter: 'Optional cover letter.',
      experience: '5 years in finance.',
      motivation: 'I want to join Brilliance Advisory to help clients with loans.',
    },
  },
  {
    name: 'Personal loan application',
    url: `${BASE_URL}/api/submit-personal-loan`,
    body: {
      fullName: 'Test Loan User',
      email: 'test-personal-loan@example.com',
      phone: '91234567',
      loanAmount: 50000,
      tenure: 36,
      loanPurpose: 'Home Renovation',
      employmentStatus: 'Employed',
      monthlyIncome: 6000,
    },
  },
  {
    name: 'Business loan application',
    url: `${BASE_URL}/api/submit-business-loan`,
    body: {
      businessName: 'Test Business Pte Ltd',
      contactName: 'Test Contact',
      email: 'test-business-loan@example.com',
      phone: '91234567',
      loanAmount: 100000,
      tenure: 24,
      loanPurpose: 'Working capital',
    },
  },
]

async function run() {
  console.log('Testing form APIs at', BASE_URL)
  console.log('Check sales@brillianceadvisory.sg (or SALES_EMAIL) for received emails.\n')

  for (const t of tests) {
    try {
      const res = await fetch(t.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t.body),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        console.log(`✓ ${t.name}: ${res.status} – ${data.message || 'OK'}`)
      } else {
        console.log(`✗ ${t.name}: ${res.status} – ${data.error || res.statusText}`)
      }
    } catch (err) {
      console.log(`✗ ${t.name}: ${err.message}`)
    }
  }

  console.log('\nDone. If RESEND_API_KEY is set, you should see 5 emails at sales@brillianceadvisory.sg.')
}

run()
