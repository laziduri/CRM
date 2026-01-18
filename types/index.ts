export interface Loan {
  id: string
  lender: string
  loanType: 'personal' | 'business' | 'home' | 'car'
  interestRate: number
  minAmount: number
  maxAmount: number
  minTenure: number
  maxTenure: number
  features: string[]
  eligibility: string[]
  fees?: {
    processingFee?: number
    lateFee?: number
    earlyRepaymentFee?: number
  }
  logo?: string
  description?: string
}

export interface Testimonial {
  id: string
  name: string
  rating: number
  comment: string
  loanType: string
  avatar?: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  image?: string
  pillar?: 'Personal Loan Intelligence' | 'Business Loan Strategy' | 'Bank & Credit Behaviour' | 'SME Finance & Growth'
  keyTakeaways?: string[]
  internalLinks?: string[]
}

export interface Partner {
  id: string
  name: string
  logo: string
  url?: string
}

export interface Job {
  id: string
  title: string
  slug: string
  department: 'Business Development' | 'Client Solutions' | 'Operations' | 'Marketing' | 'People & Admin' | 'Internships'
  employmentType: 'Full-Time' | 'Internship'
  location: string
  status: 'Open' | 'Talent Pool'
  description: string
  postedDate?: string
}

// Calendar & Task Types
export type CalendarItemType = 'appointment' | 'task'
export type TaskType = 'remind-customer' | 'follow-up-payment' | 'call' | 'email' | 'document' | 'other'
export type AppointmentType = 'consultation' | 'follow-up' | 'meeting' | 'door-knocking' | 'closing' | 'internal'
export type CalendarViewMode = 'month' | 'week' | 'day'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled'

export interface BaseCalendarItem {
  id: string
  title: string
  startTime: Date
  endTime: Date
  type: CalendarItemType
  status: TaskStatus | AppointmentStatus
  consultantId: string
  consultantName?: string
  isMyItem?: boolean
  isTeamItem?: boolean
  teammateId?: string
  teammateName?: string
  isDirectorItem?: boolean
  directorId?: string
  directorName?: string
  notes?: string
  aiSuggested?: boolean
  aiRecommendations?: string
  color?: string
}

export interface Task extends BaseCalendarItem {
  type: 'task'
  taskType: TaskType
  priority: TaskPriority
  deadline?: Date
  startDate?: Date
  clientId?: string
  clientName?: string
  relatedAppointmentId?: string
  estimatedDuration: number // in minutes
  status: TaskStatus
  statusType?: TaskStatusType // 'todo' | 'in-progress' | 'review' | 'done' | 'blocked'
  completedAt?: Date
  assigneeId?: string
  assigneeName?: string
  calendarId?: string // Which calendar this belongs to
  labels?: string[] // Label IDs
  category?: string // Category ID
  channel?: string // Channel ID
  taskTypeTag?: string // Type tag like 'Review', 'Recording', etc.
  url?: string
  contributors?: string[] // Contributor user IDs
  progress?: number // For multi-part tasks like "2/2"
  isLocked?: boolean
}

export interface Appointment extends BaseCalendarItem {
  type: 'appointment'
  appointmentType: AppointmentType
  clientId?: string // Optional for door-knocking events
  clientName?: string
  clientType?: 'personal' | 'business'
  location: 'office' | 'online' | 'client-site' | string
  duration: number // in minutes
  status: AppointmentStatus
  reminder?: Date
  attendees?: string[]
  // Door-knocking and meeting join features
  isJoinable?: boolean // Can others join this event?
  joiners?: string[] // Array of consultant IDs who joined
  locationAddress?: string // Full address for door-knocking
  googleMapsLink?: string // Google Maps link
  latitude?: number // For map integration
  longitude?: number // For map integration
  isBirthday?: boolean // Flag for birthday events
}

export type CalendarItem = Task | Appointment

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'consultant' | 'director' | 'admin'
  color?: string
  avatar?: string
  birthday?: Date // Birthday date
  showBirthday?: boolean // Privacy setting for birthday visibility
}

export type CalendarCategory = 'life' | 'appointments' | 'tasks' | 'work' | 'personal' | 'custom'
export type TaskStatusType = 'todo' | 'in-progress' | 'review' | 'done' | 'blocked'
export type ColorPreset = 
  | 'mint' | 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow' 
  | 'green' | 'teal' | 'cyan' | 'indigo' | 'violet' | 'rose' | 'amber'

export interface Calendar {
  id: string
  name: string
  category: CalendarCategory
  color: ColorPreset
  isVisible: boolean
  ownerId: string
  isShared?: boolean
  sharedWith?: string[]
}

export interface TaskLabel {
  id: string
  name: string
  color: ColorPreset
}

export interface TaskCategory {
  id: string
  name: string
  color: ColorPreset
}

export interface TaskChannel {
  id: string
  name: string
  color: ColorPreset
}

export interface AISuggestion {
  id: string
  type: 'schedule-task' | 'reschedule-appointment' | 'add-buffer' | 'optimize-day'
  title: string
  description: string
  suggestedTime?: Date
  priority: TaskPriority
  confidence: number // 0-1
  reasoning: string
}

// Document Checklist Types
export type DocumentStatus = 'pending' | 'received'
export type DocumentCategory = 'identity' | 'income' | 'business' | 'property' | 'other'

export interface ClientDocument {
  id: string
  name: string
  description?: string
  category: DocumentCategory
  status: DocumentStatus
  required: boolean
  receivedDate?: Date
  uploadedBy?: string
  uploadedAt?: Date
  fileUrl?: string
  fileName?: string
  notes?: string
}

export interface DocumentChecklist {
  clientId: string
  documents: ClientDocument[]
  lastUpdated: Date
}
