'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckSquare } from 'lucide-react'
import TaskProgressBar from '@/components/tasks/TaskProgressBar'
import TaskQuickAdd from '@/components/tasks/TaskQuickAdd'
import TaskList from '@/components/tasks/TaskList'
import CompletedTasksSection from '@/components/tasks/CompletedTasksSection'
import type { Task } from '@/types'

interface Consultant {
  id: string
  name: string
}

interface Client {
  id: string
  name: string
}

export default function TasksPage() {
  const router = useRouter()
  const [consultant, setConsultant] = useState<Consultant | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [teammates, setTeammates] = useState<Consultant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const consultantId = localStorage.getItem('consultant_id')
      const consultantToken = localStorage.getItem('consultant_token')

      if (!consultantId || !consultantToken) {
        router.push('/consultant/login')
        return
      }

      // Load consultant info
      const consultantRes = await fetch(`/api/consultant/${consultantId}`)
      if (consultantRes.ok) {
        const consultantData = await consultantRes.json()
        setConsultant(consultantData.consultant)
      }

      // Load tasks
      const tasksRes = await fetch('/api/consultant/tasks', {
        headers: {
          'x-consultant-id': consultantId,
        },
      })
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        const loadedTasks = tasksData.tasks || []
        setTasks(loadedTasks)

        // Extract clients from tasks
        const clientMap = new Map<string, string>()
        loadedTasks.forEach((task: Task) => {
          if (task.clientId && task.clientName) {
            clientMap.set(task.clientId, task.clientName)
          }
        })
        setClients(Array.from(clientMap.entries()).map(([id, name]) => ({ id, name })))
      }

      // Load teammates (simplified - you may want to create a proper endpoint)
      // For now, empty array - will be populated when delegation is implemented
      setTeammates([])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTask = async (taskData: Partial<Task>) => {
    try {
      const consultantId = localStorage.getItem('consultant_id')
      if (!consultantId) return

      const response = await fetch('/api/consultant/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': consultantId,
        },
        body: JSON.stringify({
          title: taskData.title,
          startTime: taskData.startTime?.toISOString(),
          endTime: taskData.endTime?.toISOString(),
          deadline: taskData.deadline?.toISOString(),
          startDate: taskData.startDate?.toISOString().split('T')[0],
          clientId: taskData.clientId,
          assigneeId: taskData.assigneeId,
          priority: taskData.priority || 'medium',
          taskType: taskData.taskType || 'other',
          status: taskData.status || 'pending',
          estimatedDuration: taskData.estimatedDuration || 30,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTasks((prev) => [data.task, ...prev])
        // Reload to get updated list
        await loadData()
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create task' }))
        const errorMessage = errorData.details || errorData.error || 'Failed to create task'
        console.error('API Error:', errorData)
        alert(`Failed to add task: ${errorMessage}`)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Error adding task:', error)
      // Only show alert if we haven't already shown one
      if (error instanceof Error && !error.message.includes('Failed to add task:')) {
        alert('Failed to add task. Please try again.')
      }
    }
  }

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const consultantId = localStorage.getItem('consultant_id')
      if (!consultantId) return

      const response = await fetch('/api/consultant/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': consultantId,
        },
        body: JSON.stringify({
          id: taskId,
          status: completed ? 'completed' : 'pending',
          completedAt: completed ? new Date().toISOString() : null,
        }),
      })

      if (response.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, status: completed ? 'completed' : 'pending', completedAt: completed ? new Date() : undefined }
              : task
          )
        )
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDelete = async (taskId: string) => {
    try {
      const consultantId = localStorage.getItem('consultant_id')
      if (!consultantId) return

      const response = await fetch(`/api/consultant/tasks?id=${taskId}`, {
        method: 'DELETE',
        headers: {
          'x-consultant-id': consultantId,
        },
      })

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    let timeOfDay = 'Good evening'
    if (hour < 12) timeOfDay = 'Good morning'
    else if (hour < 18) timeOfDay = 'Good afternoon'

    return `${timeOfDay}${consultant?.name ? `, ${consultant.name.split(' ')[0]}` : ''}`
  }

  const activeTasks = tasks.filter((task) => task.status !== 'completed')
  const completedTasks = tasks.filter((task) => task.status === 'completed')
  const todayCompleted = completedTasks.filter((task) => {
    if (!task.completedAt) return false
    const completedDate = new Date(task.completedAt)
    const today = new Date()
    return (
      completedDate.getDate() === today.getDate() &&
      completedDate.getMonth() === today.getMonth() &&
      completedDate.getFullYear() === today.getFullYear()
    )
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
              <p className="text-sm text-gray-600">{getGreeting()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <TaskProgressBar
            completed={todayCompleted.length}
            total={activeTasks.length + todayCompleted.length}
          />
        </div>

        {/* Quick Add */}
        <div className="mb-6">
          <TaskQuickAdd
            onAddTask={handleAddTask}
            clients={clients}
            teammates={teammates}
          />
        </div>

        {/* Task Lists */}
        <div className="mb-6">
          <TaskList
            tasks={activeTasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
          />
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <CompletedTasksSection
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}
