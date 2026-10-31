import { VisualGuide } from "@/components/brand/VisualGuide";
import Link from "next/link";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { BrowseNav } from "@/components/work/BrowseNav";
import { getGraph } from "@/lib/graph/queries";
import { opportunityEntities } from "@/lib/graph/opportunities";

export const metadata={title:"Proposed possibilities"};
export default function OpportunitiesPage() {
  const patterns=opportunityEntities(getGraph());
  const categories=[...new Set(patterns.map(e=>e.category))];
  return <div className="tw-home"><GlobalNav /><main className="tw-wrap browse-page"><BrowseNav /><p className="eyebrow">LAYER C / PROPOSED POSSIBILITIES</p><h1>Not in the portfolio.<br />Still worth exploring.</h1><p className="browse-intro">Start with a workflow, not a promise. These are proposed solution patterns, including conventional software and creative production. Every one is a concept that needs validation; none is a deployment or delivery commitment.</p><VisualGuide kind="possibilities" /><Link href="/think" className="tw-button">Describe something different ↗</Link><div className="possibility-groups">{categories.map(category=><section key={category}><h2>{category}</h2><ul>{patterns.filter(p=>p.category===category).map(pattern=><li key={pattern.id}><Link href={`/opportunities/${pattern.id.replace("opportunity:","")}`}><strong>{pattern.name}</strong><span>Proposed · needs validation ↗</span></Link></li>)}</ul></section>)}</div></main></div>;
}
