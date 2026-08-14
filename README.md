# Terrawave Public Platform

## Project Purpose
This is the foundational codebase for the Terrawave public digital platform. Terrawave is an AI systems venture founded by Adarsh Singh Pawar and Rahul Arora. This platform projects the underlying Terrawave Knowledge Graph to establish positioning, demonstrate capabilities, and route prospective clients via problem-discovery.

## Technology Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Design Primitives**: Minimal custom components (cn, clsx, tailwind-merge)

## Development Command
To run the development server locally without any paid infrastructure:

```bash
npm run dev
```

## Architecture Reference
The platform's semantic logic and information architecture are strictly separated from the presentation layer. 

**The Semantic Content Engine pipeline:**
1. **YAML Graph**: `/docs/intelligence/terrawave-graph.yaml` acts as the canonical source of truth for all entities (Systems, Personas, Capabilities, etc.) and their relationships.
2. **Graph Loader**: `/lib/graph/` strictly loads, validates, and serves this graph on the server side at build time, preventing hardcoded metadata inconsistencies.
3. **Content**: `/content/` stores `.mdx` files containing human-readable editorial narrative. These files specify an `entity_id` frontmatter to pull dynamic structured facts directly from the Graph Loader.
4. **Next.js**: The React UI layer merges the narrative from MDX with the structured semantic facts from the graph to render the pages.

See the canonical references:
- **Semantic Ontology**: `/docs/intelligence/terrawave-graph.yaml`
- **Information Architecture**: `/docs/architecture/`
- **Content Models**: `/docs/content/`

## Current Phase
**Phase 5A: Experiential Website Implementation.**

The semantic ontology is frozen for V1 and has passed the full semantic acceptance test. The Next.js experiential website is now implemented as a light-first, graph-driven interface with the THINK → BUILD → EXPLORE → DISCOVER experience and the initial "Where could AI actually fit?" and "Do I actually need AI?" interactive prototypes.

## Project Status
- The semantic graph is strictly frozen for V1.
- Phase 5A is complete.
- Linting, production build (`npm run build`), and semantic graph validation (`npm run graph:validate`) pass successfully.
- The website is currently in prototype/development deployment. 
- Commercial hosting has not yet been selected.
