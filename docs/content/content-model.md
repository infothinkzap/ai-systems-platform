# Content Model Architecture

This document defines how the Semantic Ontology (`terrawave-graph.yaml`) translates into front-end Content Schemas.

## The Principle of Separation
To maintain the graph as the semantic source of truth while allowing for rich marketing copy, content is split:

1. **Graph Data (YAML)**: Structural metadata (IDs, Status, Epistemic Level, Relationships).
2. **Editorial Content (MDX/Markdown)**: Human-written long-form copy, narratives, and page-specific layouts.

The MDX files will query/import the YAML data to render structured blocks, ensuring the website never contradicts the ontology.

## Global Metadata (Injected from Graph)
All schemas automatically inherit the following if applicable:
- `maturity_status` (concept, prototype, building, deployed)
- `epistemic_status` (hypothesis, designed, tested, validated)
- `evidence_tags` (internal_reasoning, prototype_evidence, etc.)

*(Warning labels will automatically render on the frontend if a user views a "concept" system, ensuring honesty).*

## Page Schemas

The specific schemas for Systems, Capabilities, Services, Case Studies, and Insights are documented in their respective files within `/docs/content/`.

### Schema Anatomy Example
```yaml
---
id: system:ai_cfo              # Links to YAML graph
title: "AI CFO"                # Editorial override
hero_subtitle: "..."           # Editorial content
# Relationships (Problems, Capabilities) are pulled dynamically from terrawave-graph.yaml using the ID
---

## Human-Written Body
This is where the narrative goes...
```
