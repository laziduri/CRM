'use client'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import CRMSidebar from '@/components/layout/CRMSidebar'
import BottomTabNavigation from '@/components/mobile/BottomTabNavigation'

export default function ConsultantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Consultant routes use their own layout - no public Header/Footer/chatbot
  // (they are siblings of (public) routes, not children)
  return (
    <ErrorBoundary>
      <div className="crm-app flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <CRMSidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="min-h-full">
            {children}
          </div>
        </main>
        
        {/* Mobile Bottom Tab Navigation */}
        <BottomTabNavigation />
      </div>
    </ErrorBoundary>
  )
}
