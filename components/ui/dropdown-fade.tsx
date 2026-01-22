"use client"

import { useRef } from "react"
import {
  motion,
  MotionProps,
  useInView,
  UseInViewOptions,
  Variants,
} from "motion/react"

type MarginType = UseInViewOptions["margin"]

interface DropDownFadeProps extends MotionProps {
  children: React.ReactNode
  className?: string
  variant?: {
    hidden: { y: number; opacity: number }
    visible: { y: number; opacity: number }
  }
  duration?: number
  delay?: number
  offset?: number
  inView?: boolean
  inViewMargin?: MarginType
}

export function DropDownFade({
  children,
  className,
  variant,
  duration = 0.6,
  delay = 0,
  offset = 40,
  inView = false,
  inViewMargin = "-50px",
  ...props
}: DropDownFadeProps) {
  const ref = useRef(null)
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin })
  // If inView is false, always show animation (immediate). If true, wait for scroll.
  const isInView = inView ? inViewResult : true
  
  const defaultVariants: Variants = {
    hidden: {
      y: -offset,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
    },
  }
  
  const combinedVariants = variant || defaultVariants
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="hidden"
      variants={combinedVariants}
      transition={{
        delay: delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth dropdown
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}