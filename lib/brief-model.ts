import { contextSlice, recommend, type Assumptions, type Mode } from "./lens";
import type { SemanticGraph } from "./graph/types";
import { interpretOpportunity, type ClarificationAnswers } from "./opportunity-interpreter";
import { modeLabels } from "./work";

export type BriefInput = { input: string; context: string | null; assumptions: Assumptions; selected: Mode | null; graph: SemanticGraph; answers?:ClarificationAnswers };
export const assumptionLabels = { data: "Information", rules: "Rules", stakes: "Impact of errors", judgment: "Human judgment" };
export const assumptionValues: Record<string, string> = { unknown: "Not yet known", ready: "Reliable", fragmented: "Scattered / unreliable", fixed: "Explicit rules", variable: "Varies by case", low: "Low / reversible", high: "High / hard to undo", yes: "Needed", no: "Not needed" };
export function briefModel(data: BriefInput) {
  const opportunity=interpretOpportunity(data.input,data.graph,data.answers);
  const slice = data.context ? contextSlice(data.context, data.graph) : null;
  const context = data.graph.entities.find(e => e.id === data.context);
  const pick = (...types: string[]) => slice?.entities.filter(e => types.includes(e.type)).map(e => e.name) ?? [];
  return {
    context: opportunity.opportunityId ? opportunity.title : context?.name ?? "No supported graph connection",
    opportunity,
    recommendation: recommend(data.assumptions),
    processes: opportunity.steps.length ? opportunity.steps.map(s=>s.name) : pick("Workflow"), information: opportunity.inputs.length?opportunity.inputs:pick("DataPrimitive", "DataSource"), decisions: opportunity.steps.length?opportunity.steps.filter(s=>s.mode==="Human").map(s=>s.name):pick("Decision"),
    systems: data.graph.entities.filter(e=>e.type==="Product").filter(e=>opportunity.relatedWorkIds.includes(e.id)),
    relationships: slice?.relationships ?? [],
    flow: opportunity.steps.map(s=>({task:s.name,owner:modeLabels[s.mode].short})),
  };
}
