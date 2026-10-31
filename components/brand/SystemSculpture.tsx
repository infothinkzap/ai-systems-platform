"use client";

import { useState } from "react";

const studies = [
  { name: "Structure", title: "Make the repeatable reliable.", description: "Clear rules connect scattered inputs to a consistent process.", label: "RULES + DATA" },
  { name: "Judgment", title: "Keep people in the picture.", description: "Context, exceptions and consequential decisions need an accountable owner.", label: "PEOPLE + CONTEXT" },
  { name: "Intelligence", title: "Use AI where it earns its place.", description: "A bounded role, with evidence and review. Sometimes the right answer is no AI.", label: "APPROPRIATE INTELLIGENCE" },
];

export function SystemSculpture() {
  const [active, setActive] = useState(0);
  const study = studies[active];
  return <div className="system-sculpture" data-study={active}>
    <div className="sculpture-heading"><span>SYSTEM STUDY — 001</span><span className="sculpture-status"><i /> INTERACTIVE</span></div>
    <div className="sculpture-stage" aria-hidden="true">
      <svg viewBox="0 0 560 410" fill="none">
        <defs><linearGradient id="sculpture-line" x1="40" y1="150" x2="520" y2="290" gradientUnits="userSpaceOnUse"><stop stopColor="#789a85"/><stop offset=".52" stopColor="#c9f4aa"/><stop offset="1" stopColor="#56b68c"/></linearGradient></defs>
        <g stroke="#c6efaa" strokeOpacity=".09">{Array.from({length:12},(_,i)=><path key={i} d={`M${i*50} 0V410M0 ${i*40}H560`}/>)}</g>
        <g className="sculpture-contours" stroke="url(#sculpture-line)" strokeWidth="1.1">
          {Array.from({length:24},(_,i)=><path key={i} d={`M-20 ${54+i*11}C130 ${54+i*11} 138 ${355-i*5} 280 ${320-i*8}S405 ${25+i*13} 585 ${100+i*10}`}/>)}
        </g>
        <g className="sculpture-orbit" stroke="#d5f8ba" strokeOpacity=".5"><ellipse cx="280" cy="205" rx="113" ry="113"/><ellipse cx="280" cy="205" rx="139" ry="139" strokeDasharray="2 10" strokeOpacity=".25"/></g>
        <g className="sculpture-core"><circle cx="280" cy="205" r="37" fill="#153e30" stroke="#d5f8ba"/><path d="M263 205h34m-17-17v34" stroke="#c6efaa" strokeWidth="1.3"/><circle cx="280" cy="205" r="4" fill="#d5f8ba"/></g>
        <g fill="#d5f8ba"><circle className="sculpture-traveler" cx="121" cy="119" r="4"/><circle cx="421" cy="285" r="4"/><circle cx="387" cy="132" r="3"/></g>
        <g className="sculpture-annotations" fill="#bed4bf" fontSize="9" fontFamily="monospace" letterSpacing="1.5"><text x="28" y="50">INPUT / COMPLEXITY</text><text x="350" y="385">OUTPUT / CLARITY</text><text x="302" y="190">{active === 0 ? "RULES" : active === 1 ? "HUMAN" : "AI?"}</text></g>
      </svg>
      <span className="sculpture-axis">0{active + 1} / 03</span>
    </div>
    <div className="sculpture-tabs" role="group" aria-label="Explore system principles">{studies.map((item,index)=><button key={item.name} aria-pressed={active===index} onClick={()=>setActive(index)}><span>0{index+1}</span>{item.name}<span aria-hidden="true">↗</span></button>)}</div>
    <div className="sculpture-explanation" aria-live="polite"><p className="eyebrow">{study.label}</p><h2>{study.title}</h2><p>{study.description}</p></div>
    <p className="sculpture-caption">An illustration of our approach. Explore each principle.</p>
  </div>;
}
