import React from "react";
import { cn } from "@/lib/utils";

export type SignalNodeState = "inactive" | "active" | "human" | "deterministic" | "ai";

interface SignalNodeProps {
  label: string;
  state?: SignalNodeState;
  className?: string;
  children?: React.ReactNode;
}

export function SignalNode({
  label,
  state = "inactive",
  className,
  children
}: SignalNodeProps) {
  
  // Visual mapping for nodes
  const stateClasses = {
    inactive: "border-terra-stone text-muted-foreground",
    active: "border-wave-emerald text-foreground shadow-[0_0_15px_rgba(14,159,110,0.1)]", // Subtle glow
    human: "border-foreground text-foreground", // Graphite for human gate
    deterministic: "border-foreground bg-foreground text-background", // Solid block for deterministic logic
    ai: "border-wave-emerald bg-wave-mint/10 text-wave-deep", // specific AI styling
  };

  return (
    <div className={cn(
      "flex flex-col border p-4 transition-colors duration-500",
      stateClasses[state],
      className
    )}>
      <span className="font-mono text-xs uppercase tracking-widest opacity-80 mb-2">
        {label}
      </span>
      {children && (
        <div className="font-medium">
          {children}
        </div>
      )}
    </div>
  );
}
