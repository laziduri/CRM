'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react'
import TaskItem from './TaskItem'
import type { Task } from '@/types'

interface CompletedTasksSectionProps {
  tasks: Task[]
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
  onEdit?: (task: Task) => void
}

export default function CompletedTasksSection({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
}: CompletedTasksSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const completedTasks = tasks.filter((task) => task.status === 'completed')
  const today = new Date()
  const todayCompleted = completedTasks.filter((task) => {
    if (!task.completedAt) return false
    const completedDate = new Date(task.completedAt)
    return (
      completedDate.getDate() === today.getDate() &&
      completedDate.getMonth() === today.getMonth() &&
      completedDate.getFullYear() === today.getFullYear()
    )
  })

  if (completedTasks.length === 0) return null

  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-gray-700">
            Completed Tasks
          </span>
          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            {todayCompleted.length} today
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {completedTasks.length} total
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-2">
          {completedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}
