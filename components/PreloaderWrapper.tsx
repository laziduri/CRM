'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Preloader from './Preloader'

const PRELOADER_DONE_KEY = 'preloader_done'

interface PreloaderWrapperProps {
  children: React.ReactNode
}

export default function PreloaderWrapper({ children }: PreloaderWrapperProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const handlePreloaderComplete = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(PRELOADER_DONE_KEY, '1')
        document.body.style.overflow = ''
      } catch (e) {
        // Ignore errors
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        document.body.style.opacity = '1'
        document.body.style.visibility = 'visible'
        document.body.style.overflow = ''
        document.body.style.display = 'block'
        document.body.style.backgroundColor = ''
        document.documentElement.style.opacity = '1'
        document.documentElement.style.visibility = 'visible'
      } catch (e) {
        console.error('Error setting visibility:', e)
      }
    }
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return
    const isHome = pathname === '/'
    const hasSeenPreloader = sessionStorage.getItem(PRELOADER_DONE_KEY)
    if (isHome && !hasSeenPreloader) {
      setIsLoading(true)
      try {
        document.body.style.overflow = 'hidden'
      } catch (e) {
        // Ignore
      }
    } else {
      setIsLoading(false)
    }
  }, [pathname, isMounted])

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      <div
        className={`transition-opacity duration-300 ease-out ${
          isLoading ? 'opacity-0 pointer-events-none invisible' : 'opacity-100'
        }`}
        aria-hidden={isLoading}
      >
        {children}
      </div>
    </>
  )
}
