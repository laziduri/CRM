'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Sparkles,
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar as CalendarIcon,
  User,
  Filter,
  Search,
  Zap,
  Target,
  TrendingUp,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: Date
  startDate?: Date
  duration?: number // in minutes
  projectId?: string
  projectName?: string
  assignee?: string
  estimatedHours?: number
  actualHours?: number
  tags: string[]
  aiSuggested?: boolean
  aiInsights?: string
  dependencies?: string[]
  autoScheduled?: boolean
  scheduledTime?: Date
  scheduleStatus?: 'pending' | 'scheduled' | 'unscheduled'
  hardDeadline?: boolean
  minChunk?: number
  scheduleWorkHours?: boolean
  createdAt: Date
}

export default function AITasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAIInsights, setShowAIInsights] = useState(false)
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    // Mock tasks data
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Review Q1 Marketing Campaign Results',
        description: 'Analyze performance metrics and prepare report',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2024-02-15'),
        projectId: '1',
        projectName: 'Q1 Business Loan Campaign',
        assignee: 'Sarah Chen',
        estimatedHours: 4,
        actualHours: 2,
        tags: ['marketing', 'analysis'],
        aiSuggested: true,
        aiInsights: 'Based on workload analysis, this task should be prioritized. Similar tasks typically take 3-4 hours. Consider scheduling during peak focus hours (9-11 AM).',
        createdAt: new Date('2024-02-01'),
      },
      {
        id: '2',
        title: 'Follow up with ABC Trading Pte Ltd',
        description: 'Contact client regarding loan application status',
        status: 'todo',
        priority: 'urgent',
        dueDate: new Date('2024-02-10'),
        assignee: 'Sarah Chen',
        tags: ['client', 'follow-up'],
        aiSuggested: false,
        aiInsights: 'Client last contacted 3 days ago. High-value deal (S$500K). Recommended action: Call within next 2 hours to maintain engagement.',
        createdAt: new Date('2024-02-05'),
      },
      {
        id: '3',
        title: 'Prepare Monthly Performance Report',
        description: 'Compile statistics and create presentation',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2024-02-20'),
        estimatedHours: 6,
        tags: ['reporting', 'monthly'],
        aiSuggested: true,
        dependencies: ['1'],
        createdAt: new Date('2024-02-08'),
      },
    ]

    setTasks(mockTasks)
    setIsLoading(false)
  }, [router])

  const generateTasksWithAI = async (prompt: string) => {
    try {
      const response = await fetch('/api/ai/tasks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (response.ok && data.tasks) {
        setTasks([...tasks, ...data.tasks])
        alert('AI generated tasks successfully!')
      }
    } catch (error) {
      console.error('AI task generation error:', error)
      alert('Failed to generate tasks. Please try again.')
    }
  }

  const prioritizeTasksWithAI = async () => {
    try {
      const response = await fetch('/api/ai/tasks/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
      })

      const data = await response.json()

      if (response.ok && data.prioritizedTasks) {
        setTasks(data.prioritizedTasks)
        setShowAIInsights(true)
      }
    } catch (error) {
      console.error('AI prioritization error:', error)
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'in-progress':
        return 'bg-blue-100 text-blue-700'
      case 'review':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
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

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority
    const searchMatch =
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    return statusMatch && priorityMatch && searchMatch
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    urgent: tasks.filter((t) => t.priority === 'urgent').length,
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CheckSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Task Manager</h1>
                <p className="text-sm text-gray-600">Intelligent task prioritization and management</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prioritizeTasksWithAI}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Prioritize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  // Auto-schedule all pending tasks
                  const pendingTasks = tasks.filter(t => !t.scheduledTime && t.status !== 'completed')
                  if (pendingTasks.length > 0) {
                    alert(`AI is scheduling ${pendingTasks.length} tasks into your calendar...`)
                    // Call auto-schedule API for each task
                  }
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Auto-Schedule All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const prompt = prompt('Describe tasks you need:')
                  if (prompt) generateTasksWithAI(prompt)
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Target className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    {task.aiSuggested && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Suggested
                      </span>
                    )}
                    {task.autoScheduled && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        Auto-Scheduled
                      </span>
                    )}
                    {task.scheduleStatus === 'pending' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Scheduling...
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                  <div className="flex items-center gap-4 flex-wrap">
                    {task.projectName && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Target className="w-3 h-3" />
                        <span>{task.projectName}</span>
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CalendarIcon className="w-3 h-3" />
                        <span>Due: {task.dueDate.toLocaleDateString()}</span>
                      </div>
                    )}
                    {task.estimatedHours && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{task.estimatedHours}h</span>
                      </div>
                    )}
                    {task.assignee && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{task.assignee}</span>
                      </div>
                    )}
                  </div>

                  {task.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {task.aiInsights && (
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-xs font-medium text-gray-700">AI Insight</span>
                      </div>
                      <p className="text-xs text-gray-700">{task.aiInsights}</p>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tasks found</p>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title}
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-600">{selectedTask.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTask.status)}`}>
                  {selectedTask.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedTask.priority)}`}></div>
                  <span className="text-sm text-gray-900 capitalize">{selectedTask.priority}</span>
                </div>
              </div>
            </div>

            {selectedTask.aiInsights && (
              <div className="p-4 bg-gradient-to-r from-primary/10 to-purple-50 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium text-gray-900">AI Insights</h3>
                </div>
                <p className="text-sm text-gray-700">{selectedTask.aiInsights}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
        size="xl"
      >
        <div className="space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter task description"
            />
          </div>

          {/* Auto-Scheduling Section */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <label className="text-sm font-medium text-gray-900">Auto-scheduled</label>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                autoScheduleEnabled 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {autoScheduleEnabled ? 'Pending' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              AI will automatically schedule this task into your calendar based on priority, deadlines, and availability
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoScheduleEnabled}
                onChange={(e) => setAutoScheduleEnabled(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Enable auto-scheduling</span>
            </label>
          </div>

          {/* Scheduling Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Chunk</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="0">No Chunks</option>
                <option value="15">15 min chunks</option>
                <option value="30">30 min chunks</option>
                <option value="60">1 hour chunks</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
              </select>
            </div>
          </div>

          {/* Schedule Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Hard deadline</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Schedule: Work Hours</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel (Esc)
            </button>
            <Button 
              variant="primary"
              onClick={async () => {
                // Create task and auto-schedule if enabled
                if (autoScheduleEnabled) {
                  // AI will schedule the task
                  alert('Task created! AI is scheduling it into your calendar...')
                }
                setShowCreateModal(false)
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Save task (S)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
