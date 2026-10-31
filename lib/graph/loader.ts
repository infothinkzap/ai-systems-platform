import fs from "fs";
import path from "path";
import yaml from "yaml";
import { SemanticGraph } from "./types";

let cachedGraph: SemanticGraph | null = null;
let cachedStamp = 0;

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
export function validateGraph(graph: SemanticGraph) {
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

  const find = (id: string) => graph.entities.find(e => e.id === id);
  const outgoing = (id: string, type: string) => graph.relationships.filter(r => r.source === id && r.type === type).map(r => find(r.target));
  for (const entity of graph.entities) {
    if (entity.type === "Opportunity") {
      if (entity.maturity_status !== "concept" || entity.epistemic_status !== "hypothesis" || entity.validation_status !== "needs_validation" || entity.knowledge_layer !== "possibility") {
        throw new GraphValidationError(`Opportunity '${entity.id}' must remain an explicitly unvalidated concept.`);
      }
      if (!entity.problem_statement || !entity.mvp_boundary || !entity.assumed_current_workflow || !entity.clarifications?.length || !entity.evidence?.length) throw new GraphValidationError(`Opportunity '${entity.id}' has incomplete discovery content.`);
      if (!["domain", "task", "artifact"].every(k => Array.isArray(entity.match_profile?.[k as keyof typeof entity.match_profile]))) throw new GraphValidationError(`Opportunity '${entity.id}' has invalid recognition signals.`);
      for (const [relation, type] of [["PROPOSES_WORKFLOW","Workflow"],["PROPOSES_SOLUTION_TO","Problem"],["CANDIDATE_FOR","Persona"],["HAS_RISK","Risk"],["REQUIRES_VALIDATION","ValidationRequirement"],["MAY_REUSE","Capability"]]) {
        const targets = outgoing(entity.id, relation);
        if (!targets.length || targets.some(e => e?.type !== type)) throw new GraphValidationError(`Opportunity '${entity.id}' needs valid ${relation} relationships.`);
      }
      for (const target of outgoing(entity.id,"RELATED_WORK")) if (target?.type !== "Product" && target?.type !== "Project") throw new GraphValidationError(`Invalid related work for '${entity.id}'.`);
    }
    if (entity.type === "Workflow" && entity.knowledge_layer === "possibility") {
      if (!entity.step_ids?.length || new Set(entity.step_ids).size !== entity.step_ids.length || entity.step_ids.some(id => find(id)?.type !== "WorkflowStep")) throw new GraphValidationError(`Proposed workflow '${entity.id}' has invalid ordered steps.`);
      if (!outgoing(entity.id,"USES_DATA").length || !outgoing(entity.id,"PRODUCES").length) throw new GraphValidationError(`Proposed workflow '${entity.id}' needs inputs and outputs.`);
      const parts = outgoing(entity.id,"HAS_PART").map(e => e?.id);
      if (entity.step_ids.some(id => !parts.includes(id))) throw new GraphValidationError(`Workflow '${entity.id}' step order disagrees with HAS_PART edges.`);
    }
    if (entity.type === "WorkflowStep") {
      const allocations = outgoing(entity.id,"REQUIRES_ALLOCATION");
      if (!entity.responsibility || allocations.length !== 1 || allocations[0]?.type !== "IntelligenceAllocation") throw new GraphValidationError(`Step '${entity.id}' needs one allocation and an explicit responsibility.`);
    }
    if (entity.type === "IntelligenceAllocation" && !["Human","Deterministic","Hybrid","AI","No AI"].includes(entity.mode)) throw new GraphValidationError(`Invalid allocation '${entity.id}'.`);
    if (entity.type === "Capability" && entity.support_status) {
      if (!outgoing(entity.id,"HAS_DELIVERY_READINESS").some(e => e?.type === "DeliveryReadiness")) throw new GraphValidationError(`Capability '${entity.id}' needs a readiness assessment.`);
      if (entity.support_status === "demonstrated") {
        const projects = graph.relationships.filter(r => r.type === "DEMONSTRATES" && r.target === entity.id).map(r => find(r.source));
        if (!projects.some(e => e?.type === "Project" && outgoing(e.id,"HAS_EVIDENCE").some(item => item?.type === "Evidence"))) throw new GraphValidationError(`Demonstrated capability '${entity.id}' lacks project evidence.`);
      }
    }
    if (entity.type === "Evidence" && (!entity.source_refs?.length || !entity.evidence_type)) throw new GraphValidationError(`Evidence '${entity.id}' lacks source references.`);
  }
}

/**
 * Loads and caches the canonical semantic graph.
 */
export function loadGraph(): SemanticGraph {
  const graphPath = path.join(process.cwd(), "docs", "intelligence", "terrawave-graph.yaml");
  
  try {
    const stamp = fs.statSync(graphPath).mtimeMs;
    if (cachedGraph && (process.env.NODE_ENV !== "development" || cachedStamp === stamp)) return cachedGraph;
    const fileContents = fs.readFileSync(graphPath, "utf8");
    const parsed = yaml.parse(fileContents) as SemanticGraph;
    
    validateGraph(parsed);
    
    cachedGraph = parsed;
    cachedStamp = stamp;
    return cachedGraph;
  } catch (error: unknown) {
    if (error instanceof GraphValidationError) {
      throw error;
    }
    const msg = error instanceof Error ? error.message : String(error);
    throw new GraphValidationError(`Failed to load or parse graph YAML: ${msg}`);
  }
}
