import React from "react";
import { cn } from "@/lib/utils";
import { TerrawaveSignal, SignalState, SignalOrientation } from "./TerrawaveSignal";

interface WaveConnectorProps {
  state?: SignalState;
  orientation?: SignalOrientation;
  length?: string; // Tailwind class like "h-12" or "w-16"
  className?: string;
  animated?: boolean;
}

export function WaveConnector({
  state = "inactive",
  orientation = "vertical",
  length = orientation === "vertical" ? "h-12" : "w-16",
  className,
  animated = true
}: WaveConnectorProps) {
  const isVertical = orientation === "vertical";
  
  return (
    <div className={cn("flex items-center justify-center", length, isVertical ? "w-[2px]" : "h-[2px]", className)}>
      <TerrawaveSignal state={state} orientation={orientation} animated={animated} />
    </div>
  );
}
