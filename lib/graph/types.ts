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
  | "JourneyStep"
  | "Project" | "Opportunity" | "WorkflowStep" | "IntelligenceAllocation"
  | "Risk" | "ValidationRequirement" | "Evidence" | "DeliveryReadiness";

export type MaturityStatus = "concept" | "building" | "prototype" | "deployed" | "production";
export type EpistemicStatus = "hypothesis" | "designed" | "tested" | "established";
export type EvidenceType = "internal_reasoning" | "prototype_evidence" | "experiment" | "client_case";
export type OfferingMode = "reusable_system" | "applied_system" | "exploratory_system" | "service";
export type IntelligenceMode = "Human" | "Deterministic" | "Hybrid" | "AI" | "No AI";
export type KnowledgeLayer = "work" | "capability" | "possibility";

export interface BaseEntity {
  id: string;
  type: EntityType;
  name: string;
  description?: string;
  knowledge_layer?: KnowledgeLayer;
}

export interface CapabilityEntity extends BaseEntity {
  type: "Capability";
  support_status?: "demonstrated" | "graph_supported" | "candidate";
  epistemic_status?: EpistemicStatus;
  evidence?: EvidenceType[];
}
export interface ProjectEntity extends BaseEntity {
  type: "Project";
  maturity_status: MaturityStatus;
  epistemic_status: EpistemicStatus;
  engagement_type: "internal" | "portfolio" | "external_client" | "unverified";
  scope: string;
  technologies?: string[];
}
export interface OpportunityEntity extends BaseEntity {
  type: "Opportunity";
  maturity_status: "concept";
  epistemic_status: "hypothesis";
  evidence: EvidenceType[];
  validation_status: "needs_validation";
  category: string;
  problem_statement: string;
  assumed_current_workflow: string;
  mvp_boundary: string;
  match_profile: { domain: string[]; task: string[]; artifact: string[] };
  clarifications: { id: string; question: string; options: { value: string; label: string }[] }[];
}
export interface WorkflowEntity extends BaseEntity { type: "Workflow"; step_ids?: string[]; }
export interface WorkflowStepEntity extends BaseEntity { type: "WorkflowStep"; responsibility: string; }
export interface AllocationEntity extends BaseEntity { type: "IntelligenceAllocation"; mode: IntelligenceMode; }
export interface EvidenceEntity extends BaseEntity { type: "Evidence"; evidence_type: EvidenceType; source_refs: string[]; }
export interface ReadinessEntity extends BaseEntity { type: "DeliveryReadiness"; level: "prototype_scope" | "needs_assessment"; }

export interface ProductEntity extends BaseEntity {
  type: "Product";
  maturity_status?: MaturityStatus;
  epistemic_status?: EpistemicStatus;
  evidence?: EvidenceType[];
  deployment_scope?: "limited_capacity" | "full_capacity";
  offering_mode?: OfferingMode;
}

export interface CorePhilosophyEntity extends BaseEntity {
  type: "CorePhilosophy";
  epistemic_status?: EpistemicStatus;
  evidence?: EvidenceType[];
}

// Discriminator for semantic entities
export type SemanticEntity = 
  | ProductEntity
  | ProjectEntity | CapabilityEntity | OpportunityEntity | WorkflowEntity | WorkflowStepEntity | AllocationEntity | EvidenceEntity | ReadinessEntity
  | CorePhilosophyEntity
  | (BaseEntity & { type: Exclude<EntityType, "Product" | "CorePhilosophy" | "Project" | "Capability" | "Opportunity" | "Workflow" | "WorkflowStep" | "IntelligenceAllocation" | "Evidence" | "DeliveryReadiness"> });

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
