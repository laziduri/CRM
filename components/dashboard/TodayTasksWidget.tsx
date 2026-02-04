'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckSquare, ChevronRight, Circle, Plus } from 'lucide-react'
import TaskItem from '@/components/tasks/TaskItem'
import { Input } from '@/components/ui/Input'
import type { Task } from '@/types'
import { isToday, isPast } from 'date-fns'

const MAX_VISIBLE = 7

interface TodayTasksWidgetProps {
  consultantId: string | null
  onAddTask?: (task: Partial<Task>) => Promise<void>
  clients?: Array<{ id: string; name: string }>
}

function getTodayAndOverdueTasks(tasks: Task[]): Task[] {
  const grouped: Task[] = []
  const now = new Date()

  tasks.forEach((task) => {
    if (task.status === 'completed') return

    const taskDate = task.deadline || task.startDate || task.startTime
    if (!taskDate) {
      grouped.push(task)
      return
    }

    const date = new Date(taskDate)
    if (isPast(date) && !isToday(date)) {
      grouped.push(task) // overdue
    } else if (isToday(date)) {
      grouped.push(task) // today
    }
  })

  grouped.sort((a, b) => {
    const dateA = new Date(a.deadline || a.startDate || a.startTime || 0)
    const dateB = new Date(b.deadline || b.startDate || b.startTime || 0)
    if (dateA.getTime() !== dateB.getTime()) return dateA.getTime() - dateB.getTime()
    const timeA = a.startTime ? new Date(a.startTime).getTime() : 0
    const timeB = b.startTime ? new Date(b.startTime).getTime() : 0
    return timeA - timeB
  })

  return grouped
}

export default function TodayTasksWidget({
  consultantId,
  onAddTask,
  clients = [],
}: TodayTasksWidgetProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quickAddTitle, setQuickAddTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (!consultantId) {
      setIsLoading(false)
      return
    }

    const load = async () => {
      try {
        const res = await fetch('/api/consultant/tasks', {
          headers: { 'x-consultant-id': consultantId },
        })
        if (res.ok) {
          const data = await res.json()
          const list = (data.tasks || []).map((t: any) => ({
            ...t,
            startTime: t.startTime ? new Date(t.startTime) : undefined,
            endTime: t.endTime ? new Date(t.endTime) : undefined,
            deadline: t.deadline ? new Date(t.deadline) : undefined,
            startDate: t.startDate ? new Date(t.startDate) : undefined,
          }))
          setTasks(list)
        }
      } catch (e) {
        console.error('Failed to load tasks:', e)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [consultantId])

  const todayAndOverdue = getTodayAndOverdueTasks(tasks)
  const visible = todayAndOverdue.slice(0, MAX_VISIBLE)
  const hasMore = todayAndOverdue.length > MAX_VISIBLE

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    if (!consultantId) return
    try {
      const res = await fetch('/api/consultant/tasks', {
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
      if (res.ok) {
        const data = await res.json()
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: data.task?.status ?? (completed ? 'completed' : 'pending') }
              : t
          )
        )
      }
    } catch (e) {
      console.error('Toggle complete failed:', e)
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!consultantId) return
    try {
      const res = await fetch(`/api/consultant/tasks?id=${taskId}`, {
        method: 'DELETE',
        headers: { 'x-consultant-id': consultantId },
      })
      if (res.ok) setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch (e) {
      console.error('Delete failed:', e)
    }
  }

  const handleQuickAdd = async () => {
    if (!quickAddTitle.trim() || !onAddTask) return
    setIsAdding(true)
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const endOfDay = new Date(today)
      endOfDay.setHours(23, 59, 59, 999)
      await onAddTask({
        title: quickAddTitle.trim(),
        startTime: today,
        endTime: endOfDay,
        deadline: today,
        startDate: today,
        status: 'pending',
        priority: 'medium',
        taskType: 'other',
        estimatedDuration: 30,
      })
      setQuickAddTitle('')
      const res = await fetch('/api/consultant/tasks', {
        headers: { 'x-consultant-id': consultantId! },
      })
      if (res.ok) {
        const data = await res.json()
        const list = (data.tasks || []).map((t: any) => ({
          ...t,
          startTime: t.startTime ? new Date(t.startTime) : undefined,
          endTime: t.endTime ? new Date(t.endTime) : undefined,
          deadline: t.deadline ? new Date(t.deadline) : undefined,
          startDate: t.startDate ? new Date(t.startDate) : undefined,
        }))
        setTasks(list)
      }
    } catch (e) {
      console.error('Add task failed:', e)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Tasks for Today</h2>
              <p className="text-xs text-gray-500">
                {todayAndOverdue.length} task{todayAndOverdue.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link
            href="/consultant/tasks"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark min-h-[44px] min-w-[44px] items-center justify-end"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {onAddTask && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleQuickAdd()
                }}
                className="flex gap-2 mb-4"
              >
                <Input
                  type="text"
                  placeholder="Add a task..."
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  className="flex-1 min-h-[44px]"
                  disabled={isAdding}
                />
                <button
                  type="submit"
                  disabled={!quickAddTitle.trim() || isAdding}
                  className="flex-shrink-0 p-2.5 rounded-lg bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Add task"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>
            )}

            {visible.length === 0 ? (
              <div className="py-8 text-center">
                <Circle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No tasks for today</p>
                <Link
                  href="/consultant/tasks"
                  className="inline-block mt-2 text-sm font-medium text-primary hover:text-primary-dark"
                >
                  Add a task
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {visible.map((task) => (
                  <div key={task.id} className="rounded-lg border border-gray-200 overflow-hidden">
                    <TaskItem
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDelete}
                      showClientLink={true}
                    />
                  </div>
                ))}
                {hasMore && (
                  <Link
                    href="/consultant/tasks"
                    className="block py-3 text-center text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    +{todayAndOverdue.length - MAX_VISIBLE} more
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
