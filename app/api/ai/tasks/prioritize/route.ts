import { NextRequest, NextResponse } from 'next/server'

interface Task {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  deadline?: Date
  duration?: number
  dependencies?: string[]
  tags?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { tasks } = await request.json()

    // AI prioritization logic:
    // 1. Analyze deadlines (closer = higher priority)
    // 2. Consider dependencies
    // 3. Factor in duration and workload
    // 4. Suggest re-prioritization

    const now = new Date()
    const prioritizedTasks = tasks.map((task: Task) => {
      let newPriority = task.priority
      let reason = ''

      // Check deadline urgency
      if (task.deadline) {
        const daysUntilDeadline = Math.ceil(
          (new Date(task.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (daysUntilDeadline <= 1 && task.priority !== 'urgent') {
          newPriority = 'urgent'
          reason = 'Deadline is very soon'
        } else if (daysUntilDeadline <= 3 && task.priority === 'low') {
          newPriority = 'high'
          reason = 'Deadline approaching'
        }
      }

      // Check dependencies
      if (task.dependencies && task.dependencies.length > 0) {
        const blockingTasks = tasks.filter((t: Task) =>
          task.dependencies?.includes(t.id) && t.priority === 'low'
        )
        if (blockingTasks.length > 0) {
          reason = `Has dependencies that need attention`
        }
      }

      return {
        ...task,
        priority: newPriority,
        aiSuggestedPriority: newPriority !== task.priority,
        aiReason: reason || `Maintains ${task.priority} priority`,
      }
    })

    // Sort by priority and deadline
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
    prioritizedTasks.sort((a: any, b: any) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff

      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      }
      return 0
    })

    return NextResponse.json({
      success: true,
      prioritizedTasks,
      summary: {
        total: prioritizedTasks.length,
        urgent: prioritizedTasks.filter((t: any) => t.priority === 'urgent').length,
        high: prioritizedTasks.filter((t: any) => t.priority === 'high').length,
        suggestedChanges: prioritizedTasks.filter((t: any) => t.aiSuggestedPriority).length,
      },
    })
  } catch (error) {
    console.error('[API] Prioritization error:', error)
    return NextResponse.json(
      { error: 'Failed to prioritize tasks' },
      { status: 500 }
    )
  }
}
