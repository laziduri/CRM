'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { 
  Briefcase, 
  ArrowRight, 
  LogIn, 
  Sparkles, 
  BarChart3, 
  Users, 
  Calendar,
  MessageSquare,
  FileText,
  CheckCircle2,
  Zap,
  Globe,
  Download,
  Shield,
  Rocket
} from 'lucide-react'

export default function CRMHomePage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(false) // Start as false to show content immediately

  useEffect(() => {
    // Always show content immediately - don't block rendering
    setIsChecking(false)

    // Then check auth in background (won't block content)
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('consultant_token')
        if (token) {
          // Redirect if logged in (but content already showing)
          router.push('/consultant/dashboard')
        }
      } catch (error) {
        // Ignore errors - just show the page
        console.error('Error accessing localStorage:', error)
      }
    }
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-cyan-400 border-r-cyan-400"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 bg-cyan-400/20 blur-md"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden" style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(cyan 1px, transparent 1px),
          linear-gradient(90deg, cyan 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}></div>

      {/* Header */}
      <header className="relative bg-[#0f0f1a]/80 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                <Briefcase className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Brilliance CRM</h1>
                <p className="text-xs text-gray-400">Consultant Portal</p>
              </div>
            </div>
            <Link href="/crm/login">
              <button className="relative px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 group overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Consultant Login
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full mb-8 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">AI-Powered CRM Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="block text-white mb-2">Your Complete</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-shimmer bg-[length:200%_auto]">
              Loan Advisory CRM
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Manage clients, track deals, automate workflows, and grow your business with our intelligent CRM platform designed specifically for loan consultants.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/crm/login">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-white hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            <button className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-cyan-500/30 rounded-xl font-semibold text-gray-300 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download App (Coming Soon)
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          Everything You Need to <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Succeed</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* AI Features */}
          <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/10 group-hover:to-cyan-500/10 rounded-2xl transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl w-fit mb-4 border border-purple-500/30">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Tools</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Automate tasks, generate insights, and boost productivity with AI assistance for projects, tasks, calendars, and documents.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  AI Project Manager
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  AI Task Prioritization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  AI Document Assistant
                </li>
              </ul>
            </div>
          </div>

          {/* Client Management */}
          <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-2xl transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl w-fit mb-4 border border-cyan-500/30">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Client Management</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Organize all your client information, track interactions, manage deals, and build lasting relationships.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  Client Pipeline
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  Deal Tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  Messaging System
                </li>
              </ul>
            </div>
          </div>

          {/* Analytics */}
          <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 rounded-2xl transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl w-fit mb-4 border border-green-500/30">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Performance Analytics</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Track your performance, commissions, success rates, and get actionable insights to grow your business.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Commission Tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Performance Dashboards
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Goal Setting
                </li>
              </ul>
            </div>
          </div>

          {/* Calendar & Scheduling */}
          <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/10 group-hover:to-amber-500/10 rounded-2xl transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl w-fit mb-4 border border-orange-500/30">
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Scheduling</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                AI-powered calendar management with automatic scheduling, conflict detection, and booking links.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  AI Calendar
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  Meeting Assistant
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  Auto Notetaker
                </li>
              </ul>
            </div>
          </div>

          {/* Workflows */}
          <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-teal-500/0 group-hover:from-cyan-500/10 group-hover:to-teal-500/10 rounded-2xl transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl w-fit mb-4 border border-cyan-500/30">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Automated Workflows</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Streamline repetitive tasks with customizable workflows and SOPs that automate your entire process.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  Workflow Templates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  AI Workflow Generation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  Task Automation
                </li>
              </ul>
            </div>
          </div>

          {/* Communication */}
          <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="p-3 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl w-fit mb-4 border border-pink-500/30">
                <MessageSquare className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Integrated Communication</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Stay connected with clients through built-in messaging, AI chat assistant, and consultation summaries.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  Client Messaging
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  AI Chat Assistant
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  Consultation Notes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative mt-20 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <Rocket className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Ready to Transform Your <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Business?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join Brilliance Advisory consultants and start managing your clients more effectively today.
          </p>
          <Link href="/crm/login">
            <button className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-bold text-white text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Get Started Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#0f0f1a] border-t border-cyan-500/20 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <span className="text-sm">Brilliance CRM © 2024</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-cyan-400 transition-colors">Terms</a>
              <a href="/contact" className="hover:text-cyan-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
