import type { DealProduct } from './types'
import { calculateBalanceWithSfec, calculateBalanceWithoutSfec } from '@/lib/products/types'

/**
 * Calculate totals for a single deal product (unit values × quantity)
 */
export function calculateDealProductTotals(product: Omit<DealProduct, 'totalCost' | 'totalPsgAmount' | 'totalSfecAmount' | 'totalBalanceWithSfec' | 'totalBalanceWithoutSfec' | 'totalCommissionWithSfec' | 'totalCommissionWithoutSfec'>): DealProduct {
  const totalCost = product.unitCost * product.quantity
  const totalPsgAmount = product.unitPsgAmount * product.quantity
  const totalSfecAmount = product.unitSfecAmount * product.quantity
  const totalBalanceWithSfec = calculateBalanceWithSfec(product.unitCost, product.unitPsgAmount, product.unitSfecAmount) * product.quantity
  const totalBalanceWithoutSfec = calculateBalanceWithoutSfec(product.unitCost, product.unitPsgAmount) * product.quantity
  const totalCommissionWithSfec = product.unitCommissionWithSfec * product.quantity
  const totalCommissionWithoutSfec = product.unitCommissionWithoutSfec * product.quantity

  return {
    ...product,
    totalCost,
    totalPsgAmount,
    totalSfecAmount,
    totalBalanceWithSfec,
    totalBalanceWithoutSfec,
    totalCommissionWithSfec,
    totalCommissionWithoutSfec,
  }
}

/**
 * Calculate totals for entire deal (sum of all products)
 */
export function calculateDealTotals(products: DealProduct[]): {
  totalBalanceWithSfec: number
  totalBalanceWithoutSfec: number
  totalCommissionWithSfec: number
  totalCommissionWithoutSfec: number
} {
  return products.reduce((totals, product) => ({
    totalBalanceWithSfec: totals.totalBalanceWithSfec + product.totalBalanceWithSfec,
    totalBalanceWithoutSfec: totals.totalBalanceWithoutSfec + product.totalBalanceWithoutSfec,
    totalCommissionWithSfec: totals.totalCommissionWithSfec + product.totalCommissionWithSfec,
    totalCommissionWithoutSfec: totals.totalCommissionWithoutSfec + product.totalCommissionWithoutSfec,
  }), {
    totalBalanceWithSfec: 0,
    totalBalanceWithoutSfec: 0,
    totalCommissionWithSfec: 0,
    totalCommissionWithoutSfec: 0,
  })
}
