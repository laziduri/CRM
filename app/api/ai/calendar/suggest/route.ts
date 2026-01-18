import { NextRequest, NextResponse } from 'next/server'
import type { Task, Appointment, AISuggestion } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { tasks, appointments, preferences } = await request.json()

    const suggestions: AISuggestion[] = []
    const now = new Date()
    const workingHours = preferences?.workingHours || { start: '09:00', end: '18:00' }
    const preferredBreakTime = preferences?.preferredBreakTime || 30

    // Analyze pending tasks
    const pendingTasks = (tasks || []).filter((t: Task) => t.status === 'pending')
    
    // Suggest scheduling for urgent tasks
    const urgentTasks = pendingTasks.filter((t: Task) => t.priority === 'urgent' || t.priority === 'high')
    urgentTasks.forEach((task: Task) => {
      if (!task.startTime || new Date(task.startTime) < now) {
        const suggestedTime = new Date(now)
        suggestedTime.setHours(parseInt(workingHours.start.split(':')[0]), 0, 0, 0)
        if (suggestedTime < now) {
          suggestedTime.setDate(suggestedTime.getDate() + 1)
        }

        suggestions.push({
          id: `suggest-${task.id}`,
          type: 'schedule-task',
          title: `Schedule: ${task.title}`,
          description: `Urgent task "${task.title}" should be scheduled for ${suggestedTime.toLocaleDateString()} at ${suggestedTime.toLocaleTimeString()}.`,
          suggestedTime: suggestedTime,
          priority: task.priority,
          confidence: 0.9,
          reasoning: `Task has ${task.priority} priority and needs immediate attention.`,
        })
      }
    })

    // Check for payment follow-ups
    const paymentTasks = pendingTasks.filter((t: Task) => t.taskType === 'follow-up-payment')
    paymentTasks.forEach((task: Task) => {
      if (task.deadline) {
        const daysUntilDeadline = Math.ceil(
          (new Date(task.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysUntilDeadline <= 1) {
          suggestions.push({
            id: `suggest-payment-${task.id}`,
            type: 'schedule-task',
            title: `Urgent Payment Follow-up: ${task.clientName}`,
            description: `Payment follow-up for ${task.clientName} is due soon. Schedule immediately.`,
            suggestedTime: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour from now
            priority: 'urgent',
            confidence: 0.95,
            reasoning: 'Payment follow-up is time-sensitive and should be prioritized.',
          })
        }
      }
    })

    // Check for customer reminders
    const reminderTasks = pendingTasks.filter((t: Task) => t.taskType === 'remind-customer')
    reminderTasks.forEach((task: Task) => {
      // Suggest morning time for reminders (better response rate)
      const suggestedTime = new Date(now)
      suggestedTime.setHours(10, 0, 0, 0) // 10 AM
      if (suggestedTime < now) {
        suggestedTime.setDate(suggestedTime.getDate() + 1)
      }

      suggestions.push({
        id: `suggest-reminder-${task.id}`,
        type: 'schedule-task',
        title: `Schedule Reminder: ${task.clientName}`,
        description: `Best time to remind ${task.clientName} is in the morning (10 AM) for better response.`,
        suggestedTime: suggestedTime,
        priority: task.priority,
        confidence: 0.8,
        reasoning: 'Morning calls have higher response rates for customer reminders.',
      })
    })

    // Check for scheduling conflicts
    const allItems = [...(appointments || []), ...(tasks || []).filter((t: Task) => t.startTime)]
    allItems.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    for (let i = 0; i < allItems.length - 1; i++) {
      const current = allItems[i]
      const next = allItems[i + 1]
      const currentEnd = new Date(current.endTime)
      const nextStart = new Date(next.startTime)
      const breakTime = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60) // minutes

      if (breakTime < preferredBreakTime && breakTime > 0) {
        suggestions.push({
          id: `suggest-buffer-${current.id}`,
          type: 'add-buffer',
          title: 'Add Buffer Time',
          description: `Only ${Math.round(breakTime)} minutes between "${current.title}" and "${next.title}". Consider adding buffer time.`,
          suggestedTime: new Date(currentEnd.getTime() + preferredBreakTime * 60000),
          priority: 'medium',
          confidence: 0.7,
          reasoning: 'Short breaks between meetings can cause stress and reduce preparation time.',
        })
      }

      // Check for overlaps
      if (currentEnd > nextStart) {
        suggestions.push({
          id: `suggest-reschedule-${next.id}`,
          type: 'reschedule-appointment',
          title: `Reschedule: ${next.title}`,
          description: `"${next.title}" overlaps with "${current.title}". Consider rescheduling.`,
          suggestedTime: new Date(currentEnd.getTime() + preferredBreakTime * 60000),
          priority: 'high',
          confidence: 0.95,
          reasoning: 'Overlapping appointments create conflicts and reduce effectiveness.',
        })
      }
    }

    // Optimize day schedule
    const todayItems = allItems.filter((item) => {
      const itemDate = new Date(item.startTime)
      return (
        itemDate.getDate() === now.getDate() &&
        itemDate.getMonth() === now.getMonth() &&
        itemDate.getFullYear() === now.getFullYear()
      )
    })

    if (todayItems.length > 6) {
      suggestions.push({
        id: 'suggest-optimize-day',
        type: 'optimize-day',
        title: 'Optimize Today\'s Schedule',
        description: `You have ${todayItems.length} items scheduled today. Consider moving some to tomorrow for better focus.`,
        priority: 'medium',
        confidence: 0.6,
        reasoning: 'Too many items in one day can reduce effectiveness and cause burnout.',
      })
    }

    // Sort suggestions by priority and confidence
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
    suggestions.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.confidence - a.confidence
    })

    return NextResponse.json({
      success: true,
      suggestions: suggestions.slice(0, 10), // Return top 10 suggestions
      summary: {
        total: suggestions.length,
        urgent: suggestions.filter((s) => s.priority === 'urgent').length,
        high: suggestions.filter((s) => s.priority === 'high').length,
        conflicts: suggestions.filter((s) => s.type === 'reschedule-appointment').length,
      },
    })
  } catch (error) {
    console.error('[API] AI calendar suggest error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI suggestions' },
      { status: 500 }
    )
  }
}
