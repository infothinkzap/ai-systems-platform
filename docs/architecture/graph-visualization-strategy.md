# Graph Visualization Strategy

The semantic graph should be used as a visual storytelling system, not just an internal database. However, dumping a massive, complex network graph on the user will cause cognitive overload.

**Rule**: Use graphs only when they improve comprehension of relationships.

## Where to use Visual Graphs

### 1. The Homepage: Data Flow Architecture
- **Visualization**: A clean, linear-but-layered flow.
- **Concept**: `Source → Primitive → Capability → Decision → Action`
- **Why**: Proves we understand data plumbing, not just LLM prompts.

### 2. System Pages: System Architecture
- **Visualization**: A targeted subgraph centered on the specific product.
- **Concept**: How *AI CFO* connects to *Transactions*, *Graph Intelligence*, and *Financial Decisions*.
- **Why**: Demystifies the "black box" of the product. Shows exactly where AI is used and where Deterministic Code is used.

### 3. Service Pages: Client Journey & Method
- **Visualization**: An iterative loop diagram (not a straight line).
- **Concept**: The Terrawave Method (`Understand → Deconstruct → ... → Measure → Improve`).
- **Why**: Demonstrates that our consulting is a rigorous, scientific process.

### 4. About Page: Ecosystem & Brand Boundaries
- **Visualization**: Distinct cluster graph.
- **Concept**: Showing Terrawave alongside Randomly Systematic, clearly separated by a firewall.
- **Why**: Visually enforces the strict brand separation rule.

## Mobile Considerations

Complex graphs break on mobile screens. We must define mobile-first graph representations:

1. **Progressive Disclosure**: Instead of showing the whole system architecture, show "Data In" → tap to expand "Intelligence Layer" → tap to expand "Action Out".
2. **Stacked Cards**: Convert horizontal flows into vertically stacked structural cards with connective arrows pointing down.
3. **Horizontal Scroll (Use Sparingly)**: For wide diagrams (like the 9-step Method), use a snap-scroll horizontal timeline.

## Aesthetics
Graphs should not look like default Mermaid renders in production. They should use the Terrawave design system:
- Monochromatic or restrained palette.
- Strict right angles and grid snapping (communicates "systems" and "determinism").
- Subtle motion (e.g., a pulse flowing along a data path to show directionality).
