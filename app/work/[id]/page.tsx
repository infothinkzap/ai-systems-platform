import Link from "next/link";
import { notFound } from "next/navigation";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { BrowseNav } from "@/components/work/BrowseNav";
import { getGraph } from "@/lib/graph/queries";
import { graphTargets, capabilitySupport } from "@/lib/graph/opportunities";
import { ProjectIdentity } from "@/components/brand/ProjectIdentity";

export function generateStaticParams(){return getGraph().entities.filter(e=>e.type==="Project").map(e=>({id:e.id.replace("project:","")}));}
export default async function WorkPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;const graph=getGraph();const project=graph.entities.find(e=>e.id===`project:${id}`);if(!project||project.type!=="Project")notFound();
  const capabilities=graphTargets(graph,project.id,"DEMONSTRATES").filter(e=>e.type==="Capability");
  const evidence=graphTargets(graph,project.id,"HAS_EVIDENCE").filter(e=>e.type==="Evidence");
  const workflows=graphTargets(graph,project.id,"SUPPORTS_WORKFLOW").filter(e=>e.type==="Workflow");
  return <div className="tw-home"><GlobalNav /><main className="tw-wrap browse-page"><BrowseNav/><ProjectIdentity id={project.id} className="project-identity-detail"/><p className="eyebrow">LAYER A / DEMONSTRATED LOCAL WORK</p><h1>{project.name}</h1><p className="status-tag">{project.maturity_status} · {project.engagement_type === "unverified" ? "engagement unverified" : `${project.engagement_type} project`} · {project.epistemic_status}</p><p className="browse-intro">{project.scope}</p>{project.technologies?.length ? <p>Built with {project.technologies.join(", ")}.</p> : null}{workflows.length ? <section className="browse-panel"><h2>Implemented in source</h2><ul>{workflows.map(workflow=><li key={workflow.id}>{workflow.name}</li>)}</ul></section> : null}<h2 className="browse-subtitle">What this demonstrates</h2><ul className="support-list">{capabilities.map(cap=><li key={cap.id}><Link href={`/capabilities/${cap.id.replace("cap:","")}`}>{cap.name} ↗</Link><small>{capabilitySupport(cap)}</small></li>)}</ul><section className="browse-panel"><h2>Available evidence</h2>{evidence.map(item=><div key={item.id}><h3>{item.name}</h3><p>{item.description}</p><ul className="source-paths">{item.source_refs.map(path=><li key={path}><code>{path}</code></li>)}</ul></div>)}</section><p className="browse-intro">These are repository evidence references, not independently verified customer results. Public hosting, commercial packaging, staffing and production delivery are not established here.</p><Link href="/systems" className="tw-button">Explore all work ↗</Link></main></div>;
}
