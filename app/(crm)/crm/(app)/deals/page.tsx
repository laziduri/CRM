'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import DealList from '@/components/deals/DealList'
import type { Deal } from '@/lib/deals/types'

export default function DealsPage() {
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  // Fetch deals
  const fetchDeals = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'All') params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/deals?${params.toString()}`, {
        headers: {
          'x-consultant-id': '1',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch deals')
      }

      const data = await response.json()
      setDeals(data.deals || [])
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, searchQuery])

  useEffect(() => {
    fetchDeals()
  }, [fetchDeals])

  const handleDelete = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) {
      return
    }

    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'DELETE',
        headers: {
          'x-consultant-id': '1',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete deal')
      }

      await fetchDeals()
    } catch (error) {
      console.error('Error deleting deal:', error)
      alert('Failed to delete deal')
    }
  }

  const handleView = (deal: Deal) => {
    router.push(`/crm/deals/${deal.id}`)
  }

  const handleEdit = (deal: Deal) => {
    router.push(`/crm/deals/${deal.id}/edit`)
  }

  // Calculate stats
  const totalDeals = deals.length
  const draftDeals = deals.filter(d => d.status === 'draft').length
  const sentDeals = deals.filter(d => d.status === 'sent').length
  const totalCommission = deals.reduce((sum, d) => sum + d.totalCommissionWithSfec, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Deals & Quotes</h1>
              <p className="text-sm text-gray-600">Manage your deals and quotes</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => router.push('/crm/deals/new')}
            >
              <Plus className="w-4 h-4" />
              Create New Deal
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Deals</p>
            <p className="text-2xl font-bold text-gray-900">{totalDeals}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Drafts</p>
            <p className="text-2xl font-bold text-gray-600">{draftDeals}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Sent</p>
            <p className="text-2xl font-bold text-blue-600">{sentDeals}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Commission</p>
            <p className="text-2xl font-bold text-primary">
              S${totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search deals by name, client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="All">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Deals List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading deals...</p>
          </div>
        ) : (
          <DealList
            deals={deals}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </main>
    </div>
  )
}
