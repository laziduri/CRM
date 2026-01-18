import { NextRequest, NextResponse } from 'next/server'
import type { ColorPreset } from '@/types'

// Force dynamic rendering for routes using request headers
export const dynamic = 'force-dynamic'

// GET - Get user's calendar color
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
    // For now, return default or from localStorage equivalent
    const defaultColor: ColorPreset = 'blue'
    
    return NextResponse.json({
      success: true,
      color: defaultColor,
    })
  } catch (error) {
    console.error('[API] Get calendar color error:', error)
    return NextResponse.json(
      { error: 'Failed to get calendar color' },
      { status: 500 }
    )
  }
}

// PUT - Update user's calendar color
export async function PUT(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    const { color } = await request.json()

    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    if (!color) {
      return NextResponse.json(
        { error: 'Color is required' },
        { status: 400 }
      )
    }

    // In production, save to database
    // For now, just return success
    return NextResponse.json({
      success: true,
      color: color,
      message: 'Calendar color updated successfully',
    })
  } catch (error) {
    console.error('[API] Update calendar color error:', error)
    return NextResponse.json(
      { error: 'Failed to update calendar color' },
      { status: 500 }
    )
  }
}
