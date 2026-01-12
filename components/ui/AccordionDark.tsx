'use client'

import { ReactNode, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
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
    <div className="bg-white rounded-xl shadow-sm mb-3 overflow-hidden border border-secondary-gray3 hover:shadow-md hover:border-teal-light transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-secondary-gray2 transition-colors"
      >
        <span className="text-gray-900 font-semibold text-base md:text-lg pr-4 leading-tight">{number}. {title}</span>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-light/20 flex items-center justify-center border border-teal-light/50">
          {isOpen ? (
            <Minus className="w-4 h-4 text-teal" />
          ) : (
            <Plus className="w-4 h-4 text-teal" />
          )}
        </div>
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
