# URL Architecture

The URL structure must be flat, semantic, and future-proof. It should map cleanly to the graph ontology entity types.

## Core Structure

### Home
- `/` - Homepage

### Philosophy & Thinking (Entities: `CorePhilosophy`, `MethodStep`)
- `/think` - Index of philosophies and methods
- `/think/problem-first`
- `/think/systems-thinking`
- `/think/terrawave-method`

### Systems / Products (Entities: `Product`)
- `/systems` - Index of packaged systems
- `/systems/ai-cfo`
- `/systems/ca-automation`
- `/systems/lead-intelligence`
- `/systems/examos`
- `/systems/selfos`

### Capabilities (Entities: `Capability`)
- `/capabilities` - Index of capabilities
- `/capabilities/document-intelligence`
- `/capabilities/graph-intelligence`
- `/capabilities/conversation-understanding`

### Services (Entities: `Service`)
- `/services` - Index of systems-mode services
- `/services/opportunity-discovery`
- `/services/system-design`
- `/services/integration`

### Proof & Outcomes (Entities: `Evidence`, `Outcome`)
- `/case-studies` - Index of built evidence
- `/case-studies/[slug]` - Specific study

### Commercial / Action
- `/work-with-us` or `/discovery` - The primary conversion funnel page
- `/about` - Founders and Brand Boundary

## Improvements & Rules
- **No Deep Nesting**: Avoid URLs like `/domains/business/systems/ai-cfo`. Keep it to one folder deep (`/systems/ai-cfo`). The cross-linking happens on the page, not in the URL path.
- **Consistent Naming**: Use the exact slugs derived from the YAML entity IDs (e.g., `ai_cfo` -> `ai-cfo`).
- **Future Proofing**: If a system pivots from a "Concept" to "Deployed", the URL `/systems/examos` remains the same; only the status metadata changes on the page.
