import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all clients for consultant
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

    // Fetch clients from Supabase
    // Note: If consultant_id column doesn't exist yet, fetch all clients
    // Once migration is done, filter by consultant_id
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[API] Supabase fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch clients' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      clients: clientsData || [],
    })
  } catch (error) {
    console.error('[API] Fetch clients error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

// POST - Create a new client
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

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: 'Client name is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Build insert object - only include fields that exist in database
    // Note: email might be UNIQUE and required in schema, so generate a unique placeholder if not provided
    const insertData: any = {
      name: body.name.trim(),
      email: body.email || `client_${Date.now()}_${Math.random().toString(36).substring(7)}@placeholder.local`, // Unique placeholder email if required
      phone: body.phone || null,
    }

    // Add optional fields if they exist in database schema
    // These will be added via migration, but we'll make them optional for now
    if (body.companyName) insertData.company_name = body.companyName
    if (body.businessUEN) insertData.business_uen = body.businessUEN
    if (body.businessRegistrationDate) insertData.business_registration_date = body.businessRegistrationDate
    if (body.businessAddress) insertData.business_address = body.businessAddress
    if (body.location) insertData.location = body.location
    if (body.interestLevel) insertData.interest_level = body.interestLevel
    if (body.status) insertData.status = body.status
    if (body.notes) insertData.notes = body.notes
    if (consultantId) insertData.consultant_id = consultantId

    // Create client in Supabase
    const { data: newClient, error: insertError } = await supabase
      .from('clients')
      .insert(insertData)
      .select()
      .single()

    if (insertError || !newClient) {
      console.error('[API] Supabase insert error:', insertError)
      
      // If error is due to missing columns, try again with only core columns
      if (insertError?.code === '42703' || insertError?.message?.includes('column') || insertError?.message?.includes('does not exist')) {
        console.log('[API] Retrying with core columns only...')
        const fallbackData: any = {
          name: body.name.trim(),
          email: body.email || `client_${Date.now()}_${Math.random().toString(36).substring(7)}@placeholder.local`,
          phone: body.phone || null,
        }

        const { data: fallbackClient, error: fallbackError } = await supabase
          .from('clients')
          .insert(fallbackData)
          .select()
          .single()

        if (fallbackError || !fallbackClient) {
          console.error('[API] Fallback insert error:', fallbackError)
          return NextResponse.json(
            { 
              error: 'Failed to create client',
              details: fallbackError?.message || insertError?.message || 'Unknown database error'
            },
            { status: 500 }
          )
        }

        // Map fallback client
        const mappedClient = {
          id: fallbackClient.id,
          name: fallbackClient.name,
          email: fallbackClient.email || undefined,
          phone: fallbackClient.phone || undefined,
          companyName: undefined,
          type: 'personal' as const,
          status: 'door knocked' as const,
          notes: '',
          location: undefined,
          interestLevel: 'warm' as const,
          assignedDate: fallbackClient.created_at ? new Date(fallbackClient.created_at) : new Date(),
          totalDeals: 0,
          totalLoanAmount: 0,
        }

        return NextResponse.json({
          success: true,
          client: mappedClient,
        })
      }

      return NextResponse.json(
        { 
          error: 'Failed to create client',
          details: insertError?.message || insertError?.details || 'Unknown database error'
        },
        { status: 500 }
      )
    }

    // Map database client to frontend format
    const mappedClient = {
      id: newClient.id,
      name: newClient.name,
      email: newClient.email || undefined,
      phone: newClient.phone || undefined,
      companyName: newClient.company_name || undefined,
      type: newClient.company_name ? 'business' : 'personal',
      status: newClient.status || 'door knocked',
      notes: newClient.notes || '',
      location: newClient.location || undefined,
      interestLevel: (newClient.interest_level as 'hot' | 'warm' | 'cold') || 'warm',
      assignedDate: newClient.created_at ? new Date(newClient.created_at) : new Date(),
      totalDeals: 0,
      totalLoanAmount: 0,
      businessUEN: newClient.business_uen || undefined,
      businessRegistrationDate: newClient.business_registration_date ? new Date(newClient.business_registration_date) : undefined,
    }

    return NextResponse.json({
      success: true,
      client: mappedClient,
    })
  } catch (error) {
    console.error('[API] Create client error:', error)
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a client
export async function DELETE(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    
    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // First verify the client exists and belongs to the consultant
    const { data: clientData, error: fetchError } = await supabase
      .from('clients')
      .select('id, consultant_id')
      .eq('id', clientId)
      .single()

    if (fetchError || !clientData) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Verify ownership (if consultant_id column exists)
    if (clientData.consultant_id && clientData.consultant_id !== consultantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete the client
    const { error: deleteError } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)

    if (deleteError) {
      console.error('[API] Supabase delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete client', details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
    })
  } catch (error: any) {
    console.error('[API] Delete client error:', error)
    return NextResponse.json(
      { error: 'Failed to delete client', details: error.message },
      { status: 500 }
    )
  }
}
