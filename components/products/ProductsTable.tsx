'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/lib/products/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ProductsTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
  onView?: (product: Product) => void
  isAdmin?: boolean
}

export default function ProductsTable({ products, onEdit, onDelete, onView, isAdmin = false }: ProductsTableProps) {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                PSG
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                SFEC
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Balance (w/ SFEC)
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Balance (w/o SFEC)
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(product.category)}`}>
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {product.vendor || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {formatCurrency(product.cost)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-600">
                  {formatCurrency(product.psgAmount)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-600">
                  {formatCurrency(product.sfecAmount)}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <span className="font-semibold text-green-600">
                    {formatCurrency(product.balanceWithSfec)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <span className="font-semibold text-gray-700">
                    {formatCurrency(product.balanceWithoutSfec)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  {isAdmin ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(product)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                        )}
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
                    <span className="text-xs text-gray-400">Locked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
