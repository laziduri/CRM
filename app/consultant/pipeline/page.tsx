'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreVertical,
  User,
  Building2,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getSuggestedNextStage, getAutoFillExplanation } from '@/lib/crm-autofill'
import { Sparkles, CheckCircle2 as CheckCircle } from 'lucide-react'

interface Deal {
  id: string
  clientId: string
  clientName: string
  clientType: 'personal' | 'business'
  loanType: string
  loanAmount: number
  status: 'new' | 'appointment' | 'apply' | 'close' | 'rejected'
  priority: 'high' | 'medium' | 'low'
  estimatedCommission: number
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
  notes?: string
}

const columns = [
  { id: 'new', title: 'New', color: 'bg-gray-100', textColor: 'text-gray-700' },
  { id: 'appointment', title: 'Appointment', color: 'bg-blue-100', textColor: 'text-blue-700' },
  { id: 'apply', title: 'Apply', color: 'bg-yellow-100', textColor: 'text-yellow-700' },
  { id: 'close', title: 'Close', color: 'bg-green-100', textColor: 'text-green-700' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-100', textColor: 'text-red-700' },
]

export default function PipelinePage() {
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'personal' | 'business'>('all')
  const [suggestedStage, setSuggestedStage] = useState<string | null>(null)
  const [draggingToStage, setDraggingToStage] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    // Mock data - in production, fetch from API
    const mockDeals: Deal[] = [
      {
        id: '1',
        clientId: '1',
        clientName: 'John Doe',
        clientType: 'personal',
        loanType: 'Personal Loan',
        loanAmount: 50000,
        status: 'new',
        priority: 'high',
        estimatedCommission: 2500,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        dueDate: new Date('2024-01-30'),
      },
      {
        id: '2',
        clientId: '2',
        clientName: 'ABC Trading Pte Ltd',
        clientType: 'business',
        loanType: 'Business Loan',
        loanAmount: 150000,
        status: 'appointment',
        priority: 'high',
        estimatedCommission: 7500,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-16'),
        dueDate: new Date('2024-02-01'),
      },
      {
        id: '3',
        clientId: '3',
        clientName: 'Jane Smith',
        clientType: 'personal',
        loanType: 'Personal Loan',
        loanAmount: 30000,
        status: 'apply',
        priority: 'medium',
        estimatedCommission: 1500,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '4',
        clientId: '4',
        clientName: 'XYZ Services Ltd',
        clientType: 'business',
        loanType: 'Business Loan',
        loanAmount: 200000,
        status: 'apply',
        priority: 'high',
        estimatedCommission: 10000,
        createdAt: new Date('2023-12-20'),
        updatedAt: new Date('2024-01-14'),
      },
      {
        id: '5',
        clientId: '5',
        clientName: 'Robert Chen',
        clientType: 'personal',
        loanType: 'Personal Loan',
        loanAmount: 75000,
        status: 'close',
        priority: 'high',
        estimatedCommission: 3750,
        createdAt: new Date('2023-11-15'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: '6',
        clientId: '6',
        clientName: 'DEF Manufacturing Pte Ltd',
        clientType: 'business',
        loanType: 'Business Loan',
        loanAmount: 100000,
        status: 'rejected',
        priority: 'medium',
        estimatedCommission: 5000,
        createdAt: new Date('2023-12-01'),
        updatedAt: new Date('2024-01-08'),
      },
    ]
    setDeals(mockDeals)
  }, [router])

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId)
    e.dataTransfer.effectAllowed = 'move'
    setDraggedDeal(dealId)
  }

  const handleDragEnd = () => {
    setDraggedDeal(null)
    setDraggingToStage(null)
    setSuggestedStage(null)
  }

  const handleDragOver = (e: React.DragEvent, status?: Deal['status']) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    
    // Show AI suggestion when hovering over a stage
    if (status && draggedDeal) {
      setDraggingToStage(status)
      const deal = deals.find(d => d.id === draggedDeal)
      if (deal) {
        const suggested = getSuggestedNextStage({
          currentStage: deal.status,
          dealAmount: deal.loanAmount,
          clientType: deal.clientType,
          daysInCurrentStage: Math.floor(
            (new Date().getTime() - deal.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
          ),
          hasRequiredDocuments: deal.status !== 'new', // Mock: assume documents ready if not new
        })
        
        // Show suggestion if dragging to suggested stage
        if (suggested === status) {
          setSuggestedStage(status)
        } else {
          setSuggestedStage(null)
        }
      }
    }
  }

  const handleDragLeave = () => {
    setDraggingToStage(null)
    setSuggestedStage(null)
  }

  const handleDrop = async (e: React.DragEvent, status: Deal['status']) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Get dealId from both dataTransfer and state (for reliability)
    const dealIdFromTransfer = e.dataTransfer.getData('dealId')
    const dealId = dealIdFromTransfer || draggedDeal
    
    if (!dealId) {
      console.warn('No deal ID found in drop event')
      return
    }

    // Get the deal being moved
    const deal = deals.find(d => d.id === dealId)
    
    // Check if AI suggests this stage
    let aiSuggestion: string | null = null
    if (deal) {
      const suggested = getSuggestedNextStage({
        currentStage: deal.status,
        dealAmount: deal.loanAmount,
        clientType: deal.clientType,
        daysInCurrentStage: Math.floor(
          (new Date().getTime() - deal.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
        ),
        hasRequiredDocuments: deal.status !== 'new',
      })
      aiSuggestion = suggested
    }

    // Update deal locally first (optimistic update)
    const previousStatus = deal?.status
    setDeals(prev =>
      prev.map(d =>
        d.id === dealId
          ? { ...d, status, updatedAt: new Date() }
          : d
      )
    )
    
    // Update deal via API (but don't revert on error if deal doesn't exist - it's mock data)
    try {
      const consultantId = localStorage.getItem('consultant_id')
      const response = await fetch(`/api/consultant/deals/${dealId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': consultantId || '',
        },
        body: JSON.stringify({ status, updatedAt: new Date() }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Only log error, don't revert - deal might not exist in DB yet (mock data)
        console.warn('API update failed (deal may not exist in DB yet):', errorData)
      } else {
        console.log('Deal updated successfully via API')
      }
    } catch (error) {
      // Network errors or other issues - log but don't revert for mock data
      console.warn('Error updating deal via API (continuing with local state):', error)
    }
    
    // Show confirmation if AI suggested this
    if (aiSuggestion === status) {
      // You could show a toast notification here
      console.log('AI suggestion followed!', { from: deal?.status, to: status })
    }
    
    setDraggedDeal(null)
    setDraggingToStage(null)
    setSuggestedStage(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: Deal['status']) => {
    switch (status) {
      case 'new':
        return <Plus className="w-4 h-4" />
      case 'appointment':
        return <Calendar className="w-4 h-4" />
      case 'apply':
        return <FileText className="w-4 h-4" />
      case 'close':
        return <CheckCircle2 className="w-4 h-4" />
      case 'rejected':
        return <X className="w-4 h-4" />
      default:
        return null
    }
  }

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.loanType.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || deal.clientType === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getDealsByStatus = (status: Deal['status']) => {
    return filteredDeals.filter(deal => deal.status === status)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/consultant/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Deal Pipeline</h1>
                <p className="text-sm text-gray-600">Manage your loan applications</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="primary" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Deal
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedFilter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
            >
              All
            </Button>
            <Button
              variant={selectedFilter === 'personal' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedFilter('personal')}
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Personal
            </Button>
            <Button
              variant={selectedFilter === 'business' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedFilter('business')}
              className="flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Business
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => {
            const columnDeals = getDealsByStatus(column.id as Deal['status'])
            const totalValue = columnDeals.reduce((sum, deal) => sum + deal.loanAmount, 0)
            const totalCommission = columnDeals.reduce((sum, deal) => sum + deal.estimatedCommission, 0)

            return (
              <div
                key={column.id}
                className={`flex-shrink-0 w-80 transition-all ${
                  draggingToStage === column.id ? 'ring-2 ring-primary ring-opacity-50' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, column.id as Deal['status'])}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id as Deal['status'])}
              >
                <div className={`${column.color} ${column.textColor} rounded-t-lg p-4 mb-2 relative`}>
                  {draggingToStage === column.id && suggestedStage === column.id && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      AI Suggested
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{column.title}</h3>
                    <span className="px-2 py-1 bg-white/50 rounded-full text-xs font-medium">
                      {columnDeals.length}
                    </span>
                  </div>
                  {columnDeals.length > 0 && (
                    <div className="text-xs space-y-1">
                      <p>Total: ${totalValue.toLocaleString()}</p>
                      <p>Commission: ${totalCommission.toLocaleString()}</p>
                    </div>
                  )}
                </div>
                <div 
                  className={`space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto rounded-b-lg transition-all ${
                    draggingToStage === column.id ? 'bg-blue-50/50 min-h-[200px]' : ''
                  }`}
                >
                  {columnDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-move ${
                        draggedDeal === deal.id ? 'opacity-50 scale-95' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {deal.clientType === 'personal' ? (
                            <User className="w-4 h-4 text-primary" />
                          ) : (
                            <Building2 className="w-4 h-4 text-teal" />
                          )}
                          <Link
                            href={`/consultant/clients/${deal.clientId}`}
                            className="font-semibold text-gray-900 hover:text-primary"
                            draggable={false}
                            onClick={(e) => {
                              if (draggedDeal) {
                                e.preventDefault()
                              }
                            }}
                          >
                            {deal.clientName}
                          </Link>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(deal.priority)}`}>
                          {deal.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{deal.loanType}</p>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs text-gray-500">Loan Amount</p>
                          <p className="font-semibold text-gray-900">${deal.loanAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Commission</p>
                          <p className="font-semibold text-green-600">${deal.estimatedCommission.toLocaleString()}</p>
                        </div>
                      </div>
                      {deal.dueDate && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 pt-2 border-t">
                          <Calendar className="w-3 h-3" />
                          <span>Due: {deal.dueDate.toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Updated {deal.updatedAt.toLocaleDateString()}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {columnDeals.length === 0 && (
                    <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                      <p className="text-sm text-gray-500">No deals in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
