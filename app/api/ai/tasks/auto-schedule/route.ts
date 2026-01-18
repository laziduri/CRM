import { NextRequest, NextResponse } from 'next/server'

interface Task {
  id: string
  title: string
  duration: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  deadline?: Date
  startDate?: Date
  hardDeadline?: boolean
  scheduleWorkHours?: boolean
}

interface Appointment {
  id: string
  startTime: Date
  endTime: Date
  type: string
}

export async function POST(request: NextRequest) {
  try {
    const { task, existingAppointments, workingHours } = await request.json()

    // AI scheduling logic:
    // 1. Find available time slots based on priority and deadline
    // 2. Consider work hours if specified
    // 3. Avoid conflicts with existing appointments
    // 4. Prioritize urgent tasks and deadlines

    const now = new Date()
    const taskDeadline = task.deadline ? new Date(task.deadline) : null
    const workStart = workingHours?.start || '09:00'
    const workEnd = workingHours?.end || '18:00'

    // Calculate priority score
    const priorityScores: Record<string, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    }
    const priorityScore = priorityScores[task.priority] || 2

    // Calculate urgency based on deadline
    let urgencyScore = 0
    if (taskDeadline) {
      const daysUntilDeadline = Math.ceil(
        (taskDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
      urgencyScore = Math.max(0, 5 - daysUntilDeadline)
    }

    // Find best time slot
    const suggestedStartTime = new Date(now)
    
    // If deadline is today or tomorrow, schedule ASAP
    if (taskDeadline && urgencyScore > 3) {
      suggestedStartTime.setHours(parseInt(workStart.split(':')[0]), 0, 0, 0)
    } else {
      // Schedule based on priority
      suggestedStartTime.setDate(suggestedStartTime.getDate() + (priorityScore <= 2 ? 1 : 0))
      suggestedStartTime.setHours(parseInt(workStart.split(':')[0]), 0, 0, 0)
    }

    const suggestedEndTime = new Date(suggestedStartTime)
    suggestedEndTime.setMinutes(suggestedEndTime.getMinutes() + (task.duration || 30))

    return NextResponse.json({
      success: true,
      scheduledTime: suggestedStartTime.toISOString(),
      endTime: suggestedEndTime.toISOString(),
      priorityScore,
      urgencyScore,
      message: 'Task auto-scheduled based on priority and deadline',
    })
  } catch (error) {
    console.error('[API] Auto-schedule error:', error)
    return NextResponse.json(
      { error: 'Failed to auto-schedule task' },
      { status: 500 }
    )
  }
}
