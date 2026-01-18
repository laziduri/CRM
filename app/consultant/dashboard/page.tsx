'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, 
  FileText, 
  Calendar as CalendarIcon,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Target,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Briefcase,
  User,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  StickyNote,
  BookOpen,
  Copy,
  Check,
  Building2
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Card from '@/components/ui/Card'
import {
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

interface ConsultantData {
  id: string
  consultantId: string
  username: string
  name: string
  email: string
  phone: string
}

interface PerformanceMetrics {
  totalCommissions: number
  monthlyCommissions: number
  commissionGrowth: number
  closedDeals: number
  closedDealsGrowth: number
  activeClients: number
  clientGrowth: number
  successRate: number
  successRateChange: number
  averageDealSize: number
  averageDealSizeChange: number
  pendingApplications: number
  todayAppointments: number
}

interface DealStatusData {
  status: string
  count: number
  color: string
}

interface LoanTypeData {
  name: string
  value: number
  color: string
}

interface Appointment {
  id: string
  title: string
  clientName: string
  consultantName: string
  consultantId: string
  date: Date
  time: string
  duration: number
  type: 'consultation' | 'follow-up' | 'closing' | 'other'
  location: 'office' | 'online' | 'client-site'
}

interface Teammate {
  id: string
  consultantId: string
  name: string
  email: string
  role: string
  avatar?: string
  totalDeals: number
  closedDeals: number
  totalCommissions: number
  successRate: number
  activeClients: number
}

type DashboardTab = 'overview' | 'resources' | 'notes' | 'appointments'

interface MonthlyGoals {
  month: string
  year?: number
  commissionTarget: number
  dealsTarget: number
  clientsTarget: number
  successRateTarget: number
  actualCommission?: number
  actualDeals?: number
  actualClients?: number
  actualSuccessRate?: number
}

interface DocumentRequirement {
  id: string
  name: string
  description: string
}

interface LoanTypeRequirements {
  type: 'personal' | 'business'
  title: string
  description: string
  documents: DocumentRequirement[]
}

const LOAN_REQUIREMENTS: LoanTypeRequirements[] = [
  {
    type: 'personal',
    title: 'Personal Loan',
    description: 'Document requirements for personal loan applications in Singapore',
    documents: [
      {
        id: 'personal-ic',
        name: 'IC Front & Back',
        description: 'Front and back sides of your Identity Card (NRIC or FIN card)',
      },
      {
        id: 'personal-noa',
        name: 'Past 2 Years NOA',
        description: 'Notice of Assessment from IRAS for the past 2 years',
      },
      {
        id: 'personal-cbs',
        name: 'CBS Report',
        description: 'Credit Bureau Singapore (CBS) credit report - can be obtained from CBS website or through bank',
      },
    ],
  },
  {
    type: 'business',
    title: 'Business / SME Loan',
    description: 'Document requirements for business loan applications in Singapore',
    documents: [
      {
        id: 'business-ic-directors',
        name: 'IC Front & Back (All Directors)',
        description: 'Identity Card (front and back) of all company directors and shareholders with >20% shareholding',
      },
      {
        id: 'business-noa',
        name: 'Past 2 Years NOA (All Directors)',
        description: 'Notice of Assessment from IRAS for the past 2 years for all directors and major shareholders',
      },
      {
        id: 'business-cbs',
        name: 'CBS Report (All Directors)',
        description: 'Credit Bureau Singapore (CBS) credit report for all directors and major shareholders',
      },
      {
        id: 'business-bank-statements',
        name: 'Past 6 Months Bank Statements',
        description: 'Business bank statements from the past 6 months - must show regular transactions and business operations',
      },
      {
        id: 'business-acra',
        name: 'ACRA Profile',
        description: 'ACRA business profile or Certificate of Incorporation - can be obtained from ACRA website',
      },
      {
        id: 'business-financial-statements',
        name: 'Past 2 Years Financial Statements',
        description: 'Audited or unaudited financial statements for the past 2 years (Balance Sheet, Profit & Loss Statement)',
      },
    ],
  },
]

export default function ConsultantDashboardPage() {
  const router = useRouter()
  const [consultant, setConsultant] = useState<ConsultantData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedFullText, setCopiedFullText] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalCommissions: 0,
    monthlyCommissions: 0,
    commissionGrowth: 0,
    closedDeals: 0,
    closedDealsGrowth: 0,
    activeClients: 0,
    clientGrowth: 0,
    successRate: 0,
    successRateChange: 0,
    averageDealSize: 0,
    averageDealSizeChange: 0,
    pendingApplications: 0,
    todayAppointments: 0,
  })
  const [dealStatusData, setDealStatusData] = useState<DealStatusData[]>([])
  const [loanTypeData, setLoanTypeData] = useState<LoanTypeData[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [teammates, setTeammates] = useState<Teammate[]>([])

  // Goals modal state
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false)
  const [currentMonthGoals, setCurrentMonthGoals] = useState({
    commissionTarget: 27750, // metrics.monthlyCommissions * 1.5
    dealsTarget: 104, // metrics.closedDeals * 1.2
    clientsTarget: 31, // metrics.activeClients * 1.3
    successRateTarget: 90,
  })
  const [pastMonthsGoals, setPastMonthsGoals] = useState<MonthlyGoals[]>([])
  const [goalsModalTab, setGoalsModalTab] = useState<'current' | 'history'>('current')
  const [isSavingGoals, setIsSavingGoals] = useState(false)

  useEffect(() => {
    // Check if consultant is authenticated
    const token = localStorage.getItem('consultant_token')
    const consultantId = localStorage.getItem('consultant_id')

    if (!token || !consultantId) {
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('login')) {
        router.push('/consultant/login')
      }
      return
    }

    // Mock data - in production, fetch from API
    setConsultant({
      id: '1',
      consultantId: 'CON001',
      username: 'consultant1',
      name: 'Sarah Chen',
      email: 'sarah.chen@brillianceadvisory.com',
      phone: '+65 9123 4567',
    })

    // Mock performance metrics
    setMetrics({
      totalCommissions: 125000,
      monthlyCommissions: 18500,
      commissionGrowth: 12.5,
      closedDeals: 87,
      closedDealsGrowth: 8.3,
      activeClients: 24,
      clientGrowth: 15.0,
      successRate: 87.5,
      successRateChange: 3.2,
      averageDealSize: 85000,
      averageDealSizeChange: -2.1,
      pendingApplications: 8,
      todayAppointments: 3,
    })

    // Mock deal status data
    setDealStatusData([
      { status: 'New', count: 5, color: '#6B7280' },
      { status: 'In Progress', count: 8, color: '#3B82F6' },
      { status: 'Under Review', count: 6, color: '#F59E0B' },
      { status: 'Approved', count: 4, color: '#8B5CF6' },
      { status: 'Closed', count: 87, color: '#10B981' },
      { status: 'Rejected', count: 3, color: '#EF4444' },
    ])

    // Mock loan type data
    setLoanTypeData([
      { name: 'Personal Loans', value: 45, color: '#3B82F6' },
      { name: 'Business Loans', value: 35, color: '#10B981' },
      { name: 'Home Loans', value: 15, color: '#F59E0B' },
      { name: 'Other', value: 5, color: '#8B5CF6' },
    ])

    // Mock appointments
    const today = new Date()
    setAppointments([
      {
        id: '1',
        title: 'Initial Consultation',
        clientName: 'John Doe',
        consultantName: 'Sarah Chen',
        consultantId: '1',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        time: '10:00 AM',
        duration: 60,
        type: 'consultation',
        location: 'office',
      },
      {
        id: '2',
        title: 'Follow-up Meeting',
        clientName: 'ABC Trading Pte Ltd',
        consultantName: 'Sarah Chen',
        consultantId: '1',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
        time: '2:30 PM',
        duration: 45,
        type: 'follow-up',
        location: 'online',
      },
      {
        id: '3',
        title: 'Closing Meeting',
        clientName: 'Jane Smith',
        consultantName: 'Sarah Chen',
        consultantId: '1',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
        time: '4:00 PM',
        duration: 30,
        type: 'closing',
        location: 'office',
      },
      {
        id: '4',
        title: 'Client Meeting',
        clientName: 'XYZ Services Ltd',
        consultantName: 'Michael Tan',
        consultantId: '2',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
        time: '11:00 AM',
        duration: 60,
        type: 'consultation',
        location: 'office',
      },
      {
        id: '5',
        title: 'Follow-up',
        clientName: 'DEF Manufacturing',
        consultantName: 'Emily Wong',
        consultantId: '3',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 30),
        time: '9:30 AM',
        duration: 45,
        type: 'follow-up',
        location: 'online',
      },
    ])

    // Mock teammates
    setTeammates([
      {
        id: '2',
        consultantId: 'CON002',
        name: 'Michael Tan',
        email: 'michael.tan@brillianceadvisory.com',
        role: 'Senior Consultant',
        totalDeals: 95,
        closedDeals: 82,
        totalCommissions: 142000,
        successRate: 86.3,
        activeClients: 28,
      },
      {
        id: '3',
        consultantId: 'CON003',
        name: 'Emily Wong',
        email: 'emily.wong@brillianceadvisory.com',
        role: 'Consultant',
        totalDeals: 72,
        closedDeals: 61,
        totalCommissions: 98000,
        successRate: 84.7,
        activeClients: 19,
      },
      {
        id: '4',
        consultantId: 'CON004',
        name: 'David Lim',
        email: 'david.lim@brillianceadvisory.com',
        role: 'Consultant',
        totalDeals: 58,
        closedDeals: 49,
        totalCommissions: 78000,
        successRate: 84.5,
        activeClients: 16,
      },
    ])

    setIsLoading(false)
  }, [router])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate.getDate() === date.getDate() &&
             aptDate.getMonth() === date.getMonth() &&
             aptDate.getFullYear() === date.getFullYear()
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

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

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date)
    const today = new Date()
    return aptDate.getDate() === today.getDate() &&
           aptDate.getMonth() === today.getMonth() &&
           aptDate.getFullYear() === today.getFullYear()
  })

  const totalDeals = dealStatusData.reduce((sum, item) => sum + item.count, 0)

  const copyDocumentList = (loanType: 'personal' | 'business') => {
    const requirement = LOAN_REQUIREMENTS.find(r => r.type === loanType)
    if (!requirement) return

    const text = `${requirement.title} - Document Requirements\n\n${requirement.description}\n\nRequired Documents:\n${requirement.documents.map((doc, index) => `${index + 1}. ${doc.name}\n   ${doc.description}`).join('\n\n')}`

    navigator.clipboard.writeText(text)
    setCopiedFullText(loanType)
    setTimeout(() => setCopiedFullText(null), 2000)
  }

  const copySingleDocument = (loanType: string, docName: string, docDescription: string) => {
    const text = `${docName}\n${docDescription}`
    navigator.clipboard.writeText(text)
    setCopiedId(`${loanType}-${docName}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const tabs = [
    { id: 'overview' as DashboardTab, label: 'Overview', icon: BarChart3 },
    { id: 'resources' as DashboardTab, label: 'Resources', icon: FileText },
    { id: 'notes' as DashboardTab, label: 'Notes', icon: StickyNote },
    { id: 'appointments' as DashboardTab, label: 'Appointment Summary', icon: BookOpen },
  ]

  return (
    <div className="min-h-full bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {consultant?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/consultant/dashboard/settings">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Settings
                </Button>
              </Link>
              <Link href="/consultant/clients/new">
                <Button variant="primary" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Client
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 border-t border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Monthly Goals and Targets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Monthly Goals & Targets</h2>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsGoalsModalOpen(true)}
            >
              Edit Goals
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Commission Goal */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Commission Target</span>
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ${metrics.monthlyCommissions.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    / ${(metrics.monthlyCommissions * 1.5).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((metrics.monthlyCommissions / (metrics.monthlyCommissions * 1.5)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {Math.round((metrics.monthlyCommissions / (metrics.monthlyCommissions * 1.5)) * 100)}% achieved
              </p>
            </div>

            {/* Deals Goal */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Deals Target</span>
                <Briefcase className="w-4 h-4 text-green-600" />
              </div>
              <div className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{metrics.closedDeals}</span>
                  <span className="text-sm text-gray-500">/ {currentMonthGoals.dealsTarget}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((metrics.closedDeals / currentMonthGoals.dealsTarget) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {Math.round((metrics.closedDeals / currentMonthGoals.dealsTarget) * 100)}% achieved
              </p>
            </div>

            {/* Clients Goal */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">New Clients</span>
                <UserCheck className="w-4 h-4 text-teal" />
              </div>
              <div className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{metrics.activeClients}</span>
                  <span className="text-sm text-gray-500">/ {Math.round(metrics.activeClients * 1.3)}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((metrics.activeClients / (metrics.activeClients * 1.3)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {Math.round((metrics.activeClients / (metrics.activeClients * 1.3)) * 100)}% achieved
              </p>
            </div>

            {/* Success Rate Goal */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Success Rate Target</span>
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{metrics.successRate}%</span>
                  <span className="text-sm text-gray-500">/ {currentMonthGoals.successRateTarget}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((metrics.successRate / currentMonthGoals.successRateTarget) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {Math.round((metrics.successRate / currentMonthGoals.successRateTarget) * 100)}% achieved
              </p>
            </div>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Commissions */}
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${metrics.commissionGrowth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {metrics.commissionGrowth >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(metrics.commissionGrowth)}%
              </div>
            </div>
            <p className="text-sm text-white/80 mb-1">Total Commissions</p>
            <p className="text-3xl font-bold">${metrics.totalCommissions.toLocaleString()}</p>
            <p className="text-sm text-white/70 mt-2">${metrics.monthlyCommissions.toLocaleString()} this month</p>
          </div>

          {/* Closed Deals */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${metrics.closedDealsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.closedDealsGrowth >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(metrics.closedDealsGrowth)}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Closed Deals</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.closedDeals}</p>
            <p className="text-sm text-gray-500 mt-2">Total: {totalDeals} deals</p>
          </div>

          {/* Active Clients */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${metrics.clientGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.clientGrowth >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(metrics.clientGrowth)}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Clients</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.activeClients}</p>
            <p className="text-sm text-gray-500 mt-2">Currently assigned</p>
          </div>

          {/* Success Rate */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-teal/10 rounded-lg">
                <Target className="w-6 h-6 text-teal" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${metrics.successRateChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.successRateChange >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(metrics.successRateChange)}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Success Rate</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.successRate}%</p>
            <p className="text-sm text-gray-500 mt-2">Approval rate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deal Status Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Deal Status Breakdown</h2>
                    <p className="text-sm text-gray-600">Total: {totalDeals} deals</p>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dealStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#3B82F6" name="Number of Deals" radius={[8, 8, 0, 0]}>
                    {dealStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Loan Type Pie Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <PieChart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Loan Type Distribution</h2>
                    <p className="text-sm text-gray-600">Breakdown by loan category</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={loanTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
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
          </div>

          {/* Calendar & Today's Overview */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Appointments Calendar</h3>
                <Link href="/consultant/appointments" className="text-xs text-primary hover:text-primary-dark font-medium">
                  View all →
                </Link>
              </div>
              
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h4 className="font-semibold text-gray-900">{monthName}</h4>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                  const dayAppointments = getAppointmentsForDate(date)
                  const isToday = date.toDateString() === new Date().toDateString()
                  const isSelected = date.toDateString() === selectedDate.toDateString()
                  
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(date)}
                      className={`aspect-square p-1 text-sm rounded-lg transition-colors relative ${
                        isToday
                          ? 'bg-primary text-white font-semibold'
                          : isSelected
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      {day}
                      {dayAppointments.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {dayAppointments.slice(0, 3).map((_, idx) => (
                            <div
                              key={idx}
                              className={`w-1 h-1 rounded-full ${
                                isToday ? 'bg-white' : 'bg-primary'
                              }`}
                            ></div>
                          ))}
                          {dayAppointments.length > 3 && (
                            <span className={`text-xs ${isToday ? 'text-white' : 'text-primary'}`}>
                              +{dayAppointments.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Today&apos;s Appointments</h3>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {todayAppointments.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {todayAppointments.length > 0 ? (
                  todayAppointments
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{apt.title}</p>
                            <p className="text-xs text-gray-600">{apt.clientName}</p>
                          </div>
                          <span className="text-xs font-medium text-primary">{apt.time}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            apt.consultantId === consultant?.id
                              ? 'bg-primary/10 text-primary'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {apt.consultantName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {apt.duration} min
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {apt.location}
                          </span>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No appointments today</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Teams Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Team Performance</h2>
                <p className="text-sm text-gray-600">View your team&apos;s statistics</p>
              </div>
            </div>
            <Link href="/consultant/team" className="text-sm text-primary hover:text-primary-dark font-medium">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teammates.map((teammate) => (
              <div
                key={teammate.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white font-semibold">
                    {teammate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{teammate.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{teammate.role}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Closed Deals</span>
                    <span className="font-semibold text-gray-900">{teammate.closedDeals}/{teammate.totalDeals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commissions</span>
                    <span className="font-semibold text-green-600">${teammate.totalCommissions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-primary">{teammate.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Clients</span>
                    <span className="font-semibold text-gray-900">{teammate.activeClients}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deal Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Total Deals</h3>
                <p className="text-2xl font-bold text-gray-900">{totalDeals}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Closed</span>
                <span className="font-semibold text-green-600">
                  {dealStatusData.find(d => d.status === 'Closed')?.count || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">In Progress</span>
                <span className="font-semibold text-blue-600">
                  {dealStatusData.filter(d => ['In Progress', 'Under Review'].includes(d.status)).reduce((sum, d) => sum + d.count, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">
                  {dealStatusData.find(d => d.status === 'New')?.count || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Total Pipeline Value</h3>
                <p className="text-2xl font-bold text-gray-900">$2.4M</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Average Deal</span>
                <span className="font-semibold text-gray-900">${metrics.averageDealSize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Largest Deal</span>
                <span className="font-semibold text-gray-900">$250,000</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-teal/10 rounded-lg">
                <Clock className="w-6 h-6 text-teal" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Average Close Time</h3>
                <p className="text-2xl font-bold text-gray-900">18 days</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Fastest</span>
                <span className="font-semibold text-green-600">5 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Month</span>
                <span className="font-semibold text-gray-900">16 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Link href="/consultant/activity" className="text-sm text-primary hover:text-primary-dark font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New message from John Doe
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Deal closed: Business Loan - $150,000
                </p>
                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Application submitted by ABC Trading Pte Ltd
                </p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-teal/10 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-teal" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Appointment scheduled for tomorrow at 2:00 PM
                </p>
                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Resources Tab Content */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loan Document Requirements</h2>
                <p className="text-gray-600">
                Quick reference guide for loan document requirements. Click the copy icon next to any document or use the &quot;Copy All&quot; button to copy the complete list for sharing with clients.
              </p>
            </div>

            {LOAN_REQUIREMENTS.map((requirement) => (
              <Card key={requirement.type} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    {requirement.type === 'personal' ? (
                      <User className="w-6 h-6 text-primary mt-1" />
                    ) : (
                      <Building2 className="w-6 h-6 text-teal mt-1" />
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{requirement.title}</h3>
                      <p className="text-gray-600">{requirement.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Total: {requirement.documents.length} document{requirement.documents.length !== 1 ? 's' : ''} required
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyDocumentList(requirement.type)}
                    className="flex items-center gap-2"
                  >
                    {copiedFullText === requirement.type ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy All
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4 mt-6">
                  {requirement.documents.map((doc, index) => {
                    const copyKey = `${requirement.type}-${doc.name}`
                    const isCopied = copiedId === copyKey

                    return (
                      <div
                        key={doc.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1">{doc.name}</h4>
                              <p className="text-sm text-gray-600">{doc.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => copySingleDocument(requirement.type, doc.name, doc.description)}
                            className="flex-shrink-0 p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            title="Copy document details"
                          >
                            {isCopied ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Quick Copy Templates */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Copy Templates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        const text = `Hi! Please prepare the following documents for your ${requirement.title} application:\n\n${requirement.documents.map((doc, i) => `${i + 1}. ${doc.name}`).join('\n')}\n\nLet me know if you have any questions!`
                        navigator.clipboard.writeText(text)
                        setCopiedFullText(`${requirement.type}-template`)
                        setTimeout(() => setCopiedFullText(null), 2000)
                      }}
                      className="text-left p-3 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Client Message Template</span>
                        {copiedFullText === `${requirement.type}-template` ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Copy-friendly message for clients</p>
                    </button>
                    <button
                      onClick={() => {
                        const text = `${requirement.title} Requirements:\n${requirement.documents.map((doc, i) => `${i + 1}. ${doc.name} - ${doc.description}`).join('\n')}`
                        navigator.clipboard.writeText(text)
                        setCopiedFullText(`${requirement.type}-list`)
                        setTimeout(() => setCopiedFullText(null), 2000)
                      }}
                      className="text-left p-3 bg-teal/5 hover:bg-teal/10 rounded-lg border border-teal/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Full Document List</span>
                        {copiedFullText === `${requirement.type}-list` ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Complete list with descriptions</p>
                    </button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Additional Notes */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Important Notes for Consultants</h3>
                  <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                    <li>Documents must be clear, readable, and in PDF or image format (JPG, PNG)</li>
                    <li>For business loans, ensure all directors&apos; documents are collected</li>
                    <li>Bank statements should show consistent business activity</li>
                    <li>Financial statements should be from the same financial year end</li>
                    <li>CBS reports should be recent (within 30 days for accuracy)</li>
                    <li>If clients have multiple businesses, each business needs its own complete set of documents</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Notes Tab Content */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Notes</h2>
              <p className="text-gray-600">
                Keep track of important notes and reminders for your consultations and client interactions.
              </p>
            </div>
            <Card className="p-8 text-center">
              <StickyNote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes Feature</h3>
              <p className="text-gray-600 mb-4">
                This feature will allow you to create, organize, and manage notes for your clients and consultations.
              </p>
              <Button variant="primary" size="sm">
                Coming Soon
              </Button>
            </Card>
          </div>
        )}

        {/* Appointment Summary Tab Content */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Summary</h2>
              <p className="text-gray-600">
                View and manage summaries of your client consultations and appointments.
              </p>
            </div>
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Summaries</h3>
              <p className="text-gray-600 mb-4">
                Access detailed summaries of all your client consultations and appointments.
              </p>
              <Link href="/consultant/summaries">
                <Button variant="primary" size="md" className="flex items-center gap-2 mx-auto">
                  <FileText className="w-4 h-4" />
                  View All Summaries
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Goals Edit Modal */}
      <Modal
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
        title="Monthly Goals & Targets"
        size="xl"
      >
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setGoalsModalTab('current')}
              className={`pb-3 px-1 font-medium text-sm transition-colors ${
                goalsModalTab === 'current'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Current Month Goals
            </button>
            <button
              onClick={() => setGoalsModalTab('history')}
              className={`pb-3 px-1 font-medium text-sm transition-colors ${
                goalsModalTab === 'history'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Past Months History
            </button>
          </div>

          {/* Current Month Goals Tab */}
          {goalsModalTab === 'current' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Current Month:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setIsSavingGoals(true)
                  // Simulate API call
                  await new Promise(resolve => setTimeout(resolve, 1000))
                  setIsSavingGoals(false)
                  setIsGoalsModalOpen(false)
                }}
                className="space-y-6"
              >
                {/* Commission Target */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Target (S$)
                  </label>
                  <input
                    type="number"
                    value={currentMonthGoals.commissionTarget}
                    onChange={(e) =>
                      setCurrentMonthGoals({
                        ...currentMonthGoals,
                        commissionTarget: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="0"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: ${metrics.monthlyCommissions.toLocaleString()} ({Math.round((metrics.monthlyCommissions / currentMonthGoals.commissionTarget) * 100)}% of target)
                  </p>
                </div>

                {/* Deals Target */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deals Target
                  </label>
                  <input
                    type="number"
                    value={currentMonthGoals.dealsTarget}
                    onChange={(e) =>
                      setCurrentMonthGoals({
                        ...currentMonthGoals,
                        dealsTarget: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="0"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {metrics.closedDeals} ({Math.round((metrics.closedDeals / currentMonthGoals.dealsTarget) * 100)}% of target)
                  </p>
                </div>

                {/* Clients Target */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Clients Target
                  </label>
                  <input
                    type="number"
                    value={currentMonthGoals.clientsTarget}
                    onChange={(e) =>
                      setCurrentMonthGoals({
                        ...currentMonthGoals,
                        clientsTarget: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="0"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {metrics.activeClients} ({Math.round((metrics.activeClients / currentMonthGoals.clientsTarget) * 100)}% of target)
                  </p>
                </div>

                {/* Success Rate Target */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Success Rate Target (%)
                  </label>
                  <input
                    type="number"
                    value={currentMonthGoals.successRateTarget}
                    onChange={(e) =>
                      setCurrentMonthGoals({
                        ...currentMonthGoals,
                        successRateTarget: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="0"
                    max="100"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {metrics.successRate}% ({Math.round((metrics.successRate / currentMonthGoals.successRateTarget) * 100)}% of target)
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsGoalsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSavingGoals}
                  >
                    {isSavingGoals ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Goals
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Past Months History Tab */}
          {goalsModalTab === 'history' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                  View your past months&apos; goals and actual achievements
                </p>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {pastMonthsGoals.map((goal, index) => {
                  const commissionAchieved = (goal.actualCommission ?? 0) >= goal.commissionTarget
                  const dealsAchieved = (goal.actualDeals ?? 0) >= goal.dealsTarget
                  const clientsAchieved = (goal.actualClients ?? 0) >= goal.clientsTarget
                  const successRateAchieved = (goal.actualSuccessRate ?? 0) >= goal.successRateTarget
                  const allTargetsMet = commissionAchieved && dealsAchieved && clientsAchieved && successRateAchieved

                  return (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${
                        allTargetsMet
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                          {goal.month} {goal.year || new Date().getFullYear()}
                        </h3>
                        {allTargetsMet ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            All Targets Met
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            Partial Achievement
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Commission */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600">Commission</span>
                            <span className={`text-xs font-semibold ${commissionAchieved ? 'text-green-600' : 'text-red-600'}`}>
                              {commissionAchieved ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold text-gray-900">
                              ${(goal.actualCommission ?? 0).toLocaleString()}
                            </span>
                            <span className="text-gray-500"> / ${goal.commissionTarget.toLocaleString()}</span>
                          </div>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                commissionAchieved ? 'bg-green-600' : 'bg-red-600'
                              }`}
                              style={{
                                width: `${Math.min(((goal.actualCommission ?? 0) / goal.commissionTarget) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Deals */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600">Deals</span>
                            <span className={`text-xs font-semibold ${dealsAchieved ? 'text-green-600' : 'text-red-600'}`}>
                              {dealsAchieved ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold text-gray-900">{goal.actualDeals ?? 0}</span>
                            <span className="text-gray-500"> / {goal.dealsTarget}</span>
                          </div>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                dealsAchieved ? 'bg-green-600' : 'bg-red-600'
                              }`}
                              style={{
                                width: `${Math.min(((goal.actualDeals ?? 0) / goal.dealsTarget) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Clients */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600">Clients</span>
                            <span className={`text-xs font-semibold ${clientsAchieved ? 'text-green-600' : 'text-red-600'}`}>
                              {clientsAchieved ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold text-gray-900">{goal.actualClients ?? 0}</span>
                            <span className="text-gray-500"> / {goal.clientsTarget}</span>
                          </div>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                clientsAchieved ? 'bg-green-600' : 'bg-red-600'
                              }`}
                              style={{
                                width: `${Math.min(((goal.actualClients ?? 0) / goal.clientsTarget) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Success Rate */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600">Success Rate</span>
                            <span className={`text-xs font-semibold ${successRateAchieved ? 'text-green-600' : 'text-red-600'}`}>
                              {successRateAchieved ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold text-gray-900">{goal.actualSuccessRate ?? 0}%</span>
                            <span className="text-gray-500"> / {goal.successRateTarget}%</span>
                          </div>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                successRateAchieved ? 'bg-green-600' : 'bg-red-600'
                              }`}
                              style={{
                                width: `${Math.min(((goal.actualSuccessRate ?? 0) / goal.successRateTarget) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
