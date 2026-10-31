"use client";

import styles from "./game.module.css";
import { useEffect, useState } from "react";

interface PlayerProps {
  x: number;
  y: number;
  isMoving: boolean;
  facingRight: boolean;
  heldItem?: string | null;
  isActionAnimating?: boolean; // For the painting animation
}

export function Player({ x, y, isMoving, facingRight, heldItem, isActionAnimating }: PlayerProps) {
  // Simple 2-frame walk cycle timer
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isMoving) {
      return;
    }

    const interval = setInterval(() => {
      setFrame(f => (f === 0 ? 1 : 0));
    }, 150);

    return () => clearInterval(interval);
  }, [isMoving]);

  const currentFrame = isMoving ? frame : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "16px",
        height: "24px",
        transform: `translate(${x}px, ${y}px) scaleX(${facingRight ? 1 : -1})`,
        transition: "transform 0.05s linear",
        zIndex: 100,
      }}
    >
      <div
        className={`${!isMoving ? styles.bob : ""}`}
        style={{ width: "100%", height: "100%", position: "relative" }}
      >
        {/*
          Original silent protagonist sprite.
          Using simple CSS shapes to avoid copyrighted assets.
        */}
        {/* Body/Cloak (Muted warm tone) */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "2px",
          width: "12px",
          height: "16px",
          backgroundColor: "#A87A65", // Warm leather/cloth
          borderRadius: "4px 4px 0 0",
        }} />

        {/* Head */}
        <div style={{
          position: "absolute",
          top: "2px",
          left: "4px",
          width: "8px",
          height: "8px",
          backgroundColor: "#E2C8B8", // Pale skin tone
          borderRadius: "50%",
          transform: currentFrame === 1 ? "translateY(1px)" : "translateY(0px)",
        }}>
          {/* Simple eye */}
          <div style={{
            position: "absolute",
            top: "2px",
            right: "1px",
            width: "2px",
            height: "2px",
            backgroundColor: "#17191B",
          }} />
        </div>

        {/* Walking Legs (appear on frame 1) */}
        {currentFrame === 1 && (
          <>
            <div style={{
              position: "absolute",
              bottom: "-2px",
              left: "4px",
              width: "3px",
              height: "4px",
              backgroundColor: "#17191B",
            }} />
            <div style={{
              position: "absolute",
              bottom: "-2px",
              right: "4px",
              width: "3px",
              height: "4px",
              backgroundColor: "#17191B",
            }} />
          </>
        )}

        {/* Cardboard Box Overlay */}
        {heldItem === "box" && (
          <div style={{
            position: "absolute",
            bottom: "0px",
            left: "-2px",
            width: "20px",
            height: "18px",
            backgroundColor: "#C19A6B", // Cardboard brown
            border: "1px solid #17191B",
            borderRadius: "2px",
            zIndex: 10,
          }}>
            <div style={{ position: "absolute", top: "2px", left: 0, width: "100%", height: "1px", backgroundColor: "#17191B", opacity: 0.3 }} />
            <div style={{ position: "absolute", bottom: "4px", left: "50%", width: "1px", height: "14px", backgroundColor: "#17191B", opacity: 0.3 }} />
          </div>
        )}

        {/* Paintbrush Overlay */}
        {heldItem === "paintbrush" && (
          <div style={{
            position: "absolute",
            bottom: "4px",
            right: "-4px",
            width: "4px",
            height: "14px",
            transform: isActionAnimating ? "rotate(-45deg) translateY(2px)" : "rotate(15deg)",
            transition: "transform 0.1s",
            zIndex: 10,
          }}>
            {/* Handle */}
            <div style={{ position: "absolute", bottom: 0, left: "1px", width: "2px", height: "10px", backgroundColor: "#8C7B71" }} />
            {/* Metal ferrule */}
            <div style={{ position: "absolute", top: "2px", left: 0, width: "4px", height: "3px", backgroundColor: "#D8D5CC" }} />
            {/* Paint tip */}
            <div style={{ position: "absolute", top: "-2px", left: 0, width: "4px", height: "4px", backgroundColor: "#F4F2EC", borderRadius: "2px 2px 0 0" }} />
          </div>
        )}

        {/* Trash Overlay */}
        {heldItem === "trash" && (
          <div style={{
            position: "absolute",
            bottom: "6px",
            right: "-6px",
            width: "12px",
            height: "14px",
            backgroundColor: "#A87A65",
            borderRadius: "4px 6px 2px 4px",
            border: "1px solid #17191B",
            zIndex: 10,
          }}>
            {/* crumple details */}
            <div style={{ position: "absolute", top: "2px", left: "2px", width: "4px", height: "1px", backgroundColor: "#17191B", opacity: 0.3 }} />
            <div style={{ position: "absolute", top: "6px", right: "2px", width: "3px", height: "1px", backgroundColor: "#17191B", opacity: 0.3 }} />
          </div>
        )}
      </div>
    </div>
  );
}
