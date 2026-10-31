"use client";

import { SystemMessage } from "./SystemMessage";

interface FactorySystemProps {
  x: number;
  y: number;
  cleanlinessScore: number;
  robotState: "idle" | "processing";
}

export function FactorySystem({ x, y, cleanlinessScore, robotState }: FactorySystemProps) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: "120px", height: "100%", zIndex: 10 }}>
      {/* Factory Floor Marker */}
      <div style={{ position: "absolute", bottom: "40px", left: "-10px", width: "140px", height: "1px", backgroundColor: "#546A76", opacity: 0.5 }} />

      {/* Bin A (Input) */}
      <div style={{ position: "absolute", bottom: "40px", left: "0px", width: "24px", height: "24px", backgroundColor: "#2C3532", border: "1px solid #17191B", borderTop: "none", zIndex: 20 }}>
        {/* Back wall inside */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#17201C", zIndex: 20 }} />
        {/* Front wall (overlaps trash) */}
        <div style={{ position: "absolute", bottom: 0, left: "-1px", width: "24px", height: "12px", backgroundColor: "#2C3532", border: "1px solid #17191B", borderTop: "none", borderBottom: "none", zIndex: 40 }} />

        <div style={{ position: "absolute", top: 0, left: "-2px", width: "26px", height: "4px", backgroundColor: "#546A76", border: "1px solid #17191B", zIndex: 40 }} />
        <div style={{ position: "absolute", bottom: "4px", left: "50%", transform: "translateX(-50%)", fontSize: "8px", color: "#F4F2EC", fontFamily: "var(--font-mono)", zIndex: 40 }}>A</div>
      </div>

      {/* Bin B (Output) */}
      <div style={{ position: "absolute", bottom: "40px", left: "80px", width: "24px", height: "24px", backgroundColor: "#2C3532", border: "1px solid #17191B", borderTop: "none", zIndex: 20 }}>
        {/* Back wall inside */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#17201C", zIndex: 20 }} />
        {/* Front wall (overlaps trash) */}
        <div style={{ position: "absolute", bottom: 0, left: "-1px", width: "24px", height: "12px", backgroundColor: "#2C3532", border: "1px solid #17191B", borderTop: "none", borderBottom: "none", zIndex: 40 }} />

        <div style={{ position: "absolute", top: 0, left: "-2px", width: "26px", height: "4px", backgroundColor: "#546A76", border: "1px solid #17191B", zIndex: 40 }} />
        <div style={{ position: "absolute", bottom: "4px", left: "50%", transform: "translateX(-50%)", fontSize: "8px", color: "#F4F2EC", fontFamily: "var(--font-mono)", zIndex: 40 }}>B</div>
      </div>

      {/* Robot Base */}
      <div style={{ position: "absolute", bottom: "40px", left: "40px", width: "24px", height: "16px", backgroundColor: "#8C7B71", border: "1px solid #17191B" }} />
      {/* Robot Pole */}
      <div style={{ position: "absolute", bottom: "56px", left: "50px", width: "4px", height: "40px", backgroundColor: "#546A76", border: "1px solid #17191B" }} />

      {/* Robot Arm */}
      <div style={{
        position: "absolute",
        bottom: "92px",
        left: "50px",
        width: "30px",
        height: "4px",
        backgroundColor: "#E53E3E", // Red arm
        border: "1px solid #17191B",
        transformOrigin: "left center",
        transform: robotState === "processing" ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 1s ease-in-out" // Swings from Bin B to Bin A
      }} />

      {/* System Message */}
      <SystemMessage
        x={0}
        y={40}
        lines={
          robotState === "processing"
            ? ["PROCESSING TRASH..."]
            : cleanlinessScore > 0
              ? [`BINS EMPTIED.`, `CLEANLINESS +${cleanlinessScore} ✓`]
              : ["OBJECTIVE: MAXIMIZE CLEANLINESS", "METRIC: BINS EMPTIED"]
        }
      />
    </div>
  );
}
