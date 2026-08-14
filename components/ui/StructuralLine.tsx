import * as React from "react"
import { cn } from "@/lib/utils"

interface StructuralLineProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  animated?: boolean;
}

const StructuralLine = React.forwardRef<HTMLDivElement, StructuralLineProps>(
  ({ className, orientation = "horizontal", animated = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-border relative overflow-hidden",
          orientation === "horizontal" ? "h-[1px] w-full" : "w-[1px] h-full",
          className
        )}
        {...props}
      >
        {animated && (
          <div
            className={cn(
              "absolute bg-accent",
              orientation === "horizontal" 
                ? "h-full w-16 animate-flow-horizontal"
                : "w-full h-16 animate-flow-vertical"
            )}
          />
        )}
      </div>
    )
  }
)
StructuralLine.displayName = "StructuralLine"

export { StructuralLine }
