"use client";

import { ReactNode } from "react";
import { Shopkeeper } from "./Shopkeeper";
import { MarketStation } from "./MarketStation";

interface MarketInteriorProps {
  playerX: number;
  children?: ReactNode; // For placing the player
}

export function MarketInterior({ playerX, children }: MarketInteriorProps) {
  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "384px",
      height: "216px",
      backgroundColor: "#D8D5CC", // Structural Stone / Warm interior wall
      overflow: "hidden"
    }}>
      {/* Wall trim/baseboard */}
      <div style={{
        position: "absolute",
        bottom: "40px",
        left: 0,
        width: "100%",
        height: "6px",
        backgroundColor: "#8C7B71",
        borderTop: "1px solid #17191B",
        borderBottom: "1px solid #17191B",
      }} />

      {/* Wall clock (subtly animated in CSS or just static geometry for now) */}
      <div style={{
        position: "absolute",
        top: "40px",
        left: "140px",
        width: "16px",
        height: "16px",
        backgroundColor: "#F4F2EC",
        border: "2px solid #17191B",
        borderRadius: "50%"
      }}>
        <div style={{
          position: "absolute",
          top: "6px",
          left: "6px",
          width: "4px",
          height: "1px",
          backgroundColor: "#17191B",
          transformOrigin: "left center",
          transform: "rotate(45deg)"
        }} />
        <div style={{
          position: "absolute",
          top: "2px",
          left: "6px",
          width: "1px",
          height: "4px",
          backgroundColor: "#17191B",
        }} />
      </div>

      {/* Floor */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "40px",
        backgroundColor: "#8C7B71", // Wood floor
        borderTop: "1px solid #17191B"
      }}>
        {/* Floorboards */}
        <div style={{ position: "absolute", top: "10px", left: 0, width: "100%", height: "1px", backgroundColor: "#17191B", opacity: 0.3 }} />
        <div style={{ position: "absolute", top: "20px", left: 0, width: "100%", height: "1px", backgroundColor: "#17191B", opacity: 0.3 }} />
        <div style={{ position: "absolute", top: "30px", left: 0, width: "100%", height: "1px", backgroundColor: "#17191B", opacity: 0.3 }} />
      </div>

      {/* Door back to street (for visual consistency, far left) */}
      <div style={{
        position: "absolute",
        bottom: "40px",
        left: "10px",
        width: "24px",
        height: "48px",
        backgroundColor: "#2C3532",
        border: "1px solid #17191B"
      }} />

      {/* Shopkeeper */}
      <Shopkeeper x={120} y={216 - 40 - 22} playerX={playerX} />

      {/* First Station (ORDERS IN) */}
      <MarketStation x={220} y={216 - 40 - 32} playerX={playerX} />

      {/* Render Player on top */}
      {children}
    </div>
  );
}
