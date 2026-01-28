import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SALES_EMAIL } from '@/lib/email'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.fullName || !data.email || !data.phone || !data.position) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, phone, position' },
        { status: 400 }
      )
    }

    const emailContent = `
Job Application Received

Applicant:
- Full name: ${data.fullName}
- Email: ${data.email}
- Phone: ${data.phone}
- Position: ${data.position}
- Resume (filename): ${data.resume || 'Not provided'}

Cover letter (if provided):
${data.coverLetter || 'Not provided'}

Experience:
${data.experience || 'Not provided'}

Motivation:
${data.motivation || 'Not provided'}

---
Sent from Brilliance Advisory careers application form.
    `.trim()

    if (!resend) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const emailResult = await resend.emails.send({
      from: 'Brilliance Advisory <noreply@brillianceadvisory.sg>',
      to: [SALES_EMAIL],
      subject: `Job application – ${data.position} – ${data.fullName}`,
      text: emailContent,
      replyTo: data.email,
    })

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResult.error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing careers form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
