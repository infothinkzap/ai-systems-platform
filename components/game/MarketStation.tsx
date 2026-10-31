"use client";

import styles from "./game.module.css";
import { PixelSpeechBubble } from "./PixelSpeechBubble";

interface MarketStationProps {
  x: number;
  y: number;
  playerX: number;
}

export function MarketStation({ x, y, playerX }: MarketStationProps) {
  const showDialogue = Math.abs(playerX - x) < 30;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: "24px",
          height: "32px",
        }}
      >
        {/* Table/Desk */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "24px",
          height: "16px",
          backgroundColor: "#8C7B71", // Wood table
          border: "1px solid #17191B",
        }} />

        {/* Wire inbox tray */}
        <div style={{
          position: "absolute",
          bottom: "16px",
          left: "2px",
          width: "12px",
          height: "6px",
          border: "1px solid #17191B",
          borderTop: "none",
        }} />

        {/* Papers accumulating */}
        <div
          className={styles.stack}
          style={{
            position: "absolute",
            bottom: "16px",
            left: "4px",
            width: "8px",
            height: "12px",
            backgroundColor: "#F4F2EC",
            border: "1px solid #17191B",
            transformOrigin: "bottom center",
          }}
        />

        <div style={{
          position: "absolute",
          bottom: "16px",
          left: "5px",
          width: "6px",
          height: "8px",
          backgroundColor: "#F4F2EC",
          border: "1px solid #17191B",
          transform: "rotate(-10deg)",
        }} />
      </div>

      {showDialogue && (
        <PixelSpeechBubble
          x={x + 12}
          y={y - 8}
          text="100 orders waiting."
        />
      )}
    </>
  );
}
