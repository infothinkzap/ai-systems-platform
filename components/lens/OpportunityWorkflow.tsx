import type { OpportunityStep } from "@/lib/opportunity-interpreter";
import { modeLabels } from "@/lib/work";
import { WorkflowOverview } from "./WorkflowOverview";
import { ModeGlyph } from "@/components/brand/ModeGlyph";

export function OpportunityWorkflow({ steps }: { steps: OpportunityStep[] }) {
  return <><WorkflowOverview steps={steps}/><ol className="opportunity-flow" aria-label="Proposed workflow in sequence">{steps.map((step,index) => <li key={step.id}>
    <span className="step-number" aria-hidden>{String(index+1).padStart(2,"0")}</span>
    <details><summary><span>{step.name}</span><small className={`allocation-tag allocation-${step.mode.replaceAll(" ","-").toLowerCase()}`}><ModeGlyph mode={step.mode}/>{modeLabels[step.mode].short}</small></summary><p>{step.responsibility}</p><p className="small-note">{step.provenance === "inferred" ? "Inferred step to validate" : "Proposed pattern step; not an implemented system"}</p></details>
  </li>)}</ol></>;
}
