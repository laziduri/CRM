'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calculator, Calendar, DollarSign, TrendingUp, FileText, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'

interface SavedCalculation {
  id: string
  type: 'personal' | 'business' | 'debt-consolidation'
  title: string
  loanAmount: number
  interestRate: number
  tenure: number
  monthlyPayment: number
  totalInterest: number
  createdAt: string
}

export default function SavedCalculationsPage() {
  const router = useRouter()
  const [calculations, setCalculations] = useState<SavedCalculation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('client_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    // Fetch saved calculations
    fetchCalculations()
  }, [router])

  const fetchCalculations = async () => {
    try {
      // In production, fetch from API
      // For now, using mock data
      const mockCalculations: SavedCalculation[] = [
        {
          id: '1',
          type: 'personal',
          title: 'Personal Loan - Home Renovation',
          loanAmount: 50000,
          interestRate: 4.5,
          tenure: 60,
          monthlyPayment: 932.50,
          totalInterest: 5935.00,
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          type: 'business',
          title: 'Business Loan - Working Capital',
          loanAmount: 200000,
          interestRate: 5.2,
          tenure: 36,
          monthlyPayment: 6018.75,
          totalInterest: 16675.00,
          createdAt: '2024-01-10',
        },
        {
          id: '3',
          type: 'debt-consolidation',
          title: 'Debt Consolidation Plan',
          loanAmount: 75000,
          interestRate: 4.8,
          tenure: 48,
          monthlyPayment: 1725.30,
          totalInterest: 7814.40,
          createdAt: '2024-01-05',
        },
      ]
      setCalculations(mockCalculations)
    } catch (error) {
      console.error('Error fetching calculations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this calculation?')) return

    try {
      // In production, call API to delete
      setCalculations(prev => prev.filter(calc => calc.id !== id))
    } catch (error) {
      console.error('Error deleting calculation:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'personal':
        return 'Personal Loan'
      case 'business':
        return 'Business Loan'
      case 'debt-consolidation':
        return 'Debt Consolidation'
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/client/dashboard" className="mr-4">
              <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-900" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Saved Calculations</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Calculations</span>
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{calculations.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Loan Amount</span>
              <DollarSign className="w-5 h-5 text-teal" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(calculations.reduce((sum, calc) => sum + calc.loanAmount, 0))}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Average Monthly Payment</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(
                calculations.length > 0
                  ? calculations.reduce((sum, calc) => sum + calc.monthlyPayment, 0) / calculations.length
                  : 0
              )}
            </p>
          </div>
        </div>

        {/* Calculations List */}
        {calculations.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved calculations yet</h3>
            <p className="text-gray-600 mb-6">Start by creating a loan calculation using our calculator tools.</p>
            <Link href="/calculator">
              <Button variant="primary">Go to Calculator</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {calculations.map((calc) => (
              <div key={calc.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                        {getTypeLabel(calc.type)}
                      </span>
                      <span className="text-sm text-gray-500">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {formatDate(calc.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{calc.title}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(calc.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete calculation"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(calc.loanAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Interest Rate</p>
                    <p className="text-lg font-semibold text-gray-900">{calc.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(calc.monthlyPayment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tenure</p>
                    <p className="text-lg font-semibold text-gray-900">{calc.tenure} months</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Interest</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(calc.totalInterest)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/calculator?load=${calc.id}`}>
                      <Button variant="secondary" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
