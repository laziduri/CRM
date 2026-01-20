import { NextRequest, NextResponse } from 'next/server'
import type { Appointment } from '@/types'
import { createClient } from '@/lib/supabase/server'

// Helper function to map database appointment to Appointment type
function mapDbAppointmentToAppointment(dbAppointment: any, consultantName: string = 'You'): Appointment {
  const startTime = dbAppointment.start_time ? new Date(dbAppointment.start_time) : new Date()
  const endTime = dbAppointment.end_time ? new Date(dbAppointment.end_time) : new Date()
  const duration = dbAppointment.duration || Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

  // Parse joiners from JSON string if stored that way
  let joiners: string[] = []
  if (dbAppointment.joiners) {
    try {
      if (typeof dbAppointment.joiners === 'string') {
        joiners = JSON.parse(dbAppointment.joiners)
      } else if (Array.isArray(dbAppointment.joiners)) {
        joiners = dbAppointment.joiners
      }
    } catch (e) {
      console.error('Error parsing joiners:', e)
    }
  }

  return {
    id: dbAppointment.id,
    title: dbAppointment.title,
    startTime,
    endTime,
    type: 'appointment',
    appointmentType: (dbAppointment.appointment_type || 'consultation') as Appointment['appointmentType'],
    status: (dbAppointment.status || 'scheduled') as Appointment['status'],
    consultantId: dbAppointment.consultant_id,
    consultantName: consultantName,
    isMyItem: true,
    clientId: dbAppointment.client_id || undefined,
    clientName: dbAppointment.client_name || undefined,
    clientType: dbAppointment.client_type as Appointment['clientType'] || 'personal',
    location: dbAppointment.location || 'office',
    duration,
    notes: dbAppointment.description || undefined, // Notes are optional
    color: dbAppointment.color,
    reminder: undefined, // Can be added later if needed
    attendees: undefined, // Can be added later if needed
    isJoinable: dbAppointment.is_joinable || false,
    joiners: joiners,
    locationAddress: dbAppointment.location_address,
    googleMapsLink: dbAppointment.google_maps_link,
  }
}

