import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { Product } from './types'
import { calculateBalanceWithSfec, calculateBalanceWithoutSfec } from './types'

const DB_PATH = join(process.cwd(), 'db', 'products.json')

function readProducts(): Product[] {
  try {
    const data = readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(data) as Product[]
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    console.error('Error reading products:', error)
    return []
  }
}

function writeProducts(products: Product[]): void {
  try {
    writeFileSync(DB_PATH, JSON.stringify(products, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing products:', error)
    throw new Error('Failed to save products')
  }
}

export function getProducts(): Product[] {
  return readProducts()
}

export function setProducts(newProducts: Product[]): void {
  writeProducts(newProducts)
}

export function addProduct(product: Product): void {
  const products = readProducts()
  products.push(product)
  writeProducts(products)
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = readProducts()
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return null

  const updated = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  // Recalculate balances
  updated.balanceWithSfec = calculateBalanceWithSfec(
    updated.cost,
    updated.psgAmount,
    updated.sfecAmount
  )
  updated.balanceWithoutSfec = calculateBalanceWithoutSfec(
    updated.cost,
    updated.psgAmount
  )

  products[index] = updated
  writeProducts(products)
  return updated
}

export function deleteProduct(id: string): boolean {
  const products = readProducts()
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return false

  products[index].isActive = false
  products[index].updatedAt = new Date().toISOString()
  writeProducts(products)
  return true
}
