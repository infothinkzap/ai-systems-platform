"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { SemanticGraph } from "@/lib/graph/types";
import { recommend, initialAssumptions, type Assumptions, type Mode } from "@/lib/lens";
import { interpretOpportunity, relevantKnownContexts, type ClarificationAnswers } from "@/lib/opportunity-interpreter";
import { modeLabels } from "@/lib/work";
import { GraphContext } from "./GraphContext";
import { AllocationPanel } from "./AllocationPanel";
import { BriefDownload } from "./BriefDownload";
import { OpportunityPanel } from "./OpportunityPanel";
import { VisualGuide } from "@/components/brand/VisualGuide";

const examples = [
  { label: "Invoices take hours to reconcile", text: "Our team spends hours on manual reconciliation of invoices and GST records." },
  { label: "Leads slip through the cracks", text: "Leads are lost across fragmented conversations." },
  { label: "Stock records are hard to trust", text: "Manual inventory tracking slows our store operations." },
  { label: "Reports using my astrology methods", text: "I need something that can make astrological reports for my clients based on my methods." },
  { label: "A website for my business", text: "I need a clear website for my business and services." },
];

export function SystemLens({ graph, initialInput = "" }: { graph: SemanticGraph; initialInput?:string }) {
  const [input, setInput] = useState(initialInput);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [context, setContext] = useState("");
  const [assumptions, setAssumptions] = useState<Assumptions>(initialAssumptions);
  const [selected, setSelected] = useState<Mode | null>(null);
  const [answers, setAnswers] = useState<ClarificationAnswers>({});
  const resultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const opportunity = useMemo(()=>interpretOpportunity(submitted??"",graph,answers),[submitted,graph,answers]);
  const matches = submitted ? relevantKnownContexts(submitted, graph, opportunity.relatedWorkIds) : [];
  const recommendation = recommend(assumptions);
  const active = selected ?? recommendation.mode;

  function map(value: string) {
    if (!value.trim()) return;
    setInput(value); setSubmitted(value.trim()); setEditing(false);
    const interpreted = interpretOpportunity(value,graph);
    setContext(relevantKnownContexts(value,graph,interpreted.relatedWorkIds)[0]?.id??"");
    if(interpreted.opportunityId!==opportunity.opportunityId) setAnswers({});
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  function edit() {
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }
  function restart() {
    setSubmitted(null); setInput(""); setContext(""); setEditing(false);
    setAssumptions(initialAssumptions); setSelected(null);
    setAnswers({});
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return <section id="lens" className="lens-section simple-lens"><div className="tw-wrap lens-wrap">
    <div className="lens-top"><p className="eyebrow">MAP YOUR PROBLEM</p><Link href="/systems">Just browsing? Explore our work ↗</Link></div>
    {(submitted === null || editing) && <>
      <div className="lens-intro-grid"><div><h1>What’s not working?</h1><p className="lens-intro">Start with one thing that slows your business down.</p></div><VisualGuide kind="mapping" compact /></div>
      {initialInput&&submitted===null&&<p className="lens-note">This example comes from a proposed pattern. Edit it to describe your own work before continuing.</p>}
      <form onSubmit={e => { e.preventDefault(); map(input); }} className="problem-form">
        <label htmlFor="problem" className="sr-only">What’s not working?</label>
        <textarea ref={inputRef} id="problem" maxLength={2000} required value={input} onChange={e => setInput(e.target.value)} placeholder="For example: our team spends hours matching invoices by hand." />
        <div className="form-bottom"><span>A short description is enough. Leave out private records.</span><button className="tw-button" disabled={!input.trim()} type="submit">Find a starting point ↗</button></div>
      </form>
      <div className="example-row"><span className="eyebrow">Try an example</span>{examples.map(example => <button key={example.label} onClick={() => map(example.text)}>{example.label} ↗</button>)}</div>
      {editing && <button className="text-link" onClick={() => setEditing(false)}>Keep the previous description</button>}
    </>}
    {submitted !== null && !editing && <div ref={resultRef} tabIndex={-1} className="lens-result simple-result" aria-label="Your starting point">
      <div className="result-title"><p className="eyebrow">YOUR STARTING POINT</p><div className="result-actions"><button onClick={edit}>Edit problem</button><button onClick={restart}>Start over</button></div></div>
      <h1 className="visitor-quote">“{submitted.length > 280 ? submitted.slice(0, 280) + "…" : submitted}”</h1>
      {submitted.length > 280 && <details className="interpretation-correction"><summary>Read the full problem statement</summary><p className="lens-note">{submitted}</p></details>}
      <OpportunityPanel result={opportunity} graph={graph} answers={answers} onAnswer={(id,value)=>setAnswers(previous=>({...previous,[id]:value}))} />
      {matches.length > 0 && <details className="interpretation-correction"><summary>Change the related work context</summary><label htmlFor="context" className="sr-only">Choose a starting context</label><select id="context" value={context} onChange={e=>setContext(e.target.value)}><option value="">None of these / leave it open</option>{matches.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></details>}
      {opportunity.steps.length>0&&<div className="quick-finding" aria-live="polite"><span className="eyebrow">WORKING SUGGESTION</span><h3>{recommendation.mode ? modeLabels[recommendation.mode].label : "Follow one real piece of work first."}</h3><p>{recommendation.mode ? recommendation.reason : "Identify what comes in, who decides and where the handoff gets stuck. We don’t yet know enough to suggest automation."}</p></div>}
      {context && <GraphContext key={context} context={context} graph={graph} />}
      {opportunity.steps.length>0&&<><AllocationPanel assumptions={assumptions} active={active} onAssumptions={a => { setAssumptions(a); setSelected(null); }} onMode={setSelected} />
      <BriefDownload input={submitted} context={context || null} assumptions={assumptions} selected={active} graph={graph} answers={answers} /></>}
    </div>}
  </div></section>;
}
