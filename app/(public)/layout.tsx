'use client'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('PublicLayout error:', error, errorInfo)
      }}
    >
      <Header />
      <main>{children}</main>
      <Footer />
    </ErrorBoundary>
  )
}
