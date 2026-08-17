"use client";

import { useState } from "react";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { StructuralLine } from "@/components/ui/StructuralLine";

interface OpportunityMapperProps {
  onComplete: (recommendedMode: string) => void;
}

export function OpportunityMapper({ onComplete }: OpportunityMapperProps) {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const questions = [
    {
      id: "change",
      q: "What is actually changing in the business environment?",
      options: [
        { label: "We need more capacity.", next: 1 },
        { label: "We need more speed.", next: 1 },
        { label: "We need more accuracy.", next: 1 }
      ]
    },
    {
      id: "origin",
      q: "Where does the workflow actually begin?",
      options: [
        { label: "A customer request.", next: 2 },
        { label: "An internal event.", next: 2 },
        { label: "A system trigger.", next: 2 }
      ]
    },
    {
      id: "human",
      q: "Does this require human empathy or final moral judgment?",
      options: [
        { label: "Yes, it is fundamentally human.", result: "HUMAN" },
        { label: "No, it's primarily analytical.", next: 3 }
      ]
    },
    {
      id: "repetition",
      q: "Is the process highly repetitive?",
      options: [
        { label: "Yes, it's the exact same every time.", next: 4 },
        { label: "No, each case is unique.", next: 4 }
      ]
    },
    {
      id: "volatility",
      q: "Are the rules volatile or fixed?",
      options: [
        { label: "Fixed rules (deterministic).", next: 5 },
        { label: "Volatile rules (judgment required).", next: 5 }
      ]
    },
    {
      id: "data",
      q: "Is the required data structured or unstructured?",
      options: [
        { label: "Strictly structured.", result: "DETERMINISTIC" },
        { label: "Unstructured or messy.", next: 6 }
      ]
    }
  ];

  const handleOption = (opt: { label: string; result?: string; next?: number }) => {
    if (opt.result) {
      if (opt.result === "HUMAN" || opt.result === "DETERMINISTIC") {
        onComplete(opt.result);
      }
    } else if (opt.next !== undefined) {
      if (opt.next === questions.length) {
        setComplete(true);
      } else {
        setStep(opt.next);
      }
    }
  };

  if (complete) {
    return (
      <div className="flex flex-col h-full bg-white border border-border p-8 max-w-xl mx-auto w-full my-12 animate-in fade-in zoom-in-95 justify-center text-center">
        <MonoLabel dot className="mb-8 justify-center">System Mapped</MonoLabel>
        <h3 className="text-3xl font-medium mb-8 leading-tight">NOW WE CAN ASK WHERE AI BELONGS.</h3>
        <button 
          onClick={() => onComplete("AI")}
          className="mx-auto px-6 py-3 bg-foreground text-background font-mono text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors"
        >
          Explore Intelligence
        </button>
      </div>
    );
  }

  const currentQ = questions[step];

  return (
    <div className="flex flex-col h-full bg-white border border-border p-8 max-w-xl mx-auto w-full my-12 animate-in fade-in zoom-in-95">
      <div className="flex justify-between items-center mb-8">
        <MonoLabel dot>Start With The System</MonoLabel>
        <MonoLabel variant="muted">Step {step + 1} of {questions.length}</MonoLabel>
      </div>
      
      <h3 className="text-2xl font-medium mb-8 leading-tight">{currentQ.q}</h3>
      
      <div className="flex flex-col gap-4 mb-8">
        {currentQ.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleOption(opt)}
            className="text-left p-4 border border-border hover:border-foreground/30 bg-background transition-colors"
          >
            <span className="font-mono text-sm tracking-wide">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <StructuralLine />
        <p className="text-xs text-muted-foreground mt-4 uppercase tracking-widest font-mono">
          Intelligence Discovery Engine
        </p>
      </div>
    </div>
  );
}
