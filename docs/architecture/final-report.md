# Final Architecture Report: Terrawave V1

Based on the Master Knowledge Graph and the provided constraints, here is the final architectural report for the Terrawave public platform.

## 1. Recommended Website Architecture
The site operates on a dual-axis. The structural axis is clean and standard (Home, Think, Systems, Capabilities, Services). The semantic axis is deeply networked. A user can land on a "Capability" page and traverse upstream to the "Data Primitive" it consumes, or downstream to the "System" that uses it, and finally to the "Outcome" it generates.

## 2. Recommended Navigation
Restrained and systems-oriented.
- Global: Think, Systems, Capabilities, Services, Evidence (Case Studies), About.
- Primary CTA: "Start Discovery" — persistent across the site.

## 3. Recommended Homepage Sequence
Not a standard SaaS page. It acts as an epistemic funnel:
`Positioning (Hero) → Philosophy (Problem-First) → Data Architecture → Problem Discovery (Self-Identification Routing) → Built Systems (Products) → Engineering Depth (Capabilities) → Custom Solutions (Services) → Proof (Evidence) → Builders (Founders) → Conversion (Discovery Form)`.

## 4. Recommended Conversion Funnel
The primary conversion mechanism is a structured "AI Opportunity Discovery" form. Instead of a generic "Contact Us" email link, the form asks the user to input their Friction, Data Sources, and Desired Outcomes. This effectively maps the prospective client onto our ontology *before* the first sales call, filtering out unqualified leads and demonstrating our systematic approach immediately.

## 5. Recommended URL Structure
Flat and entity-driven.
`/systems/[slug]`, `/capabilities/[slug]`, `/services/[slug]`, `/think/[slug]`. Deep nesting (e.g., `/domains/business/systems/ai-cfo`) is avoided in favor of semantic cross-linking on the pages themselves.

## 6. Content Models
A strict separation of concerns. The YAML graph remains the source of truth for all relationships, statuses, and evidence levels. MDX files act as the editorial layer. A System Page MDX file will automatically query the graph to render its "Capabilities Used" and "Evidence Status" blocks, ensuring the website cannot legally claim a system is "Validated" if the graph says it is a "Concept".

## 7. Graph Visualization Strategy
Mermaid graphs will be used surgically to explain System Architectures and Client Journeys. They will be heavily customized for mobile (using progressive disclosure and vertical stacking) to prevent cognitive overload.

## 8. Product vs Service Presentation
The architecture explicitly isolates "Product Mode" (`/systems/`) from "Systems Mode" (`/services/`). This clarifies to the visitor that Terrawave both licenses reusable systems AND builds custom integrations.

## 9. What should be built in V1
- The static framework (Next.js).
- The MDX parsing pipeline to read `terrawave-graph.yaml`.
- The Homepage, About Page, and the primary structural index pages.
- The Problem Discovery Form (hooked to a free tier service like Formspree or Tally).
- System Pages for whatever is actively being built (AI CFO, CA Automation, Lead Intelligence), complete with honest "Building" metadata.

## 10. What should explicitly NOT be built in V1
- Complex interactive graph explorers (e.g., a massive 3D D3.js network of the whole ontology).
- Backend databases or authentication.
- Pages for systems that are purely conceptual (like SelfOS), unless clearly marked as a "Think" piece or a "Concept" card on the homepage to avoid vapourware claims.

## 11. Strategic Decisions Requiring Founder Input
- **The Initial Form**: Which third-party form provider will we use for the Discovery funnel to keep infrastructure zero-cost?
- **V1 Content Scope**: Do you want to publish the pages for ExamOS and SelfOS as explicit "Concepts", or hide them entirely until prototype phase?
- **Design System Implementation**: We have defined a "restrained, editorial, systems-oriented" aesthetic. We need to decide on the exact typography (e.g., Inter vs. a serif) and color palette before touching CSS.
