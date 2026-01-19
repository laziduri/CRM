export type ProductCategory = 'Grants' | 'Digital' | 'HRMS' | 'Accounting' | 'CRM' | 'AI'

export interface Product {
  id: string
  consultantId: string
  name: string
  category: ProductCategory
  vendor?: string
  cost: number
  psgAmount: number
  sfecAmount: number
  commissionWithSfec: number
  commissionWithoutSfec: number
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  // Computed fields (not stored, calculated)
  balanceWithSfec: number // max(cost - psgAmount - sfecAmount, 0)
  balanceWithoutSfec: number // max(cost - psgAmount, 0)
}

export interface CreateProductInput {
  name: string
  category: ProductCategory
  vendor?: string
  cost: number
  psgAmount: number
  sfecAmount: number
  commissionWithSfec: number
  commissionWithoutSfec: number
  description?: string
  isActive?: boolean
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string
}

// Helper functions for computed balances
export function calculateBalanceWithSfec(cost: number, psgAmount: number, sfecAmount: number): number {
  return Math.max(cost - psgAmount - sfecAmount, 0)
}

export function calculateBalanceWithoutSfec(cost: number, psgAmount: number): number {
  return Math.max(cost - psgAmount, 0)
}

// Product category constants
export const PRODUCT_CATEGORIES: ProductCategory[] = ['Grants', 'Digital', 'HRMS', 'Accounting', 'CRM', 'AI']

// Vendor suggestions
export const VENDOR_SUGGESTIONS = ['DST', 'Code Nova', 'Time Access', 'Xero', 'Microsoft', 'Salesforce', 'Oracle']
