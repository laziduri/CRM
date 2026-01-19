'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  User,
  Building2,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  FileText,
  DollarSign,
  Tag,
  Edit,
  Save,
  Plus,
  X,
  Clock,
  MapPin,
  MessageCircle,
  PhoneCall,
  Video,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  TrendingUp,
  FileCheck,
  History,
  Upload,
  Download,
  CheckCircle,
  Circle,
  FileIcon
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Client {
  id: string
  name: string
  type: 'personal' | 'business'
  email: string
  phone: string
  status: 'active' | 'inactive' | 'prospect'
  assignedDate: Date
  totalDeals: number
  totalLoanAmount: number
  lastContact?: Date
  tags?: string[]
  businessUEN?: string
  businessRegistrationDate?: Date
  address?: string
  notes?: string
}

interface Appointment {
  id: string
  title: string
  date: Date
  time: string
  type: 'consultation' | 'follow-up' | 'closing' | 'other'
  location: 'office' | 'online' | 'client-site'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
}

interface Deal {
  id: string
  title: string
  type: 'personal' | 'business'
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  date: Date
}

interface ClientDocument {
  id: string
  name: string
  description?: string
  category: 'identity' | 'income' | 'business' | 'property' | 'other'
  status: 'pending' | 'received'
  required: boolean
  receivedDate?: Date
  fileUrl?: string
  fileName?: string
  notes?: string
}

