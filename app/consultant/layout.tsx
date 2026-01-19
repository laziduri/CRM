'use client'

import { useEffect } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import CRMSidebar from '@/components/layout/CRMSidebar'
import BottomTabNavigation from '@/components/mobile/BottomTabNavigation'

export default function ConsultantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Hide main site header/footer for CRM pages
  useEffect(() => {
    const header = document.querySelector('header')
    const footer = document.querySelector('footer')
    const chatbot = document.querySelector('[id*="chatbot"], [class*="chatbot"]')
    
    if (header) header.style.display = 'none'
    if (footer) footer.style.display = 'none'
    if (chatbot) (chatbot as HTMLElement).style.display = 'none'
    
    return () => {
      if (header) header.style.display = ''
      if (footer) footer.style.display = ''
      if (chatbot) (chatbot as HTMLElement).style.display = ''
    }
  }, [])

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-gray-50">
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
