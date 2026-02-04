'use client'

import { useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ConsultantLoginForm } from '@/components/auth/ConsultantLoginForm'

export default function CRMPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('consultant_token')
    const consultantId = localStorage.getItem('consultant_id')
    if (!token || !consultantId) return

    let cancelled = false
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 5000)

    fetch(`/api/consultant/${consultantId}`, { signal: controller.signal })
      .then((res) => {
        clearTimeout(t)
        if (cancelled) return
        if (res.ok) router.replace('/consultant/dashboard')
        else {
          localStorage.removeItem('consultant_token')
          localStorage.removeItem('consultant_id')
        }
      })
      .catch(() => {
        clearTimeout(t)
        if (!cancelled) {
          try {
            localStorage.removeItem('consultant_token')
            localStorage.removeItem('consultant_id')
          } catch (_) {}
        }
      })

    return () => {
      cancelled = true
      clearTimeout(t)
      controller.abort()
    }
  }, [router])

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    }>
      <ConsultantLoginForm />
    </Suspense>
  )
}
