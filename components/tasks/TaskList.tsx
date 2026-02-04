'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import TaskItem from './TaskItem'
import type { Task } from '@/types'
import { format, isToday, isTomorrow, isPast, startOfDay } from 'date-fns'

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
  onEdit?: (task: Task) => void
}

interface GroupedTasks {
  overdue: Task[]
  today: Task[]
  tomorrow: Task[]
  upcoming: Task[]
}

export default function TaskList({ tasks, onToggleComplete, onDelete, onEdit }: TaskListProps) {
  const [expandedSections, setExpandedSections] = useState({
    overdue: true,
    today: true,
    tomorrow: true,
    upcoming: false,
  })

  const groupTasksByDate = (tasks: Task[]): GroupedTasks => {
    const now = new Date()
    const today = startOfDay(now)
    
    const grouped: GroupedTasks = {
      overdue: [],
      today: [],
      tomorrow: [],
      upcoming: [],
    }

    tasks.forEach((task) => {
      if (task.status === 'completed') return

      const taskDate = task.deadline || task.startDate || task.startTime
      if (!taskDate) {
        // No date - put in today
        grouped.today.push(task)
        return
      }

      const date = new Date(taskDate)
      
      if (isPast(date) && !isToday(date)) {
        grouped.overdue.push(task)
      } else if (isToday(date)) {
        grouped.today.push(task)
      } else if (isTomorrow(date)) {
        grouped.tomorrow.push(task)
      } else {
        grouped.upcoming.push(task)
      }
    })

    // Sort each group
    grouped.overdue.sort((a, b) => {
      const dateA = new Date(a.deadline || a.startDate || a.startTime || 0)
      const dateB = new Date(b.deadline || b.startDate || b.startTime || 0)
      return dateA.getTime() - dateB.getTime()
    })

    grouped.today.sort((a, b) => {
      const timeA = a.startTime ? new Date(a.startTime).getTime() : 0
      const timeB = b.startTime ? new Date(b.startTime).getTime() : 0
      return timeA - timeB
    })

    grouped.tomorrow.sort((a, b) => {
      const timeA = a.startTime ? new Date(a.startTime).getTime() : 0
      const timeB = b.startTime ? new Date(b.startTime).getTime() : 0
      return timeA - timeB
    })

    grouped.upcoming.sort((a, b) => {
      const dateA = new Date(a.deadline || a.startDate || a.startTime || 0)
      const dateB = new Date(b.deadline || b.startDate || b.startTime || 0)
      return dateA.getTime() - dateB.getTime()
    })

    return grouped
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const grouped = groupTasksByDate(tasks)

  const renderSection = (
    title: string,
    sectionKey: keyof typeof expandedSections,
    taskList: Task[],
    color: string = 'text-gray-700'
  ) => {
    if (taskList.length === 0) return null

    const isExpanded = expandedSections[sectionKey]

    return (
      <div className="mb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
            <h3 className={`text-base font-semibold ${color}`}>{title}</h3>
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
              {taskList.length}
            </span>
          </div>
        </button>

        {isExpanded && (
          <div className="mt-2 space-y-2">
            {taskList.map((task) => (
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

  return (
    <div className="space-y-4">
      {renderSection('Overdue', 'overdue', grouped.overdue, 'text-red-600')}
      {renderSection('Today', 'today', grouped.today)}
      {renderSection('Tomorrow', 'tomorrow', grouped.tomorrow)}
      {renderSection('Upcoming', 'upcoming', grouped.upcoming)}
      
      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No tasks yet. Add one above to get started!</p>
        </div>
      )}
    </div>
  )
}
