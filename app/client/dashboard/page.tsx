'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Calculator, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  User, 
  LogOut,
  Clock,
  TrendingUp,
  AlertCircle,
  FileCheck
} from 'lucide-react'
import Button from '@/components/ui/Button'

interface ClientData {
  id: string
  name: string
  email: string
  phone: string
  consultant?: {
    id: string
    name: string
    email: string
  }
}

export default function ClientDashboardPage() {
  const router = useRouter()
  const [client, setClient] = useState<ClientData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('client_token')
    const clientId = localStorage.getItem('client_id')

    if (!token || !clientId) {
      router.push('/client/login')
      return
    }

    // Fetch client data
    fetchClientData(clientId)
  }, [router])

  const fetchClientData = async (clientId: string) => {
    try {
      const response = await fetch(`/api/client/${clientId}`)
      if (response.ok) {
        const data = await response.json()
        setClient(data.client)
      }
    } catch (error) {
      console.error('Error fetching client data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('client_token')
    localStorage.removeItem('client_id')
    router.push('/client/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 flex-shrink-0">
                <img
                  src="/images/brilliance-logo.svg"
                  alt="Brilliance Advisory Logo"
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    if (e.currentTarget.src.includes('.svg')) {
                      e.currentTarget.src = '/images/brilliance-logo.png'
                    }
                  }}
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">
                Brilliance Advisory
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4" />
                <span>{client?.name || 'Client'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {client?.name?.split(' ')[0] || 'Client'}!
          </h1>
          <p className="text-gray-600">
            Manage your advisory journey and access your personalized resources
          </p>
        </div>

        {/* Consultant Assignment Card */}
        {client?.consultant && (
          <div className="mb-8 bg-gradient-to-r from-primary to-teal text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Your Consultant</h2>
                <p className="text-white/90 mb-3">{client.consultant.name}</p>
                <p className="text-sm text-white/80">{client.consultant.email}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-primary hover:bg-gray-100"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Apply Loan Card */}
          <Link href="/apply" className="block">
            <div className="bg-gradient-to-br from-primary to-teal text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FileCheck className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Apply for a Loan
                </h3>
                <p className="text-sm text-white/90 mb-4">
                  Start your loan application and get matched with the best options for you
                </p>
                <div className="flex items-center text-sm text-white font-medium">
                  Apply now
                  <TrendingUp className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </Link>

          {/* Saved Calculations Card */}
          <Link href="/client/dashboard/calculations" className="block">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs text-gray-500">3 saved</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Saved Calculations
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Review your loan calculations and payment schedules
              </p>
              <div className="flex items-center text-sm text-primary font-medium">
                View all
                <TrendingUp className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Loan Readiness Checklist Card */}
          <Link href="/client/dashboard/checklist" className="block">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-teal/10 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-teal" />
                </div>
                <span className="text-xs text-gray-500">65% complete</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loan Readiness Checklist
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Track your progress and ensure you're ready to apply
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div className="bg-teal h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex items-center text-sm text-primary font-medium">
                Continue checklist
                <TrendingUp className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Consultation Summaries Card */}
          <Link href="/client/dashboard/consultations" className="block">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500">5 summaries</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Consultation Summaries
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Review notes and recommendations from prior consultations
              </p>
              <div className="flex items-center text-sm text-primary font-medium">
                View summaries
                <TrendingUp className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="p-2 bg-teal/10 rounded-lg">
                <Clock className="w-5 h-5 text-teal" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Last consultation summary added
                </p>
                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New calculation saved
                </p>
                <p className="text-xs text-gray-500 mt-1">1 week ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Checklist item completed
                </p>
                <p className="text-xs text-gray-500 mt-1">2 weeks ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Notice */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Transparency & Professionalism</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                All information is handled with care, and any applicable advisory fees are clearly explained and agreed upon before engagement. This portal supports a smoother advisory experience by keeping relevant information organized in one place.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
