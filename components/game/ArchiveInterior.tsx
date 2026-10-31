"use client";

import { ReactNode, useState, useEffect } from "react";
import styles from "./game.module.css";

interface ArchiveInteriorProps {
  playerX: number;
  interactionPrompt: string | null;
  children?: ReactNode;
}

export function ArchiveInterior({
  playerX,
  interactionPrompt,
  children
}: ArchiveInteriorProps) {
  return (
    <div style={{
      position: "relative",
      width: "384px", // Fixed logical width for the interior
      height: "216px",
      background: "linear-gradient(to bottom, #111413 0%, #17191B 100%)", // Dark graphite
      overflow: "hidden"
    }}>
      {/* Background Server Racks */}
      <div style={{ position: "absolute", bottom: "40px", left: "20px", width: "80px", height: "120px", backgroundColor: "#1C211F", borderRight: "1px solid #111413", borderLeft: "1px solid #111413" }}>
        {/* Lights */}
        <div className={styles.blinkLedSlow} style={{ position: "absolute", top: "10px", left: "10px", width: "2px", height: "2px", backgroundColor: "#0E9F6E" }} />
        <div className={styles.blinkLedFast} style={{ position: "absolute", top: "10px", left: "20px", width: "2px", height: "2px", backgroundColor: "#0E9F6E" }} />
        <div style={{ position: "absolute", top: "20px", left: "10px", width: "60px", height: "4px", backgroundColor: "#111413" }} />
        <div style={{ position: "absolute", top: "30px", left: "10px", width: "60px", height: "4px", backgroundColor: "#111413" }} />
      </div>

      <div style={{ position: "absolute", bottom: "40px", left: "280px", width: "80px", height: "120px", backgroundColor: "#1C211F", borderRight: "1px solid #111413", borderLeft: "1px solid #111413" }}>
        <div className={styles.blinkLedSlow} style={{ position: "absolute", top: "10px", left: "60px", width: "2px", height: "2px", backgroundColor: "#0E9F6E" }} />
        <div style={{ position: "absolute", top: "20px", left: "10px", width: "60px", height: "4px", backgroundColor: "#111413" }} />
        <div style={{ position: "absolute", top: "40px", left: "10px", width: "60px", height: "4px", backgroundColor: "#111413" }} />
      </div>

      {/* Ground Line */}
      <div style={{
        position: "absolute",
        bottom: "40px",
        left: 0,
        width: "100%",
        height: "1px",
        backgroundColor: "#2C3532", // Muted earth
      }} />

      {/* Central Terminal */}
      <div style={{
        position: "absolute",
        bottom: "40px",
        left: "172px",
        width: "40px",
        height: "50px",
        backgroundColor: "#2C3532",
        border: "1px solid #17191B",
        zIndex: 10
      }}>
        {/* Terminal Screen */}
        <div className={styles.crtFlicker} style={{
          position: "absolute",
          top: "4px",
          left: "4px",
          width: "30px",
          height: "20px",
          backgroundColor: "#051A11",
          border: "1px solid #111413",
        }}>
          {/* Faint green glow */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", boxShadow: "0 0 4px #0E9F6E inset", opacity: 0.2 }} />
        </div>
        {/* Keyboard/Deck */}
        <div style={{
          position: "absolute",
          bottom: "10px",
          left: "2px",
          width: "34px",
          height: "6px",
          backgroundColor: "#1C211F",
          transform: "skewX(-10deg)",
        }} />
      </div>

      {/* Player rendered here */}
      {children}

      {/* Interaction Prompt over Player */}
      {interactionPrompt && (
        <div className={styles.interactBob} style={{
          position: "absolute",
          bottom: "68px",
          left: playerX - 30,
          width: "70px",
          textAlign: "center",
          zIndex: 50,
          pointerEvents: "none",
        }}>
          <div style={{
            display: "inline-block",
            backgroundColor: "#F4F2EC",
            color: "#17191B",
            fontFamily: "var(--font-mono)",
            fontSize: "8px",
            padding: "2px 4px",
            borderRadius: "2px",
            border: "1px solid #17191B",
            whiteSpace: "nowrap"
          }}>
            [SPACE] {interactionPrompt}
          </div>
        </div>
      )}
    </div>
  );
}
