import { NextRequest, NextResponse } from 'next/server'
import type { Deal, CreateDealInput } from '@/lib/deals/types'
import { getDeals, createDeal } from '@/lib/deals/store'
import { calculateDealProductTotals, calculateDealTotals } from '@/lib/deals/calculations'

// GET - Fetch all deals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')
    const search = searchParams.get('search')
    const consultantId = request.headers.get('x-consultant-id') || '1'

    let deals = getDeals().filter(d => d.consultantId === consultantId)

    // Apply filters
    if (status && status !== 'All') {
      deals = deals.filter(d => d.status === status)
    }

    if (clientId) {
      deals = deals.filter(d => d.clientId === clientId)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      deals = deals.filter(
        d =>
          d.name.toLowerCase().includes(searchLower) ||
          (d.clientName && d.clientName.toLowerCase().includes(searchLower)) ||
          (d.description && d.description.toLowerCase().includes(searchLower))
      )
    }

    return NextResponse.json({
      success: true,
      deals,
      total: deals.length,
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
    const consultantId = request.headers.get('x-consultant-id') || '1'
    const body: CreateDealInput = await request.json()

    // Validate required fields
    if (!body.name || !body.products || body.products.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: name and at least one product' },
        { status: 400 }
      )
    }

    // Create deal with calculated totals
    const newDeal = createDeal({
      consultantId,
      clientId: body.clientId,
      clientName: body.clientName,
      name: body.name,
      description: body.description,
      products: body.products.map(p => {
        // Ensure costing is included (default to 0 if not provided)
        const productWithCosting = { ...p, costing: p.costing ?? 0 }
        return calculateDealProductTotals(productWithCosting)
      }),
      status: body.status || 'draft',
    })

    return NextResponse.json({
      success: true,
      deal: newDeal,
    })
  } catch (error) {
    console.error('[API] Create deal error:', error)
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}
