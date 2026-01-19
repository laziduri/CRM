import { NextRequest, NextResponse } from 'next/server'
import type { Product, CreateProductInput } from '@/lib/products/types'
import { calculateBalanceWithSfec, calculateBalanceWithoutSfec } from '@/lib/products/types'
import { getProducts, addProduct, setProducts } from '@/lib/products/store'
import { isAdmin } from '@/lib/auth-utils'

// GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')
    const vendor = searchParams.get('vendor')
    const search = searchParams.get('search')
    const consultantId = request.headers.get('x-consultant-id') || '1' // Mock consultant ID

    const allProducts = getProducts()
    let filteredProducts = allProducts.filter(p => p.consultantId === consultantId)

    // Apply filters
    if (category && category !== 'All') {
      filteredProducts = filteredProducts.filter(p => p.category === category)
    }

    if (isActive !== null && isActive !== 'All') {
      const active = isActive === 'true'
      filteredProducts = filteredProducts.filter(p => p.isActive === active)
    }

    if (vendor && vendor !== 'All') {
      filteredProducts = filteredProducts.filter(p => p.vendor === vendor)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          (p.vendor && p.vendor.toLowerCase().includes(searchLower)) ||
          (p.description && p.description.toLowerCase().includes(searchLower))
      )
    }

    // Recalculate balances for all products
    const productsWithBalances = filteredProducts.map(p => ({
      ...p,
      balanceWithSfec: calculateBalanceWithSfec(p.cost, p.psgAmount, p.sfecAmount),
      balanceWithoutSfec: calculateBalanceWithoutSfec(p.cost, p.psgAmount),
    }))

    return NextResponse.json({
      success: true,
      products: productsWithBalances,
      total: productsWithBalances.length,
    })
  } catch (error) {
    console.error('[API] Fetch products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create a new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id') || '1' // Mock consultant ID
    
    // Check admin status
    if (!isAdmin(consultantId)) {
      return NextResponse.json(
        { error: 'Only administrators can create products' },
        { status: 403 }
      )
    }

    const body: CreateProductInput = await request.json()

    // Validate required fields
    if (!body.name || !body.category || body.cost === undefined || body.psgAmount === undefined || body.sfecAmount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new product
    const allProducts = getProducts()
    const newProduct: Product = {
      id: String(allProducts.length + 1),
      consultantId,
      name: body.name,
      category: body.category,
      vendor: body.vendor,
      cost: body.cost,
      psgAmount: body.psgAmount,
      sfecAmount: body.sfecAmount,
      commissionWithSfec: body.commissionWithSfec,
      commissionWithoutSfec: body.commissionWithoutSfec,
      description: body.description,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      balanceWithSfec: calculateBalanceWithSfec(body.cost, body.psgAmount, body.sfecAmount),
      balanceWithoutSfec: calculateBalanceWithoutSfec(body.cost, body.psgAmount),
    }

    addProduct(newProduct)

    return NextResponse.json({
      success: true,
      product: newProduct,
    })
  } catch (error) {
    console.error('[API] Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
