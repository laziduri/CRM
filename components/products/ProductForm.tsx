'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import type { Product, CreateProductInput, ProductCategory } from '@/lib/products/types'
import { PRODUCT_CATEGORIES, VENDOR_SUGGESTIONS, calculateBalanceWithSfec, calculateBalanceWithoutSfec } from '@/lib/products/types'

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateProductInput) => Promise<void>
  product?: Product | null
  isAdmin?: boolean
}

export default function ProductForm({ isOpen, onClose, onSubmit, product, isAdmin = false }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateProductInput>({
    name: '',
    category: 'Grants',
    vendor: '',
    cost: 0,
    psgAmount: 0,
    sfecAmount: 0,
    commissionWithSfec: 0,
    commissionWithoutSfec: 0,
    description: '',
    isActive: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showVendorSuggestions, setShowVendorSuggestions] = useState(false)

  // Calculate balances
  const balanceWithSfec = calculateBalanceWithSfec(formData.cost, formData.psgAmount, formData.sfecAmount)
  const balanceWithoutSfec = calculateBalanceWithoutSfec(formData.cost, formData.psgAmount)

  // Load product data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        vendor: product.vendor || '',
        cost: product.cost,
        psgAmount: product.psgAmount,
        sfecAmount: product.sfecAmount,
        commissionWithSfec: product.commissionWithSfec,
        commissionWithoutSfec: product.commissionWithoutSfec,
        description: product.description || '',
        isActive: product.isActive,
      })
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        category: 'Grants',
        vendor: '',
        cost: 0,
        psgAmount: 0,
        sfecAmount: 0,
        commissionWithSfec: 0,
        commissionWithoutSfec: 0,
        description: '',
        isActive: true,
      })
    }
    setErrors({})
  }, [product, isOpen])

  const handleChange = (field: keyof CreateProductInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (formData.cost < 0) {
      newErrors.cost = 'Cost must be >= 0'
    }

    if (formData.psgAmount < 0) {
      newErrors.psgAmount = 'PSG Amount must be >= 0'
    }

    if (formData.sfecAmount < 0) {
      newErrors.sfecAmount = 'SFEC Amount must be >= 0'
    }

    if (formData.commissionWithSfec < 0) {
      newErrors.commissionWithSfec = 'Commission must be >= 0'
    }

    if (formData.commissionWithoutSfec < 0) {
      newErrors.commissionWithoutSfec = 'Commission must be >= 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredVendorSuggestions = formData.vendor
    ? VENDOR_SUGGESTIONS.filter(v => v.toLowerCase().includes(formData.vendor!.toLowerCase()))
    : VENDOR_SUGGESTIONS

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Product'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isAdmin && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Admin Only:</strong> Only administrators can edit products. This form is read-only.
            </p>
          </div>
        )}

        {/* Name */}
        <div>
          <Input
            label="Name *"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            placeholder="Enter product name"
            required
            disabled={!isAdmin}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value as ProductCategory)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={!isAdmin}
          >
            {PRODUCT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Vendor */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vendor (Optional)
          </label>
          <Input
            type="text"
            value={formData.vendor}
            onChange={(e) => {
              handleChange('vendor', e.target.value)
              setShowVendorSuggestions(true)
            }}
            onFocus={() => setShowVendorSuggestions(true)}
            onBlur={() => setTimeout(() => setShowVendorSuggestions(false), 200)}
            placeholder="Enter vendor name"
            list="vendor-suggestions"
            disabled={!isAdmin}
          />
          {showVendorSuggestions && filteredVendorSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {filteredVendorSuggestions.map((vendor) => (
                <button
                  key={vendor}
                  type="button"
                  onClick={() => {
                    handleChange('vendor', vendor)
                    setShowVendorSuggestions(false)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                >
                  {vendor}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-900">Pricing + Grants</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Cost *"
              type="number"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)}
              error={errors.cost}
              required
              disabled={!isAdmin}
            />
            <Input
              label="PSG Amount *"
              type="number"
              min="0"
              step="0.01"
              value={formData.psgAmount}
              onChange={(e) => handleChange('psgAmount', parseFloat(e.target.value) || 0)}
              error={errors.psgAmount}
              required
              disabled={!isAdmin}
            />
            <Input
              label="SFEC Amount *"
              type="number"
              min="0"
              step="0.01"
              value={formData.sfecAmount}
              onChange={(e) => handleChange('sfecAmount', parseFloat(e.target.value) || 0)}
              error={errors.sfecAmount}
              required
              disabled={!isAdmin}
            />
          </div>

          {/* Computed Balances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Balance With SFEC
              </label>
              <div className="text-lg font-semibold text-gray-900">
                S${balanceWithSfec.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Balance Without SFEC
              </label>
              <div className="text-lg font-semibold text-gray-900">
                S${balanceWithoutSfec.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Commission Section */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-900">Commission</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Commission (with SFEC) *"
              type="number"
              min="0"
              step="0.01"
              value={formData.commissionWithSfec}
              onChange={(e) => handleChange('commissionWithSfec', parseFloat(e.target.value) || 0)}
              error={errors.commissionWithSfec}
              required
            />
            <Input
              label="Commission (without SFEC) *"
              type="number"
              min="0"
              step="0.01"
              value={formData.commissionWithoutSfec}
              onChange={(e) => handleChange('commissionWithoutSfec', parseFloat(e.target.value) || 0)}
              error={errors.commissionWithoutSfec}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter product description"
            disabled={!isAdmin}
          />
        </div>

        {/* Is Active */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:cursor-not-allowed"
            disabled={!isAdmin}
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Active
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !isAdmin}
          >
            {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
