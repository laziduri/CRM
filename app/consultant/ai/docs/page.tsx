'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  FileText,
  Plus,
  Zap,
  Download,
  Edit,
  Trash2,
  Copy,
  Check,
  Save,
  FileEdit,
  BookOpen,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface Document {
  id: string
  title: string
  type: 'email' | 'proposal' | 'report' | 'contract' | 'template' | 'other'
  content: string
  aiGenerated: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export default function AIDocsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    // Mock documents
    const mockDocs: Document[] = [
      {
        id: '1',
        title: 'Client Follow-up Email Template',
        type: 'email',
        content: 'Dear [Client Name],\n\nThank you for your interest in our loan advisory services...',
        aiGenerated: true,
        tags: ['template', 'email', 'follow-up'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        title: 'Q1 Performance Report',
        type: 'report',
        content: '# Q1 Performance Report\n\n## Executive Summary\n\nThis quarter showed significant growth...',
        aiGenerated: true,
        tags: ['report', 'q1', 'performance'],
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
      {
        id: '3',
        title: 'Loan Proposal - ABC Trading',
        type: 'proposal',
        content: '# Loan Proposal\n\n## Client: ABC Trading Pte Ltd\n\n## Recommended Loan Products...',
        aiGenerated: false,
        tags: ['proposal', 'client', 'business-loan'],
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-08'),
      },
    ]

    setDocuments(mockDocs)
    setIsLoading(false)
  }, [router])

  const generateDocumentWithAI = async () => {
    if (!aiPrompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/docs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      const data = await response.json()

      if (response.ok && data.document) {
        setDocuments([data.document, ...documents])
        setAiPrompt('')
        setShowCreateModal(false)
        alert('AI generated document successfully!')
      }
    } catch (error) {
      console.error('AI document generation error:', error)
      alert('Failed to generate document. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const enhanceDocumentWithAI = async (docId: string) => {
    const doc = documents.find(d => d.id === docId)
    if (!doc) return

    try {
      const response = await fetch('/api/ai/docs/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId, content: doc.content }),
      })

      const data = await response.json()

      if (response.ok && data.enhancedContent) {
        const updatedDocs = documents.map(d =>
          d.id === docId
            ? { ...d, content: data.enhancedContent, updatedAt: new Date() }
            : d
        )
        setDocuments(updatedDocs)
        alert('Document enhanced successfully!')
      }
    } catch (error) {
      console.error('AI enhancement error:', error)
      alert('Failed to enhance document. Please try again.')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const downloadDocument = (doc: Document) => {
    const blob = new Blob([doc.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.title}.txt`
    a.click()
  }

  const filteredDocs = filterType === 'all'
    ? documents
    : documents.filter(d => d.type === filterType)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Docs Assistant</h1>
                <p className="text-sm text-gray-600">Help writing and organizing docs faster</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Document
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const prompt = prompt('Describe the document you need:')
                  if (prompt) {
                    setAiPrompt(prompt)
                    setShowCreateModal(true)
                  }
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                AI Generate
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Documents
          </button>
          <button
            onClick={() => setFilterType('email')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'email'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Emails
          </button>
          <button
            onClick={() => setFilterType('proposal')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'proposal'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Proposals
          </button>
          <button
            onClick={() => setFilterType('report')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'report'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setFilterType('template')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'template'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Templates
          </button>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                    {doc.aiGenerated && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 capitalize">{doc.type}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{doc.content.substring(0, 150)}...</p>

              {doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadDocument(doc)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => enhanceDocumentWithAI(doc.id)}
                >
                  <Zap className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No documents found</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Document
            </Button>
          </div>
        )}
      </div>

      {/* Document Editor Modal */}
      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.title}
        size="xl"
      >
        {selectedDoc && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={selectedDoc.content}
                onChange={(e) => {
                  const updated = { ...selectedDoc, content: e.target.value }
                  setSelectedDoc(updated)
                }}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(selectedDoc.content)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadDocument(selectedDoc)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => enhanceDocumentWithAI(selectedDoc.id)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  AI Enhance
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setSelectedDoc(null)}>
                  Cancel
                </Button>
                <Button variant="primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Document Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setAiPrompt('')
        }}
        title="Create Document"
        size="lg"
      >
        <div className="space-y-4">
          {aiPrompt && (
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-sm text-gray-700">
                <strong>AI Prompt:</strong> {aiPrompt}
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter document title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="email">Email</option>
              <option value="proposal">Proposal</option>
              <option value="report">Report</option>
              <option value="contract">Contract</option>
              <option value="template">Template</option>
              <option value="other">Other</option>
            </select>
          </div>
          {!aiPrompt && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                placeholder="Start writing or use AI Generate to create content..."
              />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false)
                setAiPrompt('')
              }}
            >
              Cancel
            </Button>
            {aiPrompt ? (
              <Button
                variant="primary"
                onClick={generateDocumentWithAI}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            ) : (
              <Button variant="primary">Create Document</Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
