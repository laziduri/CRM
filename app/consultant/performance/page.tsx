'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface PerformanceData {
  month: string
  commissions: number
  closedDeals: number
  newClients: number
  successRate: number
}

interface LoanTypeData {
  name: string
  value: number
  color: string
}

export default function PerformancePage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [loanTypeData, setLoanTypeData] = useState<LoanTypeData[]>([])
  const [stats, setStats] = useState({
    totalCommissions: 0,
    monthlyGrowth: 0,
    totalDeals: 0,
    dealsGrowth: 0,
    activeClients: 0,
    clientsGrowth: 0,
    avgSuccessRate: 0,
    rateGrowth: 0,
  })

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/crm')
      return
    }

    // Mock performance data
    const mockData: PerformanceData[] = [
      { month: 'Jul', commissions: 12000, closedDeals: 5, newClients: 2, successRate: 82 },
      { month: 'Aug', commissions: 14500, closedDeals: 6, newClients: 3, successRate: 85 },
      { month: 'Sep', commissions: 13200, closedDeals: 5, newClients: 2, successRate: 83 },
      { month: 'Oct', commissions: 16800, closedDeals: 7, newClients: 4, successRate: 87 },
      { month: 'Nov', commissions: 15200, closedDeals: 6, newClients: 3, successRate: 86 },
      { month: 'Dec', commissions: 17500, closedDeals: 8, newClients: 3, successRate: 88 },
      { month: 'Jan', commissions: 18500, closedDeals: 8, newClients: 4, successRate: 87.5 },
    ]

    const mockLoanTypeData: LoanTypeData[] = [
      { name: 'Personal Loans', value: 45, color: '#3B82F6' },
      { name: 'Business Loans', value: 35, color: '#10B981' },
      { name: 'Home Loans', value: 15, color: '#F59E0B' },
      { name: 'Other', value: 5, color: '#8B5CF6' },
    ]

    setPerformanceData(mockData)
    setLoanTypeData(mockLoanTypeData)

    // Calculate stats
    const latest = mockData[mockData.length - 1]
    const previous = mockData[mockData.length - 2]
    
    setStats({
      totalCommissions: 125000,
      monthlyGrowth: ((latest.commissions - previous.commissions) / previous.commissions) * 100,
      totalDeals: 87,
      dealsGrowth: 8.3,
      activeClients: 24,
      clientsGrowth: 15.0,
      avgSuccessRate: latest.successRate,
      rateGrowth: latest.successRate - previous.successRate,
    })
  }, [router])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899']

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
                <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
                <p className="text-sm text-gray-600">Track your performance metrics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.monthlyGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(stats.monthlyGrowth).toFixed(1)}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Monthly Commissions</p>
            <p className="text-3xl font-bold text-gray-900">${stats.totalCommissions.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Total earned</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.dealsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.dealsGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(stats.dealsGrowth).toFixed(1)}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Closed Deals</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalDeals}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-teal/10 rounded-lg">
                <Users className="w-6 h-6 text-teal" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.clientsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.clientsGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(stats.clientsGrowth).toFixed(1)}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Clients</p>
            <p className="text-3xl font-bold text-gray-900">{stats.activeClients}</p>
            <p className="text-xs text-gray-500 mt-1">Currently assigned</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.rateGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.rateGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(stats.rateGrowth).toFixed(1)}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Success Rate</p>
            <p className="text-3xl font-bold text-gray-900">{stats.avgSuccessRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Average approval rate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Commissions Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Commission Trends</h2>
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Commissions']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="commissions"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 5 }}
                  name="Commissions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Deals Closed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Deals Closed</h2>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="closedDeals" fill="#10B981" name="Closed Deals" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* New Clients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">New Clients</h2>
              <div className="p-2 bg-teal/10 rounded-lg">
                <Users className="w-5 h-5 text-teal" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="newClients" fill="#14B8A6" name="New Clients" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Success Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Success Rate Trend</h2>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[70, 100]} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Success Rate']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="successRate"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 5 }}
                  name="Success Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loan Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Loan Type Distribution</h2>
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <PieChart className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={loanTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {loanTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center space-y-4">
              {loanTypeData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{item.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
