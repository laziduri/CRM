'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import DealBuilder from '@/components/deals/DealBuilder'
import DealTotals from '@/components/deals/DealTotals'
import type { Product } from '@/lib/products/types'
import type { DealProduct, CreateDealInput } from '@/lib/deals/types'
import { calculateDealProductTotals } from '@/lib/deals/calculations'

export default function NewDealPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<DealProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Deal form data
  const [dealName, setDealName] = useState('')
  const [clientName, setClientName] = useState('')
  const [description, setDescription] = useState('')

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/products?isActive=true', {
        headers: {
          'x-consultant-id': '1',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleAddProduct = (product: Product) => {
    // Product is already added in DealBuilder, this is just for tracking
  }

  const handleProductsChange = (newProducts: DealProduct[]) => {
    setSelectedProducts(newProducts)
  }

  const handleSave = async (status: 'draft' | 'sent') => {
    if (!dealName.trim()) {
      alert('Please enter a deal name')
      return
    }

    if (selectedProducts.length === 0) {
      alert('Please add at least one product to the deal')
      return
    }

    setIsSubmitting(true)
    try {
      const dealData: CreateDealInput = {
        name: dealName,
        clientName: clientName || undefined,
        description: description || undefined,
        products: selectedProducts.map(p => ({
          productId: p.productId,
          productName: p.productName,
          category: p.category,
          vendor: p.vendor,
          quantity: p.quantity,
          unitCost: p.unitCost,
          unitPsgAmount: p.unitPsgAmount,
          unitSfecAmount: p.unitSfecAmount,
          unitCommissionWithSfec: p.unitCommissionWithSfec,
          unitCommissionWithoutSfec: p.unitCommissionWithoutSfec,
        })),
        status,
      }

      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': '1',
        },
        body: JSON.stringify(dealData),
      })

      if (!response.ok) {
        throw new Error('Failed to create deal')
      }

      router.push('/crm/deals')
    } catch (error) {
      console.error('Error creating deal:', error)
      alert('Failed to create deal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Deal</h1>
                <p className="text-sm text-gray-600">Build a quote with multiple products</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSave('draft')}
                disabled={isSubmitting || selectedProducts.length === 0}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSave('sent')}
                disabled={isSubmitting || selectedProducts.length === 0}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send to Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Deal Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Input
                    label="Deal Name *"
                    type="text"
                    value={dealName}
                    onChange={(e) => setDealName(e.target.value)}
                    placeholder="e.g., Q1 2024 Package"
                    required
                  />
                </div>

                <div>
                  <Input
                    label="Client Name (Optional)"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter client name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Add deal description or notes..."
                  />
                </div>
              </div>
            </div>

            {/* Quick Totals Preview */}
            {selectedProducts.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Products:</span>
                    <span className="font-medium text-gray-900">{selectedProducts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium text-gray-900">
                      {selectedProducts.reduce((sum, p) => sum + p.quantity, 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Selection */}
          <div className="lg:col-span-2">
            <DealBuilder
              products={products}
              selectedProducts={selectedProducts}
              onProductsChange={handleProductsChange}
              onAddProduct={handleAddProduct}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
