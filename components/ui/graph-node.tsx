import { cn } from "@/lib/utils";
import React from "react";

export interface GraphNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  type?: "system" | "capability" | "data" | "problem" | "persona" | "outcome";
  title: string;
  subtitle?: string;
  status?: "concept" | "prototype" | "building" | "deployed";
}

export function GraphNode({
  id,
  type = "system",
  title,
  subtitle,
  status,
  className,
  ...props
}: GraphNodeProps) {
  return (
    <div
      id={id}
      className={cn(
        "flex flex-col border border-border bg-surface p-4 rounded-sm shadow-sm",
        "transition-all duration-200 hover:shadow-md",
        "min-w-[200px]",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {type}
        </span>
        {status && (
          <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 bg-muted text-muted-foreground rounded-sm">
            {status}
          </span>
        )}
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}
