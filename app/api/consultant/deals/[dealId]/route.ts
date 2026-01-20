import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH - Update a deal
export async function PATCH(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    const dealId = params.dealId
    
    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    if (!dealId) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const supabase = await createClient()

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (body.stage !== undefined) {
      updateData.stage = body.stage
    }

    if (body.status !== undefined) {
      updateData.status = body.status
    }

    const { data: dealData, error } = await supabase
      .from('deals')
      .update(updateData)
      .eq('id', dealId)
      .select()
      .single()

    if (error) {
      console.error('[API] Supabase update error:', error)
      return NextResponse.json(
        { error: 'Failed to update deal', details: error.message },
        { status: 500 }
      )
    }

    if (!dealData) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      deal: dealData,
    })
  } catch (error: any) {
    console.error('[API] Update deal error:', error)
    return NextResponse.json(
      { error: 'Failed to update deal', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete a deal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    const dealId = params.dealId
    
    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    if (!dealId) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // First verify the deal exists and belongs to the consultant
    const { data: dealData, error: fetchError } = await supabase
      .from('deals')
      .select('id, consultant_id')
      .eq('id', dealId)
      .single()

    if (fetchError || !dealData) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    if (dealData.consultant_id !== consultantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete the deal
    const { error: deleteError } = await supabase
      .from('deals')
      .delete()
      .eq('id', dealId)

    if (deleteError) {
      console.error('[API] Supabase delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete deal', details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Deal deleted successfully',
    })
  } catch (error: any) {
    console.error('[API] Delete deal error:', error)
    return NextResponse.json(
      { error: 'Failed to delete deal', details: error.message },
      { status: 500 }
    )
  }
}
