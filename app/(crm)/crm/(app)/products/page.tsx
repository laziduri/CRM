'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Grid, List, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import ProductForm from '@/components/products/ProductForm'
import ProductsTable from '@/components/products/ProductsTable'
import ProductsCards from '@/components/products/ProductsCards'
import type { Product, CreateProductInput, ProductCategory } from '@/lib/products/types'
import { PRODUCT_CATEGORIES, VENDOR_SUGGESTIONS } from '@/lib/products/types'
import { isAdmin } from '@/lib/auth-utils'

type ViewMode = 'table' | 'cards'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [isAdminUser, setIsAdminUser] = useState(false)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [vendorFilter, setVendorFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('Active')

  const getConsultantId = () => {
    if (typeof window === 'undefined') return '1'
    return localStorage.getItem('consultant_id') || '1'
  }

  // Check admin status on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdminUser(isAdmin(getConsultantId()))
    }
  }, [])

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (categoryFilter !== 'All') params.append('category', categoryFilter)
      if (statusFilter !== 'All') params.append('isActive', statusFilter === 'Active' ? 'true' : 'false')
      if (vendorFilter !== 'All') params.append('vendor', vendorFilter)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/products?${params.toString()}`, {
        headers: {
          'x-consultant-id': getConsultantId(),
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
  }, [categoryFilter, vendorFilter, statusFilter, searchQuery])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleCreateProduct = async (data: CreateProductInput) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': getConsultantId(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create product')
      }

      await fetchProducts()
      setShowForm(false)
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  const handleUpdateProduct = async (data: CreateProductInput) => {
    if (!editingProduct) return

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': getConsultantId(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      await fetchProducts()
      setShowForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to deactivate this product?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'x-consultant-id': getConsultantId(),
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  // Get unique vendors from products
  const availableVendors = Array.from(
    new Set(products.filter(p => p.vendor).map(p => p.vendor!))
  ).sort()

  // Calculate stats
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.isActive).length
  const inactiveProducts = products.filter(p => !p.isActive).length
  const totalBalanceWithSfec = products
    .filter(p => p.isActive)
    .reduce((sum, p) => sum + p.balanceWithSfec, 0)

  const hasActiveFilters = categoryFilter !== 'All' || vendorFilter !== 'All' || statusFilter !== 'Active' || searchQuery

  const clearFilters = () => {
    setCategoryFilter('All')
    setVendorFilter('All')
    setStatusFilter('Active')
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-sm text-gray-600">Manage your product catalog</p>
            </div>
            {isAdminUser && (
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  setEditingProduct(null)
                  setShowForm(true)
                }}
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-2xl font-bold text-green-600">{activeProducts}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Inactive</p>
            <p className="text-2xl font-bold text-gray-600">{inactiveProducts}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Balance (w/ SFEC)</p>
            <p className="text-2xl font-bold text-primary">
              S${totalBalanceWithSfec.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products by name, vendor, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="All">All Categories</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={vendorFilter}
                onChange={(e) => setVendorFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="All">All Vendors</option>
                {availableVendors.map(vendor => (
                  <option key={vendor} value={vendor}>{vendor}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'cards' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="flex items-center gap-2"
              >
                <Grid className="w-4 h-4" />
                Cards
              </Button>
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                Table
              </Button>
            </div>
          </div>
        </div>

        {/* Products List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : viewMode === 'table' ? (
          <ProductsTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDeleteProduct}
            isAdmin={isAdminUser}
          />
        ) : (
          <ProductsCards
            products={products}
            onEdit={handleEdit}
            onDelete={handleDeleteProduct}
            isAdmin={isAdminUser}
          />
        )}
      </main>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        product={editingProduct}
        isAdmin={isAdminUser}
      />
    </div>
  )
}
