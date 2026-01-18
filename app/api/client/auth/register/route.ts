import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateAccessToken, extractDeviceInfo, getSecurityHeaders } from '@/lib/auth-utils'
import { createSession, parseDeviceInfo } from '@/lib/session'
import { createClient } from '@/lib/supabase/server'

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

    // Initialize Supabase client
    const supabase = await createClient()

    // Check if email already exists
    const { data: existingClientByEmail } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingClientByEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Check if username already exists
    const { data: existingClientByUsername } = await supabase
      .from('clients')
      .select('id')
      .eq('username', username.toLowerCase())
      .single()

    if (existingClientByUsername) {
      return NextResponse.json(
        { error: 'This username is already taken. Please choose another one.' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new client in Supabase
    const { data: newClient, error: insertError } = await supabase
      .from('clients')
      .insert({
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password_hash: hashedPassword,
        name,
        phone,
        email_verified: true, // Auto-verify on registration
      })
      .select()
      .single()

    if (insertError || !newClient) {
      console.error('[API] Supabase insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      )
    }

    // Extract device info from request for session management
    const { userAgent, ipAddress, deviceFingerprint } = extractDeviceInfo(request)
    const deviceInfo = parseDeviceInfo(userAgent)
    const deviceId = deviceFingerprint

    // Create session in Supabase
    const session = createSession(
      newClient.id,
      deviceId,
      deviceInfo.deviceInfo,
      userAgent,
      ipAddress
    )

    // Save session to Supabase
    await supabase
      .from('sessions')
      .insert({
        user_id: newClient.id,
        user_type: 'client',
        session_id: session.sessionId,
        device_id: deviceId,
        device_info: deviceInfo.deviceInfo,
        user_agent: userAgent,
        ip_address: ipAddress,
        refresh_token: session.refreshToken,
        expires_at: session.expiresAt,
      })

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
        emailVerified: newClient.email_verified,
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
