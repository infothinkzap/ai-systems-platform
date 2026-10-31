import type { EntityType, ProductEntity, ProjectEntity, SemanticGraph } from "./graph/types";

export function relatedEntities(id: string, graph: SemanticGraph, type?: EntityType) {
  const ids = new Set(graph.relationships.filter(r => r.source === id || r.target === id).flatMap(r => [r.source, r.target]));
  return graph.entities.filter(e => e.id !== id && ids.has(e.id) && (!type || e.type === type));
}

export function workItems(graph: SemanticGraph) {
  return graph.entities.filter((e): e is ProductEntity | ProjectEntity => (e.type === "Product" || e.type === "Project") && e.id !== "project:terrawave_platform")
    .map(system => ({
      system,
      problems: relatedEntities(system.id, graph, "Problem"),
      workflows: relatedEntities(system.id, graph, "Workflow"),
      capabilities: relatedEntities(system.id, graph, "Capability"),
      evidence: system.type === "Product" ? system.evidence ?? [] : relatedEntities(system.id, graph, "Evidence").flatMap(e => e.type === "Evidence" ? [e.evidence_type] : []),
      href: system.type === "Project" ? `/work/${system.id.replace("project:", "")}` : `/systems/${system.id.replace("product:", "")}`,
    }))
    .sort((a, b) => {
      const order = { deployed: 0, production: 0, prototype: 1, building: 2, concept: 3 };
      return (order[a.system.maturity_status ?? "concept"] - order[b.system.maturity_status ?? "concept"]) || a.system.name.localeCompare(b.system.name);
    });
}

export function maturityLabel(system: ProductEntity | ProjectEntity) {
  return system.type === "Product" && system.deployment_scope === "limited_capacity" ? "Deployed · limited capacity" : system.maturity_status ?? "Status not recorded";
}

export const modeLabels = {
  Human: { label: "People decide", short: "Human", symbol: "01" },
  Deterministic: { label: "Rules do the work", short: "Rules", symbol: "02" },
  Hybrid: { label: "AI helps, people check", short: "Hybrid", symbol: "03" },
  AI: { label: "AI handles a bounded task", short: "AI", symbol: "04" },
  "No AI": { label: "Simplify the process", short: "No AI", symbol: "05" },
} as const;
