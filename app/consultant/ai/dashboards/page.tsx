'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  LayoutDashboard,
  TrendingUp,
  Target,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  Zap,
  RefreshCw,
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
  ResponsiveContainer,
} from 'recharts'

interface DashboardMetric {
  id: string
  name: string
  value: number
  change: number
  trend: 'up' | 'down' | 'neutral'
  aiInsight?: string
}

interface ProjectProgress {
  projectId: string
  projectName: string
  progress: number
  status: 'on-track' | 'at-risk' | 'delayed'
  aiRecommendation?: string
}

export default function AIDashboardsPage() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<DashboardMetric[]>([])
  const [projectProgress, setProjectProgress] = useState<ProjectProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month')

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    // Mock metrics
    const mockMetrics: DashboardMetric[] = [
      {
        id: '1',
        name: 'Active Projects',
        value: 12,
        change: 15,
        trend: 'up',
        aiInsight: 'Project count increased 15% this month. Consider allocating more resources to maintain quality.',
      },
      {
        id: '2',
        name: 'Client Conversion Rate',
        value: 68,
        change: 5,
        trend: 'up',
        aiInsight: 'Conversion rate improved. Your follow-up strategy is working well.',
      },
      {
        id: '3',
        name: 'Average Deal Size',
        value: 450000,
        change: -3,
        trend: 'down',
        aiInsight: 'Deal size decreased slightly. Focus on upselling to existing clients.',
      },
      {
        id: '4',
        name: 'Tasks Completed',
        value: 89,
        change: 12,
        trend: 'up',
        aiInsight: 'Productivity increased. Keep up the momentum!',
      },
    ]

    // Mock project progress
    const mockProgress: ProjectProgress[] = [
      {
        projectId: '1',
        projectName: 'Q1 Business Loan Campaign',
        progress: 65,
        status: 'on-track',
        aiRecommendation: 'Project is on schedule. Consider accelerating content creation phase.',
      },
      {
        projectId: '2',
        projectName: 'Client Onboarding Optimization',
        progress: 30,
        status: 'at-risk',
        aiRecommendation: 'Project is behind schedule. Recommend adding resources or extending timeline.',
      },
      {
        projectId: '3',
        projectName: 'Marketing Automation Setup',
        progress: 85,
        status: 'on-track',
        aiRecommendation: 'Excellent progress. Project likely to complete early.',
      },
    ]

    setMetrics(mockMetrics)
    setProjectProgress(mockProgress)
    setIsLoading(false)
  }, [router])

  const generateAIInsights = async () => {
    try {
      const response = await fetch('/api/ai/dashboards/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics, projectProgress, timeRange }),
      })

      const data = await response.json()

      if (response.ok && data.insights) {
        // Update metrics and projects with AI insights
        alert('AI insights generated!')
      }
    } catch (error) {
      console.error('AI insights error:', error)
    }
  }

  // Mock chart data
  const commissionData = [
    { month: 'Jan', commission: 12000 },
    { month: 'Feb', commission: 15000 },
    { month: 'Mar', commission: 18000 },
    { month: 'Apr', commission: 22000 },
  ]

  const dealTypeData = [
    { name: 'Personal Loans', value: 45 },
    { name: 'Business Loans', value: 35 },
    { name: 'SME Loans', value: 20 },
  ]

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B']

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Dashboards</h1>
                <p className="text-sm text-gray-600">Track project progress in one view</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'quarter')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              <Button
                variant="outline"
                onClick={generateAIInsights}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Insights
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{metric.name}</p>
                <div className={`flex items-center gap-1 text-xs ${
                  metric.trend === 'up' ? 'text-green-600' :
                  metric.trend === 'down' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {metric.name.includes('Deal Size') || metric.name.includes('Commission')
                  ? `S$${metric.value.toLocaleString()}`
                  : metric.value}
              </p>
              {metric.aiInsight && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">{metric.aiInsight}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Commission Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={commissionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="commission" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Deal Type Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={dealTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dealTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress Overview</h3>
          <div className="space-y-4">
            {projectProgress.map((project) => (
              <div key={project.projectId} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{project.projectName}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'on-track' ? 'bg-green-100 text-green-700' :
                    project.status === 'at-risk' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs font-semibold text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        project.status === 'on-track' ? 'bg-green-500' :
                        project.status === 'at-risk' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                {project.aiRecommendation && (
                  <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/10">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-700">{project.aiRecommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
