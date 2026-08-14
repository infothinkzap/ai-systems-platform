import fs from "fs";
import path from "path";
import yaml from "yaml";
import { SemanticGraph } from "./types";

let cachedGraph: SemanticGraph | null = null;

export class GraphValidationError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = "GraphValidationError";
  }
}

/**
 * Validates the parsed graph for structural integrity.
 * - Missing entity IDs
 * - Duplicate entity IDs
 * - Relationships pointing to nonexistent entities
 */
function validateGraph(graph: SemanticGraph) {
  if (!graph.entities || !Array.isArray(graph.entities)) {
    throw new GraphValidationError("Graph is missing 'entities' array.");
  }
  if (!graph.relationships || !Array.isArray(graph.relationships)) {
    throw new GraphValidationError("Graph is missing 'relationships' array.");
  }

  const entityIds = new Set<string>();

  for (const rawEntity of graph.entities) {
    const entity = rawEntity as unknown as Record<string, unknown>;
    if (!entity.id || typeof entity.id !== "string") {
      throw new GraphValidationError("Entity missing or invalid 'id'.", { entity });
    }
    if (!entity.type || typeof entity.type !== "string") {
      throw new GraphValidationError(`Entity '${entity.id}' missing 'type'.`, { entity });
    }
    if (entityIds.has(entity.id)) {
      throw new GraphValidationError(`Duplicate entity ID detected: '${entity.id}'`);
    }
    entityIds.add(entity.id);
  }

  for (const rel of graph.relationships) {
    if (!rel.source || !rel.type || !rel.target) {
      throw new GraphValidationError("Malformed relationship. Must have source, type, and target.", { rel });
    }
    if (!entityIds.has(rel.source)) {
      throw new GraphValidationError(`Relationship source '${rel.source}' does not exist.`, { rel });
    }
    if (!entityIds.has(rel.target)) {
      throw new GraphValidationError(`Relationship target '${rel.target}' does not exist.`, { rel });
    }
  }
}

/**
 * Loads and caches the canonical semantic graph.
 */
export function loadGraph(): SemanticGraph {
  if (cachedGraph) return cachedGraph;

  const graphPath = path.join(process.cwd(), "docs", "intelligence", "terrawave-graph.yaml");
  
  try {
    const fileContents = fs.readFileSync(graphPath, "utf8");
    const parsed = yaml.parse(fileContents) as SemanticGraph;
    
    validateGraph(parsed);
    
    cachedGraph = parsed;
    return cachedGraph;
  } catch (error: unknown) {
    if (error instanceof GraphValidationError) {
      throw error;
    }
    const msg = error instanceof Error ? error.message : String(error);
    throw new GraphValidationError(`Failed to load or parse graph YAML: ${msg}`);
  }
}
