"use client";

import { SystemMessage } from "./SystemMessage";

interface ArchiveSystemProps {
  x: number;
  y: number;
  isArchiveOpen: boolean;
}

export function ArchiveSystem({ x, y, isArchiveOpen }: ArchiveSystemProps) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: "100px", height: "100%", zIndex: 10 }}>
      {/* Archive Building / Wall */}
      <div style={{ position: "absolute", bottom: "40px", left: "0px", width: "100px", height: "140px", backgroundColor: "#2C3532", border: "1px solid #17191B" }}>
        <div style={{ position: "absolute", top: "10px", left: "10px", right: "10px", height: "20px", backgroundColor: "#17201C", border: "1px solid #17191B", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "8px", color: "#F4F2EC", fontFamily: "var(--font-mono)" }}>ARCHIVE</span>
        </div>
      </div>

      {/* The Door */}
      <div style={{
        position: "absolute",
        bottom: "40px",
        left: "30px",
        width: "40px",
        height: "60px",
        backgroundColor: isArchiveOpen ? "#17191B" : "#546A76", // Black when open (tunnel)
        border: "1px solid #17191B",
        borderBottom: "none",
        transition: "background-color 0.2s"
      }}>
        {/* Door handle if closed */}
        {!isArchiveOpen && (
          <div style={{ position: "absolute", top: "30px", right: "6px", width: "4px", height: "8px", backgroundColor: "#D8D5CC", borderRadius: "2px" }} />
        )}
      </div>

      {/* Security Scanner */}
      <div style={{ position: "absolute", bottom: "80px", left: "10px", width: "14px", height: "20px", backgroundColor: "#8C7B71", border: "1px solid #17191B", borderRadius: "2px" }}>
        <div style={{ position: "absolute", top: "4px", left: "3px", width: "6px", height: "6px", backgroundColor: isArchiveOpen ? "#0E9F6E" : "#E53E3E", borderRadius: "50%" }} />
      </div>

      {/* System Message */}
      <SystemMessage
        x={-20}
        y={0}
        lines={
          isArchiveOpen
            ? ["CLASSIFICATION: BLUE ID BADGE.", "ACCESS ALLOWED ✓"]
            : ["AUTHORIZED PERSONNEL ONLY.", "REQUIREMENT: BLUE ID BADGE."]
        }
      />
    </div>
  );
}
