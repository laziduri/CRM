import { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

export interface AnimatedGradientTextProps extends ComponentPropsWithoutRef<"div"> {
  speed?: number
  colorFrom?: string
  colorTo?: string
}

export function AnimatedGradientText({
  children,
  className,
  speed = 1,
  colorFrom = "hsl(220, 50%, 25%)", // Navy from logo
  colorTo = "hsl(180, 45%, 40%)", // Teal from logo
  ...props
}: AnimatedGradientTextProps) {
  return (
    <span
      style={
        {
          "--bg-size": "200%",
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } as React.CSSProperties
      }
      className={cn(
        `animate-gradient inline-block bg-gradient-to-r from-[var(--color-from)] via-[var(--color-to)] to-[var(--color-from)] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent font-bold`,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
