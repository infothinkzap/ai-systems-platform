export type MaturityStatus = "concept" | "prototype" | "building" | "deployed";
export type EpistemicStatus = "hypothesis" | "designed" | "tested" | "validated";
export type EvidenceType = "internal_reasoning" | "prototype_evidence" | "quantitative_measurement" | "production_observation";

export interface BaseEntity {
  id: string;
  type: string;
  title: string;
}

export interface Persona extends BaseEntity {
  type: "persona";
  description?: string;
}

export interface Problem extends BaseEntity {
  type: "problem";
  description: string;
}

export interface DataPrimitive extends BaseEntity {
  type: "data";
  source?: string;
}

export interface Capability extends BaseEntity {
  type: "capability";
  description: string;
}

export interface System extends BaseEntity {
  type: "product";
  tagline: string;
  maturity: MaturityStatus;
  epistemic: EpistemicStatus;
  evidenceType: EvidenceType;
}

export interface Service extends BaseEntity {
  type: "service";
  tagline: string;
  maturity: MaturityStatus;
}

export interface Outcome extends BaseEntity {
  type: "outcome";
  description: string;
}

export interface Metric extends BaseEntity {
  type: "metric";
  description: string;
}

export interface Insight extends BaseEntity {
  type: "insight";
  author: string;
  date: string;
}

// Graph Relational Wrapper
export interface GraphRelationship {
  sourceId: string;
  targetId: string;
  relationshipType: string;
}
