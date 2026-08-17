"use client";

import { useState } from "react";
import Link from "next/link";
import { SignalNode, SignalNodeState } from "@/components/visual/SignalNode";
import { WaveConnector } from "@/components/visual/WaveConnector";
import { TerrawaveSignal } from "@/components/visual/TerrawaveSignal";

const sequence = [
  {
    id: "problem",
    label: "PROBLEM",
    state: "inactive" as const,
    description: "The business friction that actually costs time, accuracy, or leverage."
  },
  {
    id: "workflow",
    label: "WORKFLOW",
    state: "deterministic" as const,
    description: "The deterministic steps that attempt to solve the problem today."
  },
  {
    id: "data",
    label: "DATA",
    state: "deterministic" as const,
    description: "The structured information required to make a decision."
  },
  {
    id: "intelligence",
    label: "INTELLIGENCE",
    state: "ai" as const,
    description: "The specific cognitive capability applied where rules fail."
  },
  {
    id: "decision",
    label: "DECISION",
    state: "ai" as const,
    description: "The resulting judgment, verified by deterministic bounds."
  },
  {
    id: "action",
    label: "ACTION",
    state: "deterministic" as const,
    description: "The automated or human-in-the-loop execution."
  }
];

export function InteractiveSequence() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // If hovered, the signal animates through all nodes up to the hovered one
  const getSignalState = (index: number) => {
    if (activeIndex === null) return "inactive";
    if (index < activeIndex) return "trace";
    if (index === activeIndex) return "active";
    return "inactive";
  };

  const getNodeState = (index: number, defaultState: SignalNodeState) => {
    if (activeIndex === null) return "inactive";
    if (index <= activeIndex) return defaultState;
    return "inactive";
  };

  return (
    <div className="flex flex-col gap-12 mt-16 max-w-4xl">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-0 lg:gap-0 relative">
        {/* Background track connecting everything */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 z-0">
          <TerrawaveSignal state={activeIndex !== null ? "trace" : "inactive"} animated={false} />
        </div>

        {sequence.map((node, i) => (
          <div key={node.id} className="flex flex-col lg:flex-row items-center flex-1 relative z-10 group">
            <div 
              className="flex-1 cursor-pointer relative"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            >
              <SignalNode 
                label={node.label} 
                state={getNodeState(i, node.state)}
                className="bg-background relative"
              />
              <div 
                className={`absolute left-0 top-full mt-2 w-64 bg-foreground text-background p-4 z-20 transition-all duration-300 ${
                  activeIndex === i ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <p className="text-sm font-mono tracking-tight leading-relaxed">{node.description}</p>
              </div>
            </div>
            
            {i < sequence.length - 1 && (
              <div className="hidden lg:flex flex-1 items-center justify-center">
                <WaveConnector orientation="horizontal" length="w-full" state={getSignalState(i)} />
              </div>
            )}
            
            {i < sequence.length - 1 && (
              <div className="flex lg:hidden items-center justify-center h-8">
                <WaveConnector orientation="vertical" length="h-full" state={getSignalState(i)} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 pt-8 items-center border-t border-border mt-16 lg:mt-4">
        <Link 
          href="/explore" 
          className="px-6 py-3 bg-foreground text-background font-mono text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors"
        >
          Explore The System
        </Link>
        <Link 
          href="#discover" 
          className="px-6 py-3 border border-border text-foreground font-mono text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors"
        >
          Map Your Problem
        </Link>
      </div>
    </div>
  );
}
