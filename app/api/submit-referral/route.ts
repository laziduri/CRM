import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SALES_EMAIL } from '@/lib/email'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.yourName || !data.yourContact || !data.yourEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: yourName, yourContact, yourEmail' },
        { status: 400 }
      )
    }

    const emailContent = `
Referral Submission

Your information:
- Name: ${data.yourName}
- Contact: ${data.yourContact}
- Email: ${data.yourEmail}
- Affiliation: ${data.affiliation || 'Not provided'}

Partner / consultant (if any):
- Partner name: ${data.partnerName || 'Not provided'}
- Consultant name: ${data.consultantName || 'Not provided'}

Referred friend:
- Friend name: ${data.friendName || 'Not provided'}
- Friend contact: ${data.friendContact || 'Not provided'}

Property details (if any):
${data.propertyDetails || 'Not provided'}

---
Sent from Brilliance Advisory referral form.
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
      subject: `Referral – ${data.yourName}`,
      text: emailContent,
      replyTo: data.yourEmail,
    })

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResult.error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Referral submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing referral form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
