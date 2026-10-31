"use client";

import styles from "./game.module.css";

interface MarketStorefrontProps {
  x: number;
  y: number;
}

export function MarketStorefront({ x, y }: MarketStorefrontProps) {

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: "96px",
        height: "64px",
      }}
    >
      {/* Storefront base building block */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#2C3532", // Darker wood/stone facade
        border: "1px solid #17191B",
      }} />

      {/* Hand-painted sign (animated swinging) */}
      <div
        className={styles.signSwing}
        style={{
          position: "absolute",
          top: "-8px",
          left: "24px",
          width: "48px",
          height: "12px",
          backgroundColor: "#8C7B71",
          border: "1px solid #17191B",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "6px",
          color: "#F4F2EC",
          whiteSpace: "nowrap",
          letterSpacing: "-0.5px"
        }}>
          THREAD HOUSE
        </span>
      </div>

      {/* Sign chains */}
      <div style={{ position: "absolute", top: "-12px", left: "28px", width: "1px", height: "4px", backgroundColor: "#17191B" }} />
      <div style={{ position: "absolute", top: "-12px", right: "28px", width: "1px", height: "4px", backgroundColor: "#17191B" }} />

      {/* Door */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: "24px",
        width: "20px",
        height: "32px",
        backgroundColor: "#17201C", // Deep dark door
        border: "1px solid #17191B",
        borderBottom: "none"
      }}>
        <div style={{
          position: "absolute",
          top: "14px",
          right: "4px",
          width: "2px",
          height: "4px",
          backgroundColor: "#8C7B71" // handle
        }} />
      </div>

      {/* Window */}
      <div
        className={styles.flicker}
        style={{
          position: "absolute",
          bottom: "12px",
          right: "12px",
          width: "32px",
          height: "24px",
          backgroundColor: "#DDEFE8", // Pale Mint light inside
          border: "2px solid #8C7B71",
          overflow: "hidden"
        }}
      >
        {/* Window panes */}
        <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1px", backgroundColor: "#8C7B71" }} />
        <div style={{ position: "absolute", top: 0, left: "50%", width: "1px", height: "100%", backgroundColor: "#8C7B71" }} />

        {/* Silhouettes stacking inside (showing stress/problem) */}
        <div
          className={styles.stack}
          style={{
            position: "absolute",
            bottom: "2px",
            right: "4px",
            width: "6px",
            height: "12px",
            backgroundColor: "#17191B",
            opacity: 0.7
          }}
        />
        <div
          className={styles.stack}
          style={{
            position: "absolute",
            bottom: "2px",
            right: "12px",
            width: "5px",
            height: "14px",
            backgroundColor: "#17191B",
            opacity: 0.5,
            animationDelay: "0.5s" // offset animation
          }}
        />
        <div
          className={styles.bob}
          style={{
            position: "absolute",
            bottom: "2px",
            left: "4px",
            width: "8px",
            height: "12px",
            backgroundColor: "#17191B", // frantic clerk silhouette
            opacity: 0.8,
            animationDuration: "0.4s" // faster bob for frantic motion
          }}
        />
      </div>
    </div>
  );
}
