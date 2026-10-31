"use client";

import { useState } from "react";
import { interpretProblemAction, InterpretationResult } from "@/lib/think/interpreter";
import SystemMap from "./SystemMap";

const EXAMPLES = [
  "Our CA team spends hours manually matching invoices with GST records.",
  "We have plenty of leads but don't know which ones matter.",
  "Everyone has data. Nobody trusts it.",
  "We added AI but the process still feels broken."
];

export default function ThinkInterface() {
  const [input, setInput] = useState("");
  const [isMapping, setIsMapping] = useState(false);
  const [result, setResult] = useState<InterpretationResult | null>(null);
  const [placeholderIndex] = useState(0);

  const handleMapSystem = async () => {
    if (!input.trim()) return;
    setIsMapping(true);
    // Call server action
    try {
      const res = await interpretProblemAction(input);
      setResult(res);
    } catch (e) {
      console.error(e);
    }
    setIsMapping(false);
  };

  const handleCorrection = (alternativeId: string) => {
    // In a real V2, we might re-run interpretation with the alternative forced.
    // For V1, we can just reset and let the user try again, or force map if we build that capability.
    setResult(null);
  };

  if (result && !isMapping) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#2D2D2D] font-sans overflow-x-hidden selection:bg-[#E2F0ED] selection:text-[#1A3B34]">
        <div className="max-w-[1400px] mx-auto p-6 md:p-12 lg:p-24 relative">
          <button
            onClick={() => setResult(null)}
            className="text-sm font-mono text-[#666666] hover:text-[#1A3B34] transition-colors mb-12 flex items-center gap-2"
          >
            ← BACK TO THINK
          </button>

          <SystemMap
            result={result}
            onCorrection={handleCorrection}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2D2D] font-sans flex flex-col items-center justify-center p-6 selection:bg-[#E2F0ED] selection:text-[#1A3B34]">
      <div className="w-full max-w-3xl flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-8">THINK</h1>

        <p className="text-xl md:text-2xl text-[#666666] mb-12">
          Tell us what&apos;s not working.
        </p>

        <div className="w-full relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleMapSystem();
              }
            }}
            placeholder={EXAMPLES[placeholderIndex]}
            className="w-full bg-white border border-[#E5E5E5] rounded-none p-6 md:p-8 text-xl md:text-2xl font-light placeholder-[#B3B3B3] focus:outline-none focus:border-[#1A3B34] focus:ring-1 focus:ring-[#1A3B34] transition-all resize-none shadow-sm h-48 md:h-64"
          />

          <div className="absolute bottom-6 right-6 flex items-center gap-4">
            <button
              onClick={() => {
                setInput(EXAMPLES[0]); // CA example
              }}
              className="text-xs md:text-sm font-mono text-[#888888] hover:text-[#1A3B34] transition-colors bg-white px-2 py-1"
            >
              TRY AN EXAMPLE
            </button>
            <button
              onClick={handleMapSystem}
              disabled={!input.trim() || isMapping}
              className="bg-[#1A3B34] text-white px-6 py-3 font-mono text-sm hover:bg-[#0F241F] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isMapping ? "MAPPING..." : "MAP THE SYSTEM →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
