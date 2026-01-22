'use client'

import { DotPattern } from '@/components/ui/dot-pattern'
import { cn } from '@/lib/utils'

interface CalmBackgroundProps {
  className?: string
}

/**
 * CalmBackground - Clean white background for focus-friendly sections
 * Perfect for FAQs, forms, and comparison sections
 * 
 * Features:
 * - Very subtle static dots (navy/teal)
 * - Clean white background
 * - Focus-friendly, calming aesthetic
 */
export function CalmBackground({ className }: CalmBackgroundProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none bg-white', className)}>
      {/* Very subtle static dots - navy/teal for logo theme */}
      <DotPattern
        width={64}
        height={64}
        cx={1}
        cy={1}
        cr={0.5}
        glow={false}
        className="text-navy/5 opacity-10"
      />
    </div>
  )
}
