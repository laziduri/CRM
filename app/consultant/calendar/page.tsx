'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  DollarSign,
  Bell,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Video,
  FileText,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Link as LinkIcon,
  Users,
  Flag,
  Tag,
  Layers,
  ChevronDown,
  CalendarDays,
  Grid3x3,
  List,
  ExternalLink,
  UserPlus,
  Cake as BirthdayCake,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import type {
  CalendarItem,
  Task,
  Appointment,
  CalendarViewMode,
  TaskType,
  TaskPriority,
  TeamMember,
  AISuggestion,
  Calendar,
  CalendarCategory,
  ColorPreset,
  TaskStatusType,
  AppointmentType,
} from '@/types'

const COLOR_PRESETS: { name: ColorPreset; hex: string; bg: string; text: string }[] = [
  { name: 'mint', hex: '#10B981', bg: 'bg-green-100', text: 'text-green-700' },
  { name: 'blue', hex: '#3B82F6', bg: 'bg-blue-100', text: 'text-blue-700' },
  { name: 'purple', hex: '#8B5CF6', bg: 'bg-purple-100', text: 'text-purple-700' },
  { name: 'pink', hex: '#EC4899', bg: 'bg-pink-100', text: 'text-pink-700' },
  { name: 'red', hex: '#EF4444', bg: 'bg-red-100', text: 'text-red-700' },
  { name: 'orange', hex: '#F97316', bg: 'bg-orange-100', text: 'text-orange-700' },
  { name: 'yellow', hex: '#EAB308', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  { name: 'green', hex: '#22C55E', bg: 'bg-green-100', text: 'text-green-700' },
  { name: 'teal', hex: '#14B8A6', bg: 'bg-teal-100', text: 'text-teal-700' },
  { name: 'cyan', hex: '#06B6D4', bg: 'bg-cyan-100', text: 'text-cyan-700' },
  { name: 'indigo', hex: '#6366F1', bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { name: 'violet', hex: '#A855F7', bg: 'bg-violet-100', text: 'text-violet-700' },
  { name: 'rose', hex: '#F43F5E', bg: 'bg-rose-100', text: 'text-rose-700' },
  { name: 'amber', hex: '#F59E0B', bg: 'bg-amber-100', text: 'text-amber-700' },
]

// Enhanced Appointment Form Component
function EnhancedAppointmentForm({
  onClose,
  selectedDate,
  myColor,
}: {
  onClose: () => void
  selectedDate: Date
  myColor: ColorPreset
}) {
  const [clients, setClients] = useState<any[]>([])
  const [searchClient, setSearchClient] = useState('')
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    clientName: '',
    clientType: 'personal' as 'personal' | 'business',
    appointmentType: 'consultation' as AppointmentType,
    date: selectedDate.toISOString().split('T')[0],
    time: '09:00',
    duration: 60,
    location: 'office' as 'office' | 'online' | 'client-site' | 'door-knocking',
    locationAddress: '',
    googleMapsLink: '',
    isJoinable: false,
    notes: '',
    color: myColor as ColorPreset,
  })

  useEffect(() => {
    // Load clients
    const mockClients = [
      { id: '1', name: 'John Doe', type: 'personal', email: 'john.doe@example.com', phone: '+65 9123 4567' },
      { id: '2', name: 'ABC Trading Pte Ltd', type: 'business', email: 'contact@abctrading.sg', phone: '+65 6789 0123' },
      { id: '3', name: 'Jane Smith', type: 'personal', email: 'jane.smith@example.com', phone: '+65 9876 5432' },
      { id: '4', name: 'XYZ Services Ltd', type: 'business', email: 'info@xyzservices.sg', phone: '+65 6123 4567' },
    ]
    setClients(mockClients)
  }, [])

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchClient.toLowerCase())
  )

  const handleClientSelect = (client: any) => {
    setFormData({
      ...formData,
      clientId: client.id,
      clientName: client.name,
      clientType: client.type,
    })
    setSearchClient(client.name)
    setShowClientDropdown(false)
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title) {
      alert('Please enter a title')
      return
    }
    
    if (formData.appointmentType !== 'door-knocking' && formData.appointmentType !== 'meeting' && !formData.clientId) {
      alert('Please select a client')
      return
    }
    
    if (formData.appointmentType === 'door-knocking' && !formData.locationAddress) {
      alert('Please enter a location address for door knocking')
      return
    }

    // Create appointment with join functionality
    const appointmentData = {
      ...formData,
      startTime: new Date(`${formData.date}T${formData.time}`),
      endTime: new Date(new Date(`${formData.date}T${formData.time}`).getTime() + formData.duration * 60000),
      joiners: [],
      location: formData.appointmentType === 'door-knocking' ? formData.locationAddress : formData.location,
    }

    try {
      const consultantId = localStorage.getItem('consultant_id')
      const consultantToken = localStorage.getItem('consultant_token')
      
      const response = await fetch('/api/consultant/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': consultantId || '',
          'x-consultant-token': consultantToken || '',
        },
        body: JSON.stringify(appointmentData),
      })

      if (response.ok) {
        onClose()
        // Refresh calendar data
        window.location.reload()
      } else {
        alert('Failed to create appointment')
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      alert('An error occurred while creating the appointment')
    }
  }

  return (
    <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter appointment title"
        />
      </div>

      {/* Client Selection - Optional for door-knocking and meetings */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Client {formData.appointmentType !== 'door-knocking' && formData.appointmentType !== 'meeting' && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchClient}
            onChange={(e) => {
              setSearchClient(e.target.value)
              setShowClientDropdown(true)
            }}
            onFocus={() => setShowClientDropdown(true)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Search or select client..."
          />
          {showClientDropdown && filteredClients.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => handleClientSelect(client)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
                >
                  {client.type === 'personal' ? (
                    <User className="w-4 h-4 text-primary" />
                  ) : (
                    <Building2 className="w-4 h-4 text-teal" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{client.name}</div>
                    <div className="text-xs text-gray-500">{client.email}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {formData.clientName && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-gray-600">Selected:</span>
            <span className="text-sm font-medium text-gray-900">{formData.clientName}</span>
            <span className={`px-2 py-1 rounded text-xs ${
              formData.clientType === 'personal' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'
            }`}>
              {formData.clientType}
            </span>
          </div>
        )}
      </div>

      {/* Appointment Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <select
          value={formData.appointmentType}
          onChange={(e) => {
            const newType = e.target.value as AppointmentType
            setFormData({ 
              ...formData, 
              appointmentType: newType,
              // Auto-enable join for meetings and door-knocking
              isJoinable: newType === 'meeting' || newType === 'door-knocking',
              // Set location for door-knocking
              location: newType === 'door-knocking' ? 'door-knocking' : formData.location === 'door-knocking' ? 'office' : formData.location
            })
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="consultation">Consultation</option>
          <option value="follow-up">Follow-up</option>
          <option value="meeting">Meeting</option>
          <option value="door-knocking">Door Knocking</option>
          <option value="closing">Closing</option>
          <option value="internal">Internal</option>
        </select>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
        <select
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
          <option value="90">1.5 hours</option>
          <option value="120">2 hours</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        {formData.appointmentType === 'door-knocking' ? (
          <div className="space-y-3">
            <input
              type="text"
              value={formData.locationAddress}
              onChange={(e) => {
                const address = e.target.value
                setFormData({ 
                  ...formData, 
                  locationAddress: address,
                  // Auto-generate Google Maps link
                  googleMapsLink: address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', Singapore')}` : ''
                })
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter address in Singapore (e.g., 123 Orchard Road, Singapore 238891)"
            />
            {formData.googleMapsLink && (
              <div className="flex items-center gap-2">
                <a
                  href={formData.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark"
                >
                  <MapPin className="w-4 h-4" />
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: formData.title || 'Door Knocking Event',
                        text: `Join me for door knocking at ${formData.locationAddress}`,
                        url: formData.googleMapsLink || '',
                      })
                    } else {
                      navigator.clipboard.writeText(formData.googleMapsLink || '')
                      alert('Location link copied to clipboard!')
                    }
                  }}
                  className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                  Share Location
                </button>
              </div>
            )}
          </div>
        ) : (
          <select
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value as 'office' | 'online' | 'client-site' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="office">Office</option>
            <option value="online">Online</option>
            <option value="client-site">Client Site</option>
          </select>
        )}
      </div>

      {/* Join Event Toggle - for meetings and door-knocking */}
      {(formData.appointmentType === 'meeting' || formData.appointmentType === 'door-knocking') && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Allow others to join this event</label>
              <p className="text-xs text-gray-500">Team members can click &quot;Join Event&quot; to participate</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isJoinable: !formData.isJoinable })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.isJoinable ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.isJoinable ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      )}

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <div className="grid grid-cols-7 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setFormData({ ...formData, color: preset.name as ColorPreset })}
              className={`w-10 h-10 rounded-lg border-2 ${
                formData.color === preset.name ? 'border-gray-900 ring-2 ring-primary' : 'border-gray-300'
              }`}
              style={{ backgroundColor: preset.hex }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1 capitalize">{formData.color}</p>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder="Add notes about this appointment..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          <Plus className="w-4 h-4 mr-2" />
          Create Appointment
        </Button>
      </div>
    </div>
  )
}

// Enhanced Task Form Component
function EnhancedTaskForm({
  onClose,
  calendars,
  teamMembers,
  selectedDate,
  myColor,
}: {
  onClose: () => void
  calendars: Calendar[]
  teamMembers: TeamMember[]
  selectedDate: Date
  myColor: ColorPreset
}) {
  const [formData, setFormData] = useState({
    title: '',
    assigneeId: '',
    statusType: 'todo' as TaskStatusType,
    startDate: selectedDate.toISOString().split('T')[0],
    deadline: '',
    priority: 'medium' as TaskPriority,
    color: myColor as ColorPreset,
    calendarId: calendars[0]?.id || '',
    labels: [] as string[],
    category: '',
    channel: '',
    taskTypeTag: '',
    contributors: [] as string[],
    estimatedDuration: 30,
    notes: '',
  })

  const handleSubmit = async () => {
    if (!formData.title) {
      alert('Please enter a task title')
      return
    }

    const taskData = {
      ...formData,
      taskType: 'other' as TaskType,
      startTime: new Date(`${formData.startDate}T09:00`),
      endTime: new Date(new Date(`${formData.startDate}T09:00`).getTime() + formData.estimatedDuration * 60000),
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
    }

    try {
      const consultantId = localStorage.getItem('consultant_id')
      const consultantToken = localStorage.getItem('consultant_token')
      
      const response = await fetch('/api/consultant/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': consultantId || '',
          'x-consultant-token': consultantToken || '',
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        onClose()
        window.location.reload()
      } else {
        alert('Failed to create task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
      alert('An error occurred while creating the task')
    }
  }

  return (
    <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter task title"
        />
      </div>

      {/* Assignee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
        <select
          value={formData.assigneeId}
          onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Myself</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={formData.statusType}
          onChange={(e) => setFormData({ ...formData, statusType: e.target.value as TaskStatusType })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Calendar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Calendar</label>
        <select
          value={formData.calendarId}
          onChange={(e) => setFormData({ ...formData, calendarId: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {calendars.map((cal) => (
            <option key={cal.id} value={cal.id}>
              {cal.name}
            </option>
          ))}
        </select>
      </div>

      {/* Estimated Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (minutes)</label>
        <input
          type="number"
          value={formData.estimatedDuration}
          onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 30 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          min="1"
        />
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <div className="grid grid-cols-7 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setFormData({ ...formData, color: preset.name as ColorPreset })}
              className={`w-10 h-10 rounded-lg border-2 ${
                formData.color === preset.name ? 'border-gray-900 ring-2 ring-primary' : 'border-gray-300'
              }`}
              style={{ backgroundColor: preset.hex }}
            />
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder="Add notes about this task..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month')
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [myColor, setMyColor] = useState<ColorPreset>('blue')
  const [showDisplayOptions, setShowDisplayOptions] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null)
  const [calendarView, setCalendarView] = useState<'my' | 'team' | 'all'>('my')
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([])
  const [showDirectorCalendar, setShowDirectorCalendar] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'tasks' | 'appointments'>('all')
  const [visibleCalendars, setVisibleCalendars] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/consultant/login')
      return
    }

    loadCalendarData()
    loadMyColor()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const loadMyColor = () => {
    const savedColor = localStorage.getItem('consultant_calendar_color') || 'blue'
    setMyColor(savedColor as ColorPreset)
  }

  const loadCalendarData = async () => {
    try {
      const consultantId = localStorage.getItem('consultant_id')
      const consultantToken = localStorage.getItem('consultant_token')

      // Load tasks
      const tasksResponse = await fetch('/api/consultant/tasks', {
        headers: {
          'x-consultant-id': consultantId || '',
          'x-consultant-token': consultantToken || '',
        },
      })
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json()
        setTasks(tasksData.tasks || [])
      }

      // Load appointments
      const appointmentsResponse = await fetch('/api/consultant/appointments', {
        headers: {
          'x-consultant-id': consultantId || '',
          'x-consultant-token': consultantToken || '',
        },
      })
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json()
        setAppointments(appointmentsData.appointments || [])
      }

      // Combine tasks and appointments
      const allItems: CalendarItem[] = [
        ...(tasks || []),
        ...(appointments || []),
      ]
      setCalendarItems(allItems)

      // Load mock calendars
      setCalendars([
        { id: '1', name: 'Life', category: 'life', color: 'mint', isVisible: true, ownerId: consultantId || '' },
        { id: '2', name: 'Appointments', category: 'appointments', color: 'blue', isVisible: true, ownerId: consultantId || '' },
        { id: '3', name: 'Tasks', category: 'tasks', color: 'purple', isVisible: true, ownerId: consultantId || '' },
        { id: '4', name: 'Work', category: 'work', color: 'teal', isVisible: true, ownerId: consultantId || '' },
      ])

      // Load mock team members with birthdays
      const today = new Date()
      setTeamMembers([
        { id: '1', name: 'You', email: 'you@example.com', role: 'consultant', color: myColor },
        { 
          id: '2', 
          name: 'John Smith', 
          email: 'john@example.com', 
          role: 'consultant', 
          color: 'green',
          birthday: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5), // 5 days from today
          showBirthday: true,
        },
        { 
          id: '3', 
          name: 'Jane Doe', 
          email: 'jane@example.com', 
          role: 'consultant', 
          color: 'purple',
          birthday: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10), // 10 days from today
          showBirthday: true,
        },
        { id: '4', name: 'Ashley', email: 'ashley@example.com', role: 'director', color: 'orange' },
      ])

      // Initialize visible calendars
      setVisibleCalendars({
        '1': true,
        '2': true,
        '3': true,
        '4': true,
      })
    } catch (error) {
      console.error('Error loading calendar data:', error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const getDaysInWeek = (date: Date) => {
    const week: Date[] = []
    const dayOfWeek = date.getDay()
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - dayOfWeek)

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const getItemsForDate = (date: Date) => {
    const items = calendarItems.filter((item) => {
      const itemDate = new Date(item.startTime)
      return (
        itemDate.getDate() === date.getDate() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear()
      )
    })

    // Add birthdays for this date
    const birthdays = teamMembers
      .filter((member) => {
        if (!member.birthday || !member.showBirthday) return false
        const birthday = new Date(member.birthday)
        return (
          birthday.getDate() === date.getDate() &&
          birthday.getMonth() === date.getMonth()
        )
      })
      .map((member) => ({
        id: `birthday-${member.id}`,
        title: `${member.name}'s Birthday`,
        startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0),
        endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59),
        type: 'appointment' as const,
        appointmentType: 'internal' as AppointmentType,
        status: 'scheduled' as const,
        consultantId: member.id,
        consultantName: member.name,
        isMyItem: member.id === '1',
        clientId: '',
        clientName: '',
        clientType: 'personal' as const,
        location: '',
        duration: 1440,
        isBirthday: true,
      }))

    return [...items, ...birthdays]
  }

  const getFilteredItems = () => {
    let filtered = calendarItems

    // Filter by type
    if (filterType === 'tasks') {
      filtered = filtered.filter((item) => item.type === 'task')
    } else if (filterType === 'appointments') {
      filtered = filtered.filter((item) => item.type === 'appointment')
    }

    // Filter by calendar view
    if (calendarView === 'my') {
      filtered = filtered.filter((item) => item.isMyItem)
    } else if (calendarView === 'team') {
      filtered = filtered.filter((item) => item.isTeamItem || item.isMyItem)
    }

    // Filter by selected teammates
    if (selectedTeammates.length > 0) {
      filtered = filtered.filter((item) => {
        if (item.isMyItem) return true
        if (item.type === 'task' && item.assigneeId) {
          return selectedTeammates.includes(item.assigneeId)
        }
        if (item.type === 'appointment' && item.consultantId) {
          return selectedTeammates.includes(item.consultantId)
        }
        return false
      })
    }

    // Filter by director calendar
    if (!showDirectorCalendar) {
      filtered = filtered.filter((item) => !item.isDirectorItem)
    }

    return filtered
  }

  const getItemColor = (item: CalendarItem) => {
    if (item.color) {
      const preset = COLOR_PRESETS.find((p) => p.name === item.color)
      return preset?.hex || '#3B82F6'
    }
    if (item.isMyItem) return COLOR_PRESETS.find((p) => p.name === myColor)?.hex || '#3B82F6'
    if (item.isTeamItem) {
      const member = teamMembers.find((m) => m.id === (item as Task).assigneeId || (item as Appointment).consultantId)
      return member?.color ? COLOR_PRESETS.find((p) => p.name === member.color as ColorPreset)?.hex : '#10B981'
    }
    if (item.isDirectorItem) return '#F97316'
    return '#3B82F6'
  }

  const handleJoinEvent = async (appointmentId: string) => {
    try {
      const consultantId = localStorage.getItem('consultant_id')
      const consultantToken = localStorage.getItem('consultant_token')

      const response = await fetch('/api/consultant/appointments/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-consultant-id': consultantId || '',
          'x-consultant-token': consultantToken || '',
        },
        body: JSON.stringify({ appointmentId }),
      })

      if (response.ok) {
        alert('Successfully joined the event!')
        loadCalendarData()
      } else {
        alert('Failed to join event')
      }
    } catch (error) {
      console.error('Error joining event:', error)
      alert('An error occurred while joining the event')
    }
  }

  const previousPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else if (viewMode === 'week') {
      const newDate = new Date(currentDate)
      newDate.setDate(currentDate.getDate() - 7)
      setCurrentDate(newDate)
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(currentDate.getDate() - 1)
      setCurrentDate(newDate)
    }
  }

  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else if (viewMode === 'week') {
      const newDate = new Date(currentDate)
      newDate.setDate(currentDate.getDate() + 7)
      setCurrentDate(newDate)
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(currentDate.getDate() + 1)
      setCurrentDate(newDate)
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const filteredItems = getFilteredItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
                <p className="text-sm text-gray-600">Manage your tasks and appointments</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    viewMode === 'month' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    viewMode === 'week' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    viewMode === 'day' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Day
                </button>
              </div>

              {/* Filter Type */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'tasks' | 'appointments')}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Items</option>
                <option value="tasks">Tasks Only</option>
                <option value="appointments">Appointments Only</option>
              </select>

              {/* Calendar View */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCalendarView('my')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    calendarView === 'my' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  My
                </button>
                <button
                  onClick={() => setCalendarView('team')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    calendarView === 'team' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Team
                </button>
                <button
                  onClick={() => setCalendarView('all')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    calendarView === 'all' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  All
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => loadCalendarData()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddTaskModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddAppointmentModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Appointment
              </Button>

              <Link href="/consultant/dashboard/settings">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar View */}
          <div className="lg:col-span-3">
            {/* Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={previousPeriod}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextPeriod}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {viewMode === 'month'
                    ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : viewMode === 'week'
                    ? `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                    : currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
              </div>

              {/* Month View */}
              {viewMode === 'month' && (
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-700 py-2">
                      {day}
                    </div>
                  ))}
                  {getDaysInMonth(currentDate).map((day, index) => {
                    const dayItems = day ? getItemsForDate(day) : []
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
                              {dayItems.slice(0, 3).map((item) => {
                                const isBirthday = item.type === 'appointment' && (item as Appointment).isBirthday
                                return (
                                  <div
                                    key={item.id}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedItem(item)
                                    }}
                                    className={`text-xs p-1 rounded truncate cursor-pointer flex items-center gap-1 ${
                                      isBirthday ? 'bg-pink-100 border-pink-300' : ''
                                    }`}
                                    style={{
                                      backgroundColor: isBirthday ? undefined : `${getItemColor(item)}20`,
                                      borderColor: isBirthday ? undefined : getItemColor(item),
                                      borderWidth: '1px',
                                      color: isBirthday ? '#EC4899' : getItemColor(item),
                                    }}
                                  >
                                    {isBirthday && <BirthdayCake className="w-3 h-3 flex-shrink-0" />}
                                    {!isBirthday && new Date(item.startTime).toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                    })}{' '}
                                    {item.title}
                                  </div>
                                )
                              })}
                              {dayItems.length > 3 && (
                                <div className="text-xs text-gray-500">+{dayItems.length - 3} more</div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Week View */}
              {viewMode === 'week' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-8 gap-2">
                    <div className="text-sm font-medium text-gray-700 py-2">Time</div>
                    {getDaysInWeek(currentDate).map((day) => (
                      <div key={day.toDateString()} className="text-center text-sm font-medium text-gray-700 py-2">
                        <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-lg font-semibold">{day.getDate()}</div>
                      </div>
                    ))}
                  </div>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <div key={hour} className="grid grid-cols-8 gap-2">
                      <div className="text-xs text-gray-500 py-1">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                      {getDaysInWeek(currentDate).map((day) => {
                        const hourItems = filteredItems.filter((item) => {
                          const itemDate = new Date(item.startTime)
                          return (
                            itemDate.getDate() === day.getDate() &&
                            itemDate.getMonth() === day.getMonth() &&
                            itemDate.getFullYear() === day.getFullYear() &&
                            itemDate.getHours() === hour
                          )
                        })
                        return (
                          <div
                            key={day.toDateString()}
                            className="min-h-[60px] border border-gray-200 rounded p-1 bg-white"
                          >
                            {hourItems.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                className="text-xs p-1 rounded mb-1 cursor-pointer truncate"
                                style={{
                                  backgroundColor: `${getItemColor(item)}20`,
                                  borderColor: getItemColor(item),
                                  borderWidth: '1px',
                                  color: getItemColor(item),
                                }}
                              >
                                {item.title}
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* Day View - Very Long */}
              {viewMode === 'day' && (
                <div className="space-y-2 max-h-[800px] overflow-y-auto">
                  {Array.from({ length: 24 }, (_, i) => i + 11).map((hour) => {
                    if (hour >= 24) return null
                    const hourItems = filteredItems.filter((item) => {
                      const itemDate = new Date(item.startTime)
                      return (
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear() &&
                        itemDate.getHours() === hour
                      )
                    })
                    return (
                      <div key={hour} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-start gap-4">
                          <div className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                            {hour.toString().padStart(2, '0')}:00
                          </div>
                          <div className="flex-1 space-y-2">
                            {hourItems.length > 0 ? (
                              hourItems.map((item) => (
                                <div
                                  key={item.id}
                                  onClick={() => setSelectedItem(item)}
                                  className="p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                                  style={{
                                    backgroundColor: `${getItemColor(item)}10`,
                                    borderLeft: `4px solid ${getItemColor(item)}`,
                                  }}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                    <span className="text-xs text-gray-500">
                                      {new Date(item.startTime).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                      })}
                                      {' - '}
                                      {new Date(item.endTime).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                  {item.type === 'appointment' && (item as Appointment).clientName && (
                                    <p className="text-sm text-gray-600">
                                      Client: {(item as Appointment).clientName}
                                    </p>
                                  )}
                                  {item.type === 'appointment' && (item as Appointment).location && (
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {(item as Appointment).location}
                                    </p>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-400">No items scheduled</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">Calendars</h3>
              
              {/* My Calendars */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">MY CALENDARS</p>
                {calendars.map((cal) => (
                  <label key={cal.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleCalendars[cal.id] || false}
                      onChange={(e) =>
                        setVisibleCalendars({ ...visibleCalendars, [cal.id]: e.target.checked })
                      }
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: COLOR_PRESETS.find((p) => p.name === cal.color)?.hex }}
                    />
                    <span className="text-sm text-gray-700">{cal.name}</span>
                  </label>
                ))}
              </div>

              {/* Team Members */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">TEAM MEMBERS</p>
                {teamMembers
                  .filter((m) => m.role === 'consultant' && m.id !== '1')
                  .map((member) => (
                    <label key={member.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTeammates.includes(member.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTeammates([...selectedTeammates, member.id])
                            setCalendarView('team')
                          } else {
                            setSelectedTeammates(selectedTeammates.filter((t) => t !== member.id))
                          }
                        }}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLOR_PRESETS.find((p) => p.name === (member.color as ColorPreset))?.hex }}
                      />
                      <span className="text-sm text-gray-700">{member.name}</span>
                    </label>
                  ))}
              </div>

              {/* Directors */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">DIRECTORS</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDirectorCalendar}
                    onChange={(e) => setShowDirectorCalendar(e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Show Director Calendar</span>
                </label>
              </div>

              {/* Legend */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-2">LEGEND</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: COLOR_PRESETS.find((p) => p.name === myColor)?.hex }} />
                    <span className="text-xs text-gray-600">My Items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span className="text-xs text-gray-600">Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-orange-500" />
                    <span className="text-xs text-gray-600">Directors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Type</h3>
                <p className="text-sm text-gray-900 capitalize">{selectedItem.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Status</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedItem.status === 'confirmed' || selectedItem.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : selectedItem.status === 'scheduled' || selectedItem.status === 'pending'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {selectedItem.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Start Time</h3>
                <p className="text-sm text-gray-900">
                  {new Date(selectedItem.startTime).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">End Time</h3>
                <p className="text-sm text-gray-900">
                  {new Date(selectedItem.endTime).toLocaleString()}
                </p>
              </div>
            </div>

            {selectedItem.type === 'appointment' && (
              <>
                {(selectedItem as Appointment).clientName && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Client</h3>
                    <p className="text-sm text-gray-900">{(selectedItem as Appointment).clientName}</p>
                  </div>
                )}
                {(selectedItem as Appointment).location && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Location</h3>
                    <p className="text-sm text-gray-900">{(selectedItem as Appointment).location}</p>
                    {(selectedItem as Appointment).googleMapsLink && (
                      <a
                        href={(selectedItem as Appointment).googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary-dark flex items-center gap-1 mt-1"
                      >
                        <MapPin className="w-4 h-4" />
                        View on Google Maps
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
                {(selectedItem as Appointment).isJoinable && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">Joinable Event</span>
                      </div>
                      {(selectedItem as Appointment).joiners && (selectedItem as Appointment).joiners!.length > 0 && (
                        <span className="text-sm text-gray-600">
                          {(selectedItem as Appointment).joiners!.length} joined
                        </span>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleJoinEvent(selectedItem.id)}
                      className="w-full"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Join Event
                    </Button>
                  </div>
                )}
              </>
            )}

            {selectedItem.type === 'appointment' && (selectedItem as Appointment).isBirthday && (
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200 flex items-center gap-3">
                <BirthdayCake className="w-6 h-6 text-pink-600" />
                <div>
                  <p className="font-medium text-gray-900">Birthday Event</p>
                  <p className="text-sm text-gray-600">
                    {(selectedItem as Appointment).consultantName}&apos;s birthday
                  </p>
                </div>
              </div>
            )}

            {selectedItem.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Notes</h3>
                <div className="p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedItem.notes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        title="Add Task"
        size="lg"
      >
        <EnhancedTaskForm
          onClose={() => setShowAddTaskModal(false)}
          calendars={calendars}
          teamMembers={teamMembers}
          selectedDate={selectedDate}
          myColor={myColor}
        />
      </Modal>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={showAddAppointmentModal}
        onClose={() => setShowAddAppointmentModal(false)}
        title="Add Appointment"
        size="lg"
      >
        <EnhancedAppointmentForm
          onClose={() => setShowAddAppointmentModal(false)}
          selectedDate={selectedDate}
          myColor={myColor}
        />
      </Modal>
    </div>
  )
}
