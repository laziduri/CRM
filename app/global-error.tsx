'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">Something went wrong!</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">A critical error occurred</h2>
            <p className="text-gray-600 mb-8">
              {error.message || 'We encountered an unexpected error. Please refresh the page.'}
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
