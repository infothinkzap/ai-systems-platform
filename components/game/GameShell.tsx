"use client";

import { useEffect, useState, useRef } from "react";
import { GameViewport, LOGICAL_WIDTH, LOGICAL_HEIGHT } from "./GameViewport";
import { Player } from "./Player";
import { TerravaleTown } from "./TerravaleTown";
import { ArchiveInterior } from "./ArchiveInterior";
import { TuningReveal } from "./TuningReveal";
import { TestChamber } from "./TestChamber";
import { TestTerminalUI } from "./TestTerminalUI";
import styles from "./game.module.css";

const PLAYER_SPEED = 60; // logical pixels per second
const GROUND_Y = LOGICAL_HEIGHT - 40 - 24; // 40px floor, 24px player height
const WORLD_WIDTH = 1200; // pixels
const GATE_X = 260 - 12; // Gate barrier
const ARCHIVE_GATE_X = 990 - 12; // Archive door barrier

interface WorldItem {
  id: string;
  type: string;
  x: number;
  isRecentlyDropped?: boolean;
}

export function GameShell() {
  const [playerX, setPlayerX] = useState(40); // Start position
  const [isMoving, setIsMoving] = useState(false);
  const [facingRight, setFacingRight] = useState(true);

  const [heldItem, setHeldItem] = useState<string | null>(null);
  const [worldItems, setWorldItems] = useState<WorldItem[]>([
    { id: "box1", type: "box", x: 100 },
    { id: "brush1", type: "paintbrush", x: 350 },
    { id: "trash1", type: "trash", x: 600 }
  ]);

  const [interactionPrompt, setInteractionPrompt] = useState<string | null>(null);
  const [interactionTargetId, setInteractionTargetId] = useState<string | null>(null);

  const [showIntro, setShowIntro] = useState(true);

  // Scene management
  const [scene, setScene] = useState<"town" | "archive" | "test_chamber">("town");
  const [transitionState, setTransitionState] = useState<"none" | "fading-out" | "fading-in">("none");
  const [isTuningReveal, setIsTuningReveal] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  // Test Chamber State
  const [testGateOpen, setTestGateOpen] = useState(false);
  const [testObstacleMoved, setTestObstacleMoved] = useState(false);
  const [isTestTerminalActive, setIsTestTerminalActive] = useState(false);

  // Traffic puzzle
  const [isCrossingPainted, setIsCrossingPainted] = useState(false);
  const [isPainting, setIsPainting] = useState(false);

  // Factory puzzle
  const [cleanlinessScore, setCleanlinessScore] = useState(0);
  const [robotState, setRobotState] = useState<"idle" | "processing">("idle");

  // Archive puzzle
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  // Store keys in a ref so requestAnimationFrame can read them synchronously
  const keys = useRef<{ [key: string]: boolean }>({});
  const lastTime = useRef<number>(0);
  const requestRef = useRef<number>(0);

  // Intro timer
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrows/space
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
      }
      keys.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedMode]);

  // Central Game Loop
  useEffect(() => {
    const update = (time: number) => {
      if (lastTime.current !== 0) {
        const delta = (time - lastTime.current) / 1000;

        let moved = false;
        let dx = 0;

        // Skip movement if intro is showing, if we are in the middle of a painting animation, or if the tuning interface is active
        if (!showIntro && !isPainting && !isTuningReveal) {
          if (keys.current["arrowleft"] || keys.current["a"]) {
            dx -= PLAYER_SPEED * delta;
            moved = true;
            setFacingRight(false);
          }
          if (keys.current["arrowright"] || keys.current["d"]) {
            dx += PLAYER_SPEED * delta;
            moved = true;
            setFacingRight(true);
          }

          if (moved) {
            setPlayerX(prev => {
              let nextX = prev + dx;

              if (scene === "town") {
                // Collision: Security Gate
                if (nextX > GATE_X - 16 && nextX < GATE_X + 8 && heldItem !== "box") {
                  if (prev <= GATE_X - 16) nextX = GATE_X - 16;
                  else if (prev >= GATE_X + 8) nextX = GATE_X + 8;
                }

                // Collision: Archive Door
                if (nextX > ARCHIVE_GATE_X - 16 && nextX < ARCHIVE_GATE_X + 8 && !isArchiveOpen) {
                  if (prev <= ARCHIVE_GATE_X - 16) nextX = ARCHIVE_GATE_X - 16;
                  else if (prev >= ARCHIVE_GATE_X + 8) nextX = ARCHIVE_GATE_X + 8;
                }

                // Clamp to screen bounds
                if (nextX < 0) nextX = 0;
                if (nextX > WORLD_WIDTH - 16) nextX = WORLD_WIDTH - 16;

                // Transition to Archive
                if (nextX > 1000 && isArchiveOpen && transitionState === "none") {
                  setTransitionState("fading-out");
                  setTimeout(() => {
                    setScene("archive");
                    setPlayerX(20); // Spawn on left side of archive
                    setTransitionState("fading-in");
                    setTimeout(() => {
                      setTransitionState("none");
                    }, 500);
                  }, 500); // Wait for fade out
                }
              } else if (scene === "archive" && !isTuningReveal) {
                // Left bounds
                if (nextX < 0) nextX = 0;

                // Transition to Test Chamber
                if (selectedMode !== null && nextX > 384 && transitionState === "none") {
                  setTransitionState("fading-out");
                  setTimeout(() => {
                    setScene("test_chamber");
                    setPlayerX(20); // spawn left side of test chamber
                    setTransitionState("fading-in");
                    setTimeout(() => setTransitionState("none"), 500);
                  }, 500);
                } else if (selectedMode === null || transitionState !== "none") {
                  // Clamp to archive bounds (384px width) if passage not open
                  if (nextX > 384 - 16) nextX = 384 - 16;
                }
              } else if (scene === "test_chamber" && !isTestTerminalActive) {
                // Transition back to Archive
                if (nextX < 0 && transitionState === "none") {
                  setTransitionState("fading-out");
                  setTimeout(() => {
                    setScene("archive");
                    setPlayerX(384 - 20); // spawn right side of archive
                    setTransitionState("fading-in");
                    setTimeout(() => setTransitionState("none"), 500);
                  }, 500);
                }

                if (nextX > 384 - 16) nextX = 384 - 16;
              }

              return nextX;
            });
          }

          // 1. Calculate interaction states
          let currentPrompt: string | null = null;
          let targetItemId: string | null = null;

          if (scene === "town") {
            const PICKUP_RADIUS = 30;
            let closestItemId = "";
            let minDist = PICKUP_RADIUS;
            let canPickUp = false;

            if (!heldItem) {
              worldItems.forEach((item) => {
                const dist = Math.abs(item.x - playerX);
                if (dist < minDist) {
                  minDist = dist;
                  closestItemId = item.id;
                  canPickUp = true;
                }
              });
            }

            if (heldItem === "paintbrush" && playerX > 400 && playerX < 470 && !isCrossingPainted) {
              currentPrompt = "PAINT";
            } else if (heldItem === "trash" && Math.abs(playerX - 660) < 30) {
              currentPrompt = "DEPOSIT";
            } else if (canPickUp) {
              currentPrompt = "PICK UP";
              targetItemId = closestItemId;
            }

            // 2. Interaction logic: Spacebar
            if (keys.current[" "]) {
              keys.current[" "] = false; // consume key

              // Priority 1: Contextual Use
              if (heldItem === "paintbrush" && playerX > 400 && playerX < 470 && !isCrossingPainted) {
                setIsPainting(true);
                setTimeout(() => {
                  setIsCrossingPainted(true);
                  setIsPainting(false);
                }, 600);
              } else if (heldItem === "trash" && Math.abs(playerX - 660) < 30) {
                // Deposit trash exactly at Bin A (660)
                const newId = Date.now().toString();
                setWorldItems(prev => [...prev, { id: newId, type: heldItem, x: 660, isRecentlyDropped: true }]);
                setTimeout(() => setWorldItems(prev => prev.map(i => i.id === newId ? { ...i, isRecentlyDropped: false } : i)), 250);
                setHeldItem(null);
              }
              // Priority 2: Pick Up
              else if (!heldItem && canPickUp) {
                setWorldItems(prev => {
                  const idx = prev.findIndex(i => i.id === closestItemId);
                  if (idx !== -1) {
                    setHeldItem(prev[idx].type);
                    const next = [...prev];
                    next.splice(idx, 1);
                    return next;
                  }
                  return prev;
                });
              }
              // Priority 3: Drop
              else if (heldItem) {
                const newId = Date.now().toString();
                setWorldItems(prev => [...prev, { id: newId, type: heldItem, x: playerX, isRecentlyDropped: true }]);
                setTimeout(() => setWorldItems(prev => prev.map(i => i.id === newId ? { ...i, isRecentlyDropped: false } : i)), 250);
                setHeldItem(null);
              }
            }
          } else if (scene === "archive" && !isTuningReveal) {
            // Archive Interaction
            if (playerX > 150 && playerX < 210) {
              currentPrompt = "INTERACT";
            }

            if (keys.current[" "] && currentPrompt === "INTERACT") {
              keys.current[" "] = false;
              setIsTuningReveal(true);
            }
          } else if (scene === "test_chamber" && !isTestTerminalActive) {
            const isNearTerminal = playerX > 150 && playerX < 210;
            const obstacleX = testObstacleMoved ? 230 : 280;
            const isNearObstacle = playerX > obstacleX - 30 && playerX < obstacleX + 10;

            if (isNearTerminal) {
              currentPrompt = selectedMode === "no_ai" ? "PULL" : "INTERACT";
            } else if (isNearObstacle) {
              currentPrompt = testObstacleMoved ? "MOVE BACK" : "MOVE";
            }

            if (keys.current[" "]) {
              keys.current[" "] = false;
              if (currentPrompt === "INTERACT") {
                setIsTestTerminalActive(true);
              } else if (currentPrompt === "PULL") {
                setTestGateOpen(prev => !prev);
              } else if (currentPrompt === "MOVE" || currentPrompt === "MOVE BACK") {
                setTestObstacleMoved(prev => !prev);
              }
            }
          }

          // Only update react state if it changed to avoid cascading renders
          setInteractionPrompt(prev => prev === currentPrompt ? prev : currentPrompt);
          setInteractionTargetId(prev => prev === targetItemId ? prev : targetItemId);

        }

        setIsMoving(moved);
      }

      lastTime.current = time;
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [heldItem, playerX, showIntro, isCrossingPainted, isPainting, isArchiveOpen, worldItems, scene, transitionState, isTuningReveal, isTestTerminalActive, selectedMode, testObstacleMoved]);

  // Factory Logic Loop
  useEffect(() => {
    // If robot is idle, check if trash is in Bin A (x === 660)
    if (robotState === "idle") {
      const trashInA = worldItems.findIndex(i => i.type === "trash" && i.x === 660);
      if (trashInA !== -1) {
        const idToMove = worldItems[trashInA].id;
        const startTimeout = setTimeout(() => {
          setRobotState("processing");
          setTimeout(() => {
            setWorldItems(prev => {
              const next = [...prev];
              const idx = next.findIndex(i => i.id === idToMove);
              if (idx !== -1) {
                next[idx].x = 740; // Move to Bin B
              }
              return next;
            });
            setCleanlinessScore(s => s + 1);
            setRobotState("idle");
          }, 1000); // 1s processing time
        }, 0);
        return () => clearTimeout(startTimeout);
      }
    }
  }, [worldItems, robotState]);

  // Archive Scanning Logic Loop
  useEffect(() => {
    if (playerX > 940 && playerX < 1000) {
      if (heldItem === "paintbrush" && !isArchiveOpen) {
        const timeout = setTimeout(() => setIsArchiveOpen(true), 0);
        return () => clearTimeout(timeout);
      }
    } else if (isArchiveOpen) {
      const timeout = setTimeout(() => setIsArchiveOpen(false), 0);
      return () => clearTimeout(timeout);
    }
  }, [playerX, heldItem, isArchiveOpen]);

  // Camera logic
  const cameraX = Math.max(0, Math.min(playerX - LOGICAL_WIDTH / 2, WORLD_WIDTH - LOGICAL_WIDTH));

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#000" }}>
      <GameViewport>
        {scene === "town" ? (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${WORLD_WIDTH}px`,
            height: `${LOGICAL_HEIGHT}px`,
            transform: `translateX(${-cameraX}px)`,
            transition: "transform 0.1s linear" // Smooth camera follow
          }}>
          <TerravaleTown
            playerX={playerX}
            heldItem={heldItem}
            worldItems={worldItems}
            isCrossingPainted={isCrossingPainted}
            cleanlinessScore={cleanlinessScore}
            robotState={robotState}
            isArchiveOpen={isArchiveOpen}
            interactionPrompt={interactionPrompt}
            interactionTargetId={interactionTargetId}
          >
            <Player
              x={playerX}
              y={GROUND_Y}
              isMoving={isMoving}
              facingRight={facingRight}
              heldItem={heldItem}
              isActionAnimating={isPainting}
            />
          </TerravaleTown>
          </div>
        ) : scene === "archive" ? (
          <ArchiveInterior
            playerX={playerX}
            interactionPrompt={interactionPrompt}
          >
            <Player
              x={playerX}
              y={GROUND_Y}
              isMoving={isMoving}
              facingRight={facingRight}
              heldItem={heldItem}
              isActionAnimating={false}
            />
            {isTuningReveal && <TuningReveal onTuneComplete={(mode) => {
              setSelectedMode(mode);
              setIsTuningReveal(false);
              setTestGateOpen(false);
              setTestObstacleMoved(false);
            }} />}
          </ArchiveInterior>
        ) : scene === "test_chamber" ? (
          <TestChamber
            playerX={playerX}
            interactionPrompt={interactionPrompt}
            selectedMode={selectedMode}
            gateOpen={testGateOpen}
            obstacleMoved={testObstacleMoved}
            terminalPhase="idle"
          >
            <Player
              x={playerX}
              y={GROUND_Y}
              isMoving={isMoving}
              facingRight={facingRight}
              heldItem={heldItem}
              isActionAnimating={false}
            />
            {isTestTerminalActive && selectedMode && (
              <TestTerminalUI
                mode={selectedMode}
                obstacleMoved={testObstacleMoved}
                onComplete={(action) => {
                  if (action === "open") setTestGateOpen(true);
                  else if (action === "close") setTestGateOpen(false);
                }}
                onClose={() => setIsTestTerminalActive(false)}
              />
            )}
          </TestChamber>
        ) : null}

        {/* Scene Transition Overlay */}
        {transitionState !== "none" && (
          <div className={transitionState === "fading-out" ? styles.fadeToBlack : styles.fadeFromBlack} style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            zIndex: 1000,
            pointerEvents: "none"
          }} />
        )}

        {showIntro && (
          <div style={{
            position: "absolute",
            top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(23, 25, 27, 0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#F4F2EC", fontFamily: "var(--font-mono)",
            zIndex: 100
          }}>
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontSize: "16px", marginBottom: "16px" }}>TERRAVALE</h1>
              <p style={{ fontSize: "10px", marginBottom: "16px" }}>Left/Right Arrows to move.</p>
              <button
                onClick={() => setShowIntro(false)}
                style={{
                  background: "transparent", border: "1px solid #F4F2EC",
                  color: "#F4F2EC", padding: "4px 8px", fontFamily: "var(--font-mono)",
                  cursor: "pointer", fontSize: "10px"
                }}
              >
                START
              </button>
            </div>
          </div>
        )}
      </GameViewport>
    </div>
  );
}
