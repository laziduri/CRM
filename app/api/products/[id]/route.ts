import { NextRequest, NextResponse } from 'next/server'
import type { Product, UpdateProductInput } from '@/lib/products/types'
import { getProducts, updateProduct, deleteProduct } from '@/lib/products/store'
import { isAdmin } from '@/lib/auth-utils'

// PATCH - Update a product (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultantId = request.headers.get('x-consultant-id') || '1'
    const productId = params.id
    
    // Check admin status
    if (!isAdmin(consultantId)) {
      return NextResponse.json(
        { error: 'Only administrators can edit products' },
        { status: 403 }
      )
    }

    const body: Partial<UpdateProductInput> = await request.json()

    // Verify product exists and belongs to consultant
    const allProducts = getProducts()
    const existingProduct = allProducts.find(
      p => p.id === productId && p.consultantId === consultantId
    )

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Update product
    const updatedProduct = updateProduct(productId, {
      ...(body.name && { name: body.name }),
      ...(body.category && { category: body.category }),
      ...(body.vendor !== undefined && { vendor: body.vendor }),
      ...(body.cost !== undefined && { cost: body.cost }),
      ...(body.psgAmount !== undefined && { psgAmount: body.psgAmount }),
      ...(body.sfecAmount !== undefined && { sfecAmount: body.sfecAmount }),
      ...(body.commissionWithSfec !== undefined && { commissionWithSfec: body.commissionWithSfec }),
      ...(body.commissionWithoutSfec !== undefined && { commissionWithoutSfec: body.commissionWithoutSfec }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    })

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    })
  } catch (error) {
    console.error('[API] Update product error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a product (soft delete by setting isActive to false) (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultantId = request.headers.get('x-consultant-id') || '1'
    const productId = params.id

    // Check admin status
    if (!isAdmin(consultantId)) {
      return NextResponse.json(
        { error: 'Only administrators can delete products' },
        { status: 403 }
      )
    }

    // Verify product exists and belongs to consultant
    const allProducts = getProducts()
    const existingProduct = allProducts.find(
      p => p.id === productId && p.consultantId === consultantId
    )

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Soft delete: set isActive to false
    const success = deleteProduct(productId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deactivated successfully',
    })
  } catch (error) {
    console.error('[API] Delete product error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
