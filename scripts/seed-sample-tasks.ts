/**
 * Seed script to create sample tasks for demo account
 * Run with: npx tsx scripts/seed-sample-tasks.ts
 */

import { createClient } from '@supabase/supabase-js'

// You'll need to set these environment variables or update them here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedSampleTasks() {
  try {
    console.log('🌱 Starting to seed sample tasks...')

    // First, check if demo consultant exists, if not create one
    let consultantId: string | null = null
    
    const { data: existingConsultants } = await supabase
      .from('consultants')
      .select('id, name')
      .limit(1)

    if (existingConsultants && existingConsultants.length > 0) {
      consultantId = existingConsultants[0].id
      console.log(`✅ Using existing consultant: ${existingConsultants[0].name} (${consultantId})`)
    } else {
      // Create demo consultant
      const { data: newConsultant, error: consultantError } = await supabase
        .from('consultants')
        .insert({
          consultant_id: 'demo-001',
          email: 'demo@example.com',
          name: 'Sarah',
          phone: '+65 9123 4567',
        })
        .select()
        .single()

      if (consultantError || !newConsultant) {
        console.error('❌ Error creating consultant:', consultantError)
        return
      }

      consultantId = newConsultant.id
      console.log(`✅ Created demo consultant: ${newConsultant.name} (${consultantId})`)
    }

    if (!consultantId) {
      console.error('❌ No consultant ID available')
      return
    }

    // Get today's date and create tasks for different time periods
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    // Sample tasks with various dates and priorities
    const sampleTasks = [
      // Overdue tasks
      {
        consultant_id: consultantId,
        title: 'Follow up with John about loan documents',
        description: 'Check if all required documents have been submitted',
        task_type: 'follow-up-payment',
        priority: 'high',
        status: 'pending',
        deadline: yesterday.toISOString(),
        estimated_duration: 30,
      },
      {
        consultant_id: consultantId,
        title: 'Call ABC Trading for grant application status',
        description: 'Follow up on their grant application submission',
        task_type: 'call',
        priority: 'urgent',
        status: 'pending',
        deadline: yesterday.toISOString(),
        estimated_duration: 15,
      },
      
      // Today's tasks
      {
        consultant_id: consultantId,
        title: 'Submit Christine grant application',
        description: 'Complete and submit the grant application forms',
        task_type: 'document',
        priority: 'high',
        status: 'pending',
        deadline: today.toISOString(),
        estimated_duration: 60,
      },
      {
        consultant_id: consultantId,
        title: 'Review loan proposal for DEF Manufacturing',
        description: 'Review and prepare loan proposal documents',
        task_type: 'document',
        priority: 'medium',
        status: 'in-progress',
        deadline: today.toISOString(),
        estimated_duration: 45,
      },
      {
        consultant_id: consultantId,
        title: 'Call Keith about payment schedule',
        description: 'Discuss payment options and schedule',
        task_type: 'call',
        priority: 'medium',
        status: 'pending',
        deadline: today.toISOString(),
        estimated_duration: 20,
      },
      
      // Tomorrow's tasks
      {
        consultant_id: consultantId,
        title: 'Prepare meeting agenda for client consultation',
        description: 'Organize agenda and materials for tomorrow\'s consultation',
        task_type: 'document',
        priority: 'medium',
        status: 'pending',
        deadline: tomorrow.toISOString(),
        estimated_duration: 30,
      },
      {
        consultant_id: consultantId,
        title: 'Send follow-up email to Jane Smith',
        description: 'Follow up on previous discussion about business loan',
        task_type: 'email',
        priority: 'low',
        status: 'pending',
        deadline: tomorrow.toISOString(),
        estimated_duration: 15,
      },
      
      // Upcoming tasks (next week)
      {
        consultant_id: consultantId,
        title: 'Schedule quarterly review meeting',
        description: 'Plan and schedule quarterly review with team',
        task_type: 'other',
        priority: 'medium',
        status: 'pending',
        deadline: nextWeek.toISOString(),
        estimated_duration: 60,
      },
      {
        consultant_id: consultantId,
        title: 'Update client database records',
        description: 'Review and update client information in CRM',
        task_type: 'document',
        priority: 'low',
        status: 'pending',
        deadline: nextWeek.toISOString(),
        estimated_duration: 90,
      },
      
      // Completed task (for today)
      {
        consultant_id: consultantId,
        title: 'Submit monthly report',
        description: 'Complete and submit monthly sales report',
        task_type: 'document',
        priority: 'medium',
        status: 'completed',
        deadline: today.toISOString(),
        completed_at: new Date(today.getTime() + 2 * 60 * 60 * 1000).toISOString(), // Completed 2 hours ago
        estimated_duration: 45,
      },
      {
        consultant_id: consultantId,
        title: 'Call client for appointment confirmation',
        description: 'Confirm appointment time with client',
        task_type: 'call',
        priority: 'high',
        status: 'completed',
        deadline: today.toISOString(),
        completed_at: new Date(today.getTime() + 1 * 60 * 60 * 1000).toISOString(), // Completed 1 hour ago
        estimated_duration: 10,
      },
    ]

    // Insert tasks
    console.log(`📝 Creating ${sampleTasks.length} sample tasks...`)
    
    const { data: insertedTasks, error: insertError } = await supabase
      .from('tasks')
      .insert(sampleTasks)
      .select()

    if (insertError) {
      console.error('❌ Error inserting tasks:', insertError)
      return
    }

    console.log(`✅ Successfully created ${insertedTasks?.length || 0} sample tasks!`)
    console.log('\n📊 Task breakdown:')
    console.log(`   - Overdue: 2 tasks`)
    console.log(`   - Today: 3 tasks (2 pending, 1 in-progress)`)
    console.log(`   - Completed today: 2 tasks`)
    console.log(`   - Tomorrow: 2 tasks`)
    console.log(`   - Next week: 2 tasks`)
    console.log('\n✨ Sample tasks seeded successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding tasks:', error)
  }
}

// Run the seed function
seedSampleTasks()
