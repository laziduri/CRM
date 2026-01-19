'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Calendar as CalendarIcon,
  Users,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  Zap,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface Project {
  id: string
  name: string
  startDate: Date
  endDate: Date
  progress: number
  tasks: GanttTask[]
  color: string
}

interface GanttTask {
  id: string
  name: string
  startDate: Date
  endDate: Date
  progress: number
  dependencies?: string[]
  assignee?: string
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed'
}

export default function AIGanttPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'quarter'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    // Mock projects with Gantt data
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Q1 Business Loan Campaign',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
        progress: 65,
        color: '#3B82F6',
        tasks: [
          {
            id: 't1',
            name: 'Content Creation',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-15'),
            progress: 100,
            status: 'completed',
            assignee: 'Sarah Chen',
          },
          {
            id: 't2',
            name: 'Campaign Launch',
            startDate: new Date('2024-01-16'),
            endDate: new Date('2024-02-01'),
            progress: 80,
            status: 'in-progress',
            assignee: 'John Doe',
          },
          {
            id: 't3',
            name: 'Performance Analysis',
            startDate: new Date('2024-02-02'),
            endDate: new Date('2024-03-31'),
            progress: 30,
            status: 'in-progress',
            dependencies: ['t2'],
            assignee: 'Sarah Chen',
          },
        ],
      },
      {
        id: '2',
        name: 'Client Onboarding Optimization',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-04-30'),
        progress: 30,
        color: '#10B981',
        tasks: [
          {
            id: 't4',
            name: 'Process Analysis',
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-02-15'),
            progress: 60,
            status: 'in-progress',
            assignee: 'Sarah Chen',
          },
          {
            id: 't5',
            name: 'Automation Implementation',
            startDate: new Date('2024-02-16'),
            endDate: new Date('2024-04-15'),
            progress: 10,
            status: 'not-started',
            dependencies: ['t4'],
            assignee: 'John Doe',
          },
        ],
      },
    ]

    setProjects(mockProjects)
    setIsLoading(false)
  }, [router])

  const generateAISchedule = async () => {
    try {
      const response = await fetch('/api/ai/gantt/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects }),
      })

      const data = await response.json()

      if (response.ok && data.optimizedSchedule) {
        setAiSuggestions(data.optimizedSchedule.suggestions || [])
        if (data.optimizedSchedule.projects) {
          setProjects(data.optimizedSchedule.projects)
        }
      }
    } catch (error) {
      console.error('AI optimization error:', error)
    }
  }

  const getDaysBetween = (start: Date, end: Date) => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getTimelineStart = () => {
    const allDates = projects.flatMap(p => [
      ...p.tasks.map(t => t.startDate),
      ...p.tasks.map(t => t.endDate),
    ])
    if (allDates.length === 0) return new Date()
    return new Date(Math.min(...allDates.map(d => d.getTime())))
  }

  const getTimelineEnd = () => {
    const allDates = projects.flatMap(p => [
      ...p.tasks.map(t => t.startDate),
      ...p.tasks.map(t => t.endDate),
    ])
    if (allDates.length === 0) return new Date()
    return new Date(Math.max(...allDates.map(d => d.getTime())))
  }

  const getDatePosition = (date: Date, timelineStart: Date, timelineEnd: Date, width: number) => {
    const totalDays = getDaysBetween(timelineStart, timelineEnd)
    const daysFromStart = getDaysBetween(timelineStart, date)
    return (daysFromStart / totalDays) * width
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Gantt chart...</p>
        </div>
      </div>
    )
  }

  const timelineStart = getTimelineStart()
  const timelineEnd = getTimelineEnd()
  const timelineWidth = 1200

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Gantt Chart</h1>
                <p className="text-sm text-gray-600">Visualize projects over time with auto-scheduling</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'week' | 'month' | 'quarter')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="week">Week View</option>
                <option value="month">Month View</option>
                <option value="quarter">Quarter View</option>
              </select>
              <Button
                variant="outline"
                onClick={generateAISchedule}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Optimize
              </Button>
              <Button
                variant="primary"
                onClick={() => setSelectedProject(null)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-purple-50 border-b border-primary/20 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-medium text-gray-900">AI Scheduling Recommendations</h3>
            </div>
            <ul className="space-y-1 ml-8">
              {aiSuggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gantt Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Timeline Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Timeline</h3>
                <div className="text-sm text-gray-600">
                  {timelineStart.toLocaleDateString()} - {timelineEnd.toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Projects and Tasks */}
            <div className="p-4">
              {projects.map((project) => (
                <div key={project.id} className="mb-8">
                  {/* Project Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">
                        {project.startDate.toLocaleDateString()} - {project.endDate.toLocaleDateString()} • {project.progress}% complete
                      </p>
                    </div>
                  </div>

                  {/* Project Bar */}
                  <div className="relative mb-4" style={{ height: '40px' }}>
                    <div
                      className="absolute h-6 rounded"
                      style={{
                        left: `${getDatePosition(project.startDate, timelineStart, timelineEnd, timelineWidth)}px`,
                        width: `${getDatePosition(project.endDate, timelineStart, timelineEnd, timelineWidth) - getDatePosition(project.startDate, timelineStart, timelineEnd, timelineWidth)}px`,
                        backgroundColor: project.color,
                        opacity: 0.3,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    ></div>
                    <div
                      className="absolute h-6 rounded"
                      style={{
                        left: `${getDatePosition(project.startDate, timelineStart, timelineEnd, timelineWidth)}px`,
                        width: `${((getDatePosition(project.endDate, timelineStart, timelineEnd, timelineWidth) - getDatePosition(project.startDate, timelineStart, timelineEnd, timelineWidth)) * project.progress) / 100}px`,
                        backgroundColor: project.color,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    ></div>
                  </div>

                  {/* Tasks */}
                  <div className="ml-8 space-y-2">
                    {project.tasks.map((task) => {
                      const taskStart = getDatePosition(task.startDate, timelineStart, timelineEnd, timelineWidth)
                      const taskEnd = getDatePosition(task.endDate, timelineStart, timelineEnd, timelineWidth)
                      const taskWidth = taskEnd - taskStart

                      return (
                        <div key={task.id} className="relative" style={{ height: '32px' }}>
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: project.color }}
                            ></div>
                            <span className="text-sm text-gray-700">{task.name}</span>
                            <span className="text-xs text-gray-500">
                              {task.startDate.toLocaleDateString()} - {task.endDate.toLocaleDateString()}
                            </span>
                            {task.assignee && (
                              <span className="text-xs text-gray-500">• {task.assignee}</span>
                            )}
                          </div>
                          <div
                            className="absolute h-4 rounded"
                            style={{
                              left: `${taskStart}px`,
                              width: `${taskWidth}px`,
                              backgroundColor: task.status === 'completed' ? '#10B981' : task.status === 'delayed' ? '#EF4444' : project.color,
                              opacity: task.status === 'completed' ? 1 : 0.7,
                              top: '50%',
                              transform: 'translateY(-50%)',
                            }}
                          >
                            <div
                              className="h-full bg-white/30 rounded"
                              style={{ width: `${100 - task.progress}%`, marginLeft: 'auto' }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No projects to display</p>
            <Button variant="primary" onClick={() => setSelectedProject(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
