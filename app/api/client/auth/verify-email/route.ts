import { NextRequest, NextResponse } from 'next/server'
import { generateAccessToken } from '@/lib/auth-utils'

// In production, use a database
// This matches the CLIENTS array from register route
const CLIENTS: Array<{
  id: string
  email: string
  username?: string
  password: string
  name: string
  phone: string
  emailVerified: boolean
  verificationToken?: string
  verificationTokenExpiry?: Date
  createdAt: Date
}> = [
  {
    id: '1',
    email: 'demo@example.com',
    username: 'democlient',
    password: '$2a$10$rOzJqJqJqJqJqJqJqJqJqOKqJqJqJqJqJqJqJqJqJqJqJqJqJq',
    name: 'Demo Client',
    phone: '+65 9123 4567',
    emailVerified: true,
    createdAt: new Date('2024-01-15'),
  },
]

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json()

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Verification token and email are required' },
        { status: 400 }
      )
    }

    // Find client by email and token
    const client = CLIENTS.find(c => 
      c.email.toLowerCase() === email.toLowerCase() && 
      c.verificationToken === token
    )

    if (!client) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if token expired
    if (client.verificationTokenExpiry && new Date() > client.verificationTokenExpiry) {
      return NextResponse.json(
        { error: 'Verification token has expired. Please request a new verification email.' },
        { status: 400 }
      )
    }

    // Verify email
    client.emailVerified = true
    client.verificationToken = undefined
    client.verificationTokenExpiry = undefined

    // Generate JWT token for auto-login after verification
    const accessToken = generateAccessToken({
      clientId: client.id,
      email: client.email,
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      token: accessToken,
      clientId: client.id,
      client: {
        id: client.id,
        email: client.email,
        name: client.name,
        phone: client.phone,
        emailVerified: true,
      },
    }, {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
    })
  } catch (error) {
    console.error('[API] Email verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred during email verification' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.redirect(new URL('/client/login?error=invalid_token', request.url))
    }

    // Find client by email and token
    const client = CLIENTS.find(c => 
      c.email.toLowerCase() === email.toLowerCase() && 
      c.verificationToken === token
    )

    if (!client) {
      return NextResponse.redirect(new URL('/client/login?error=invalid_token', request.url))
    }

    // Check if token expired
    if (client.verificationTokenExpiry && new Date() > client.verificationTokenExpiry) {
      return NextResponse.redirect(new URL('/client/login?error=expired_token', request.url))
    }

    // Verify email
    client.emailVerified = true
    client.verificationToken = undefined
    client.verificationTokenExpiry = undefined

    // Redirect to login with success message
    return NextResponse.redirect(new URL('/client/login?verified=true', request.url))
  } catch (error) {
    console.error('[API] Email verification error:', error)
    return NextResponse.redirect(new URL('/client/login?error=verification_failed', request.url))
  }
}
