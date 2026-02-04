'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar as CalendarIcon, ChevronRight, MapPin, Video } from 'lucide-react'
import { format } from 'date-fns'
import type { Appointment } from '@/types'

const MAX_VISIBLE = 5

interface UpcomingAppointmentsWidgetProps {
  consultantId: string | null
  consultantDbId?: string | null
}

export default function UpcomingAppointmentsWidget({
  consultantId,
  consultantDbId,
}: UpcomingAppointmentsWidgetProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const effectiveId = consultantDbId || consultantId

  useEffect(() => {
    if (!effectiveId) {
      setIsLoading(false)
      return
    }

    const load = async () => {
      try {
        const res = await fetch('/api/consultant/appointments', {
          headers: { 'x-consultant-id': effectiveId },
        })
        if (res.ok) {
          const data = await res.json()
          const list = (data.appointments || []).map((a: any) => ({
            ...a,
            startTime: a.startTime ? new Date(a.startTime) : new Date(),
            endTime: a.endTime ? new Date(a.endTime) : new Date(),
          }))
          const now = new Date()
          const upcoming = list
            .filter((a: Appointment) => new Date(a.startTime) >= now && a.status !== 'cancelled')
            .sort((a: Appointment, b: Appointment) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            )
          setAppointments(upcoming.slice(0, MAX_VISIBLE))
        }
      } catch (e) {
        console.error('Failed to load appointments:', e)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [effectiveId])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
              <p className="text-xs text-gray-500">{appointments.length} scheduled</p>
            </div>
          </div>
          <Link
            href="/consultant/calendar"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark min-h-[44px] min-w-[44px] items-center justify-end"
          >
            Calendar
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-8 text-center">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No upcoming appointments</p>
            <Link
              href="/consultant/calendar"
              className="inline-block mt-2 text-sm font-medium text-primary hover:text-primary-dark"
            >
              Schedule one
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => {
              const start = new Date(apt.startTime)
              const isOnline = apt.location === 'online'
              return (
                <Link
                  key={apt.id}
                  href="/consultant/calendar"
                  className="block p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors min-h-[44px]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{apt.title}</p>
                      {apt.clientName && (
                        <p className="text-xs text-gray-600 truncate">{apt.clientName}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-xs font-medium text-primary">
                          {format(start, 'h:mm a')}
                        </span>
                        {apt.duration && (
                          <span className="text-xs text-gray-500">{apt.duration} min</span>
                        )}
                        {isOnline ? (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <Video className="w-3 h-3" />
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {apt.location || 'Office'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
