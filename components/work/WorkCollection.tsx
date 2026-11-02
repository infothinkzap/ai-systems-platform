"use client";

import Link from "next/link";
import { type workItems } from "@/lib/work";
import { ProjectIdentity } from "@/components/brand/ProjectIdentity";

type Work = ReturnType<typeof workItems>;

export function WorkCollection({ items }: { items: Work }) {
  return <div className="work-browser">
    <p className="sr-only" role="status">{items.length} systems shown</p>
    <div className="work-grid">{items.map(({ system, workflows, problems, capabilities, href = system.type === "Project" ? `/work/${system.id.replace("project:", "")}` : `/systems/${system.id.replace("product:", "")}` }, index) => <article className="work-card" key={system.id}>
      <Link href={href} className="work-art-link" aria-label={`Explore ${system.name}`} tabIndex={-1}><ProjectIdentity id={system.id}/></Link>
      <div className="work-card-top"><span className="eyebrow">{system.type === "Project" ? "PROJECT" : "SYSTEM"} / {String(index + 1).padStart(2, "0")}</span></div>
      <Link href={href} className="work-card-title"><h3>{system.name}</h3><span aria-hidden>↗</span></Link>
      <p className="work-description">{system.type === "Project" ? system.description ?? system.scope : problems.length ? `Addresses ${problems.slice(0, 2).map(p => p.name.toLowerCase()).join(" and ")}.` : "An architecture recorded in Terrawave’s system knowledge."}</p>
      <div className="work-mini-map" aria-label="Recorded workflows, not execution order">{workflows.slice(0, 3).map(w => <span key={w.id}>{w.name}</span>)}</div>
      <div className="work-card-bottom"><Link href={href}>{system.type === "Project" ? "See the project" : "See the system"} ↗</Link>{capabilities[0] && <Link href={`/capabilities/${capabilities[0].id.replace("cap:", "")}`}>{capabilities[0].name} ↗</Link>}</div>
    </article>)}</div>
  </div>;
}
