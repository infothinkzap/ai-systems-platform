"use client";

import { useMemo } from "react";
import { ProductEntity, SemanticGraph, BaseEntity } from "@/lib/graph/types";
import { AllocationState } from "./ControlRoom";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { SignalNode, SignalNodeState } from "@/components/visual/SignalNode";
import { TerrawaveSignal } from "@/components/visual/TerrawaveSignal";

interface SystemArchitectureProps {
  system: ProductEntity;
  graph: SemanticGraph;
  allocations: Record<string, AllocationState>;
  removeAI: boolean;
  showHumanControl: boolean;
  traceDecision: boolean;
  selectedNodeId: string | null;
  onNodeSelect: (id: string) => void;
}

export function SystemArchitecture({
  system,
  graph,
  allocations,
  removeAI,
  showHumanControl,
  traceDecision,
  selectedNodeId,
  onNodeSelect
}: SystemArchitectureProps) {
  
  const nodes = useMemo(() => {
    const systemRels = graph.relationships.filter(r => r.source === system.id);
    const workflows = systemRels
      .filter(r => r.type === "SUPPORTS_WORKFLOW")
      .map(r => graph.entities.find(e => e.id === r.target))
      .filter(Boolean) as BaseEntity[];
    
    const problems = systemRels
      .filter(r => r.type === "PRODUCT_SOLVES")
      .map(r => graph.entities.find(e => e.id === r.target))
      .filter(Boolean) as BaseEntity[];

    const capabilities = systemRels
      .filter(r => r.type === "USES")
      .map(r => graph.entities.find(e => e.id === r.target))
      .filter(Boolean) as BaseEntity[];

    return { workflows, problems, capabilities };
  }, [system, graph]);

  return (
    <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto py-12 relative">
      {/* Background signal trace to visualize the flow through the system */}
      {traceDecision && (
        <div className="absolute top-0 bottom-0 left-8 w-[2px] z-0">
          <TerrawaveSignal state="trace" orientation="vertical" />
        </div>
      )}

      {/* Structural layout: Problems -> Workflows -> Capabilities */}
      <div className="flex flex-col gap-6 relative z-10">
        <MonoLabel>1. The Problems</MonoLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nodes.problems.map(p => (
            <ArchitectureNode 
              key={p.id} 
              entity={p} 
              isSelected={selectedNodeId === p.id}
              allocation={allocations[p.id]}
              showHumanControl={showHumanControl}
              isTraced={traceDecision}
              onClick={() => onNodeSelect(p.id)}
            />
          ))}
          {nodes.problems.length === 0 && <div className="text-muted-foreground italic text-sm">No specific problems defined.</div>}
        </div>
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        <MonoLabel>2. The Workflows</MonoLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nodes.workflows.map(w => (
            <ArchitectureNode 
              key={w.id} 
              entity={w} 
              isSelected={selectedNodeId === w.id}
              allocation={allocations[w.id]}
              showHumanControl={showHumanControl}
              isTraced={traceDecision}
              onClick={() => onNodeSelect(w.id)}
            />
          ))}
          {nodes.workflows.length === 0 && <div className="text-muted-foreground italic text-sm">No specific workflows defined.</div>}
        </div>
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        <MonoLabel>3. Capabilities</MonoLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nodes.capabilities.map(c => {
            const isAI = c.type === "Capability";

            return (
              <ArchitectureNode 
                key={c.id} 
                entity={c} 
                isSelected={selectedNodeId === c.id}
                allocation={allocations[c.id]}
                showHumanControl={showHumanControl}
                isTraced={traceDecision}
                hidden={removeAI && isAI}
                onClick={() => onNodeSelect(c.id)}
              />
            );
          })}
          {nodes.capabilities.length === 0 && <div className="text-muted-foreground italic text-sm">Deterministic System — No capabilities explicitly connected.</div>}
        </div>
      </div>
    </div>
  );
}

function ArchitectureNode({ 
  entity, 
  isSelected, 
  allocation, 
  showHumanControl,
  isTraced,
  hidden = false,
  onClick 
}: { 
  entity: BaseEntity; 
  isSelected: boolean; 
  allocation?: AllocationState;
  showHumanControl: boolean;
  isTraced?: boolean;
  hidden?: boolean;
  onClick: () => void;
}) {
  const isHumanActive = showHumanControl && allocation === "HUMAN";
  
  // Map allocation to SignalNodeState
  let nodeState: SignalNodeState = "inactive";
  
  if (isSelected) {
    nodeState = "active";
  } else if (allocation === "HUMAN" || isHumanActive) {
    nodeState = "human";
  } else if (allocation === "DETERMINISTIC") {
    nodeState = "deterministic";
  } else if (allocation === "AI") {
    nodeState = "ai";
  } else if (allocation === "HYBRID") {
    nodeState = "active"; // hybrid
  } else if (isTraced) {
    nodeState = "active";
  }

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer transition-all duration-700 ${hidden ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}`}
    >
      <SignalNode 
        label={entity.type} 
        state={nodeState} 
        className={isSelected ? "ring-2 ring-wave-emerald border-wave-emerald shadow-lg shadow-wave-emerald/10" : "bg-white"}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{entity.name}</h3>
          {allocation && (
            <span className={`text-[10px] font-mono px-2 py-1 uppercase tracking-widest ${
              allocation === "AI" ? "bg-wave-emerald text-white" :
              allocation === "HUMAN" ? "bg-foreground text-background" :
              allocation === "HYBRID" ? "bg-wave-mint text-wave-deep" :
              "bg-terra-stone text-foreground"
            }`}>
              {allocation.replace(/_/g, " ")}
            </span>
          )}
        </div>
      </SignalNode>
    </div>
  );
}
