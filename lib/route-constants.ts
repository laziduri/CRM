/**
 * Centralized route constants for the application.
 * Use these instead of hardcoded strings to prevent typos and broken links.
 *
 * Component categories:
 * - Website-only: Header, Footer, Hero, etc. (use PUBLIC routes)
 * - CRM-only: CRMSidebar, DealList, etc. (use CRM/CONSULTANT routes)
 * - Shared: Button, Input, ErrorBoundary (can reference any route)
 */
export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    LOGIN: '/client/login',
    APPLY: '/apply',
    CONTACT: '/contact',
    FAQ: '/faq',
    RESOURCES: '/resources',
    ABOUT: '/aboutus',
    PRIVACY: '/privacy',
    TERMS: '/terms',
    DISCLAIMER: '/disclaimer',
    CALCULATOR: '/calculator',
    DEBT_CONSOLIDATION: '/calculator/debt-consolidation',
    LOANS_BUSINESS: '/loans/business',
    LOANS_PERSONAL: '/loans/personal',
    REFERRAL: '/referral',
    CAREERS: '/careers',
    BLOG: '/blog',
  },
  CRM: {
    HOME: '/crm',
    LOGIN: '/crm',
    DEALS: '/crm/deals',
    DEALS_NEW: '/crm/deals/new',
    dealDetail: (id: string) => `/crm/deals/${id}` as const,
    dealEdit: (id: string) => `/crm/deals/${id}/edit` as const,
    PRODUCTS: '/crm/products',
  },
  CONSULTANT: {
    DASHBOARD: '/consultant/dashboard',
    SETTINGS: '/consultant/dashboard/settings',
    RESOURCES: '/consultant/dashboard/resources',
    CALENDAR: '/consultant/calendar',
    TASKS: '/consultant/tasks',
    CLIENTS: '/consultant/clients',
    clientDetail: (id: string) => `/consultant/clients/${id}` as const,
    PIPELINE: '/consultant/pipeline',
    MESSAGES: '/consultant/messages',
    APPOINTMENTS: '/consultant/appointments',
    APPLICATIONS: '/consultant/applications',
    SUMMARIES: '/consultant/summaries',
    PERFORMANCE: '/consultant/performance',
    COMMISSION: '/consultant/commission',
    TEAM: '/consultant/team',
    ACTIVITY: '/consultant/activity',
    AI_PROJECTS: '/consultant/ai/projects',
    AI_TASKS: '/consultant/ai/tasks',
    AI_CALENDAR: '/consultant/ai/calendar',
    AI_GANTT: '/consultant/ai/gantt',
    AI_WORKFLOWS: '/consultant/ai/workflows',
    AI_MEETING_ASSISTANT: '/consultant/ai/meeting-assistant',
    AI_MEETINGS: '/consultant/ai/meetings',
    AI_CHAT: '/consultant/ai/chat',
    AI_DASHBOARDS: '/consultant/ai/dashboards',
    AI_DOCS: '/consultant/ai/docs',
  },
  CLIENT: {
    DASHBOARD: '/client/dashboard',
    SETTINGS: '/client/dashboard/settings',
    CALCULATIONS: '/client/dashboard/calculations',
    CHECKLIST: '/client/dashboard/checklist',
    CONSULTATIONS: '/client/dashboard/consultations',
    VERIFY_EMAIL: '/client/verify-email',
  },
} as const
