'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Preloader from './Preloader'

interface PreloaderWrapperProps {
  children: React.ReactNode
}

export default function PreloaderWrapper({ children }: PreloaderWrapperProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const handlePreloaderComplete = () => {
    setIsLoading(false)
    if (typeof window !== 'undefined') {
      document.body.style.overflow = ''
    }
  }

  useEffect(() => {
    // CRITICAL: Always ensure body is visible immediately
    if (typeof window !== 'undefined') {
      try {
        document.body.style.opacity = '1'
        document.body.style.visibility = 'visible'
        document.body.style.backgroundColor = 'white'
        document.body.style.overflow = ''
      } catch (e) {
        console.error('Error setting body visibility:', e)
      }
    }
    
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only show preloader on home page after mount
    if (!isMounted || typeof window === 'undefined') return
    
    const currentPath = pathname || window.location.pathname
    const isHomePage = currentPath === '/' || currentPath === ''
    
    if (isHomePage) {
      setIsLoading(true)
      document.body.style.overflow = 'hidden'
      
      // Safety timeout: ensure content shows after max 3 seconds
      const safetyTimeout = setTimeout(() => {
        handlePreloaderComplete()
      }, 3000)
      
      return () => clearTimeout(safetyTimeout)
    } else {
      setIsLoading(false)
      document.body.style.overflow = ''
    }
  }, [pathname, isMounted])

  // CRITICAL: Always render children immediately - never block them
  return (
    <>
      {/* Always render children immediately - this prevents white screen */}
      {children}
      
      {/* Preloader overlay only when loading on home page */}
      {isLoading && isMounted && pathname === '/' && (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
          <Preloader onComplete={handlePreloaderComplete} />
        </div>
      )}
    </>
  )
}
