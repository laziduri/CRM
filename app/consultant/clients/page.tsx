'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  User,
  Building2,
  Mail,
  Phone,
  PhoneCall,
  MoreVertical,
  Eye,
  Edit,
  MessageSquare,
  List,
  Grid,
  Users,
  MapPin,
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Client {
  id: string
  name: string
  companyName?: string
  type: 'personal' | 'business'
  email?: string
  phone?: string
  status: 'door knocked' | 'to call' | 'to book appointment' | 'book appointment' | 'closed'
  notes: string
  location?: string
  interestLevel?: 'hot' | 'warm' | 'cold'
  assignedDate: Date
  totalDeals: number
  totalLoanAmount: number
  lastContact?: Date
  tags?: string[]
  businessUEN?: string
  businessRegistrationDate?: Date
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'personal' | 'business'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'door knocked' | 'to call' | 'to book appointment' | 'book appointment' | 'closed'>('all')
  const [sortBy, setSortBy] = useState<'most-recent' | 'oldest-first' | 'name-asc' | 'name-desc' | 'last-contact' | 'total-deals'>('most-recent')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid') // Lead tracker view mode
  const [extractedClients, setExtractedClients] = useState<any[]>([])
  const [selectedClients, setSelectedClients] = useState<Set<number>>(new Set())
  const [importFile, setImportFile] = useState<File | null>(null)
  
  // Stats and modal state
  const [showStats, setShowStats] = useState(false) // hidden on mobile by default
  const [showClientModal, setShowClientModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [filteredClientsForModal, setFilteredClientsForModal] = useState<Client[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
    location: '',
    interestLevel: 'warm' as 'hot' | 'warm' | 'cold',
    status: 'door knocked' as 'door knocked' | 'to call' | 'to book appointment' | 'book appointment' | 'closed',
    companies: [] as Array<{
      name: string
      businessUEN?: string
      businessRegistrationDate?: string
      businessAddress?: string
    }>,
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [showActionModal, setShowActionModal] = useState(false)
  const [newClientInfo, setNewClientInfo] = useState<{ name: string; phone: string } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    const consultantId = localStorage.getItem('consultant_id')
    if (!token || !consultantId) {
      router.push('/crm')
      return
    }

    // Load clients from API
    const loadClients = async () => {
      try {
        const response = await fetch('/api/consultant/clients', {
          headers: {
            'x-consultant-id': consultantId,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setClients(data.clients || [])
        } else {
          // Fallback to mock data if API fails
          const mockClients: Client[] = [
      {
        id: '1',
        name: 'John Doe',
        type: 'personal',
        email: 'john.doe@example.com',
        phone: '+65 9123 4567',
        status: 'to book appointment',
        notes: 'Interested in personal loan for home renovation. Follow up next week.',
        assignedDate: new Date('2023-06-15'),
        totalDeals: 2,
        totalLoanAmount: 125000,
        lastContact: new Date('2024-01-15'),
        tags: ['VIP', 'High Value'],
      },
      {
        id: '2',
        name: 'ABC Trading Pte Ltd',
        companyName: 'ABC Trading Pte Ltd',
        type: 'business',
        email: 'contact@abctrading.sg',
        phone: '+65 6789 0123',
        status: 'book appointment',
        notes: 'Business loan application in progress. Meeting scheduled for next Monday.',
        assignedDate: new Date('2023-08-20'),
        totalDeals: 3,
        totalLoanAmount: 450000,
        lastContact: new Date('2024-01-16'),
        businessUEN: '201234567A',
        businessRegistrationDate: new Date('2020-01-15'),
        tags: ['Enterprise', 'Recurring'],
      },
      {
        id: '3',
        name: 'Jane Smith',
        type: 'personal',
        email: 'jane.smith@example.com',
        phone: '+65 9234 5678',
        status: 'to call',
        notes: 'Initial contact made. Need to call back for loan requirements.',
        assignedDate: new Date('2023-10-10'),
        totalDeals: 1,
        totalLoanAmount: 30000,
        lastContact: new Date('2024-01-12'),
      },
      {
        id: '4',
        name: 'XYZ Services Ltd',
        companyName: 'XYZ Services Ltd',
        type: 'business',
        email: 'info@xyzservices.sg',
        phone: '+65 6345 6789',
        status: 'closed',
        notes: 'Deal closed successfully. Client signed loan agreement last month.',
        assignedDate: new Date('2023-09-05'),
        totalDeals: 2,
        totalLoanAmount: 250000,
        lastContact: new Date('2024-01-14'),
        businessUEN: '202345678B',
        businessRegistrationDate: new Date('2019-03-20'),
        tags: ['SME'],
      },
      {
        id: '5',
        name: 'Robert Chen',
        type: 'personal',
        email: 'robert.chen@example.com',
        phone: '+65 9456 7890',
        status: 'door knocked',
        notes: 'Door knocked yesterday. Left business card. Awaiting response.',
        assignedDate: new Date('2022-11-15'),
        totalDeals: 1,
        totalLoanAmount: 75000,
        lastContact: new Date('2023-12-20'),
      },
      {
        id: '6',
        name: 'DEF Manufacturing Pte Ltd',
        companyName: 'DEF Manufacturing Pte Ltd',
        type: 'business',
        email: 'contact@defmfg.sg',
        phone: '+65 6456 7890',
        status: 'to call',
        notes: 'Prospect from referral. Need to call and introduce our services.',
        assignedDate: new Date('2024-01-01'),
        totalDeals: 0,
        totalLoanAmount: 0,
        businessUEN: '203456789C',
        businessRegistrationDate: new Date('2018-07-10'),
      },
          ]
          setClients(mockClients)
        }
      } catch (error) {
        console.error('Error loading clients:', error)
        // Fallback to empty array or mock data
        setClients([])
      }
    }

    loadClients()
  }, [router])

  const fetchClients = async () => {
    try {
      const consultantId = localStorage.getItem('consultant_id') || '1'
      const response = await fetch('/api/consultant/clients', {
        headers: {
          'x-consultant-id': consultantId,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setClients(data.clients || [])
      } else {
        // Fallback to mock data if API fails
        const mockClients: Client[] = [
          {
            id: '1',
            name: 'John Doe',
            type: 'personal',
            email: 'john.doe@example.com',
            phone: '+65 9123 4567',
            status: 'to book appointment',
            notes: 'Interested in personal loan for home renovation. Follow up next week.',
            assignedDate: new Date('2024-01-15'),
            totalDeals: 2,
            totalLoanAmount: 125000,
            tags: ['VIP', 'High Value'],
          },
        ]
        setClients(mockClients)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      setClients([])
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    // First confirmation
    const firstConfirm = confirm('Are you sure you want to delete this client? This action cannot be undone.')
    if (!firstConfirm) {
      return
    }

    // Second confirmation
    const secondConfirm = confirm('This is your final warning. Once deleted, this client and all associated data cannot be recovered. Are you absolutely sure you want to delete this client?')
    if (!secondConfirm) {
      return
    }

    try {
      const consultantId = localStorage.getItem('consultant_id') || '1'
      
      const response = await fetch(`/api/consultant/clients?clientId=${clientId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': consultantId,
        },
      })

      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        const errorMessage = responseData?.error || `HTTP ${response.status}: Failed to delete client`
        console.error('Delete failed:', errorMessage, responseData)
        throw new Error(errorMessage)
      }

      console.log('Client deleted successfully:', responseData)

      // Refresh clients list
      await fetchClients()
    } catch (error: any) {
      console.error('Error deleting client:', error)
      alert(`Failed to delete client: ${error.message}`)
    }
  }

  const sortedClients = useMemo(() => {
    const filtered = clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (client.companyName && client.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (client.phone && client.phone.includes(searchQuery)) ||
                           (client.notes && client.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesType = filterType === 'all' || client.type === filterType
      const matchesStatus = filterStatus === 'all' || client.status === filterStatus
      return matchesSearch && matchesType && matchesStatus
    })
    
    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'most-recent':
          // Sort by assignedDate descending (newest first)
          return new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()
        case 'oldest-first':
          // Sort by assignedDate ascending (oldest first)
          return new Date(a.assignedDate).getTime() - new Date(b.assignedDate).getTime()
        case 'name-asc':
          // Sort by name A-Z
          return a.name.localeCompare(b.name)
        case 'name-desc':
          // Sort by name Z-A
          return b.name.localeCompare(a.name)
        case 'last-contact':
          // Sort by lastContact descending (most recent contact first)
          const aDate = a.lastContact ? new Date(a.lastContact).getTime() : 0
          const bDate = b.lastContact ? new Date(b.lastContact).getTime() : 0
          return bDate - aDate
        case 'total-deals':
          // Sort by totalDeals descending (highest first)
          return b.totalDeals - a.totalDeals
        default:
          return 0
      }
    })
  }, [clients, searchQuery, filterType, filterStatus, sortBy])


  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const consultantId = localStorage.getItem('consultant_id')
      if (!consultantId) {
        alert('Please log in to add clients')
        setIsSubmitting(false)
        return
      }

      // Auto-capture location if available
      let capturedLocation = formData.location
      if (!capturedLocation && typeof navigator !== 'undefined' && navigator.geolocation) {
        // Try to get location from browser (in production, you'd use a geocoding service)
        // For now, we'll just use the manual input
      }

      // Use first company if available, otherwise undefined
      const firstCompany = formData.companies.length > 0 ? formData.companies[0] : null

      // Call API to create client
      const response = await fetch('/api/consultant/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': consultantId,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone || undefined,
          companyName: firstCompany?.name || undefined,
          businessUEN: firstCompany?.businessUEN || undefined,
          businessRegistrationDate: firstCompany?.businessRegistrationDate || undefined,
          businessAddress: firstCompany?.businessAddress || undefined,
          location: capturedLocation || undefined,
          interestLevel: formData.interestLevel,
          status: formData.status,
          notes: formData.notes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || 'Failed to create client')
      }

      const data = await response.json()
      const newClient = data.client

      // Add to clients list
      setClients(prev => [...prev, newClient])
      
      // Store client info for action modal
      setNewClientInfo({
        name: formData.name,
        phone: formData.phone,
      })

      // Show action modal instead of closing
      setShowActionModal(true)
      setIsSubmitting(false)
    } catch (error) {
      console.error('Error adding client:', error)
      alert(error instanceof Error ? error.message : 'Failed to add client. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleActionModalClose = () => {
    setShowActionModal(false)
    setNewClientInfo(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      notes: '',
      location: '',
      interestLevel: 'warm',
      status: 'door knocked',
      companies: [],
    })
    setCurrentStep(1)
    setShowAddModal(false)
  }

  const handleCloseModal = () => {
    if (!isSubmitting) {
      resetForm()
    }
  }

  // Step validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name.trim() && formData.phone.trim())
      case 2:
        // Optional step - always valid
        return true
      case 3:
        return !!(formData.interestLevel && formData.status)
      case 4:
        return !!formData.notes.trim()
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleWhatsApp = () => {
    if (newClientInfo?.phone) {
      const phoneNumber = newClientInfo.phone.replace(/[^0-9]/g, '')
      const message = encodeURIComponent(`Hello ${newClientInfo.name}, this is from Brilliance Advisory.`)
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
    }
    handleActionModalClose()
  }

  const handleCall = () => {
    if (newClientInfo?.phone) {
      window.location.href = `tel:${newClientInfo.phone}`
    }
    handleActionModalClose()
  }

  const addCompany = () => {
    setFormData(prev => ({
      ...prev,
      companies: [
        ...prev.companies,
        {
          name: '',
          businessUEN: '',
          businessRegistrationDate: '',
          businessAddress: '',
        },
      ],
    }))
  }

  const removeCompany = (index: number) => {
    setFormData(prev => ({
      ...prev,
      companies: prev.companies.filter((_, i) => i !== index),
    }))
  }

  const updateCompany = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      companies: prev.companies.map((company, i) =>
        i === index ? { ...company, [field]: value } : company
      ),
    }))
  }

  const handleStatClick = (filterType: 'to book appointment' | 'book appointment', title: string) => {
    const filtered = clients.filter(c => c.status === filterType)
    setFilteredClientsForModal(filtered)
    setModalTitle(title)
    setShowClientModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/consultant/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                <p className="text-sm text-gray-600">Manage your client relationships</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowImportModal(true)
                }}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Import from Sheets
              </Button>
              <Button 
                type="button"
                variant="primary" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowAddModal(true)
                }}
              >
                <Plus className="w-4 h-4" />
                Add Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients by name, company, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="door knocked">Door Knocked</option>
              <option value="to call">To Call</option>
              <option value="to book appointment">To Book Appointment</option>
              <option value="book appointment">Book Appointment</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="most-recent">Most Recent Added</option>
              <option value="oldest-first">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="last-contact">Last Contact Date</option>
              <option value="total-deals">Total Deals (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Mobile Stats Toggle Button */}
        <button
          onClick={() => setShowStats(!showStats)}
          className="md:hidden w-full mb-2 flex items-center justify-between p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
        >
          <span>Quick Stats</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showStats ? 'rotate-180' : ''}`} />
        </button>

        {/* Stats */}
        <div className={`${showStats ? 'grid' : 'hidden md:grid'} grid-cols-1 md:grid-cols-4 gap-4 mb-6`}>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">To Call</p>
            <p className="text-2xl font-bold text-orange-600">
              {clients.filter(c => c.status === 'to call').length}
            </p>
          </div>
          <div 
            onClick={() => handleStatClick('to book appointment', 'Clients To Book Appointment')}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm text-gray-600 mb-1">To Book Appointment</p>
            <p className="text-2xl font-bold text-purple-600">
              {clients.filter(c => c.status === 'to book appointment').length}
            </p>
          </div>
          <div 
            onClick={() => handleStatClick('book appointment', 'Scheduled Appointments')}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm text-gray-600 mb-1">Appointments Scheduled</p>
            <p className="text-2xl font-bold text-green-600">
              {clients.filter(c => c.status === 'book appointment').length}
            </p>
          </div>
        </div>

        {/* View Toggle - Lead Tracker */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">Lead Tracker</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-primary/10 border-primary' : ''}
            >
              <Grid className="w-4 h-4 mr-2" />
              Button View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'bg-primary/10 border-primary' : ''}
            >
              <List className="w-4 h-4 mr-2" />
              Sheet View
            </Button>
          </div>
        </div>

        {/* Sheet/Table View - Lead Tracker */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      PERSON NAME / COMPANY NAME
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      NAME
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      PHONE
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      ROLE
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      STATUS
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      REMARKS
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedClients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td 
                        className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 font-medium cursor-pointer"
                        onClick={() => router.push(`/consultant/clients/${client.id}`)}
                      >
                        <div>
                          <div className="font-semibold">{client.name}</div>
                          {client.companyName && (
                            <div className="text-xs text-gray-600 mt-1">{client.companyName}</div>
                          )}
                        </div>
                      </td>
                      <td 
                        className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 cursor-pointer"
                        onClick={() => router.push(`/consultant/clients/${client.id}`)}
                      >
                        {client.name}
                      </td>
                      <td 
                        className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 whitespace-nowrap cursor-pointer"
                        onClick={() => router.push(`/consultant/clients/${client.id}`)}
                      >
                        {client.phone || '-'}
                      </td>
                      <td 
                        className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 cursor-pointer"
                        onClick={() => router.push(`/consultant/clients/${client.id}`)}
                      >
                        {client.type === 'business' ? 'Business Owner' : 'Personal Client'}
                      </td>
                      <td 
                        className="px-4 py-3 text-sm border-r border-gray-200 cursor-pointer"
                        onClick={() => router.push(`/consultant/clients/${client.id}`)}
                      >
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            client.status === 'closed'
                              ? 'bg-green-100 text-green-700'
                              : client.status === 'book appointment'
                              ? 'bg-blue-100 text-blue-700'
                              : client.status === 'to book appointment'
                              ? 'bg-purple-100 text-purple-700'
                              : client.status === 'to call'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {client.status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td 
                        className="px-4 py-3 text-sm text-gray-600 max-w-xs cursor-pointer"
                        onClick={() => router.push(`/consultant/clients/${client.id}`)}
                      >
                        {client.notes || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/consultant/clients/${client.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClient(client.id)
                            }}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Client"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sortedClients.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No clients found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Button/Grid View - Lead Tracker */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedClients.map((client) => (
            <div
              key={client.id}
              onClick={() => router.push(`/consultant/clients/${client.id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${client.type === 'personal' ? 'bg-primary/10' : 'bg-teal/10'}`}>
                    {client.type === 'personal' ? (
                      <User className="w-6 h-6 text-primary" />
                    ) : (
                      <Building2 className="w-6 h-6 text-teal" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{client.type} Client</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    client.status === 'closed'
                      ? 'bg-green-100 text-green-700'
                      : client.status === 'book appointment'
                      ? 'bg-blue-100 text-blue-700'
                      : client.status === 'to book appointment'
                      ? 'bg-purple-100 text-purple-700'
                      : client.status === 'to call'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {client.status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {client.companyName && (
                  <div className="text-sm font-medium text-gray-900">
                    {client.companyName}
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary transition-colors text-left"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{client.phone}</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          window.location.href = `tel:${client.phone}`
                        }}
                        className="cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4 mr-2" />
                        Quick Call
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          const phoneNumber = client.phone?.replace(/[^0-9]/g, '')
                          const message = encodeURIComponent(`Hello ${client.name}, this is from Brilliance Advisory.`)
                          window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
                        }}
                        className="cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        WhatsApp
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {client.notes && (
                  <div className="text-xs text-gray-600 line-clamp-2 mt-2">
                    {client.notes}
                  </div>
                )}
              </div>

              {client.tags && client.tags.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {client.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold">{client.totalDeals}</span> deals
                  </p>
                  <p className="text-gray-600">
                    ${client.totalLoanAmount.toLocaleString()} total
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/consultant/clients/${client.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/consultant/messages?client=${client.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    title="Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClient(client.id)
                    }}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Client"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {sortedClients.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No clients found</p>
            <Button 
              type="button"
              variant="primary" 
              size="sm" 
              className="flex items-center gap-2 mx-auto"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowAddModal(true)
              }}
            >
              <Plus className="w-4 h-4" />
              Add Your First Client
            </Button>
          </div>
        )}
      </main>

      {/* Add Client Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title="Add New Client"
        size="lg"
      >
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of 4
            </span>
            <span className="text-xs text-gray-500">
              {Math.round((currentStep / 4) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleAddClient} className="space-y-6">
          {/* Step 1: Name and Phone Number */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+65 9123 4567"
                />
              </div>
            </div>
          )}

          {/* Step 2: Companies (Optional) */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Companies (Optional)
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCompany}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Company
                </Button>
              </div>
              {formData.companies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No companies added. Click &quot;Add Company&quot; to add one.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.companies.map((company, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">Company {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeCompany(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={company.name}
                          onChange={(e) => updateCompany(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          UEN (Unique Entity Number)
                        </label>
                        <input
                          type="text"
                          value={company.businessUEN || ''}
                          onChange={(e) => updateCompany(index, 'businessUEN', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="201234567A"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Registration Date
                        </label>
                        <input
                          type="date"
                          value={company.businessRegistrationDate || ''}
                          onChange={(e) => updateCompany(index, 'businessRegistrationDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Address
                        </label>
                        <textarea
                          value={company.businessAddress || ''}
                          onChange={(e) => updateCompany(index, 'businessAddress', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                          placeholder="Enter business address"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Interest Level and Status */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Level
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="interestLevel"
                      value="hot"
                      checked={formData.interestLevel === 'hot'}
                      onChange={(e) => setFormData(prev => ({ ...prev, interestLevel: e.target.value as 'hot' | 'warm' | 'cold' }))}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className={`px-3 py-2 rounded-lg border-2 transition-all ${
                      formData.interestLevel === 'hot' 
                        ? 'border-red-500 bg-red-50 text-red-700 font-medium' 
                        : 'border-gray-300 text-gray-700 hover:border-red-300'
                    }`}>
                      Hot
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="interestLevel"
                      value="warm"
                      checked={formData.interestLevel === 'warm'}
                      onChange={(e) => setFormData(prev => ({ ...prev, interestLevel: e.target.value as 'hot' | 'warm' | 'cold' }))}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className={`px-3 py-2 rounded-lg border-2 transition-all ${
                      formData.interestLevel === 'warm' 
                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium' 
                        : 'border-gray-300 text-gray-700 hover:border-orange-300'
                    }`}>
                      Warm
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="interestLevel"
                      value="cold"
                      checked={formData.interestLevel === 'cold'}
                      onChange={(e) => setFormData(prev => ({ ...prev, interestLevel: e.target.value as 'hot' | 'warm' | 'cold' }))}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`px-3 py-2 rounded-lg border-2 transition-all ${
                      formData.interestLevel === 'cold' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' 
                        : 'border-gray-300 text-gray-700 hover:border-blue-300'
                    }`}>
                      Cold
                    </span>
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="door knocked">Door Knocked</option>
                  <option value="to call">To Call</option>
                  <option value="to book appointment">To Book Appointment</option>
                  <option value="book appointment">Book Appointment</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Notes */}
          {currentStep === 4 && (
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes *
                <span className="ml-2 text-xs font-normal text-gray-500">(Important for sales tracking)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                required
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Write notes about the client... (e.g., Initial contact, requirements, follow-up actions)"
              />
              <p className="mt-1 text-xs text-gray-500">These notes help track client interactions and sales progress</p>
            </div>
          )}

          {/* Step Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
              {currentStep === 2 && formData.companies.length === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={nextStep}
                  className="ml-2"
                >
                  Skip
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              {currentStep < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !validateStep(currentStep)}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    'Adding...'
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Client
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Modal>

      {/* Action Modal - Post Submission */}
      <Modal
        isOpen={showActionModal}
        onClose={handleActionModalClose}
        title="Client Added Successfully!"
        size="md"
      >
        <div className="space-y-6">
          <p className="text-gray-600 text-center">
            What would you like to do next?
          </p>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="primary"
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Client
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCall}
              className="w-full flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              Call Client
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleActionModalClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Client List Modal */}
      <Modal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        title={modalTitle}
        size="lg"
      >
        <div className="space-y-4">
          {filteredClientsForModal.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No clients found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {filteredClientsForModal.map((client) => (
                <div
                  key={client.id}
                  onClick={() => {
                    setShowClientModal(false)
                    router.push(`/consultant/clients/${client.id}`)
                  }}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      {client.companyName && (
                        <p className="text-sm text-gray-600 mt-1">{client.companyName}</p>
                      )}
                      {client.phone && (
                        <p className="text-sm text-gray-600 mt-1">{client.phone}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.interestLevel === 'hot' ? 'bg-red-100 text-red-700' :
                      client.interestLevel === 'warm' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {client.interestLevel || 'N/A'}
                    </span>
                  </div>
                  {client.notes && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{client.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Import from Google Sheets Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => {
          if (!isImporting) {
            setShowImportModal(false)
            setExtractedClients([])
            setSelectedClients(new Set())
            setImportFile(null)
          }
        }}
        title="Import Clients from Google Sheets"
        size="xl"
      >
        <div className="space-y-6">
          {extractedClients.length === 0 ? (
            // File Upload Step
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <label htmlFor="sheet-file" className="cursor-pointer">
                  <input
                    type="file"
                    id="sheet-file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setImportFile(file)
                        setIsImporting(true)
                        try {
                          // Create FormData to send file
                          const formData = new FormData()
                          formData.append('file', file)
                          
                          // Call API to extract clients
                          const response = await fetch('/api/consultant/clients/import', {
                            method: 'POST',
                            body: formData,
                          })
                          
                          if (!response.ok) {
                            throw new Error('Failed to extract clients from file')
                          }
                          
                          const data = await response.json()
                          setExtractedClients(data.clients || [])
                        } catch (error) {
                          console.error('Error importing file:', error)
                          alert('Failed to import file. Please make sure it is a valid Excel or CSV file.')
                        } finally {
                          setIsImporting(false)
                        }
                      }
                    }}
                  />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports Excel (.xlsx, .xls) and CSV files
                  </p>
                </label>
              </div>
              {importFile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{importFile.name}</span>
                </div>
              )}
              {isImporting && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Extracting client information...</p>
                </div>
              )}
            </div>
          ) : (
            // Review and Select Clients Step
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Review Extracted Clients
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Select which clients you want to add. Review the extracted information to ensure it&apos;s correct.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedClients.size === extractedClients.length) {
                        setSelectedClients(new Set())
                      } else {
                        setSelectedClients(new Set(extractedClients.map((_, i) => i)))
                      }
                    }}
                  >
                    {selectedClients.size === extractedClients.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                <div className="divide-y divide-gray-200">
                  {extractedClients.map((client, index) => {
                    const isSelected = selectedClients.has(index)
                    const hasErrors = !client.name || (!client.email && !client.phone)
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          isSelected ? 'bg-primary/5 border-l-4 border-primary' : ''
                        } ${hasErrors ? 'bg-red-50/50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const newSelected = new Set(selectedClients)
                              if (e.target.checked) {
                                newSelected.add(index)
                              } else {
                                newSelected.delete(index)
                              }
                              setSelectedClients(newSelected)
                            }}
                            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-gray-900">
                                    {client.name || 'Unnamed Client'}
                                  </h4>
                                  {client.type === 'business' && (
                                    <span className="px-2 py-0.5 text-xs font-medium bg-teal/10 text-teal rounded">
                                      Business
                                    </span>
                                  )}
                                  {client.type === 'personal' && (
                                    <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
                                      Personal
                                    </span>
                                  )}
                                  {hasErrors && (
                                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3" />
                                      Missing Info
                                    </span>
                                  )}
                                </div>
                                {client.companyName && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {client.companyName}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              {client.email && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Mail className="w-4 h-4" />
                                  <span className="truncate">{client.email}</span>
                                </div>
                              )}
                              {client.phone && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Phone className="w-4 h-4" />
                                  <span>{client.phone}</span>
                                </div>
                              )}
                              {client.location && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span className="truncate">{client.location}</span>
                                </div>
                              )}
                              {client.status && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <span className="text-xs font-medium">Status:</span>
                                  <span className="capitalize">{client.status}</span>
                                </div>
                              )}
                            </div>
                            
                            {client.notes && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Notes: </span>
                                <span>{client.notes}</span>
                              </div>
                            )}
                            
                            {client.businessUEN && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">UEN: </span>
                                <span>{client.businessUEN}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{selectedClients.size}</span> of{' '}
                  <span className="font-semibold text-gray-900">{extractedClients.length}</span> clients selected
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setExtractedClients([])
                      setSelectedClients(new Set())
                      setImportFile(null)
                    }}
                    disabled={isSubmitting}
                  >
                    Start Over
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={async () => {
                      if (selectedClients.size === 0) {
                        alert('Please select at least one client to add.')
                        return
                      }
                      
                      setIsSubmitting(true)
                      try {
                        const clientsToAdd = Array.from(selectedClients).map(
                          (index) => extractedClients[index]
                        )
                        
                        // Add selected clients
                        const newClients: Client[] = clientsToAdd.map((clientData, idx) => ({
                          id: String(clients.length + idx + 1),
                          name: clientData.name || 'Unnamed Client',
                          companyName: clientData.companyName,
                          type: clientData.type || (clientData.companyName ? 'business' : 'personal'),
                          email: clientData.email,
                          phone: clientData.phone,
                          status: clientData.status || 'door knocked',
                          notes: clientData.notes || '',
                          location: clientData.location,
                          interestLevel: clientData.interestLevel || 'warm',
                          assignedDate: new Date(),
                          totalDeals: 0,
                          totalLoanAmount: 0,
                          businessUEN: clientData.businessUEN,
                          businessRegistrationDate: clientData.businessRegistrationDate,
                        }))
                        
                        setClients(prev => [...prev, ...newClients])
                        
                        // Reset and close
                        setExtractedClients([])
                        setSelectedClients(new Set())
                        setImportFile(null)
                        setShowImportModal(false)
                      } catch (error) {
                        console.error('Error adding clients:', error)
                        alert('Failed to add clients. Please try again.')
                      } finally {
                        setIsSubmitting(false)
                      }
                    }}
                    disabled={isSubmitting || selectedClients.size === 0}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      'Adding...'
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Add Selected Clients ({selectedClients.size})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
