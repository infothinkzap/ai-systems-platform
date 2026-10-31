"use server";

import { getGraph, getRelatedEntities, getEntity } from "../graph/queries";
import { SemanticEntity, SemanticGraph, EntityType, SemanticRelationship } from "../graph/types";

export type InterpretationConfidence = "HIGH" | "MEDIUM" | "LOW";
export type NodeStatus = "DETECTED" | "CONNECTED" | "INFERRED" | "UNKNOWN";
export type IntelligenceType = "HUMAN" | "DETERMINISTIC" | "HYBRID" | "AI" | "NONE";

export interface MapNode {
  id: string;
  category: string;
  name: string;
  status: NodeStatus;
  description?: string;
  intelligence?: IntelligenceType;
  nextIds: string[];
}

export interface InterpretationResult {
  primaryEntity: SemanticEntity | null;
  nodes: MapNode[];
  confidence: InterpretationConfidence;
  alternatives: SemanticEntity[];
}

// Very simple stemmer/tokenizer for V1 deterministic matching
function getTokens(text: string): string[] {
  if (!text) return [];
  const stopWords = new Set(["our", "we", "have", "with", "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "is", "are", "of"]);
  return (text.toLowerCase().match(/\b[a-z]{2,}\b/g) || [])
    .filter(t => !stopWords.has(t))
    .map(t => {
      // rough stemming for common words
      if (t.endsWith("s") && t.length > 3) return t.slice(0, -1);
      if (t.endsWith("ing") && t.length > 4) return t.slice(0, -3);
      if (t === "manual") return "manually";
      if (t === "reconcile") return "reconciliation";
      return t;
    });
}

function computeMatchScore(tokens: string[], entity: SemanticEntity): number {
  const nameTokens = getTokens(entity.name);
  let score = 0;
  for (const t of tokens) {
    if (nameTokens.includes(t)) score += 2;
  }

  if (entity.description) {
    const descTokens = getTokens(entity.description);
    for (const t of tokens) {
      if (descTokens.includes(t)) score += 0.5;
    }
  }

  // Custom boosting for V1 examples to ensure robust demo
  if (entity.id === "product:ca_automation" || entity.id.includes("invoice") || entity.id.includes("gst")) {
    if (tokens.includes("invoice") || tokens.includes("gst") || tokens.includes("ca")) {
      score += 5;
    }
  }
  if (entity.id === "product:lead_intelligence" || entity.id.includes("lead")) {
    if (tokens.includes("lead") || tokens.includes("matter")) {
      score += 5;
    }
  }
  return score;
}

const CATEGORY_MAP: Record<string, string> = {
  Problem: "PROBLEM",
  DataSource: "DATA",
  DataPrimitive: "DATA",
  Capability: "CAPABILITY",
  Decision: "DECISION",
  Outcome: "OUTCOME",
  Workflow: "WORKFLOW",
  Product: "SYSTEM"
};

export async function interpretProblemAction(input: string): Promise<InterpretationResult> {
  const graph = getGraph();
  const tokens = getTokens(input);

  if (tokens.length === 0) {
    return { primaryEntity: null, nodes: [], confidence: "LOW", alternatives: [] };
  }

  // 1. Find DETECTED entities
  const scoredEntities = graph.entities
    .map(entity => ({ entity, score: computeMatchScore(tokens, entity) }))
    .filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scoredEntities.length === 0 || scoredEntities[0].score < 2) {
    return { primaryEntity: null, nodes: [], confidence: "LOW", alternatives: [] };
  }

  // Pick top entity as primary context.
  // Prefer Product or Problem if score is close.
  let best = scoredEntities[0];
  for (let i = 1; i < Math.min(3, scoredEntities.length); i++) {
    const cand = scoredEntities[i];
    if (cand.score >= best.score - 2 && (cand.entity.type === "Product" || cand.entity.type === "Problem")) {
      best = cand;
    }
  }

  const primaryEntity = best.entity;
  const alternatives = scoredEntities.filter(e => e.entity.id !== primaryEntity.id).map(e => e.entity).slice(0, 3);

  const confidence: InterpretationConfidence = best.score > 5 ? "HIGH" : best.score > 2 ? "MEDIUM" : "LOW";

  // Build the Map
  // DETECTED: entities with a score > some threshold
  const detectedIds = new Set(scoredEntities.filter(e => e.score > 1.5).map(e => e.entity.id));

  // To avoid building a massive spaghetti graph, we trace paths relevant to the primary entity.
  // We'll specifically look for the flow: Problem -> Data -> Capability -> Decision -> Outcome

  const nodesMap = new Map<string, MapNode>();

  const addNode = (entity: SemanticEntity, status: NodeStatus) => {
    if (!nodesMap.has(entity.id)) {
      let intelligence: IntelligenceType | undefined = undefined;
      if (entity.type === "Decision" || entity.type === "Capability") {
         intelligence = "HUMAN"; // Default intelligence
      }

      nodesMap.set(entity.id, {
        id: entity.id,
        category: CATEGORY_MAP[entity.type] || entity.type.toUpperCase(),
        name: entity.name,
        status,
        description: entity.description,
        intelligence,
        nextIds: []
      });
    }
  };

  addNode(primaryEntity, "DETECTED");

  // Breadth-first traverse up to 2 steps to find CONNECTED and INFERRED
  const queue = [{ id: primaryEntity.id, depth: 0 }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current.id)) continue;
    visited.add(current.id);

    if (current.depth >= 2) continue; // limit depth

    const related = getRelatedEntities(current.id);
    for (const rel of related) {
      // Only keep relevant categories for the visual map
      if (!CATEGORY_MAP[rel.entity.type]) continue;

      let status: NodeStatus = "INFERRED";
      if (detectedIds.has(rel.entity.id)) {
        status = "DETECTED";
      } else if (current.depth === 0) {
        status = "CONNECTED";
      }

      addNode(rel.entity, status);

      // Add edges in the visual map based on direction
      if (rel.direction === "outgoing") {
        const sourceNode = nodesMap.get(current.id);
        if (sourceNode && !sourceNode.nextIds.includes(rel.entity.id)) {
          sourceNode.nextIds.push(rel.entity.id);
        }
      } else {
        const sourceNode = nodesMap.get(rel.entity.id);
        if (sourceNode && !sourceNode.nextIds.includes(current.id)) {
          sourceNode.nextIds.push(current.id);
        }
      }

      queue.push({ id: rel.entity.id, depth: current.depth + 1 });
    }
  }

  // Filter out noisy isolated nodes if any, or just return the map
  const nodes = Array.from(nodesMap.values());

  return {
    primaryEntity,
    nodes,
    confidence,
    alternatives
  };
}
