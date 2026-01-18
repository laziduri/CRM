'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar as CalendarIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Zap,
  AlertCircle,
  CheckCircle2,
  Plus,
  Smartphone,
  Search,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface Appointment {
  id: string
  title: string
  clientName: string
  consultantId?: string
  consultantName?: string
  directorId?: string
  directorName?: string
  teammateId?: string
  teammateName?: string
  startTime: Date
  endTime: Date
  location: string
  type: 'consultation' | 'follow-up' | 'meeting' | 'closing' | 'task' | 'internal'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  aiSuggested?: boolean
  aiConflicts?: string[]
  aiRecommendations?: string
  isMyAppointment?: boolean
  isTeamAppointment?: boolean
  isDirectorAppointment?: boolean
}

interface Conflict {
  appointmentId: string
  conflictType: 'overlap' | 'too-short-break' | 'location-conflict'
  message: string
  suggestion: string
}

export default function AICalendarPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([])
  const [calendarView, setCalendarView] = useState<'my' | 'team' | 'all'>('my')
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([])
  const [showDirectorCalendar, setShowDirectorCalendar] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    // Mock appointments with team/director visibility
    const today = new Date()
    const currentConsultantId = localStorage.getItem('consultant_id') || '1'
    
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        title: 'Client Consultation',
        clientName: 'John Doe',
        consultantId: currentConsultantId,
        consultantName: 'You',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
        location: 'Office',
        type: 'consultation',
        status: 'confirmed',
        isMyAppointment: true,
        aiSuggested: true,
        aiRecommendations: 'Client prefers morning meetings. Consider scheduling follow-up within 24 hours.',
      },
      {
        id: '2',
        title: 'Team Meeting',
        clientName: 'Internal',
        consultantId: currentConsultantId,
        consultantName: 'You',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
        location: 'Conference Room',
        type: 'meeting',
        status: 'scheduled',
        isMyAppointment: true,
        aiConflicts: ['Overlaps with potential client call'],
      },
      {
        id: '3',
        title: 'Client Follow-up',
        clientName: 'ABC Trading',
        teammateId: '2',
        teammateName: 'John Smith',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        location: 'Zoom',
        type: 'follow-up',
        status: 'confirmed',
        isTeamAppointment: true,
      },
      {
        id: '4',
        title: 'Director Review Meeting',
        clientName: 'Internal',
        directorId: 'ashley',
        directorName: 'Ashley',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0),
        location: 'Conference Room A',
        type: 'meeting',
        status: 'scheduled',
        isDirectorAppointment: true,
      },
      {
        id: '5',
        title: 'Review Q1 Campaign - Auto Scheduled',
        clientName: 'Task',
        consultantId: currentConsultantId,
        consultantName: 'You',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 30),
        location: 'Office',
        type: 'task',
        status: 'scheduled',
        isMyAppointment: true,
        aiSuggested: true,
        aiRecommendations: 'Auto-scheduled by AI based on priority and deadline.',
      },
    ]

    // Detect conflicts
    const detectedConflicts: Conflict[] = []
    for (let i = 0; i < mockAppointments.length; i++) {
      for (let j = i + 1; j < mockAppointments.length; j++) {
        const a1 = mockAppointments[i]
        const a2 = mockAppointments[j]

        // Check for overlap
        if (
          a1.startTime < a2.endTime &&
          a2.startTime < a1.endTime &&
          a1.id !== a2.id
        ) {
          detectedConflicts.push({
            appointmentId: a1.id,
            conflictType: 'overlap',
            message: `Overlaps with "${a2.title}"`,
            suggestion: `Consider moving to ${new Date(a2.endTime.getTime() + 30 * 60000).toLocaleTimeString()}`,
          })
        }

        // Check for too short break between appointments
        const breakTime = (a2.startTime.getTime() - a1.endTime.getTime()) / (1000 * 60)
        if (breakTime > 0 && breakTime < 30 && a1.location === a2.location) {
          detectedConflicts.push({
            appointmentId: a1.id,
            conflictType: 'too-short-break',
            message: `Only ${Math.round(breakTime)} minutes break before next appointment`,
            suggestion: 'Add buffer time for preparation',
          })
        }
      }
    }

    setAppointments(mockAppointments)
    setConflicts(detectedConflicts)
    setIsLoading(false)
  }, [router])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const getAppointmentsForDate = (date: Date) => {
    if (!date) return []
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.startTime)
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getSmartScheduleRecommendations = async () => {
    try {
      const response = await fetch('/api/ai/calendar/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointments,
          preferences: {
            workingHours: { start: '09:00', end: '18:00' },
            preferredBreakTime: 30,
            maxConsecutiveHours: 4,
          },
        }),
      })

      const data = await response.json()

      if (response.ok && data.recommendations) {
        setAiRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error('AI scheduling error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    )
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AI Calendar</h1>
                <p className="text-xs sm:text-sm text-gray-600">Intelligent scheduling with AI assistance</p>
              </div>
            </div>
            
            {/* Calendar View Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCalendarView('my')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    calendarView === 'my'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Calendar
                </button>
                <button
                  onClick={() => setCalendarView('team')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    calendarView === 'team'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Team
                </button>
                <button
                  onClick={() => setCalendarView('all')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    calendarView === 'all'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
              </div>
              
              <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                <input
                  type="checkbox"
                  checked={showDirectorCalendar}
                  onChange={(e) => setShowDirectorCalendar(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Directors</span>
              </label>
              
              <Button
                variant="outline"
                size="sm"
                onClick={getSmartScheduleRecommendations}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Suggest
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Banner */}
      {aiRecommendations.length > 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-purple-50 border-b border-primary/20 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-medium text-gray-900">AI Scheduling Recommendations</h3>
            </div>
            <ul className="space-y-1 ml-8">
              {aiRecommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Conflicts Warning */}
      {conflicts.length > 0 && (
        <div className="bg-yellow-50 border-b border-yellow-200 py-3">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">
                {conflicts.length} scheduling conflict{conflicts.length !== 1 ? 's' : ''} detected
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar View */}
          <div className="lg:col-span-3">
            {/* Calendar Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-700 py-2"
              >
                {day}
              </div>
            ))}
            {days.map((day, index) => {
              const dayAppointments = day ? getAppointmentsForDate(day) : []
              const isToday = day && day.toDateString() === new Date().toDateString()
              const isSelected = day && day.toDateString() === selectedDate.toDateString()

              return (
                <div
                  key={index}
                  onClick={() => day && setSelectedDate(day)}
                  className={`min-h-[100px] p-2 border border-gray-200 rounded-lg ${
                    day
                      ? isSelected
                        ? 'bg-primary/10 border-primary'
                        : isToday
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white hover:bg-gray-50 cursor-pointer'
                      : 'bg-gray-50'
                  }`}
                >
                  {day && (
                    <>
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-blue-600' : isSelected ? 'text-primary' : 'text-gray-900'
                        }`}
                      >
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 3).map((apt) => {
                          const hasConflict = conflicts.some((c) => c.appointmentId === apt.id)
                          return (
                            <div
                              key={apt.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedAppointment(apt)
                              }}
                              className={`text-xs p-1 rounded truncate ${
                                hasConflict
                                  ? 'bg-red-100 text-red-700 border border-red-300'
                                  : apt.aiSuggested
                                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                  : 'bg-primary/10 text-primary border border-primary/20'
                              }`}
                            >
                              {apt.startTime.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}{' '}
                              {apt.title}
                            </div>
                          )
                        })}
                        {dayAppointments.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{dayAppointments.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Date Appointments */}
        {selectedDate && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Appointments for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <div className="space-y-3">
              {getAppointmentsForDate(selectedDate).map((apt) => {
                const aptConflicts = conflicts.filter((c) => c.appointmentId === apt.id)
                return (
                  <div
                    key={apt.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedAppointment(apt)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{apt.title}</h4>
                          {apt.aiSuggested && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              AI Suggested
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {apt.startTime.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}{' '}
                              -{' '}
                              {apt.endTime.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{apt.location}</span>
                          </div>
                          {apt.isTeamAppointment && apt.teammateName && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <User className="w-4 h-4" />
                              <span>Team: {apt.teammateName}</span>
                            </div>
                          )}
                          {apt.isDirectorAppointment && apt.directorName && (
                            <div className="flex items-center gap-1 text-orange-600">
                              <User className="w-4 h-4" />
                              <span>Director: {apt.directorName}</span>
                            </div>
                          )}
                          {!apt.isTeamAppointment && !apt.isDirectorAppointment && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{apt.clientName}</span>
                            </div>
                          )}
                        </div>
                        {aptConflicts.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {aptConflicts.map((conflict, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 text-xs text-red-700 bg-red-50 p-2 rounded"
                              >
                                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium">{conflict.message}</p>
                                  <p className="text-red-600">{conflict.suggestion}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {apt.aiRecommendations && (
                          <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/10">
                            <div className="flex items-center gap-2 mb-1">
                              <Sparkles className="w-3 h-3 text-primary" />
                              <span className="text-xs font-medium text-gray-700">AI Insight</span>
                            </div>
                            <p className="text-xs text-gray-700">{apt.aiRecommendations}</p>
                          </div>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  </div>
                )
              })}
              {getAppointmentsForDate(selectedDate).length === 0 && (
                <p className="text-gray-500 text-center py-8">No appointments for this date</p>
              )}
            </div>
          </div>
        )}
          </div>

          {/* Team Calendar Panel (Right Sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Calendars</h3>
              
              {/* Search Teammates */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search teammates..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* My Calendars */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">My calendars (2)</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-1 ml-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={calendarView === 'my'}
                      onChange={() => setCalendarView('my')}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-600">Personal</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={calendarView === 'my'}
                      onChange={() => setCalendarView('my')}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-600">Work</span>
                  </label>
                </div>
              </div>

              {/* Frequently Met With */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Frequently met with (3)</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-2 ml-2">
                  {['John Smith', 'Jane Doe', 'Mike Johnson'].map((name) => (
                    <label key={name} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTeammates.includes(name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTeammates([...selectedTeammates, name])
                            setCalendarView('team')
                          } else {
                            setSelectedTeammates(selectedTeammates.filter(t => t !== name))
                          }
                        }}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-600">{name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Directors */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Directors</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-2 ml-2">
                  {['Ashley', 'Kenneth', 'Lazarus'].map((name) => (
                    <label key={name} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDirectorCalendar && name.toLowerCase() === 'ashley'}
                        onChange={(e) => setShowDirectorCalendar(e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-600">{name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Legend */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-2">Legend</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary/10 border border-primary/20"></div>
                    <span className="text-xs text-gray-600">My Appointments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
                    <span className="text-xs text-gray-600">Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-orange-100 border border-orange-300"></div>
                    <span className="text-xs text-gray-600">Directors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-100 border border-purple-300"></div>
                    <span className="text-xs text-gray-600">AI Scheduled Tasks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title={selectedAppointment?.title}
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Client</h3>
                <p className="text-sm text-gray-900">{selectedAppointment.clientName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Type</h3>
                <p className="text-sm text-gray-900 capitalize">{selectedAppointment.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Start Time</h3>
                <p className="text-sm text-gray-900">
                  {selectedAppointment.startTime.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">End Time</h3>
                <p className="text-sm text-gray-900">
                  {selectedAppointment.endTime.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Location</h3>
                <p className="text-sm text-gray-900">{selectedAppointment.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Status</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedAppointment.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {selectedAppointment.status}
                </span>
              </div>
            </div>
            {selectedAppointment.aiRecommendations && (
              <div className="p-4 bg-gradient-to-r from-primary/10 to-purple-50 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium text-gray-900">AI Recommendations</h3>
                </div>
                <p className="text-sm text-gray-700">{selectedAppointment.aiRecommendations}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Appointment Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Appointment"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter appointment title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="meeting">Meeting</option>
              <option value="closing">Closing</option>
              <option value="internal">Internal</option>
            </select>
          </div>
          
          {/* Invite Teammates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Invite Teammates</label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
              {['John Smith', 'Jane Doe', 'Mike Johnson'].map((teammate) => (
                <label key={teammate} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{teammate}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Select teammates to see their availability and invite them</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Office, Zoom, Phone, etc."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              <Sparkles className="w-4 h-4 mr-2" />
              Create & Auto-Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
