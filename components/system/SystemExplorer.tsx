"use client";

import { useMemo } from "react";
import { ProductEntity, SemanticGraph, BaseEntity } from "@/lib/graph/types";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { SignalNode, SignalNodeState } from "@/components/visual/SignalNode";

interface SystemExplorerProps {
  system: ProductEntity;
  graph: SemanticGraph;
}

export function SystemExplorer({ system, graph }: SystemExplorerProps) {
  const architecture = useMemo(() => {
    const getTargets = (sourceId: string, types: string[]): BaseEntity[] => {
      return graph.relationships
        .filter(r => r.source === sourceId && types.includes(r.type))
        .map(r => graph.entities.find(e => e.id === r.target))
        .filter(Boolean) as BaseEntity[];
    };

    const getSources = (targetId: string, types: string[]): BaseEntity[] => {
      return graph.relationships
        .filter(r => r.target === targetId && types.includes(r.type))
        .map(r => graph.entities.find(e => e.id === r.source))
        .filter(Boolean) as BaseEntity[];
    };

    // 1. Problems
    const problems = getTargets(system.id, ["PRODUCT_SOLVES"]);

    // 2. Workflows
    const workflows = getTargets(system.id, ["SUPPORTS_WORKFLOW"]);

    // 3. Data Primitives (from Workflows or explicitly missing)
    let data: BaseEntity[] = [];
    workflows.forEach(w => {
      data.push(...getTargets(w.id, ["PROCESSES", "OPERATES_ON"]));
    });
    // Distinct data
    data = Array.from(new Map(data.map(d => [d.id, d])).values());

    // 4. Data Sources (from Data Primitives)
    let dataSources: BaseEntity[] = [];
    data.forEach(d => {
      const sources = graph.relationships
        .filter(r => r.source === d.id && ["ORIGINATES_FROM", "IMPORTED_FROM", "RECEIVED_THROUGH", "SYNCHRONIZED_FROM"].includes(r.type))
        .map(r => graph.entities.find(e => e.id === r.target))
        .filter(Boolean) as BaseEntity[];
      dataSources.push(...sources);
    });
    dataSources = Array.from(new Map(dataSources.map(s => [s.id, s])).values());

    // 5. Capabilities
    const capabilities = getTargets(system.id, ["USES"]);

    const understand = capabilities.filter(c => 
      graph.relationships.some(r => r.source === c.id && r.type === "CAPABILITY_BELONGS_TO_GROUP" && r.target === "group:understand")
    );
    const reason = capabilities.filter(c => 
      graph.relationships.some(r => r.source === c.id && r.type === "CAPABILITY_BELONGS_TO_GROUP" && r.target === "group:reason")
    );

    // 6. Decisions and Actions
    let decisions: BaseEntity[] = [];
    let actions: BaseEntity[] = [];
    capabilities.forEach(c => {
      const tgts = getTargets(c.id, ["INFORMS", "LEADS_TO", "ENABLES"]);
      decisions.push(...tgts.filter(t => t.id.startsWith("decision:")));
      actions.push(...tgts.filter(t => t.id.startsWith("action:")));
    });
    decisions = Array.from(new Map(decisions.map(d => [d.id, d])).values());
    actions = Array.from(new Map(actions.map(a => [a.id, a])).values());

    // 7. Outcomes (From Users -> Outcomes)
    // Find personas that use the system
    const users = getSources(system.id, ["USES_SYSTEM"]);
    let outcomes: BaseEntity[] = [];
    users.forEach(u => {
      outcomes.push(...getTargets(u.id, ["DESIRES_OUTCOME"]));
    });
    
    // Also outcomes might be LEADS_TO from decisions
    decisions.forEach(d => {
      outcomes.push(...getTargets(d.id, ["LEADS_TO", "IMPROVES"]));
    });
    outcomes = Array.from(new Map(outcomes.map(o => [o.id, o])).values());

    return { problems, workflows, data, dataSources, understand, reason, decisions, actions, outcomes };
  }, [system, graph]);

  return (
    <div className="flex flex-col md:flex-row md:items-stretch w-full gap-8 md:gap-4 py-8 relative">
      <Section title="Problem Space" nodes={architecture.problems} state="deterministic" />
      <Section title="Workflows" nodes={architecture.workflows} state="human" />
      <Section title="Data Source" nodes={architecture.dataSources} state="deterministic" />
      <Section title="Data" nodes={architecture.data} state="deterministic" />
      <Section title="Understand" nodes={architecture.understand} state="ai" highlight="WHERE DOES INTELLIGENCE ENTER?" />
      <Section title="Reason" nodes={architecture.reason} state="ai" />
      <Section title="Decision" nodes={architecture.decisions} state="ai" />
      <Section title="Action" nodes={architecture.actions} state="human" highlight="WHERE DOES HUMAN JUDGMENT REMAIN?" />
      <Section title="Outcome" nodes={architecture.outcomes} state="active" />
    </div>
  );
}

function Section({ 
  title, 
  nodes, 
  state,
  highlight 
}: { 
  title: string; 
  nodes: BaseEntity[]; 
  state: SignalNodeState;
  highlight?: string;
}) {
  return (
    <div className="flex flex-col gap-4 flex-1 min-w-[200px]">
      <MonoLabel>{title}</MonoLabel>
      
      {highlight && (
        <div className="text-[10px] text-wave-emerald uppercase tracking-widest font-mono border-b border-wave-emerald/20 pb-2 mb-2">
          {highlight}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {nodes.map(n => (
          <SignalNode key={n.id} label={n.type} state={state} className="bg-white/50 backdrop-blur-sm">
            <h3 className="text-sm font-medium">{n.name}</h3>
          </SignalNode>
        ))}
        {nodes.length === 0 && (
          <div className="text-xs text-muted-foreground font-mono bg-terra-stone/10 p-3 rounded-md border border-dashed border-terra-stone/30">
            NOT YET MODELED
          </div>
        )}
      </div>
    </div>
  );
}
