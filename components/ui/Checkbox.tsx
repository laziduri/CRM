import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className={cn('flex items-center cursor-pointer', className)}>
        <input
          ref={ref}
          type="checkbox"
          className="w-5 h-5 text-primary border-secondary-gray3 rounded focus:ring-primary focus:ring-2"
          {...props}
        />
        {label && (
          <span className="ml-2 text-sm text-accent-gray2">{label}</span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
