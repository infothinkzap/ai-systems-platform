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
  return <div className="tw-home"><GlobalNav /><main className="tw-wrap browse-page"><BrowseNav/><ProjectIdentity id={project.id} className="project-identity-detail"/><p className="eyebrow">PROJECT / A CLOSER LOOK</p><h1>{project.name}</h1><p className="browse-intro">{project.description??project.scope}</p>{project.features?.length ? <section className="browse-panel"><h2>What’s inside</h2><ul className="connection-chips">{project.features.map(feature=><li key={feature}>{feature}</li>)}</ul></section> : null}{project.technologies?.length ? <p>Built with {project.technologies.join(", ")}.</p> : null}{workflows.length ? <section className="browse-panel"><h2>Implemented in source</h2><ul>{workflows.map(workflow=><li key={workflow.id}>{workflow.name}</li>)}</ul></section> : null}{capabilities.length > 0 && <><h2 className="browse-subtitle">Connected capabilities</h2><ul className="support-list">{capabilities.map(cap=><li key={cap.id}><Link href={`/capabilities/${cap.id.replace("cap:","")}`}>{cap.name} ↗</Link><small>{capabilitySupport(cap)}</small></li>)}</ul></>}<details className="browse-panel"><summary>Implementation notes and sources</summary><p>{project.scope}</p>{evidence.map(item=><div key={item.id}><h3>{item.name}</h3><p>{item.description}</p><ul className="source-paths">{item.source_refs.map(path=><li key={path}><code>{path}</code></li>)}</ul></div>)}<p className="browse-intro">These references describe implementation sources, not independently verified customer outcomes.</p></details><Link href="/systems" className="tw-button">Explore all work ↗</Link></main></div>;
}
