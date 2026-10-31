"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import styles from "./game.module.css";

interface GameViewportProps {
  children: ReactNode;
}

export const LOGICAL_WIDTH = 384;
export const LOGICAL_HEIGHT = 216;

export function GameViewport({ children }: GameViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;

      // Calculate scale to fit 16:9 while maximizing space
      const scaleX = clientWidth / LOGICAL_WIDTH;
      const scaleY = clientHeight / LOGICAL_HEIGHT;

      // Ensure pixel-perfect scaling by rounding down to nearest whole number if possible,
      // but if the screen is too small, allow fractional scaling (handled by browser).
      // A common retro game approach is Math.floor, but for web we can just use Math.min for responsive fit.
      let rawScale = Math.min(scaleX, scaleY);

      // Optional: floor to nearest integer for truly crisp pixels if space allows,
      // otherwise use fractional to fit mobile/small windows.
      if (rawScale > 1) {
        rawScale = Math.floor(rawScale);
      }

      setScale(rawScale);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={containerRef} className={styles.viewport}>
      <div
        className={styles.logicalCanvas}
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
