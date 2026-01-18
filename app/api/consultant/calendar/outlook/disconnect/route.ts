import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    
    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    // In production, you would:
    // 1. Revoke the OAuth token with Microsoft
    // 2. Delete stored tokens from database
    // 3. Cancel any active webhook subscriptions
    
    return NextResponse.json({
      success: true,
      message: 'Outlook Calendar disconnected successfully'
    })
  } catch (error) {
    console.error('[API] Outlook Calendar disconnect error:', error)
    return NextResponse.json(
      { error: 'An error occurred while disconnecting Outlook Calendar' },
      { status: 500 }
    )
  }
}
