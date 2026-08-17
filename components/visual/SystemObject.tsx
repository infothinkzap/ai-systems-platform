import React from "react";
import { ProductEntity, BaseEntity } from "@/lib/graph/types";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { SignalNode } from "./SignalNode";
import { WaveConnector } from "./WaveConnector";
import { getGraph } from "@/lib/graph/queries";

interface SystemObjectProps {
  system: ProductEntity;
  capabilities: BaseEntity[];
  className?: string;
  isHovered?: boolean;
}

export function SystemObject({ system, capabilities, className, isHovered = false }: SystemObjectProps) {
  const graph = getGraph();

  // Find linked entities to build the vertical architectural flow
  const solvesRels = graph.relationships.filter(r => r.source === system.id && r.type === "PRODUCT_SOLVES");
  const supportsRels = graph.relationships.filter(r => r.source === system.id && r.type === "SUPPORTS_WORKFLOW");
  
  const problems = solvesRels.map(r => graph.entities.find(e => e.id === r.target)).filter(Boolean);
  const workflows = supportsRels.map(r => graph.entities.find(e => e.id === r.target)).filter(Boolean);

  // Simplified architectural view: pick the primary problem, workflow, and capability
  const primaryProblem = problems[0];
  const primaryWorkflow = workflows[0];
  const primaryCapability = capabilities[0];

  const signalState = isHovered ? "active" : "inactive";

  return (
    <div className={`border border-border bg-white p-6 hover:border-foreground transition-colors ${className || ""}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-4">{system.name}</h3>
        <div className="flex flex-wrap gap-2">
          {system.maturity_status && (
            <MonoLabel variant={system.maturity_status === "deployed" ? "accent" : "muted"}>
              {system.maturity_status.toUpperCase()}
            </MonoLabel>
          )}
          {system.offering_mode && (
            <MonoLabel>{system.offering_mode.replace("_", " ").toUpperCase()}</MonoLabel>
          )}
          {system.epistemic_status && (
            <MonoLabel variant="muted">
              {system.epistemic_status.toUpperCase()}
            </MonoLabel>
          )}
        </div>
      </div>

      <hr className="border-border mb-6" />

      {/* Architectural Flow */}
      <div className="flex flex-col">
        {primaryProblem && (
          <>
            <SignalNode label="Problem" state="inactive">
              {primaryProblem.name}
            </SignalNode>
            <div className="ml-6">
              <WaveConnector orientation="vertical" length="h-6" state={signalState} />
            </div>
          </>
        )}
        
        {primaryWorkflow && (
          <>
            <SignalNode label="Workflow" state="deterministic">
              {primaryWorkflow.name}
            </SignalNode>
            <div className="ml-6">
              <WaveConnector orientation="vertical" length="h-6" state={signalState} />
            </div>
          </>
        )}

        {primaryCapability ? (
          <>
            <SignalNode label="Intelligence" state={isHovered ? "ai" : "inactive"}>
              {primaryCapability.name}
            </SignalNode>
          </>
        ) : (
          <SignalNode label="Intelligence" state="inactive">
            No intelligence mapped
          </SignalNode>
        )}
      </div>
    </div>
  );
}
