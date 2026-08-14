"use client";

import { useState } from "react";
import { MonoLabel } from "../ui/MonoLabel";

const steps = {
  problem: {
    question: "What are you trying to change?",
    options: [
      { label: "Too much manual work", next: "workflow" },
      { label: "Data is scattered", next: "workflow" },
      { label: "Leads are getting lost", next: "workflow" },
      { label: "Too many repeated decisions", next: "workflow" },
    ]
  },
  workflow: {
    question: "Where does the work happen today?",
    options: [
      { label: "In spreadsheets", next: "judgment" },
      { label: "Across multiple SaaS tools", next: "judgment" },
      { label: "In emails and PDFs", next: "judgment" },
      { label: "In human conversations", next: "judgment" },
    ]
  },
  judgment: {
    question: "Where does judgment enter?",
    options: [
      { label: "Matching incomplete data", next: "outcome" },
      { label: "Detecting anomalies", next: "outcome" },
      { label: "Contextualizing requests", next: "outcome" },
      { label: "It doesn't, it's just copy-paste", next: "outcome" },
    ]
  },
  outcome: {
    question: "What happens after the decision?",
    options: [
      { label: "Update a system", next: "end" },
      { label: "Send a message", next: "end" },
      { label: "Trigger a workflow", next: "end" },
      { label: "Generate a report", next: "end" },
    ]
  }
};

export function DiscoveryPrototype() {
  const [currentStep, setCurrentStep] = useState<keyof typeof steps | "end">("problem");
  const [path, setPath] = useState<{ step: string; choice: string }[]>([]);

  const handleSelect = (choice: string, next?: string) => {
    setPath((prev) => [...prev, { step: currentStep, choice }]);
    if (next && next !== "end") {
      setCurrentStep(next as keyof typeof steps);
    } else {
      setCurrentStep("end");
    }
  };

  const reset = () => {
    setPath([]);
    setCurrentStep("problem");
  };

  return (
    <div className="w-full max-w-2xl mx-auto border border-border bg-surface p-8">
      <MonoLabel dot variant="accent" className="mb-8">Discovery Engine [Prototype]</MonoLabel>

      {/* Visual Pathway */}
      {path.length > 0 && (
        <div className="mb-12 flex flex-col gap-4">
          {path.map((node, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <MonoLabel variant="muted">{node.step}</MonoLabel>
                <span className="text-sm">{node.choice}</span>
              </div>
              {i < path.length - 1 && (
                <div className="ml-1 h-6 w-[1px] bg-border" />
              )}
            </div>
          ))}
          {currentStep !== "end" && (
            <div className="flex flex-col gap-2">
              <div className="ml-1 h-6 w-[1px] bg-accent/50 animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full border border-accent" />
                <MonoLabel variant="accent" className="animate-pulse">Thinking</MonoLabel>
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep !== "end" ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-medium mb-6">{steps[currentStep as keyof typeof steps].question}</h3>
          <div className="flex flex-col gap-3">
            {steps[currentStep as keyof typeof steps].options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleSelect(opt.label, opt.next)}
                className="text-left px-6 py-4 border border-border hover:border-foreground transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-700 bg-muted/30 p-8 border border-border">
          <h3 className="text-xl font-medium mb-4">
            You may not need an AI product.<br/>
            You may need intelligence at a particular point in your system.
          </h3>
          <p className="text-muted-foreground mb-8">
            This graph demonstrates a friction point that can be isolated, structurally mapped, and solved using targeted inference, without replacing your entire operational stack.
          </p>
          <div className="flex items-center gap-4">
            <button className="bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors">
              Map this with Terrawave →
            </button>
            <button onClick={reset} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Reset Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
