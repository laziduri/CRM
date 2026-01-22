'use client'

import { DotPattern } from '@/components/ui/dot-pattern'
import { cn } from '@/lib/utils'

interface AmbientBackgroundProps {
  className?: string
  intensity?: 'subtle' | 'moderate' | 'strong'
}

/**
 * AmbientBackground - Clean white background with subtle texture
 * Premium fintech aesthetic with minimal, static elements
 * 
 * Features:
 * - Static subtle dots pattern (navy/teal)
 * - Clean white background
 * - No animations for optimal performance
 */
export function AmbientBackground({ 
  className,
  intensity = 'moderate'
}: AmbientBackgroundProps) {
  const opacityMap = {
    subtle: 'opacity-10',
    moderate: 'opacity-15',
    strong: 'opacity-20'
  }

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none bg-white', className)}>
      {/* Very subtle static dots pattern - navy/teal for logo theme */}
      <DotPattern
        width={32}
        height={32}
        cx={1}
        cy={1}
        cr={0.5}
        glow={false}
        className={cn(
          'text-navy/10',
          opacityMap[intensity]
        )}
      />
    </div>
  )
}
