'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Calendar as CalendarIcon,
  Link as LinkIcon,
  Copy,
  Check,
  Plus,
  Zap,
  Clock,
  MapPin,
  User,
  Mail,
  Share2,
  Settings,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface BookingLink {
  id: string
  name: string
  description: string
  url: string
  duration: number
  location: string
  availability: {
    days: string[]
    startTime: string
    endTime: string
    timezone: string
  }
  bufferTime: number
  maxBookingsPerDay: number
  aiOptimized: boolean
  totalBookings: number
  createdAt: Date
}

interface Booking {
  id: string
  linkId: string
  clientName: string
  clientEmail: string
  date: Date
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  notes?: string
}

export default function AIMeetingAssistantPage() {
  const router = useRouter()
  const [bookingLinks, setBookingLinks] = useState<BookingLink[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLink, setSelectedLink] = useState<BookingLink | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    // Mock booking links
    const mockLinks: BookingLink[] = [
      {
        id: '1',
        name: 'Initial Consultation',
        description: '30-minute initial consultation for new clients',
        url: 'https://brilliance-advisory.com/book/consultant1-initial',
        duration: 30,
        location: 'Online (Zoom)',
        availability: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          startTime: '09:00',
          endTime: '17:00',
          timezone: 'Asia/Singapore',
        },
        bufferTime: 15,
        maxBookingsPerDay: 8,
        aiOptimized: true,
        totalBookings: 12,
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        name: 'Follow-up Meeting',
        description: '15-minute follow-up for existing clients',
        url: 'https://brilliance-advisory.com/book/consultant1-followup',
        duration: 15,
        location: 'Phone Call',
        availability: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          startTime: '10:00',
          endTime: '16:00',
          timezone: 'Asia/Singapore',
        },
        bufferTime: 10,
        maxBookingsPerDay: 12,
        aiOptimized: false,
        totalBookings: 5,
        createdAt: new Date('2024-02-01'),
      },
    ]

    // Mock bookings
    const mockBookings: Booking[] = [
      {
        id: 'b1',
        linkId: '1',
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        date: new Date('2024-02-15'),
        time: '10:00',
        status: 'confirmed',
      },
      {
        id: 'b2',
        linkId: '1',
        clientName: 'Jane Smith',
        clientEmail: 'jane@example.com',
        date: new Date('2024-02-16'),
        time: '14:30',
        status: 'pending',
      },
    ]

    setBookingLinks(mockLinks)
    setBookings(mockBookings)
    setIsLoading(false)
  }, [router])

  const optimizeScheduleWithAI = async (linkId: string) => {
    try {
      const response = await fetch('/api/ai/meeting-assistant/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId, bookings }),
      })

      const data = await response.json()

      if (response.ok && data.optimizedSchedule) {
        alert('AI optimized your schedule!')
        // Update booking link with optimized settings
      }
    } catch (error) {
      console.error('AI optimization error:', error)
    }
  }

  const copyLink = (linkId: string) => {
    const link = bookingLinks.find(l => l.id === linkId)
    if (link) {
      navigator.clipboard.writeText(link.url)
      setCopiedLinkId(linkId)
      setTimeout(() => setCopiedLinkId(null), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meeting assistant...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Meeting Assistant</h1>
                <p className="text-sm text-gray-600">Simplify meeting scheduling and booking links</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Booking Link
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Booking Links */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookingLinks.map((link) => (
              <div
                key={link.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{link.name}</h3>
                      {link.aiOptimized && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{link.description}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{link.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{link.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{link.totalBookings} bookings</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => copyLink(link.id)}
                  >
                    {copiedLinkId === link.id ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLink(link)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  {!link.aiOptimized && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => optimizeScheduleWithAI(link.id)}
                    >
                      <Zap className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {bookings.map((booking) => {
                const link = bookingLinks.find(l => l.id === booking.linkId)
                return (
                  <div
                    key={booking.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium text-gray-900">{booking.clientName}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{booking.date.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{booking.time}</span>
                          </div>
                          {link && (
                            <div className="flex items-center gap-1">
                              <LinkIcon className="w-4 h-4" />
                              <span>{link.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span>{booking.clientEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {bookings.length === 0 && (
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming bookings</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Link Detail Modal */}
      <Modal
        isOpen={!!selectedLink}
        onClose={() => setSelectedLink(null)}
        title={selectedLink?.name}
        size="lg"
      >
        {selectedLink && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Booking Link</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={selectedLink.url}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyLink(selectedLink.id)}
                >
                  {copiedLinkId === selectedLink.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Duration</h3>
                <p className="text-sm text-gray-900">{selectedLink.duration} minutes</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
                <p className="text-sm text-gray-900">{selectedLink.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Buffer Time</h3>
                <p className="text-sm text-gray-900">{selectedLink.bufferTime} minutes</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Max Bookings/Day</h3>
                <p className="text-sm text-gray-900">{selectedLink.maxBookingsPerDay}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Availability</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-900">
                  Days: {selectedLink.availability.days.join(', ')}
                </p>
                <p className="text-sm text-gray-900">
                  Time: {selectedLink.availability.startTime} - {selectedLink.availability.endTime}
                </p>
                <p className="text-sm text-gray-900">
                  Timezone: {selectedLink.availability.timezone}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Link Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Booking Link"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Initial Consultation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Describe this booking type"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Online, Office, etc."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">Create Link</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
