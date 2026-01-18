import { NextRequest, NextResponse } from 'next/server'
import type { Appointment } from '@/types'

// POST - Join an event (meeting or door-knocking)
export async function POST(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    const body = await request.json()
    const { appointmentId } = body

    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      )
    }

    // In production, fetch appointment from database and add consultant to joiners
    // For now, return mock success
    return NextResponse.json({
      success: true,
      message: 'Successfully joined the event',
      appointment: {
        id: appointmentId,
        joiners: [consultantId], // Add current consultant to joiners
      },
    })
  } catch (error) {
    console.error('[API] Join event error:', error)
    return NextResponse.json(
      { error: 'Failed to join event' },
      { status: 500 }
    )
  }
}

// DELETE - Leave an event
export async function DELETE(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    const appointmentId = request.nextUrl.searchParams.get('appointmentId')

    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      )
    }

    // In production, remove consultant from joiners in database
    // For now, return mock success
    return NextResponse.json({
      success: true,
      message: 'Successfully left the event',
    })
  } catch (error) {
    console.error('[API] Leave event error:', error)
    return NextResponse.json(
      { error: 'Failed to leave event' },
      { status: 500 }
    )
  }
}
