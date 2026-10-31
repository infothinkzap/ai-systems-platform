import type { CapabilityEntity, OpportunityEntity, SemanticGraph, IntelligenceMode } from "./types";

/** Shared, client-safe queries over the one canonical graph. */
export function graphTargets(graph: SemanticGraph, id: string, relation: string) {
  const ids = new Set(graph.relationships.filter(r => r.source === id && r.type === relation).map(r => r.target));
  return graph.entities.filter(e => ids.has(e.id));
}
export function opportunityEntities(graph: SemanticGraph) {
  return graph.entities.filter((e): e is OpportunityEntity => e.type === "Opportunity");
}
export function opportunityDetails(graph: SemanticGraph, opportunity: OpportunityEntity) {
  const workflow = graphTargets(graph, opportunity.id, "PROPOSES_WORKFLOW").find(e => e.type === "Workflow");
  const steps = (workflow?.step_ids ?? []).flatMap(id => {
    const step = graph.entities.find(e => e.id === id);
    if (!step || step.type !== "WorkflowStep") return [];
    const allocation = graphTargets(graph, id, "REQUIRES_ALLOCATION").find(e => e.type === "IntelligenceAllocation");
    return [{ id, name: step.name, responsibility: step.responsibility, mode: allocation?.mode as IntelligenceMode, provenance: "proposed" as const }];
  });
  return {
    opportunity, workflow, steps,
    inputs: workflow ? graphTargets(graph, workflow.id, "USES_DATA") : [],
    outputs: workflow ? graphTargets(graph, workflow.id, "PRODUCES") : [],
    users: graphTargets(graph, opportunity.id, "CANDIDATE_FOR"),
    risks: graphTargets(graph, opportunity.id, "HAS_RISK"),
    validation: graphTargets(graph, opportunity.id, "REQUIRES_VALIDATION"),
    capabilities: graphTargets(graph, opportunity.id, "MAY_REUSE").filter((e): e is CapabilityEntity => e.type === "Capability"),
    relatedWork: graphTargets(graph, opportunity.id, "RELATED_WORK").filter(e => e.type === "Product" || e.type === "Project"),
  };
}
export function capabilitySupport(cap: CapabilityEntity) {
  return cap.support_status === "demonstrated" ? "Demonstrated here · prototype scope" : cap.support_status === "candidate" ? "Candidate · needs validation" : "Graph-described · needs assessment";
}
export function capabilityReadiness(graph: SemanticGraph, id: string) {
  return graphTargets(graph,id,"HAS_DELIVERY_READINESS").find(e => e.type === "DeliveryReadiness");
}
