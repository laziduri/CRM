import { NextRequest, NextResponse } from 'next/server'
import type { Task } from '@/types'
import { shouldAutoArchiveTask, findSimilarTasks } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

// Helper function to map database task to Task type
function mapDbTaskToTask(dbTask: any, consultantName: string = 'You'): Task & { created?: Date; archived?: boolean } {
  // Determine startTime - use start_time if available, otherwise use deadline or start_date
  // For calendar display, tasks with dates (even without time) should appear
  let startTime = dbTask.start_time ? new Date(dbTask.start_time) : undefined
  if (!startTime && dbTask.deadline) {
    // Use deadline date, set to start of day if no time specified
    const deadlineDate = new Date(dbTask.deadline)
    if (!dbTask.start_time) {
      deadlineDate.setHours(0, 0, 0, 0)
    }
    startTime = deadlineDate
  } else if (!startTime && dbTask.start_date) {
    // Use start_date, set to start of day
    const startDate = new Date(dbTask.start_date)
    startDate.setHours(0, 0, 0, 0)
    startTime = startDate
  }

  // Determine endTime - use end_time if available, otherwise calculate from startTime + duration
  let endTime = dbTask.end_time ? new Date(dbTask.end_time) : undefined
  if (!endTime && startTime) {
    // If no specific time, make it an all-day task (end of day) or add duration
    if (dbTask.start_time) {
      // Has specific time, add duration
      endTime = new Date(startTime.getTime() + (dbTask.estimated_duration || 30) * 60000)
    } else {
      // All-day task, set to end of day
      endTime = new Date(startTime)
      endTime.setHours(23, 59, 59, 999)
    }
  }

  return {
    id: dbTask.id,
    title: dbTask.title,
    startTime: startTime || new Date(),
    endTime: endTime || new Date(),
    type: 'task',
    taskType: dbTask.task_type || 'other',
    priority: dbTask.priority || 'medium',
    status: dbTask.status || 'pending',
    consultantId: dbTask.consultant_id,
    consultantName: consultantName,
    isMyItem: true,
    clientId: dbTask.client_id,
    clientName: dbTask.client_name || undefined,
    estimatedDuration: dbTask.estimated_duration || 30,
    deadline: dbTask.deadline ? new Date(dbTask.deadline) : undefined,
    startDate: dbTask.start_date ? new Date(dbTask.start_date) : undefined,
    assigneeId: dbTask.assignee_id || undefined,
    assigneeName: dbTask.assignee_name || undefined,
    notes: dbTask.description,
    aiSuggested: dbTask.ai_suggested || false,
    aiRecommendations: dbTask.ai_recommendations || undefined,
    created: dbTask.created_at ? new Date(dbTask.created_at) : new Date(),
    archived: dbTask.archived || false,
  }
}

