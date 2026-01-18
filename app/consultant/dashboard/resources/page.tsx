'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Copy, CheckCircle2, FileText, User, Building2, Check } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

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

export default function ConsultantResourcesPage() {
  const router = useRouter()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedFullText, setCopiedFullText] = useState<string | null>(null)

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/consultant/dashboard" className="mr-4">
              <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-900" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Loan Document Requirements</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-600">
            Quick reference guide for loan document requirements. Click the copy icon next to any document or use the &quot;Copy All&quot; button to copy the complete list for sharing with clients.
          </p>
        </div>

        {/* Loan Requirements */}
        <div className="space-y-6">
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{requirement.title}</h2>
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
                            <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
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
                <h3 className="font-semibold text-gray-900 mb-3">Quick Copy Templates</h3>
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
        </div>

        {/* Additional Notes */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
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
      </main>
    </div>
  )
}
