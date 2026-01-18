'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Workflow,
  Play,
  Plus,
  Zap,
  FileText,
  CheckCircle2,
  Clock,
  Users,
  Settings,
  Copy,
  Edit,
  Trash2,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: 'client-onboarding' | 'loan-application' | 'follow-up' | 'documentation' | 'custom'
  steps: WorkflowStep[]
  estimatedDuration: number
  aiGenerated: boolean
  usageCount: number
  createdAt: Date
}

interface WorkflowStep {
  id: string
  name: string
  description: string
  type: 'task' | 'approval' | 'notification' | 'automation'
  assignee?: string
  dueDays?: number
  required: boolean
  order: number
}

interface ActiveWorkflow {
  id: string
  templateId: string
  templateName: string
  clientId?: string
  clientName?: string
  projectId?: string
  currentStep: number
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  startedAt: Date
  completedAt?: Date
}

export default function AIWorkflowsPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [activeWorkflows, setActiveWorkflows] = useState<ActiveWorkflow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    // Mock workflow templates
    const mockTemplates: WorkflowTemplate[] = [
      {
        id: '1',
        name: 'Client Onboarding Workflow',
        description: 'Standard workflow for onboarding new clients',
        category: 'client-onboarding',
        estimatedDuration: 7,
        aiGenerated: false,
        usageCount: 45,
        createdAt: new Date('2024-01-01'),
        steps: [
          {
            id: 's1',
            name: 'Initial Consultation',
            description: 'Schedule and conduct initial consultation',
            type: 'task',
            assignee: 'Consultant',
            dueDays: 1,
            required: true,
            order: 1,
          },
          {
            id: 's2',
            name: 'Document Collection',
            description: 'Collect required documents from client',
            type: 'task',
            assignee: 'Client',
            dueDays: 3,
            required: true,
            order: 2,
          },
          {
            id: 's3',
            name: 'Application Review',
            description: 'Review and prepare loan application',
            type: 'approval',
            assignee: 'Consultant',
            dueDays: 2,
            required: true,
            order: 3,
          },
          {
            id: 's4',
            name: 'Submit Application',
            description: 'Submit application to lender',
            type: 'automation',
            required: true,
            order: 4,
          },
        ],
      },
      {
        id: '2',
        name: 'Loan Application Follow-up',
        description: 'Automated follow-up workflow for loan applications',
        category: 'follow-up',
        estimatedDuration: 14,
        aiGenerated: true,
        usageCount: 23,
        createdAt: new Date('2024-01-15'),
        steps: [
          {
            id: 's5',
            name: 'Application Submitted',
            description: 'Notify client of submission',
            type: 'notification',
            required: true,
            order: 1,
          },
          {
            id: 's6',
            name: 'Status Check (Day 3)',
            description: 'Check application status with lender',
            type: 'task',
            assignee: 'Consultant',
            dueDays: 3,
            required: true,
            order: 2,
          },
          {
            id: 's7',
            name: 'Client Update (Day 5)',
            description: 'Update client on progress',
            type: 'notification',
            required: true,
            order: 3,
          },
          {
            id: 's8',
            name: 'Final Status Check',
            description: 'Final check before decision',
            type: 'task',
            assignee: 'Consultant',
            dueDays: 14,
            required: true,
            order: 4,
          },
        ],
      },
    ]

    // Mock active workflows
    const mockActive: ActiveWorkflow[] = [
      {
        id: 'aw1',
        templateId: '1',
        templateName: 'Client Onboarding Workflow',
        clientId: '1',
        clientName: 'ABC Trading Pte Ltd',
        currentStep: 2,
        status: 'active',
        startedAt: new Date('2024-02-01'),
      },
    ]

    setTemplates(mockTemplates)
    setActiveWorkflows(mockActive)
    setIsLoading(false)
  }, [router])

  const generateWorkflowWithAI = async () => {
    if (!aiPrompt.trim()) return

    try {
      const response = await fetch('/api/ai/workflows/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      const data = await response.json()

      if (response.ok && data.workflow) {
        setTemplates([...templates, data.workflow])
        setAiPrompt('')
        alert('AI generated workflow successfully!')
      }
    } catch (error) {
      console.error('AI workflow generation error:', error)
      alert('Failed to generate workflow. Please try again.')
    }
  }

  const startWorkflow = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return

    const newWorkflow: ActiveWorkflow = {
      id: `aw${Date.now()}`,
      templateId,
      templateName: template.name,
      currentStep: 0,
      status: 'active',
      startedAt: new Date(),
    }

    setActiveWorkflows([...activeWorkflows, newWorkflow])
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workflows...</p>
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
                <Workflow className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Workflows</h1>
                <p className="text-sm text-gray-600">Automate repeatable projects and SOPs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const userPrompt = window.prompt('Describe the workflow you need:')
                  if (userPrompt) {
                    setAiPrompt(userPrompt)
                    generateWorkflowWithAI()
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
        {/* Active Workflows */}
        {activeWorkflows.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Workflows</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeWorkflows.map((workflow) => {
                const template = templates.find(t => t.id === workflow.templateId)
                const progress = template ? (workflow.currentStep / template.steps.length) * 100 : 0

                return (
                  <div
                    key={workflow.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{workflow.templateName}</h3>
                        {workflow.clientName && (
                          <p className="text-sm text-gray-600 mt-1">{workflow.clientName}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        workflow.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        workflow.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {workflow.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Progress</span>
                        <span className="text-xs font-semibold text-gray-900">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    {template && (
                      <p className="text-xs text-gray-500">
                        Step {workflow.currentStep + 1} of {template.steps.length}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Workflow Templates */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Workflow Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      {template.aiGenerated && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{template.estimatedDuration} days</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <FileText className="w-3 h-3" />
                    <span>{template.steps.length} steps</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Play className="w-3 h-3" />
                    <span>Used {template.usageCount} times</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => startWorkflow(template.id)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Workflow
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Workflow className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No workflow templates yet</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        )}
      </div>

      {/* Template Detail Modal */}
      <Modal
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        title={selectedTemplate?.name}
        size="xl"
      >
        {selectedTemplate && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Workflow Steps</h3>
              <div className="space-y-3">
                {selectedTemplate.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{step.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        step.type === 'automation' ? 'bg-green-100 text-green-700' :
                        step.type === 'approval' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {step.type}
                      </span>
                    </div>
                    {step.assignee && (
                      <p className="text-xs text-gray-600 ml-11">Assignee: {step.assignee}</p>
                    )}
                    {step.dueDays && (
                      <p className="text-xs text-gray-600 ml-11">Due: {step.dueDays} days</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Template Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Workflow Template"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter template name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter description"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">Create Template</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
