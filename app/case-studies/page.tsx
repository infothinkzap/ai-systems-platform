import { VisualGuide } from "@/components/brand/VisualGuide";
import Link from "next/link";
import { GlobalNav } from "@/components/nav/GlobalNav";
import { BrowseNav } from "@/components/work/BrowseNav";
import { getGraph } from "@/lib/graph/queries";
import { workItems, maturityLabel } from "@/lib/work";

export const metadata = { title: "Evidence & implementation notes" };
export default function EvidencePage() {
  const items = workItems(getGraph()).filter(({ system }) => ["deployed", "production"].includes(system.maturity_status ?? ""));
  return <div className="tw-home"><GlobalNav /><main className="tw-wrap browse-page"><BrowseNav /><p className="eyebrow">EVIDENCE / WHAT WE CAN SAY TODAY</p><h1>Show the work.<br />Keep the limits visible.</h1><p className="browse-intro">There are no published, measured customer case studies in the current knowledge graph. These are implementation notes for systems recorded as deployed, with the evidence and gaps kept separate.</p><VisualGuide kind="evidence" /><div className="evidence-notes">{items.map(({ system, workflows, evidence, href }) => <article key={system.id}><span className="status-tag">{maturityLabel(system)}</span><h2>{system.name}</h2><dl><dt>Recorded scope</dt><dd>{workflows.map(w => w.name).join(" · ") || "Workflow scope not recorded"}</dd><dt>Available evidence</dt><dd>{evidence.length ? evidence.join(" / ").replaceAll("_", " ") : "No evidence category recorded"}</dd><dt>Limitations</dt><dd>No measured outcome, ROI or independent customer validation is attached to this graph record.</dd></dl><Link href={`${href}#evidence`}>Inspect the system and its evidence ↗</Link></article>)}</div></main></div>;
}
