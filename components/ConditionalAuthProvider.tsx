'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/AuthContext'

/**
 * Conditionally loads AuthProvider only on routes that need authentication
 * However, we always load it because Header component uses useAuth()
 * But we can make it lightweight for public pages
 */
export function ConditionalAuthProvider({ children }: { children: React.ReactNode }) {
  // Always provide AuthProvider because Header component uses useAuth()
  // The AuthProvider itself handles the case where there's no token gracefully
  // This prevents "useAuth must be used within an AuthProvider" errors
  return <AuthProvider>{children}</AuthProvider>
}
