import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AIChatbot from '@/components/layout/AIChatbot'
import PreloaderWrapper from '@/components/PreloaderWrapper'
import { AuthProvider } from '@/contexts/AuthContext'

const DynamicBackground = dynamic(() => import('@/components/DynamicBackground'), {
  ssr: false,
})

// ScrollProgress component - only load if motion is available (with error handling)
const ScrollProgress = dynamic(
  () => import('@/components/ui/scroll-progress')
    .then(mod => ({ default: mod.ScrollProgress }))
    .catch((err) => {
      console.error('ScrollProgress import error:', err)
      // Return a no-op component if import fails
      return { default: () => null }
    }),
  { 
    ssr: false,
    loading: () => null
  }
)

export const metadata: Metadata = {
  title: 'Brilliance Advisory - Compare Loans in Singapore',
  description: 'Compare and find the best personal loans, business loans, and more in Singapore. Fast approval, no hidden fees.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="w-full overflow-x-hidden">
      <body className="w-full overflow-x-hidden" style={{ minHeight: '100vh', margin: 0, padding: 0, backgroundColor: 'transparent', opacity: 1, visibility: 'visible' }}>
        <AuthProvider>
          <PreloaderWrapper>
            <ScrollProgress />
            <DynamicBackground />
            <Header />
            <main className="min-h-screen w-full relative" suppressHydrationWarning style={{ opacity: 1, visibility: 'visible', zIndex: 1 }}>
              {children}
            </main>
            <Footer />
            <AIChatbot />
          </PreloaderWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
