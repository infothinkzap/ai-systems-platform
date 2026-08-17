import React from "react";
import { cn } from "@/lib/utils";

export type SignalState = "inactive" | "active" | "trace" | "hybrid" | "deterministic";
export type SignalOrientation = "horizontal" | "vertical";

interface TerrawaveSignalProps {
  state?: SignalState;
  orientation?: SignalOrientation;
  className?: string;
  animated?: boolean;
}

export function TerrawaveSignal({
  state = "active",
  orientation = "horizontal",
  className,
  animated = true,
}: TerrawaveSignalProps) {
  // Base structural classes
  const isHorizontal = orientation === "horizontal";
  const baseClasses = isHorizontal ? "h-[2px] w-full" : "w-[2px] h-full";
  
  // State colors
  const colorMap = {
    inactive: "bg-terra-stone",
    active: "bg-wave-emerald",
    trace: "bg-accent", // Signal green
    hybrid: "bg-wave-mint",
    deterministic: "bg-foreground", // Graphite for deterministic flow
  };
  
  // Animation mapping
  const animationClass = animated && (state === "active" || state === "trace") 
    ? (isHorizontal ? "animate-signal-flow-x" : "animate-signal-flow-y")
    : "";
    
  const pulseClass = animated && state === "active" ? "animate-signal-pulse" : "";

  return (
    <div className={cn("relative overflow-hidden", baseClasses, className)}>
      {/* Structural base (always visible as a trace path) */}
      <div className={cn("absolute inset-0 opacity-20", colorMap["inactive"])} />
      
      {/* Active Signal */}
      <div 
        className={cn(
          "absolute inset-0", 
          colorMap[state],
          animationClass,
          pulseClass
        )} 
      />
    </div>
  );
}
