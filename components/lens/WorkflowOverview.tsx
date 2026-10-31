import { ModeGlyph } from "@/components/brand/ModeGlyph";
import { modeLabels } from "@/lib/work";
import type { IntelligenceMode } from "@/lib/graph/types";

export function WorkflowOverview({ steps }: { steps: { id: string; name: string; mode: IntelligenceMode; provenance?: "proposed" | "inferred" }[] }) {
  if (!steps.length) return null;
  return <figure className="workflow-overview"><figcaption><span className="eyebrow">{steps.some(step=>step.provenance==="inferred")?"INFERRED / TO VALIDATE":"PROPOSED / SYSTEM AT A GLANCE"}</span><span>{steps.length} connected steps · expand the list below for details</span></figcaption><div className="workflow-overview-rail" tabIndex={0} role="region" aria-label="Workflow overview; scroll horizontally to see all steps"><ol>{steps.map((step,index)=><li key={step.id} data-mode={step.mode}><span className="overview-number">{String(index+1).padStart(2,"0")}</span><span className="overview-symbol"><ModeGlyph mode={step.mode}/></span><span className="overview-role">{modeLabels[step.mode].short}</span><span className="overview-name">{step.name}</span></li>)}</ol></div><p className="workflow-scroll-hint">Scroll sideways to follow the sequence →</p></figure>;
}
