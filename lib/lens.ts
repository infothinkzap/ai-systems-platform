import type { SemanticEntity, SemanticGraph, IntelligenceMode } from "./graph/types";

const stop = new Set("a an the our we have has with and but for to of in is are it on team work manually manual system data ai".split(" "));
export function tokens(text: string): string[] {
  return [...new Set((text.toLowerCase().match(/[a-z0-9]+/g) ?? [])
    .map(word => word.length > 4 && word.endsWith("s") ? word.slice(0, -1) : word)
    .filter(word => word.length > 2 && !stop.has(word)))];
}

// Lexical candidates, never a claim to have understood or verified a business.
export function matchContext(input: string, graph: SemanticGraph): SemanticEntity[] {
  const words = tokens(input);
  return graph.entities.filter(entity => entity.knowledge_layer !== "possibility" && ["Problem", "Workflow"].includes(entity.type))
    .map(entity => ({ entity, score: tokens(entity.name).filter(word => words.includes(word)).length }))
    .filter(item => item.score > 0).sort((a, b) => b.score - a.score || a.entity.id.localeCompare(b.entity.id))
    .slice(0, 6).map(item => item.entity);
}

export function contextSlice(id: string, graph: SemanticGraph) {
  const ids = new Set([id]);
  // Traverse only a matched context and its directly linked products. No invented flow edges.
  const products = graph.relationships.filter(r => r.source === id || r.target === id)
    .flatMap(r => [r.source, r.target]).filter(key => graph.entities.some(e => e.id === key && e.type === "Product"));
  const roots = new Set([id, ...products]);
  const knownIds = new Set(graph.entities.filter(e => e.knowledge_layer !== "possibility").map(e=>e.id));
  const direct = graph.relationships.filter(r => (roots.has(r.source) || roots.has(r.target)) && knownIds.has(r.source) && knownIds.has(r.target));
  direct.forEach(r => { ids.add(r.source); ids.add(r.target); });
  // Reveal recorded dependencies of this system's capabilities without adding
  // other products simply because they reuse the same capability.
  const dependencies = new Set(graph.entities.filter(e => ids.has(e.id) && ["Capability", "Workflow"].includes(e.type)).map(e => e.id));
  const detailTypes = new Set(["DataSource", "DataPrimitive", "Decision", "Action", "Outcome"]);
  const details = graph.relationships.filter(r =>
    (dependencies.has(r.source) && graph.entities.some(e => e.id === r.target && detailTypes.has(e.type))) ||
    (dependencies.has(r.target) && graph.entities.some(e => e.id === r.source && detailTypes.has(e.type))));
  details.forEach(r => { ids.add(r.source); ids.add(r.target); });
  const relationships = graph.relationships.filter(r => ids.has(r.source) && ids.has(r.target));
  return { entities: graph.entities.filter(e => ids.has(e.id)), relationships };
}

export type Mode = IntelligenceMode;
export type Assumptions = { data: "unknown" | "ready" | "fragmented"; rules: "unknown" | "fixed" | "variable"; stakes: "unknown" | "low" | "high"; judgment: "unknown" | "yes" | "no" };
export const initialAssumptions: Assumptions = { data: "unknown", rules: "unknown", stakes: "unknown", judgment: "unknown" };
export const modes: Mode[] = ["Human", "Deterministic", "Hybrid", "AI", "No AI"];
export const consequences: Record<Mode, { gain: string; cost: string; guard: string }> = {
  Human: { gain: "Context and responsibility stay with a person.", cost: "Capacity and consistency depend on available people.", guard: "Define the owner, decision criteria and an escalation path." },
  Deterministic: { gain: "Explicit rules make decisions repeatable and traceable.", cost: "Unspecified exceptions stop the flow or produce incorrect results.", guard: "Validate inputs, version rules and route exceptions to an owner." },
  Hybrid: { gain: "AI can propose; rules constrain; a person approves consequential actions.", cost: "Review queues, evaluation and integration add operating work.", guard: "Keep approval before irreversible actions and log the evidence used." },
  AI: { gain: "Variable, unstructured inputs can be interpreted at scale.", cost: "Outputs can be wrong. Evaluation, monitoring and recovery are required.", guard: "Limit autonomy to reversible, low-stakes work with a tested fallback." },
  "No AI": { gain: "A simpler handoff, shared record or clearer ownership may remove the friction.", cost: "The underlying process still needs an owner and may retain manual effort.", guard: "First test whether the problem disappears with better inputs or a simpler process." },
};
export function recommend(a: Assumptions): { mode: Mode | null; reason: string } {
  if (a.data === "fragmented") return { mode: "No AI", reason: "Repair the information flow first. Adding inference to unreliable inputs can amplify the problem." };
  if (Object.values(a).includes("unknown")) return { mode: null, reason: "There is not enough information to allocate intelligence. Confirm the operating assumptions first." };
  if (a.judgment === "yes" && a.stakes === "high") return { mode: "Human", reason: "Consequential contextual judgment needs a named human decision owner. Tools can support that owner." };
  if (a.rules === "fixed" && a.judgment === "no") return { mode: "Deterministic", reason: "Known inputs and explicit rules call for repeatable software. An AI model adds uncertainty without a demonstrated need." };
  if (a.stakes === "high" || a.judgment === "yes") return { mode: "Hybrid", reason: "Variable interpretation may benefit from AI assistance, while rules and human review constrain consequential decisions." };
  return { mode: "AI", reason: "A bounded AI trial may fit variable rules and low-stakes, reversible work. Validate it against a simpler baseline before adopting it." };
}

export function discoveryBrief(input: string, context: string | null, a: Assumptions, selected: Mode | null, graph: SemanticGraph) {
  const recommendation = recommend(a);
  const slice = context ? contextSlice(context, graph) : null;
  return ["TERRAWAVE / DISCOVERY BRIEF", "System first, AI second.", "", "VISITOR DESCRIPTION (unverified)", input,
    "", "GRAPH CONTEXT (lexical match, confirm with workflow owner)", context ?? "No supported context found",
    ...(slice?.entities.map(e => `${e.id}: ${e.name}${e.type === "Product" ? ` | maturity: ${e.maturity_status ?? "unrecorded"}; evidence: ${e.evidence?.join(", ") ?? "unrecorded"}` : ""}`) ?? []),
    "", "RECORDED RELATIONSHIPS", ...(slice?.relationships.map(r => `${r.source} --${r.type}--> ${r.target}`) ?? []),
    "", "VISITOR ASSUMPTIONS", ...Object.entries(a).map(([k, v]) => `${k}: ${v}`),
    "", `PROVISIONAL RECOMMENDATION: ${recommendation.mode ?? "Unresolved"}`, recommendation.reason,
    `COMPARISON SELECTED: ${selected ?? "None"}`, ...(selected ? Object.values(consequences[selected]) : []),
    "", "UNKNOWNS TO RESOLVE", "Actual workflow order, input quality, volumes, exception rate, decision owner, risk tolerance, baseline and measurable success criteria.",
    "", "Next: review one real workflow and representative records with Terrawave. This brief is a local planning aid, not a suitability assessment. No request has been sent."].join("\n");
}