// GET - Fetch all tasks for consultant
export async function GET(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id') || request.nextUrl.searchParams.get('consultantId')
    const includeArchived = request.nextUrl.searchParams.get('includeArchived') === 'true'
    
    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Get consultant name
    const { data: consultant } = await supabase
      .from('consultants')
      .select('name')
      .eq('id', consultantId)
      .single()

    const consultantName = consultant?.name || 'You'

    // Build query
    let query = supabase
      .from('tasks')
      .select(`
        *,
        clients:client_id(name)
      `)
      .eq('consultant_id', consultantId)

    if (!includeArchived) {
      query = query.eq('archived', false)
    }

    const { data: tasksData, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('[API] Supabase fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      )
    }

    // Auto-archive old tasks in database
    const now = new Date()
    const tasksToArchive: string[] = []
    
    tasksData?.forEach(task => {
      if (shouldAutoArchiveTask({
        status: task.status,
        completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
        deadline: task.deadline ? new Date(task.deadline) : undefined,
        created: task.created_at ? new Date(task.created_at) : undefined,
      }, 90) && !task.archived) {
        tasksToArchive.push(task.id)
      }
    })

    // Archive old tasks in bulk
    if (tasksToArchive.length > 0) {
      await supabase
        .from('tasks')
        .update({ archived: true, status: 'cancelled' })
        .in('id', tasksToArchive)
    }

    // Map to Task format and add client names
    const tasks = (tasksData || []).map(task => {
      const mapped = mapDbTaskToTask(task, consultantName)
      // Add client name from join if available
      if (task.clients && Array.isArray(task.clients) && task.clients[0]) {
        mapped.clientName = task.clients[0].name
      } else if (typeof task.clients === 'object' && task.clients?.name) {
        mapped.clientName = task.clients.name
      }
      return mapped
    })

    // Get archived count
    const { count: archivedCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('consultant_id', consultantId)
      .eq('archived', true)

    return NextResponse.json({
      success: true,
      tasks,
      archivedCount: archivedCount || 0,
    })
  } catch (error) {
    console.error('[API] Fetch tasks error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST - Create a new task
export async function POST(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    const body = await request.json()

    if (!consultantId) {
      return NextResponse.json(
        { error: 'Consultant ID is required' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Get existing tasks for duplicate check
    const { data: existingTasksData } = await supabase
      .from('tasks')
      .select('*')
      .eq('consultant_id', consultantId)
      .eq('archived', false)

    const existingTasks = (existingTasksData || []).map(t => ({
      id: t.id,
      title: t.title,
      clientId: t.client_id,
      clientName: t.client_name,
      taskType: t.task_type,
      status: t.status,
      created: t.created_at ? new Date(t.created_at) : undefined,
    }))

    // Check for duplicates
    const similarTasks = findSimilarTasks(
      {
        title: body.title,
        clientId: body.clientId,
        clientName: body.clientName,
        taskType: body.taskType,
      },
      existingTasks
    )

    // Get client name if clientId provided
    let clientName = body.clientName
    if (body.clientId && !clientName) {
      const { data: client } = await supabase
        .from('clients')
        .select('name')
        .eq('id', body.clientId)
        .single()
      clientName = client?.name
    }

    // Create task in Supabase
    // Build insert object with only existing columns (null-safe)
    // Note: start_date and assignee_id columns don't exist in the database, so we don't include them
    const insertData: any = {
      consultant_id: consultantId,
      client_id: body.clientId || null,
      title: body.title,
      description: body.notes || body.description || null,
      task_type: body.taskType || 'other',
      priority: body.priority || 'medium',
      status: body.status || 'pending',
      start_time: body.startTime ? new Date(body.startTime).toISOString() : null,
      end_time: body.endTime ? new Date(body.endTime).toISOString() : null,
      estimated_duration: body.estimatedDuration || 30,
      deadline: body.deadline ? new Date(body.deadline).toISOString() : null,
      ai_suggested: body.aiSuggested || false,
      ai_recommendations: body.aiRecommendations || null,
      archived: false,
    }

    // Log the insert data for debugging (without sensitive info)
    console.log('[API] Creating task with data:', {
      consultant_id: consultantId,
      title: body.title,
      has_client_id: !!body.clientId,
      has_start_time: !!body.startTime,
      has_deadline: !!body.deadline,
      priority: body.priority || 'medium',
      status: body.status || 'pending',
    })

    const { data: newTask, error: insertError } = await supabase
      .from('tasks')
      .insert(insertData)
      .select()
      .single()

    if (insertError || !newTask) {
      console.error('[API] Supabase insert error:', {
        code: insertError?.code,
        message: insertError?.message,
        details: insertError?.details,
        hint: insertError?.hint,
        fullError: insertError,
      })
      
      // If error is due to missing columns, try again without optional columns
      // This is a safety net in case we missed something
      if (insertError?.code === '42703' || 
          insertError?.message?.includes('column') || 
          insertError?.message?.includes('does not exist') ||
          insertError?.hint?.includes('column')) {
        console.log('[API] Column error detected, retrying without optional columns...')
        const fallbackData: any = {
          consultant_id: consultantId,
          client_id: body.clientId || null,
          title: body.title,
          description: body.notes || body.description || null,
          task_type: body.taskType || 'other',
          priority: body.priority || 'medium',
          status: body.status || 'pending',
          start_time: body.startTime ? new Date(body.startTime).toISOString() : null,
          end_time: body.endTime ? new Date(body.endTime).toISOString() : null,
          estimated_duration: body.estimatedDuration || 30,
          deadline: body.deadline ? new Date(body.deadline).toISOString() : null,
          ai_suggested: body.aiSuggested || false,
          ai_recommendations: body.aiRecommendations || null,
          archived: false,
        }

        const { data: fallbackTask, error: fallbackError } = await supabase
          .from('tasks')
          .insert(fallbackData)
          .select()
          .single()

        if (fallbackError || !fallbackTask) {
          console.error('[API] Fallback insert error:', {
            code: fallbackError?.code,
            message: fallbackError?.message,
            details: fallbackError?.details,
            hint: fallbackError?.hint,
            fullError: fallbackError,
          })
          return NextResponse.json(
            { 
              error: 'Failed to create task',
              details: fallbackError?.message || fallbackError?.details || insertError?.message || 'Unknown database error'
            },
            { status: 500 }
          )
        }

        console.log('[API] Task created successfully via fallback')
        const mappedTask = mapDbTaskToTask(fallbackTask)
        if (clientName) mappedTask.clientName = clientName

        return NextResponse.json({
          success: true,
          task: mappedTask,
          duplicateWarning: similarTasks.length > 0 ? {
            similarTasks: similarTasks.slice(0, 3),
            message: `Found ${similarTasks.length} similar task(s). Are you sure you want to create a duplicate?`,
          } : undefined,
        })
      }

      // Return detailed error information
      return NextResponse.json(
        { 
          error: 'Failed to create task',
          details: insertError?.message || insertError?.details || insertError?.hint || 'Unknown database error',
          code: insertError?.code || 'UNKNOWN_ERROR'
        },
        { status: 500 }
      )
    }

    console.log('[API] Task created successfully:', newTask.id)

    const mappedTask = mapDbTaskToTask(newTask)
    if (clientName) mappedTask.clientName = clientName

    return NextResponse.json({
      success: true,
      task: mappedTask,
      duplicateWarning: similarTasks.length > 0 ? {
        similarTasks: similarTasks.slice(0, 3),
        message: `Found ${similarTasks.length} similar task(s). Are you sure you want to create a duplicate?`,
      } : undefined,
    })
  } catch (error) {
    console.error('[API] Create task error:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

// PUT - Update a task
export async function PUT(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    const body = await request.json()

    if (!consultantId || !body.id) {
      return NextResponse.json(
        { error: 'Consultant ID and Task ID are required' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Build update object
    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined || body.notes !== undefined) updateData.description = body.notes || body.description
    if (body.taskType !== undefined) updateData.task_type = body.taskType
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.status !== undefined) {
      updateData.status = body.status
      if (body.status === 'completed' && !body.completedAt) {
        updateData.completed_at = new Date().toISOString()
      }
    }
    if (body.startTime !== undefined) updateData.start_time = new Date(body.startTime).toISOString()
    if (body.endTime !== undefined) updateData.end_time = new Date(body.endTime).toISOString()
    if (body.estimatedDuration !== undefined) updateData.estimated_duration = body.estimatedDuration
    if (body.deadline !== undefined) updateData.deadline = body.deadline ? new Date(body.deadline).toISOString() : null
    if (body.startDate !== undefined) {
      updateData.start_date = body.startDate ? new Date(body.startDate).toISOString().split('T')[0] : null
    } else if (body.deadline !== undefined && body.deadline) {
      // If deadline is set but startDate isn't, derive start_date from deadline
      updateData.start_date = new Date(body.deadline).toISOString().split('T')[0]
    } else if (body.startTime !== undefined && body.startTime) {
      // If startTime is set but startDate isn't, derive start_date from startTime
      updateData.start_date = new Date(body.startTime).toISOString().split('T')[0]
    }
    if (body.assigneeId !== undefined) updateData.assignee_id = body.assigneeId || null
    if (body.archived !== undefined) updateData.archived = body.archived
    if (body.aiSuggested !== undefined) updateData.ai_suggested = body.aiSuggested
    if (body.aiRecommendations !== undefined) updateData.ai_recommendations = body.aiRecommendations

    // Update task in Supabase
    const { data: updatedTask, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', body.id)
      .eq('consultant_id', consultantId)
      .select()
      .single()

    if (error || !updatedTask) {
      console.error('[API] Supabase update error:', error)
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      )
    }

    const mappedTask = mapDbTaskToTask(updatedTask)

    return NextResponse.json({
      success: true,
      task: mappedTask,
    })
  } catch (error) {
    console.error('[API] Update task error:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a task
export async function DELETE(request: NextRequest) {
  try {
    const consultantId = request.headers.get('x-consultant-id')
    const taskId = request.nextUrl.searchParams.get('id')

    if (!consultantId || !taskId) {
      return NextResponse.json(
        { error: 'Consultant ID and Task ID are required' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Delete task from Supabase
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('consultant_id', consultantId)

    if (error) {
      console.error('[API] Supabase delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete task' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    })
  } catch (error) {
    console.error('[API] Delete task error:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
