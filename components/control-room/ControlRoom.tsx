"use client";

import { useState } from "react";
import { ProductEntity, SemanticGraph } from "@/lib/graph/types";
import { Container } from "@/components/ui/Container";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { SystemSelector } from "./SystemSelector";
import { SystemArchitecture } from "./SystemArchitecture";
import { AllocationControl } from "./AllocationControl";
import { OpportunityMapper } from "./OpportunityMapper";

interface ControlRoomProps {
  systems: ProductEntity[];
  graph: SemanticGraph;
}

export type AllocationState = "HUMAN" | "DETERMINISTIC" | "AI" | "HYBRID" | "NO_AI_REQUIRED";

export interface NodeAllocation {
  id: string;
  state: AllocationState;
}

export function ControlRoom({ systems, graph }: ControlRoomProps) {
  const defaultSystem = systems.find(s => s.id === "product:manaswini_operations") || systems[0];
  const [activeSystemId, setActiveSystemId] = useState<string>(defaultSystem?.id || "");
  const [showHumanControl, setShowHumanControl] = useState(false);
  const [removeAI, setRemoveAI] = useState(false);
  const [traceDecision, setTraceDecision] = useState(false);
  const [wizardMode, setWizardMode] = useState(false);
  
  const [allocations, setAllocations] = useState<Record<string, AllocationState>>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const activeSystem = systems.find(s => s.id === activeSystemId);

  const handleAllocationChange = (nodeId: string, state: AllocationState) => {
    setAllocations(prev => ({ ...prev, [nodeId]: state }));
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full max-w-full">
      {/* Header Bar */}
      <div className="border-b border-border bg-background py-8">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <MonoLabel dot>Intelligence Control Room</MonoLabel>
              <h1 className="text-3xl mt-4 font-medium">Where should intelligence enter your system?</h1>
              <p className="mt-2 text-muted-foreground max-w-xl">
                Not every workflow needs AI. Manipulate the architecture to visualize how work is distributed between human judgment, deterministic rules, and artificial intelligence.
              </p>
            </div>

            <div className="flex flex-col gap-4 items-start md:items-end">
              <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground uppercase tracking-widest">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={removeAI}
                    onChange={(e) => setRemoveAI(e.target.checked)}
                    className="accent-accent"
                  />
                  Remove AI
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showHumanControl}
                    onChange={(e) => setShowHumanControl(e.target.checked)}
                    className="accent-accent"
                  />
                  Show Human Accountability
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={traceDecision}
                    onChange={(e) => setTraceDecision(e.target.checked)}
                    className="accent-accent"
                  />
                  Trace Decision
                </label>
                <button 
                  onClick={() => setWizardMode(!wizardMode)}
                  className={`px-4 py-1 border transition-colors ${wizardMode ? 'bg-foreground text-background border-foreground' : 'border-foreground hover:bg-foreground/5'}`}
                >
                  {wizardMode ? "Exit Wizard" : "Start With The System"}
                </button>
              </div>
              <SystemSelector 
                systems={systems} 
                activeId={activeSystemId} 
                onChange={setActiveSystemId} 
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        <div className="flex-1 overflow-auto bg-[#F4F2EC] relative border-r border-border p-8">
          {wizardMode ? (
            <OpportunityMapper onComplete={(mode) => {
              if (selectedNodeId) handleAllocationChange(selectedNodeId, mode as AllocationState);
              setWizardMode(false);
            }} />
          ) : activeSystem && (
            <SystemArchitecture 
              system={activeSystem}
              graph={graph}
              allocations={allocations}
              removeAI={removeAI}
              showHumanControl={showHumanControl}
              traceDecision={traceDecision}
              selectedNodeId={selectedNodeId}
              onNodeSelect={setSelectedNodeId}
            />
          )}
        </div>
        
        {/* Sidebar Controls */}
        <div className="w-full md:w-96 bg-white shrink-0 p-8 flex flex-col gap-8 overflow-auto">
          {selectedNodeId ? (
            <AllocationControl 
              nodeId={selectedNodeId}
              graph={graph}
              currentState={allocations[selectedNodeId] || "NO_AI_REQUIRED"}
              onChange={(state) => handleAllocationChange(selectedNodeId, state)}
            />
          ) : (
            <div className="text-muted-foreground flex flex-col items-center justify-center h-full text-center">
              <MonoLabel className="mb-4">No Node Selected</MonoLabel>
              <p className="text-sm text-balance">
                Select a structural node in the architecture to configure its intelligence allocation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
