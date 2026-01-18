'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Mail, Lock, AlertCircle, ArrowRight, User, Phone, CheckCircle2, Briefcase } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ClientLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [isRegistering, setIsRegistering] = useState(false)
  
  // Client login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Check for success messages
  useEffect(() => {
    const verified = searchParams.get('verified')
    
    if (verified === 'true') {
      setSuccess('Your email has been verified successfully! You can now log in.')
    }
  }, [searchParams])
  
  // Register form state
  const [registerName, setRegisterName] = useState('')
  const [registerUsername, setRegisterUsername] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPhone, setRegisterPhone] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/client/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed. Please check your credentials.')
        setIsLoading(false)
        return
      }

      // Use AuthContext login function
      if (data.token) {
        login(data.token, data.clientId)
        setSuccess('Login successful! Redirecting...')
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/client/dashboard')
        }, 500)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError('')

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Passwords do not match')
      return
    }

    if (registerPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters')
      return
    }

    setIsRegisterLoading(true)

    try {
      const response = await fetch('/api/client/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          phone: registerPhone,
          password: registerPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setRegisterError(data.error || 'Registration failed. Please try again.')
        setIsRegisterLoading(false)
        return
      }

      // Registration successful - show message about email verification
      if (data.requiresVerification) {
        setSuccess(data.message || 'Account created successfully! Please check your email to verify your account before logging in.')
        setIsRegistering(false)
        // Don't redirect - let user know to check email
      } else if (data.token) {
        // If somehow verified during registration (shouldn't happen)
        login(data.token, data.clientId)
        router.push('/client/dashboard')
      } else {
        setSuccess(data.message || 'Account created successfully! Please check your email to verify your account.')
        setIsRegistering(false)
      }
    } catch (err) {
      setRegisterError('An error occurred. Please try again.')
      setIsRegisterLoading(false)
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRegistering ? 'Create Account' : 'Client Login'}
          </h1>
          <p className="text-gray-600">
            {isRegistering
              ? 'Register to access your personalized dashboard and start your advisory journey'
              : 'Sign in to access your personalized dashboard and continue your advisory journey'}
          </p>
        </div>

        {/* Consultant Login Button - Prominent Link to CRM */}
        {!isRegistering && (
          <div className="mb-6">
            <a 
              href={
                typeof window !== 'undefined' 
                  ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                      ? '/crm' 
                      : `https://crm.${window.location.hostname.replace('www.', '')}`)
                  : '/crm'
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                size="lg"
                className="w-full flex items-center justify-center gap-2 border-2 border-primary/30 hover:border-primary transition-all"
              >
                <Briefcase className="w-5 h-5" />
                Consultant Login - Access CRM
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Client Login Form */}
          {!isRegistering && (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {/* Email/Username Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email or Username
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="your.email@example.com or username"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/client/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Signing in...'
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Registration Form */}
          {isRegistering && (
            <>
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              )}
              {registerError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{registerError}</p>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                {/* Full Name Field */}
                <div>
                  <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="register-name"
                      type="text"
                      required
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="John Doe"
                      disabled={isRegisterLoading}
                    />
                  </div>
                </div>

                {/* Username Field */}
                <div>
                  <label htmlFor="register-username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                    <span className="ml-2 text-xs font-normal text-gray-500">(username for login)</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="register-username"
                      type="text"
                      required
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="johndoe"
                      disabled={isRegisterLoading}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="register-email"
                      type="email"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                      disabled={isRegisterLoading}
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="register-phone"
                      type="tel"
                      required
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="+65 9123 4567"
                      disabled={isRegisterLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="register-password"
                      type="password"
                      required
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Minimum 6 characters"
                      disabled={isRegisterLoading}
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="register-confirm-password"
                      type="password"
                      required
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Re-enter your password"
                      disabled={isRegisterLoading}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isRegisterLoading}
                >
                  {isRegisterLoading ? (
                    'Creating account...'
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Back to Login Link */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Information Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong className="font-semibold text-gray-900">Secure Access:</strong> Your information is protected with industry-standard encryption. All data is handled with care, and any applicable advisory fees are clearly explained and agreed upon before engagement.
            </p>
          </div>
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
