// Chatbot conversation flow logic

export interface FlowStep {
  message: string
  buttons?: Array<{ label: string; value: string }>
  nextStep?: (answer: string) => number
}

export interface FlowConfig {
  [key: string]: FlowStep
}

// Intent types
export type UserIntent = 'browsing' | 'comparing' | 'ready-to-apply' | 'just-curious'

// Memory/Context tracking
export interface ConversationMemory {
  userInfo: {
    employmentType?: 'salaried' | 'self_employed' | 'business_owner'
    loanType?: 'personal' | 'business'
    loanAmount?: string
    loanPurpose?: string
    businessStatus?: string
    financingPurpose?: string
  }
  intent: UserIntent
  questionsAsked: string[]
  messagesCount: number
}

// Intent detection
export function detectIntent(message: string, memory: ConversationMemory): UserIntent {
  const lowerMessage = message.toLowerCase()
  
  // High intent indicators
  const readyToApplyKeywords = [
    'apply', 'application', 'applying', 'ready', 'want to get', 'need now', 'urgent',
    'documents', 'doc', 'what do i need', 'requirements', 'how to apply'
  ]
  
  // Comparing indicators
  const comparingKeywords = [
    'compare', 'difference', 'which is better', 'vs', 'versus', 'options',
    'what are the', 'tell me about', 'explain'
  ]
  
  // Just curious indicators
  const curiousKeywords = [
    'just wondering', 'curious', 'learning', 'explore', 'find out', 'what is'
  ]
  
  if (readyToApplyKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'ready-to-apply'
  }
  
  if (comparingKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'comparing'
  }
  
  if (curiousKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'just-curious'
  }
  
  // Default to browsing if no clear intent
  return 'browsing'
}

// Personal Loan Flow - Progressive disclosure with smart defaults
export const personalLoanFlow: FlowConfig = {
  step1: {
    message: 'Got it 🙂\n\nIs this for personal or business use?',
    buttons: [
      { label: 'Personal', value: 'personal' },
      { label: 'Business', value: 'business' },
    ],
  },
  step2: {
    message: 'Is the loan for something specific, or general use?',
    buttons: [
      { label: 'Debt consolidation', value: 'debt_consolidation' },
      { label: 'Personal expenses', value: 'personal_expenses' },
      { label: 'Emergency / urgent', value: 'emergency' },
      { label: 'General use', value: 'general_use' },
    ],
  },
  step3: {
    message: 'Roughly how much are you looking at?\n\n(I ask this because different banks have different limits, so it helps me give you a more realistic guide.)',
    buttons: [
      { label: 'Below $10k', value: 'below_10k' },
      { label: '$10k – $30k', value: '10k_30k' },
      { label: '$30k – $50k', value: '30k_50k' },
      { label: 'Above $50k', value: 'above_50k' },
      { label: 'Not sure yet', value: 'not_sure' },
    ],
  },
  step4: {
    message: 'What best describes your income?\n\n(Different banks assess differently, so this helps me point you in the right direction.)',
    buttons: [
      { label: 'Salaried employee', value: 'salaried' },
      { label: 'Self-employed / freelancer', value: 'self_employed' },
      { label: 'Business owner', value: 'business_owner' },
    ],
  },
  step5: {
    message: 'About how much do you earn monthly?\n\n(This helps me understand which banks might be a better fit.)',
    buttons: [
      { label: 'Below $3k', value: 'below_3k' },
      { label: '$3k – $6k', value: '3k_6k' },
      { label: '$6k – $10k', value: '6k_10k' },
      { label: 'Above $10k', value: 'above_10k' },
      { label: 'Prefer not to say', value: 'prefer_not_say' },
    ],
  },
  step6: {
    message: 'Based on what you shared, there are usually a few options available 😊\n\nFinal approval depends on the bank\'s assessment, but this looks workable.',
  },
}

// Business Loan Flow - Progressive disclosure
export const businessLoanFlow: FlowConfig = {
  step1: {
    message: 'Sure 👍\n\nIs your business currently:',
    buttons: [
      { label: 'Newly incorporated', value: 'newly_incorporated' },
      { label: 'Operating & profitable', value: 'profitable' },
      { label: 'Cash flow tight', value: 'cash_flow_tight' },
      { label: 'Expanding / scaling', value: 'expanding' },
    ],
  },
  step2: {
    message: 'What will the financing mainly be used for?',
    buttons: [
      { label: 'Working capital', value: 'working_capital' },
      { label: 'Equipment / renovation', value: 'equipment' },
      { label: 'Expansion', value: 'expansion' },
      { label: 'Debt restructuring', value: 'debt_restructuring' },
    ],
  },
  step3: {
    message: 'Thanks for sharing.\n\nWe help SMEs structure financing properly, even when banks are more strict.',
  },
}

// High-intent detection keywords
export const highIntentKeywords = [
  'interest rate', 'interest rates', 'rate', 'rates', 'apr',
  'document', 'documents', 'doc',
  'approval', 'approve', 'approved', 'chance', 'chances',
  'how fast', 'how long', 'speed', 'fast', 'quick', 'urgent',
  'apply', 'application', 'applying',
]

export function detectHighIntent(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  return highIntentKeywords.some(keyword => lowerMessage.includes(keyword))
}

export function getHighIntentResponse(): { message: string; buttons: Array<{ label: string; value: string }> } {
  return {
    message: 'This is best handled by a consultant so nothing is missed.\nNo obligation — just clarity.',
    buttons: [
      { label: 'Book appointment', value: 'book_appointment' },
      { label: 'WhatsApp advisor', value: 'whatsapp_advisor' },
    ],
  }
}
