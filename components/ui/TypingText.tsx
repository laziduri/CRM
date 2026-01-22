'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TypingTextProps {
  text: string
  speed?: number // milliseconds per character
  delay?: number // delay before starting (ms)
  className?: string
  onComplete?: () => void
}

export function TypingText({ 
  text, 
  speed = 40, 
  delay = 0,
  className,
  onComplete 
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (text.length === 0) return

    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) {
      // Show full text immediately if reduced motion is preferred
      setDisplayedText(text)
      setIsComplete(true)
      onComplete?.()
      return
    }

    let currentIndex = 0
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(intervalId)
          setIsComplete(true)
          onComplete?.()
        }
      }, speed)

      return () => clearInterval(intervalId)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [text, speed, delay, onComplete])

  return (
    <span className={cn(className)}>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  )
}
