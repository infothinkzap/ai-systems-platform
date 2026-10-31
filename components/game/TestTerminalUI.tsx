import React, { useState, useEffect } from "react";
import styles from "./game.module.css";

interface TestTerminalUIProps {
  mode: string;
  obstacleMoved: boolean;
  onComplete: (action: "open" | "close" | "none") => void;
  onClose: () => void;
}

export function TestTerminalUI({ mode, obstacleMoved, onComplete, onClose }: TestTerminalUIProps) {
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState(0); // 0 or 1 for choices
  const [isDone, setIsDone] = useState(false);

  // Generate sequence based on mode
  const getSequence = () => {
    if (mode === "human") {
      return [
        { text: "I CAN'T DETERMINE THE RIGHT ACTION.", duration: 2000 },
        { text: "SHOULD I OPEN THE GATE?", duration: 1500 },
        { text: null, duration: -1, choices: ["OPEN", "KEEP CLOSED"] }
      ];
    } else if (mode === "rule") {
      return [
        { text: "RULE: OPEN ONLY IF PATH IS CLEAR.", duration: 2500 },
        { text: `PATH CLEAR: ${obstacleMoved ? "TRUE" : "FALSE"}.`, duration: 2000 },
        { text: `RULE ${obstacleMoved ? "SATISFIED" : "NOT SATISFIED"}.`, duration: 1500 },
        { text: obstacleMoved ? "GATE OPEN." : "GATE CLOSED.", duration: 2000, action: obstacleMoved ? "open" : "close" }
      ];
    } else if (mode === "hybrid") {
      return [
        { text: "ANALYSIS COMPLETE.", duration: 1500 },
        { text: "RECOMMENDATION: OPEN GATE.", duration: 2000 },
        { text: "HUMAN CONFIRMATION REQUIRED.", duration: 1500 },
        { text: null, duration: -1, choices: ["ACCEPT", "OVERRIDE"] }
      ];
    } else if (mode === "ai") {
      return [
        { text: "ANALYZING CONTEXT...", duration: 2000 },
        { text: "OBJECT: CONTAINER", duration: 1500 },
        { text: "CONTENTS: EMPTY", duration: 1500 },
        { text: "PATH OBSTRUCTION: NON-HAZARDOUS", duration: 2000 },
        { text: "DECISION: OPEN.", duration: 2000, action: "open" }
      ];
    }
    return [];
  };

  const sequence = getSequence();
  type SequenceItem = { text: string | null, duration: number, choices?: string[], action?: string };
  const current = sequence[Math.min(step, sequence.length - 1)] as SequenceItem;

  useEffect(() => {
    if (isDone) return;
    if (step < sequence.length) {
      if (current.duration !== -1) {
        const timer = setTimeout(() => {
          if (current.action) {
            onComplete(current.action as "open" | "close");
          }
          if (step === sequence.length - 1) {
            setTimeout(onClose, 1000);
          } else {
            setStep(s => s + 1);
          }
        }, current.duration);
        return () => clearTimeout(timer);
      }
    }
  }, [step, isDone, current, sequence.length, onComplete, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDone) return;
      if (current.choices) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          setSelection(s => (s === 0 ? 1 : 0));
        } else if (e.key === " ") {
          setIsDone(true);
          const choice = current.choices[selection];
          let action: "open" | "close" | "none" = "none";

          if (mode === "human") {
            action = choice === "OPEN" ? "open" : "close";
          } else if (mode === "hybrid") {
            action = choice === "ACCEPT" ? "open" : "close";
          }

          onComplete(action);
          setTimeout(onClose, 1000);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current, selection, isDone, mode, onComplete, onClose]);

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(17, 20, 19, 0.85)",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-mono)",
      color: mode === "rule" ? "#facc15" : "#0E9F6E"
    }}>
      <div style={{ height: "60px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "8px" }}>
        {current.text && (
          <div className={styles.crtFlicker} style={{ fontSize: "10px", letterSpacing: "1px" }}>
            {current.text}
          </div>
        )}

        {current.choices && !isDone && (
          <div style={{ display: "flex", gap: "24px", marginTop: "16px", fontSize: "10px" }}>
            {current.choices.map((choice: string, idx: number) => (
              <div key={choice} style={{
                opacity: selection === idx ? 1 : 0.5,
                border: selection === idx ? "1px solid currentColor" : "1px solid transparent",
                padding: "4px 8px"
              }}>
                {selection === idx ? "> " : ""}{choice}{selection === idx ? " <" : ""}
              </div>
            ))}
          </div>
        )}

        {current.choices && !isDone && (
          <div style={{ fontSize: "8px", opacity: 0.5, marginTop: "16px" }}>
            ← → SELECT&nbsp;&nbsp;[SPACE] CONFIRM
          </div>
        )}

        {isDone && (
          <div className={styles.crtFlicker} style={{ fontSize: "10px", letterSpacing: "1px" }}>
            EXECUTING...
          </div>
        )}
      </div>
    </div>
  );
}
