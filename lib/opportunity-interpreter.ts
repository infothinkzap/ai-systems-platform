import type { IntelligenceMode, SemanticGraph } from "./graph/types";
import { graphTargets, opportunityDetails, opportunityEntities } from "./graph/opportunities";

export type ClarificationAnswers = Record<string, string>;
export type OpportunityStep = { id: string; name: string; mode: IntelligenceMode; responsibility: string; provenance: "proposed" | "inferred" };
export interface OpportunityInterpretation {
  status: "matched" | "inferred" | "clarify" | "out_of_scope";
  opportunityId: string | null;
  title: string;
  understood: string;
  matchExplanation: string;
  steps: OpportunityStep[];
  inputs: string[];
  outputs: string[];
  risks: string[];
  unknowns: string[];
  validation: string[];
  capabilityIds: string[];
  relatedWorkIds: string[];
  mvp: string;
  facts: string[];
  answered: { question: string; answer: string }[];
}
const forms: Record<string,string> = { creating:"create",building:"build",making:"make",writing:"write",matching:"match",managing:"manage",generating:"generate",drafting:"draft",reconciling:"reconcile",scheduling:"schedule",responding:"respond" };
function normalize(value: string) {
  return value.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g," ").trim().split(/\s+/).map(w => forms[w] ?? (w.length > 4 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0,-1) : w)).join(" ");
}
function signals(input: string, terms: string[]) {
  const haystack = ` ${normalize(input)} `;
  return terms.filter(term => haystack.includes(` ${normalize(term)} `));
}

export interface OpportunityInterpreter { interpret(input: string, graph: SemanticGraph, answers?: ClarificationAnswers): OpportunityInterpretation; }

/** Multi-signal workflow retrieval, not embeddings or an LLM. A later interpreter
 * can implement this contract; existing work/evidence must still resolve by IDs. */
