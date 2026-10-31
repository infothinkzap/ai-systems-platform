import { VisualGuide } from "@/components/brand/VisualGuide";
import Link from "next/link";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { BrowseNav } from "@/components/work/BrowseNav";
import { getGraph } from "@/lib/graph/queries";
import { relatedEntities } from "@/lib/work";

export const metadata = { title: "Services" };
export default function ServicesPage() {
  const graph = getGraph();
  return <div className="tw-home"><GlobalNav /><main className="tw-wrap browse-page"><BrowseNav /><p className="eyebrow">WAYS TO WORK TOGETHER</p><h1>Start with the problem.<br />Choose the work it needs.</h1><p className="browse-intro">These services are recorded in Terrawave’s knowledge graph. Scope, delivery and suitability are determined in discovery; AI is not a requirement.</p><VisualGuide kind="services" /><div className="service-list">{graph.entities.filter(e => e.type === "Service").map(service => <article key={service.id}><h2>{service.name}</h2><p>{service.description ?? `Recorded connection: ${relatedEntities(service.id, graph).map(e => e.name).join(", ") || "No specific problem or system linked yet"}.`}</p><Link href="/think">Map a problem for discovery ↗</Link></article>)}</div></main></div>;
}
