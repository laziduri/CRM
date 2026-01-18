import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for routes using request headers
export const dynamic = 'force-dynamic'

// GET - Get birthday visibility setting
export async function GET(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id') || request.nextUrl.searchParams.get('consultantId')
    
    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    // In production, fetch from database
    // For now, return mock data
    const showBirthday = true // Default to showing birthday

    return NextResponse.json({
      success: true,
      showBirthday,
    })
  } catch (error) {
    console.error('[API] Get birthday visibility error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch birthday visibility' },
      { status: 500 }
    )
  }
}

// PUT - Update birthday visibility setting
export async function PUT(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    const body = await request.json()

    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    const { showBirthday } = body

    // In production, update in database
    // For now, just return success
    return NextResponse.json({
      success: true,
      showBirthday,
      message: 'Birthday visibility updated successfully',
    })
  } catch (error) {
    console.error('[API] Update birthday visibility error:', error)
    return NextResponse.json(
      { error: 'Failed to update birthday visibility' },
      { status: 500 }
    )
  }
}
