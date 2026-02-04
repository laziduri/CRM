'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Sparkles,
  FolderKanban,
  Target,
  Calendar as CalendarIcon,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Zap,
  FileText,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  clientId?: string
  clientName?: string
  dealId?: string
  progress: number
  startDate: Date
  endDate: Date
  assignees: string[]
  milestones: Milestone[]
  aiInsights?: string
  createdAt: Date
}

interface Milestone {
  id: string
  title: string
  description: string
  dueDate: Date
  status: 'pending' | 'in-progress' | 'completed'
  completedDate?: Date
}

export default function AIProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/crm')
      return
    }

    // Mock projects data
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Q1 Business Loan Campaign',
        description: 'Marketing campaign for business loans targeting SMEs',
        status: 'active',
        priority: 'high',
        clientId: '1',
        clientName: 'ABC Trading Pte Ltd',
        progress: 65,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
        assignees: ['Sarah Chen', 'John Doe'],
        milestones: [
          {
            id: 'm1',
            title: 'Content Creation',
            description: 'Create marketing materials',
            dueDate: new Date('2024-01-15'),
            status: 'completed',
            completedDate: new Date('2024-01-14'),
          },
          {
            id: 'm2',
            title: 'Launch Campaign',
            description: 'Launch across all channels',
            dueDate: new Date('2024-02-01'),
            status: 'in-progress',
          },
        ],
        aiInsights: 'Based on similar campaigns, expect 20% higher engagement if launched mid-week. Consider budget allocation for peak conversion periods.',
        createdAt: new Date('2023-12-15'),
      },
      {
        id: '2',
        name: 'Client Onboarding Process Optimization',
        description: 'Streamline the client onboarding workflow',
        status: 'planning',
        priority: 'medium',
        progress: 30,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-04-30'),
        assignees: ['Sarah Chen'],
        milestones: [
          {
            id: 'm3',
            title: 'Process Analysis',
            description: 'Analyze current onboarding steps',
            dueDate: new Date('2024-02-15'),
            status: 'in-progress',
          },
        ],
        aiInsights: 'Automation potential identified: 40% of steps can be automated. Estimated time savings: 15 hours/week per consultant.',
        createdAt: new Date('2024-01-20'),
      },
    ]

    setProjects(mockProjects)
    setIsLoading(false)
  }, [router])

  const generateProjectWithAI = async () => {
    if (!aiPrompt.trim()) return

    setIsGenerating(true)
    try {
      // Call AI API to generate project structure
      const response = await fetch('/api/ai/projects/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      const data = await response.json()

      if (response.ok && data.project) {
        // Auto-fill create form with AI-generated project
        setShowCreateModal(true)
        // In real implementation, populate form fields
        alert('AI generated project structure! Please review and customize.')
      }
    } catch (error) {
      console.error('AI generation error:', error)
      alert('Failed to generate project. Please try again.')
    } finally {
      setIsGenerating(false)
      setAiPrompt('')
    }
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-700'
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-400'
    }
  }

  const filteredProjects = filterStatus === 'all'
    ? projects
    : projects.filter(p => p.status === filterStatus)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
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
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Project Manager</h1>
                <p className="text-sm text-gray-600">Intelligent project management with AI assistance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const userPrompt = window.prompt('Describe your project idea:')
                  if (userPrompt) {
                    setAiPrompt(userPrompt)
                    generateProjectWithAI()
                  }
                }}
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
                    AI Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Quick Generate */}
      {aiPrompt && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-gradient-to-r from-primary/10 to-purple-50 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-sm text-gray-700">
                  <strong>AI Prompt:</strong> {aiPrompt}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setAiPrompt('')}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'active'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus('planning')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'planning'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Planning
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'completed'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} title={project.priority}></div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">Progress</span>
                    <span className="text-xs font-semibold text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{project.startDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>{project.milestones.length} milestones</span>
                  </div>
                </div>

                {project.clientName && (
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">{project.clientName}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                {project.aiInsights && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Insights</span>
                  </div>
                )}
              </div>

              {project.aiInsights && (
                <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-xs text-gray-700">{project.aiInsights}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderKanban className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No projects found</p>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.name}
        size="xl"
      >
        {selectedProject && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-600">{selectedProject.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                  {selectedProject.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedProject.priority)}`}></div>
                  <span className="text-sm text-gray-900 capitalize">{selectedProject.priority}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${selectedProject.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{selectedProject.progress}% complete</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Milestones</h3>
              <div className="space-y-3">
                {selectedProject.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{milestone.title}</h4>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          milestone.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : milestone.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {milestone.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{milestone.description}</p>
                    <p className="text-xs text-gray-500">
                      Due: {milestone.dueDate.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {selectedProject.aiInsights && (
              <div className="p-4 bg-gradient-to-r from-primary/10 to-purple-50 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium text-gray-900">AI Insights</h3>
                </div>
                <p className="text-sm text-gray-700">{selectedProject.aiInsights}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter project description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
