'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    if (!token || !email) {
      setStatus('error')
      setMessage('Invalid verification link. Please check your email and try again.')
      return
    }

    // Call verification API
    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/client/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, email }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setStatus('success')
          setMessage('Your email has been verified successfully! You can now log in to your account.')
          
          // Auto-redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/client/login?verified=true')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed. The link may have expired.')
        }
      } catch (error) {
        setStatus('error')
        setMessage('An error occurred during verification. Please try again.')
      }
    }

    verifyEmail()
  }, [token, email, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-modern-dots opacity-5 z-0"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal/5 rounded-full blur-3xl z-0"></div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="relative h-12 w-12 flex-shrink-0">
              <img
                src="/images/brilliance-logo.svg"
                alt="Brilliance Advisory Logo"
                className="h-12 w-12 object-contain"
                onError={(e) => {
                  if (e.currentTarget.src.includes('.svg')) {
                    e.currentTarget.src = '/images/brilliance-logo.png'
                  }
                }}
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">
              Brilliance Advisory
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h1>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {status === 'loading' && (
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-6">Redirecting to login page...</p>
              <Link href="/client/login?verified=true">
                <Button variant="primary" size="lg" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Link href="/client/login">
                  <Button variant="primary" size="lg" className="w-full">
                    Go to Login
                  </Button>
                </Link>
                <Link href="/client/register">
                  <Button variant="secondary" size="lg" className="w-full">
                    Create New Account
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
