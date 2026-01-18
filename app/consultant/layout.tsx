'use client'

import { useEffect } from 'react'
import CRMSidebar from '@/components/layout/CRMSidebar'

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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <CRMSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
