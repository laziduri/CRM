'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import DealTotals from '@/components/deals/DealTotals'
import type { Deal } from '@/lib/deals/types'
import { ROUTES } from '@/lib/route-constants'

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    closed: 'bg-purple-100 text-purple-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

export default function DealDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [deal, setDeal] = useState<Deal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getConsultantId = () => {
    if (typeof window === 'undefined') return '1'
    return localStorage.getItem('consultant_id') || '1'
  }

  useEffect(() => {
    if (!id) return

    const fetchDeal = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/deals/${id}`, {
          headers: {
            'x-consultant-id': getConsultantId(),
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            setError('Deal not found')
          } else if (response.status === 403) {
            setError('You do not have permission to view this deal')
          } else {
            setError('Failed to load deal')
          }
          setDeal(null)
          return
        }

        const data = await response.json()
        setDeal(data.deal)
      } catch (err) {
        console.error('Error fetching deal:', err)
        setError('Failed to load deal')
        setDeal(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeal()
  }, [id])

  const handleDelete = async () => {
    if (!deal || !confirm('Are you sure you want to delete this deal?')) return

    try {
      const response = await fetch(`/api/deals/${deal.id}`, {
        method: 'DELETE',
        headers: {
          'x-consultant-id': getConsultantId(),
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete deal')
      }

      router.push(ROUTES.CRM.DEALS)
    } catch (err) {
      console.error('Error deleting deal:', err)
      alert('Failed to delete deal. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal...</p>
        </div>
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error || 'Deal not found'}</p>
          <Link href="/crm/deals">
            <Button variant="primary">Back to Deals</Button>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(ROUTES.CRM.DEALS)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(deal.status)}`}>
                    {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Created {new Date(deal.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={ROUTES.CRM.dealEdit(deal.id)}>
                <Button variant="outline" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="gap-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deal Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Information</h2>
              <div className="space-y-3">
                {deal.clientName && (
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-medium text-gray-900">{deal.clientName}</p>
                  </div>
                )}
                {deal.description && (
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{deal.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <DealTotals products={deal.products} />
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Qty</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Unit Cost</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deal.products.map((product) => (
                      <tr key={product.productId} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">{product.productName}</p>
                          {product.category && (
                            <p className="text-xs text-gray-500">{product.category}</p>
                          )}
                        </td>
                        <td className="text-right py-3 px-4">{product.quantity}</td>
                        <td className="text-right py-3 px-4">
                          S${product.unitCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          S${product.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
