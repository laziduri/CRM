/**
 * AI-Powered Auto-fill Utilities for CRM
 * Provides smart defaults for common CRM fields with the ability to override
 */

export interface TaskContext {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  type?: 'follow-up' | 'document-review' | 'consultation' | 'administrative' | 'other'
  clientId?: string
  clientType?: 'personal' | 'business'
  dealAmount?: number
  tags?: string[]
}

export interface FollowUpContext {
  clientId: string
  clientName: string
  clientType: 'personal' | 'business'
  lastContactDate?: Date
  dealStage?: 'new' | 'in-progress' | 'under-review' | 'approved' | 'closed' | 'rejected'
  priority?: 'high' | 'medium' | 'low'
  lastInteractionType?: 'call' | 'email' | 'meeting' | 'whatsapp'
  daysSinceLastContact?: number
}

export interface WhatsAppContext {
  clientName: string
  clientType: 'personal' | 'business'
  purpose: 'follow-up' | 'document-request' | 'appointment-confirmation' | 'status-update' | 'greeting' | 'reminder'
  dealStage?: 'new' | 'in-progress' | 'under-review' | 'approved' | 'closed' | 'rejected'
  dealAmount?: number
  documentType?: string
  appointmentDate?: Date
}

export interface StageTransitionContext {
  currentStage: 'new' | 'in-progress' | 'under-review' | 'approved' | 'closed' | 'rejected'
  dealAmount?: number
  clientType?: 'personal' | 'business'
  daysInCurrentStage?: number
  hasRequiredDocuments?: boolean
  lastActivity?: string
}

/**
 * Auto-fill task duration based on task context
 * Returns duration in minutes
 */
export function getDefaultTaskDuration(context: TaskContext): number {
  const { title, description, priority, type } = context
  
  // Extract keywords from title and description
  const text = `${title} ${description || ''}`.toLowerCase()
  
  // Type-based defaults
  if (type) {
    switch (type) {
      case 'follow-up':
        return priority === 'urgent' || priority === 'high' ? 15 : 30
      case 'document-review':
        return 45 // Usually takes longer
      case 'consultation':
        return 60 // Standard consultation
      case 'administrative':
        return 15 // Quick admin tasks
      default:
        break
    }
  }
  
  // Keyword-based detection
  if (text.includes('quick') || text.includes('brief') || text.includes('reminder')) {
    return 15
  }
  
  if (text.includes('review') || text.includes('analyze') || text.includes('assessment')) {
    return priority === 'urgent' ? 30 : 60
  }
  
  if (text.includes('meeting') || text.includes('consultation') || text.includes('discussion')) {
    return 60
  }
  
  if (text.includes('call') || text.includes('phone') || text.includes('contact')) {
    return 15
  }
  
  if (text.includes('follow-up') || text.includes('followup')) {
    return 30
  }
  
  if (text.includes('document') || text.includes('paperwork')) {
    return 45
  }
  
  // Priority-based fallback
  switch (priority) {
    case 'urgent':
      return 15 // Urgent tasks should be quick
    case 'high':
      return 30
    case 'medium':
      return 45
    case 'low':
      return 30
    default:
      return 30 // Default: 30 minutes
  }
}

/**
 * Auto-suggest follow-up time based on client context
 * Returns number of days until follow-up
 */
export function getDefaultFollowUpTime(context: FollowUpContext): number {
  const { 
    clientType, 
    dealStage, 
    priority, 
    lastInteractionType,
    daysSinceLastContact = 0
  } = context
  
  // High priority clients - follow up sooner
  if (priority === 'high') {
    if (dealStage === 'new') return 1 // Next day for new high-priority
    if (dealStage === 'in-progress') return 2
    if (dealStage === 'under-review') return 3
    return 5
  }
  
  // Deal stage-based defaults
  if (dealStage === 'new') {
    return 2 // Follow up within 2 days for new deals
  }
  
  if (dealStage === 'in-progress') {
    return 3 // Check in every 3 days
  }
  
  if (dealStage === 'under-review') {
    return 5 // Weekly check-ins during review
  }
  
  if (dealStage === 'approved') {
    return 7 // Less frequent after approval
  }
  
  // Interaction type-based
  if (lastInteractionType === 'meeting') {
    return 5 // Follow up after meetings
  }
  
  if (lastInteractionType === 'email') {
    return 3 // Follow up emails after 3 days if no response
  }
  
  // Business clients might need longer intervals
  if (clientType === 'business') {
    return 5 // Business clients: 5 days
  }
  
  // Default: 3 days for personal clients
  return 3
}

/**
 * Auto-select WhatsApp template based on context
 */
