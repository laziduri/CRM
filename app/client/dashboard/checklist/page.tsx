'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Circle, FileText, Plus, Building2, User, Trash2, Edit2 } from 'lucide-react'
import Button from '@/components/ui/Button'

interface DocumentItem {
  id: string
  name: string
  description: string
  uploaded: boolean
  fileUrl?: string
  uploadedAt?: Date
}

interface BusinessProfile {
  id: string
  name: string
  uen?: string
  createdAt: Date
}

interface ChecklistSection {
  type: 'personal' | 'business'
  profileId?: string // For business profiles
  documents: DocumentItem[]
}

// Personal loan documents (3 required)
const PERSONAL_DOCUMENTS: Omit<DocumentItem, 'uploaded' | 'fileUrl' | 'uploadedAt'>[] = [
  { id: 'personal-ic', name: 'IC Front & Back', description: 'Front and back sides of your Identity Card' },
  { id: 'personal-noa', name: 'Past 2 Years NOA', description: 'Notice of Assessment from IRAS for the past 2 years' },
  { id: 'personal-cbs', name: 'CBS Report', description: 'Credit Bureau Singapore credit report' },
]

// Business loan documents (6 required)
const BUSINESS_DOCUMENTS: Omit<DocumentItem, 'uploaded' | 'fileUrl' | 'uploadedAt'>[] = [
  { id: 'business-ic-directors', name: 'IC Front & Back (All Directors)', description: 'Identity Card (front and back) of all company directors' },
  { id: 'business-noa', name: 'Past 2 Years NOA', description: 'Notice of Assessment from IRAS for the past 2 years (all directors)' },
  { id: 'business-cbs', name: 'CBS Report', description: 'Credit Bureau Singapore credit report (all directors)' },
  { id: 'business-bank-statements', name: 'Past 6 Months Bank Statements', description: 'Business bank statements from the past 6 months' },
  { id: 'business-acra', name: 'ACRA Profile', description: 'ACRA business profile or incorporation documents' },
  { id: 'business-financial-statements', name: 'Past 2 Years Financial Statements', description: 'Audited or unaudited financial statements for the past 2 years' },
]

