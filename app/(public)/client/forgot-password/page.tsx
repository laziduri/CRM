'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Mail, ArrowLeft } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Placeholder: full reset flow can be added later (e.g. call API to send reset email)
    setSubmitted(true)
    setIsLoading(false)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Link
            href="/client/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot password?</h1>
            <p className="text-gray-600 mb-6">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            {submitted ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">
                  If an account exists for that email, you will receive a password reset link. Please check your inbox.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Password reset is not yet configured. Contact support at sales@brillianceadvisory.sg for assistance.
                </p>
                <Link href="/client/login">
                  <Button variant="primary" size="lg">
                    Return to sign in
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
