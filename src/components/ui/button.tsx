import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[#00E599] text-black shadow-[0_0_15px_rgba(0,229,153,0.5)] hover:shadow-[0_0_25px_rgba(0,229,153,0.8)] hover:bg-[#00ffaa] font-semibold": variant === "default",
            "border border-[#00E599]/50 bg-black/20 backdrop-blur-md text-[#00E599] hover:bg-[#00E599]/10 shadow-[0_0_10px_rgba(0,229,153,0.1)]": variant === "outline",
            "hover:bg-white/10 hover:text-[#00E599] text-gray-300": variant === "ghost",
            "bg-white/5 text-[#00E599] hover:bg-white/10 backdrop-blur-md border border-white/5": variant === "secondary",
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-12 rounded-md px-8 text-lg": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
