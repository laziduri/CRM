import type { DealProduct } from './types'
import { calculateBalanceWithSfec, calculateBalanceWithoutSfec } from '@/lib/products/types'

/**
 * Calculate totals for a single deal product (unit values × quantity)
 * Special handling for MCPP: consultantCharge - 2000 = consultant commission, company gets 2000
 */
export function calculateDealProductTotals(product: Omit<DealProduct, 'totalCost' | 'totalPsgAmount' | 'totalSfecAmount' | 'totalBalanceWithSfec' | 'totalBalanceWithoutSfec' | 'totalCommissionWithSfec' | 'totalCommissionWithoutSfec' | 'totalTakeHomeCommissionWithSfec' | 'totalTakeHomeCommissionWithoutSfec'>): DealProduct {
  // Special handling for MCPP products that require consultant charge
  if (product.consultantCharge !== undefined && product.consultantCharge > 0) {
    const COMPANY_EARNINGS = 2000
    const consultantCommission = Math.max(0, product.consultantCharge - COMPANY_EARNINGS)
    
    // For MCPP: company earnings = 2000, consultant commission = consultantCharge - 2000
    const totalCost = product.consultantCharge * product.quantity
    const totalPsgAmount = COMPANY_EARNINGS * product.quantity // Company earnings
    const totalSfecAmount = 0
    const totalBalanceWithSfec = COMPANY_EARNINGS * product.quantity // Company earnings
    const totalBalanceWithoutSfec = COMPANY_EARNINGS * product.quantity
    const totalCommissionWithSfec = consultantCommission * product.quantity
    const totalCommissionWithoutSfec = consultantCommission * product.quantity
    
    // For MCPP: commission IS the take-home commission (no costing deduction)
    const totalTakeHomeCommissionWithSfec = totalCommissionWithSfec
    const totalTakeHomeCommissionWithoutSfec = totalCommissionWithoutSfec

    return {
      ...product,
      totalCost,
      totalPsgAmount,
      totalSfecAmount,
      totalBalanceWithSfec,
      totalBalanceWithoutSfec,
      totalCommissionWithSfec,
      totalCommissionWithoutSfec,
      totalTakeHomeCommissionWithSfec,
      totalTakeHomeCommissionWithoutSfec,
    }
  }

  // Standard calculation for regular products
  const totalCost = product.unitCost * product.quantity
  const totalPsgAmount = product.unitPsgAmount * product.quantity
  const totalSfecAmount = product.unitSfecAmount * product.quantity
  const totalBalanceWithSfec = calculateBalanceWithSfec(product.unitCost, product.unitPsgAmount, product.unitSfecAmount) * product.quantity
  const totalBalanceWithoutSfec = calculateBalanceWithoutSfec(product.unitCost, product.unitPsgAmount) * product.quantity
  const totalCommissionWithSfec = product.unitCommissionWithSfec * product.quantity
  const totalCommissionWithoutSfec = product.unitCommissionWithoutSfec * product.quantity
  
  // Calculate take-home commission: Commission - (costing × quantity)
  const totalCosting = (product.costing || 0) * product.quantity
  const totalTakeHomeCommissionWithSfec = totalCommissionWithSfec - totalCosting
  const totalTakeHomeCommissionWithoutSfec = totalCommissionWithoutSfec - totalCosting

  return {
    ...product,
    totalCost,
    totalPsgAmount,
    totalSfecAmount,
    totalBalanceWithSfec,
    totalBalanceWithoutSfec,
    totalCommissionWithSfec,
    totalCommissionWithoutSfec,
    totalTakeHomeCommissionWithSfec,
    totalTakeHomeCommissionWithoutSfec,
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
  totalTakeHomeCommissionWithSfec: number
  totalTakeHomeCommissionWithoutSfec: number
} {
  return products.reduce((totals, product) => ({
    totalBalanceWithSfec: totals.totalBalanceWithSfec + product.totalBalanceWithSfec,
    totalBalanceWithoutSfec: totals.totalBalanceWithoutSfec + product.totalBalanceWithoutSfec,
    totalCommissionWithSfec: totals.totalCommissionWithSfec + product.totalCommissionWithSfec,
    totalCommissionWithoutSfec: totals.totalCommissionWithoutSfec + product.totalCommissionWithoutSfec,
    totalTakeHomeCommissionWithSfec: totals.totalTakeHomeCommissionWithSfec + product.totalTakeHomeCommissionWithSfec,
    totalTakeHomeCommissionWithoutSfec: totals.totalTakeHomeCommissionWithoutSfec + product.totalTakeHomeCommissionWithoutSfec,
  }), {
    totalBalanceWithSfec: 0,
    totalBalanceWithoutSfec: 0,
    totalCommissionWithSfec: 0,
    totalCommissionWithoutSfec: 0,
    totalTakeHomeCommissionWithSfec: 0,
    totalTakeHomeCommissionWithoutSfec: 0,
  })
}
