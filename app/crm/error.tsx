'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('CRM error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative text-center max-w-2xl mx-auto z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6 border border-red-500/30">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">Something went wrong!</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">An error occurred</h2>
        <p className="text-gray-400 mb-8">
          {error.message || 'We encountered an unexpected error. Please try again.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
          >
            Try again
          </button>
          <Link href="/crm">
            <button className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-cyan-500/30 rounded-lg font-semibold text-gray-300 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to CRM
            </button>
          </Link>
          <Link href="/">
            <button className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-cyan-500/30 rounded-lg font-semibold text-gray-300 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
