"use client";

import { SemanticGraph } from "@/lib/graph/types";
import { AllocationState } from "./ControlRoom";
import { MonoLabel } from "@/components/ui/MonoLabel";

interface AllocationControlProps {
  nodeId: string;
  graph: SemanticGraph;
  currentState: AllocationState;
  onChange: (state: AllocationState) => void;
}

const ALLOCATIONS: { state: AllocationState; label: string; desc: string }[] = [
  { state: "HUMAN", label: "Human", desc: "Pure judgment. No automation." },
  { state: "DETERMINISTIC", label: "Deterministic", desc: "Rules-based software. Zero hallucination risk." },
  { state: "AI", label: "Artificial Intelligence", desc: "Probabilistic reasoning and extraction." },
  { state: "HYBRID", label: "Hybrid System", desc: "AI intelligence governed by deterministic rails." },
  { state: "NO_AI_REQUIRED", label: "No AI Required", desc: "Optimal structural path ignores AI completely." }
];

export function AllocationControl({ nodeId, graph, currentState, onChange }: AllocationControlProps) {
  const node = graph.entities.find(e => e.id === nodeId);
  
  if (!node) return null;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-8">
        <MonoLabel dot className="mb-4">Intelligence Allocation</MonoLabel>
        <h2 className="text-2xl font-medium text-balance">{node.name}</h2>
        <MonoLabel variant="muted" className="mt-4">{node.type}</MonoLabel>
      </div>

      <div className="flex flex-col gap-4">
        {ALLOCATIONS.map(alloc => (
          <button
            key={alloc.state}
            onClick={() => onChange(alloc.state)}
            className={`
              text-left p-4 border transition-all duration-200 group
              ${currentState === alloc.state 
                ? "border-foreground bg-foreground text-background" 
                : "border-border hover:border-foreground/30 bg-white"
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`font-mono text-xs uppercase tracking-widest ${currentState === alloc.state ? "text-background" : "text-foreground"}`}>
                {alloc.label}
              </span>
              <div className={`w-2 h-2 rounded-full ${currentState === alloc.state ? "bg-background" : "bg-transparent border border-foreground/30 group-hover:border-foreground"}`} />
            </div>
            <p className={`text-sm ${currentState === alloc.state ? "text-background/80" : "text-muted-foreground"}`}>
              {alloc.desc}
            </p>
          </button>
        ))}
      </div>
      
      <div className="mt-auto pt-8">
        <div className="p-4 bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed text-balance">
            <strong>Terrawave Principle:</strong> Automation does not eliminate accountability. It relocates it deliberately. The goal is not maximum AI, but maximum structural leverage.
          </p>
        </div>
      </div>
    </div>
  );
}
