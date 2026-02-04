'use client'

import { useState, useMemo } from 'react'
import { Plus, X, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Product } from '@/lib/products/types'
import type { DealProduct } from '@/lib/deals/types'
import { calculateDealProductTotals } from '@/lib/deals/calculations'
import DealTotals from './DealTotals'

interface DealBuilderProps {
  products: Product[]
  selectedProducts: DealProduct[]
  onProductsChange: (products: DealProduct[]) => void
  onAddProduct: (product: Product) => void
}

export default function DealBuilder({ products, selectedProducts, onProductsChange, onAddProduct }: DealBuilderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')

  // Filter available products
  const availableProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (p.vendor && p.vendor.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter
      const isNotSelected = !selectedProducts.some(sp => sp.productId === p.id)
      return matchesSearch && matchesCategory && isNotSelected && p.isActive
    })
  }, [products, searchQuery, categoryFilter, selectedProducts])

  const handleAddProduct = (product: Product) => {
    const dealProduct: Omit<DealProduct, 'totalCost' | 'totalPsgAmount' | 'totalSfecAmount' | 'totalBalanceWithSfec' | 'totalBalanceWithoutSfec' | 'totalCommissionWithSfec' | 'totalCommissionWithoutSfec' | 'totalTakeHomeCommissionWithSfec' | 'totalTakeHomeCommissionWithoutSfec'> = {
      productId: product.id,
      productName: product.name,
      category: product.category,
      vendor: product.vendor,
      quantity: 1,
      unitCost: product.cost,
      unitPsgAmount: product.psgAmount,
      unitSfecAmount: product.sfecAmount,
      unitCommissionWithSfec: product.commissionWithSfec,
      unitCommissionWithoutSfec: product.commissionWithoutSfec,
      costing: 0,
    }
    
    const productWithTotals = calculateDealProductTotals(dealProduct)
    onAddProduct(product)
    onProductsChange([...selectedProducts, productWithTotals])
  }

  const handleRemoveProduct = (productId: string) => {
    onProductsChange(selectedProducts.filter(p => p.productId !== productId))
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    const updatedProducts = selectedProducts.map(p => {
      if (p.productId === productId) {
        const updated = { ...p, quantity: Math.max(1, quantity) }
        return calculateDealProductTotals(updated)
      }
      return p
    })
    onProductsChange(updatedProducts)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'PSG Grant': 'bg-blue-100 text-blue-700',
      'Manpower Grant': 'bg-green-100 text-green-700',
      'Loan': 'bg-orange-100 text-orange-700',
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Product Selection Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Products</h3>
        
        {/* Search and Filter */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="All">All Categories</option>
            <option value="All Grants">All Grants</option>
            <option value="PSG Grant">PSG Grant</option>
            <option value="Manpower Grant">Manpower Grant</option>
          </select>
        </div>

        {/* Available Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {availableProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(product.category)}`}>
                    {product.category}
                  </span>
                </div>
              </div>
              {product.vendor && (
                <p className="text-xs text-gray-600 mb-2">Vendor: {product.vendor}</p>
              )}
              <p className="text-sm font-medium text-gray-900 mb-2">
                S${product.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddProduct(product)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add to Deal
              </Button>
            </div>
          ))}
          {availableProducts.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              {searchQuery || categoryFilter !== 'All' ? 'No products match your filters' : 'All products have been added'}
            </div>
          )}
        </div>
      </div>

      {/* Selected Products Section */}
      {selectedProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Products</h3>
          <div className="space-y-3">
            {selectedProducts.map((product) => (
              <div
                key={product.productId}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900">{product.productName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </span>
                      {product.vendor && (
                        <span className="text-xs text-gray-600">• {product.vendor}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveProduct(product.productId)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                    <Input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(product.productId, parseInt(e.target.value) || 1)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Unit Cost</label>
                    <p className="text-sm font-medium text-gray-900">
                      S${product.unitCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Total Balance</label>
                    <p className="text-sm font-semibold text-green-600">
                      S${product.totalBalanceWithSfec.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Total Commission</label>
                    <p className="text-sm font-semibold text-primary">
                      S${product.totalCommissionWithSfec.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Totals Section */}
      {selectedProducts.length > 0 && (
        <DealTotals products={selectedProducts} />
      )}
    </div>
  )
}
