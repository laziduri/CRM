import { ReactNode, CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  style?: CSSProperties
}

export default function Card({ children, className, hover = false, style }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm p-6 border border-secondary-gray3/50',
        hover && 'hover:shadow-xl hover:border-teal-light transition-all duration-300',
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}
