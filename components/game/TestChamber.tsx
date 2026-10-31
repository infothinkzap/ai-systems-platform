import React, { useState, useEffect } from "react";
import styles from "./game.module.css";
import { PixelSpeechBubble } from "./PixelSpeechBubble";

interface TestChamberProps {
  playerX: number;
  interactionPrompt: string | null;
  selectedMode: string | null;
  gateOpen: boolean;
  obstacleMoved: boolean;
  terminalPhase: string;
  children: React.ReactNode;
}

export function TestChamber({
  playerX,
  interactionPrompt,
  selectedMode,
  gateOpen,
  obstacleMoved,
  terminalPhase,
  children
}: TestChamberProps) {

  const isNearTerminal = playerX > 150 && playerX < 210;
  const isNearObstacle = playerX > 250 && playerX < 290;

  return (
    <div style={{
      position: "relative",
      width: "384px",
      height: "256px",
      backgroundColor: "#161817", // slightly different dark shade
      overflow: "hidden",
      borderRight: "4px solid #111"
    }}>
      {/* Background / Environment */}
      <div style={{
        position: "absolute",
        bottom: 40,
        width: "100%",
        height: "1px",
        backgroundColor: "#2a2d2c"
      }} />

      {/* Terminal or Lever (x: 180) */}
      <div style={{
        position: "absolute",
        bottom: 40,
        left: 180,
        width: 32,
        height: 48,
        backgroundColor: "#2d3230",
        border: "2px solid #1a1c1b",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {selectedMode === "no_ai" ? (
          // Physical Lever
          <div style={{
            width: 4,
            height: 24,
            backgroundColor: "#888",
            marginTop: 4,
            transform: gateOpen ? "rotate(20deg)" : "rotate(-20deg)",
            transition: "transform 0.2s"
          }} />
        ) : (
          // Terminal Screen
          <div style={{ width: 24, height: 16, backgroundColor: selectedMode === "rule" ? "#facc15" : "#0E9F6E", marginTop: 4, opacity: 0.8 }} className={styles.crtFlicker} />
        )}
      </div>

      {/* Gate (x: 320) */}
      <div style={{
        position: "absolute",
        bottom: gateOpen ? 120 : 40,
        left: 320,
        width: 16,
        height: 120,
        backgroundColor: "#333",
        border: "2px solid #222",
        transition: "bottom 1s cubic-bezier(0.25, 0.1, 0.25, 1.0)"
      }} />

      {/* Obstacle Container */}
      <div style={{
        position: "absolute",
        bottom: 40,
        left: obstacleMoved ? 230 : 280, // Moves out of the way
        width: 32,
        height: 32,
        backgroundColor: "#444",
        border: "2px solid #2a2a2a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "left 0.3s ease"
      }}>
        <div style={{ width: 16, height: 16, border: "2px dashed #333", opacity: 0.5 }} />
      </div>

      {/* Player (children) */}
      {children}

      {/* Prompt Overlay */}
      {interactionPrompt && (
        <div style={{
          position: "absolute",
          top: "40%",
          left: isNearTerminal ? 196 : isNearObstacle ? (obstacleMoved ? 246 : 296) : playerX,
          transform: "translateX(-50%)",
          fontFamily: "var(--font-mono)",
          fontSize: "8px",
          color: "#fff",
          backgroundColor: "#000",
          padding: "4px 8px",
          border: "1px solid #fff",
          pointerEvents: "none"
        }}>
          [SPACE] {interactionPrompt}
        </div>
      )}
    </div>
  );
}