export function interpretOpportunity(input: string, graph: SemanticGraph, answers: ClarificationAnswers = {}): OpportunityInterpretation {
  const base = { opportunityId: null, steps: [], inputs: [], outputs: [], capabilityIds: [], relatedWorkIds: [], facts: input.trim() ? [input.trim()] : [], answered: [] };
  const ranked = opportunityEntities(graph).map(opportunity => {
    const domain = signals(input, opportunity.match_profile.domain);
    const task = signals(input, opportunity.match_profile.task);
    const artifact = signals(input, opportunity.match_profile.artifact);
    const groups = [domain,task,artifact].filter(g => g.length > 0).length;
    const distinct = new Set([...domain,...task,...artifact].map(normalize)).size;
    return { opportunity, domain, task, artifact, groups, distinct, score: (domain.length ? 5 : 0) + (task.length ? 3 : 0) + (artifact.length ? 2 : 0) + Math.min(domain.length,3) + Math.min(artifact.length,2) };
  }).filter(item => item.domain.length > 0 && item.groups >= 2 && item.distinct>=2).sort((a,b) => b.score-a.score || a.opportunity.id.localeCompare(b.opportunity.id));
  const exactProblems=graph.entities.filter(e=>e.type==="Problem"&&e.knowledge_layer!=="possibility"&&normalize(e.name).split(" ").length>=2&&` ${normalize(input)} `.includes(` ${normalize(e.name)} `));
  const exactPattern=opportunityEntities(graph).find(e=>graphTargets(graph,e.id,"PROPOSES_SOLUTION_TO").some(problem=>exactProblems.some(p=>p.id===problem.id)));
  const best = ranked[0] ?? (exactPattern?{opportunity:exactPattern,domain:[],task:[],artifact:[],groups:0}:undefined);
  if (best) {
    const model = opportunityDetails(graph,best.opportunity);
    const answered = best.opportunity.clarifications.flatMap(q => {
      const value = answers[q.id]?.trim();
      if (!value || value === "unknown") return [];
      if (q.options.length && !q.options.some(option => option.value === value)) return [];
      return [{ question:q.question, answer:q.options.find(option => option.value === value)?.label ?? value }];
    });
    const unknowns = best.opportunity.clarifications.filter(q => !answered.some(a => a.question === q.question)).map(q=>q.question);
    const steps: OpportunityStep[] = model.steps.map(step => ({ ...step }));
    if (best.opportunity.id === "opportunity:astrology_reports") {
      if (answers.chart_data === "supplied") steps[1].name = "Verify supplied chart data; no new chart calculations assumed";
      if (answers.chart_data === "calculate") steps[1].name = "Agree chart engine and calculation method, then verify values";
      if (answers.approved_methods === "undocumented") steps[2].name = "Document and approve the practitioner's method before drafting";
    }
    return {
      status:"matched", opportunityId:best.opportunity.id, title:best.opportunity.name,
      understood:best.opportunity.problem_statement,
      matchExplanation:best.groups?`Workflow signals: ${[...best.domain,...best.task,...best.artifact].slice(0,6).join(", ")}. This is a design hypothesis to confirm, not a verified understanding of your operation.`:"An exact existing problem name is connected to this proposed pattern. The context and workflow still need confirmation.",
      steps, inputs:model.inputs.map(e=>e.name), outputs:model.outputs.map(e=>e.name), risks:model.risks.map(e=>e.description ?? e.name), unknowns,
      validation:model.validation.map(e=>e.name), capabilityIds:model.capabilities.map(e=>e.id), relatedWorkIds:model.relatedWork.map(e=>e.id),
      mvp:best.opportunity.mvp_boundary, facts:base.facts, answered,
    };
  }
  const normalized = normalize(input);
  const business = /\b(business|team|staff|client|customer|company|factory|equipment|store|volunteer|operation|organization|organisation|workflow|record|order)\b/i.test(normalized);
  if (!business && /\b(holiday|vacation|itinerary|trip)\b/i.test(normalized)) return { ...base,status:"out_of_scope",title:"This looks like a personal travel request.",understood:"This experience scopes business software, creative production and operational workflows. If there is a business process behind the request, describe that process.",matchExplanation:"No business workflow was inferred or matched.",risks:[],unknowns:["Is there a business workflow, customer service or product you want to build around this?"],validation:[],mvp:"No system scope proposed." };
  const action = /\b(track|monitor|schedule|assign|dispatch|route|process|review|prepare|produce|coordinate|manage|collect|record|compare|need)\b/i.test(normalized);
  if (business && action && input.trim().length >= 32 && !/^(we|our team|i) (need|want) (more |better )?intelligence[.! ]*$/i.test(input.trim())) {
    // Compose conservative roles from the graph's reviewed structural pattern.
    // Only structural integrity is validated; engineering feasibility is not.
    const pattern = opportunityEntities(graph).find(e => e.id === "opportunity:operational_decisions");
    const source = pattern ? opportunityDetails(graph,pattern) : null;
    const steps = source?.steps.filter(step => step.mode !== "AI" && step.mode !== "Hybrid").map(step => ({...step, provenance:"inferred" as const})) ?? [];
    return { ...base,status:"inferred",title:"A scoped workflow to investigate",understood:"There may be a useful business system here even though this exact use case is not in the library.",matchExplanation:"A provisional flow was composed from a graph-defined review pattern. These inferred steps need discovery; no existing product or delivery capability is claimed.",steps,inputs:["Required source information — to confirm"],outputs:["Desired operational result — to confirm"],capabilityIds:graph.entities.some(e=>e.id==="cap:workflow_analysis")?["cap:workflow_analysis"]:[],risks:["The actual inputs, integration access and domain-specific requirements may differ from this skeleton.","New technical expertise, hardware or validation may be required; no feasibility or delivery promise is made."],unknowns:["What triggers the work and what result should it produce?","Which information, systems and people are involved?","Who owns exceptions and approves the final action?"],validation:["Walk through one real example with the workflow owner before selecting tools."],mvp:"One agreed workflow, source and decision owner; validate feasibility before committing to a build." };
  }
  return { ...base,status:"clarify",title:"What work should change?",understood:"Not represented does not mean not solvable. A little more context will help us propose a useful direction.",matchExplanation:"There are not enough distinct workflow signals to choose a pattern responsibly.",risks:[],unknowns:["What comes in, who handles it, and what output would be useful?"],validation:["Name one workflow and one desired result."],mvp:"Scope remains open until a concrete workflow is described." };
}
export const ruleBasedOpportunityInterpreter: OpportunityInterpreter = { interpret: interpretOpportunity };

export function relevantKnownContexts(input: string, graph: SemanticGraph, workIds: string[]) {
  // Preserve existing context retrieval, but only retain contexts attached to the
  // actual related products, rather than mapping every report to an AI product.
  const words = normalize(input).split(" ");
  return graph.entities.filter(e => e.knowledge_layer !== "possibility" && ["Problem","Workflow"].includes(e.type))
    .filter(e => graph.relationships.some(r => (r.target === e.id && workIds.includes(r.source)) || (r.source === e.id && workIds.includes(r.target))))
    .map(entity => ({entity, score:normalize(entity.name).split(" ").filter(w=>words.includes(w)).length}))
    .filter(item=>item.score>0).sort((a,b)=>b.score-a.score).map(item=>item.entity).slice(0,6);
}

export function capabilityEvidenceIds(graph: SemanticGraph, capabilityId: string) {
  return graph.relationships.filter(r=>r.type==="DEMONSTRATES"&&r.target===capabilityId).flatMap(r=>graphTargets(graph,r.source,"HAS_EVIDENCE").map(e=>e.id));
}
