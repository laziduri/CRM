'use client'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AppShell } from "@/components/shell/AppShell"

export default function CrmLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <AppShell>{children}</AppShell>
    </ErrorBoundary>
  )
}
