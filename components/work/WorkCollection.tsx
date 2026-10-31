"use client";

import { useState } from "react";
import Link from "next/link";
import { maturityLabel, type workItems } from "@/lib/work";
import { ProjectIdentity } from "@/components/brand/ProjectIdentity";

type Work = ReturnType<typeof workItems>;
const filters = ["All work", "In use", "In progress", "Concepts"] as const;

export function WorkCollection({ items }: { items: Work }) {
  const [filter, setFilter] = useState<typeof filters[number]>("All work");
  const visible = items.filter(({ system }) => filter === "All work" ||
    (filter === "In use" && ["deployed", "production"].includes(system.maturity_status ?? "")) ||
    (filter === "In progress" && ["prototype", "building"].includes(system.maturity_status ?? "")) ||
    (filter === "Concepts" && system.maturity_status === "concept"));

  return <div className="work-browser">
    <div className="work-filters" role="group" aria-label="Filter work by maturity">
      {filters.map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}
    </div>
    <p className="sr-only" role="status">{visible.length} systems shown</p>
    <div className="work-grid">{visible.map(({ system, workflows, problems, capabilities, evidence = [], href = system.type === "Project" ? `/work/${system.id.replace("project:", "")}` : `/systems/${system.id.replace("product:", "")}` }, index) => <article className="work-card" key={system.id}>
      <Link href={href} className="work-art-link" aria-label={`Explore ${system.name}`} tabIndex={-1}><ProjectIdentity id={system.id}/></Link>
      <div className="work-card-top"><span className="eyebrow">{system.type === "Project" ? "PROJECT" : "SYSTEM"} / {String(index + 1).padStart(2, "0")}</span><span className="status-tag">{maturityLabel(system)}</span></div>
      <Link href={href} className="work-card-title"><h3>{system.name}</h3><span aria-hidden>↗</span></Link>
      <p className="work-description">{system.type === "Project" ? system.description ?? system.scope : problems.length ? `Addresses ${problems.slice(0, 2).map(p => p.name.toLowerCase()).join(" and ")}.` : "An architecture recorded in Terrawave’s system knowledge."}</p>
      <div className="work-mini-map" aria-label="Recorded workflows, not execution order">{workflows.slice(0, 3).map(w => <span key={w.id}>{w.name}</span>)}{!workflows.length && <span>Workflow not yet recorded</span>}</div>
      <p className="work-proof">{evidence.length ? `Evidence recorded: ${evidence.join(" / ").replaceAll("_", " ")}.` : "Evidence not recorded. Deployment alone does not prove business outcomes."}</p>
      <div className="work-card-bottom"><Link href={href}>{system.type === "Project" ? "See the project" : "See the system"} ↗</Link>{capabilities[0] && <Link href={`/capabilities/${capabilities[0].id.replace("cap:", "")}`}>{capabilities[0].name} ↗</Link>}</div>
    </article>)}</div>
  </div>;
}
