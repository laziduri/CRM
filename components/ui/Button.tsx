import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-navy to-teal text-white shadow-lg shadow-teal/20 hover:shadow-xl hover:shadow-teal/30 px-12 py-6",
        primary:
          "bg-gradient-to-r from-navy to-teal text-white font-semibold shadow-lg shadow-teal/20 hover:shadow-xl hover:shadow-teal/30 px-12 py-6",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-10 py-5",
        outline:
          "border-2 border-navy bg-white text-navy shadow-sm hover:bg-gradient-to-r hover:from-navy hover:to-teal hover:text-white hover:shadow-lg px-12 py-6",
        secondary:
          "bg-gradient-to-r from-teal to-teal-light text-white shadow-lg shadow-teal/20 hover:shadow-xl hover:shadow-teal/30 px-12 py-6",
        ghost: "text-navy hover:bg-navy/10 hover:text-navy-dark px-10 py-5",
        link: "text-navy underline-offset-4 hover:underline hover:text-teal",
      },
      size: {
        default: "h-12 px-10 py-6",
        sm: "h-10 rounded-lg px-6 py-4 text-sm",
        md: "h-12 px-10 py-6",
        lg: "h-14 rounded-lg px-14 py-7 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
