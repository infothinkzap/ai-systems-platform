import * as React from "react"
import { cn } from "@/lib/utils"

interface MonoLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "muted";
  dot?: boolean;
}

const MonoLabel = React.forwardRef<HTMLSpanElement, MonoLabelProps>(
  ({ className, variant = "default", dot = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase",
          variant === "default" && "text-foreground",
          variant === "accent" && "text-accent",
          variant === "muted" && "text-muted-foreground",
          className
        )}
        {...props}
      >
        {dot && (
          <span 
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              variant === "default" && "bg-foreground",
              variant === "accent" && "bg-accent",
              variant === "muted" && "bg-muted-foreground"
            )} 
          />
        )}
        {children}
      </span>
    )
  }
)
MonoLabel.displayName = "MonoLabel"

export { MonoLabel }
