import { cn } from "@/lib/utils";
import React from "react";
import { ArrowRight, ArrowDown } from "lucide-react";

export interface GraphEdgeProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  direction?: "horizontal" | "vertical";
}

export function GraphEdge({
  label,
  direction = "vertical",
  className,
  ...props
}: GraphEdgeProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-muted-foreground",
        direction === "vertical" ? "flex-col py-4" : "flex-row px-4",
        className
      )}
      {...props}
    >
      <div 
        className={cn(
          "bg-border", 
          direction === "vertical" ? "w-px h-6" : "h-px w-6"
        )} 
      />
      <div className={cn(
        "flex items-center justify-center",
        direction === "vertical" ? "flex-col" : "flex-row"
      )}>
        {label && (
          <span className={cn(
            "text-[10px] uppercase font-mono tracking-widest text-muted-foreground whitespace-nowrap",
            direction === "vertical" ? "my-1" : "mx-2"
          )}>
            {label}
          </span>
        )}
        {direction === "vertical" ? (
          <ArrowDown className="w-4 h-4 mt-1 opacity-50" />
        ) : (
          <ArrowRight className="w-4 h-4 ml-1 opacity-50" />
        )}
      </div>
    </div>
  );
}
