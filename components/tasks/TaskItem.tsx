'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Clock, User, Users, Edit, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Task } from '@/types'
import { format } from 'date-fns'

interface TaskItemProps {
  task: Task
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
  onEdit?: (task: Task) => void
  showClientLink?: boolean
}

export default function TaskItem({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onEdit,
  showClientLink = true 
}: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const isCompleted = task.status === 'completed'
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !isCompleted

  const handleToggleComplete = async () => {
    await onToggleComplete(task.id, !isCompleted)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true)
      try {
        await onDelete(task.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div
      className={`
        bg-white rounded-lg p-4 border transition-all
        ${isOverdue ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}
        ${isCompleted ? 'opacity-60' : 'hover:shadow-md'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className="mt-0.5 flex-shrink-0"
          disabled={isDeleting}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-primary" />
          )}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`
                text-base font-medium text-gray-900
                ${isCompleted ? 'line-through' : ''}
              `}>
                {task.title}
              </h3>
              
              {/* Task metadata */}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                {/* Date */}
                {task.deadline && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(task.deadline), 'MMM d, yyyy')}</span>
                  </div>
                )}

                {/* Time */}
                {task.startTime && task.endTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(task.startTime), 'h:mm a')}</span>
                  </div>
                )}

                {/* Client */}
                {task.clientName && showClientLink && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{task.clientName}</span>
                  </div>
                )}

                {/* Assigned to */}
                {task.assigneeName && (
                  <div className="flex items-center gap-1 text-primary">
                    <Users className="w-3 h-3" />
                    <span>Assigned to {task.assigneeName}</span>
                  </div>
                )}

                {/* Assigned by - will be added when delegation is implemented */}
                {/* {task.assignedBy && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <Users className="w-3 h-3" />
                    <span>From {task.assignedBy}</span>
                  </div>
                )} */}
              </div>

              {/* Priority indicator */}
              {!isCompleted && (
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor()}`} />
                  <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
                </div>
              )}

              {/* Overdue badge */}
              {isOverdue && (
                <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                  Overdue
                </span>
              )}
            </div>

            {/* Actions menu */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showActions && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowActions(false)}
                  />
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(task)
                          setShowActions(false)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
