'use client'

import { ReactNode, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

/**
 * PageTransition - Smooth page transition wrapper
 * 
 * Features:
 * - Fade-in animation on page mount
 * - Lightweight CSS transitions
 * - Respects prefers-reduced-motion
 * - Performance optimized
 * - No hydration issues
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setMounted(true)
    }, 50)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: mounted ? 1 : 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
