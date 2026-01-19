import { NextRequest, NextResponse } from 'next/server'
import type { Deal, UpdateDealInput } from '@/lib/deals/types'
import { getDeal, updateDeal, deleteDeal } from '@/lib/deals/store'
import { calculateDealProductTotals } from '@/lib/deals/calculations'

// GET - Get single deal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultantId = request.headers.get('x-consultant-id') || '1'
    const dealId = params.id

    const deal = getDeal(dealId)

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    if (deal.consultantId !== consultantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      deal,
    })
  } catch (error) {
    console.error('[API] Get deal error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    )
  }
}

// PATCH - Update a deal
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultantId = request.headers.get('x-consultant-id') || '1'
    const dealId = params.id
    const body: Partial<UpdateDealInput> = await request.json()

    // Verify deal exists and belongs to consultant
    const existingDeal = getDeal(dealId)

    if (!existingDeal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    if (existingDeal.consultantId !== consultantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Prepare update data
    const updateData: Partial<Deal> = {
      ...(body.name && { name: body.name }),
      ...(body.clientId !== undefined && { clientId: body.clientId }),
      ...(body.clientName !== undefined && { clientName: body.clientName }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.status && { status: body.status }),
    }

    // If products are being updated, recalculate
    if (body.products) {
      updateData.products = body.products.map(p => calculateDealProductTotals(p))
    }

    const updatedDeal = updateDeal(dealId, updateData)

    if (!updatedDeal) {
      return NextResponse.json(
        { error: 'Failed to update deal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      deal: updatedDeal,
    })
  } catch (error) {
    console.error('[API] Update deal error:', error)
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a deal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultantId = request.headers.get('x-consultant-id') || '1'
    const dealId = params.id

    // Verify deal exists and belongs to consultant
    const existingDeal = getDeal(dealId)

    if (!existingDeal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    if (existingDeal.consultantId !== consultantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const success = deleteDeal(dealId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete deal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Deal deleted successfully',
    })
  } catch (error) {
    console.error('[API] Delete deal error:', error)
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    )
  }
}
