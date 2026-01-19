'use client'

import { useState } from 'react'
import { Plus, Calendar, Clock, User, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Task } from '@/types'

interface TaskQuickAddProps {
  onAddTask: (task: Partial<Task>) => Promise<void>
  clients?: Array<{ id: string; name: string }>
  teammates?: Array<{ id: string; name: string }>
}

export default function TaskQuickAdd({ onAddTask, clients = [], teammates = [] }: TaskQuickAddProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [time, setTime] = useState('')
  const [clientId, setClientId] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const startTime = date && time ? new Date(`${date}T${time}`) : undefined
      const endTime = startTime ? new Date(startTime.getTime() + 30 * 60000) : undefined

      await onAddTask({
        title: title.trim(),
        startTime: startTime || new Date(date),
        endTime: endTime || (date ? new Date(date) : undefined),
        deadline: date ? new Date(date) : undefined,
        startDate: date ? new Date(date) : undefined,
        clientId: clientId || undefined,
        assigneeId: assigneeId || undefined,
        status: 'pending',
        priority: 'medium',
        taskType: 'other',
        estimatedDuration: 30,
      })

      // Reset form
      setTitle('')
      setTime('')
      setClientId('')
      setAssigneeId('')
      setIsExpanded(false)
    } catch (error) {
      console.error('Error adding task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
          autoFocus
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!title.trim() || isSubmitting}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Date picker - always visible */}
      <div className="mt-3">
        <label className="flex items-center gap-2 text-sm text-gray-700 mb-1">
          <Calendar className="w-4 h-4" />
          Date
        </label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Optional fields - expandable */}
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* Time picker */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-700 mb-1">
              <Clock className="w-4 h-4" />
              Time (optional)
            </label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Client selector */}
          {clients.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                <User className="w-4 h-4" />
                Client (optional)
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Assign to teammate/director */}
          {teammates.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                <Users className="w-4 h-4" />
                Ask for Help (optional)
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select teammate/director...</option>
                {teammates.map((teammate) => (
                  <option key={teammate.id} value={teammate.id}>
                    {teammate.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Expand/collapse button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-xs text-primary hover:text-primary-dark"
      >
        {isExpanded ? 'Less options' : 'More options'}
      </button>
    </form>
  )
}
