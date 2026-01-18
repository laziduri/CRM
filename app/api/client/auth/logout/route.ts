import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, getSecurityHeaders } from '@/lib/auth-utils'
import { invalidateSession, invalidateAllClientSessions } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.headers.get('x-auth-token') || ''

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    // Verify token and get session ID
    const payload = verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    // Get session ID from token or cookie
    const sessionId = payload.sessionId || request.cookies.get('session_id')?.value || ''
    
    // Invalidate session if session ID is provided
    if (sessionId) {
      invalidateSession(sessionId)
    }

    // Clear session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    }, {
      headers: getSecurityHeaders(),
    })

    // Clear session cookie
    response.cookies.set('session_id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('[API] Logout error:', error)
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}

// Logout all sessions for a client (for security/device management)
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.headers.get('x-auth-token') || ''

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    // Verify token
    const payload = verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    // Invalidate all sessions for this client
    invalidateAllClientSessions(payload.clientId)

    const response = NextResponse.json({
      success: true,
      message: 'All sessions logged out successfully',
    }, {
      headers: getSecurityHeaders(),
    })

    // Clear session cookie
    response.cookies.set('session_id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('[API] Logout all error:', error)
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}
