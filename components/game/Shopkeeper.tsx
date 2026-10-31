"use client";

import { useEffect, useState } from "react";
import { PixelSpeechBubble } from "./PixelSpeechBubble";

interface ShopkeeperProps {
  x: number;
  y: number;
  playerX: number;
}

export function Shopkeeper({ x, y, playerX }: ShopkeeperProps) {
  const [animationState, setAnimationState] = useState<"shuffling" | "looking">("shuffling");

  // Stressed animation cycle: shuffle papers for 2s, look at clock for 1s
  useEffect(() => {
    const cycle = () => {
      setAnimationState("looking");
      setTimeout(() => setAnimationState("shuffling"), 1000);
    };

    const interval = setInterval(cycle, 3000);
    return () => clearInterval(interval);
  }, []);

  const showDialogue = Math.abs(playerX - x) < 40;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: "16px",
          height: "22px",
          zIndex: 50,
        }}
      >
        {/* Counter to hide lower body */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: -4,
          width: "32px",
          height: "12px",
          backgroundColor: "#8C7B71",
          borderTop: "1px solid #17191B",
          zIndex: 60,
        }} />

        {/* Shopkeeper Body */}
        <div style={{
          position: "absolute",
          bottom: "8px",
          left: "2px",
          width: "12px",
          height: "14px",
          backgroundColor: "#546A76", // Muted blue shirt
          borderRadius: "3px 3px 0 0",
        }} />

        {/* Head */}
        <div style={{
          position: "absolute",
          top: "0px",
          left: animationState === "looking" ? "1px" : "4px", // shift head slightly when looking
          width: "8px",
          height: "8px",
          backgroundColor: "#E2C8B8",
          borderRadius: "50%",
          transition: "left 0.1s steps(2)",
        }} />

        {/* Papers moving (only when shuffling) */}
        {animationState === "shuffling" && (
          <div style={{
            position: "absolute",
            bottom: "8px",
            left: "8px",
            width: "6px",
            height: "4px",
            backgroundColor: "#F4F2EC", // Paper
            border: "1px solid #17191B",
            transform: `rotate(-5deg)`,
            zIndex: 65,
          }} />
        )}
      </div>

      {showDialogue && (
        <PixelSpeechBubble
          x={x + 8}
          y={y - 12}
          text="They keep coming in faster than I can check them."
        />
      )}
    </>
  );
}
