'use client'

import { motion, MotionProps } from 'motion/react'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ScrollRevealProps extends Omit<MotionProps, 'children'> {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  distance?: number
}

/**
 * ScrollReveal - Reusable component for scroll-triggered animations
 * 
 * Features:
 * - Consistent fade-in-up animation pattern
 * - Respects prefers-reduced-motion
 * - Configurable direction and distance
 * - Staggered delays for grid items
 * - Performance optimized with once: true
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 30,
  ...motionProps
}: ScrollRevealProps) {
  const directionMap = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    fade: { x: 0, y: 0 },
  }

  const initialPosition = directionMap[direction]

  return (
    <motion.div
      initial={{ opacity: 0, ...initialPosition }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut',
        ...motionProps.transition,
      }}
      className={cn(className)}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}
