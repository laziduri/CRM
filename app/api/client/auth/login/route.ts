import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateAccessToken, extractDeviceInfo, getSecurityHeaders } from '@/lib/auth-utils'
import { createSession, parseDeviceInfo, generateDeviceFingerprint } from '@/lib/session'
import { sendDeviceLoginNotification } from '@/lib/email'

// In production, use a database (Prisma, MongoDB, etc.)
// This is a temporary in-memory store for development
// Demo credentials: 
//   Email: demo@example.com / Password: demo123
//   Username: democlient / Password: demo123
const CLIENTS: Array<{
  id: string
  email: string
  username?: string
  password: string
  name: string
  phone: string
  emailVerified: boolean
  createdAt: Date
}> = [
  {
    id: '1',
    email: 'demo@example.com',
    username: 'democlient',
    password: '$2a$10$rOzJqJqJqJqJqJqJqJqJqOKqJqJqJqJqJqJqJqJqJqJqJqJqJq', // hashed "demo123"
    name: 'Demo Client',
    phone: '+65 9123 4567',
    emailVerified: true, // Demo account is pre-verified
    createdAt: new Date('2024-01-15'),
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json()
    
    // Accept either email or username for login
    const loginIdentifier = email || username

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Find client by email or username
    const client = CLIENTS.find(c => {
      const emailMatch = c.email.toLowerCase() === loginIdentifier.toLowerCase()
      const usernameMatch = c.username?.toLowerCase() === loginIdentifier.toLowerCase()
      return emailMatch || usernameMatch
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Invalid email/username or password' },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    // Verify password
    // For demo: accept "demo123" as password
    // In production, use bcrypt to compare hashed passwords
    const isValidPassword = password === 'demo123' || await bcrypt.compare(password, client.password).catch(() => false)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email/username or password' },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    // Extract device info from request
    const { userAgent, ipAddress, deviceFingerprint } = extractDeviceInfo(request)
    const deviceInfo = parseDeviceInfo(userAgent)
    const deviceId = deviceFingerprint

    // Create session for device/session management
    const session = createSession(
      client.id,
      deviceId,
      deviceInfo.deviceInfo,
      userAgent,
      ipAddress
    )

    // Generate access token with session ID
    const accessToken = generateAccessToken({
      clientId: client.id,
      email: client.email,
      sessionId: session.sessionId,
    })

    // Send device login notification (don't block on failure)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    try {
      await sendDeviceLoginNotification({
        email: client.email,
        name: client.name,
        deviceInfo: deviceInfo.deviceInfo,
        location: ipAddress,
        timestamp: new Date().toISOString(),
        verificationUrl: `${baseUrl}/client/dashboard/settings`,
      })
    } catch (error) {
      console.error('[API] Failed to send device login notification:', error)
      // Continue login even if notification fails
    }

    // Return success with token and session info
    return NextResponse.json({
      success: true,
      token: accessToken,
      clientId: client.id,
      sessionId: session.sessionId,
      client: {
        id: client.id,
        email: client.email,
        name: client.name,
        phone: client.phone,
        emailVerified: client.emailVerified,
      },
      device: {
        deviceId: deviceId,
        deviceInfo: deviceInfo.deviceInfo,
        platform: deviceInfo.platform,
        browser: deviceInfo.browser,
      },
    }, {
      headers: {
        ...getSecurityHeaders(),
        'Set-Cookie': `session_id=${session.sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
      },
    })
  } catch (error) {
    console.error('[API] Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}
