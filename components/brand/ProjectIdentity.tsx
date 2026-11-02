const identities: Record<string, { name: string; category: string; theme: string; symbol: string; note: string }> = {
  counterpoint: { name: "Counterpoint", category: "RESEARCH / ANOTHER PERSPECTIVE", theme: "counterpoint", symbol: "debate", note: "There is more than one side to a claim." },
  ai_cfo: { name: "AI CFO", category: "FINANCIAL INTELLIGENCE", theme: "cfo", symbol: "contour", note: "A clearer financial picture." },
  ca_automation: { name: "CA / Automation", category: "ACCOUNTING SYSTEMS", theme: "ca", symbol: "register", note: "Bring the records together." },
  manaswini_operations: { name: "Manaswini", category: "STUDIO OPERATIONS", theme: "manaswini", symbol: "weave", note: "The fabric of a working studio." },
  lead_intelligence: { name: "Lead Intelligence", category: "CONVERSATION + CONTEXT", theme: "lead", symbol: "route", note: "Every conversation has a next step." },
  manifestos: { name: "ManifestOS", category: "INTENTION INTO PRACTICE", theme: "manifest", symbol: "sun", note: "A little intention. A daily practice." },
  terrawave_platform: { name: "terrawave.", category: "THE CONNECTED PLATFORM", theme: "terra", symbol: "wave", note: "Find the system beneath the surface." },
  examos: { name: "ExamOS", category: "LEARNING SYSTEMS", theme: "exam", symbol: "steps", note: "A connected path through preparation." },
  selfos: { name: "SelfOS", category: "PERSONAL CONTEXT", theme: "self", symbol: "orbit", note: "Bring personal context together." },
};

export function ProjectIdentity({ id, className = "" }: { id: string; className?: string }) {
  const key = id.split(":").at(-1) ?? "";
  const identity = identities[key];
  if (!identity) return null;
  return <div className={`project-identity identity-${identity.theme} ${className}`} aria-hidden="true">
    <span className="identity-category">{identity.category}</span>
    <svg className="identity-art" viewBox="0 0 600 320" fill="none">
      {identity.symbol === "debate" && <g transform="translate(398 153)" stroke="currentColor"><circle r="102" strokeOpacity=".25"/><path d="M-13-80a82 82 0 0 0 0 160M13-80a82 82 0 0 1 0 160" strokeWidth="4"/><path d="M-65-25H65m-13-12 13 12-13 12M65 25H-65m13-12-13 12 13 12" strokeWidth="2"/><path d="M0-105v210" strokeDasharray="2 8" strokeOpacity=".5"/></g>}
      {identity.symbol === "weave" && <g transform="translate(390 162) rotate(-38)">{Array.from({length:9},(_,i)=><g key={i}><rect x={-103+i*23} y="-105" width="12" height="210" rx="6" fill="currentColor" opacity={i%2 ? ".22" : ".7"}/><path d={`M-108 ${-90+i*23}H108`} stroke="currentColor" strokeWidth="7" opacity=".32"/></g>)}</g>}
      {identity.symbol === "register" && <g transform="translate(378 158) rotate(-12)">{Array.from({length:7},(_,i)=><rect key={i} x={-90+i*10} y={-105+i*10} width="175" height="205" rx="3" stroke="currentColor" strokeOpacity={.2+i*.1}/>)}<path d="M-22-24h61M-22-3h61M-22 18h35" stroke="currentColor" strokeWidth="4"/><path d="m18 57 13 13 30-35" stroke="currentColor" strokeWidth="5"/></g>}
      {identity.symbol === "contour" && <g transform="translate(395 157)">{Array.from({length:25},(_,i)=><ellipse key={i} rx={28+i*3.2} ry={105-i*2.3} transform={`rotate(${i*7.2})`} stroke="currentColor" strokeOpacity={.25+i*.025}/>)}<circle r="17" fill="currentColor"/></g>}
      {identity.symbol === "sun" && <g transform="translate(397 158)">{Array.from({length:40},(_,i)=><path key={i} d="M0-78V-120" stroke="currentColor" strokeOpacity=".5" transform={`rotate(${i*9})`}/>)}<circle r="62" fill="currentColor"/><circle cx="-20" cy="-12" r="62" fill="var(--identity-bg)"/><ellipse rx="143" ry="44" transform="rotate(-28)" stroke="currentColor" strokeOpacity=".7"/></g>}
      {identity.symbol === "route" && <g stroke="currentColor" transform="translate(0 5)">{[70,130,190,250].map((y,i)=><g key={y}><path d={`M290 ${y}H350Q375 ${y} 375 157T420 157H505`} strokeWidth={i===1?3:1.2} opacity={i===1?1:.45}/><circle cx="290" cy={y} r="7" fill="var(--identity-bg)"/><circle cx="505" cy="157" r="9" fill="currentColor"/></g>)}</g>}
      {identity.symbol === "wave" && <g stroke="currentColor" strokeWidth="1.2">{Array.from({length:23},(_,i)=><path key={i} d={`M235 ${75+i*8}C320 ${75+i*8} 330 ${225-i*5} 395 ${225-i*5}S450 ${60+i*9} 630 ${60+i*9}`} opacity={.3+i*.025}/>)}</g>}
      {identity.symbol === "steps" && <g transform="translate(332 75)">{Array.from({length:6},(_,i)=><g key={i} transform={`translate(${i*19} ${i*22})`}><path d="m0 0 70-35 70 35-70 35Z" fill="var(--identity-bg)" stroke="currentColor" strokeWidth="1.5"/><path d="M0 0v17l70 35 70-35V0M70 35v17" stroke="currentColor" strokeOpacity=".5"/></g>)}</g>}
      {identity.symbol === "orbit" && <g transform="translate(400 156)" stroke="currentColor">{[0,60,120].map(a=><ellipse key={a} rx="115" ry="49" transform={`rotate(${a})`} strokeWidth="1.2"/>)}<circle r="10" fill="currentColor"/><circle cy="-106" r="5" fill="currentColor"/></g>}
      <path d="M24 276H576" stroke="currentColor" strokeOpacity=".18"/>
    </svg>
    <strong className="identity-name">{identity.name}</strong>
    <span className="identity-note">{identity.note}</span><span className="identity-index">↗</span>
    <span className="identity-disclaimer">ILLUSTRATIVE IDENTITY</span>
  </div>;
}
