import { VisualGuide } from "@/components/brand/VisualGuide";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { BrowseNav } from "@/components/work/BrowseNav";
import { getGraph } from "@/lib/graph/queries";
import { relatedEntities, workItems } from "@/lib/work";
import { WorkCollection } from "@/components/work/WorkCollection";
import { capabilitySupport, capabilityReadiness, graphTargets, opportunityEntities } from "@/lib/graph/opportunities";

export function generateStaticParams() { return getGraph().entities.filter(e => e.type === "Capability").map(e => ({ id: e.id.replace("cap:", "") })); }
export default async function CapabilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const graph = getGraph();
  const capability = graph.entities.find(e => e.id === `cap:${id}` && e.type === "Capability");
  if (!capability || capability.type !== "Capability") notFound();
  const linked = relatedEntities(capability.id, graph);
  const systems = workItems(graph).filter(item => linked.some(e => e.id === item.system.id));
  const records = linked.filter(e => ["DataPrimitive", "DataSource", "Decision", "Action"].includes(e.type));
  const demonstrations=graph.relationships.filter(r=>r.target===capability.id&&r.type==="DEMONSTRATES").map(r=>graph.entities.find(e=>e.id===r.source)).filter(e=>e?.type==="Project").filter(e=>e.id!=="project:terrawave_platform");
  const possibilities=opportunityEntities(graph).filter(e=>graphTargets(graph,e.id,"MAY_REUSE").some(c=>c.id===capability.id));
  const readiness=capabilityReadiness(graph,capability.id);
  return <div className="tw-home"><GlobalNav /><main className="tw-wrap browse-page"><BrowseNav /><p className="eyebrow">CAPABILITY / {linked.find(e => e.type === "CapabilityGroup")?.name ?? "SYSTEM BUILDING BLOCK"}</p><h1>{capability.name}</h1><p className="status-tag">{capabilitySupport(capability)}</p><div className="readiness-note"><strong>{readiness?.name ?? "Delivery readiness unassessed"}</strong><p>{readiness?.description ?? "No production delivery commitment is established."}</p></div><p className="browse-intro">{capability.description ?? "Explore the systems and information connected to this capability in Terrawave’s knowledge graph."}</p><VisualGuide kind="capabilities" />{records.length > 0 && <section className="browse-panel"><h2>Connected information and decisions</h2><ul className="connection-chips">{records.map(e => <li key={e.id}><span>{e.type === "DataPrimitive" ? "Information" : e.type}</span>{e.name}</li>)}</ul></section>}<h2 className="browse-subtitle">Demonstrations and related system records</h2>{demonstrations.map(project=><p className="browse-intro" key={project.id}><Link href={`/work/${project.id.replace("project:","")}`}>{project.name} ↗</Link> · {project.maturity_status} · {project.engagement_type}</p>)}{systems.length ? <WorkCollection items={systems} /> : <p className="browse-intro">No direct system relationship is recorded yet. This is not evidence of a deployed capability.</p>}<section className="related-possibilities"><h2 className="browse-subtitle">Proposed reuse, not delivered features</h2><ul>{possibilities.slice(0,5).map(pattern=><li key={pattern.id}><Link href={`/opportunities/${pattern.id.replace("opportunity:","")}`}>{pattern.name} ↗</Link><small>Proposed · needs validation</small></li>)}</ul>{!possibilities.length && <p>No proposed reuse is recorded yet.</p>}</section><details className="provenance"><summary>Inspect recorded relationships</summary><ul>{graph.relationships.filter(r => r.source === capability.id || r.target === capability.id).map((r, i) => <li key={i}><span>{graph.entities.find(e => e.id === r.source)?.name}</span><code>{r.type}</code><span>{graph.entities.find(e => e.id === r.target)?.name}</span></li>)}</ul></details><Link href="/think" className="text-link">Discuss where this might fit in your problem ↗</Link></main></div>;
}
