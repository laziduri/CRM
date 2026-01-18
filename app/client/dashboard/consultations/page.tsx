'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, Calendar, User, MessageSquare, Download, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'

interface ConsultationSummary {
  id: string
  date: string
  consultant: {
    name: string
    email: string
  }
  type: 'initial' | 'follow-up' | 'application-review'
  loanType?: 'personal' | 'business'
  summary: string
  keyPoints: string[]
  recommendations: string[]
  nextSteps?: string[]
  documents?: Array<{ name: string; uploaded: boolean }>
}

export default function ConsultationSummariesPage() {
  const router = useRouter()
  const [consultations, setConsultations] = useState<ConsultationSummary[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('client_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    fetchConsultations()
  }, [router])

  const fetchConsultations = async () => {
    try {
      // Mock consultation data
      const mockConsultations: ConsultationSummary[] = [
        {
          id: '1',
          date: '2024-01-20',
          consultant: {
            name: 'Sarah Chen',
            email: 'sarah.chen@brillianceadvisory.com',
          },
          type: 'initial',
          loanType: 'personal',
          summary: 'Initial consultation to discuss personal loan needs for home renovation. Reviewed financial situation, credit profile, and discussed suitable loan options.',
          keyPoints: [
            'Discussed loan amount requirement of $50,000 for home renovation',
            'Reviewed credit score (CBS: 1850 - Good)',
            'Current DSR is 45%, which is within acceptable limits',
            'Employment status: Full-time salaried, 3 years with current employer',
          ],
          recommendations: [
            'Consider applying with 3-4 banks for comparison',
            'Prepare additional documentation: latest 6 months payslips',
            'Maintain current credit utilization levels',
            'Apply within next 2 weeks to take advantage of current promotions',
          ],
          nextSteps: [
            'Complete loan readiness checklist items',
            'Gather required documentation',
            'Schedule follow-up consultation in 1 week',
          ],
        },
        {
          id: '2',
          date: '2024-01-15',
          consultant: {
            name: 'Sarah Chen',
            email: 'sarah.chen@brillianceadvisory.com',
          },
          type: 'follow-up',
          loanType: 'business',
          summary: 'Follow-up consultation to review business loan options for working capital needs. Discussed business financials and eligibility criteria.',
          keyPoints: [
            'Business established for 2 years, ACRA registered',
            'Annual revenue: $800,000, steady growth trend',
            'Required working capital: $200,000',
            'Current business debt: $150,000',
          ],
          recommendations: [
            'Structure application to highlight strong revenue growth',
            'Consider term loan with flexible repayment schedule',
            'Provide detailed cashflow projections',
          ],
          nextSteps: [
            'Prepare financial statements for last 2 years',
            'Update business plan with growth projections',
            'Review loan terms before final decision',
          ],
        },
        {
          id: '3',
          date: '2024-01-10',
          consultant: {
            name: 'Sarah Chen',
            email: 'sarah.chen@brillianceadvisory.com',
          },
          type: 'application-review',
          loanType: 'personal',
          summary: 'Application review session. Reviewed loan offers received and provided guidance on selection and next steps.',
          keyPoints: [
            'Received 3 loan offers from different banks',
            'Best rate: 4.5% EIR from Bank A',
            'All offers within expected range',
            'Application processing timeline: 5-7 business days',
          ],
          recommendations: [
            'Accept offer from Bank A - best rate and terms',
            'Review loan agreement carefully before signing',
            'Set up automatic payment for monthly installments',
          ],
          nextSteps: [
            'Accept loan offer by end of week',
            'Submit final documentation',
            'Await disbursement confirmation',
          ],
        },
      ]
      setConsultations(mockConsultations)
    } catch (error) {
      console.error('Error fetching consultations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedConsultation = consultations.find(c => c.id === selectedId)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'initial':
        return 'Initial Consultation'
      case 'follow-up':
        return 'Follow-up'
      case 'application-review':
        return 'Application Review'
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
            <h1 className="text-2xl font-bold text-gray-900">Consultation Summaries</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Consultations List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">All Consultations</h2>
                <p className="text-sm text-gray-600 mt-1">{consultations.length} total</p>
              </div>
              <div className="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
                {consultations.map((consultation) => (
                  <button
                    key={consultation.id}
                    onClick={() => setSelectedId(consultation.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedId === consultation.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-primary">
                        {getTypeLabel(consultation.type)}
                      </span>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {formatDate(consultation.date)}
                    </p>
                    {consultation.loanType && (
                      <span className="text-xs text-gray-500 capitalize">
                        {consultation.loanType} loan
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Consultation Details */}
          <div className="lg:col-span-2">
            {selectedConsultation ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {getTypeLabel(selectedConsultation.type)}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(selectedConsultation.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {selectedConsultation.consultant.name}
                        </span>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                  {selectedConsultation.loanType && (
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {selectedConsultation.loanType.charAt(0).toUpperCase() + selectedConsultation.loanType.slice(1)} Loan
                    </span>
                  )}
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedConsultation.summary}</p>
                </div>

                {/* Key Points */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Discussion Points</h3>
                  <ul className="space-y-2">
                    {selectedConsultation.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-primary mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {selectedConsultation.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-teal mt-1">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps */}
                {selectedConsultation.nextSteps && selectedConsultation.nextSteps.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Steps</h3>
                    <ul className="space-y-2">
                      {selectedConsultation.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-600 mt-1">→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contact Consultant */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Questions about this consultation?</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedConsultation.consultant.name}
                      </p>
                      <p className="text-sm text-gray-600">{selectedConsultation.consultant.email}</p>
                    </div>
                    <Button variant="primary" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Consultant
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Consultation</h3>
                <p className="text-gray-600">
                  Choose a consultation from the list to view its summary and details.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
