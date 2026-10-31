import Link from "next/link";
import { notFound } from "next/navigation";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { BrowseNav } from "@/components/work/BrowseNav";
import { OpportunityWorkflow } from "@/components/lens/OpportunityWorkflow";
import { getGraph } from "@/lib/graph/queries";
import { opportunityDetails, opportunityEntities, capabilitySupport } from "@/lib/graph/opportunities";

export function generateStaticParams(){return opportunityEntities(getGraph()).map(e=>({id:e.id.replace("opportunity:","")}));}
export default async function OpportunityPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params; const graph=getGraph(); const pattern=opportunityEntities(graph).find(e=>e.id===`opportunity:${id}`); if(!pattern)notFound();
  const data=opportunityDetails(graph,pattern);
  return <div className="tw-home"><GlobalNav /><main className="tw-wrap browse-page opportunity-page"><BrowseNav /><p className="eyebrow">LAYER C / {pattern.category}</p><h1>{pattern.name}</h1><p className="status-tag">Proposed · concept · hypothesis · needs validation</p><p className="browse-intro">{pattern.problem_statement}</p><Link href={`/think?opportunity=${id}`} className="tw-button">Scope this opportunity ↗</Link><p className="small-note">Evidence: internal reasoning. This is a design pattern, not an implemented Terrawave product or verified delivery capability.</p>
    <section className="browse-panel"><h2>A possible workflow</h2><p className="lens-note">Candidate order and responsibilities. Expand a step for its limits.</p><OpportunityWorkflow steps={data.steps}/></section>
    <div className="opportunity-facts"><section><h2>Inputs to confirm</h2><ul>{data.inputs.map(e=><li key={e.id}>{e.name}</li>)}</ul></section><section><h2>Possible outputs</h2><ul>{data.outputs.map(e=><li key={e.id}>{e.name}</li>)}</ul></section><section><h2>Intended users</h2><ul>{data.users.map(e=><li key={e.id}>{e.name}</li>)}</ul></section></div>
    <details className="lens-disclosure"><summary><span>Assumed current state</span><small>Not verified for your operation</small></summary><p className="lens-note disclosure-body">{pattern.assumed_current_workflow}</p></details>
    <section className="opportunity-validation"><h2>Validate before building</h2><ul className="risk-list">{data.validation.map(e=><li key={e.id}>{e.name}</li>)}</ul><h3>Risks and limitations</h3><ul className="risk-list">{data.risks.map(e=><li key={e.id}>{e.description??e.name}</li>)}</ul><h3>A realistic first version</h3><p>{pattern.mvp_boundary}</p></section>
    <section><h2 className="browse-subtitle">Possible reusable foundations</h2><ul className="support-list">{data.capabilities.map(cap=><li key={cap.id}><Link href={`/capabilities/${cap.id.replace("cap:","")}`}>{cap.name} ↗</Link><small>{capabilitySupport(cap)}. Delivery readiness remains unassessed.</small></li>)}</ul>{data.relatedWork.length ? <p className="browse-intro">Related records, not proof this exact workflow is built: {data.relatedWork.map(e=><Link key={e.id} href={e.type==="Project"?`/work/${e.id.replace("project:","")}`:`/systems/${e.id.replace("product:","")}`}>{e.name} ↗ </Link>)}</p>:<p className="browse-intro">No implementation of this exact pattern is recorded.</p>}</section>
    <details className="provenance"><summary>Inspect pattern source IDs and relationships</summary><code>{pattern.id}</code><ul>{graph.relationships.filter(r=>r.source===pattern.id).map((r,i)=><li key={i}><span>{pattern.name}</span><code>{r.type}</code><span>{graph.entities.find(e=>e.id===r.target)?.name}</span></li>)}</ul></details>
  </main></div>;
}
