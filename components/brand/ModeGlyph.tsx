import type { IntelligenceMode } from "@/lib/graph/types";

export function ModeGlyph({ mode }: { mode: IntelligenceMode }) {
  return <svg className="mode-glyph" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    {mode === "Human" && <><circle cx="20" cy="13" r="5"/><path d="M9 32v-4a11 11 0 0 1 22 0v4M14 32v-6m12 6v-6"/></>}
    {mode === "Deterministic" && <><rect x="8" y="8" width="24" height="24" rx="3"/><path d="M14 15h12M14 20h12M14 25h7"/></>}
    {mode === "Hybrid" && <><circle cx="15" cy="20" r="10"/><rect x="17" y="10" width="18" height="20" rx="2"/><path d="M22 16h7m-7 8h7"/></>}
    {mode === "AI" && <><path d="m20 5 13 8v14l-13 8-13-8V13Z"/><circle cx="20" cy="20" r="5"/><path d="M20 10v5m0 10v5M10 20h5m10 0h5"/></>}
    {mode === "No AI" && <><circle cx="20" cy="20" r="13"/><path d="m11 29 18-18"/></>}
  </svg>;
}
