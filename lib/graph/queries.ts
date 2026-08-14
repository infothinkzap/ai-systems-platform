import { loadGraph } from "./loader";
import { SemanticEntity, EntityType, SemanticRelationship } from "./types";

/**
 * Returns the entire validated graph.
 */
export function getGraph() {
  return loadGraph();
}

/**
 * Gets a specific entity by its precise ID.
 */
export function getEntity(id: string): SemanticEntity | undefined {
  const graph = getGraph();
  return graph.entities.find(e => e.id === id);
}

/**
 * Gets all entities of a specific type.
 */
export function getEntitiesByType<T extends SemanticEntity>(type: EntityType): T[] {
  const graph = getGraph();
  return graph.entities.filter(e => e.type === type) as T[];
}

// Convenience Methods
export const getSystems = () => getEntitiesByType("Product");
export const getCapabilities = () => getEntitiesByType("Capability");
export const getPersonas = () => getEntitiesByType("Persona");
export const getDataSources = () => getEntitiesByType("DataSource");
export const getDataPrimitives = () => getEntitiesByType("DataPrimitive");
export const getOutcomes = () => getEntitiesByType("Outcome");
export const getMetrics = () => getEntitiesByType("Metric");

/**
 * Gets all relationships where the given entity is the source.
 */
export function getRelationshipsFrom(sourceId: string): SemanticRelationship[] {
  const graph = getGraph();
  return graph.relationships.filter(r => r.source === sourceId);
}

/**
 * Gets all relationships where the given entity is the target.
 */
export function getRelationshipsTo(targetId: string): SemanticRelationship[] {
  const graph = getGraph();
  return graph.relationships.filter(r => r.target === targetId);
}

/**
 * Gets all entities directly related to the given entity (both incoming and outgoing).
 */
export function getRelatedEntities(id: string): { type: string; entity: SemanticEntity; direction: "incoming" | "outgoing" }[] {
  const graph = getGraph();
  const related: { type: string; entity: SemanticEntity; direction: "incoming" | "outgoing" }[] = [];
  
  for (const rel of graph.relationships) {
    if (rel.source === id) {
      const target = getEntity(rel.target);
      if (target) related.push({ type: rel.type, entity: target, direction: "outgoing" });
    }
    if (rel.target === id) {
      const source = getEntity(rel.source);
      if (source) related.push({ type: rel.type, entity: source, direction: "incoming" });
    }
  }
  
  return related;
}

/**
 * Gets all entities that have a specific epistemic or maturity status.
 */
export function getEntitiesByStatus(status: string): SemanticEntity[] {
  const graph = getGraph();
  return graph.entities.filter(e => {
    const casted = e as unknown as Record<string, unknown>;
    return casted.maturity_status === status || casted.epistemic_status === status;
  });
}
