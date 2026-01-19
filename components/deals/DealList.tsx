'use client'

import { useState } from 'react'
import { Grid, List, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import DealCard from './DealCard'
import type { Deal } from '@/lib/deals/types'

interface DealListProps {
  deals: Deal[]
  onEdit?: (deal: Deal) => void
  onDelete?: (dealId: string) => void
  onView?: (deal: Deal) => void
}

type ViewMode = 'grid' | 'table'

export default function DealList({ deals, onEdit, onDelete, onView }: DealListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No deals found</p>
      </div>
    )
  }

  const isGridView = viewMode === 'grid'
  
  if (isGridView) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant={isGridView ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-2"
            >
              <Grid className="w-4 h-4" />
              Grid
            </Button>
            <Button
              variant={!isGridView ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              Table
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      </div>
    )
  }

  // Table view
  return (
      <div>
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant={isGridView ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-2"
            >
              <Grid className="w-4 h-4" />
              Grid
            </Button>
            <Button
              variant={!isGridView ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              Table
            </Button>
          </div>
        </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Deal Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Balance
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Commission
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
              {deals.map((deal) => {
                const formatCurrency = (amount: number) => {
                  return `S$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                }
                const getStatusColor = (status: string) => {
                  const colors: Record<string, string> = {
                    draft: 'bg-gray-100 text-gray-700',
                    sent: 'bg-blue-100 text-blue-700',
                    accepted: 'bg-green-100 text-green-700',
                    rejected: 'bg-red-100 text-red-700',
                    closed: 'bg-purple-100 text-purple-700',
                  }
                  return colors[status] || 'bg-gray-100 text-gray-700'
                }

                return (
                  <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {deal.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {deal.clientName || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {deal.products.length} product{deal.products.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                      {formatCurrency(deal.totalBalanceWithSfec)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-primary">
                      {formatCurrency(deal.totalCommissionWithSfec)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(deal.status)}`}>
                        {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(deal)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(deal)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(deal.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
