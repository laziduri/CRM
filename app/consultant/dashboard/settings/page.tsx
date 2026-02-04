'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Lock, Camera, Save, AlertCircle, CheckCircle2, Mail, Calendar as CalendarIcon, Link2, Bell, ExternalLink, RefreshCw, Cake, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

export default function ConsultantSettingsPage() {
  const router = useRouter()
  const [consultant, setConsultant] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Form states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)

  // Email notification settings
  const [remindOneDayBefore, setRemindOneDayBefore] = useState(true)
  const [remindTwoHoursBefore, setRemindTwoHoursBefore] = useState(true)

  // Calendar integrations
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false)
  const [isOutlookCalendarConnected, setIsOutlookCalendarConnected] = useState(false)
  const [isConnectingCalendar, setIsConnectingCalendar] = useState(false)
  const [connectingCalendarType, setConnectingCalendarType] = useState<'google' | 'outlook' | null>(null)
  
  // Calendar color
  const [calendarColor, setCalendarColor] = useState<string>('blue')
  const [isSavingColor, setIsSavingColor] = useState(false)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  
  // Birthday visibility
  const [showBirthday, setShowBirthday] = useState<boolean>(true)
  const [isSavingBirthday, setIsSavingBirthday] = useState(false)
  
  const COLOR_PRESETS = [
    { name: 'mint', hex: '#10B981' },
    { name: 'blue', hex: '#3B82F6' },
    { name: 'purple', hex: '#8B5CF6' },
    { name: 'pink', hex: '#EC4899' },
    { name: 'red', hex: '#EF4444' },
    { name: 'orange', hex: '#F97316' },
    { name: 'yellow', hex: '#EAB308' },
    { name: 'green', hex: '#22C55E' },
    { name: 'teal', hex: '#14B8A6' },
    { name: 'cyan', hex: '#06B6D4' },
    { name: 'indigo', hex: '#6366F1' },
    { name: 'violet', hex: '#A855F7' },
    { name: 'rose', hex: '#F43F5E' },
    { name: 'amber', hex: '#F59E0B' },
  ]

  useEffect(() => {
    const loadSettings = async () => {
      const token = localStorage.getItem('consultant_token')
      const consultantId = localStorage.getItem('consultant_id')

      if (!token || !consultantId) {
        // Only redirect if not already on login page
        if (typeof window !== 'undefined' && window.location.pathname !== '/crm') {
          router.push('/crm')
        }
        setIsLoading(false)
        return
      }

      // Fetch actual consultant from API
      const consultantRes = await fetch(`/api/consultant/${consultantId}`)
      if (consultantRes.ok) {
        const data = await consultantRes.json()
        setConsultant({
          id: data.consultant.id,
          consultantId: data.consultant.consultantId,
          username: data.consultant.username,
          name: data.consultant.name,
          email: data.consultant.email,
          phone: data.consultant.phone || '',
          profilePicture: data.consultant.profilePicture || '',
        })
      } else {
        setConsultant(null)
      }
      
      // Load saved notification preferences (mock)
      setRemindOneDayBefore(true)
      setRemindTwoHoursBefore(true)
      
      // Check calendar connection status (mock - in production, fetch from API)
      setIsGoogleCalendarConnected(false)
      setIsOutlookCalendarConnected(false)
      
      // Load calendar color
      const savedColor = localStorage.getItem('consultant_calendar_color') || 'blue'
      setCalendarColor(savedColor)
      
      // Load birthday visibility (mock - in production, fetch from API)
      const savedShowBirthday = localStorage.getItem('consultant_show_birthday')
      setShowBirthday(savedShowBirthday !== null ? savedShowBirthday === 'true' : true)
      
      // Load team members to get their colors (mock - in production, fetch from API)
      const mockTeamMembers = [
        { id: '1', name: 'You', email: 'you@example.com', role: 'consultant', color: savedColor },
        { id: '2', name: 'John Smith', email: 'john@example.com', role: 'consultant', color: 'green' },
        { id: '3', name: 'Jane Doe', email: 'jane@example.com', role: 'consultant', color: 'purple' },
        { id: '4', name: 'Ashley', email: 'ashley@example.com', role: 'director', color: 'orange' },
      ]
      setTeamMembers(mockTeamMembers)
      
      setIsLoading(false)
    }
    loadSettings()
  }, [router])

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      setProfilePictureFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setIsSaving(true)

    try {
      // In production, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate success
      setSuccess('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update password. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleProfilePictureUpdate = async () => {
    if (!profilePictureFile) {
      setError('Please select an image file')
      return
    }

    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      // In production, this would upload to a server
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate success
      setSuccess('Profile picture updated successfully!')
      setProfilePictureFile(null)
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update profile picture. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleNotificationSettingsSave = async () => {
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      // In production, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSuccess('Notification settings updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update notification settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleGoogleCalendarConnect = async () => {
    setIsConnectingCalendar(true)
    setConnectingCalendarType('google')
    setError('')
    
    try {
      const consultantId = localStorage.getItem('consultant_id')
      if (!consultantId) {
        setError('Please log in to connect calendars')
        return
      }

      const response = await fetch('/api/consultant/calendar/google/connect', {
        method: 'GET',
        headers: {
          'x-consultant-id': consultantId,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to connect Google Calendar. Please try again.')
        return
      }

      // In production, redirect to OAuth URL
      // For now, simulate successful connection
      if (data.authUrl) {
        // In production: window.location.href = data.authUrl
        // For demo, simulate connection
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsGoogleCalendarConnected(true)
        setSuccess('Google Calendar connected successfully! Appointments will now sync automatically.')
        setTimeout(() => setSuccess(''), 5000)
      }
    } catch (err) {
      setError('Failed to connect Google Calendar. Please try again.')
    } finally {
      setIsConnectingCalendar(false)
      setConnectingCalendarType(null)
    }
  }

  const handleGoogleCalendarDisconnect = async () => {
    setIsConnectingCalendar(true)
    setConnectingCalendarType('google')
    setError('')
    
    try {
      const consultantId = localStorage.getItem('consultant_id')
      if (!consultantId) {
        setError('Please log in to disconnect calendars')
        return
      }

      const response = await fetch('/api/consultant/calendar/google/disconnect', {
        method: 'POST',
        headers: {
          'x-consultant-id': consultantId,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to disconnect Google Calendar. Please try again.')
        return
      }

      setIsGoogleCalendarConnected(false)
      setSuccess('Google Calendar disconnected successfully.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to disconnect Google Calendar. Please try again.')
    } finally {
      setIsConnectingCalendar(false)
      setConnectingCalendarType(null)
    }
  }

  const handleOutlookCalendarConnect = async () => {
    setIsConnectingCalendar(true)
    setConnectingCalendarType('outlook')
    setError('')
    
    try {
      const consultantId = localStorage.getItem('consultant_id')
      if (!consultantId) {
        setError('Please log in to connect calendars')
        return
      }

      const response = await fetch('/api/consultant/calendar/outlook/connect', {
        method: 'GET',
        headers: {
          'x-consultant-id': consultantId,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to connect Outlook Calendar. Please try again.')
        return
      }

      // In production, redirect to OAuth URL
      // For now, simulate successful connection
      if (data.authUrl) {
        // In production: window.location.href = data.authUrl
        // For demo, simulate connection
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsOutlookCalendarConnected(true)
        setSuccess('Outlook Calendar connected successfully! Appointments will now sync automatically.')
        setTimeout(() => setSuccess(''), 5000)
      }
    } catch (err) {
      setError('Failed to connect Outlook Calendar. Please try again.')
    } finally {
      setIsConnectingCalendar(false)
      setConnectingCalendarType(null)
    }
  }

  const handleOutlookCalendarDisconnect = async () => {
    setIsConnectingCalendar(true)
    setConnectingCalendarType('outlook')
    setError('')
    
    try {
      const consultantId = localStorage.getItem('consultant_id')
      if (!consultantId) {
        setError('Please log in to disconnect calendars')
        return
      }

      const response = await fetch('/api/consultant/calendar/outlook/disconnect', {
        method: 'POST',
        headers: {
          'x-consultant-id': consultantId,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to disconnect Outlook Calendar. Please try again.')
        return
      }

      setIsOutlookCalendarConnected(false)
      setSuccess('Outlook Calendar disconnected successfully.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to disconnect Outlook Calendar. Please try again.')
    } finally {
      setIsConnectingCalendar(false)
      setConnectingCalendarType(null)
    }
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/consultant/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Picture Section */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Picture</h2>
                <p className="text-sm text-gray-600">Update your profile picture (max 5MB)</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative">
                {profilePicture || consultant?.profilePicture ? (
                  <img
                    src={profilePicture || consultant?.profilePicture}
                    alt={consultant?.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-gray-200">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="block mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 border-2 border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-teal hover:text-white focus:ring-primary transition-all rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
                      fileInput?.click()
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Choose Image
                  </button>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG or GIF. Max size 5MB
                </p>
                {profilePictureFile && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-3"
                    onClick={handleProfilePictureUpdate}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Uploading...' : 'Update Picture'}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Password Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Change Password</h2>
            <p className="text-sm text-gray-600 mb-6">Update your password to keep your account secure</p>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    'Updating...'
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Email Notification Settings */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Appointment Email Reminders</h2>
                <p className="text-sm text-gray-600">
                  Receive automatic email reminders for your appointments
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Email Address Display */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <label className="block text-sm font-medium text-gray-700">
                    Reminders will be sent to:
                  </label>
                </div>
                <a 
                  href={`mailto:${consultant?.email}`}
                  className="text-primary hover:text-primary-dark font-medium text-sm"
                >
                  {consultant?.email}
                </a>
                <p className="text-xs text-gray-500 mt-1">
                  Update your email in Account Information if needed
                </p>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5">
                    <input
                      id="remind-one-day"
                      type="checkbox"
                      checked={remindOneDayBefore}
                      onChange={(e) => setRemindOneDayBefore(e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="remind-one-day" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Remind 1 day before appointment
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      You&apos;ll receive an email reminder 24 hours before each appointment
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5">
                    <input
                      id="remind-two-hours"
                      type="checkbox"
                      checked={remindTwoHoursBefore}
                      onChange={(e) => setRemindTwoHoursBefore(e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="remind-two-hours" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Remind 2 hours before appointment
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      You&apos;ll receive an email reminder 2 hours before each appointment
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  onClick={handleNotificationSettingsSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Notification Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Google Calendar Integration */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Google Calendar Integration</h2>
                <p className="text-sm text-gray-600">
                  Sync your appointments with Google Calendar automatically
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Connection Status */}
              <div className={`p-4 rounded-lg border ${
                isGoogleCalendarConnected 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isGoogleCalendarConnected 
                        ? 'bg-green-100' 
                        : 'bg-gray-200'
                    }`}>
                      <CalendarIcon className={`w-5 h-5 ${
                        isGoogleCalendarConnected 
                          ? 'text-green-600' 
                          : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {isGoogleCalendarConnected 
                          ? 'Connected to Google Calendar' 
                          : 'Not connected to Google Calendar'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {isGoogleCalendarConnected 
                          ? 'Your appointments will automatically sync to Google Calendar' 
                          : 'Connect to automatically add appointments to your Google Calendar'}
                      </p>
                    </div>
                  </div>
                  {isGoogleCalendarConnected && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>

              {/* Connection Info */}
              {isGoogleCalendarConnected && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Automatic Sync Enabled
                      </p>
                      <p className="text-xs text-blue-700">
                        When you add, update, or cancel an appointment in the system, it will automatically be reflected in your Google Calendar.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Connect/Disconnect Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                {isGoogleCalendarConnected && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={async () => {
                      // Manual sync button
                      const consultantId = localStorage.getItem('consultant_id')
                      if (consultantId) {
                        try {
                          const response = await fetch('/api/consultant/calendar/google/sync', {
                            method: 'POST',
                            headers: {
                              'x-consultant-id': consultantId,
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ appointments: [] }),
                          })
                          if (response.ok) {
                            setSuccess('Appointments synced to Google Calendar')
                            setTimeout(() => setSuccess(''), 3000)
                          }
                        } catch (err) {
                          setError('Failed to sync appointments')
                        }
                      }
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
                  </Button>
                )}
                {isGoogleCalendarConnected ? (
                  <Button
                    variant="outline"
                    onClick={handleGoogleCalendarDisconnect}
                    disabled={isConnectingCalendar && connectingCalendarType === 'google'}
                  >
                    {isConnectingCalendar && connectingCalendarType === 'google' ? (
                      'Disconnecting...'
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 mr-2" />
                        Disconnect
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleGoogleCalendarConnect}
                    disabled={isConnectingCalendar && connectingCalendarType === 'google'}
                  >
                    {isConnectingCalendar && connectingCalendarType === 'google' ? (
                      'Connecting...'
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Connect Google Calendar
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Outlook Calendar Integration */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Outlook Calendar Integration</h2>
                <p className="text-sm text-gray-600">
                  Sync your appointments with Outlook Calendar automatically
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Connection Status */}
              <div className={`p-4 rounded-lg border ${
                isOutlookCalendarConnected 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isOutlookCalendarConnected 
                        ? 'bg-green-100' 
                        : 'bg-gray-200'
                    }`}>
                      <CalendarIcon className={`w-5 h-5 ${
                        isOutlookCalendarConnected 
                          ? 'text-green-600' 
                          : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {isOutlookCalendarConnected 
                          ? 'Connected to Outlook Calendar' 
                          : 'Not connected to Outlook Calendar'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {isOutlookCalendarConnected 
                          ? 'Your appointments will automatically sync to Outlook Calendar' 
                          : 'Connect to automatically add appointments to your Outlook Calendar'}
                      </p>
                    </div>
                  </div>
                  {isOutlookCalendarConnected && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>

              {/* Connection Info */}
              {isOutlookCalendarConnected && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Automatic Sync Enabled
                      </p>
                      <p className="text-xs text-blue-700">
                        When you add, update, or cancel an appointment in the system, it will automatically be reflected in your Outlook Calendar.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Connect/Disconnect Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                {isOutlookCalendarConnected && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={async () => {
                      // Manual sync button
                      const consultantId = localStorage.getItem('consultant_id')
                      if (consultantId) {
                        try {
                          const response = await fetch('/api/consultant/calendar/outlook/sync', {
                            method: 'POST',
                            headers: {
                              'x-consultant-id': consultantId,
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ appointments: [] }),
                          })
                          if (response.ok) {
                            setSuccess('Appointments synced to Outlook Calendar')
                            setTimeout(() => setSuccess(''), 3000)
                          }
                        } catch (err) {
                          setError('Failed to sync appointments')
                        }
                      }
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
                  </Button>
                )}
                {isOutlookCalendarConnected ? (
                  <Button
                    variant="outline"
                    onClick={handleOutlookCalendarDisconnect}
                    disabled={isConnectingCalendar && connectingCalendarType === 'outlook'}
                  >
                    {isConnectingCalendar && connectingCalendarType === 'outlook' ? (
                      'Disconnecting...'
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 mr-2" />
                        Disconnect
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleOutlookCalendarConnect}
                    disabled={isConnectingCalendar && connectingCalendarType === 'outlook'}
                  >
                    {isConnectingCalendar && connectingCalendarType === 'outlook' ? (
                      'Connecting...'
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Connect Outlook Calendar
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Calendar Color Settings */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Calendar Color</h2>
                <p className="text-sm text-gray-600">
                  Choose your personal color for calendar items. This helps distinguish your appointments and tasks from teammates.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Teammate Colors - Read Only */}
              {teamMembers.filter(m => m.id !== '1' && m.color).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Teammate Colors (Protected)</label>
                  <p className="text-xs text-gray-500 mb-3">These colors are reserved for your teammates and cannot be changed or selected.</p>
                  <div className="grid grid-cols-7 gap-3">
                    {COLOR_PRESETS.map((preset) => {
                      const teammateUsing = teamMembers.find(m => m.id !== '1' && m.color === preset.name)
                      const isReserved = !!teammateUsing
                      
                      return (
                        <div key={preset.name} className="relative">
                          <div
                            className={`w-12 h-12 rounded-lg border-2 transition-all ${
                              isReserved
                                ? 'border-gray-400 bg-gray-100 cursor-not-allowed opacity-60'
                                : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: preset.hex }}
                            title={isReserved ? `${preset.name} - Reserved for ${teammateUsing?.name}` : preset.name}
                          >
                            {isReserved && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center">
                                  <span className="text-xs font-bold text-gray-600">🔒</span>
                                </div>
                              </div>
                            )}
                          </div>
                          {isReserved && (
                            <p className="text-xs text-gray-500 mt-1 text-center truncate">{teammateUsing?.name}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Personal Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Personal Color</label>
                <p className="text-xs text-gray-500 mb-3">Choose a color for your calendar items. Teammate colors are not available for selection.</p>
                <div className="grid grid-cols-7 gap-3">
                  {COLOR_PRESETS.map((preset) => {
                    const teammateUsing = teamMembers.find(m => m.id !== '1' && m.color === preset.name)
                    const isReserved = !!teammateUsing
                    const isSelected = calendarColor === preset.name
                    
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          if (!isReserved) {
                            setCalendarColor(preset.name)
                          }
                        }}
                        disabled={isReserved}
                        className={`w-12 h-12 rounded-lg border-2 transition-all relative ${
                          isReserved
                            ? 'border-gray-400 bg-gray-100 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'border-gray-900 ring-2 ring-primary scale-110'
                            : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                        }`}
                        style={{ backgroundColor: preset.hex }}
                        title={
                          isReserved
                            ? `${preset.name} - Reserved for ${teammateUsing?.name}`
                            : preset.name
                        }
                      >
                        {isReserved && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-600">🔒</span>
                            </div>
                          </div>
                        )}
                        {isSelected && !isReserved && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2 capitalize">Selected: {calendarColor}</p>
                {COLOR_PRESETS.filter(p => teamMembers.find(m => m.id !== '1' && m.color === p.name)).length > 0 && (
                  <p className="text-xs text-amber-600 mt-2">
                    ⚠️ Some colors are reserved for your teammates and cannot be selected.
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  onClick={async () => {
                    setIsSavingColor(true)
                    setError('')
                    
                    // Validate that selected color is not a teammate color
                    const teammateUsing = teamMembers.find(m => m.id !== '1' && m.color === calendarColor)
                    if (teammateUsing) {
                      setError(`This color is reserved for ${teammateUsing.name}. Please select a different color.`)
                      setIsSavingColor(false)
                      return
                    }
                    
                    try {
                      const consultantId = localStorage.getItem('consultant_id')
                      if (!consultantId) {
                        setError('Please log in to save color preference')
                        return
                      }

                      const response = await fetch('/api/consultant/calendar/color', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'x-consultant-id': consultantId,
                        },
                        body: JSON.stringify({ color: calendarColor }),
                      })

                      const data = await response.json()

                      if (!response.ok) {
                        setError(data.error || 'Failed to save color preference')
                        return
                      }

                      // Save to localStorage
                      localStorage.setItem('consultant_calendar_color', calendarColor)
                      setSuccess('Calendar color updated successfully!')
                      setTimeout(() => setSuccess(''), 3000)
                    } catch (err) {
                      setError('Failed to save color preference. Please try again.')
                    } finally {
                      setIsSavingColor(false)
                    }
                  }}
                  disabled={isSavingColor}
                >
                  {isSavingColor ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Color
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Birthday Visibility Settings */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Cake className="w-5 h-5 text-primary" />
                  Birthday Visibility
                </h2>
                <p className="text-sm text-gray-600">
                  Control whether your birthday is visible to teammates in the calendar.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  {showBirthday ? (
                    <Eye className="w-5 h-5 text-green-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Show Birthday in Calendar
                    </label>
                    <p className="text-xs text-gray-500">
                      {showBirthday 
                        ? 'Your birthday will be visible to teammates' 
                        : 'Your birthday will be hidden from teammates'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBirthday(!showBirthday)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showBirthday ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showBirthday ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  onClick={async () => {
                    setIsSavingBirthday(true)
                    setError('')
                    try {
                      const consultantId = localStorage.getItem('consultant_id')
                      if (!consultantId) {
                        setError('Please log in to save birthday preference')
                        return
                      }

                      const response = await fetch('/api/consultant/birthday/visibility', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'x-consultant-id': consultantId,
                        },
                        body: JSON.stringify({ showBirthday }),
                      })

                      const data = await response.json()

                      if (!response.ok) {
                        setError(data.error || 'Failed to save birthday preference')
                        return
                      }

                      // Save to localStorage
                      localStorage.setItem('consultant_show_birthday', String(showBirthday))
                      setSuccess('Birthday visibility updated successfully!')
                      setTimeout(() => setSuccess(''), 3000)
                    } catch (err) {
                      setError('Failed to save birthday preference. Please try again.')
                    } finally {
                      setIsSavingBirthday(false)
                    }
                  }}
                  disabled={isSavingBirthday}
                >
                  {isSavingBirthday ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Preference
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Account Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Information</h2>
            <p className="text-sm text-gray-600 mb-6">Your account details</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultant ID</label>
                <p className="text-gray-900">{consultant?.consultantId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{consultant?.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{consultant?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900">{consultant?.phone}</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}