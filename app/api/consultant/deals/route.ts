import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch deals (optionally filtered by clientId)
export async function GET(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id') || request.nextUrl.searchParams.get('consultantId')
    const clientId = request.nextUrl.searchParams.get('clientId')
    
    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    let query = supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false })

    // Filter by clientId if provided
    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data: dealsData, error } = await query

    if (error) {
      console.error('[API] Supabase fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch deals' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      deals: dealsData || [],
    })
  } catch (error) {
    console.error('[API] Fetch deals error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

// POST - Create a new deal
export async function POST(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    
    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const supabase = await createClient()

    const { data: dealData, error } = await supabase
      .from('deals')
      .insert({
        client_id: body.clientId,
        title: body.title,
        loan_type: body.loanType || body.type,
        loan_amount: body.amount || body.loanAmount,
        status: body.status || 'pending',
        stage: body.stage || 'new',
        consultant_id: consultantId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('[API] Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to create deal', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      deal: dealData,
    }, { status: 201 })
  } catch (error: any) {
    console.error('[API] Create deal error:', error)
    return NextResponse.json(
      { error: 'Failed to create deal', details: error.message },
      { status: 500 }
    )
  }
}
