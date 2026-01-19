'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User, Mail, Phone, MapPin, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

interface AppointmentSlot {
  date: string
  time: string
  available: boolean
}

interface Appointment {
  id: string
  date: string
  time: string
  type: 'initial' | 'follow-up' | 'application-review'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  consultant?: {
    name: string
    email: string
  }
}

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isBooking, setIsBooking] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'initial' as 'initial' | 'follow-up' | 'application-review',
    notes: '',
  })

  // Generate calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: Array<{ date: number; fullDate: Date; isCurrentMonth: boolean }> = []

    // Add days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate.getDate(), fullDate: prevDate, isCurrentMonth: false })
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const fullDate = new Date(year, month, i)
      days.push({ date: i, fullDate, isCurrentMonth: true })
    }

    // Fill remaining days to complete grid
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({ date: i, fullDate: nextDate, isCurrentMonth: false })
    }

    return days
  }

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ]

  // Get available appointments for selected date
  const getAvailableSlots = (date: string): string[] => {
    // Mock: return all slots for now, in real app this would check against booked appointments
    const bookedSlots = appointments
      .filter(apt => apt.date === date && apt.status !== 'cancelled')
      .map(apt => apt.time)
    return timeSlots.filter(slot => !bookedSlots.includes(slot))
  }

  // Check if date is in the past
  const isDateInPast = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  // Format date for display
  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-SG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Select date
  const handleDateSelect = (date: Date) => {
    if (isDateInPast(date)) return
    const dateString = date.toISOString().split('T')[0]
    setSelectedDate(dateString)
    setSelectedTime(null)
    setShowBookingForm(false)
  }

  // Select time
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setShowBookingForm(true)
  }

  // Submit appointment booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return

    setIsBooking(true)
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        date: selectedDate,
        time: selectedTime,
        type: formData.type,
        status: 'pending',
      }

      setAppointments([...appointments, newAppointment])
      setShowBookingForm(false)
      setSelectedDate(null)
      setSelectedTime(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        type: 'initial',
        notes: '',
      })
    } catch (error) {
      console.error('Error booking appointment:', error)
    } finally {
      setIsBooking(false)
    }
  }

  // Load existing appointments (mock data)
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '10:00',
        type: 'initial',
        status: 'confirmed',
        consultant: {
          name: 'Sarah Chen',
          email: 'sarah.chen@brillianceadvisory.sg',
        },
      },
    ]
    setAppointments(mockAppointments)
  }, [])

  const days = getDaysInMonth(currentDate)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-primary hover:text-teal mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Schedule an Appointment</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Book a consultation with our expert advisors to discuss your loan needs. Choose a date and time that works for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                {days.map((day, index) => {
                  const dateString = day.fullDate.toISOString().split('T')[0]
                  const hasAppointment = appointments.some(apt => apt.date === dateString)
                  const isSelected = selectedDate === dateString
                  const isPast = isDateInPast(day.fullDate)
                  const isTodayDate = isToday(day.fullDate)

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(day.fullDate)}
                      disabled={isPast || !day.isCurrentMonth}
                      className={`
                        h-12 rounded-lg transition-all
                        ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                        ${isPast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                        ${isSelected ? 'bg-primary text-white font-semibold' : ''}
                        ${isTodayDate && !isSelected ? 'bg-primary/10 text-primary font-semibold border-2 border-primary' : ''}
                        ${hasAppointment && !isSelected ? 'bg-teal/10 text-teal' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span>{day.date}</span>
                        {hasAppointment && (
                          <div className="w-1 h-1 bg-teal rounded-full mt-0.5"></div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Selected Date Time Slots */}
              {selectedDate && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Available Times - {formatDateDisplay(selectedDate)}
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {getAvailableSlots(selectedDate).map(time => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`
                          px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium
                          ${selectedTime === time
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {getAvailableSlots(selectedDate).length === 0 && (
                    <p className="text-gray-500 text-sm">No available slots for this date</p>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Booking Form / Upcoming Appointments */}
          <div className="lg:col-span-1">
            {showBookingForm && selectedDate && selectedTime ? (
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Book Appointment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date & Time
                    </label>
                    <p className="text-sm text-gray-600">
                      {formatDateDisplay(selectedDate)} at {selectedTime}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="initial">Initial Consultation</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="application-review">Application Review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Any specific questions or topics you'd like to discuss?"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isBooking}
                  >
                    {isBooking ? 'Booking...' : 'Confirm Appointment'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowBookingForm(false)
                      setSelectedTime(null)
                    }}
                  >
                    Cancel
                  </Button>
                </form>
              </Card>
            ) : (
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
                {appointments.filter(apt => apt.status !== 'cancelled' && apt.status !== 'completed').length > 0 ? (
                  <div className="space-y-4">
                    {appointments
                      .filter(apt => apt.status !== 'cancelled' && apt.status !== 'completed')
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map(appointment => (
                        <div
                          key={appointment.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {appointment.status === 'confirmed' ? (
                                <CheckCircle2 className="w-5 h-5 text-teal" />
                              ) : (
                                <Clock className="w-5 h-5 text-yellow-500" />
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                {appointment.type === 'initial' ? 'Initial Consultation' :
                                 appointment.type === 'follow-up' ? 'Follow-up' :
                                 'Application Review'}
                              </span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              appointment.status === 'confirmed' ? 'bg-teal/10 text-teal' :
                              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {formatDateDisplay(appointment.date)}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {appointment.time}
                          </p>
                          {appointment.consultant && (
                            <p className="text-xs text-gray-500 mt-2">
                              with {appointment.consultant.name}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">
                      No upcoming appointments. Select a date and time to book.
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>admin@brillianceadvisory.sg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>+65 8038 5584</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>400 Orchard Rd, Singapore</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}