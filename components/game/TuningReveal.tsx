"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./game.module.css";

const MODES = ["HUMAN", "RULE", "HYBRID", "AI", "NO AI"];

const SEQUENCE = [
  { text: "SYSTEM TUNING", duration: 1500 },
  { text: "CURRENT CONFIGURATION: UNSTABLE", duration: 2000 },
  { showDial: true, duration: 1500 },
  { showDial: true, text: "TUNER ACCESS REQUIRED", duration: 2000 },
  { showDial: true, text: "ACCESS STATUS: GRANTED", duration: 2000 },
  { showDial: true, text: "WELCOME, TUNER.", duration: 2500 },
  { showDial: true, text: "TERRAVALE WAS NOT BUILT TO THINK.", duration: 3000 },
  { showDial: true, text: "IT WAS BUILT TO BE TUNED.", duration: 3000 },
  { showDial: true, text: "FIRST SYSTEM FOUND.", duration: 2000 },
  { showDial: true, text: "TUNING REQUIRED.", duration: 2000 },
  { showDial: true, text: "CHOOSE HOW TO THINK.", duration: -1 } // Stops here for interaction
];

interface TuningRevealProps {
  onTuneComplete: (mode: string) => void;
}

export function TuningReveal({ onTuneComplete }: TuningRevealProps) {
  const [step, setStep] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(2); // Start at HYBRID
  const [endPhase, setEndPhase] = useState<"tuning" | "confirmed" | "reconfiguring" | "available">("tuning");

  const current = SEQUENCE[Math.min(step, SEQUENCE.length - 1)];
  const isLocked = step < SEQUENCE.length - 1;

  // Sequence progression
  useEffect(() => {
    if (step < SEQUENCE.length) {
      const seq = SEQUENCE[step];
      if (seq.duration !== -1) {
        const timer = setTimeout(() => {
          setStep(s => s + 1);
        }, seq.duration);
        return () => clearTimeout(timer);
      }
    }
  }, [step]);

  // Keyboard controls
  useEffect(() => {
    if (isLocked || endPhase !== "tuning") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedIndex(prev => (prev === 0 ? MODES.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedIndex(prev => (prev === MODES.length - 1 ? 0 : prev + 1));
      } else if (e.key === " ") {
        // Confirm selection
        setEndPhase("confirmed");

        // Sequence: SYSTEM TUNED TO: [MODE] -> CONFIGURATION ACCEPTED -> TEST SYSTEM AVAILABLE -> Callback
        setTimeout(() => {
          setEndPhase("reconfiguring");
          setTimeout(() => {
            setEndPhase("available");
            setTimeout(() => {
              onTuneComplete(MODES[selectedIndex].toLowerCase().replace(" ", "_"));
            }, 2500); // Wait then close
          }, 2000);
        }, 2000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLocked, endPhase, selectedIndex, onTuneComplete]);

  // Calculate indicator position (0 to 100%)
  const indicatorLeft = `${10 + (selectedIndex * 20)}%`;

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(17, 20, 19, 0.85)", // Dark graphite overlay
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-mono)",
      color: "#0E9F6E" // Emerald system indicator
    }}>
      {/* Messages */}
      <div style={{ height: "40px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", flexDirection: "column", gap: "4px" }}>
        {endPhase === "tuning" && current.text && (
          <div className={styles.crtFlicker} style={{ fontSize: "10px", letterSpacing: "1px" }}>
            {current.text}
          </div>
        )}
        {endPhase === "confirmed" && (
          <div className={styles.crtFlicker} style={{ fontSize: "10px", letterSpacing: "1px" }}>
            SYSTEM TUNED TO: {MODES[selectedIndex]}
          </div>
        )}
        {endPhase === "reconfiguring" && (
          <div className={styles.crtFlicker} style={{ fontSize: "10px", letterSpacing: "1px" }}>
            CONFIGURATION ACCEPTED.
          </div>
        )}
        {endPhase === "available" && (
          <div className={styles.crtFlicker} style={{ fontSize: "10px", letterSpacing: "1px" }}>
            TEST SYSTEM AVAILABLE.
          </div>
        )}
      </div>

      {/* The Dial Visual */}
      {current.showDial && endPhase === "tuning" && (
        <div className={styles.fadeToBlack} style={{
          marginTop: "20px",
          width: "280px",
          height: "40px",
          backgroundColor: "#17191B",
          border: "1px solid #2C3532",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 10px",
          position: "relative"
        }}>
          {/* Dial Background Track */}
          <div style={{ position: "absolute", top: "50%", left: "10px", right: "10px", height: "2px", backgroundColor: "#111413", transform: "translateY(-50%)" }} />

          {MODES.map((mode, idx) => (
            <div key={mode} style={{
              zIndex: 10,
              fontSize: "8px",
              color: selectedIndex === idx && !isLocked ? "#0E9F6E" : "#F4F2EC",
              backgroundColor: "#17191B",
              padding: "0 2px",
              transition: "color 0.1s"
            }}>
              {mode}
            </div>
          ))}

          {/* Indicator */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: indicatorLeft,
            transform: "translate(-50%, -50%)",
            width: "8px",
            height: "16px",
            backgroundColor: isLocked ? "#2C3532" : "#0E9F6E",
            border: isLocked ? "1px solid #546A76" : "1px solid #F4F2EC",
            zIndex: 20,
            transition: "left 0.1s ease-out, background-color 0.2s"
          }} />
        </div>
      )}

      {/* Instructional Hint */}
      {!isLocked && endPhase === "tuning" && (
        <div className={styles.fadeToBlack} style={{ marginTop: "16px", fontSize: "8px", color: "#F4F2EC", opacity: 0.7 }}>
          ← → SELECT &nbsp;&nbsp; SPACE CONFIRM
        </div>
      )}
    </div>
  );
}
