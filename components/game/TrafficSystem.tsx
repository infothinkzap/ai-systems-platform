"use client";

import { useEffect, useState } from "react";
import { SystemMessage } from "./SystemMessage";

interface TrafficSystemProps {
  x: number;
  y: number; // typically 0, spans the whole height
  isCrossingPainted: boolean;
}

export function TrafficSystem({ x, y, isCrossingPainted }: TrafficSystemProps) {
  const [carY, setCarY] = useState(-50);

  // Simple car loop
  useEffect(() => {
    let animationFrame: number;
    let currentY = -50;

    const loop = () => {
      // If crossing painted and car is near the crossing, stop.
      if (isCrossingPainted && currentY >= 110 && currentY <= 120) {
        // do nothing, car stops
      } else {
        currentY += 2; // move down
        if (currentY > 250) {
          currentY = -50; // reset
        }
      }

      setCarY(currentY);
      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [isCrossingPainted]);

  const messages = isCrossingPainted
    ? ["SCANNING...", "PEDESTRIAN CROSSING DETECTED.", "TRAFFIC HALTED. ✓"]
    : ["SCANNING..."];

  return (
    <div style={{ position: "absolute", left: x, top: y, width: "100px", height: "100%", zIndex: 10 }}>
      {/* Road background */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", backgroundColor: "#2C3532", borderLeft: "2px solid #17191B", borderRight: "2px solid #17191B" }} />

      {/* Dashed line */}
      <div style={{ position: "absolute", left: "50%", top: 0, width: "2px", height: "100%", borderLeft: "2px dashed #546A76" }} />

      {/* Painted Crossing (conditionally rendered) */}
      {isCrossingPainted && (
        <div style={{ position: "absolute", top: "140px", left: "10px", width: "80px", height: "30px", display: "flex", gap: "6px", justifyContent: "center" }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{ width: "8px", height: "100%", backgroundColor: "#F4F2EC" }} />
          ))}
        </div>
      )}

      {/* The Car */}
      <div style={{
        position: "absolute",
        left: "30px", // right lane
        top: `${carY}px`,
        width: "24px",
        height: "40px",
        backgroundColor: "#E53E3E", // Red car
        borderRadius: "4px",
        border: "1px solid #17191B",
        zIndex: 20
      }}>
        {/* Roof / Windshield */}
        <div style={{ position: "absolute", top: "10px", left: "2px", width: "18px", height: "20px", backgroundColor: "#A87A65", border: "1px solid #17191B", borderRadius: "2px" }} />
        {/* Headlights */}
        <div style={{ position: "absolute", bottom: "-2px", left: "2px", width: "6px", height: "4px", backgroundColor: "#F4F2EC", borderRadius: "2px" }} />
        <div style={{ position: "absolute", bottom: "-2px", right: "2px", width: "6px", height: "4px", backgroundColor: "#F4F2EC", borderRadius: "2px" }} />
      </div>

      {/* Traffic Camera Pole */}
      <div style={{ position: "absolute", top: "80px", left: "-10px", width: "4px", height: "60px", backgroundColor: "#8C7B71", border: "1px solid #17191B", zIndex: 30 }} />
      <div style={{ position: "absolute", top: "80px", left: "-6px", width: "30px", height: "4px", backgroundColor: "#8C7B71", border: "1px solid #17191B", zIndex: 30 }} />

      {/* Camera Body */}
      <div style={{ position: "absolute", top: "82px", left: "16px", width: "10px", height: "14px", backgroundColor: "#DDEFE8", border: "1px solid #17191B", borderRadius: "2px", zIndex: 30 }}>
        {/* Camera Lens */}
        <div style={{ position: "absolute", bottom: "-2px", left: "2px", width: "4px", height: "4px", backgroundColor: isCrossingPainted ? "#0E9F6E" : "#17191B", borderRadius: "50%" }} />
      </div>

      {/* System Message pointing to the camera */}
      <SystemMessage x={-30} y={40} lines={messages} />
    </div>
  );
}
