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
    <ErrorBoundary>
      <Header />
      <main>{children}</main>
      <Footer />
    </ErrorBoundary>
  )
}
