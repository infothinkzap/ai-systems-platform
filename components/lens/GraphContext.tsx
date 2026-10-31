import Link from "next/link";
import { contextSlice } from "@/lib/lens";
import type { SemanticGraph } from "@/lib/graph/types";
import { capabilitySupport } from "@/lib/graph/opportunities";

const groups = { Problem: "Problems", Workflow: "Processes", DataSource: "Sources", DataPrimitive: "Information", Capability: "Capabilities", Decision: "Decisions", Action: "Actions", Outcome: "Intended outcomes", Product: "Related systems" };

export function GraphContext({ context, graph }: { context: string; graph: SemanticGraph }) {
  const slice = contextSlice(context, graph);
  return <details className="lens-disclosure graph-disclosure"><summary><span>Look inside the system map</span><small>Processes, information and recorded connections</small></summary>
    <div className="disclosure-body"><p className="lens-note">These are connections in Terrawave’s knowledge, not a verified map of your business. No workflow order is implied.</p>
      <div className="entity-map">{Object.entries(groups).map(([type, label]) => {
        const entities = slice.entities.filter(e => e.type === type);
        return entities.length > 0 && <section className="entity-column" key={type}><h3 className="eyebrow">{label}</h3>{entities.map(e => <details key={e.id} className="entity-card"><summary>{e.name}</summary><small>{e.id}</small>{e.description && <p>{e.description}</p>}{e.type === "Product" && <><p>Stage: {e.maturity_status ?? "Not recorded"}<br />Evidence: {e.evidence?.join(", ").replaceAll("_", " ") ?? "Not recorded"}</p><Link href={`/systems/${e.id.replace("product:", "")}`}>See this system ↗</Link></>}{e.type === "Capability" && <><p>{capabilitySupport(e)}</p><Link href={`/capabilities/${e.id.replace("cap:", "")}`}>Explore this capability ↗</Link></>}</details>)}</section>;
      })}</div>
      {!slice.entities.some(e => e.type === "Decision") && <p className="lens-note">Still unknown: the decision point and its owner. No decision is recorded for this context.</p>}
      <details className="provenance"><summary>Check the source connections ({slice.relationships.length})</summary><ul>{slice.relationships.map((r, i) => <li key={i}><span>{graph.entities.find(e => e.id === r.source)?.name}</span><code>{r.type}</code><span>{graph.entities.find(e => e.id === r.target)?.name}</span></li>)}</ul></details>
    </div>
  </details>;
}
