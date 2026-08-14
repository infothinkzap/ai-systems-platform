# System Page Schema

Defines the structure for reusable Product pages (e.g., `/systems/ai-cfo`).

## 1. Frontmatter (MDX)
```yaml
id: "product:ai_cfo"
title: "AI CFO"
tagline: "Financial intelligence and decision support."
```

## 2. Dynamic Graph Injection
The page template will automatically query the YAML graph to render:
- **Status Banner**: (e.g., "Maturity: Building | Evidence: Prototype")
- **Solves Problems**: `PRODUCT_SOLVES` → `problem:financial_complexity`
- **Target Persona**: Backlinks from `USES_SYSTEM` (e.g., CFO)
- **Uses Capabilities**: `USES` → `cap:graph_intelligence`, `cap:financial_reasoning`
- **Data Consumed**: `CONSUMES` → `data:transactions`

## 3. Editorial Body (Human Written)

### Problem & Current Workflow
Narrative explaining *why* the problem is hard and what the broken status quo looks like.

### System Architecture (Visual)
A localized graph visualization showing Data → Capabilities → Output for this specific system.

### AI Role vs. Deterministic Role
Crucial section. Explain exactly what the LLM/AI does (e.g., unstructured text extraction) and what the deterministic code does (e.g., math, validation, database insertion). This builds trust.

### The Human Role
How the human-in-the-loop interacts with the system (Review, Approve, Escalate).

### Expected Outcomes
Narrative tied to the `PRODUCES` outcomes and `REDUCES` metrics from the graph.

### Next Step (CTA)
"Does your business face this friction? Start a Discovery Conversation."
