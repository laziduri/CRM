'use client'

import type { DealProduct } from '@/lib/deals/types'
import { calculateDealTotals } from '@/lib/deals/calculations'

interface DealTotalsProps {
  products: DealProduct[]
  className?: string
}

export default function DealTotals({ products, className = '' }: DealTotalsProps) {
  const totals = calculateDealTotals(products)

  const formatCurrency = (amount: number) => {
    return `S$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (products.length === 0) {
    return (
      <div className={`p-6 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
        <p className="text-sm text-gray-500 text-center">Add products to see totals</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="p-6 bg-gradient-to-br from-primary to-primary-dark rounded-xl text-white shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Deal Totals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white/80 mb-1">Total Balance (With SFEC)</p>
            <p className="text-3xl font-bold">{formatCurrency(totals.totalBalanceWithSfec)}</p>
          </div>
          <div>
            <p className="text-sm text-white/80 mb-1">Total Balance (Without SFEC)</p>
            <p className="text-3xl font-bold">{formatCurrency(totals.totalBalanceWithoutSfec)}</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Totals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Commission (With SFEC)</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.totalCommissionWithSfec)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Commission (Without SFEC)</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.totalCommissionWithoutSfec)}</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h4 className="text-base font-semibold text-gray-900 mb-3">Take-Home Commission</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Take-Home (With SFEC)</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totals.totalTakeHomeCommissionWithSfec)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Take-Home (Without SFEC)</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totals.totalTakeHomeCommissionWithoutSfec)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Totals are automatically calculated based on selected products and quantities.
        </p>
      </div>
    </div>
  )
}
