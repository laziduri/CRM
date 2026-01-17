'use client'

import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface AccordionItemDarkProps {
  number: number
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function AccordionItemDark({ number, title, children, defaultOpen = false }: AccordionItemDarkProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm mb-3 overflow-hidden border border-secondary-gray3 transition-all duration-300",
      "hover:shadow-[0_0_25px_rgba(20,184,166,0.25)] hover:border-teal",
      isOpen && "shadow-[0_0_25px_rgba(20,184,166,0.25)] border-teal"
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-secondary-gray2 transition-colors"
      >
        <span className="text-gray-900 font-semibold text-base md:text-lg leading-tight">{number}. {title}</span>
      </button>
      {isOpen && (
        <div className="px-5 md:px-6 pb-5 md:pb-6 text-gray-600 leading-relaxed text-sm md:text-base">
          {children}
        </div>
      )}
    </div>
  )
}

interface AccordionDarkProps {
  children: ReactNode
  className?: string
}

export default function AccordionDark({ children, className }: AccordionDarkProps) {
  return (
    <div className={cn('w-full', className)}>
      {children}
    </div>
  )
}
