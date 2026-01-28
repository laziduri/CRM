import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SALES_EMAIL } from '@/lib/email'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.name || !data.email || !data.phone || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone, message' },
        { status: 400 }
      )
    }

    const emailContent = `
Contact Form Submission

From:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}

Message:
${data.message}

---
Sent from Brilliance Advisory contact form.
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
      subject: `Contact form – ${data.name}`,
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
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
