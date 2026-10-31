"use client";

import { ReactNode } from "react";
import { SecurityBot } from "./SecurityBot";
import { TrafficSystem } from "./TrafficSystem";
import { FactorySystem } from "./FactorySystem";
import { ArchiveSystem } from "./ArchiveSystem";
import styles from "./game.module.css";

interface WorldItem {
  id: string;
  type: string;
  x: number;
  isRecentlyDropped?: boolean;
}

interface TerravaleTownProps {
  playerX: number;
  heldItem: string | null;
  worldItems: WorldItem[];
  isCrossingPainted: boolean;
  cleanlinessScore: number;
  robotState: "idle" | "processing";
  isArchiveOpen: boolean;
  interactionPrompt: string | null;
  interactionTargetId: string | null;
  children?: ReactNode;
}

export function TerravaleTown({
  playerX,
  heldItem,
  worldItems,
  isCrossingPainted,
  cleanlinessScore,
  robotState,
  isArchiveOpen,
  interactionPrompt,
  interactionTargetId,
  children
}: TerravaleTownProps) {
  const isGateOpen = heldItem === "box";
  const gateX = 260; // Position of the gate

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "1200px",
      height: "216px",
      background: "linear-gradient(to bottom, #17201C 0%, #2C3532 100%)", // Deep earth background
      overflow: "hidden"
    }}>
      {/* Cityscape background silhouettes */}
      <div style={{ position: "absolute", bottom: "40px", left: "20px", width: "40px", height: "80px", backgroundColor: "#17191B", opacity: 0.8 }} />
      <div style={{ position: "absolute", bottom: "40px", left: "60px", width: "60px", height: "60px", backgroundColor: "#17191B", opacity: 0.8 }} />
      <div style={{ position: "absolute", bottom: "40px", left: "150px", width: "80px", height: "100px", backgroundColor: "#17191B", opacity: 0.8 }} />
      <div style={{ position: "absolute", bottom: "40px", left: "280px", width: "50px", height: "120px", backgroundColor: "#17191B", opacity: 0.8 }} />

      {/* Small environmental sign */}
      <div style={{
        position: "absolute",
        bottom: "40px",
        left: "140px",
        width: "30px",
        height: "40px",
        backgroundColor: "#546A76",
        border: "1px solid #17191B",
      }}>
        <div style={{ position: "absolute", top: "4px", left: "4px", width: "22px", height: "16px", backgroundColor: "#F4F2EC" }} />
        {/* Tiny illegible text */}
        <div style={{ position: "absolute", top: "6px", left: "6px", width: "18px", height: "1px", backgroundColor: "#17191B" }} />
        <div style={{ position: "absolute", top: "10px", left: "6px", width: "14px", height: "1px", backgroundColor: "#17191B" }} />
        <div style={{ position: "absolute", top: "14px", left: "6px", width: "16px", height: "1px", backgroundColor: "#17191B" }} />
      </div>

      {/* Ground */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "40px",
        backgroundColor: "#D8D5CC", // Structural stone pathway
        borderTop: "1px solid #17191B"
      }}>
        {/* Pathway lines */}
        <div style={{ position: "absolute", top: "8px", left: 0, width: "100%", height: "1px", backgroundColor: "#8C7B71", opacity: 0.5 }} />
      </div>

      {/* Ground Items */}
      {worldItems.map((item) => {
        const isTarget = item.id === interactionTargetId;
        const bobClass = isTarget ? styles.interactBob : "";
        const animClass = item.isRecentlyDropped ? styles.dropAnim : "";

        if (item.type === "box") {
          return (
            <div key={item.id} className={`${bobClass} ${animClass}`} style={{
              position: "absolute",
              bottom: "40px",
              left: `${item.x}px`,
              width: "24px",
              height: "24px",
              backgroundColor: "#8C7B71",
              border: "1px solid #17191B",
              zIndex: 30,
            }}>
              <div style={{ position: "absolute", top: "10px", left: 0, width: "100%", height: "1px", backgroundColor: "#17191B", opacity: 0.3 }} />
              <div style={{ position: "absolute", bottom: "4px", right: "4px", width: "8px", height: "8px", border: "1px solid #17191B", opacity: 0.2 }} />
            </div>
          );
        }
        if (item.type === "paintbrush") {
          return (
            <div key={item.id} className={`${bobClass} ${animClass}`} style={{
              position: "absolute",
              bottom: "40px",
              left: `${item.x}px`,
              width: "4px",
              height: "14px",
              zIndex: 30,
            }}>
              <div style={{ position: "relative", width: "100%", height: "100%", transform: "rotate(75deg)", transformOrigin: "bottom left" }}>
                <div style={{ position: "absolute", bottom: 0, left: "1px", width: "2px", height: "10px", backgroundColor: "#8C7B71" }} />
                <div style={{ position: "absolute", top: "2px", left: 0, width: "4px", height: "3px", backgroundColor: "#D8D5CC" }} />
                <div style={{ position: "absolute", top: "-2px", left: 0, width: "4px", height: "4px", backgroundColor: "#F4F2EC", borderRadius: "2px 2px 0 0" }} />
              </div>
            </div>
          );
        }
        if (item.type === "trash") {
          return (
            <div key={item.id} className={`${bobClass} ${animClass}`} style={{
              position: "absolute",
              bottom: "40px",
              left: `${item.x}px`,
              width: "12px",
              height: "14px",
              backgroundColor: "#A87A65",
              borderRadius: "4px 6px 2px 4px",
              border: "1px solid #17191B",
              zIndex: 30,
            }}>
              {/* crumple details */}
              <div style={{ position: "absolute", top: "2px", left: "2px", width: "4px", height: "1px", backgroundColor: "#17191B", opacity: 0.3 }} />
              <div style={{ position: "absolute", top: "6px", right: "2px", width: "3px", height: "1px", backgroundColor: "#17191B", opacity: 0.3 }} />
            </div>
          );
        }
        return null;
      })}

      {/* Security Gate */}
      <div style={{
        position: "absolute",
        bottom: "40px",
        left: `${gateX}px`,
        width: "8px",
        height: "80px",
        backgroundColor: "#2C3532",
        borderLeft: "1px solid #17191B",
        borderRight: "1px solid #17191B",
        zIndex: 20,
      }}>
        {/* Gate door (slides up if open) */}
        <div style={{
          position: "absolute",
          bottom: isGateOpen ? "60px" : "0px", // physically lifts out of the way
          left: "-12px",
          width: "12px",
          height: "60px",
          backgroundColor: "#DDEFE8", // Glowing mint energy or glass barrier
          border: "1px solid #087F5B",
          opacity: 0.8,
          transition: "bottom 0.5s ease-in-out",
        }}>
          {/* Stripes */}
          <div style={{ position: "absolute", top: "10px", left: 0, width: "100%", height: "2px", backgroundColor: "#087F5B", opacity: 0.5 }} />
          <div style={{ position: "absolute", top: "30px", left: 0, width: "100%", height: "2px", backgroundColor: "#087F5B", opacity: 0.5 }} />
          <div style={{ position: "absolute", top: "50px", left: 0, width: "100%", height: "2px", backgroundColor: "#087F5B", opacity: 0.5 }} />
        </div>
      </div>

      {/* Security Bot */}
      <SecurityBot x={gateX - 30} y={216 - 40 - 32} playerX={playerX} heldItem={heldItem} />

      {/* Traffic System */}
      <TrafficSystem x={420} y={0} isCrossingPainted={isCrossingPainted} />

      {/* Factory System */}
      <FactorySystem x={660} y={0} cleanlinessScore={cleanlinessScore} robotState={robotState} />

      {/* Archive System */}
      <ArchiveSystem x={1000} y={0} isArchiveOpen={isArchiveOpen} />

      {/* Render Player on top */}
      {children}

      {/* Interaction Prompt over Player */}
      {interactionPrompt && (
        <div className={styles.interactBob} style={{
          position: "absolute",
          bottom: "68px", // Above player head
          left: playerX - 30, // Center relative to player
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
