'use client'

import { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  value: number
  min: number
  max: number
  step?: number
  formatValue?: (value: number) => string
}

export default function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  formatValue,
  className,
  ...props
}: SliderProps) {
  const displayValue = formatValue ? formatValue(value) : value.toString()

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-accent-gray2">{label}</label>
          <span className="text-sm font-semibold text-primary">{displayValue}</span>
        </div>
      )}
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-secondary-gray3 rounded-lg appearance-none cursor-pointer accent-primary"
        style={{
          background: `linear-gradient(to right, #1E3A5F 0%, #1E3A5F ${((value - min) / (max - min)) * 100}%, #E5E7EB ${((value - min) / (max - min)) * 100}%, #E5E7EB 100%)`,
        }}
        onChange={(e) => {
          if (props.onChange) {
            props.onChange(e)
          }
        }}
        {...props}
      />
      <div className="flex justify-between text-xs text-accent-gray mt-1">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  )
}
