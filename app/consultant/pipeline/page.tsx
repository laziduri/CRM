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
  X
} from 'lucide-react'
import Button from '@/components/ui/Button'

interface Deal {
  id: string
  clientId: string
  clientName: string
  clientType: 'personal' | 'business'
  loanType: string
  loanAmount: number
  status: 'new' | 'in-progress' | 'under-review' | 'approved' | 'closed' | 'rejected'
  priority: 'high' | 'medium' | 'low'
  estimatedCommission: number
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
  notes?: string
}

const columns = [
  { id: 'new', title: 'New', color: 'bg-gray-100', textColor: 'text-gray-700' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100', textColor: 'text-blue-700' },
  { id: 'under-review', title: 'Under Review', color: 'bg-yellow-100', textColor: 'text-yellow-700' },
  { id: 'approved', title: 'Approved', color: 'bg-purple-100', textColor: 'text-purple-700' },
  { id: 'closed', title: 'Closed', color: 'bg-green-100', textColor: 'text-green-700' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-100', textColor: 'text-red-700' },
]

export default function PipelinePage() {
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'personal' | 'business'>('all')

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
        status: 'in-progress',
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
        status: 'under-review',
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
        status: 'approved',
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
        status: 'closed',
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

  const handleDragStart = (dealId: string) => {
    setDraggedDeal(dealId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: Deal['status']) => {
    if (!draggedDeal) return

    setDeals(prev =>
      prev.map(deal =>
        deal.id === draggedDeal
          ? { ...deal, status, updatedAt: new Date() }
          : deal
      )
    )
    setDraggedDeal(null)
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
      case 'in-progress':
        return <Clock className="w-4 h-4" />
      case 'under-review':
        return <AlertCircle className="w-4 h-4" />
      case 'approved':
        return <CheckCircle2 className="w-4 h-4" />
      case 'closed':
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
                className="flex-shrink-0 w-80"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id as Deal['status'])}
              >
                <div className={`${column.color} ${column.textColor} rounded-t-lg p-4 mb-2`}>
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
                <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {columnDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => handleDragStart(deal.id)}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-move"
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
