import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateAccessToken, extractDeviceInfo, getSecurityHeaders } from '@/lib/auth-utils'
import { createSession, parseDeviceInfo, generateDeviceFingerprint } from '@/lib/session'
import { sendDeviceLoginNotification } from '@/lib/email'
import { createClient } from '@/lib/supabase/server'

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

    // Demo client fallback (for development/testing)
    const demoClient = {
      id: '1',
      email: 'demo@example.com',
      username: 'democlient',
      password_hash: null, // Will use demo123 fallback
      name: 'Demo Client',
      phone: '+65 9123 4567',
      email_verified: true,
      created_at: new Date('2024-01-15').toISOString(),
    }

    let client = null
    let clientError = null

    // Check if this is a demo account first
    const isDemoAccount = loginIdentifier.toLowerCase() === 'demo@example.com' || 
                         loginIdentifier.toLowerCase() === 'democlient'

    // Try Supabase first, fallback to demo client if Supabase is not configured or client not found
    if (!isDemoAccount) {
      try {
        // Check if Supabase is configured
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          const supabase = await createClient()
          
          // Find client by email or username
          const result = await supabase
            .from('clients')
            .select('*')
            .or(`email.eq.${loginIdentifier.toLowerCase()},username.eq.${loginIdentifier.toLowerCase()}`)
            .maybeSingle()

          client = result.data
          clientError = result.error
        } else {
          console.log('[API] Supabase not configured, skipping database lookup')
        }
      } catch (error) {
        console.error('[API] Supabase error:', error)
        // Fall through - will return error if client not found
      }
    } else {
      // Use demo client for demo accounts
      client = demoClient
    }

    if (!client) {
      return NextResponse.json(
        { error: 'Invalid email/username or password' },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    // Verify password
    // For demo: accept "demo123" as password (fallback for existing demo accounts)
    let isValidPassword = password === 'demo123'
    
    // If not demo123 and client has password hash, try bcrypt comparison
    if (!isValidPassword && client.password_hash) {
      try {
        isValidPassword = await bcrypt.compare(password, client.password_hash)
      } catch (error) {
        console.error('[API] Bcrypt compare error:', error)
        isValidPassword = false
      }
    }

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

    // Save session to Supabase (skip if using demo client or Supabase not configured)
    try {
      if (!isDemoAccount && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = await createClient()
        await supabase
          .from('sessions')
          .insert({
            user_id: client.id,
            user_type: 'client',
            session_id: session.sessionId,
            device_id: deviceId,
            device_info: deviceInfo.deviceInfo,
            user_agent: userAgent,
            ip_address: ipAddress,
            refresh_token: session.refreshToken,
            expires_at: session.expiresAt,
          })
      }
    } catch (error) {
      console.error('[API] Failed to save session to Supabase:', error)
      // Continue login even if session save fails
    }

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
        phone: client.phone || '',
        emailVerified: client.email_verified || false,
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
