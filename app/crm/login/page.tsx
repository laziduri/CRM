'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Mail, Lock, AlertCircle, ArrowRight, User, Phone, CheckCircle2, Briefcase, ArrowLeft, Calendar as CalendarIcon, Eye, EyeOff, Loader2 } from 'lucide-react'

function ConsultantLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isRegistering, setIsRegistering] = useState(false)
  
  // Consultant login form state
  const [consultantId, setConsultantId] = useState('')
  const [consultantUsername, setConsultantUsername] = useState('')
  const [consultantEmail, setConsultantEmail] = useState('')
  const [consultantPassword, setConsultantPassword] = useState('')
  const [consultantError, setConsultantError] = useState('')
  const [consultantIsLoading, setConsultantIsLoading] = useState(false)
  const [isConsultantRegistering, setIsConsultantRegistering] = useState(false)

  // Consultant registration form state
  const [consultantRegisterName, setConsultantRegisterName] = useState('')
  const [consultantRegisterUsername, setConsultantRegisterUsername] = useState('')
  const [consultantRegisterEmail, setConsultantRegisterEmail] = useState('')
  const [consultantRegisterPhone, setConsultantRegisterPhone] = useState('')
  const [consultantRegisterBirthday, setConsultantRegisterBirthday] = useState('')
  const [consultantRegisterShowBirthday, setConsultantRegisterShowBirthday] = useState(true)
  const [consultantRegisterPassword, setConsultantRegisterPassword] = useState('')
  const [consultantRegisterConfirmPassword, setConsultantRegisterConfirmPassword] = useState('')
  const [consultantRegisterAccessCode, setConsultantRegisterAccessCode] = useState('')
  const [consultantRegisterDirector, setConsultantRegisterDirector] = useState('')
  const [consultantRegisterError, setConsultantRegisterError] = useState('')
  const [consultantRegisterSuccess, setConsultantRegisterSuccess] = useState('')
  const [isConsultantRegisterLoading, setIsConsultantRegisterLoading] = useState(false)
  
  // Check if already logged in and redirect to dashboard immediately
  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (token) {
      router.push('/consultant/dashboard')
    }
  }, [router])

  // Check for success messages
  useEffect(() => {
    const verified = searchParams.get('verified')
    
    if (verified === 'true') {
      setConsultantRegisterSuccess('Your email has been verified successfully! You can now log in.')
    }
  }, [searchParams])

  const handleConsultantLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setConsultantError('')
    
    // Validate that at least one identifier is provided
    if (!consultantId && !consultantUsername && !consultantEmail) {
      setConsultantError('Please enter Consultant ID, Username, or Email')
      return
    }
    
    if (!consultantPassword) {
      setConsultantError('Please enter your password')
      return
    }
    
    setConsultantIsLoading(true)

    try {
      const response = await fetch('/api/consultant/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          consultantId: consultantId || undefined,
          username: consultantUsername || undefined,
          email: consultantEmail || undefined,
          password: consultantPassword 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setConsultantError(data.error || 'Login failed. Please check your credentials.')
        setConsultantIsLoading(false)
        return
      }

      // Store consultant session
      if (data.token) {
        localStorage.setItem('consultant_token', data.token)
        localStorage.setItem('consultant_id', data.consultantId)
        // Redirect to consultant dashboard and refresh to update header
        router.push('/consultant/dashboard')
        router.refresh()
      }
    } catch (err) {
      setConsultantError('An error occurred. Please try again.')
      setConsultantIsLoading(false)
    }
  }

  const handleConsultantRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setConsultantRegisterError('')
    setConsultantRegisterSuccess('')
    setIsConsultantRegisterLoading(true)

    // Validate access code
    if (consultantRegisterAccessCode !== 'BA123456') {
      setConsultantRegisterError('Invalid access code. Please contact your administrator.')
      setIsConsultantRegisterLoading(false)
      return
    }

    // Validate passwords match
    if (consultantRegisterPassword !== consultantRegisterConfirmPassword) {
      setConsultantRegisterError('Passwords do not match')
      setIsConsultantRegisterLoading(false)
      return
    }

    // Validate password length
    if (consultantRegisterPassword.length < 6) {
      setConsultantRegisterError('Password must be at least 6 characters')
      setIsConsultantRegisterLoading(false)
      return
    }

    // Validate director selection
    if (!consultantRegisterDirector) {
      setConsultantRegisterError('Please select a director')
      setIsConsultantRegisterLoading(false)
      return
    }

    try {
      const response = await fetch('/api/consultant/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: consultantRegisterName,
          username: consultantRegisterUsername,
          email: consultantRegisterEmail,
          phone: consultantRegisterPhone,
          birthday: consultantRegisterBirthday || undefined,
          showBirthday: consultantRegisterShowBirthday,
          password: consultantRegisterPassword,
          accessCode: consultantRegisterAccessCode,
          director: consultantRegisterDirector,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setConsultantRegisterError(data.error || 'Registration failed. Please try again.')
        setIsConsultantRegisterLoading(false)
        return
      }

      // Registration successful - show success message and switch to login
      setConsultantRegisterSuccess('Account created successfully! You can now log in.')
      setIsConsultantRegistering(false)
      
      // Clear form
      setConsultantRegisterName('')
      setConsultantRegisterUsername('')
      setConsultantRegisterEmail('')
      setConsultantRegisterPhone('')
      setConsultantRegisterBirthday('')
      setConsultantRegisterShowBirthday(true)
      setConsultantRegisterPassword('')
      setConsultantRegisterConfirmPassword('')
      setConsultantRegisterAccessCode('')
      setConsultantRegisterDirector('')
      
      setIsConsultantRegisterLoading(false)
    } catch (err) {
      setConsultantRegisterError('An error occurred. Please try again.')
      setIsConsultantRegisterLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      ></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <Link href="/crm" className="inline-flex items-center gap-2 mb-8 text-cyan-400 hover:text-cyan-300 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to CRM Home</span>
          </Link>
          <div className="flex items-center justify-center mb-6">
            <div className="relative p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
              <Briefcase className="w-8 h-8 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-white">
            {isRegistering
              ? <span>Create <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Consultant Account</span></span>
              : isConsultantRegistering
              ? <span>Create <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Consultant Account</span></span>
              : <span><span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Consultant Login</span></span>}
          </h1>
          <p className="text-gray-300">
            {isRegistering || isConsultantRegistering
              ? 'Create your consultant account to access the CRM portal'
              : 'Sign in to access your consultant CRM portal'}
          </p>
        </div>

        {/* Login Card */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-500/20 p-8 hover:border-cyan-500/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 rounded-3xl"></div>
          <div className="relative z-10">
          {/* Consultant Login Form */}
          {!isRegistering && !isConsultantRegistering && (
            <>
              {consultantError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{consultantError}</p>
                </div>
              )}

              <form onSubmit={handleConsultantLoginSubmit} className="space-y-6">
                {/* Consultant ID Field */}
                <div>
                  <label htmlFor="consultantId" className="block text-sm font-medium text-gray-300 mb-2">
                    Consultant ID
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="consultantId"
                      type="text"
                      value={consultantId}
                      onChange={(e) => {
                        setConsultantId(e.target.value)
                        // Clear other fields when Consultant ID is entered
                        if (e.target.value) {
                          setConsultantUsername('')
                          setConsultantEmail('')
                        }
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-white placeholder-gray-500"
                      placeholder="Enter Consultant ID (e.g., CON001)"
                      disabled={consultantIsLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Or use Username/Email below</p>
                </div>

                {/* Username or Email Field */}
                <div>
                  <label htmlFor="consultantUsername" className="block text-sm font-medium text-gray-700 mb-2">
                    Username or Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="consultantUsername"
                      type="text"
                      value={consultantUsername || consultantEmail}
                      onChange={(e) => {
                        const value = e.target.value
                        // Detect if it's an email
                        if (value.includes('@')) {
                          setConsultantEmail(value)
                          setConsultantUsername('')
                        } else {
                          setConsultantUsername(value)
                          setConsultantEmail('')
                        }
                        // Clear Consultant ID when username/email is entered
                        if (value) {
                          setConsultantId('')
                        }
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter Username or Email"
                      disabled={consultantIsLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="consultantPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="consultantPassword"
                      type="password"
                      required
                      value={consultantPassword}
                      onChange={(e) => setConsultantPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your password"
                      disabled={consultantIsLoading}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={consultantIsLoading}
                  className="group relative w-full px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {consultantIsLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In as Consultant
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>

              {/* Sign Up Link - Consultant */}
              <div className="mt-6 pt-6 border-t border-cyan-500/20 text-center">
                <p className="text-sm text-gray-300">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsConsultantRegistering(true)
                      setConsultantError('')
                      setConsultantRegisterError('')
                    }}
                    className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Consultant Registration Form - Same as before */}
          {!isRegistering && isConsultantRegistering && (
            <>
              {consultantRegisterSuccess && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3 backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-300">{consultantRegisterSuccess}</p>
                </div>
              )}

              {consultantRegisterError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{consultantRegisterError}</p>
                </div>
              )}

              <form onSubmit={handleConsultantRegisterSubmit} className="space-y-6">
                {/* Access Code Field */}
                <div>
                  <label htmlFor="consultantAccessCode" className="block text-sm font-medium text-gray-300 mb-2">
                    Access Code <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="consultantAccessCode"
                      type="text"
                      required
                      value={consultantRegisterAccessCode}
                      onChange={(e) => setConsultantRegisterAccessCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-white placeholder-gray-500"
                      placeholder="Enter access code"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Contact your administrator for the access code</p>
                </div>

                {/* Director Field */}
                <div>
                  <label htmlFor="consultantDirector" className="block text-sm font-medium text-gray-300 mb-2">
                    Director <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                    <select
                      id="consultantDirector"
                      required
                      value={consultantRegisterDirector}
                      onChange={(e) => setConsultantRegisterDirector(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all appearance-none text-white"
                      disabled={isConsultantRegisterLoading}
                    >
                      <option value="" className="bg-[#0a0a0f]">Select a director...</option>
                      <option value="ashley" className="bg-[#0a0a0f]">Ashley</option>
                      <option value="kenneth" className="bg-[#0a0a0f]">Kenneth</option>
                      <option value="lazarus" className="bg-[#0a0a0f]">Lazarus</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Select the director you will be reporting to</p>
                </div>

                {/* Full Name Field */}
                <div>
                  <label htmlFor="consultantRegisterName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="consultantRegisterName"
                      type="text"
                      required
                      value={consultantRegisterName}
                      onChange={(e) => setConsultantRegisterName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="John Doe"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                </div>

                {/* Username Field */}
                <div>
                  <label htmlFor="consultantRegisterUsername" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                    <span className="ml-2 text-xs font-normal text-gray-500">(username for login)</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="consultantRegisterUsername"
                      type="text"
                      required
                      value={consultantRegisterUsername}
                      onChange={(e) => setConsultantRegisterUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="johndoe"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="consultantRegisterEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="consultantRegisterEmail"
                      type="email"
                      required
                      value={consultantRegisterEmail}
                      onChange={(e) => setConsultantRegisterEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="your.email@brillianceadvisory.com"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="consultantRegisterPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="consultantRegisterPhone"
                      type="tel"
                      required
                      value={consultantRegisterPhone}
                      onChange={(e) => setConsultantRegisterPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="+65 9123 4567"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                </div>

                {/* Birthday Field */}
                <div>
                  <label htmlFor="consultantRegisterBirthday" className="block text-sm font-medium text-gray-700 mb-2">
                    Birthday (Optional)
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="consultantRegisterBirthday"
                        type="date"
                        value={consultantRegisterBirthday}
                        onChange={(e) => setConsultantRegisterBirthday(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        disabled={isConsultantRegisterLoading}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    {consultantRegisterBirthday && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <button
                          type="button"
                          onClick={() => setConsultantRegisterShowBirthday(!consultantRegisterShowBirthday)}
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary transition-colors"
                        >
                          {consultantRegisterShowBirthday ? (
                            <>
                              <Eye className="w-4 h-4" />
                              <span>Show birthday in calendar</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4" />
                              <span>Hide birthday from calendar</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Your birthday can be shown in the team calendar (optional)</p>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="consultantRegisterPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="consultantRegisterPassword"
                      type="password"
                      required
                      value={consultantRegisterPassword}
                      onChange={(e) => setConsultantRegisterPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Minimum 6 characters"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="consultantRegisterConfirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="consultantRegisterConfirmPassword"
                      type="password"
                      required
                      value={consultantRegisterConfirmPassword}
                      onChange={(e) => setConsultantRegisterConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Re-enter your password"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isConsultantRegisterLoading}
                  className="group relative w-full px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isConsultantRegisterLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Consultant Account
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>

              {/* Back to Login Link - Consultant */}
              <div className="mt-6 pt-6 border-t border-cyan-500/20 text-center">
                <p className="text-sm text-gray-300">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsConsultantRegistering(false)
                      setConsultantRegisterError('')
                      setConsultantRegisterSuccess('')
                    }}
                    className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export default function ConsultantLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    }>
      <ConsultantLoginContent />
    </Suspense>
  )
}
