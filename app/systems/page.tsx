import Link from "next/link";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { BrowseNav } from "@/components/work/BrowseNav";
import { WorkCollection } from "@/components/work/WorkCollection";
import { getGraph } from "@/lib/graph/queries";
import { workItems } from "@/lib/work";

export const metadata = { title: "Explore our work" };
export default function SystemsPage() {
  const graph=getGraph();
  return <div className="tw-home"><GlobalNav /><main className="tw-wrap browse-page"><BrowseNav /><p className="eyebrow">EXPLORE / NO FORM REQUIRED</p><h1>See what we’re building.<br />And what exists today.</h1><p className="browse-intro">Browse recorded work with its maturity and evidence intact. A deployment record does not establish measured outcomes or an external client relationship. Proposed new solutions live in a separate possibilities layer.</p><WorkCollection items={workItems(graph)} /><div className="browse-next"><h2>Have something different?</h2><Link href="/opportunities" className="tw-button">Explore possibilities ↗</Link><Link href="/think" className="text-link">Describe your problem ↗</Link><Link href="/explore" className="text-link">Detailed architecture explorer ↗</Link></div></main></div>;
}
