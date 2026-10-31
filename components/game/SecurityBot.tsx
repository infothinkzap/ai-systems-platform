"use client";

import { useEffect, useState } from "react";
import { SystemMessage } from "./SystemMessage";

interface SecurityBotProps {
  x: number;
  y: number;
  playerX: number;
  heldItem: string | null;
}

export function SecurityBot({ x, y, playerX, heldItem }: SecurityBotProps) {
  const [scanState, setScanState] = useState<"idle" | "scanning" | "denied" | "allowed">("idle");
  const inRange = Math.abs(playerX - x) < 50;

  useEffect(() => {
    if (!inRange) {
      if (scanState !== "idle") {
        const timeout = setTimeout(() => setScanState("idle"), 0);
        return () => clearTimeout(timeout);
      }
      return;
    }

    if (scanState === "idle") {
      const startScan = setTimeout(() => {
        setScanState("scanning");
        setTimeout(() => {
          if (heldItem === "box") setScanState("allowed");
          else setScanState("denied");
        }, 800);
      }, 0);
      return () => clearTimeout(startScan);
    }

    // Re-evaluate if heldItem changes while standing next to the bot
    if (scanState === "denied" && heldItem === "box") {
      const startScan = setTimeout(() => {
        setScanState("scanning");
        setTimeout(() => setScanState("allowed"), 800);
      }, 0);
      return () => clearTimeout(startScan);
    }

    if (scanState === "allowed" && heldItem !== "box") {
      const startScan = setTimeout(() => {
        setScanState("scanning");
        setTimeout(() => setScanState("denied"), 800);
      }, 0);
      return () => clearTimeout(startScan);
    }

  }, [inRange, heldItem, scanState]);

  let messages: string[] = [];
  if (scanState === "scanning") messages = ["SCANNING..."];
  if (scanState === "denied") messages = ["CLASSIFICATION: HUMAN", "ACCESS DENIED."];
  if (scanState === "allowed") messages = ["VISUAL INPUT ANALYZED", "CLASSIFICATION: CARDBOARD", "ACCESS ALLOWED ✓"];

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: "24px",
          height: "32px",
          zIndex: 40,
        }}
      >
        {/* Base/Treads */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "2px",
          width: "20px",
          height: "8px",
          backgroundColor: "#546A76",
          border: "1px solid #17191B",
          borderRadius: "4px",
        }} />

        {/* Post */}
        <div style={{
          position: "absolute",
          bottom: "8px",
          left: "10px",
          width: "4px",
          height: "14px",
          backgroundColor: "#8C7B71",
          borderLeft: "1px solid #17191B",
          borderRight: "1px solid #17191B",
        }} />

        {/* Sensor Head */}
        <div style={{
          position: "absolute",
          bottom: "22px",
          left: "4px",
          width: "16px",
          height: "10px",
          backgroundColor: "#DDEFE8",
          border: "1px solid #17191B",
          borderRadius: "2px",
        }}>
          {/* Eye lens */}
          <div style={{
            position: "absolute",
            top: "2px",
            left: playerX < x ? "2px" : "10px", // look at player
            width: "4px",
            height: "4px",
            backgroundColor: scanState === "allowed" ? "#0E9F6E" : (scanState === "denied" ? "#E53E3E" : "#17191B"),
            borderRadius: "50%",
            transition: "left 0.2s ease, background-color 0.2s",
          }} />
        </div>

        {/* Scanning beam overlay */}
        {scanState === "scanning" && (
          <div style={{
            position: "absolute",
            bottom: "0",
            left: "-16px",
            width: "48px",
            height: "1px",
            backgroundColor: "#3FAF9B", // Signal Green
            boxShadow: "0 0 8px #3FAF9B",
            opacity: 0.5,
            animation: "bob 0.4s infinite alternate",
          }} />
        )}
      </div>

      {scanState !== "idle" && (
        <SystemMessage x={x - 20} y={y - 36} lines={messages} />
      )}
    </>
  );
}
