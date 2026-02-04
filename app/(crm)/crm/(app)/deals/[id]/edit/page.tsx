'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import DealBuilder from '@/components/deals/DealBuilder'
import DealTotals from '@/components/deals/DealTotals'
import type { Product } from '@/lib/products/types'
import type { DealProduct, CreateDealInput } from '@/lib/deals/types'
import { ROUTES } from '@/lib/route-constants'

export default function EditDealPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<DealProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Deal form data
  const [dealName, setDealName] = useState('')
  const [clientName, setClientName] = useState('')
  const [description, setDescription] = useState('')

  const getConsultantId = () => {
    if (typeof window === 'undefined') return '1'
    return localStorage.getItem('consultant_id') || '1'
  }

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products?isActive=true', {
        headers: {
          'x-consultant-id': getConsultantId(),
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }, [])

  // Fetch existing deal
  const fetchDeal = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    try {
      const [dealRes, _] = await Promise.all([
        fetch(`/api/deals/${id}`, {
          headers: { 'x-consultant-id': getConsultantId() },
        }),
        fetchProducts(),
      ])

      if (!dealRes.ok) {
        setIsLoading(false)
        if (dealRes.status === 404) {
          router.push(ROUTES.CRM.DEALS)
          return
        }
        throw new Error('Failed to fetch deal')
      }

      const { deal } = await dealRes.json()
      setDealName(deal.name)
      setClientName(deal.clientName || '')
      setDescription(deal.description || '')
      setSelectedProducts(deal.products || [])
    } catch (err) {
      console.error('Error fetching deal:', err)
      router.push(ROUTES.CRM.DEALS)
    } finally {
      setIsLoading(false)
    }
  }, [id, fetchProducts, router])

  useEffect(() => {
    fetchDeal()
  }, [fetchDeal])

  const handleAddProduct = (_product: Product) => {
    // Product is already added in DealBuilder
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
      const updateData = {
        name: dealName,
        clientName: clientName || undefined,
        description: description || undefined,
        products: selectedProducts.map((p) => ({
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
          costing: p.costing,
        })),
        status,
      }

      const response = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': getConsultantId(),
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error('Failed to update deal')
      }

      router.push(ROUTES.CRM.DEALS)
    } catch (err) {
      console.error('Error updating deal:', err)
      alert('Failed to update deal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal...</p>
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
                onClick={() => router.push(ROUTES.CRM.DEALS)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Deal</h1>
                <p className="text-sm text-gray-600">Update deal information and products</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(ROUTES.CRM.DEALS)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSave('draft')}
                disabled={isSubmitting || selectedProducts.length === 0}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSave('sent')}
                disabled={isSubmitting || selectedProducts.length === 0}
                className="gap-2"
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
