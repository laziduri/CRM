'use client'

import { Edit, Trash2, Eye, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Deal } from '@/lib/deals/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DealCardProps {
  deal: Deal
  onEdit?: (deal: Deal) => void
  onDelete?: (dealId: string) => void
  onView?: (deal: Deal) => void
}

export default function DealCard({ deal, onEdit, onDelete, onView }: DealCardProps) {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{deal.name}</h3>
          {deal.clientName && (
            <p className="text-sm text-gray-600 mb-2">Client: {deal.clientName}</p>
          )}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(deal.status)}`}>
              {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(deal.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <FileText className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={() => onView(deal)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(deal)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(deal.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Products:</span>
          <span className="font-medium text-gray-900">{deal.products.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Items:</span>
          <span className="font-medium text-gray-900">
            {deal.products.reduce((sum, p) => sum + p.quantity, 0)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Total Balance (With SFEC)</p>
          <p className="text-lg font-bold text-green-700">
            {formatCurrency(deal.totalBalanceWithSfec)}
          </p>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Total Commission (With SFEC)</p>
          <p className="text-base font-semibold text-primary">
            {formatCurrency(deal.totalCommissionWithSfec)}
          </p>
        </div>
      </div>
    </div>
  )
}
