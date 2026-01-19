import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { Deal } from './types'
import { calculateDealTotals, calculateDealProductTotals } from './calculations'

const DB_PATH = join(process.cwd(), 'db', 'deals.json')

function readDeals(): Deal[] {
  try {
    const data = readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(data) as Deal[]
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    console.error('Error reading deals:', error)
    return []
  }
}

function writeDeals(deals: Deal[]): void {
  try {
    writeFileSync(DB_PATH, JSON.stringify(deals, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing deals:', error)
    throw new Error('Failed to save deals')
  }
}

export function getDeals(): Deal[] {
  return readDeals()
}

export function getDeal(id: string): Deal | null {
  const deals = readDeals()
  return deals.find(d => d.id === id) || null
}

export function createDeal(deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'totalBalanceWithSfec' | 'totalBalanceWithoutSfec' | 'totalCommissionWithSfec' | 'totalCommissionWithoutSfec'>): Deal {
  const deals = readDeals()
  
  // Calculate product totals
  const productsWithTotals = deal.products.map(p => calculateDealProductTotals(p))
  
  // Calculate deal totals
  const totals = calculateDealTotals(productsWithTotals)
  
  const newDeal: Deal = {
    ...deal,
    id: `deal-${Date.now()}`,
    products: productsWithTotals,
    ...totals,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  deals.push(newDeal)
  writeDeals(deals)
  return newDeal
}

export function updateDeal(id: string, updates: Partial<Omit<Deal, 'id' | 'createdAt'>>): Deal | null {
  const deals = readDeals()
  const index = deals.findIndex(d => d.id === id)
  
  if (index === -1) return null
  
  const existingDeal = deals[index]
  
  // If products are being updated, recalculate totals
  let updatedProducts = existingDeal.products
  if (updates.products) {
    updatedProducts = updates.products.map(p => calculateDealProductTotals(p))
  }
  
  // Recalculate deal totals
  const totals = calculateDealTotals(updatedProducts)
  
  const updatedDeal: Deal = {
    ...existingDeal,
    ...updates,
    products: updatedProducts,
    ...totals,
    updatedAt: new Date().toISOString(),
  }
  
  deals[index] = updatedDeal
  writeDeals(deals)
  return updatedDeal
}

export function deleteDeal(id: string): boolean {
  const deals = readDeals()
  const index = deals.findIndex(d => d.id === id)
  
  if (index === -1) return false
  
  deals.splice(index, 1)
  writeDeals(deals)
  return true
}
