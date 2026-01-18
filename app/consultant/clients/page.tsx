'use client'

import { useEffect, useState } from 'react'
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
  MoreVertical,
  Eye,
  Edit,
  MessageSquare
} from 'lucide-react'
import Button from '@/components/ui/Button'

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
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'personal' | 'business'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'prospect'>('all')

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    // Mock data
    const mockClients: Client[] = [
      {
        id: '1',
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
      },
      {
        id: '2',
        name: 'ABC Trading Pte Ltd',
        type: 'business',
        email: 'contact@abctrading.sg',
        phone: '+65 6789 0123',
        status: 'active',
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
        status: 'active',
        assignedDate: new Date('2023-10-10'),
        totalDeals: 1,
        totalLoanAmount: 30000,
        lastContact: new Date('2024-01-12'),
      },
      {
        id: '4',
        name: 'XYZ Services Ltd',
        type: 'business',
        email: 'info@xyzservices.sg',
        phone: '+65 6345 6789',
        status: 'active',
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
        status: 'inactive',
        assignedDate: new Date('2022-11-15'),
        totalDeals: 1,
        totalLoanAmount: 75000,
        lastContact: new Date('2023-12-20'),
      },
      {
        id: '6',
        name: 'DEF Manufacturing Pte Ltd',
        type: 'business',
        email: 'contact@defmfg.sg',
        phone: '+65 6456 7890',
        status: 'prospect',
        assignedDate: new Date('2024-01-01'),
        totalDeals: 0,
        totalLoanAmount: 0,
        businessUEN: '203456789C',
        businessRegistrationDate: new Date('2018-07-10'),
      },
    ]

    setClients(mockClients)
  }, [router])

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.phone.includes(searchQuery)
    const matchesType = filterType === 'all' || client.type === filterType
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

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
            <Button variant="primary" size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Client
            </Button>
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
              placeholder="Search clients by name, email, or phone..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {clients.filter(c => c.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Personal</p>
            <p className="text-2xl font-bold text-primary">
              {clients.filter(c => c.type === 'personal').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Business</p>
            <p className="text-2xl font-bold text-teal">
              {clients.filter(c => c.type === 'business').length}
            </p>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
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

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
                {client.businessUEN && (
                  <div className="text-xs text-gray-500">
                    UEN: {client.businessUEN}
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
                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/consultant/messages?client=${client.id}`}
                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    title="Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No clients found</p>
            <Button variant="primary" size="sm" className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Add Your First Client
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
