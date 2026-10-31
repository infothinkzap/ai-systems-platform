type GuideKind = "mapping" | "capabilities" | "possibilities" | "services" | "evidence" | "missing";
const guides: Record<GuideKind, { index: string; title: string; copy: string; labels: string[] }> = {
  mapping: { index: "THE SYSTEM LENS", title: "Find the shape of the problem.", copy: "Describe the friction. Reveal the work. Compare what belongs where.", labels: ["DESCRIBE", "CONNECT", "COMPARE"] },
  capabilities: { index: "BUILDING BLOCKS", title: "The connection is the capability.", copy: "Information, reasoning and action become useful when they work together.", labels: ["INFORMATION", "REASONING", "ACTION"] },
  possibilities: { index: "POSSIBLE, NOT PROVEN", title: "One need. Several possible paths.", copy: "A pattern is a starting hypothesis. The right route depends on your constraints.", labels: ["YOUR NEED", "POSSIBLE ROUTES", "VALIDATE"] },
  services: { index: "FROM QUESTION TO DIRECTION", title: "Make the next step a deliberate one.", copy: "Understand the problem, shape a system and test the assumptions before committing.", labels: ["UNDERSTAND", "SHAPE", "TEST"] },
  evidence: { index: "FOLLOW THE EVIDENCE", title: "A record is the beginning of a claim.", copy: "Inspect the source, understand its scope and keep the missing evidence visible.", labels: ["RECORD", "SOURCE", "LIMITS"] },
  missing: { index: "UNCONNECTED PATH", title: "This path isn’t connected yet.", copy: "There’s still plenty to explore. Start again from the work or map a problem.", labels: ["YOU ARE HERE", "MISSING LINK", "A NEW PATH"] },
};

export function VisualGuide({ kind, compact = false }: { kind: GuideKind; compact?: boolean }) {
  const guide = guides[kind];
  return <figure className={`visual-guide guide-${kind}${compact ? " guide-compact" : ""}`}>
    <figcaption><span className="eyebrow">{guide.index}</span><h2>{guide.title}</h2><p>{guide.copy}</p><small>Illustrative guide</small></figcaption>
    <svg viewBox="0 0 540 230" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeOpacity=".1">{[60,120,180].map(y=><path key={y} d={`M20 ${y}H520`}/>)}{[90,180,270,360,450].map(x=><path key={x} d={`M${x} 20V195`}/>)}</g>
      {kind === "mapping" && <g stroke="currentColor"><g strokeOpacity=".4">{[65,90,115,140,165].map((y,i)=><path key={y} d={`M25 ${y}C120 ${y} 125 ${105+i*3} 215 ${105+i*3}S350 ${60+i*23} 515 ${60+i*23}`}/>)}</g><circle cx="267" cy="115" r="52" fill="var(--guide-bg)"/><circle cx="267" cy="115" r="35" strokeDasharray="2 5"/><path d="m303 151 35 35" strokeWidth="5"/><circle cx="267" cy="115" r="4" fill="currentColor"/></g>}
      {kind === "capabilities" && <g stroke="currentColor"><path d="M112 113h316" strokeDasharray="3 7"/>{[115,270,425].map((x,i)=><g key={x} transform={`translate(${x} 110)`}><path d="m0-54 47 27v54L0 54-47 27v-54Z" fill="var(--guide-bg)"/><path d="m-47-27 47 27 47-27M0 0v54" opacity=".4"/>{i===0?<path d="M-15-18h30M-15-8h30M-15 2h18"/>:i===1?<><circle cy="-12" r="14"/><path d="M-20-12h40M0-32v40"/></>:<path d="m-14-12 10 10 21-24" strokeWidth="2"/>}</g>)}</g>}
      {kind === "possibilities" && <g stroke="currentColor"><path d="M80 115h60c72 0 40-75 118-75h75M140 115h193M140 115c72 0 40 75 118 75h75"/><circle cx="80" cy="115" r="24" fill="var(--guide-bg)"/><circle cx="80" cy="115" r="7" fill="currentColor"/>{[40,115,190].map((y,i)=><g key={y}><rect x="332" y={y-20} width="98" height="40" rx="20" fill="var(--guide-bg)" strokeDasharray={i===1?undefined:"3 4"}/><path d={`M430 ${y}h48`} strokeDasharray="3 5"/><circle cx="486" cy={y} r="6"/></g>)}</g>}
      {kind === "services" && <g stroke="currentColor">{[0,1,2].map(i=><g key={i} transform={`translate(${90+i*175} ${128-i*25})`}><path d="m0-42 60 30-60 30-60-30Z" fill="var(--guide-bg)"/><path d="M-60-12v28L0 46l60-30v-28M0 18v28"/><text y="-8" textAnchor="middle" fill="currentColor" stroke="none" fontSize="13" fontFamily="monospace">0{i+1}</text>{i<2&&<path d="m66-13 38-11m-8-4 8 4-5 8" opacity=".6"/>}</g>)}</g>}
      {kind === "evidence" && <g stroke="currentColor">{[0,1,2].map(i=><g key={i} transform={`translate(${105+i*153} ${100+i*6}) rotate(${i*8-8})`}><rect x="-44" y="-60" width="88" height="120" rx="3" fill="var(--guide-bg)" strokeDasharray={i===2?"4 5":undefined}/><path d="M-25-28h50M-25-12h50M-25 4h32" opacity=".5"/>{i===2?<circle cy="34" r="9" strokeDasharray="2 3"/>:<path d="M-25 32h27"/>}</g>)}</g>}
      {kind === "missing" && <g stroke="currentColor"><path d="M35 115h150m170 0h150"/><circle cx="185" cy="115" r="7"/><circle cx="355" cy="115" r="7"/><path d="M201 115h138" strokeDasharray="3 9" opacity=".4"/><text x="270" y="130" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="monospace" fontSize="46">?</text></g>}
      <g fill="currentColor" fontSize="8" letterSpacing="1" fontFamily="monospace">{guide.labels.map((label,i)=><text key={label} x={50+i*178} y="220">{label}</text>)}</g>
    </svg>
  </figure>;
}