// GET - Fetch all appointments for consultant
export async function GET(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id') || request.nextUrl.searchParams.get('consultantId')
    
    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Get consultant name
    const { data: consultant } = await supabase
      .from('consultants')
      .select('name')
      .eq('id', consultantId)
      .single()

    const consultantName = consultant?.name || 'You'

    // Fetch appointments from Supabase
    const { data: appointmentsData, error } = await supabase
      .from('appointments')
      .select(`
        *,
        clients:client_id(name)
      `)
      .eq('consultant_id', consultantId)
      .order('start_time', { ascending: true })

    if (error) {
      console.error('[API] Supabase fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      )
    }

    // Map to Appointment format and add client names
    const appointments = (appointmentsData || []).map(apt => {
      const mapped = mapDbAppointmentToAppointment(apt, consultantName)
      // Add client name from join if available
      if (apt.clients && Array.isArray(apt.clients) && apt.clients[0]) {
        mapped.clientName = apt.clients[0].name
      } else if (typeof apt.clients === 'object' && apt.clients?.name) {
        mapped.clientName = apt.clients.name
      }
      return mapped
    })

    return NextResponse.json({
      success: true,
      appointments,
    })
  } catch (error) {
    console.error('[API] Fetch appointments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

// POST - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    const body = await request.json()

    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Get consultant name early (needed for fallback)
    const { data: consultant } = await supabase
      .from('consultants')
      .select('name')
      .eq('id', consultantId)
      .single()

    // Get client name if clientId provided
    let clientName = body.clientName
    if (body.clientId && !clientName) {
      const { data: client } = await supabase
        .from('clients')
        .select('name')
        .eq('id', body.clientId)
        .single()
      clientName = client?.name
    }

    // Calculate duration if not provided
    const startTime = new Date(body.startTime)
    const endTime = new Date(body.endTime)
    const duration = body.duration || Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

    // Create appointment in Supabase
    // Build insert object with core required columns first
    const insertData: any = {
      consultant_id: consultantId,
      client_id: body.clientId || null,
      title: body.title,
      description: body.notes || body.description || null,
      status: body.status || 'scheduled',
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      meeting_link: body.meetingLink || null,
    }

    // Add optional columns that might exist in database
    // These will be skipped if columns don't exist (graceful degradation)
    if (body.appointmentType) insertData.appointment_type = body.appointmentType
    if (duration) insertData.duration = duration
    if (body.location) insertData.location = body.location
    if (body.locationAddress) insertData.location_address = body.locationAddress
    if (body.googleMapsLink) insertData.google_maps_link = body.googleMapsLink
    if (body.latitude !== undefined && body.latitude !== null) insertData.latitude = body.latitude
    if (body.longitude !== undefined && body.longitude !== null) insertData.longitude = body.longitude
    if (body.clientType) insertData.client_type = body.clientType
    if (body.color) insertData.color = body.color
    if (body.isJoinable !== undefined) insertData.is_joinable = body.isJoinable
    
    // Handle joiners - store as JSON string if column exists
    const joinersData = body.joiners && Array.isArray(body.joiners) ? body.joiners : []
    if (joinersData.length > 0) {
      insertData.joiners = JSON.stringify(joinersData)
    }
    
    const { data: newAppointment, error: insertError } = await supabase
      .from('appointments')
      .insert(insertData)
      .select()
      .single()

    if (insertError || !newAppointment) {
      console.error('[API] Supabase insert error:', insertError)
      console.error('[API] Request body:', JSON.stringify(body, null, 2))
      
      // If error is due to missing columns, try again with only core columns
      if (insertError?.code === '42703' || insertError?.message?.includes('column') || insertError?.message?.includes('does not exist')) {
        console.log('[API] Retrying with core columns only...')
        const fallbackData: any = {
          consultant_id: consultantId,
          client_id: body.clientId || null,
          title: body.title,
          description: body.notes || body.description || null,
          status: body.status || 'scheduled',
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          meeting_link: body.meetingLink || null,
        }

        const { data: fallbackAppointment, error: fallbackError } = await supabase
          .from('appointments')
          .insert(fallbackData)
          .select()
          .single()

        if (fallbackError || !fallbackAppointment) {
          console.error('[API] Fallback insert error:', fallbackError)
          return NextResponse.json(
            { 
              error: 'Failed to create appointment',
              details: fallbackError?.message || insertError?.message || 'Unknown database error'
            },
            { status: 500 }
          )
        }

        const consultantName = consultant?.name || 'You'
        const mappedAppointment = mapDbAppointmentToAppointment(fallbackAppointment, consultantName)
        if (clientName) mappedAppointment.clientName = clientName

        return NextResponse.json({
          success: true,
          appointment: mappedAppointment,
        })
      }

      return NextResponse.json(
        { 
          error: 'Failed to create appointment',
          details: insertError?.message || insertError?.details || 'Unknown database error'
        },
        { status: 500 }
      )
    }

    // Use consultant name from earlier fetch
    const consultantName = consultant?.name || 'You'

    const mappedAppointment = mapDbAppointmentToAppointment(newAppointment, consultantName)
    if (clientName) mappedAppointment.clientName = clientName

    return NextResponse.json({
      success: true,
      appointment: mappedAppointment,
    })
  } catch (error) {
    console.error('[API] Create appointment error:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

// PUT - Update an appointment
export async function PUT(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    const body = await request.json()

    if (!consultantId || !body.id) {
      return NextResponse.json(
        { error: 'Consultant ID and Appointment ID are required' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Build update object
    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined || body.notes !== undefined) updateData.description = body.notes || body.description
    if (body.appointmentType !== undefined) updateData.appointment_type = body.appointmentType
    if (body.status !== undefined) updateData.status = body.status
    if (body.startTime !== undefined) updateData.start_time = new Date(body.startTime).toISOString()
    if (body.endTime !== undefined) updateData.end_time = new Date(body.endTime).toISOString()
    if (body.location !== undefined) updateData.location = body.location
    if (body.locationAddress !== undefined) updateData.location_address = body.locationAddress
    if (body.googleMapsLink !== undefined) updateData.google_maps_link = body.googleMapsLink
    if (body.meetingLink !== undefined) updateData.meeting_link = body.meetingLink
    if (body.clientType !== undefined) updateData.client_type = body.clientType
    if (body.color !== undefined) updateData.color = body.color
    if (body.duration !== undefined) updateData.duration = body.duration

    // Update appointment in Supabase
    const { data: updatedAppointment, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', body.id)
      .eq('consultant_id', consultantId)
      .select()
      .single()

    if (error || !updatedAppointment) {
      console.error('[API] Supabase update error:', error)
      return NextResponse.json(
        { error: 'Failed to update appointment' },
        { status: 500 }
      )
    }

    const mappedAppointment = mapDbAppointmentToAppointment(updatedAppointment)

    return NextResponse.json({
      success: true,
      appointment: mappedAppointment,
    })
  } catch (error) {
    console.error('[API] Update appointment error:', error)
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an appointment
export async function DELETE(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    const appointmentId = request.nextUrl.searchParams.get('id')

    if (!consultantId || !appointmentId) {
      return NextResponse.json(
        { error: 'Consultant ID and Appointment ID are required' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Delete appointment from Supabase
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId)
      .eq('consultant_id', consultantId)

    if (error) {
      console.error('[API] Supabase delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete appointment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully',
    })
  } catch (error) {
    console.error('[API] Delete appointment error:', error)
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    )
  }
}
