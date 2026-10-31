"use client";

import styles from "./game.module.css";

interface SystemMessageProps {
  x: number;
  y: number;
  lines: string[]; // Support multi-line scanning output
}

export function SystemMessage({ x, y, lines }: SystemMessageProps) {
  return (
    <div
      className={styles.bob} // Use existing bob animation to make it float
      style={{
        position: "absolute",
        left: x,
        top: y,
        backgroundColor: "#17201C", // Deep earth background
        border: "1px solid #087F5B", // Deep emerald technical border
        padding: "4px 6px",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        zIndex: 200,
        boxShadow: "2px 2px 0px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
        {/* Status Indicator */}
        <div
          className={styles.flicker}
          style={{
            width: "4px",
            height: "4px",
            backgroundColor: "#0E9F6E", // Terrawave emerald accent
            borderRadius: "50%"
          }}
        />
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "5px",
          color: "#D8D5CC",
          letterSpacing: "0.5px"
        }}>
          SYSTEM
        </span>
      </div>

      {lines.map((line, i) => (
        <span key={i} style={{
          fontFamily: "var(--font-mono)",
          fontSize: "6px",
          color: "#3FAF9B", // Signal green text
          whiteSpace: "nowrap"
        }}>
          {line}
        </span>
      ))}
    </div>
  );
}