export function getDefaultWhatsAppTemplate(context: WhatsAppContext): string {
  const { purpose, clientName, dealStage, documentType, appointmentDate } = context
  
  switch (purpose) {
    case 'greeting':
      return `Hi ${clientName}! 👋

Thank you for reaching out to Brilliance Advisory. I'm here to help you with your loan needs.

How can I assist you today?`
    
    case 'follow-up':
      if (dealStage === 'new') {
        return `Hi ${clientName}! 👋

I wanted to follow up on our discussion about your loan application. Have you had a chance to review the options we discussed?

Let me know if you have any questions or would like to proceed further!`
      }
      
      if (dealStage === 'in-progress') {
        return `Hi ${clientName}! 👋

Just checking in on your loan application progress. Is there anything you need help with or any questions I can answer?

Looking forward to hearing from you!`
      }
      
      return `Hi ${clientName}! 👋

Following up on your loan application. Please let me know if you need any assistance or have questions.

I'm here to help! 🙏`
    
    case 'document-request':
      return `Hi ${clientName}! 👋

We need the following document to proceed with your loan application:
📄 ${documentType || 'Required documents'}

Could you please share this at your earliest convenience? This will help us move forward quickly.

Thank you! 🙏`
    
    case 'appointment-confirmation':
      const dateStr = appointmentDate ? appointmentDate.toLocaleDateString('en-SG', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : 'the scheduled date'
      
      return `Hi ${clientName}! 👋

Just confirming our appointment:
📅 ${dateStr}

Looking forward to meeting with you. If you need to reschedule, please let me know.

See you soon! 🙏`
    
    case 'status-update':
      if (dealStage === 'approved') {
        return `Hi ${clientName}! 🎉

Great news! Your loan application has been approved!

I'll send you the details shortly. Congratulations! 🎊`
      }
      
      if (dealStage === 'under-review') {
        return `Hi ${clientName}! 👋

Just an update: Your loan application is currently under review.

I'll keep you updated as soon as I have more information. Thank you for your patience! 🙏`
      }
      
      return `Hi ${clientName}! 👋

Here's an update on your loan application. I'll share more details soon.

Thank you for your patience! 🙏`
    
    case 'reminder':
      return `Hi ${clientName}! 👋

Just a friendly reminder about your upcoming appointment/deadline.

Please let me know if you need to reschedule or have any questions! 🙏`
    
    default:
      return `Hi ${clientName}! 👋

Thank you for contacting Brilliance Advisory. How can I assist you today?`
  }
}

/**
 * Auto-suggest next pipeline stage based on current context
 */
export function getSuggestedNextStage(context: StageTransitionContext): 'new' | 'in-progress' | 'under-review' | 'approved' | 'closed' | 'rejected' | null {
  const { currentStage, dealAmount, hasRequiredDocuments, daysInCurrentStage = 0, lastActivity } = context
  
  // Normal progression flow
  switch (currentStage) {
    case 'new':
      // Move to in-progress when documents are ready or after initial contact
      if (hasRequiredDocuments || daysInCurrentStage >= 1) {
        return 'in-progress'
      }
      return null // Stay in new if documents not ready
    
    case 'in-progress':
      // Move to under-review when all documents submitted
      if (hasRequiredDocuments && daysInCurrentStage >= 2) {
        return 'under-review'
      }
      // Can move if consultant manually progresses
      return 'under-review'
    
    case 'under-review':
      // Typically approved or rejected - but default to approved if high value
      if (dealAmount && dealAmount > 100000) {
        return 'approved' // High-value deals more likely approved
      }
      // Cannot auto-determine approval - requires manual decision
      return null
    
    case 'approved':
      // Once approved, next logical step is closed (when funds disbursed)
      if (daysInCurrentStage >= 3) {
        return 'closed'
      }
      return null
    
    case 'closed':
    case 'rejected':
      // Terminal states - no next stage
      return null
    
    default:
      return null
  }
}

/**
 * Get AI suggestion explanation for transparency
 */
export function getAutoFillExplanation(field: 'duration' | 'followUp' | 'template' | 'stage', context: any): string {
  switch (field) {
    case 'duration':
      return `AI suggested ${context.duration} minutes based on task type "${context.type || 'general'}" and priority "${context.priority || 'medium'}". You can change this if needed.`
    
    case 'followUp':
      return `AI suggested following up in ${context.days} days based on deal stage "${context.dealStage}", priority "${context.priority || 'medium'}", and client type "${context.clientType}". Adjust if needed.`
    
    case 'template':
      return `AI selected a template for "${context.purpose}" based on context. You can edit the message before sending.`
    
    case 'stage':
      return `AI suggests moving to "${context.nextStage}" based on current progress (${context.daysInStage} days in current stage, documents ${context.hasDocuments ? 'ready' : 'pending'}). This is a suggestion - you decide.`
    
    default:
      return 'AI suggestion - you can override this.'
  }
}
