import { VisualGuide } from "@/components/brand/VisualGuide";
import Link from "next/link";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { BrowseNav } from "@/components/work/BrowseNav";
import { getGraph } from "@/lib/graph/queries";
import { relatedEntities } from "@/lib/work";
import { capabilitySupport } from "@/lib/graph/opportunities";

export const metadata = { title: "Capabilities and delivery readiness" };
const labels: Record<string,string> = { "capgroup:build":"Build websites and business software", "capgroup:understand":"Understand information and work", "capgroup:reason":"Research, reasoning and review", "capgroup:execute":"Coordinate reliable workflows", "capgroup:create":"Create content and campaigns" };
export default function CapabilitiesPage() {
  const graph = getGraph();
  const order=["capgroup:build","capgroup:understand","capgroup:reason","capgroup:execute","capgroup:create"];
  return <div className="tw-home"><GlobalNav /><main className="tw-wrap browse-page"><BrowseNav /><p className="eyebrow">LAYER B / REUSABLE CAPABILITIES</p><h1>More than AI automation.<br />Clear about what is proven.</h1><p className="browse-intro">Explore conventional software, information workflows and creative possibilities. Local demonstrations, graph-described capabilities and candidates are labelled separately. None of these labels means a service is packaged, priced or staffed for delivery.</p><VisualGuide kind="capabilities" /><div className="capability-families">{order.map(id=>{
    const group=graph.entities.find(e=>e.id===id); if(!group)return null;
    const caps=relatedEntities(id,graph,"Capability").filter(e=>e.type==="Capability");
    return <details key={id} open={id==="capgroup:build"}><summary><strong>{labels[id]??group.name}</strong><span>{caps.length} capabilities</span></summary><ul>{caps.map(cap=><li key={cap.id}><Link href={`/capabilities/${cap.id.replace("cap:","")}`}>{cap.name} ↗</Link><small>{capabilitySupport(cap)}</small></li>)}</ul></details>;
  })}</div><div className="browse-next"><h2>Combine them around a need.</h2><Link href="/opportunities" className="tw-button">Explore proposed possibilities ↗</Link></div></main></div>;
}
