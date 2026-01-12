import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-accent-gray2 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 border border-secondary-gray3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all',
            error && 'border-accent-error focus:ring-accent-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-accent-error">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