export default function ClientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.clientId as string
  const [client, setClient] = useState<Client | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [documents, setDocuments] = useState<ClientDocument[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'schedule' | 'deals' | 'documents'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/crm')
      return
    }

    // Mock data - in production, fetch from API
    const mockClient: Client = {
      id: clientId,
      name: 'John Doe',
      type: 'personal',
      email: 'john.doe@example.com',
      phone: '+65 9123 4567',
      status: 'active',
      assignedDate: new Date('2023-06-15'),
      totalDeals: 2,
      totalLoanAmount: 125000,
      lastContact: new Date('2024-01-15'),
      tags: ['VIP', 'High Value'],
      address: '123 Orchard Road, Singapore 238888',
      notes: 'Client prefers morning meetings. Interested in property investment loans.'
    }

    const mockAppointments: Appointment[] = [
      {
        id: '1',
        title: 'Follow-up Consultation',
        date: new Date('2024-01-20'),
        time: '10:00 AM',
        type: 'follow-up',
        location: 'office',
        status: 'confirmed'
      },
      {
        id: '2',
        title: 'Loan Application Review',
        date: new Date('2024-01-25'),
        time: '2:00 PM',
        type: 'consultation',
        location: 'online',
        status: 'scheduled'
      }
    ]

    const mockDeals: Deal[] = [
      {
        id: '1',
        title: 'Personal Loan - Property Investment',
        type: 'personal',
        amount: 100000,
        status: 'approved',
        date: new Date('2023-12-10')
      },
      {
        id: '2',
        title: 'Personal Loan - Home Renovation',
        type: 'personal',
        amount: 25000,
        status: 'pending',
        date: new Date('2024-01-15')
      }
    ]

    // Initialize document checklist based on client type
    const getRequiredDocuments = (clientType: 'personal' | 'business'): ClientDocument[] => {
      if (clientType === 'personal') {
        return [
          {
            id: '1',
            name: 'NRIC/Passport',
            description: 'Singapore NRIC or Passport (front and back)',
            category: 'identity',
            status: 'received',
            required: true,
            receivedDate: new Date('2024-01-10'),
            fileName: 'nric_front_back.pdf'
          },
          {
            id: '2',
            name: 'CPF Statement',
            description: 'Latest CPF statement (last 12 months)',
            category: 'income',
            status: 'pending',
            required: true
          },
          {
            id: '3',
            name: 'Payslip',
            description: 'Latest 3 months payslips',
            category: 'income',
            status: 'pending',
            required: true
          },
          {
            id: '4',
            name: 'Bank Statements',
            description: 'Latest 6 months bank statements',
            category: 'income',
            status: 'received',
            required: true,
            receivedDate: new Date('2024-01-12'),
            fileName: 'bank_statements.pdf'
          },
          {
            id: '5',
            name: 'Employment Letter',
            description: 'Employment confirmation letter',
            category: 'income',
            status: 'pending',
            required: true
          },
          {
            id: '6',
            name: 'Income Tax Notice of Assessment',
            description: 'Latest 2 years NOA from IRAS',
            category: 'income',
            status: 'pending',
            required: true
          }
        ]
      } else {
        // Business client documents
        return [
          {
            id: '1',
            name: 'ACRA Business Profile',
            description: 'Latest ACRA business profile extract',
            category: 'business',
            status: 'pending',
            required: true
          },
          {
            id: '2',
            name: 'Business UEN Certificate',
            description: 'Unique Entity Number certificate',
            category: 'business',
            status: 'pending',
            required: true
          },
          {
            id: '3',
            name: 'Bank Statements',
            description: 'Latest 12 months business bank statements',
            category: 'business',
            status: 'pending',
            required: true
          },
          {
            id: '4',
            name: 'Financial Statements',
            description: 'Latest 2 years audited/unaudited financial statements',
            category: 'business',
            status: 'pending',
            required: true
          },
          {
            id: '5',
            name: 'Income Tax Returns',
            description: 'Latest 2 years corporate tax returns',
            category: 'business',
            status: 'pending',
            required: true
          },
          {
            id: '6',
            name: 'Director NRIC/Passport',
            description: 'NRIC/Passport of all directors',
            category: 'identity',
            status: 'pending',
            required: true
          },
          {
            id: '7',
            name: 'GST Returns',
            description: 'Latest GST returns (if applicable)',
            category: 'business',
            status: 'pending',
            required: false
          },
          {
            id: '8',
            name: 'Property Documents',
            description: 'Property valuation or lease agreement (if applicable)',
            category: 'property',
            status: 'pending',
            required: false
          }
        ]
      }
    }

    const mockDocuments = getRequiredDocuments(mockClient.type)

    setClient(mockClient)
    setAppointments(mockAppointments)
    setDeals(mockDeals)
    setDocuments(mockDocuments)
    setNotes(mockClient.notes || '')
    setIsLoading(false)
  }, [clientId, router])

  const handleWhatsApp = () => {
    const phoneNumber = client?.phone.replace(/[^0-9]/g, '')
    const message = encodeURIComponent(`Hello ${client?.name}, this is from Brilliance Advisory.`)
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  const handleCall = () => {
    window.location.href = `tel:${client?.phone}`
  }

  const handleSaveNotes = async () => {
    // In production, save to API
    setIsEditingNotes(false)
    // Update client notes
    if (client) {
      setClient({ ...client, notes })
    }
  }

  const handleDocumentStatusToggle = (documentId: string) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => {
        if (doc.id === documentId) {
          const newStatus = doc.status === 'pending' ? 'received' : 'pending'
          return {
            ...doc,
            status: newStatus,
            receivedDate: newStatus === 'received' ? new Date() : undefined
          }
        }
        return doc
      })
    )
  }

  const getDocumentStats = () => {
    const total = documents.length
    const received = documents.filter(d => d.status === 'received').length
    const pending = documents.filter(d => d.status === 'pending').length
    const required = documents.filter(d => d.required).length
    const requiredReceived = documents.filter(d => d.required && d.status === 'received').length
    return { total, received, pending, required, requiredReceived }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading client details...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Client not found</p>
          <Link href="/consultant/clients">
            <Button variant="primary">Back to Clients</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/consultant/clients" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${client.type === 'personal' ? 'bg-primary/10' : 'bg-teal/10'}`}>
                  {client.type === 'personal' ? (
                    <User className="w-6 h-6 text-primary" />
                  ) : (
                    <Building2 className="w-6 h-6 text-teal" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{client.name}</h1>
                  <p className="text-sm text-gray-600 capitalize">{client.type} Client</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'notes', label: 'Notes', icon: FileText },
              { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
              { id: 'deals', label: 'Deals', icon: Briefcase },
              { id: 'documents', label: 'Documents', icon: FileCheck },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleWhatsApp}
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleCall}
                  >
                    <PhoneCall className="w-5 h-5" />
                    Call Now
                  </Button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href={`mailto:${client.email}`} className="text-gray-900 font-medium hover:text-primary">
                        {client.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a href={`tel:${client.phone}`} className="text-gray-900 font-medium hover:text-primary">
                        {client.phone}
                      </a>
                    </div>
                  </div>
                  {client.address && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="text-gray-900 font-medium">{client.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Loan application approved</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CalendarIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Appointment scheduled</p>
                      <p className="text-xs text-gray-500">5 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MessageCircle className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Message sent</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Status</h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      client.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : client.status === 'prospect'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600">Assigned Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {client.assignedDate.toLocaleDateString()}
                    </p>
                  </div>
                  {client.lastContact && (
                    <div>
                      <p className="text-xs text-gray-600">Last Contact</p>
                      <p className="text-sm font-medium text-gray-900">
                        {client.lastContact.toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-600">Total Deals</p>
                      <p className="text-lg font-bold text-gray-900">{client.totalDeals}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-600">Total Loan Amount</p>
                      <p className="text-lg font-bold text-primary">
                        ${client.totalLoanAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {client.tags && client.tags.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {client.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Info (if applicable) */}
              {client.type === 'business' && client.businessUEN && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Business Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600">UEN</p>
                      <p className="text-sm font-medium text-gray-900">{client.businessUEN}</p>
                    </div>
                    {client.businessRegistrationDate && (
                      <div>
                        <p className="text-xs text-gray-600">Registration Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {client.businessRegistrationDate.toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Client Notes</h2>
              {!isEditingNotes ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingNotes(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Notes
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingNotes(false)
                      setNotes(client?.notes || '')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveNotes}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </div>
              )}
            </div>
            {isEditingNotes ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
                placeholder="Start typing your notes here... (Supports markdown-like formatting)"
              />
            ) : (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 min-h-[400px] p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {notes || 'No notes yet. Click "Edit Notes" to add notes about this client.'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
                <Button variant="primary" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Schedule Appointment
                </Button>
              </div>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{apt.title}</h3>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                apt.status === 'confirmed'
                                  ? 'bg-green-100 text-green-700'
                                  : apt.status === 'scheduled'
                                  ? 'bg-blue-100 text-blue-700'
                                  : apt.status === 'completed'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {apt.date.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {apt.time}
                            </div>
                            <div className="flex items-center gap-1">
                              {apt.location === 'online' ? (
                                <Video className="w-4 h-4" />
                              ) : apt.location === 'client-site' ? (
                                <MapPin className="w-4 h-4" />
                              ) : (
                                <CalendarIcon className="w-4 h-4" />
                              )}
                              <span className="capitalize">{apt.location.replace('-', ' ')}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming appointments</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deals Tab */}
        {activeTab === 'deals' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Deals & Applications</h2>
              <Button variant="primary" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Deal
              </Button>
            </div>
            {deals.length > 0 ? (
              <div className="space-y-4">
                {deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{deal.title}</h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              deal.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : deal.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : deal.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {deal.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${deal.amount.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {deal.date.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No deals yet</p>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            {(() => {
              const stats = getDocumentStats()
              return (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Documents</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600 mb-1">Received</p>
                    <p className="text-2xl font-bold text-green-600">{stats.received}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600 mb-1">Required Progress</p>
                    <p className="text-2xl font-bold text-primary">
                      {stats.requiredReceived}/{stats.required}
                    </p>
                  </div>
                </div>
              )
            })()}

            {/* Document Checklist */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Document Checklist</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Track required documents for {client?.name}
                  </p>
                </div>
                <Button variant="primary" size="sm" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </Button>
              </div>

              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No documents required yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Group documents by category */}
                  {['identity', 'income', 'business', 'property', 'other'].map((category) => {
                    const categoryDocs = documents.filter(d => d.category === category)
                    if (categoryDocs.length === 0) return null

                    const categoryLabels: Record<string, string> = {
                      identity: 'Identity Documents',
                      income: 'Income & Employment',
                      business: 'Business Documents',
                      property: 'Property Documents',
                      other: 'Other Documents'
                    }

                    return (
                      <div key={category} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                          {categoryLabels[category]}
                        </h3>
                        <div className="space-y-2">
                          {categoryDocs.map((doc) => (
                            <div
                              key={doc.id}
                              className={`flex items-start justify-between p-3 rounded-lg border transition-colors ${
                                doc.status === 'received'
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <button
                                  onClick={() => handleDocumentStatusToggle(doc.id)}
                                  className={`mt-0.5 transition-colors ${
                                    doc.status === 'received'
                                      ? 'text-green-600 hover:text-green-700'
                                      : 'text-gray-400 hover:text-gray-600'
                                  }`}
                                  title={doc.status === 'pending' ? 'Mark as received' : 'Mark as pending'}
                                >
                                  {doc.status === 'received' ? (
                                    <CheckCircle className="w-5 h-5" />
                                  ) : (
                                    <Circle className="w-5 h-5" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className={`font-medium ${
                                      doc.status === 'received' ? 'text-green-900' : 'text-gray-900'
                                    }`}>
                                      {doc.name}
                                    </h4>
                                    {doc.required && (
                                      <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded">
                                        Required
                                      </span>
                                    )}
                                  </div>
                                  {doc.description && (
                                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                                  )}
                                  {doc.status === 'received' && doc.receivedDate && (
                                    <p className="text-xs text-green-700 mt-1">
                                      Received: {doc.receivedDate.toLocaleDateString()}
                                    </p>
                                  )}
                                  {doc.fileName && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <FileIcon className="w-4 h-4 text-gray-400" />
                                      <span className="text-xs text-gray-600">{doc.fileName}</span>
                                      {doc.fileUrl && (
                                        <a
                                          href={doc.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-primary hover:underline flex items-center gap-1"
                                        >
                                          <Download className="w-3 h-3" />
                                          Download
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded ${
                                    doc.status === 'received'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-orange-100 text-orange-700'
                                  }`}
                                >
                                  {doc.status === 'received' ? 'Received' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Progress Summary */}
            {(() => {
              const stats = getDocumentStats()
              const completionPercentage = stats.required > 0 
                ? Math.round((stats.requiredReceived / stats.required) * 100) 
                : 0
              
              return (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklist Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Required Documents: {stats.requiredReceived} / {stats.required}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            completionPercentage === 100 ? 'bg-green-500' : 'bg-primary'
                          }`}
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>
                    {completionPercentage === 100 && (
                      <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">All required documents received!</span>
                      </div>
                    )}
                    {stats.pending > 0 && (
                      <p className="text-sm text-gray-600">
                        {stats.pending} document{stats.pending !== 1 ? 's' : ''} still pending
                      </p>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </main>
    </div>
  )
}
