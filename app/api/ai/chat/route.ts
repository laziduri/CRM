import { NextRequest, NextResponse } from 'next/server'

/**
 * Consultant AI Chat API - proxies to the main chat API at /api/chat.
 * Allows consultant-specific behaviour to be added later (e.g. different system prompt).
 */
export async function GET(request: NextRequest) {
  const base = request.nextUrl.origin
  try {
    const res = await fetch(`${base}/api/chat`, { method: 'GET' })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('[API] /api/ai/chat GET proxy error:', error)
    return NextResponse.json(
      { error: 'Chat service unavailable' },
      { status: 502 }
    )
  }
}

export async function POST(request: NextRequest) {
  const base = request.nextUrl.origin
  try {
    const body = await request.text()
    const res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
      },
      body,
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('[API] /api/ai/chat POST proxy error:', error)
    return NextResponse.json(
      { error: 'Chat service unavailable' },
      { status: 502 }
    )
  }
}
