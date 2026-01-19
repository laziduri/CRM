import { NextRequest, NextResponse } from 'next/server'
import type { Appointment } from '@/types'
import { createClient } from '@/lib/supabase/server'

// POST - Join an event (meeting, door-knocking, celebration, or team-bonding)
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

    const supabase = await createClient()

    // Fetch current appointment
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('joiners, is_joinable')
      .eq('id', appointmentId)
      .single()

    if (fetchError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    if (!appointment.is_joinable) {
      return NextResponse.json(
        { error: 'This event is not joinable' },
        { status: 400 }
      )
    }

    // Parse existing joiners
    let joiners: string[] = []
    if (appointment.joiners) {
      try {
        if (typeof appointment.joiners === 'string') {
          joiners = JSON.parse(appointment.joiners)
        } else if (Array.isArray(appointment.joiners)) {
          joiners = appointment.joiners
        }
      } catch (e) {
        console.error('Error parsing joiners:', e)
      }
    }

    // Add consultant if not already in joiners
    if (!joiners.includes(consultantId)) {
      joiners.push(consultantId)
    }

    // Update appointment with new joiners
    const { data: updatedAppointment, error: updateError } = await supabase
      .from('appointments')
      .update({ joiners: JSON.stringify(joiners) })
      .eq('id', appointmentId)
      .select()
      .single()

    if (updateError || !updatedAppointment) {
      console.error('[API] Update joiners error:', updateError)
      return NextResponse.json(
        { error: 'Failed to join event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the event',
      appointment: {
        id: appointmentId,
        joiners: joiners,
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

    const supabase = await createClient()

    // Fetch current appointment
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('joiners')
      .eq('id', appointmentId)
      .single()

    if (fetchError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Parse existing joiners
    let joiners: string[] = []
    if (appointment.joiners) {
      try {
        if (typeof appointment.joiners === 'string') {
          joiners = JSON.parse(appointment.joiners)
        } else if (Array.isArray(appointment.joiners)) {
          joiners = appointment.joiners
        }
      } catch (e) {
        console.error('Error parsing joiners:', e)
      }
    }

    // Remove consultant from joiners
    joiners = joiners.filter(id => id !== consultantId)

    // Update appointment with new joiners
    const { error: updateError } = await supabase
      .from('appointments')
      .update({ joiners: JSON.stringify(joiners) })
      .eq('id', appointmentId)

    if (updateError) {
      console.error('[API] Update joiners error:', updateError)
      return NextResponse.json(
        { error: 'Failed to leave event' },
        { status: 500 }
      )
    }

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
