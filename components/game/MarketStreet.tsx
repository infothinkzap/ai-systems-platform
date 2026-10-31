"use client";

import { ReactNode } from "react";
import { MarketStorefront } from "./MarketStorefront";

interface MarketStreetProps {
  playerX: number;
  children?: ReactNode; // For placing the player
}

export function MarketStreet({ playerX, children }: MarketStreetProps) {
  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "384px",
      height: "216px",
      background: "linear-gradient(to bottom, #A87A65 0%, #F4F2EC 100%)", // Dusk sky
      overflow: "hidden"
    }}>
      {/* Distant building silhouettes (parallax layer) */}
      <div style={{
        position: "absolute",
        bottom: "40px",
        left: "20px",
        width: "60px",
        height: "80px",
        backgroundColor: "#8C7B71",
        opacity: 0.3
      }} />
      <div style={{
        position: "absolute",
        bottom: "40px",
        left: "100px",
        width: "40px",
        height: "120px",
        backgroundColor: "#8C7B71",
        opacity: 0.3
      }} />
      <div style={{
        position: "absolute",
        bottom: "40px",
        left: "280px",
        width: "80px",
        height: "60px",
        backgroundColor: "#8C7B71",
        opacity: 0.3
      }} />

      {/* Ground */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "40px",
        backgroundColor: "#2C3532", // Dark pavement
        borderTop: "1px solid #17191B"
      }}>
        {/* Sidewalk line */}
        <div style={{ position: "absolute", top: "4px", left: 0, width: "100%", height: "1px", backgroundColor: "#17191B", opacity: 0.5 }} />
      </div>

      {/* The Storefront */}
      <MarketStorefront x={180} y={216 - 40 - 64} />

      {/* Render Player on top */}
      {children}
    </div>
  );
}
