"use client";

import { useState } from "react";
import { MonoLabel } from "../ui/MonoLabel";


const criteria = [
  {
    question: "Is the problem repetitive?",
    ifYes: "automation_candidate",
    ifNo: "human_judgment_candidate"
  },
  {
    question: "Does structured data exist?",
    ifYes: "data_ready",
    ifNo: "data_architecture_problem"
  },
  {
    question: "Does the workflow require judgment?",
    ifYes: "intelligence_opportunity",
    ifNo: "pure_automation"
  },
  {
    question: "Can the reasoning be explicitly represented?",
    ifYes: "ai_opportunity",
    ifNo: "human_in_the_loop"
  },
  {
    question: "What is the cost of a wrong decision?",
    ifYes: "high_risk", // Note: simulating binary for simplicity in UI, though the question is open
    ifNo: "low_risk",
    isBinary: false,
    options: ["Low (Operational delay)", "High (Financial/Reputational loss)"]
  }
];

export function NeedMatrix() {
  const [answers, setAnswers] = useState<Record<number, boolean | string>>({});

  const handleAnswer = (index: number, answer: boolean | string) => {
    setAnswers(prev => ({ ...prev, [index]: answer }));
  };

  const isComplete = Object.keys(answers).length === criteria.length;

  return (
    <div className="border border-border bg-surface p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-medium mb-2">Do I actually need AI?</h3>
        <p className="text-muted-foreground">
          Instead of assuming AI is the answer, let&apos;s ask if it structurally belongs. This is a conceptual framework, not a scientific diagnostic.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {criteria.map((c, idx) => (
          <div key={idx} className={`transition-opacity duration-300 ${idx > 0 && answers[idx - 1] === undefined ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <p className="mb-3 text-lg">{c.question}</p>
            {c.isBinary === false && c.options ? (
              <div className="flex gap-3">
                {c.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(idx, opt)}
                    className={`px-4 py-2 border text-sm transition-colors ${answers[idx] === opt ? 'border-accent bg-accent/5 text-accent' : 'border-border hover:border-foreground'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(idx, true)}
                  className={`px-4 py-2 border text-sm transition-colors ${answers[idx] === true ? 'border-accent bg-accent/5 text-accent' : 'border-border hover:border-foreground'}`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(idx, false)}
                  className={`px-4 py-2 border text-sm transition-colors ${answers[idx] === false ? 'border-accent bg-accent/5 text-accent' : 'border-border hover:border-foreground'}`}
                >
                  No
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isComplete && (
        <div className="mt-12 pt-8 border-t border-border animate-in fade-in slide-in-from-bottom-4">
          <MonoLabel variant="accent" className="mb-4">Conceptual Assessment</MonoLabel>
          <div className="text-xl font-medium">
            {answers[1] === false ? (
              "You have a Data Architecture Problem."
            ) : answers[2] === false ? (
              "You have an Automation Problem, not an AI Problem."
            ) : answers[3] === false ? (
              "This requires a Human-in-the-Loop Workflow."
            ) : (
              "This is a structural AI Opportunity."
            )}
          </div>
          <p className="mt-4 text-muted-foreground">
            The question is not where AI can be inserted. The question is where intelligence creates useful leverage.
          </p>
        </div>
      )}
    </div>
  );
}
