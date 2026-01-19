'use client'

import { Edit, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/lib/products/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ProductsCardsProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
  isAdmin?: boolean
}

export default function ProductsCards({ products, onEdit, onDelete, isAdmin = false }: ProductsCardsProps) {
  const formatCurrency = (amount: number) => {
    return `S$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Grants: 'bg-blue-100 text-blue-700',
      Digital: 'bg-purple-100 text-purple-700',
      HRMS: 'bg-green-100 text-green-700',
      Accounting: 'bg-yellow-100 text-yellow-700',
      CRM: 'bg-pink-100 text-pink-700',
      AI: 'bg-indigo-100 text-indigo-700',
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(product.category)}`}>
                  {product.category}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            {isAdmin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(product.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {product.isActive ? 'Deactivate' : 'Delete'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span className="text-xs text-gray-400 px-2">Locked</span>
            )}
          </div>

          {/* Vendor */}
          {product.vendor && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Vendor</p>
              <p className="text-sm font-medium text-gray-900">{product.vendor}</p>
            </div>
          )}

          {/* Pricing Info */}
          <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cost</span>
              <span className="font-medium text-gray-900">{formatCurrency(product.cost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">PSG Amount</span>
              <span className="text-gray-700">{formatCurrency(product.psgAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">SFEC Amount</span>
              <span className="text-gray-700">{formatCurrency(product.sfecAmount)}</span>
            </div>
          </div>

          {/* Balances */}
          <div className="space-y-2 mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Balance With SFEC</p>
              <p className="text-lg font-bold text-green-700">
                {formatCurrency(product.balanceWithSfec)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Balance Without SFEC</p>
              <p className="text-base font-semibold text-gray-700">
                {formatCurrency(product.balanceWithoutSfec)}
              </p>
            </div>
          </div>

          {/* Commission */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Commission (w/ SFEC)</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(product.commissionWithSfec)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Commission (w/o SFEC)</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(product.commissionWithoutSfec)}
              </span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700 line-clamp-2">{product.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
