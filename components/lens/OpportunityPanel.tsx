import Link from "next/link";
import type { SemanticGraph } from "@/lib/graph/types";
import type { ClarificationAnswers, OpportunityInterpretation } from "@/lib/opportunity-interpreter";
import { capabilityReadiness, capabilitySupport, opportunityEntities } from "@/lib/graph/opportunities";
import { OpportunityWorkflow } from "./OpportunityWorkflow";

export function OpportunityPanel({ result, graph, answers, onAnswer }: { result:OpportunityInterpretation; graph:SemanticGraph; answers:ClarificationAnswers; onAnswer:(id:string,value:string)=>void }) {
  const pattern = opportunityEntities(graph).find(e=>e.id===result.opportunityId);
  const work = graph.entities.filter(e=>result.relatedWorkIds.includes(e.id) && (e.type === "Product" || e.type === "Project"));
  const capabilities = graph.entities.filter(e=>e.type === "Capability").filter(e=>result.capabilityIds.includes(e.id));
  return <div className="opportunity-result" data-opportunity-id={result.opportunityId??""} data-status={result.status}>
    <div className="interpretation-card"><span className="status-tag">{result.steps.length ? "Proposed · concept · needs validation" : "More context needed"}</span><p className="eyebrow opportunity-kicker">WHAT WE UNDERSTOOD</p><h2>{result.title}</h2><p>{result.understood}</p>
      <p className="small-note">Your description is reported information, not a verified fact. {result.steps.length ? "The workflow below is a possibility, not a claim that this solution has been built." : "No unrelated product or capability has been selected."}</p>
      {work.length > 0 && <div className="known-foundations"><p className="eyebrow">RELATED WORK / SCOPE MAY DIFFER</p>{work.map(item=><Link key={item.id} href={item.type==="Project"?`/work/${item.id.replace("project:","")}`:`/systems/${item.id.replace("product:","")}`}>{item.name} <small>{item.type==="Product"?item.maturity_status:item.type==="Project"?item.maturity_status:""}{item.type==="Product"&&item.deployment_scope=== "limited_capacity"?" · limited capacity":""}</small> ↗</Link>)}</div>}
      {!!result.steps.length && !work.length && <p className="lens-note">No existing Terrawave implementation of this exact opportunity is recorded. That does not mean it cannot be explored.</p>}
    </div>
    {result.steps.length > 0 && <section className="proposed-workflow"><p className="eyebrow">A POSSIBLE SYSTEM / {result.status === "inferred"?"INFERRED STEPS":"PROPOSED PATTERN"}</p><h3>How it might work.</h3><p className="lens-note">Candidate responsibilities are shown at each step. Expand a step for its limits. AI is one possible role; approval and deterministic checks remain explicit.</p><OpportunityWorkflow steps={result.steps} /></section>}
    <section className="opportunity-questions"><p className="eyebrow">WHAT WE NEED TO KNOW NEXT</p>
      {pattern ? <div className="clarification-fields">{pattern.clarifications.slice(0,2).map(q=><label key={q.id}>{q.question}{q.options.length ? <select value={answers[q.id]??"unknown"} onChange={e=>onAnswer(q.id,e.target.value)}>{q.options.map(option=><option value={option.value} key={option.value}>{option.label}</option>)}</select> : <input maxLength={300} value={answers[q.id]??""} onChange={e=>onAnswer(q.id,e.target.value)} placeholder="A short answer, or leave it open" />}</label>)}</div> : <ul>{result.unknowns.slice(0,2).map(question=><li key={question}>{question}</li>)}</ul>}
      <p className="small-note">Answers are your working assumptions, not verified evidence. Leave out private records; unanswered questions remain open.</p>
    </section>
    {result.steps.length > 0 && <details className="lens-disclosure"><summary><span>Risks, scope and reusable foundations</span><small>Known experience, new work and validation requirements</small></summary><div className="disclosure-body">
      <div className="opportunity-facts"><section><h3>Known</h3><p>Your description and the graph’s recorded work/capabilities. These do not establish this workflow in your business.</p></section><section><h3>Assumed</h3><p>{pattern?.assumed_current_workflow ?? "The displayed steps are a provisional review flow; inputs and operational sequence are unconfirmed."}</p></section><section><h3>Still unknown</h3><ul>{result.unknowns.length?result.unknowns.map(q=><li key={q}>{q}</li>):<li>Answers still need to be checked against actual records and the workflow owner.</li>}</ul></section></div>
      <h3>Possible failure modes</h3><ul className="risk-list">{result.risks.map(risk=><li key={risk}>{risk}</li>)}</ul>
      <h3>A realistic first version</h3><p>{result.mvp}</p>
      <h3>Capabilities that might be reused</h3><ul className="support-list">{capabilities.map(cap=><li key={cap.id}><Link href={`/capabilities/${cap.id.replace("cap:","")}`}>{cap.name} ↗</Link><small>{capabilitySupport(cap)}<br />{capabilityReadiness(graph,cap.id)?.name ?? "Readiness unassessed"}</small></li>)}</ul>
      <h3>Validate before committing</h3><ul className="risk-list">{result.validation.map(q=><li key={q}>{q}</li>)}</ul>
      <p className="small-note">{result.matchExplanation}</p>{pattern&&<Link href={`/opportunities/${pattern.id.replace("opportunity:","")}`} className="text-link">Inspect this pattern and its graph references ↗</Link>}
    </div></details>}
  </div>;
}
