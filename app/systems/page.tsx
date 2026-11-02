import Link from "next/link";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { BrowseNav } from "@/components/work/BrowseNav";
import { WorkCollection } from "@/components/work/WorkCollection";
import { getGraph } from "@/lib/graph/queries";
import { workItems } from "@/lib/work";

export const metadata = { title: "Explore our work" };
export default function SystemsPage() {
  const graph=getGraph();
  return <div className="tw-home"><GlobalNav /><main className="tw-wrap browse-page"><BrowseNav /><p className="eyebrow">EXPLORE / NO FORM REQUIRED</p><h1>Projects with purpose.<br />Systems with a point of view.</h1><p className="browse-intro">Explore software for finance, studio operations, research, learning and personal practice. See what each project is for and the workflows it brings together.</p><WorkCollection items={workItems(graph)} /><div className="browse-next"><h2>Have something different?</h2><Link href="/opportunities" className="tw-button">Explore possibilities ↗</Link><Link href="/think" className="text-link">Describe your problem ↗</Link><Link href="/explore" className="text-link">Detailed architecture explorer ↗</Link></div></main></div>;
}
