# Terrawave Intelligence Architecture

This directory (`/docs/intelligence/`) serves as the semantic source of truth and conceptual ontology for **Terrawave**, a problem-first AI Systems Company.

## Purpose

Before writing any website code, UI components, or deploying databases, we establish a **Master Knowledge Graph**. This ontology maps out the entities, domains, capabilities, systems, methodologies, and relationships that define Terrawave. 

The eventual website and its features will be a direct projection of this underlying semantic model. 

### The Projection Flow
```
MASTER KNOWLEDGE GRAPH
        ↓
ONTOLOGY / SEMANTIC MODEL
        ↓
CONTENT MODEL
        ↓
WEBSITE ARCHITECTURE
        ↓
DESIGN SYSTEM
        ↓
WEBSITE
```

## Structure of the Ontology

The ontology is heavily factored into specific conceptual dictionaries to maintain rigor:

- `terrawave-graph.yaml`: The machine-readable YAML representation of our graph. This is the source of truth for programmatic ingestion and content mapping.
- `terrawave-master-graph.mmd`: The visual canonical representation (Mermaid) of the entire conceptual model.
- `relationship-dictionary.md`: Definition of semantic relationship verbs (e.g., `EXTRACTS_FROM`, `PRODUCT_SOLVES`, `ORIGINATES_FROM`).
- `domain-dictionary.md`: Definition of the core AI system domains.
- `persona-dictionary.md`: Definition of the human users who experience friction and interact with our systems.
- `data-dictionary.md`: Definition of the specific data primitives our systems consume, and their provenance (Data Sources).
- `data-flow-model.md`: Documentation of how Data flows from Source → Primitive → Capability → Decision.
- `outcome-and-metrics.md`: Separation of qualitative goals (Outcomes) from their quantitative proofs (Metrics).
- `offering-dictionary.md`: The critical commercial distinction between **Product Mode** (packaged systems) and **Systems Mode** (custom services).
- `evidence-and-status.md`: The 3-dimensional maturity framework separating System Maturity, Epistemic Status, and Evidence Type.

## Foundational Principles
- **Strict Evidence Boundaries**: We do not conflate "building" with "validated". Evidence must be explicit (e.g., `internal_reasoning` vs `customer_evidence`). We do not invent evidence.
- **Data Provenance**: AI capabilities do not operate on magic. They `EXTRACT_FROM` or `ENRICH` specific data primitives that `ORIGINATE_FROM` concrete data sources (e.g. ERPs, APIs).
- **Brand Boundaries**: Terrawave is completely separate from *Randomly Systematic*.
- **Iteration over Linearity**: The Terrawave Method and Client Journey are loops of continuous validation and improvement, not just linear pipelines.
- **Website Projection**: The future website will allow visitors to traverse this exact graph (Person → Problem → Capability → System → Outcome → Conversation).
