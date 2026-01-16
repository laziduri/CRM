import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.businessName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format the email content
    const emailContent = `
New Business Loan Application Received

Business Information:
- Business Name: ${data.businessName}
- UEN: ${data.uen || 'Not provided'}
- Business Type: ${data.businessType}
- Industry: ${data.industry}
- Years in Operation: ${data.yearsInOperation}
- Annual Revenue: SGD ${data.annualRevenue?.toLocaleString() || 'Not provided'}

Contact Information:
- Contact Person: ${data.contactName}
- Email: ${data.email}
- Phone: ${data.phone}

Loan Details:
- Loan Amount: SGD ${data.loanAmount?.toLocaleString() || 'Not provided'}
- Loan Tenure: ${data.tenure} months
- Loan Purpose: ${data.loanPurpose}

---
This email was sent from the Brilliance Advisory loan application form.
    `.trim()

    // Send email
    if (!resend) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }
    
    const emailResult = await resend.emails.send({
      from: 'Brilliance Advisory <noreply@brillianceadvisory.sg>',
      to: ['admin@brillianceadvisory.sg'],
      subject: `New Business Loan Application - ${data.businessName}`,
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
    console.error('Error processing form submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
