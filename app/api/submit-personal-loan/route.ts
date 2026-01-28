import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SALES_EMAIL } from '@/lib/email'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.fullName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format the email content
    const emailContent = `
New Personal Loan Application Received

Personal Information:
- Full Name: ${data.fullName}
- NRIC: ${data.nric || 'Not provided'}
- Email: ${data.email}
- Phone: ${data.phone}

Employment Details:
- Employment Status: ${data.employmentStatus}
- Monthly Income: SGD ${data.monthlyIncome?.toLocaleString() || 'Not provided'}

Loan Details:
- Loan Amount: SGD ${data.loanAmount?.toLocaleString() || 'Not provided'}
- Loan Tenure: ${data.tenure} months
- Loan Purpose: ${data.loanPurpose}
- Existing Loans: ${data.existingLoans}

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
      to: [SALES_EMAIL],
      subject: `New Personal Loan Application - ${data.fullName}`,
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
