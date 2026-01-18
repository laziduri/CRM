'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { getThemeForPath, type BackgroundTheme } from '@/lib/backgroundThemes'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  animationDelay: number
  duration: number
  twinkleDuration: number
}

export default function DynamicBackground() {
  const pathname = usePathname()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  const theme = useMemo(() => getThemeForPath(pathname || '/'), [pathname])

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Generate particles based on theme
  useEffect(() => {
    const generateParticles = (): Particle[] => {
      const newParticles: Particle[] = []
      const { density, sizeRange, opacityRange } = theme.particles

      for (let i = 0; i < density; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // Percentage
          y: Math.random() * 100, // Percentage
          size: sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min),
          opacity: opacityRange.min + Math.random() * (opacityRange.max - opacityRange.min),
          animationDelay: Math.random() * 4, // 0-4 seconds
          duration: 15 + Math.random() * 10, // 15-25 seconds
          twinkleDuration: 3 + Math.random() * 2, // 3-5 seconds
        })
      }

      return newParticles
    }

    setParticles(generateParticles())
  }, [theme])

  // Hide background on CRM pages (they have their own styling) - check AFTER all hooks
  if (pathname?.startsWith('/crm')) {
    return null
  }

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{ backgroundColor: theme.baseColor }}
    >
      {/* Radial gradient glows */}
      <div className="absolute inset-0">
        {theme.glows.map((glow, index) => (
          <div
            key={index}
            className="absolute rounded-full blur-3xl"
            style={{
              left: glow.position.x,
              top: glow.position.y,
              width: glow.size,
              height: glow.size,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${glow.color} 0%, transparent 70%)`,
              opacity: glow.opacity,
            }}
          />
        ))}
      </div>

      {/* Particle dots */}
      <div className="absolute inset-0">
        {particles.map((particle) => {
          // Alternate between theme colors for variety
          const colorIndex = particle.id % theme.glows.length
          const particleColor = theme.glows[colorIndex]?.color || '#14B8A6'
          
          return (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particleColor,
                opacity: particle.opacity,
                transform: 'translate(-50%, -50%)',
              animation: prefersReducedMotion
                  ? 'none'
                  : `particleFloat ${particle.duration}s ease-in-out infinite, particleTwinkle ${particle.twinkleDuration}s ease-in-out infinite`,
              animationDelay: `${particle.animationDelay}s`,
              } as React.CSSProperties}
            />
          )
        })}
      </div>

      {/* Optional mesh overlay */}
      {theme.mesh?.enabled && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(${theme.mesh.color}33 1px, transparent 1px),
              linear-gradient(90deg, ${theme.mesh.color}33 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            opacity: theme.mesh.opacity,
          }}
        />
      )}
    </div>
  )
}
