'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  User,
  Building2,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  FileText,
  DollarSign,
  Tag,
  Edit,
  Save,
  Plus,
  X,
  Clock,
  MapPin,
  MessageCircle,
  PhoneCall,
  Video,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  TrendingUp,
  FileCheck,
  History,
  Upload,
  Download,
  CheckCircle,
  Circle,
  FileIcon,
  FolderKanban
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import type { Product } from '@/lib/products/types'
import type { DealProduct } from '@/lib/deals/types'
import { calculateDealProductTotals } from '@/lib/deals/calculations'
import { Search, Trash2, AlertTriangle } from 'lucide-react'

interface Client {
  id: string
  name: string
  type: 'personal' | 'business'
  email: string
  phone: string
  status: 'active' | 'inactive' | 'prospect'
  assignedDate: Date
  totalDeals: number
  totalLoanAmount: number
  lastContact?: Date
  tags?: string[]
  businessUEN?: string
  businessRegistrationDate?: Date
  address?: string
  notes?: string
}

interface Appointment {
  id: string
  title: string
  date: Date
  time: string
  type: 'consultation' | 'follow-up' | 'closing' | 'other'
  location: 'office' | 'online' | 'client-site'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
}

interface Deal {
  id: string
  title: string
  type: 'personal' | 'business'
  amount: number
  totalCommissionWithSfec?: number
  totalCommissionWithoutSfec?: number
  totalTakeHomeCommissionWithSfec?: number
  totalTakeHomeCommissionWithoutSfec?: number
  products?: DealProduct[]
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  stage: 'new' | 'appointment' | 'apply' | 'close' | 'rejected'
  date: Date
  clientId?: string
}

interface ClientDocument {
  id: string
  name: string
  description?: string
  category: 'identity' | 'income' | 'business' | 'property' | 'other'
  status: 'pending' | 'received'
  required: boolean
  receivedDate?: Date
  fileUrl?: string
  fileName?: string
  notes?: string
}

