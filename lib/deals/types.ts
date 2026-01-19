export interface DealProduct {
  productId: string
  productName: string
  category: string
  vendor?: string
  quantity: number
  unitCost: number
  unitPsgAmount: number
  unitSfecAmount: number
  unitCommissionWithSfec: number
  unitCommissionWithoutSfec: number
  // Computed per product (unit × quantity)
  totalCost: number
  totalPsgAmount: number
  totalSfecAmount: number
  totalBalanceWithSfec: number
  totalBalanceWithoutSfec: number
  totalCommissionWithSfec: number
  totalCommissionWithoutSfec: number
}

export interface Deal {
  id: string
  consultantId: string
  clientId?: string
  clientName?: string
  name: string
  description?: string
  products: DealProduct[]
  // Auto-calculated totals (sum of all products)
  totalBalanceWithSfec: number
  totalBalanceWithoutSfec: number
  totalCommissionWithSfec: number
  totalCommissionWithoutSfec: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'closed'
  createdAt: string
  updatedAt: string
}

export interface CreateDealInput {
  clientId?: string
  clientName?: string
  name: string
  description?: string
  products: Omit<DealProduct, 'totalCost' | 'totalPsgAmount' | 'totalSfecAmount' | 'totalBalanceWithSfec' | 'totalBalanceWithoutSfec' | 'totalCommissionWithSfec' | 'totalCommissionWithoutSfec'>[]
  status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'closed'
}

export interface UpdateDealInput extends Partial<CreateDealInput> {
  id: string
}
