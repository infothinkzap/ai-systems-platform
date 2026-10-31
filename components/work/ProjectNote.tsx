import Link from "next/link";
import type { SemanticGraph } from "@/lib/graph/types";

export function ProjectNote({graph}:{graph:SemanticGraph}) {
  const project=graph.entities.find(e=>e.id==="project:terrawave_platform"&&e.type==="Project");
  if(!project || project.type !== "Project")return null;
  return <aside className="project-note"><div><p className="eyebrow">DEMONSTRATED HERE / {project.maturity_status} / {project.engagement_type}</p><h2>Websites and interactive software.</h2><p>This platform is a working local example: a responsive website, interactive discovery and visual document generation. It does not establish readiness for every web application.</p></div><Link href="/work/terrawave_platform">Inspect the prototype and evidence ↗</Link></aside>;
}
