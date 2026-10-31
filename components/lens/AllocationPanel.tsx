import { consequences, modes, type Assumptions, type Mode } from "@/lib/lens";
import { modeLabels } from "@/lib/work";
import { ModeGlyph } from "@/components/brand/ModeGlyph";

const questions = [
  { key: "data", label: "Can people trust the information?", options: [["unknown", "Not sure yet"], ["ready", "Yes, accessible and reliable"], ["fragmented", "No, scattered or unreliable"]] },
  { key: "rules", label: "Can you write down the rules?", options: [["unknown", "Not sure yet"], ["fixed", "Yes, the rules are clear"], ["variable", "No, each case varies"]] },
  { key: "stakes", label: "What happens if it goes wrong?", options: [["unknown", "Not sure yet"], ["low", "Easy to reverse; low impact"], ["high", "Serious or hard to undo"]] },
  { key: "judgment", label: "Does someone need to use judgment?", options: [["unknown", "Not sure yet"], ["yes", "Yes"], ["no", "No"]] },
] as const;

type Props = { assumptions: Assumptions; active: Mode | null; onAssumptions: (a: Assumptions) => void; onMode: (m: Mode) => void };
export function AllocationPanel({ assumptions, active, onAssumptions, onMode }: Props) {
  return <details className="lens-disclosure allocation-disclosure"><summary><span>Compare people, rules and AI</span><small>Optional · change four assumptions to explore trade-offs</small></summary><div className="disclosure-body">
    <p className="lens-note">These are your working assumptions. Changing them updates the provisional suggestion, not the graph. The comparison describes trade-offs; it does not predict performance.</p>
    <div className="assumption-grid">{questions.map(q => <label key={q.key}>{q.label}<select value={assumptions[q.key]} onChange={e => onAssumptions({ ...assumptions, [q.key]: e.target.value })}>{q.options.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>)}</div>
    <fieldset className="mode-comparison"><legend>Or inspect an approach yourself</legend><div className="allocation-options">{modes.map(mode => <button type="button" key={mode} aria-pressed={active === mode} onClick={() => onMode(mode)}><ModeGlyph mode={mode}/><span className="eyebrow">{modeLabels[mode].symbol} / {modeLabels[mode].short}</span><strong>{modeLabels[mode].label}</strong></button>)}</div>
      {active && <div className="consequence" aria-live="polite"><div><p className="eyebrow">WHAT IT HELPS WITH</p><p>{consequences[active].gain}</p></div><div><p className="eyebrow">WHAT YOU TAKE ON</p><p>{consequences[active].cost}</p></div><div><p className="eyebrow">WHAT TO KEEP IN PLACE</p><p>{consequences[active].guard}</p></div></div>}
    </fieldset>
  </div></details>;
}
