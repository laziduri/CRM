'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Preloader from './Preloader'

interface PreloaderWrapperProps {
  children: React.ReactNode
}

export default function PreloaderWrapper({ children }: PreloaderWrapperProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false)
    if (typeof window !== 'undefined') {
      try {
        document.body.style.overflow = ''
      } catch (e) {
        // Ignore errors
      }
    }
  }, [])

  useEffect(() => {
    // CRITICAL: Always ensure body and content are visible immediately
    if (typeof window !== 'undefined') {
      try {
        // Remove ALL blocking styles immediately
        document.body.style.opacity = '1'
        document.body.style.visibility = 'visible'
        document.body.style.overflow = ''
        document.body.style.display = 'block'
        document.body.style.backgroundColor = ''
        
        // Force html to be visible
        document.documentElement.style.opacity = '1'
        document.documentElement.style.visibility = 'visible'
        
        // Ensure all main elements are visible
        const main = document.querySelector('main') as HTMLElement | null
        if (main) {
          main.style.opacity = '1'
          main.style.visibility = 'visible'
          main.style.display = 'block'
        }
      } catch (e) {
        console.error('Error setting visibility:', e)
      }
    }
    
    setIsMounted(true)
    // NEVER block content - always set loading to false
    setIsLoading(false)
  }, [])

  // DISABLED PRELOADER TEMPORARILY - Always show content immediately
  // useEffect(() => {
  //   // Skip preloader completely for now to debug white screen
  //   setIsLoading(false)
  // }, [pathname, isMounted])

  // ALWAYS render children - never hide them
  return (
    <>
      {children}
    </>
  )
}