export default function LoanReadinessChecklistPage() {
  const router = useRouter()
  const [sections, setSections] = useState<ChecklistSection[]>([])
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([])
  const [selectedBusinessProfile, setSelectedBusinessProfile] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddBusinessModal, setShowAddBusinessModal] = useState(false)
  const [newBusinessName, setNewBusinessName] = useState('')
  const [newBusinessUEN, setNewBusinessUEN] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('client_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      // Mock data - in production, fetch from API
      const mockPersonalDocs: DocumentItem[] = PERSONAL_DOCUMENTS.map(doc => ({
        ...doc,
        uploaded: false,
      }))

      const mockBusinessProfiles: BusinessProfile[] = [
        { id: '1', name: 'ABC Trading Pte Ltd', uen: '201234567A', createdAt: new Date('2024-01-15') },
      ]

      const mockBusinessDocs: DocumentItem[] = BUSINESS_DOCUMENTS.map(doc => ({
        ...doc,
        uploaded: false,
      }))

      setSections([
        { type: 'personal', documents: mockPersonalDocs },
        ...mockBusinessProfiles.map(profile => ({
          type: 'business' as const,
          profileId: profile.id,
          documents: mockBusinessDocs,
        })),
      ])

      setBusinessProfiles(mockBusinessProfiles)
      if (mockBusinessProfiles.length > 0) {
        setSelectedBusinessProfile(mockBusinessProfiles[0].id)
      }
    } catch (error) {
      console.error('Error fetching checklist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDocument = (sectionType: 'personal' | 'business', profileId: string | undefined, docId: string) => {
    setSections(prev =>
      prev.map(section => {
        if (section.type === sectionType && section.profileId === profileId) {
          return {
            ...section,
            documents: section.documents.map(doc =>
              doc.id === docId
                ? { ...doc, uploaded: !doc.uploaded, uploadedAt: !doc.uploaded ? new Date() : undefined }
                : doc
            ),
          }
        }
        return section
      })
    )
  }

  const addBusinessProfile = () => {
    if (!newBusinessName.trim()) return

    const newProfile: BusinessProfile = {
      id: Date.now().toString(),
      name: newBusinessName.trim(),
      uen: newBusinessUEN.trim() || undefined,
      createdAt: new Date(),
    }

    const newBusinessDocs: DocumentItem[] = BUSINESS_DOCUMENTS.map(doc => ({
      ...doc,
      uploaded: false,
    }))

    setBusinessProfiles(prev => [...prev, newProfile])
    setSections(prev => [
      ...prev,
      {
        type: 'business',
        profileId: newProfile.id,
        documents: newBusinessDocs,
      },
    ])

    setSelectedBusinessProfile(newProfile.id)
    setNewBusinessName('')
    setNewBusinessUEN('')
    setShowAddBusinessModal(false)
  }

  const deleteBusinessProfile = (profileId: string) => {
    setBusinessProfiles(prev => prev.filter(p => p.id !== profileId))
    setSections(prev => prev.filter(s => s.profileId !== profileId))
    if (selectedBusinessProfile === profileId) {
      const remaining = businessProfiles.filter(p => p.id !== profileId)
      setSelectedBusinessProfile(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  const getBusinessProfile = (profileId: string | undefined) => {
    if (!profileId) return null
    return businessProfiles.find(p => p.id === profileId)
  }

  const personalSection = sections.find(s => s.type === 'personal')
  const businessSections = sections.filter(s => s.type === 'business')

  const personalCompleted = personalSection?.documents.filter(d => d.uploaded).length || 0
  const personalTotal = personalSection?.documents.length || 0
  const personalPercentage = personalTotal > 0 ? Math.round((personalCompleted / personalTotal) * 100) : 0

  const businessCompleted = businessSections.reduce(
    (sum, section) => sum + section.documents.filter(d => d.uploaded).length,
    0
  )
  const businessTotal = businessSections.reduce((sum, section) => sum + section.documents.length, 0)
  const businessPercentage = businessTotal > 0 ? Math.round((businessCompleted / businessTotal) * 100) : 0

  const overallCompleted = personalCompleted + businessCompleted
  const overallTotal = personalTotal + businessTotal
  const overallPercentage = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0

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
            <h1 className="text-2xl font-bold text-gray-900">Loan Readiness Checklist</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Overall Progress</h2>
            <span className="text-2xl font-bold text-primary">{overallPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-primary to-teal h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Personal Documents</p>
              <p className="text-lg font-semibold text-gray-900">
                {personalCompleted}/{personalTotal} ({personalPercentage}%)
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Business Documents</p>
              <p className="text-lg font-semibold text-gray-900">
                {businessCompleted}/{businessTotal} ({businessPercentage}%)
              </p>
            </div>
          </div>
        </div>

        {/* Personal Loan Documents Section */}
        {personalSection && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Loan Documents
                <span className="text-sm font-normal text-gray-500">
                  ({personalCompleted}/{personalTotal})
                </span>
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Required documents for personal loan applications (3 documents required)
            </p>
            <div className="space-y-3">
              {personalSection.documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    doc.uploaded
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleDocument('personal', undefined, doc.id)}
                      className="flex-shrink-0 mt-0.5"
                      aria-label={doc.uploaded ? 'Mark as not uploaded' : 'Mark as uploaded'}
                    >
                      {doc.uploaded ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-medium mb-1 ${
                          doc.uploaded ? 'text-gray-600 line-through' : 'text-gray-900'
                        }`}
                      >
                        {doc.name}
                      </h4>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                      {doc.uploadedAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Uploaded on {doc.uploadedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business Loan Documents Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal" />
              Business Loan Documents
              <span className="text-sm font-normal text-gray-500">
                ({businessCompleted}/{businessTotal})
              </span>
            </h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAddBusinessModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Business
            </Button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Required documents for business loan applications. Each business profile has its own set of documents (6 documents required per business).
          </p>

          {/* Business Profile Tabs */}
          {businessProfiles.length > 0 && (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              {businessProfiles.map((profile) => {
                const section = businessSections.find(s => s.profileId === profile.id)
                const completed = section?.documents.filter(d => d.uploaded).length || 0
                const total = section?.documents.length || 0

                return (
                  <div
                    key={profile.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all min-w-fit ${
                      selectedBusinessProfile === profile.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedBusinessProfile(profile.id)}
                  >
                    <Building2 className={`w-4 h-4 ${selectedBusinessProfile === profile.id ? 'text-primary' : 'text-gray-600'}`} />
                    <div>
                      <p className={`text-sm font-medium ${selectedBusinessProfile === profile.id ? 'text-primary' : 'text-gray-900'}`}>
                        {profile.name}
                      </p>
                      {profile.uen && (
                        <p className="text-xs text-gray-500">UEN: {profile.uen}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">({completed}/{total})</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm(`Are you sure you want to delete ${profile.name}? This will remove all associated documents.`)) {
                          deleteBusinessProfile(profile.id)
                        }
                      }}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Selected Business Documents */}
          {selectedBusinessProfile && businessSections.length > 0 && (
            <div className="space-y-3">
              {businessSections
                .find(s => s.profileId === selectedBusinessProfile)
                ?.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      doc.uploaded
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleDocument('business', selectedBusinessProfile, doc.id)}
                        className="flex-shrink-0 mt-0.5"
                        aria-label={doc.uploaded ? 'Mark as not uploaded' : 'Mark as uploaded'}
                      >
                        {doc.uploaded ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium mb-1 ${
                            doc.uploaded ? 'text-gray-600 line-through' : 'text-gray-900'
                          }`}
                        >
                          {doc.name}
                        </h4>
                        <p className="text-sm text-gray-600">{doc.description}</p>
                        {doc.uploadedAt && (
                          <p className="text-xs text-green-600 mt-1">
                            Uploaded on {doc.uploadedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {businessProfiles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="mb-4">No business profiles added yet.</p>
              <Button variant="secondary" size="sm" onClick={() => setShowAddBusinessModal(true)}>
                Add Your First Business
              </Button>
            </div>
          )}
        </div>

        {/* Add Business Modal */}
        {showAddBusinessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Business Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={newBusinessName}
                    onChange={(e) => setNewBusinessName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., ABC Trading Pte Ltd"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UEN (Optional)
                  </label>
                  <input
                    type="text"
                    value={newBusinessUEN}
                    onChange={(e) => setNewBusinessUEN(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 201234567A"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowAddBusinessModal(false)
                    setNewBusinessName('')
                    setNewBusinessUEN('')
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={addBusinessProfile}>
                  Add Business
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
