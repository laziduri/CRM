'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ParticleBackgroundProps {
  className?: string
  particleCount?: number
  intensity?: 'subtle' | 'moderate' | 'strong'
}

interface Particle {
  id: number
  size: number
  left: number
  top: number
  delay: number
  duration: number
  color: 'bg-navy' | 'bg-teal'
}

/**
 * ParticleBackground - Lightweight CSS-only particle effect
 * 
 * Features:
 * - CSS-only animations (no JavaScript animation)
 * - Very subtle, low opacity
 * - Navy/teal color scheme
 * - Slow, gentle movement
 * - Performance optimized
 * - Only for hero sections
 * - Client-side only generation to prevent hydration mismatches
 */
export function ParticleBackground({
  className,
  particleCount = 12,
  intensity = 'subtle',
}: ParticleBackgroundProps) {
  const opacityMap = {
    subtle: 'opacity-20',
    moderate: 'opacity-30',
    strong: 'opacity-40',
  }

  const [particles, setParticles] = useState<Particle[]>([])
  const [mounted, setMounted] = useState(false)

  // Generate particles only on client-side to prevent hydration mismatches
  useEffect(() => {
    setMounted(true)
    const generated: Particle[] = Array.from({ length: particleCount }, (_, i) => {
      const size = Math.random() * 4 + 2 // 2-6px
      const left = Math.random() * 100 // 0-100%
      const top = Math.random() * 100 // 0-100%
      const delay = Math.random() * 8 // 0-8s
      const duration = 8 + Math.random() * 4 // 8-12s
      const color = Math.random() > 0.5 ? 'bg-navy' : 'bg-teal'

      return {
        id: i,
        size,
        left,
        top,
        delay,
        duration,
        color,
      }
    })
    setParticles(generated)
  }, [particleCount])

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn(
            'absolute rounded-full',
            particle.color,
            opacityMap[intensity],
            'animate-particle-float'
          )}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
