import { NextRequest, NextResponse } from 'next/server'

// This endpoint initiates the Outlook/Microsoft OAuth flow
export async function GET(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    
    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    // In production, you would:
    // 1. Generate OAuth state token and store it
    // 2. Redirect to Microsoft OAuth consent screen
    // 3. Handle the callback to exchange code for tokens
    
    // For now, return a mock OAuth URL
    const clientId = process.env.MICROSOFT_CLIENT_ID || 'your-microsoft-client-id'
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/consultant/calendar/outlook/callback`
    const scope = 'https://graph.microsoft.com/Calendars.ReadWrite offline_access'
    const state = Buffer.from(JSON.stringify({ consultantId })).toString('base64')
    
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${encodeURIComponent(scope)}&state=${state}`
    
    return NextResponse.json({
      authUrl,
      message: 'Redirect user to this URL to authorize Outlook Calendar access'
    })
  } catch (error) {
    console.error('[API] Outlook Calendar connect error:', error)
    return NextResponse.json(
      { error: 'An error occurred while connecting Outlook Calendar' },
      { status: 500 }
    )
  }
}

// This endpoint handles the OAuth callback and stores tokens
export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json()
    
    if (!code || !state) {
      return NextResponse.json(
        { error: 'Authorization code and state are required' },
        { status: 400 }
      )
    }

    // Decode state to get consultant ID
    const { consultantId } = JSON.parse(Buffer.from(state, 'base64').toString())
    
    // In production, you would:
    // 1. Exchange authorization code for access and refresh tokens
    // 2. Store tokens securely (encrypted in database)
    // 3. Set up webhook/subscription for calendar changes
    
    // Mock response
    return NextResponse.json({
      success: true,
      message: 'Outlook Calendar connected successfully',
      consultantId,
    })
  } catch (error) {
    console.error('[API] Outlook Calendar callback error:', error)
    return NextResponse.json(
      { error: 'An error occurred during Outlook Calendar authorization' },
      { status: 500 }
    )
  }
}
