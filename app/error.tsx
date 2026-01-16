'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      <div className="relative text-center max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">Something went wrong!</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">An error occurred</h2>
        <p className="text-gray-600 mb-8">
          {error.message || 'We encountered an unexpected error. Please try again.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={reset}>
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
