'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** Redirect /crm/login to /crm - single login at /crm */
export default function LoginRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/crm')
  }, [router])
  return null
}
