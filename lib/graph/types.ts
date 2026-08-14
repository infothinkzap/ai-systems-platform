export type EntityType = 
  | "Organization" 
  | "CorePhilosophy" 
  | "Person"
  | "Persona" 
  | "Domain"
  | "Problem"
  | "Workflow"
  | "CapabilityGroup"
  | "Capability" 
  | "Service"
  | "Product" 
  | "DataSource" 
  | "DataPrimitive" 
  | "Decision"
  | "Action"
  | "Outcome" 
  | "Metric"
  | "MethodStep"
  | "JourneyStep";

export type MaturityStatus = "concept" | "building" | "prototype" | "production";
export type EpistemicStatus = "hypothesis" | "designed" | "tested" | "established";
export type EvidenceType = "internal_reasoning" | "prototype_evidence" | "experiment" | "client_case";

export interface BaseEntity {
  id: string;
  type: EntityType;
  name: string;
  description?: string;
}

export interface ProductEntity extends BaseEntity {
  type: "Product";
  maturity_status?: MaturityStatus;
  epistemic_status?: EpistemicStatus;
  evidence?: EvidenceType[];
}

export interface CorePhilosophyEntity extends BaseEntity {
  type: "CorePhilosophy";
  epistemic_status?: EpistemicStatus;
  evidence?: EvidenceType[];
}

// Discriminator for semantic entities
export type SemanticEntity = 
  | ProductEntity
  | CorePhilosophyEntity
  | (BaseEntity & { type: Exclude<EntityType, "Product" | "CorePhilosophy"> });

export interface SemanticRelationship {
  source: string;
  type: string;
  target: string;
}

export interface SemanticGraph {
  schema_version: string;
  metadata: {
    name: string;
    description: string;
    last_updated: string;
  };
  entities: SemanticEntity[];
  relationships: SemanticRelationship[];
}
