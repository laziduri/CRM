'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  Building2,
  Edit,
  Eye,
  Download,
  Tag
} from 'lucide-react'
import Button from '@/components/ui/Button'

interface Summary {
  id: string
  clientId: string
  clientName: string
  clientType: 'personal' | 'business'
  title: string
  consultationDate: Date
  type: 'initial' | 'follow-up' | 'closing' | 'other'
  status: 'draft' | 'completed' | 'shared'
  summary: string
  keyPoints: string[]
  recommendations: string[]
  nextSteps: string[]
  tags?: string[]
  loanAmount?: number
  loanType?: string
  createdAt: Date
  updatedAt: Date
}

export default function SummariesPage() {
  const router = useRouter()
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'initial' | 'follow-up' | 'closing' | 'other'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'completed' | 'shared'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    // Mock data
    const mockSummaries: Summary[] = [
      {
        id: '1',
        clientId: '1',
        clientName: 'John Doe',
        clientType: 'personal',
        title: 'Initial Consultation - Personal Loan Inquiry',
        consultationDate: new Date('2024-01-15'),
        type: 'initial',
        status: 'completed',
        summary: 'Client is seeking a personal loan of $50,000 for home renovation. Reviewed their financial situation, credit score, and employment status. Client has stable income and good credit history.',
        keyPoints: [
          'Monthly income: $6,000',
          'Credit score: 750',
          'Employment: 5 years at current company',
          'Existing loans: $20,000 car loan',
        ],
        recommendations: [
          'Recommended personal loan from DBS with 3.88% interest rate',
          'Loan amount: $50,000 over 36 months',
          'Expected approval within 3-5 business days',
        ],
        nextSteps: [
          'Submit application by January 20, 2024',
          'Provide latest 3 months payslips',
          'Submit CBS credit report',
        ],
        tags: ['High Priority', 'Personal Loan', 'Home Renovation'],
        loanAmount: 50000,
        loanType: 'Personal Loan',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        clientId: '2',
        clientName: 'ABC Trading Pte Ltd',
        clientType: 'business',
        title: 'Business Loan Consultation - Expansion Funding',
        consultationDate: new Date('2024-01-10'),
        type: 'initial',
        status: 'completed',
        summary: 'Business is seeking $150,000 business loan for expansion. Company is profitable with 3 years of operation. Reviewed financial statements, bank statements, and business plans.',
        keyPoints: [
          'Annual revenue: $500,000',
          'Profitable for 2+ years',
          '3 years in operation',
          'No existing business loans',
        ],
        recommendations: [
          'Recommended business loan from OCBC',
          'Interest rate: 4.5% per annum',
          'Tenure: 60 months',
        ],
        nextSteps: [
          'Submit ACRA profile',
          'Provide 2 years financial statements',
          'Submit bank statements (6 months)',
          'Submit business plan',
        ],
        tags: ['Business Loan', 'Expansion', 'SME'],
        loanAmount: 150000,
        loanType: 'Business Loan',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
      },
      {
        id: '3',
        clientId: '3',
        clientName: 'Jane Smith',
        clientType: 'personal',
        title: 'Follow-up - Application Status Update',
        consultationDate: new Date('2024-01-12'),
        type: 'follow-up',
        status: 'shared',
        summary: 'Follow-up call to update client on loan application status. Application is currently under review. Provided timeline and next steps.',
        keyPoints: [
          'Application submitted on January 5, 2024',
          'Status: Under review',
          'Expected decision: January 18, 2024',
        ],
        recommendations: [
          'Continue monitoring application status',
          'Be available for any additional information requests',
        ],
        nextSteps: [
          'Follow up with bank if no response by January 18',
          'Prepare additional documents if requested',
        ],
        tags: ['Follow-up', 'Status Update'],
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      },
      {
        id: '4',
        clientId: '1',
        clientName: 'John Doe',
        clientType: 'personal',
        title: 'Draft - Closing Summary',
        consultationDate: new Date('2024-01-16'),
        type: 'closing',
        status: 'draft',
        summary: '',
        keyPoints: [],
        recommendations: [],
        nextSteps: [],
        tags: ['Draft'],
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
      },
    ]

    setSummaries(mockSummaries)
  }, [router])

  const filteredSummaries = summaries.filter(summary => {
    const matchesSearch = summary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         summary.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || summary.type === filterType
    const matchesStatus = filterStatus === 'all' || summary.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'initial':
        return 'bg-blue-100 text-blue-700'
      case 'follow-up':
        return 'bg-purple-100 text-purple-700'
      case 'closing':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'shared':
        return 'bg-blue-100 text-blue-700'
      case 'draft':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Consultation Summaries</h1>
                <p className="text-sm text-gray-600">Manage your client consultation notes</p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4" />
              New Summary
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search summaries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="initial">Initial</option>
              <option value="follow-up">Follow-up</option>
              <option value="closing">Closing</option>
              <option value="other">Other</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="shared">Shared</option>
            </select>
          </div>
        </div>

        {/* Summaries List */}
        <div className="space-y-4">
          {filteredSummaries.map((summary) => (
            <div
              key={summary.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${summary.clientType === 'personal' ? 'bg-primary/10' : 'bg-teal/10'}`}>
                      {summary.clientType === 'personal' ? (
                        <User className="w-5 h-5 text-primary" />
                      ) : (
                        <Building2 className="w-5 h-5 text-teal" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{summary.title}</h3>
                      <Link
                        href={`/consultant/clients/${summary.clientId}`}
                        className="text-sm text-primary hover:text-primary-dark"
                      >
                        {summary.clientName}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(summary.type)}`}>
                    {summary.type.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(summary.status)}`}>
                    {summary.status}
                  </span>
                </div>
              </div>

              {summary.summary && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{summary.summary}</p>
              )}

              {summary.tags && summary.tags.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {summary.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{summary.consultationDate.toLocaleDateString()}</span>
                  </div>
                  {summary.loanAmount && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>${summary.loanAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/consultant/summaries/${summary.id}`}
                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSummaries.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No summaries found</p>
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-2 mx-auto"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4" />
              Create Your First Summary
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
