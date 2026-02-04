'use client'

import React, { useState, useEffect } from 'react'
import {
  Lock,
  AlertCircle,
  ArrowRight,
  User,
  CheckCircle2,
  Briefcase,
} from 'lucide-react'

export function ConsultantLoginForm() {
  const [consultantId, setConsultantId] = useState('')
  const [consultantUsername, setConsultantUsername] = useState('')
  const [consultantEmail, setConsultantEmail] = useState('')
  const [consultantPassword, setConsultantPassword] = useState('')
  const [consultantError, setConsultantError] = useState('')
  const [consultantIsLoading, setConsultantIsLoading] = useState(false)
  const [isConsultantRegistering, setIsConsultantRegistering] = useState(false)
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

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('verified') === 'true') {
      setConsultantRegisterSuccess('Your email has been verified successfully! You can now log in.')
    }
  }, [])

  const handleConsultantLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setConsultantError('')

    const id = consultantId.trim()
    const user = consultantUsername.trim()
    const em = consultantEmail.trim()

    if (!id && !user && !em) {
      setConsultantError('Please enter Consultant ID, Username, or Email')
      return
    }

    if (!consultantPassword) {
      setConsultantError('Please enter your password')
      return
    }

    setConsultantIsLoading(true)
    setConsultantError('')

    try {
      const response = await fetch('/api/consultant/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultantId: id || undefined,
          username: user || undefined,
          email: em || undefined,
          password: consultantPassword,
        }),
      })

      let data: { error?: string; token?: string; consultantId?: string } = {}
      try {
        const text = await response.text()
        if (text) data = JSON.parse(text)
      } catch (_) {
        setConsultantError('Invalid response from server. Please try again.')
        setConsultantIsLoading(false)
        return
      }

      if (!response.ok) {
        setConsultantError(data.error || 'Login failed. Please check your credentials.')
        setConsultantIsLoading(false)
        return
      }

      if (!data.token || !data.consultantId) {
        setConsultantError('Invalid response from server. Please try again.')
        setConsultantIsLoading(false)
        return
      }

      try {
        localStorage.setItem('consultant_token', data.token)
        localStorage.setItem('consultant_id', data.consultantId)
      } catch (e) {
        setConsultantError('Could not save session. Try another browser or allow cookies/storage.')
        setConsultantIsLoading(false)
        return
      }
      setConsultantIsLoading(false)
      window.location.href = '/consultant/dashboard'
    } catch (err) {
      console.error('Login error:', err)
      const msg = err instanceof Error ? err.message : ''
      const isNetwork = /failed to fetch|network|load/i.test(msg) || (err && typeof (err as { code?: string }).code === 'string')
      setConsultantError(
        isNetwork
          ? "Can't reach the server. Make sure the app is running (e.g. npm run dev) and try again."
          : (msg || 'An error occurred. Please try again.')
      )
      setConsultantIsLoading(false)
    }
  }

  const handleConsultantRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setConsultantRegisterError('')
    setConsultantRegisterSuccess('')
    setIsConsultantRegisterLoading(true)

    if (consultantRegisterAccessCode !== 'BA123456') {
      setConsultantRegisterError('Invalid access code. Please contact your administrator.')
      setIsConsultantRegisterLoading(false)
      return
    }

    if (consultantRegisterPassword !== consultantRegisterConfirmPassword) {
      setConsultantRegisterError('Passwords do not match')
      setIsConsultantRegisterLoading(false)
      return
    }

    if (consultantRegisterPassword.length < 6) {
      setConsultantRegisterError('Password must be at least 6 characters')
      setIsConsultantRegisterLoading(false)
      return
    }

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

      setConsultantRegisterSuccess('Account created successfully! You can now log in.')
      setIsConsultantRegistering(false)
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
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-3xl"></div>
      </div>
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      ></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
              <Briefcase className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3 text-white">
            {isConsultantRegistering ? (
              <span>Create <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Consultant Account</span></span>
            ) : (
              <span><span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">CRM Login</span></span>
            )}
          </h1>
          <p className="text-gray-300">
            {isConsultantRegistering ? 'Create your consultant account to access the CRM' : 'Sign in to access your CRM dashboard'}
          </p>
        </div>

        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-500/20 p-8 hover:border-cyan-500/40 transition-all duration-300">
          <div className="relative z-10">
            {!isConsultantRegistering && (
              <>
                {consultantError && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 backdrop-blur-sm">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{consultantError}</p>
                  </div>
                )}

                <form onSubmit={handleConsultantLoginSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="consultantLoginId" className="block text-sm font-medium text-gray-300 mb-2">
                      Username, Email, or Consultant ID
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="consultantLoginId"
                        type="text"
                        autoComplete="username"
                        value={consultantId || consultantUsername || consultantEmail}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value.includes('@')) {
                            setConsultantEmail(value)
                            setConsultantUsername('')
                            setConsultantId('')
                          } else if (/^CON\d+$/i.test(value)) {
                            setConsultantId(value)
                            setConsultantUsername('')
                            setConsultantEmail('')
                          } else {
                            setConsultantUsername(value)
                            setConsultantId('')
                            setConsultantEmail('')
                          }
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-white placeholder-gray-500"
                        placeholder="e.g. consultant1, clean, or your email"
                        disabled={consultantIsLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="consultantPassword" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="consultantPassword"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={consultantPassword}
                        onChange={(e) => setConsultantPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-white placeholder-gray-500"
                        placeholder="Enter your password"
                        disabled={consultantIsLoading}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">
                    Demo: <span className="text-cyan-400/80">clean</span> / <span className="text-cyan-400/80">clean123</span> or <span className="text-cyan-400/80">consultant1</span> / <span className="text-cyan-400/80">demo123</span>
                  </p>

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
                          Sign In
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

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

            {isConsultantRegistering && (
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

                <form onSubmit={handleConsultantRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Access Code *</label>
                    <input
                      type="text"
                      required
                      value={consultantRegisterAccessCode}
                      onChange={(e) => setConsultantRegisterAccessCode(e.target.value)}
                      className="w-full pl-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white"
                      placeholder="Enter access code"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Director *</label>
                    <select
                      required
                      value={consultantRegisterDirector}
                      onChange={(e) => setConsultantRegisterDirector(e.target.value)}
                      className="w-full pl-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white"
                      disabled={isConsultantRegisterLoading}
                    >
                      <option value="" className="bg-[#0a0a0f]">Select a director...</option>
                      <option value="ashley" className="bg-[#0a0a0f]">Ashley</option>
                      <option value="kenneth" className="bg-[#0a0a0f]">Kenneth</option>
                      <option value="lazarus" className="bg-[#0a0a0f]">Lazarus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={consultantRegisterName}
                      onChange={(e) => setConsultantRegisterName(e.target.value)}
                      className="w-full pl-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white"
                      placeholder="John Doe"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      required
                      value={consultantRegisterUsername}
                      onChange={(e) => setConsultantRegisterUsername(e.target.value)}
                      className="w-full pl-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white"
                      placeholder="johndoe"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={consultantRegisterEmail}
                      onChange={(e) => setConsultantRegisterEmail(e.target.value)}
                      className="w-full pl-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white"
                      placeholder="your.email@example.com"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={consultantRegisterPhone}
                      onChange={(e) => setConsultantRegisterPhone(e.target.value)}
                      className="w-full pl-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white"
                      placeholder="+65 9123 4567"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <input
                      type="password"
                      required
                      value={consultantRegisterPassword}
                      onChange={(e) => setConsultantRegisterPassword(e.target.value)}
                      className="w-full pl-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white"
                      placeholder="Minimum 6 characters"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={consultantRegisterConfirmPassword}
                      onChange={(e) => setConsultantRegisterConfirmPassword(e.target.value)}
                      className="w-full pl-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white"
                      placeholder="Re-enter your password"
                      disabled={isConsultantRegisterLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isConsultantRegisterLoading}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                  >
                    {isConsultantRegisterLoading ? 'Creating...' : 'Create Account'}
                  </button>
                </form>

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
