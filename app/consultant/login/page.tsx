'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** Redirect /consultant/login to /crm - single login at /crm */
export default function ConsultantLoginRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/crm')
  }, [router])
  return null
}
