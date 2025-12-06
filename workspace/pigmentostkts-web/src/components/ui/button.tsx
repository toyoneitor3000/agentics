import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const variants = {
      default: "bg-brand-black text-brand-white hover:bg-brand-yellow hover:text-brand-black border-2 border-transparent hover:border-brand-black",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border-2 border-brand-black bg-transparent hover:bg-brand-black hover:text-brand-white",
      secondary: "bg-brand-yellow text-brand-black hover:bg-brand-black hover:text-brand-yellow border-2 border-transparent",
      ghost: "hover:bg-gray-100 hover:text-brand-black",
      link: "text-brand-black underline-offset-4 hover:underline decoration-2 decoration-brand-yellow",
    }
    
    const sizes = {
      default: "h-12 px-6 py-2",
      sm: "h-10 px-4",
      lg: "h-14 px-8 text-lg",
      icon: "h-12 w-12",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-bold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
