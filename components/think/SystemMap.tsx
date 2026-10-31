"use client";

import { useState, useMemo } from "react";
import { InterpretationResult, MapNode as MapNodeType, IntelligenceType } from "@/lib/think/interpreter";

interface Props {
  result: InterpretationResult;
  onCorrection: (id: string) => void;
}

const STAGE_ORDER = [
  "PROBLEM",
  "DATA",
  "WORKFLOW",
  "CAPABILITY",
  "DECISION",
  "OUTCOME",
  "SYSTEM"
];

export default function SystemMap({ result, onCorrection }: Props) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [intelligenceOverrides, setIntelligenceOverrides] = useState<Record<string, IntelligenceType>>({});

  const { nodes, confidence } = result;

  const groupedNodes = useMemo(() => {
    const map = new Map<string, MapNodeType[]>();
    STAGE_ORDER.forEach(s => map.set(s, []));

    nodes.forEach(node => {
      if (!map.has(node.category)) map.set(node.category, []);
      map.get(node.category)!.push(node);
    });

    return Array.from(map.entries()).filter(([_, list]) => list.length > 0);
  }, [nodes]);

  const activeNode = nodes.find(n => n.id === activeNodeId);
  const currentIntelligence = activeNode ? (intelligenceOverrides[activeNode.id] || activeNode.intelligence) : undefined;

  const handleIntelligenceChange = (val: IntelligenceType) => {
    if (activeNode) {
      setIntelligenceOverrides(prev => ({ ...prev, [activeNode.id]: val }));
    }
  };

  // System Detected counts
  const dataCount = nodes.filter(n => n.category === "DATA").length;
  const decisionCount = nodes.filter(n => n.category === "DECISION").length;
  const capabilityCount = nodes.filter(n => n.category === "CAPABILITY").length;

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-xl text-[#666666] mb-6">WE MAY HAVE MISREAD THE SYSTEM.</p>
        <p className="font-mono text-sm">We cannot confidently map this problem to the current Terrawave architecture.</p>
        <button
          onClick={() => onCorrection("none")}
          className="mt-8 border border-[#1A3B34] text-[#1A3B34] px-4 py-2 text-sm font-mono hover:bg-[#1A3B34] hover:text-white transition-colors"
        >
          ADJUST
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-12 relative w-full items-start">
      {/* MAP AREA */}
      <div className="flex-1 overflow-x-auto w-full hide-scrollbar pb-12">

        {confidence === "LOW" && (
          <div className="mb-8 p-4 border border-[#E5E5E5] bg-white max-w-md">
            <p className="font-mono text-sm text-[#888888] mb-2">INTERPRETATION CONFIDENCE: LOW</p>
            <p className="text-sm font-medium mb-4">WE MAY HAVE MISREAD THE SYSTEM.</p>
            <button
              onClick={() => onCorrection("none")}
              className="text-xs font-mono border border-[#E5E5E5] px-2 py-1 hover:border-[#1A3B34] hover:text-[#1A3B34] transition-colors"
            >
              ADJUST
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start animate-fade-in-up">
          {groupedNodes.map(([category, stageNodes], stageIdx) => (
            <div key={category} className="flex flex-col gap-6 relative min-w-[240px]">
              {/* Category Header */}
              <div className="font-mono text-xs text-[#888888] mb-2 tracking-widest">{category}</div>

              {stageNodes.map((node) => {
                const nodeIntelligence = intelligenceOverrides[node.id] || node.intelligence;
                const isSelected = activeNodeId === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveNodeId(node.id)}
                    className={`
                      border p-5 cursor-pointer transition-all duration-300 relative bg-white
                      ${isSelected ? 'border-[#1A3B34] shadow-md scale-[1.02]' : 'border-[#E5E5E5] hover:border-[#B3B3B3]'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 ${
                        node.status === 'DETECTED' ? 'bg-[#E2F0ED] text-[#1A3B34]' :
                        node.status === 'CONNECTED' ? 'bg-[#F2F2F2] text-[#666666]' :
                        'bg-transparent border border-[#E5E5E5] text-[#888888]'
                      }`}>
                        {node.status}
                      </span>

                      {nodeIntelligence && (
                        <span className="text-[10px] font-mono text-[#1A3B34]">
                          {nodeIntelligence === "NONE" ? "MANUAL" : nodeIntelligence}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-medium leading-tight text-[#2D2D2D]">{node.name}</h3>
                  </div>
                );
              })}

              {/* Connector lines (CSS only for desktop approx) */}
              {stageIdx < groupedNodes.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-8 w-8 h-[1px] bg-[#E5E5E5]"></div>
              )}
            </div>
          ))}
        </div>

        {/* CONVERSION */}
        <div className="mt-32 border-t border-[#E5E5E5] pt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-xl md:text-2xl text-[#2D2D2D] mb-8 font-light">YOUR SYSTEM CAN BE MAPPED MORE DEEPLY.</p>
          <div className="flex gap-4">
            <button className="bg-[#1A3B34] text-white px-6 py-3 font-mono text-sm hover:bg-[#0F241F] transition-colors">
              START DISCOVERY →
            </button>
            <button className="border border-[#E5E5E5] text-[#666666] px-6 py-3 font-mono text-sm hover:border-[#1A3B34] hover:text-[#1A3B34] transition-colors bg-white">
              EXPLORE TERRAWAVE →
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - CONTEXT & SYSTEM DETECTED */}
      <div className="w-full xl:w-[320px] flex flex-col gap-6 shrink-0">

        {/* CONTEXT PANEL (When active node) */}
        {activeNode && (
          <div className="border border-[#1A3B34] bg-white p-6 animate-fade-in">
            <h4 className="font-mono text-xs text-[#1A3B34] mb-2">{activeNode.category}</h4>
            <h2 className="text-xl font-medium mb-4">{activeNode.name}</h2>
            {activeNode.description && (
              <p className="text-[#666666] text-sm leading-relaxed mb-6">
                {activeNode.description}
              </p>
            )}

            {/* INTELLIGENCE CONTROLS */}
            {activeNode.intelligence !== undefined && (
              <div className="pt-6 border-t border-[#E5E5E5]">
                <h4 className="font-mono text-xs text-[#888888] mb-3">INTELLIGENCE ALLOCATION</h4>

                <div className="flex flex-col gap-2 mb-4">
                  {["HUMAN", "DETERMINISTIC", "HYBRID", "AI"].map(type => (
                    <button
                      key={type}
                      onClick={() => handleIntelligenceChange(type as IntelligenceType)}
                      className={`text-left px-3 py-2 text-sm font-mono transition-colors ${
                        currentIntelligence === type
                          ? 'bg-[#E2F0ED] text-[#1A3B34]'
                          : 'hover:bg-[#F2F2F2] text-[#666666]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {currentIntelligence && currentIntelligence !== "NONE" && currentIntelligence !== "HUMAN" && (
                  <div className="mb-4 p-3 bg-[#FDFBF7] border border-[#E5E5E5]">
                    <p className="font-mono text-[10px] text-[#1A3B34] mb-1">AUTOMATION ADDED</p>
                    <p className="text-xs text-[#666666]">
                      {currentIntelligence === "AI" ? "Human decision removed from this step." : "Consistent / Rule-based execution applied."}
                    </p>
                  </div>
                )}

                {currentIntelligence !== "NONE" && (
                  <button
                    onClick={() => handleIntelligenceChange("NONE")}
                    className="text-xs font-mono text-[#D9534F] hover:underline"
                  >
                    REMOVE AI
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* SYSTEM DETECTED PANEL */}
        <div className="border border-[#E5E5E5] bg-white p-6">
          <h3 className="font-mono text-sm font-medium mb-6">SYSTEM DETECTED</h3>

          <div className="flex flex-col gap-3 font-mono text-xs text-[#666666]">
            {nodes.filter(n => n.category === "PROBLEM").length > 0 && (
              <div className="flex justify-between">
                <span>PROBLEM</span>
                <span className="text-[#2D2D2D]">{nodes.filter(n => n.category === "PROBLEM").length}</span>
              </div>
            )}
            {dataCount > 0 && (
              <div className="flex justify-between">
                <span>DATA SOURCES</span>
                <span className="text-[#2D2D2D]">{dataCount}</span>
              </div>
            )}
            {capabilityCount > 0 && (
              <div className="flex justify-between">
                <span>CAPABILITIES</span>
                <span className="text-[#2D2D2D]">{capabilityCount}</span>
              </div>
            )}
            {decisionCount > 0 && (
              <div className="flex justify-between">
                <span>DECISION POINTS</span>
                <span className="text-[#2D2D2D]">{decisionCount}</span>
              </div>
            )}
            {nodes.filter(n => n.category === "WORKFLOW").length > 0 && (
              <div className="flex justify-between">
                <span>WORKFLOWS</span>
                <span className="text-[#2D2D2D]">{nodes.filter(n => n.category === "WORKFLOW").length}</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
            <p className="font-mono text-[10px] text-[#888888] mb-2">NOT ACCURATE?</p>
            <button
              onClick={() => onCorrection("next")}
              className="text-xs font-mono border border-[#E5E5E5] px-3 py-1.5 hover:border-[#1A3B34] hover:text-[#1A3B34] transition-colors w-full text-center"
            >
              NOT THIS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
