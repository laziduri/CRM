'use client'

import { cn } from '@/lib/utils'

interface GlowBackgroundProps {
  className?: string
  intensity?: 'subtle' | 'moderate' | 'strong'
}

/**
 * GlowBackground - Subtle radial gradient glows to enhance white background
 * Premium fintech aesthetic with navy and teal glows
 * 
 * Features:
 * - Very subtle radial gradients (5-10% opacity)
 * - Navy and teal glows positioned strategically
 * - Blur effects for smooth, non-distracting enhancement
 * - Performance optimised with CSS only
 */
export function GlowBackground({ 
  className,
  intensity = 'subtle'
}: GlowBackgroundProps) {
  const opacityMap = {
    subtle: 'opacity-30',
    moderate: 'opacity-50',
    strong: 'opacity-70'
  }

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {/* Top-right teal glow */}
      <div 
        className={cn(
          'absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl bg-teal/5',
          opacityMap[intensity]
        )}
        style={{
          transform: 'translate(30%, -30%)',
        }}
      />
      
      {/* Bottom-left navy glow */}
      <div 
        className={cn(
          'absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl bg-navy/5',
          opacityMap[intensity]
        )}
        style={{
          transform: 'translate(-30%, 30%)',
        }}
      />
      
      {/* Center subtle blend */}
      <div 
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl bg-gradient-to-br from-teal/3 via-transparent to-navy/3',
          opacityMap[intensity]
        )}
      />
    </div>
  )
}
