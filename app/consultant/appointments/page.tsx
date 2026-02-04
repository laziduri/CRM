'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  Video,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Appointment {
  id: string
  title: string
  clientId: string
  clientName: string
  clientType: 'personal' | 'business'
  consultantId: string
  consultantName: string
  date: Date
  startTime: string
  endTime: string
  duration: number
  type: 'consultation' | 'follow-up' | 'closing' | 'other'
  location: 'office' | 'online' | 'client-site'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  reminder?: Date
}

interface TimeSlot {
  hour: number
  label: string
  appointments: Appointment[]
}

export default function AppointmentsPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'day' | 'week'>('month')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: 60,
    clientId: '',
    type: 'consultation' as 'consultation' | 'follow-up' | 'closing' | 'other',
    location: 'office' as 'office' | 'online' | 'client-site',
    notes: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/crm')
      return
    }

    // Mock appointments data
    const today = new Date()
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        title: 'Initial Consultation',
        clientId: '1',
        clientName: 'John Doe',
        clientType: 'personal',
        consultantId: '1',
        consultantName: 'Sarah Chen',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        duration: 60,
        type: 'consultation',
        location: 'office',
        status: 'confirmed',
        notes: 'Discuss personal loan options for home renovation',
      },
      {
        id: '2',
        title: 'Follow-up Meeting',
        clientId: '2',
        clientName: 'ABC Trading Pte Ltd',
        clientType: 'business',
        consultantId: '1',
        consultantName: 'Sarah Chen',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
        startTime: '2:30 PM',
        endTime: '3:15 PM',
        duration: 45,
        type: 'follow-up',
        location: 'online',
        status: 'scheduled',
      },
      {
        id: '3',
        title: 'Closing Meeting',
        clientId: '3',
        clientName: 'Jane Smith',
        clientType: 'personal',
        consultantId: '1',
        consultantName: 'Sarah Chen',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
        startTime: '4:00 PM',
        endTime: '4:30 PM',
        duration: 30,
        type: 'closing',
        location: 'office',
        status: 'scheduled',
      },
      {
        id: '4',
        title: 'Client Meeting',
        clientId: '4',
        clientName: 'XYZ Services Ltd',
        clientType: 'business',
        consultantId: '1',
        consultantName: 'Sarah Chen',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0),
        startTime: '11:00 AM',
        endTime: '12:00 PM',
        duration: 60,
        type: 'consultation',
        location: 'client-site',
        status: 'confirmed',
      },
      {
        id: '5',
        title: 'Follow-up',
        clientId: '5',
        clientName: 'Robert Chen',
        clientType: 'personal',
        consultantId: '1',
        consultantName: 'Sarah Chen',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 9, 30),
        startTime: '9:30 AM',
        endTime: '10:15 AM',
        duration: 45,
        type: 'follow-up',
        location: 'online',
        status: 'scheduled',
      },
      {
        id: '6',
        title: 'Initial Consultation',
        clientId: '6',
        clientName: 'DEF Manufacturing',
        clientType: 'business',
        consultantId: '1',
        consultantName: 'Sarah Chen',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 15, 0),
        startTime: '3:00 PM',
        endTime: '4:00 PM',
        duration: 60,
        type: 'consultation',
        location: 'office',
        status: 'scheduled',
      },
    ]

    setAppointments(mockAppointments)
    setIsLoading(false)
  }, [router])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate.getDate() === date.getDate() &&
             aptDate.getMonth() === date.getMonth() &&
             aptDate.getFullYear() === date.getFullYear()
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setDate(prev.getDate() - 1)
      } else {
        newDate.setDate(prev.getDate() + 1)
      }
      return newDate
    })
    setCurrentDate(selectedDate)
  }

  const getTimeSlots = (date: Date) => {
    const slots: TimeSlot[] = []
    const dayAppointments = getAppointmentsForDate(date)
    
    for (let hour = 8; hour <= 18; hour++) {
      const slotAppointments = dayAppointments.filter(apt => {
        const aptHour = new Date(apt.date).getHours()
        return aptHour === hour || (aptHour < hour && aptHour + Math.ceil(apt.duration / 60) > hour)
      })
      
      slots.push({
        hour,
        label: hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`,
        appointments: slotAppointments,
      })
    }
    
    return slots
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'online':
        return <Video className="w-4 h-4" />
      case 'client-site':
        return <MapPin className="w-4 h-4" />
      default:
        return <CalendarIcon className="w-4 h-4" />
    }
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const selectedDateAppointments = getAppointmentsForDate(selectedDate)
  const timeSlots = viewMode === 'day' ? getTimeSlots(selectedDate) : []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
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
              <Link href="/consultant/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                <p className="text-sm text-gray-600">Manage your schedule and client meetings</p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4" />
              New Appointment
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Mode Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'month' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
          </div>
          {viewMode === 'day' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateDay('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="font-semibold text-gray-900 min-w-[200px] text-center">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <button
                onClick={() => navigateDay('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => {
                  const today = new Date()
                  setSelectedDate(today)
                  setCurrentDate(today)
                }}
                className="px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>
          )}
        </div>

        {/* Month View */}
        {viewMode === 'month' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">{monthName}</h2>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-700 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDay }).map((_, index) => (
                <div key={`empty-${index}`} className="min-h-[120px]"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                const dayAppointments = getAppointmentsForDate(date)
                const isToday = date.toDateString() === new Date().toDateString()
                const isSelected = date.toDateString() === selectedDate.toDateString()

                return (
                  <div
                    key={day}
                    onClick={() => {
                      setSelectedDate(date)
                      setViewMode('day')
                    }}
                    className={`min-h-[120px] p-2 border-2 rounded-lg cursor-pointer transition-all ${
                      isToday
                        ? 'border-primary bg-primary/5'
                        : isSelected
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday ? 'text-primary' : isSelected ? 'text-primary' : 'text-gray-900'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((apt) => (
                        <div
                          key={apt.id}
                          className={`text-xs p-1 rounded truncate border ${
                            apt.type === 'consultation'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : apt.type === 'follow-up'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : apt.type === 'closing'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAppointment(apt)
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{apt.startTime}</span>
                          </div>
                          <div className="truncate">{apt.clientName}</div>
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Day View - Time Tree */}
        {viewMode === 'day' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square"></div>
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                    const dayAppointments = getAppointmentsForDate(date)
                    const isToday = date.toDateString() === new Date().toDateString()
                    const isSelected = date.toDateString() === selectedDate.toDateString()

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(date)}
                        className={`aspect-square text-xs rounded transition-colors ${
                          isToday
                            ? 'bg-primary text-white font-semibold'
                            : isSelected
                            ? 'bg-primary/20 text-primary font-semibold'
                            : dayAppointments.length > 0
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {day}
                        {dayAppointments.length > 0 && (
                          <div className="text-[8px] mt-0.5">{dayAppointments.length}</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Time Tree View */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </h3>
                      <p className="text-sm text-gray-600">{selectedDateAppointments.length} appointment(s)</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                  {/* Time Slots */}
                  <div className="divide-y divide-gray-200">
                    {timeSlots.map((slot) => (
                      <div key={slot.hour} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors">
                        <div className="col-span-2 text-sm font-medium text-gray-700 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {slot.label}
                        </div>
                        <div className="col-span-10 space-y-2">
                          {slot.appointments.length > 0 ? (
                            slot.appointments.map((apt) => (
                              <div
                                key={apt.id}
                                onClick={() => setSelectedAppointment(apt)}
                                className={`p-3 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all ${
                                  apt.type === 'consultation'
                                    ? 'border-blue-200 bg-blue-50'
                                    : apt.type === 'follow-up'
                                    ? 'border-purple-200 bg-purple-50'
                                    : apt.type === 'closing'
                                    ? 'border-green-200 bg-green-50'
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      {apt.clientType === 'personal' ? (
                                        <User className="w-4 h-4 text-primary" />
                                      ) : (
                                        <Building2 className="w-4 h-4 text-teal" />
                                      )}
                                      <h4 className="font-semibold text-gray-900">{apt.title}</h4>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">{apt.clientName}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{apt.startTime} - {apt.endTime}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {getLocationIcon(apt.location)}
                                        <span className="capitalize">{apt.location.replace('-', ' ')}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(apt.status)}`}>
                                    {apt.status}
                                  </span>
                                </div>
                                {apt.notes && (
                                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{apt.notes}</p>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-400 italic">No appointments</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Detail Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Appointment Details</h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{selectedAppointment.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {selectedAppointment.clientType === 'personal' ? (
                      <User className="w-4 h-4 text-primary" />
                    ) : (
                      <Building2 className="w-4 h-4 text-teal" />
                    )}
                    <span>{selectedAppointment.clientName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {selectedAppointment.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {selectedAppointment.startTime} - {selectedAppointment.endTime}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <div className="flex items-center gap-2">
                      {getLocationIcon(selectedAppointment.location)}
                      <span className="font-medium text-gray-900 capitalize">
                        {selectedAppointment.location.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Notes</p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <Link
                    href={`/consultant/clients/${selectedAppointment.clientId}`}
                    className="flex-1"
                  >
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      View Client
                    </Button>
                  </Link>
                  <Button variant="primary" className="flex-1 flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Appointment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Appointment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Create New Appointment</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                if (!formData.title.trim()) {
                  alert('Please enter a title for the appointment')
                  return
                }
                if (!formData.date || !formData.time) {
                  alert('Please select both date and time')
                  return
                }
                if (formData.type !== 'other' && !formData.clientId) {
                  alert('Please select a client')
                  return
                }

                setIsSubmitting(true)
                try {
                  const consultantId = localStorage.getItem('consultant_id')
                  if (!consultantId) {
                    alert('Please log in to create appointments')
                    setIsSubmitting(false)
                    return
                  }

                  const startTime = new Date(`${formData.date}T${formData.time}`)
                  const endTime = new Date(startTime.getTime() + formData.duration * 60000)

                  const response = await fetch('/api/consultant/appointments', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-consultant-id': consultantId,
                    },
                    body: JSON.stringify({
                      title: formData.title,
                      clientId: formData.clientId || null,
                      appointmentType: formData.type,
                      startTime: startTime.toISOString(),
                      endTime: endTime.toISOString(),
                      duration: formData.duration,
                      location: formData.location,
                      notes: formData.notes || null,
                    }),
                  })

                  if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.details || errorData.error || 'Failed to create appointment')
                  }

                  const data = await response.json()
                  
                  // Add to appointments list
                  const newAppointment: Appointment = {
                    id: data.appointment.id,
                    title: data.appointment.title,
                    clientId: data.appointment.clientId || '',
                    clientName: data.appointment.clientName || '',
                    clientType: data.appointment.clientType || 'personal',
                    consultantId: data.appointment.consultantId,
                    consultantName: data.appointment.consultantName || '',
                    date: new Date(data.appointment.startTime),
                    startTime: new Date(data.appointment.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                    endTime: new Date(data.appointment.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                    duration: data.appointment.duration,
                    type: formData.type,
                    location: data.appointment.location,
                    status: 'scheduled',
                    notes: data.appointment.notes,
                  }

                  setAppointments(prev => [...prev, newAppointment])
                  setShowCreateModal(false)
                  
                  // Reset form
                  setFormData({
                    title: '',
                    date: new Date().toISOString().split('T')[0],
                    time: '',
                    duration: 60,
                    clientId: '',
                    type: 'consultation',
                    location: 'office',
                    notes: '',
                  })
                } catch (error) {
                  console.error('Error creating appointment:', error)
                  alert(error instanceof Error ? error.message : 'Failed to create appointment. Please try again.')
                } finally {
                  setIsSubmitting(false)
                }
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Initial Consultation"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                  <select 
                    value={formData.clientId}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a client...</option>
                    <option value="1">John Doe (Personal)</option>
                    <option value="2">ABC Trading Pte Ltd (Business)</option>
                    <option value="3">Jane Smith (Personal)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="consultation">Consultation</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="closing">Closing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select 
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value as any }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="office">Office</option>
                      <option value="online">Online</option>
                      <option value="client-site">Client Site</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Add any notes or details about this appointment..."
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShowCreateModal(false)
                      setFormData({
                        title: '',
                        date: new Date().toISOString().split('T')[0],
                        time: '',
                        duration: 60,
                        clientId: '',
                        type: 'consultation',
                        location: 'office',
                        notes: '',
                      })
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="flex-1 flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Creating...'
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Appointment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
