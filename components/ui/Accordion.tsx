'use client'

import { ReactNode, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItemProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-secondary-gray3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors font-semibold"
      >
        <span className="font-semibold text-lg">{title}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-accent-gray transition-transform duration-200',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-accent-gray2">
          {children}
        </div>
      )}
    </div>
  )
}

interface AccordionProps {
  children: ReactNode
  className?: string
}

export default function Accordion({ children, className }: AccordionProps) {
  return (
    <div className={cn('w-full', className)}>
      {children}
    </div>
  )
}
