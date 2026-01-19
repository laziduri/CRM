'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Calculator,
  DollarSign,
  TrendingUp,
  PieChart,
  Calendar,
  Filter,
  Download,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CommissionRecord {
  id: string
  clientName: string
  loanAmount: number
  loanType: string
  commissionRate: number
  commissionAmount: number
  status: 'pending' | 'paid' | 'processing'
  closedDate: Date
  paidDate?: Date
  paymentMethod?: string
}

export default function CommissionPage() {
  const router = useRouter()
  const [commissionRecords, setCommissionRecords] = useState<CommissionRecord[]>([])
  const [stats, setStats] = useState({
    totalEarned: 0,
    pending: 0,
    paid: 0,
    thisMonth: 0,
    lastMonth: 0,
  })

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    // Mock data
    const mockRecords: CommissionRecord[] = [
      {
        id: '1',
        clientName: 'John Doe',
        loanAmount: 50000,
        loanType: 'Personal Loan',
        commissionRate: 5.0,
        commissionAmount: 2500,
        status: 'paid',
        closedDate: new Date('2024-01-10'),
        paidDate: new Date('2024-01-15'),
        paymentMethod: 'Bank Transfer',
      },
      {
        id: '2',
        clientName: 'ABC Trading Pte Ltd',
        loanAmount: 150000,
        loanType: 'Business Loan',
        commissionRate: 5.0,
        commissionAmount: 7500,
        status: 'paid',
        closedDate: new Date('2024-01-05'),
        paidDate: new Date('2024-01-10'),
        paymentMethod: 'Bank Transfer',
      },
      {
        id: '3',
        clientName: 'Jane Smith',
        loanAmount: 30000,
        loanType: 'Personal Loan',
        commissionRate: 5.0,
        commissionAmount: 1500,
        status: 'processing',
        closedDate: new Date('2024-01-12'),
      },
      {
        id: '4',
        clientName: 'XYZ Services Ltd',
        loanAmount: 200000,
        loanType: 'Business Loan',
        commissionRate: 5.0,
        commissionAmount: 10000,
        status: 'pending',
        closedDate: new Date('2024-01-14'),
      },
      {
        id: '5',
        clientName: 'Robert Chen',
        loanAmount: 75000,
        loanType: 'Personal Loan',
        commissionRate: 5.0,
        commissionAmount: 3750,
        status: 'paid',
        closedDate: new Date('2023-12-20'),
        paidDate: new Date('2024-01-05'),
        paymentMethod: 'Bank Transfer',
      },
    ]

    setCommissionRecords(mockRecords)

    // Calculate stats
    const totalEarned = mockRecords.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.commissionAmount, 0)
    const pending = mockRecords.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.commissionAmount, 0)
    const paid = totalEarned
    const thisMonth = mockRecords
      .filter(r => r.status === 'paid' && r.paidDate && r.paidDate.getMonth() === new Date().getMonth())
      .reduce((sum, r) => sum + r.commissionAmount, 0)
    const lastMonth = mockRecords
      .filter(r => r.status === 'paid' && r.paidDate && r.paidDate.getMonth() === new Date().getMonth() - 1)
      .reduce((sum, r) => sum + r.commissionAmount, 0)

    setStats({ totalEarned, pending, paid, thisMonth, lastMonth })
  }, [router])

  const calculateCommission = (loanAmount: number, commissionRate: number) => {
    return (loanAmount * commissionRate) / 100
  }

  const [calculatorLoanAmount, setCalculatorLoanAmount] = useState(100000)
  const [calculatorRate, setCalculatorRate] = useState(5.0)
  const calculatedCommission = calculateCommission(calculatorLoanAmount, calculatorRate)

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
                <h1 className="text-2xl font-bold text-gray-900">Commission Calculator</h1>
                <p className="text-sm text-gray-600">Track and calculate your earnings</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-200" />
            </div>
            <p className="text-sm text-white/80 mb-1">Total Earned</p>
            <p className="text-3xl font-bold">${stats.totalEarned.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-gray-900">${stats.pending.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-3xl font-bold text-gray-900">${stats.thisMonth.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.lastMonth > 0 && (
                <span className={stats.thisMonth > stats.lastMonth ? 'text-green-600' : 'text-red-600'}>
                  {stats.thisMonth > stats.lastMonth ? '↑' : '↓'} {Math.abs(((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100).toFixed(1)}%
                </span>
              )}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-teal/10 rounded-lg">
                <PieChart className="w-6 h-6 text-teal" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Paid</p>
            <p className="text-3xl font-bold text-gray-900">${stats.paid.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Commission Calculator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Calculate Commission</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount (SGD)
                  </label>
                  <input
                    type="number"
                    value={calculatorLoanAmount}
                    onChange={(e) => setCalculatorLoanAmount(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="100000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={calculatorRate}
                    onChange={(e) => setCalculatorRate(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="5.0"
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="bg-gradient-to-br from-primary to-primary-dark rounded-lg p-4 text-white">
                    <p className="text-sm text-white/80 mb-1">Estimated Commission</p>
                    <p className="text-3xl font-bold">${calculatedCommission.toLocaleString()}</p>
                    <p className="text-xs text-white/70 mt-1">
                      {calculatorRate}% of ${calculatorLoanAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Commission Records */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Commission History</h2>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {commissionRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {record.clientName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.loanType}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ${record.loanAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.commissionRate}%</td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                          ${record.commissionAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === 'paid'
                                ? 'bg-green-100 text-green-700'
                                : record.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {record.paidDate ? record.paidDate.toLocaleDateString() : record.closedDate.toLocaleDateString()}
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
