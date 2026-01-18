import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateAccessToken, extractDeviceInfo, getSecurityHeaders } from '@/lib/auth-utils'
import { createSession, parseDeviceInfo } from '@/lib/session'

// In production, use a database (Prisma, MongoDB, etc.)
// This is a temporary in-memory store for development
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
    emailVerified: true, // Demo account is pre-verified
    createdAt: new Date('2024-01-15'),
  },
]

export async function POST(request: NextRequest) {
  try {
    const { name, username, email, phone, password } = await request.json()

    // Validation
    if (!name || !username || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingClientByEmail = CLIENTS.find(c => c.email.toLowerCase() === email.toLowerCase())
    if (existingClientByEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Check if username already exists
    const existingClientByUsername = CLIENTS.find((c: any) => c.username?.toLowerCase() === username.toLowerCase())
    if (existingClientByUsername) {
      return NextResponse.json(
        { error: 'This username is already taken. Please choose another one.' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new client (in production, save to database)
    const newClient = {
      id: String(CLIENTS.length + 1),
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
      name,
      phone,
      emailVerified: true, // Auto-verify on registration (no verification required)
      createdAt: new Date(),
    }

    CLIENTS.push(newClient)

    // Extract device info from request for session management
    const { userAgent, ipAddress, deviceFingerprint } = extractDeviceInfo(request)
    const deviceInfo = parseDeviceInfo(userAgent)
    const deviceId = deviceFingerprint

    // Create session for device/session management
    const session = createSession(
      newClient.id,
      deviceId,
      deviceInfo.deviceInfo,
      userAgent,
      ipAddress
    )

    // Generate access token with session ID
    const accessToken = generateAccessToken({
      clientId: newClient.id,
      email: newClient.email,
      sessionId: session.sessionId,
    })

    // Return success with token for auto-login
    return NextResponse.json({
      success: true,
      token: accessToken,
      clientId: newClient.id,
      sessionId: session.sessionId,
      client: {
        id: newClient.id,
        email: newClient.email,
        name: newClient.name,
        phone: newClient.phone,
        emailVerified: true,
      },
      message: 'Account created successfully',
    }, {
      status: 201,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Set-Cookie': `session_id=${session.sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
      },
    })
  } catch (error) {
    console.error('[API] Registration error:', error)
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