export default function ClientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.clientId as string
  const [client, setClient] = useState<Client | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [documents, setDocuments] = useState<ClientDocument[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'schedule' | 'deals' | 'documents' | 'pipeline'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [kanbanDeals, setKanbanDeals] = useState<Deal[]>([])
  
  // Product selection state
  const [showProductSelection, setShowProductSelection] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<DealProduct[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [productSearchQuery, setProductSearchQuery] = useState('')
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('All')
  const [dealName, setDealName] = useState('')
  const [dealDescription, setDealDescription] = useState('')
  const [isCreatingDeal, setIsCreatingDeal] = useState(false)
  
  // Loan product state
  const [showLoanModal, setShowLoanModal] = useState(false)
  const [loanAmount, setLoanAmount] = useState<number>(0)
  const [loanChargePercentage, setLoanChargePercentage] = useState<number>(0)
  
  // Deal details modal state
  const [showDealDetailsModal, setShowDealDetailsModal] = useState(false)
  const [selectedDealDetails, setSelectedDealDetails] = useState<any>(null)
  const [isLoadingDealDetails, setIsLoadingDealDetails] = useState(false)
  const [showAddProductInDeal, setShowAddProductInDeal] = useState(false)
  const [selectedProductsForDeal, setSelectedProductsForDeal] = useState<DealProduct[]>([])

  // Fetch products
  useEffect(() => {
    if (showProductSelection) {
      fetchProducts()
    }
  }, [showProductSelection])

  const fetchProducts = async () => {
    setIsLoadingProducts(true)
    try {
      const consultantId = localStorage.getItem('consultant_id') || '1'
      const response = await fetch('/api/products?isActive=true', {
        headers: {
          'x-consultant-id': consultantId,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Create product variants (SFEC and No SFEC)
  const getProductVariants = () => {
    const variants: Array<{
      id: string
      product: Product
      isSfec: boolean
      displayName: string
      commission: number
      balance: number
      requiresConsultantCharge?: boolean
    }> = []

    products.forEach(product => {
      // Skip loan products from API - they're added via modal
      if (product.category === 'Loan' || product.isLoanProduct) {
        return // Loan products are added manually via modal
      }
      
      // Special handling for products that require consultant charge (like MCPP)
      if (product.requiresConsultantCharge) {
        variants.push({
          id: product.id,
          product,
          isSfec: false,
          displayName: product.name,
          commission: 0, // Will be calculated based on consultant charge
          balance: 2000, // Company always gets 2000
          requiresConsultantCharge: true,
        })
      } else {
        // SFEC variant
        variants.push({
          id: `${product.id}-sfec`,
          product,
          isSfec: true,
          displayName: `${product.name} - SFEC`,
          commission: product.commissionWithSfec,
          balance: product.balanceWithSfec,
        })
        // No SFEC variant
        variants.push({
          id: `${product.id}-nosfec`,
          product,
          isSfec: false,
          displayName: `${product.name} - No SFEC`,
          commission: product.commissionWithoutSfec,
          balance: product.balanceWithoutSfec,
        })
      }
    })

    return variants
  }

  const handleAddProduct = (variant: ReturnType<typeof getProductVariants>[0]) => {
    // Initialize costing with product balance as suggested value
    const suggestedCosting = variant.requiresConsultantCharge ? 0 : variant.balance
    
    const dealProduct: Omit<DealProduct, 'totalCost' | 'totalPsgAmount' | 'totalSfecAmount' | 'totalBalanceWithSfec' | 'totalBalanceWithoutSfec' | 'totalCommissionWithSfec' | 'totalCommissionWithoutSfec' | 'totalTakeHomeCommissionWithSfec' | 'totalTakeHomeCommissionWithoutSfec'> = {
      productId: variant.id,
      productName: variant.displayName,
      category: variant.product.category,
      vendor: variant.product.vendor,
      quantity: 1,
      unitCost: variant.product.cost,
      unitPsgAmount: variant.product.psgAmount,
      unitSfecAmount: variant.isSfec ? variant.product.sfecAmount : 0,
      unitCommissionWithSfec: variant.isSfec ? variant.commission : 0,
      unitCommissionWithoutSfec: !variant.isSfec ? variant.commission : 0,
      consultantCharge: variant.requiresConsultantCharge ? undefined : undefined, // Will be set by user input
      costing: suggestedCosting, // Pre-filled with product balance
    }
    
    const productWithTotals = calculateDealProductTotals(dealProduct)
    setSelectedProducts([...selectedProducts, productWithTotals])
  }

  const handleConsultantChargeChange = (productId: string, consultantCharge: number) => {
    const updatedProducts = selectedProducts.map(p => {
      if (p.productId === productId) {
        const updated = { ...p, consultantCharge: Math.max(0, consultantCharge) }
        return calculateDealProductTotals(updated)
      }
      return p
    })
    setSelectedProducts(updatedProducts)
  }

  const handleCostingChange = (productId: string, costing: number) => {
    const updatedProducts = selectedProducts.map(p => {
      if (p.productId === productId) {
        const updated = { ...p, costing: Math.max(0, costing) }
        return calculateDealProductTotals(updated)
      }
      return p
    })
    setSelectedProducts(updatedProducts)
  }

  // Helper to get the correct commission and take-home values based on variant
  const getProductCommissionValues = (product: DealProduct) => {
    const hasSfecCommission = product.totalCommissionWithSfec > 0
    const hasNoSfecCommission = product.totalCommissionWithoutSfec > 0
    
    // Determine which variant this product is
    if (hasSfecCommission && !hasNoSfecCommission) {
      // SFEC variant
      return {
        totalCommission: product.totalCommissionWithSfec,
        totalTakeHomeCommission: product.totalTakeHomeCommissionWithSfec,
      }
    } else if (hasNoSfecCommission && !hasSfecCommission) {
      // No SFEC variant
      return {
        totalCommission: product.totalCommissionWithoutSfec,
        totalTakeHomeCommission: product.totalTakeHomeCommissionWithoutSfec,
      }
    } else if (hasSfecCommission && hasNoSfecCommission) {
      // Both available (e.g., MCPP or Loan) - prefer SFEC
      return {
        totalCommission: product.totalCommissionWithSfec,
        totalTakeHomeCommission: product.totalTakeHomeCommissionWithSfec,
      }
    } else {
      // Fallback (shouldn't happen, but handle edge case)
      return {
        totalCommission: product.totalCommissionWithSfec || product.totalCommissionWithoutSfec || 0,
        totalTakeHomeCommission: product.totalTakeHomeCommissionWithSfec || product.totalTakeHomeCommissionWithoutSfec || 0,
      }
    }
  }

  // Helper to get the correct commission and take-home values for deals
  const getDealCommissionValues = (deal: Deal) => {
    const hasSfecCommission = (deal.totalCommissionWithSfec || 0) > 0
    const hasNoSfecCommission = (deal.totalCommissionWithoutSfec || 0) > 0
    
    // Determine which variant this deal is
    if (hasSfecCommission && !hasNoSfecCommission) {
      // SFEC variant
      return {
        totalCommission: deal.totalCommissionWithSfec || 0,
        totalTakeHomeCommission: deal.totalTakeHomeCommissionWithSfec || 0,
      }
    } else if (hasNoSfecCommission && !hasSfecCommission) {
      // No SFEC variant
      return {
        totalCommission: deal.totalCommissionWithoutSfec || 0,
        totalTakeHomeCommission: deal.totalTakeHomeCommissionWithoutSfec || 0,
      }
    } else if (hasSfecCommission && hasNoSfecCommission) {
      // Both available - sum both (for mixed SFEC/No-SFEC deals)
      return {
        totalCommission: (deal.totalCommissionWithSfec || 0) + (deal.totalCommissionWithoutSfec || 0),
        totalTakeHomeCommission: (deal.totalTakeHomeCommissionWithSfec || 0) + (deal.totalTakeHomeCommissionWithoutSfec || 0),
      }
    } else {
      // Fallback (shouldn't happen, but handle edge case)
      return {
        totalCommission: deal.totalCommissionWithSfec || deal.totalCommissionWithoutSfec || 0,
        totalTakeHomeCommission: deal.totalTakeHomeCommissionWithSfec || deal.totalTakeHomeCommissionWithoutSfec || 0,
      }
    }
  }

  // Helper to calculate statistics from deal products (more accurate than stored totals)
  const calculateDealStatsFromProducts = (deal: Deal) => {
    if (!deal.products || deal.products.length === 0) {
      // Fallback to stored totals if no products available
      return getDealCommissionValues(deal)
    }
    
    // Recalculate from actual products
    const totalCommission = deal.products.reduce((sum, product) => {
      const values = getProductCommissionValues(product)
      return sum + values.totalCommission
    }, 0)
    
    const totalTakeHomeCommission = deal.products.reduce((sum, product) => {
      const values = getProductCommissionValues(product)
      return sum + values.totalTakeHomeCommission
    }, 0)
    
    return {
      totalCommission,
      totalTakeHomeCommission,
    }
  }

  const handleViewDealDetails = async (dealId: string) => {
    setIsLoadingDealDetails(true)
    setShowDealDetailsModal(true)
    
    try {
      const consultantId = localStorage.getItem('consultant_id') || '1'
      const response = await fetch(`/api/deals/${dealId}`, {
        headers: {
          'x-consultant-id': consultantId,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedDealDetails(data.deal || data)
      } else {
        // If API fails, use the deal data we already have
        const deal = deals.find(d => d.id === dealId)
        if (deal) {
          setSelectedDealDetails({
            id: deal.id,
            name: deal.title,
            status: deal.status,
            stage: deal.stage,
            totalBalanceWithSfec: deal.amount,
            totalCommissionWithSfec: deal.totalCommissionWithSfec,
            totalCommissionWithoutSfec: deal.totalCommissionWithoutSfec,
            totalTakeHomeCommissionWithSfec: deal.totalTakeHomeCommissionWithSfec,
            totalTakeHomeCommissionWithoutSfec: deal.totalTakeHomeCommissionWithoutSfec,
            createdAt: deal.date.toISOString(),
            products: [],
          })
        } else {
          alert('Failed to load deal details')
          setShowDealDetailsModal(false)
        }
      }
    } catch (error: any) {
      console.error('Error fetching deal details:', error)
      // Fallback to existing deal data
      const deal = deals.find(d => d.id === dealId)
      if (deal) {
        setSelectedDealDetails({
          id: deal.id,
          name: deal.title,
          status: deal.status,
          stage: deal.stage,
          totalBalanceWithSfec: deal.amount,
          totalCommissionWithSfec: deal.totalCommissionWithSfec,
          totalCommissionWithoutSfec: deal.totalCommissionWithoutSfec,
          totalTakeHomeCommissionWithSfec: deal.totalTakeHomeCommissionWithSfec,
          totalTakeHomeCommissionWithoutSfec: deal.totalTakeHomeCommissionWithoutSfec,
          createdAt: deal.date.toISOString(),
          products: [],
        })
      } else {
        alert('Failed to load deal details')
        setShowDealDetailsModal(false)
      }
    } finally {
      setIsLoadingDealDetails(false)
    }
  }

  const handleDeleteProductFromDeal = async (productIndex: number) => {
    if (!selectedDealDetails || !selectedDealDetails.products) return
    
    if (!confirm('Are you sure you want to remove this product from the deal?')) {
      return
    }

    try {
      const consultantId = localStorage.getItem('consultant_id') || '1'
      const updatedProducts = selectedDealDetails.products.filter((_: any, index: number) => index !== productIndex)
      
      const response = await fetch(`/api/deals/${selectedDealDetails.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': consultantId,
        },
        body: JSON.stringify({
          products: updatedProducts,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update deal')
      }

      const data = await response.json()
      
      // Update local state
      setSelectedDealDetails(data.deal)
      
      // Refresh deals list
      await fetchClientDeals()
      
      alert('Product removed successfully!')
    } catch (error: any) {
      console.error('Error deleting product from deal:', error)
      alert(`Failed to remove product: ${error.message}`)
    }
  }

  const handleAddProductsToDeal = async () => {
    if (!selectedDealDetails || selectedProductsForDeal.length === 0) {
      alert('Please add at least one product')
      return
    }

    try {
      const consultantId = localStorage.getItem('consultant_id') || '1'
      const existingProducts = selectedDealDetails.products || []
      const updatedProducts = [...existingProducts, ...selectedProductsForDeal]
      
      const response = await fetch(`/api/deals/${selectedDealDetails.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': consultantId,
        },
        body: JSON.stringify({
          products: updatedProducts,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update deal')
      }

      const data = await response.json()
      
      // Update local state
      setSelectedDealDetails(data.deal)
      
      // Clear selection
      setSelectedProductsForDeal([])
      setShowAddProductInDeal(false)
      
      // Refresh deals list
      await fetchClientDeals()
      
      alert('Products added successfully!')
    } catch (error: any) {
      console.error('Error adding products to deal:', error)
      alert(`Failed to add products: ${error.message}`)
    }
  }

  const handleAddProductToDealSelection = (variant: ReturnType<typeof getProductVariants>[0]) => {
    // Initialize costing with product balance as suggested value
    const suggestedCosting = variant.requiresConsultantCharge ? 0 : variant.balance
    
    const dealProduct: Omit<DealProduct, 'totalCost' | 'totalPsgAmount' | 'totalSfecAmount' | 'totalBalanceWithSfec' | 'totalBalanceWithoutSfec' | 'totalCommissionWithSfec' | 'totalCommissionWithoutSfec' | 'totalTakeHomeCommissionWithSfec' | 'totalTakeHomeCommissionWithoutSfec'> = {
      productId: variant.id,
      productName: variant.displayName,
      category: variant.product.category,
      vendor: variant.product.vendor,
      quantity: 1,
      unitCost: variant.product.cost,
      unitPsgAmount: variant.product.psgAmount,
      unitSfecAmount: variant.isSfec ? variant.product.sfecAmount : 0,
      unitCommissionWithSfec: variant.isSfec ? variant.commission : 0,
      unitCommissionWithoutSfec: !variant.isSfec ? variant.commission : 0,
      consultantCharge: variant.requiresConsultantCharge ? undefined : undefined,
      costing: suggestedCosting,
    }
    
    const productWithTotals = calculateDealProductTotals(dealProduct)
    setSelectedProductsForDeal([...selectedProductsForDeal, productWithTotals])
  }

  const handleRemoveProductFromDealSelection = (productId: string) => {
    setSelectedProductsForDeal(selectedProductsForDeal.filter(p => p.productId !== productId))
  }

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
      return
    }

    try {
      const consultantId = localStorage.getItem('consultant_id') || '1'
      
      console.log('Deleting deal:', dealId, 'with consultant:', consultantId)
      
      // Use the same endpoint pattern as fetchClientDeals (/api/deals)
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': consultantId,
        },
      })

      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        const errorMessage = responseData?.error || `HTTP ${response.status}: Failed to delete deal`
        console.error('Delete failed:', errorMessage, responseData)
        throw new Error(errorMessage)
      }

      console.log('Deal deleted successfully:', responseData)

      // Optimistically update UI immediately
      setDeals(prev => prev.filter(d => d.id !== dealId))
      setKanbanDeals(prev => prev.filter(d => d.id !== dealId))
      
      // Close details modal if it's open for this deal
      if (showDealDetailsModal && selectedDealDetails?.id === dealId) {
        setShowDealDetailsModal(false)
        setSelectedDealDetails(null)
      }

      // Refresh deals list to ensure consistency
      await fetchClientDeals()
    } catch (error: any) {
      console.error('Error deleting deal:', error)
      alert(`Failed to delete deal: ${error.message}`)
    }
  }

  const handleAddLoanProduct = () => {
    if (!loanAmount || !loanChargePercentage || loanAmount <= 0 || loanChargePercentage <= 0) {
      alert('Please enter valid loan amount and percentage')
      return
    }

    const totalCharge = loanAmount * (loanChargePercentage / 100)
    const companyEarnings = totalCharge * 0.6 // 60%
    const consultantCommission = totalCharge * 0.4 // 40%

    const loanProduct: Omit<DealProduct, 'totalCost' | 'totalPsgAmount' | 'totalSfecAmount' | 'totalBalanceWithSfec' | 'totalBalanceWithoutSfec' | 'totalCommissionWithSfec' | 'totalCommissionWithoutSfec' | 'totalTakeHomeCommissionWithSfec' | 'totalTakeHomeCommissionWithoutSfec'> = {
      productId: `loan-${Date.now()}`,
      productName: `Loan - S$${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} @ ${loanChargePercentage}%`,
      category: 'Loan',
      quantity: 1,
      unitCost: totalCharge,
      unitPsgAmount: companyEarnings,
      unitSfecAmount: 0,
      unitCommissionWithSfec: consultantCommission,
      unitCommissionWithoutSfec: consultantCommission,
      costing: 0, // Loans start with 0 costing, user can modify
    }

    const productWithTotals = calculateDealProductTotals(loanProduct)
    setSelectedProducts([...selectedProducts, productWithTotals])
    
    // Close modal and reset
    setShowLoanModal(false)
    setLoanAmount(0)
    setLoanChargePercentage(0)
  }

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.productId !== productId))
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    const updatedProducts = selectedProducts.map(p => {
      if (p.productId === productId) {
        const updated = { ...p, quantity: Math.max(1, quantity) }
        return calculateDealProductTotals(updated)
      }
      return p
    })
    setSelectedProducts(updatedProducts)
  }

  const handleCreateDeal = async () => {
    if (!dealName.trim()) {
      alert('Please enter a deal name')
      return
    }

    if (selectedProducts.length === 0) {
      alert('Please add at least one product to the deal')
      return
    }

    // Validate MCPP products have consultant charge
    const mcppProducts = selectedProducts.filter(p => {
      const productIdWithoutSuffix = p.productId.replace(/-sfec$|-nosfec$/, '')
      const isMcpp = products.find(prod => prod.id === productIdWithoutSuffix && prod.requiresConsultantCharge)
      return isMcpp || p.productName === 'MCPP'
    })
    for (const mcpp of mcppProducts) {
      if (!mcpp.consultantCharge || mcpp.consultantCharge <= 0) {
        alert(`Please enter consultant charge for ${mcpp.productName}`)
        return
      }
      if (mcpp.consultantCharge < 2000) {
        alert(`Consultant charge for ${mcpp.productName} must be at least $2000`)
        return
      }
    }

    setIsCreatingDeal(true)
    try {
      const consultantId = localStorage.getItem('consultant_id') || '1'
      const dealData = {
        clientId: clientId,
        clientName: client?.name,
        name: dealName,
        description: dealDescription || undefined,
        products: selectedProducts.map(p => ({
          productId: p.productId,
          productName: p.productName,
          category: p.category,
          vendor: p.vendor,
          quantity: p.quantity,
          unitCost: p.unitCost,
          unitPsgAmount: p.unitPsgAmount,
          unitSfecAmount: p.unitSfecAmount,
          unitCommissionWithSfec: p.unitCommissionWithSfec,
          unitCommissionWithoutSfec: p.unitCommissionWithoutSfec,
          consultantCharge: p.consultantCharge,
          costing: p.costing || 0,
        })),
        status: 'draft' as const,
      }

      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': consultantId,
        },
        body: JSON.stringify(dealData),
      })

      if (!response.ok) {
        throw new Error('Failed to create deal')
      }

      // Reset form
      setShowProductSelection(false)
      setSelectedProducts([])
      setDealName('')
      setDealDescription('')
      
      // Refresh deals list
      await fetchClientDeals()
      
      alert('Deal created successfully!')
    } catch (error) {
      console.error('Error creating deal:', error)
      alert('Failed to create deal. Please try again.')
    } finally {
      setIsCreatingDeal(false)
    }
  }

  useEffect(() => {
    try {
      const token = localStorage.getItem('consultant_token')
      if (!token) {
        router.push('/crm')
        return
      }

      // Mock data - in production, fetch from API
      const mockClient: Client = {
        id: clientId,
        name: 'John Doe',
        type: 'personal',
        email: 'john.doe@example.com',
        phone: '+65 9123 4567',
        status: 'active',
        assignedDate: new Date('2023-06-15'),
        totalDeals: 2,
        totalLoanAmount: 125000,
        lastContact: new Date('2024-01-15'),
        tags: ['VIP', 'High Value'],
        address: '123 Orchard Road, Singapore 238888',
        notes: 'Client prefers morning meetings. Interested in property investment loans.'
      }

      const mockAppointments: Appointment[] = [
        {
          id: '1',
          title: 'Follow-up Consultation',
          date: new Date('2024-01-20'),
          time: '10:00 AM',
          type: 'follow-up',
          location: 'office',
          status: 'confirmed'
        },
        {
          id: '2',
          title: 'Loan Application Review',
          date: new Date('2024-01-25'),
          time: '2:00 PM',
          type: 'consultation',
          location: 'online',
          status: 'scheduled'
        }
      ]

      const mockDeals: Deal[] = [
        {
          id: '1',
          title: 'Personal Loan - Property Investment',
          type: 'personal',
          amount: 100000,
          status: 'approved',
          stage: 'close',
          clientId: clientId,
          date: new Date('2023-12-10')
        },
        {
          id: '2',
          title: 'Personal Loan - Home Renovation',
          type: 'personal',
          amount: 25000,
          status: 'pending',
          stage: 'apply',
          clientId: clientId,
          date: new Date('2024-01-15')
        }
      ]

      // Initialize document checklist based on client type
      const getRequiredDocuments = (clientType: 'personal' | 'business'): ClientDocument[] => {
        if (clientType === 'personal') {
          return [
          {
            id: '1',
            name: 'NRIC/Passport',
            description: 'Singapore NRIC or Passport (front and back)',
            category: 'identity',
            status: 'received',
            required: true,
            receivedDate: new Date('2024-01-10'),
            fileName: 'nric_front_back.pdf'
          },
          {
            id: '2',
            name: 'CPF Statement',
            description: 'Latest CPF statement (last 12 months)',
            category: 'income',
            status: 'pending',
            required: true
          },
          {
            id: '3',
            name: 'Payslip',
            description: 'Latest 3 months payslips',
            category: 'income',
            status: 'pending',
            required: true
          },
          {
            id: '4',
            name: 'Bank Statements',
            description: 'Latest 6 months bank statements',
            category: 'income',
            status: 'received',
            required: true,
            receivedDate: new Date('2024-01-12'),
            fileName: 'bank_statements.pdf'
          },
          {
            id: '5',
            name: 'Employment Letter',
            description: 'Employment confirmation letter',
            category: 'income',
            status: 'pending',
            required: true
          },
          {
            id: '6',
            name: 'Income Tax Notice of Assessment',
            description: 'Latest 2 years NOA from IRAS',
            category: 'income',
            status: 'pending',
            required: true
          }
        ]
        } else {
          // Business client documents
          return [
          {
            id: '1',
            name: 'ACRA Business Profile',
            description: 'Latest ACRA business profile extract',
            category: 'business',
            status: 'pending',
            required: true
          },
          {
            id: '2',
            name: 'Business UEN Certificate',
            description: 'Unique Entity Number certificate',
            category: 'business',
            status: 'pending',
            required: true
          },
          {
            id: '3',
            name: 'Bank Statements',
            description: 'Latest 12 months business bank statements',
            category: 'business',
            status: 'pending',
            required: true
          },
          {
            id: '4',
            name: 'Financial Statements',
            description: 'Latest 2 years audited/unaudited financial statements',
            category: 'business',
            status: 'pending',
            required: true
          },
          {
            id: '5',
            name: 'Income Tax Returns',
            description: 'Latest 2 years corporate tax returns',
            category: 'business',
            status: 'pending',
            required: true
          },
          {
            id: '6',
            name: 'Director NRIC/Passport',
            description: 'NRIC/Passport of all directors',
            category: 'identity',
            status: 'pending',
            required: true
          },
          {
            id: '7',
            name: 'GST Returns',
            description: 'Latest GST returns (if applicable)',
            category: 'business',
            status: 'pending',
            required: false
          },
          {
            id: '8',
            name: 'Property Documents',
            description: 'Property valuation or lease agreement (if applicable)',
            category: 'property',
            status: 'pending',
            required: false
          }
        ]
        }
      }

      const mockDocuments = getRequiredDocuments(mockClient.type)

      setClient(mockClient)
      setAppointments(mockAppointments)
      setDeals(mockDeals)
      setKanbanDeals(mockDeals)
      setDocuments(mockDocuments)
      setNotes(mockClient.notes || '')
      setIsLoading(false)
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading client data:', error)
      setIsLoading(false)
    }
  }, [clientId, router])

  // Fetch client deals
  const fetchClientDeals = async () => {
    try {
      const consultantId = localStorage.getItem('consultant_id') || '1'
      const response = await fetch(`/api/deals?clientId=${clientId}`, {
        headers: {
          'x-consultant-id': consultantId,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Transform deals to match the Deal interface
        const transformedDeals: Deal[] = (data.deals || []).map((deal: any) => ({
          id: deal.id,
          title: deal.name,
          type: 'personal' as const,
          amount: deal.totalBalanceWithSfec || deal.totalBalanceWithoutSfec || 0,
          totalCommissionWithSfec: deal.totalCommissionWithSfec || 0,
          totalCommissionWithoutSfec: deal.totalCommissionWithoutSfec || 0,
          totalTakeHomeCommissionWithSfec: deal.totalTakeHomeCommissionWithSfec || 0,
          totalTakeHomeCommissionWithoutSfec: deal.totalTakeHomeCommissionWithoutSfec || 0,
          products: deal.products || [],
          status: deal.status === 'draft' ? 'pending' : deal.status === 'closed' ? 'completed' : 'pending',
          stage: 'new' as const,
          date: new Date(deal.createdAt),
          clientId: deal.clientId,
        }))
        setDeals(transformedDeals)
        setKanbanDeals(transformedDeals)
      }
    } catch (error) {
      console.error('Error fetching deals:', error)
    }
  }

  useEffect(() => {
    if (clientId) {
      fetchClientDeals()
    }
  }, [clientId])

  // Sync kanban deals with deals list
  useEffect(() => {
    setKanbanDeals(deals)
  }, [deals])

  const handleWhatsApp = () => {
    const phoneNumber = client?.phone.replace(/[^0-9]/g, '')
    const message = encodeURIComponent(`Hello ${client?.name}, this is from Brilliance Advisory.`)
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  const handleCall = () => {
    window.location.href = `tel:${client?.phone}`
  }

  const handleSaveNotes = async () => {
    // In production, save to API
    setIsEditingNotes(false)
    // Update client notes
    if (client) {
      setClient({ ...client, notes })
    }
  }

  const handleDocumentStatusToggle = (documentId: string) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => {
        if (doc.id === documentId) {
          const newStatus = doc.status === 'pending' ? 'received' : 'pending'
          return {
            ...doc,
            status: newStatus,
            receivedDate: newStatus === 'received' ? new Date() : undefined
          }
        }
        return doc
      })
    )
  }

  const getDocumentStats = () => {
    const total = documents.length
    const received = documents.filter(d => d.status === 'received').length
    const pending = documents.filter(d => d.status === 'pending').length
    const required = documents.filter(d => d.required).length
    const requiredReceived = documents.filter(d => d.required && d.status === 'received').length
    return { total, received, pending, required, requiredReceived }
  }

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetStage: 'new' | 'appointment' | 'apply' | 'close' | 'rejected') => {
    e.preventDefault()
    const dealId = e.dataTransfer.getData('dealId')
    
    if (!dealId) return
    
    // Get the deal before updating to preserve previous stage
    const deal = kanbanDeals.find(d => d.id === dealId)
    const previousStage = deal?.stage
    
    // Update local state immediately (optimistic update)
    setKanbanDeals(prev => 
      prev.map(d => 
        d.id === dealId 
          ? { ...d, stage: targetStage }
          : d
      )
    )
    
    // Update deals list
    setDeals(prev =>
      prev.map(d =>
        d.id === dealId
          ? { ...d, stage: targetStage }
          : d
      )
    )
    
    // Sync with API (but don't revert on error if deal doesn't exist - it's mock data)
    try {
      const consultantId = localStorage.getItem('consultant_id')
      const response = await fetch(`/api/consultant/deals/${dealId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': consultantId || '',
        },
        body: JSON.stringify({ 
          stage: targetStage,
          status: targetStage === 'close' ? 'completed' : targetStage === 'rejected' ? 'rejected' : 'pending'
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Only log error, don't revert - deal might not exist in DB yet (mock data)
        console.warn('API update failed (deal may not exist in DB yet):', errorData)
      } else {
        console.log('Deal stage updated successfully via API')
      }
    } catch (error) {
      // Network errors or other issues - log but don't revert for mock data
      console.warn('Error updating deal stage via API (continuing with local state):', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading client details...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Client not found</p>
          <Link href="/consultant/clients">
            <Button variant="primary">Back to Clients</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/consultant/clients" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${client.type === 'personal' ? 'bg-primary/10' : 'bg-teal/10'}`}>
                  {client.type === 'personal' ? (
                    <User className="w-6 h-6 text-primary" />
                  ) : (
                    <Building2 className="w-6 h-6 text-teal" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{client.name}</h1>
                  <p className="text-sm text-gray-600 capitalize">{client.type} Client</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'notes', label: 'Notes', icon: FileText },
              { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
              { id: 'deals', label: 'Deals', icon: Briefcase },
              { id: 'pipeline', label: 'Pipeline', icon: FolderKanban },
              { id: 'documents', label: 'Documents', icon: FileCheck },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
            {/* Statistics Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 order-6 lg:order-none lg:col-start-3 lg:row-start-1">
              <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-6">
                {/* Total Deals */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-600">Total Deals</p>
                    <p className="text-lg font-bold text-gray-900">
                      {deals.filter(deal => deal.stage !== 'rejected').length}
                    </p>
                  </div>
                </div>

                {/* Pending Earnings Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Pending Earnings</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-600">Pending Commission</p>
                        <p className="text-lg font-bold text-yellow-600">
                          S${(() => {
                            const pendingDeals = deals.filter(deal => 
                              deal.stage !== 'rejected' && deal.stage !== 'close'
                            )
                            return pendingDeals.reduce((sum, deal) => {
                              const values = calculateDealStatsFromProducts(deal)
                              return sum + values.totalCommission
                            }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          })()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-600">Pending Take-Home</p>
                        <p className="text-lg font-bold text-yellow-600">
                          S${(() => {
                            const pendingDeals = deals.filter(deal => 
                              deal.stage !== 'rejected' && deal.stage !== 'close'
                            )
                            return pendingDeals.reduce((sum, deal) => {
                              const values = calculateDealStatsFromProducts(deal)
                              return sum + values.totalTakeHomeCommission
                            }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Earnings Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Earnings</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-600">Earned Commission</p>
                        <p className="text-lg font-bold text-green-600">
                          S${(() => {
                            const closedDeals = deals.filter(deal => deal.stage === 'close')
                            return closedDeals.reduce((sum, deal) => {
                              const values = calculateDealStatsFromProducts(deal)
                              return sum + values.totalCommission
                            }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          })()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-600">Earned Take-Home</p>
                        <p className="text-lg font-bold text-green-600">
                          S${(() => {
                            const closedDeals = deals.filter(deal => deal.stage === 'close')
                            return closedDeals.reduce((sum, deal) => {
                              const values = calculateDealStatsFromProducts(deal)
                              return sum + values.totalTakeHomeCommission
                            }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-700">Total (Pending + Earned)</p>
                    <p className="text-lg font-bold text-primary">
                      S${(() => {
                        const activeDeals = deals.filter(deal => deal.stage !== 'rejected')
                        return activeDeals.reduce((sum, deal) => {
                          const values = calculateDealStatsFromProducts(deal)
                          return sum + values.totalCommission
                        }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      })()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-700">Total Take-Home (Pending + Earned)</p>
                    <p className="text-lg font-bold text-primary">
                      S${(() => {
                        const activeDeals = deals.filter(deal => deal.stage !== 'rejected')
                        return activeDeals.reduce((sum, deal) => {
                          const values = calculateDealStatsFromProducts(deal)
                          return sum + values.totalTakeHomeCommission
                        }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 flex flex-col">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 order-0">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleWhatsApp}
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleCall}
                  >
                    <PhoneCall className="w-5 h-5" />
                    Call Now
                  </Button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 order-0">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href={`mailto:${client.email}`} className="text-gray-900 font-medium hover:text-primary">
                        {client.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a href={`tel:${client.phone}`} className="text-gray-900 font-medium hover:text-primary">
                        {client.phone}
                      </a>
                    </div>
                  </div>
                  {client.address && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="text-gray-900 font-medium">{client.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Notes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 order-3 md:order-none">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Client Notes</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setActiveTab('notes')}
                  >
                    <FileText className="w-4 h-4" />
                    {notes && notes.trim() ? 'Edit Notes' : 'Add Notes'}
                  </Button>
                </div>
                {notes && notes.trim() ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No notes added yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => setActiveTab('notes')}
                    >
                      Add Notes
                    </Button>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 order-6 lg:order-none">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Loan application approved</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CalendarIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Appointment scheduled</p>
                      <p className="text-xs text-gray-500">5 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MessageCircle className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Message sent</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 flex flex-col">
              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 order-4 lg:order-none">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Status</h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      client.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : client.status === 'prospect'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600">Assigned Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {client.assignedDate.toLocaleDateString()}
                    </p>
                  </div>
                  {client.lastContact && (
                    <div>
                      <p className="text-xs text-gray-600">Last Contact</p>
                      <p className="text-sm font-medium text-gray-900">
                        {client.lastContact.toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {client.tags && client.tags.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 order-7 lg:order-none">
                  <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {client.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Info (if applicable) */}
              {client.type === 'business' && client.businessUEN && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Business Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600">UEN</p>
                      <p className="text-sm font-medium text-gray-900">{client.businessUEN}</p>
                    </div>
                    {client.businessRegistrationDate && (
                      <div>
                        <p className="text-xs text-gray-600">Registration Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {client.businessRegistrationDate.toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Client Notes</h2>
              {!isEditingNotes ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingNotes(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Notes
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingNotes(false)
                      setNotes(client?.notes || '')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveNotes}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </div>
              )}
            </div>
            {isEditingNotes ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
                placeholder="Start typing your notes here... (Supports markdown-like formatting)"
              />
            ) : (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 min-h-[400px] p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {notes || 'No notes yet. Click "Edit Notes" to add notes about this client.'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
                <Button variant="primary" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Schedule Appointment
                </Button>
              </div>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{apt.title}</h3>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                apt.status === 'confirmed'
                                  ? 'bg-green-100 text-green-700'
                                  : apt.status === 'scheduled'
                                  ? 'bg-blue-100 text-blue-700'
                                  : apt.status === 'completed'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {apt.date.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {apt.time}
                            </div>
                            <div className="flex items-center gap-1">
                              {apt.location === 'online' ? (
                                <Video className="w-4 h-4" />
                              ) : apt.location === 'client-site' ? (
                                <MapPin className="w-4 h-4" />
                              ) : (
                                <CalendarIcon className="w-4 h-4" />
                              )}
                              <span className="capitalize">{apt.location.replace('-', ' ')}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming appointments</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deals Tab */}
        {activeTab === 'deals' && (
          <div className="space-y-6">
            {!showProductSelection ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Deals & Applications</h2>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => setShowProductSelection(true)}
                  >
                    <Plus className="w-4 h-4" />
                    New Deal
                  </Button>
                </div>
            {deals.length > 0 ? (
              <div className="space-y-4">
                {deals.map((deal) => {
                  const dealStats = calculateDealStatsFromProducts(deal)
                  return (
                    <div
                      key={deal.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{deal.title}</h3>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                deal.status === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : deal.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : deal.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {deal.status}
                            </span>
                          </div>
                          
                          {/* Commission and Take-Home Commission */}
                          <div className="flex items-center gap-6 mb-2">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-primary" />
                              <span className="text-sm text-gray-600">Commission:</span>
                              <span className="text-sm font-semibold text-primary">
                                S${dealStats.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-gray-600">Take-Home:</span>
                              <span className="text-sm font-semibold text-green-600">
                                S${dealStats.totalTakeHomeCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{deal.date.toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Products Overview */}
                          {deal.products && deal.products.length > 0 ? (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">Products:</p>
                              <div className="flex flex-wrap gap-2">
                                {deal.products.slice(0, 3).map((product: any, idx: number) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                                  >
                                    {product.productName}
                                    {product.quantity > 1 && ` (×${product.quantity})`}
                                  </span>
                                ))}
                                {deal.products.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                    +{deal.products.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 mt-2">No products added</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDealDetails(deal.id)}
                          >
                            View Details
                          </Button>
                          <button
                            onClick={() => handleDeleteDeal(deal.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Deal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No deals yet</p>
              </div>
            )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Create New Deal</h2>
                    <p className="text-sm text-gray-600 mt-1">Select products for {client?.name}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowProductSelection(false)
                      setSelectedProducts([])
                      setDealName('')
                      setDealDescription('')
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>

                {/* Deal Information */}
                <div className="mb-6 space-y-4">
                  <div>
                    <Input
                      label="Deal Name *"
                      type="text"
                      value={dealName}
                      onChange={(e) => setDealName(e.target.value)}
                      placeholder="e.g., Q1 2024 Grants Package"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      value={dealDescription}
                      onChange={(e) => setDealDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Add deal description or notes..."
                    />
                  </div>
                </div>

                {/* Product Selection */}
                <div className="space-y-6">
                  {/* Search and Filter */}
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="All">All Categories</option>
                      <option value="All Grants">All Grants</option>
                      <option value="PSG Grant">PSG Grant</option>
                      <option value="Manpower Grant">Manpower Grant</option>
                      <option value="Loan">Loan</option>
                    </select>
                  </div>

                  {/* Available Products */}
                  {isLoadingProducts ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading products...</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-semibold text-gray-900">Available Products</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowLoanModal(true)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Loan
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                        {getProductVariants()
                          .filter(variant => {
                            const matchesSearch = variant.displayName.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                                                 (variant.product.vendor && variant.product.vendor.toLowerCase().includes(productSearchQuery.toLowerCase()))
                            const matchesCategory = productCategoryFilter === 'All' 
                              || variant.product.category === productCategoryFilter
                              || (productCategoryFilter === 'All Grants' && (variant.product.category === 'PSG Grant' || variant.product.category === 'Manpower Grant'))
                            const isNotSelected = !selectedProducts.some(sp => sp.productId === variant.id)
                            return matchesSearch && matchesCategory && isNotSelected
                          })
                          .map((variant) => {
                            const getCategoryColor = (category: string) => {
                              const colors: Record<string, string> = {
                                'PSG Grant': 'bg-blue-100 text-blue-700',
                                'Manpower Grant': 'bg-green-100 text-green-700',
                                'Loan': 'bg-orange-100 text-orange-700',
                              }
                              return colors[category] || 'bg-gray-100 text-gray-700'
                            }

                            return (
                              <div
                                key={variant.id}
                                className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{variant.displayName}</h4>
                                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(variant.product.category)}`}>
                                      {variant.product.category}
                                    </span>
                                  </div>
                                </div>
                                {variant.product.vendor && (
                                  <p className="text-xs text-gray-600 mb-2">Vendor: {variant.product.vendor}</p>
                                )}
                                {variant.requiresConsultantCharge ? (
                                  <div className="space-y-1 mb-3 text-xs">
                                    <p className="text-gray-600">
                                      <span className="font-medium">Custom Pricing</span>
                                    </p>
                                    <p className="text-gray-600">
                                      Company Earnings: <span className="font-medium text-green-600">S$2,000 (fixed)</span>
                                    </p>
                                    <p className="text-gray-600">
                                      Consultant Commission: <span className="font-medium text-primary">Consultant Charge - $2,000</span>
                                    </p>
                                    <p className="text-xs text-blue-600 mt-2">
                                      You will enter consultant charge when adding to deal
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-1 mb-3 text-xs">
                                    <p className="text-gray-600">
                                      Cost: <span className="font-medium">S${variant.product.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </p>
                                    <p className="text-gray-600">
                                      Commission: <span className="font-medium">S${variant.commission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </p>
                                    <p className="text-gray-600">
                                      Balance: <span className="font-medium">S${variant.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </p>
                                  </div>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddProduct(variant)}
                                  className="w-full flex items-center justify-center gap-2"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add to Deal
                                </Button>
                              </div>
                            )
                          })}
                      </div>
                      {getProductVariants().filter(variant => {
                        const matchesSearch = variant.displayName.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                                             (variant.product.vendor && variant.product.vendor.toLowerCase().includes(productSearchQuery.toLowerCase()))
                        const matchesCategory = productCategoryFilter === 'All' 
                          || variant.product.category === productCategoryFilter
                          || (productCategoryFilter === 'All Grants' && (variant.product.category === 'PSG Grant' || variant.product.category === 'Manpower Grant'))
                        const isNotSelected = !selectedProducts.some(sp => sp.productId === variant.id)
                        return matchesSearch && matchesCategory && isNotSelected
                      }).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          {productSearchQuery || productCategoryFilter !== 'All' ? 'No products match your filters' : 'All products have been added'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected Products */}
                  {selectedProducts.length > 0 && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Selected Products</h3>
                      <div className="space-y-3">
                        {selectedProducts.map((product) => {
                          const getCategoryColor = (category: string) => {
                            const colors: Record<string, string> = {
                              'PSG Grant': 'bg-blue-100 text-blue-700',
                              'Manpower Grant': 'bg-green-100 text-green-700',
                              'Loan': 'bg-orange-100 text-orange-700',
                            }
                            return colors[category] || 'bg-gray-100 text-gray-700'
                          }

                          return (
                            <div
                              key={product.productId}
                              className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{product.productName}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(product.category)}`}>
                                      {product.category}
                                    </span>
                                    {product.vendor && (
                                      <span className="text-xs text-gray-600">• {product.vendor}</span>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveProduct(product.productId)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>

                              {/* Check if this is an MCPP product (requires consultant charge) */}
                              {(() => {
                                const productIdWithoutSuffix = product.productId.replace(/-sfec$|-nosfec$/, '')
                                const isMcpp = products.find(p => p.id === productIdWithoutSuffix && p.requiresConsultantCharge)
                                return isMcpp || product.productName === 'MCPP'
                              })() ? (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                                      <Input
                                        type="number"
                                        min="1"
                                        value={product.quantity}
                                        onChange={(e) => handleQuantityChange(product.productId, parseInt(e.target.value) || 1)}
                                        className="w-full"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Consultant Charge *</label>
                                      <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={product.consultantCharge || ''}
                                        onChange={(e) => handleConsultantChargeChange(product.productId, parseFloat(e.target.value) || 0)}
                                        placeholder="Enter amount"
                                        className="w-full"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Company Earnings</label>
                                      <p className="text-sm font-semibold text-green-600">
                                        S${(2000 * product.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">Fixed: $2000 per unit</p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Take-Home Commission</label>
                                    <p className="text-sm font-semibold text-primary">
                                      S${(() => {
                                        const values = getProductCommissionValues(product)
                                        return values.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                      })()}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {(product.consultantCharge || 0) > 0 ? `(${product.consultantCharge} - 2000) × ${product.quantity}` : 'Calculated'}
                                    </p>
                                  </div>
                                  {product.consultantCharge && product.consultantCharge > 0 && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                      <p className="text-xs text-blue-800">
                                        <strong>Calculation:</strong> Consultant Charge (S${product.consultantCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) 
                                        - Company Earnings (S$2,000) = Take-Home Commission (S${((product.consultantCharge - 2000) * product.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                                      <Input
                                        type="number"
                                        min="1"
                                        value={product.quantity}
                                        onChange={(e) => handleQuantityChange(product.productId, parseInt(e.target.value) || 1)}
                                        className="w-full"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Costing (S$) *</label>
                                      <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={product.costing || ''}
                                        onChange={(e) => handleCostingChange(product.productId, parseFloat(e.target.value) || 0)}
                                        placeholder="e.g., 1800 for iPhone"
                                        className="w-full"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Total Commission</label>
                                      <p className="text-sm font-semibold text-primary">
                                        S${(() => {
                                          const values = getProductCommissionValues(product)
                                          return values.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        })()}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Take-Home Commission</label>
                                      <p className="text-sm font-semibold text-green-600">
                                        S${(() => {
                                          const values = getProductCommissionValues(product)
                                          return values.totalTakeHomeCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        })()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-600">
                                      <strong>Calculation:</strong> Commission (S${(() => {
                                        const values = getProductCommissionValues(product)
                                        return values.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                      })()}) 
                                      - Costing (S${((product.costing || 0) * product.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) 
                                      = Take-Home (S${(() => {
                                        const values = getProductCommissionValues(product)
                                        return values.totalTakeHomeCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                      })()})
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Totals Summary */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Total Products:</span>
                          <span className="text-sm font-semibold text-gray-900">{selectedProducts.length}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Total Items:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {selectedProducts.reduce((sum, p) => sum + p.quantity, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                          <span className="text-sm font-medium text-gray-700">Total Commission:</span>
                          <span className="text-lg font-bold text-primary">
                            S${selectedProducts.reduce((sum, p) => {
                              const values = getProductCommissionValues(p)
                              return sum + values.totalCommission
                            }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                          <span className="text-sm font-medium text-gray-700">Total Take-Home Commission:</span>
                          <span className="text-lg font-bold text-green-600">
                            S${selectedProducts.reduce((sum, p) => {
                              const values = getProductCommissionValues(p)
                              return sum + values.totalTakeHomeCommission
                            }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {/* Create Deal Button */}
                      <div className="mt-6 flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowProductSelection(false)
                            setSelectedProducts([])
                            setDealName('')
                            setDealDescription('')
                          }}
                          disabled={isCreatingDeal}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleCreateDeal}
                          disabled={isCreatingDeal || !dealName.trim() || selectedProducts.length === 0}
                          className="flex items-center gap-2"
                        >
                          {isCreatingDeal ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Creating...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Create Deal
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Loan Input Modal */}
            <Modal
              isOpen={showLoanModal}
              onClose={() => {
                setShowLoanModal(false)
                setLoanAmount(0)
                setLoanChargePercentage(0)
              }}
              title="Add Loan Product"
              size="md"
            >
              <div className="space-y-4">
                <div>
                  <Input
                    label="Loan Amount (S$)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={loanAmount || ''}
                    onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                    placeholder="Enter loan amount"
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Charge Percentage (%)"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={loanChargePercentage || ''}
                    onChange={(e) => setLoanChargePercentage(parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 5 for 5%"
                    required
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-gray-700">Calculation Preview:</p>
                  {loanAmount > 0 && loanChargePercentage > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Charge:</span>
                        <span className="font-semibold">S${(loanAmount * loanChargePercentage / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Company Earnings (60%):</span>
                        <span className="font-semibold text-green-600">S${(loanAmount * loanChargePercentage / 100 * 0.6).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Consultant Commission (40%):</span>
                        <span className="font-semibold text-primary">S${(loanAmount * loanChargePercentage / 100 * 0.4).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowLoanModal(false)
                      setLoanAmount(0)
                      setLoanChargePercentage(0)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAddLoanProduct}
                    disabled={!loanAmount || !loanChargePercentage || loanAmount <= 0 || loanChargePercentage <= 0}
                  >
                    Add Loan to Deal
                  </Button>
                </div>
              </div>
            </Modal>

            {/* Deal Details Modal */}
            <Modal
              isOpen={showDealDetailsModal}
              onClose={() => {
                setShowDealDetailsModal(false)
                setSelectedDealDetails(null)
              }}
              title="Deal Details"
              size="lg"
            >
              {isLoadingDealDetails ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading deal details...</p>
                </div>
              ) : selectedDealDetails ? (
                <div className="space-y-6">
                  {/* Deal Basic Info */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{selectedDealDetails.name || selectedDealDetails.title}</h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded ${
                          selectedDealDetails.status === 'approved' || selectedDealDetails.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : selectedDealDetails.status === 'pending' || selectedDealDetails.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-700'
                            : selectedDealDetails.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {selectedDealDetails.status || 'pending'}
                      </span>
                    </div>
                    {selectedDealDetails.stage && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Stage:</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">{selectedDealDetails.stage}</span>
                      </div>
                    )}
                    {selectedDealDetails.createdAt && (
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Created: {new Date(selectedDealDetails.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {selectedDealDetails.description && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{selectedDealDetails.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Financial Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                      <p className="text-xl font-bold text-gray-900">
                        S${(() => {
                          if (!selectedDealDetails.products || selectedDealDetails.products.length === 0) {
                            return (selectedDealDetails.totalBalanceWithSfec || selectedDealDetails.totalBalanceWithoutSfec || selectedDealDetails.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          }
                          // Sum all product balances
                          return selectedDealDetails.products.reduce((sum: number, product: any) => {
                            // Use the balance from the product that matches the commission variant used
                            const balance = product.totalBalanceWithSfec > 0 ? product.totalBalanceWithSfec : product.totalBalanceWithoutSfec
                            return sum + (balance || 0)
                          }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        })()}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Commission</p>
                      <p className="text-xl font-bold text-primary">
                        S${(() => {
                          if (!selectedDealDetails.products || selectedDealDetails.products.length === 0) {
                            const dealValues = getDealCommissionValues({
                              id: selectedDealDetails.id,
                              totalCommissionWithSfec: selectedDealDetails.totalCommissionWithSfec,
                              totalCommissionWithoutSfec: selectedDealDetails.totalCommissionWithoutSfec,
                            } as Deal)
                            return dealValues.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          }
                          // Sum all product commissions (handles mixed SFEC/No-SFEC correctly)
                          return selectedDealDetails.products.reduce((sum: number, product: any) => {
                            const productValues = getProductCommissionValues(product as DealProduct)
                            return sum + productValues.totalCommission
                          }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        })()}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Take-Home Commission</p>
                      <p className="text-xl font-bold text-green-600">
                        S${(() => {
                          if (!selectedDealDetails.products || selectedDealDetails.products.length === 0) {
                            const dealValues = getDealCommissionValues({
                              id: selectedDealDetails.id,
                              totalTakeHomeCommissionWithSfec: selectedDealDetails.totalTakeHomeCommissionWithSfec,
                              totalTakeHomeCommissionWithoutSfec: selectedDealDetails.totalTakeHomeCommissionWithoutSfec,
                            } as Deal)
                            return dealValues.totalTakeHomeCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          }
                          // Sum all product take-home commissions (handles mixed SFEC/No-SFEC correctly)
                          return selectedDealDetails.products.reduce((sum: number, product: any) => {
                            const productValues = getProductCommissionValues(product as DealProduct)
                            return sum + productValues.totalTakeHomeCommission
                          }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Products List */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-md font-semibold text-gray-900">Products</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddProductInDeal(true)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Product
                      </Button>
                    </div>
                    {selectedDealDetails.products && selectedDealDetails.products.length > 0 ? (
                      <div className="space-y-3">
                        {selectedDealDetails.products.map((product: any, index: number) => {
                          const productValues = getProductCommissionValues(product as DealProduct)
                          return (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-900">{product.productName}</h5>
                                  {product.category && (
                                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">
                                      {product.category}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {product.quantity && (
                                    <span className="text-sm text-gray-600">Qty: {product.quantity}</span>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteProductFromDeal(index)}
                                    className="text-destructive hover:text-destructive h-8 w-8"
                                    title="Remove product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                                {product.unitCost && (
                                  <div>
                                    <span className="text-gray-600">Unit Cost: </span>
                                    <span className="font-medium">S${product.unitCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  </div>
                                )}
                                {product.costing !== undefined && (
                                  <div>
                                    <span className="text-gray-600">Costing: </span>
                                    <span className="font-medium">S${((product.costing || 0) * (product.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-600">Commission: </span>
                                  <span className="font-medium text-primary">S${productValues.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Net (Take-Home): </span>
                                  <span className="font-medium text-green-600">S${productValues.totalTakeHomeCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm border border-gray-200 rounded-lg">
                        No products in this deal. Click "Add Product" to add products.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No deal details available</p>
                </div>
              )}
            </Modal>

            {/* Add Products to Deal Modal */}
            <Modal
              isOpen={showAddProductInDeal}
              onClose={() => {
                setShowAddProductInDeal(false)
                setSelectedProductsForDeal([])
              }}
              title="Add Products to Deal"
              size="lg"
            >
              <div className="space-y-6">
                {/* Product Selection */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="All">All Categories</option>
                      <option value="PSG Grant">PSG Grant</option>
                      <option value="Manpower Grant">Manpower Grant</option>
                      <option value="All Grants">All Grants</option>
                    </select>
                  </div>

                  {/* Available Products */}
                  {isLoadingProducts ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading products...</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {getProductVariants()
                        .filter(variant => {
                          const matchesSearch = variant.displayName.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                                               (variant.product.vendor && variant.product.vendor.toLowerCase().includes(productSearchQuery.toLowerCase()))
                          const matchesCategory = productCategoryFilter === 'All' 
                            || variant.product.category === productCategoryFilter
                            || (productCategoryFilter === 'All Grants' && (variant.product.category === 'PSG Grant' || variant.product.category === 'Manpower Grant'))
                          const isNotSelected = !selectedProductsForDeal.some(sp => sp.productId === variant.id)
                          return matchesSearch && matchesCategory && isNotSelected
                        })
                        .map((variant) => (
                          <div
                            key={variant.id}
                            className="p-3 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm">{variant.displayName}</h4>
                                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">
                                  {variant.product.category}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddProductToDealSelection(variant)}
                                className="flex items-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Add
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Selected Products for Deal */}
                  {selectedProductsForDeal.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Selected Products ({selectedProductsForDeal.length})</h4>
                      <div className="space-y-2">
                        {selectedProductsForDeal.map((product) => (
                          <div key={product.productId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-900">{product.productName}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveProductFromDealSelection(product.productId)}
                              className="text-destructive hover:text-destructive h-6 w-6 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          onClick={handleAddProductsToDeal}
                          className="flex-1"
                          disabled={selectedProductsForDeal.length === 0}
                        >
                          Add {selectedProductsForDeal.length} Product{selectedProductsForDeal.length !== 1 ? 's' : ''} to Deal
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAddProductInDeal(false)
                            setSelectedProductsForDeal([])
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Modal>
          </div>
        )}

        {/* Pipeline Tab - Kanban Board */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Sales Pipeline</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Track and move deals through the sales process for {client?.name}
                </p>
              </div>
              <Button variant="primary" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Deal
              </Button>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
              {/* New Column */}
              <div
                className="bg-gray-50 rounded-lg p-4 min-w-[200px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'new')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">New</h3>
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                    {kanbanDeals.filter(d => d.stage === 'new').length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {kanbanDeals
                    .filter(d => d.stage === 'new')
                    .map(deal => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">{deal.title}</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">${deal.amount.toLocaleString()}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            deal.type === 'business' ? 'bg-teal-100 text-teal-700' : 'bg-primary/10 text-primary'
                          }`}>
                            {deal.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{deal.date.toLocaleDateString()}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Appointment Column */}
              <div
                className="bg-blue-50 rounded-lg p-4 min-w-[200px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'appointment')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Appointment</h3>
                  <span className="px-2 py-1 bg-blue-200 text-blue-700 text-xs font-medium rounded-full">
                    {kanbanDeals.filter(d => d.stage === 'appointment').length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {kanbanDeals
                    .filter(d => d.stage === 'appointment')
                    .map(deal => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">{deal.title}</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">${deal.amount.toLocaleString()}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            deal.type === 'business' ? 'bg-teal-100 text-teal-700' : 'bg-primary/10 text-primary'
                          }`}>
                            {deal.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{deal.date.toLocaleDateString()}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Apply Column */}
              <div
                className="bg-yellow-50 rounded-lg p-4 min-w-[200px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'apply')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Apply</h3>
                  <span className="px-2 py-1 bg-yellow-200 text-yellow-700 text-xs font-medium rounded-full">
                    {kanbanDeals.filter(d => d.stage === 'apply').length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {kanbanDeals
                    .filter(d => d.stage === 'apply')
                    .map(deal => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">{deal.title}</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">${deal.amount.toLocaleString()}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            deal.type === 'business' ? 'bg-teal-100 text-teal-700' : 'bg-primary/10 text-primary'
                          }`}>
                            {deal.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{deal.date.toLocaleDateString()}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Close Column */}
              <div
                className="bg-green-50 rounded-lg p-4 min-w-[200px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'close')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Close</h3>
                  <span className="px-2 py-1 bg-green-200 text-green-700 text-xs font-medium rounded-full">
                    {kanbanDeals.filter(d => d.stage === 'close').length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {kanbanDeals
                    .filter(d => d.stage === 'close')
                    .map(deal => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">{deal.title}</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">${deal.amount.toLocaleString()}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            deal.type === 'business' ? 'bg-teal-100 text-teal-700' : 'bg-primary/10 text-primary'
                          }`}>
                            {deal.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{deal.date.toLocaleDateString()}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Rejected Column */}
              <div
                className="bg-red-50 rounded-lg p-4 min-w-[200px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'rejected')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Rejected</h3>
                  <span className="px-2 py-1 bg-red-200 text-red-700 text-xs font-medium rounded-full">
                    {kanbanDeals.filter(d => d.stage === 'rejected').length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {kanbanDeals
                    .filter(d => d.stage === 'rejected')
                    .map(deal => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">{deal.title}</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">${deal.amount.toLocaleString()}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            deal.type === 'business' ? 'bg-teal-100 text-teal-700' : 'bg-primary/10 text-primary'
                          }`}>
                            {deal.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{deal.date.toLocaleDateString()}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {kanbanDeals.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <FolderKanban className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No deals in pipeline yet</p>
                <Button variant="primary" size="sm" className="mt-4 flex items-center gap-2 mx-auto">
                  <Plus className="w-4 h-4" />
                  Create First Deal
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            {(() => {
              const stats = getDocumentStats()
              return (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Documents</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600 mb-1">Received</p>
                    <p className="text-2xl font-bold text-green-600">{stats.received}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600 mb-1">Required Progress</p>
                    <p className="text-2xl font-bold text-primary">
                      {stats.requiredReceived}/{stats.required}
                    </p>
                  </div>
                </div>
              )
            })()}

            {/* Document Checklist */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Document Checklist</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Track required documents for {client?.name}
                  </p>
                </div>
                <Button variant="primary" size="sm" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </Button>
              </div>

              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No documents required yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Group documents by category */}
                  {['identity', 'income', 'business', 'property', 'other'].map((category) => {
                    const categoryDocs = documents.filter(d => d.category === category)
                    if (categoryDocs.length === 0) return null

                    const categoryLabels: Record<string, string> = {
                      identity: 'Identity Documents',
                      income: 'Income & Employment',
                      business: 'Business Documents',
                      property: 'Property Documents',
                      other: 'Other Documents'
                    }

                    return (
                      <div key={category} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                          {categoryLabels[category]}
                        </h3>
                        <div className="space-y-2">
                          {categoryDocs.map((doc) => (
                            <div
                              key={doc.id}
                              className={`flex items-start justify-between p-3 rounded-lg border transition-colors ${
                                doc.status === 'received'
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <button
                                  onClick={() => handleDocumentStatusToggle(doc.id)}
                                  className={`mt-0.5 transition-colors ${
                                    doc.status === 'received'
                                      ? 'text-green-600 hover:text-green-700'
                                      : 'text-gray-400 hover:text-gray-600'
                                  }`}
                                  title={doc.status === 'pending' ? 'Mark as received' : 'Mark as pending'}
                                >
                                  {doc.status === 'received' ? (
                                    <CheckCircle className="w-5 h-5" />
                                  ) : (
                                    <Circle className="w-5 h-5" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className={`font-medium ${
                                      doc.status === 'received' ? 'text-green-900' : 'text-gray-900'
                                    }`}>
                                      {doc.name}
                                    </h4>
                                    {doc.required && (
                                      <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded">
                                        Required
                                      </span>
                                    )}
                                  </div>
                                  {doc.description && (
                                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                                  )}
                                  {doc.status === 'received' && doc.receivedDate && (
                                    <p className="text-xs text-green-700 mt-1">
                                      Received: {doc.receivedDate.toLocaleDateString()}
                                    </p>
                                  )}
                                  {doc.fileName && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <FileIcon className="w-4 h-4 text-gray-400" />
                                      <span className="text-xs text-gray-600">{doc.fileName}</span>
                                      {doc.fileUrl && (
                                        <a
                                          href={doc.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-primary hover:underline flex items-center gap-1"
                                        >
                                          <Download className="w-3 h-3" />
                                          Download
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded ${
                                    doc.status === 'received'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-orange-100 text-orange-700'
                                  }`}
                                >
                                  {doc.status === 'received' ? 'Received' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Progress Summary */}
            {(() => {
              const stats = getDocumentStats()
              const completionPercentage = stats.required > 0 
                ? Math.round((stats.requiredReceived / stats.required) * 100) 
                : 0
              
              return (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklist Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Required Documents: {stats.requiredReceived} / {stats.required}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            completionPercentage === 100 ? 'bg-green-500' : 'bg-primary'
                          }`}
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>
                    {completionPercentage === 100 && (
                      <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">All required documents received!</span>
                      </div>
                    )}
                    {stats.pending > 0 && (
                      <p className="text-sm text-gray-600">
                        {stats.pending} document{stats.pending !== 1 ? 's' : ''} still pending
                      </p>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </main>
    </div>
  )
}
