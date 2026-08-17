# Terrawave Visual Language

## 1. Brand Concept
"THE WAVE IS THE MOVEMENT OF INTELLIGENCE THROUGH A SYSTEM."

**TERRA**: Earth, reality, systems, infrastructure, context. It is the deterministic foundation of the business environment.
**WAVE**: Signal, movement, information, intelligence, transformation. It is the active element passing through the Terra.

Terrawave's identity is the interplay between rigorous, unyielding structure (Terra) and active, transformative intelligence (Wave). The design must feel grounded, engineered, and intentional, eschewing generic software aesthetics in favor of systemic honesty.

## 2. Color Semantics

Colors are not decorative; they are semantic indicators of systemic roles.

**Terra (Structure & Context)**
- **Primary Background (`#F4F2EC`)**: The neutral environment. 
- **Structural Stone (`#D8D5CC`)**: Inactive borders, boundaries, and foundational infrastructure.
- **Mineral (`#17201C` - Deep Earth)**: Dense context, foundational sections, or heavy systemic reality.
- **Graphite (`#17191B`)**: Existing system, human judgment, reality, and definitive text.

**Wave (Signal & Intelligence)**
- **Terrawave Emerald (`#0E9F6E`)**: Active intelligence, primary brand signaling, transformation.
- **Deep Emerald (`#087F5B`)**: Dense intelligence operations, resolved outcomes.
- **Signal Green (`#3FAF9B`)**: Live signals, motion, active data passing through a node.
- **Pale Mint (`#DDEFE8`)**: Intelligence traces, historical signal paths, or hybrid human-AI interfaces.

## 3. Wave/Signal Rules

The "Terrawave Signal" is our primary visual primitive. It represents information moving through a system.

**Forms of the Signal:**
- **The Trace**: A 1px or 2px continuous line tracking systemic flow.
- **The Pulse**: A localized highlight on a node when intelligence activates.
- **The Waveform**: A restrained, geometric modulation of the trace indicating data transformation or enrichment.

**The Routing:**
The signal travels exclusively through the structural hierarchy:
`PROBLEM → WORKFLOW → DATA → INTELLIGENCE → DECISION → ACTION`

**Restraint:**
The signal must never resemble a glowing neon tube. It is a precise, engineered indicator. It must look correct even when animation is disabled.

## 4. Typography Hierarchy

**Typeface:** Geist (or rigorous geometric sans-serif)

- **Display (Hero):** Massive, heavy, graphite. definitive statements. Example: `AI IS NOT THE STARTING POINT.`
- **Brand Motifs:** Uppercase, wide tracking, structural. (e.g., `T E R R A W A V E`).
- **Nodes/Labels:** Monospace (Geist Mono), uppercase, small text for technical precision and systemic labeling.
- **Body:** Neutral, highly legible, reserved for explanatory prose.

## 5. System-Object Design

Systems are no longer "product cards." They are architectural objects. 

**Structure of a System Object:**
```text
[ SYSTEM NAME: AI CFO ]
[ MATURITY: BUILDING ] [ EPISTEMIC: DESIGNED ]
──────────────────────────────────────
PROBLEM: Delayed financial reconciliation
  ↓
WORKFLOW: Monthly Ledger Review
  ↓ (Signal Line)
INTELLIGENCE: Graph-based Financial Reasoning
  ↓
ACTION: Automated Ledger Tagging
```
The Terrawave Signal connects the vertical flow within the object.

## 6. Control Room Visual Language

The Control Room (`/explore`) is where the signal routing is exposed and manipulated.

- **HUMAN**: The signal pauses at a rigid Graphite gate. Human input is required to allow the signal to pass.
- **DETERMINISTIC**: The signal flows through a solid Stone path. Rigid, unbending rules.
- **AI**: The node illuminates in Terrawave Emerald. The signal pulsates or transforms as it passes through.
- **HYBRID**: The signal splits into a Pale Mint path (AI analysis) and a Graphite path (Human review) before recombining.
- **NO AI REQUIRED**: The Emerald signal is extinguished. The Terra (Deterministic/Human structure) remains fully rendered, proving systemic integrity without AI.

## 7. Animation Principles

- **Speed:** Deliberate, mechanical, measurable. Not bouncy or elastic.
- **Easting:** Linear or slow-in-slow-out (CSS `ease-in-out`), reflecting data processing rather than physical momentum.
- **Continuous:** The Terrawave Signal should feel like a continuous flow of data when active, not a flashing light.
- **Degradation:** Animations must degrade gracefully. The semantic meaning must be obvious when static.

## 8. Mobile Behavior

- The structural sequence (`PROBLEM → ... → ACTION`) stacks vertically, connected by a continuous vertical signal line running down the left margin.
- System objects adapt by collapsing horizontal data flows into vertical architectural stacks.
- Touch interactions replace hover states for signal tracing.

## 9. Accessibility

- **Contrast:** Graphite on Primary Background passes AAA. Signal Green is used only for thick indicators or non-text graphical elements; Terrawave Emerald provides higher contrast against light backgrounds for critical text.
- **Motion:** Respect `prefers-reduced-motion`. When active, motion is disabled and the signal is rendered statically as a solid or dashed path.
- **Screen Readers:** All signal routing must be accompanied by semantic HTML describing the systemic flow (e.g., `aria-label="Intelligence routes to Decision"`).

## 10. Examples of Correct Usage

- Using a 1px Signal Green line connecting two structural nodes in a graph.
- A hover state that traces the exact path a specific data primitive takes to reach a capability.
- Displaying a theoretical system in Stone/Graphite (Terra), while a deployed system pulses with Emerald (Wave).

## 11. Examples of Incorrect Usage

- Randomly assigning green to primary buttons just to "make it pop."
- Using glowing drop shadows (`box-shadow: 0 0 10px #0E9F6E`) on nodes.
- Using 3D isometric WebGL rendering for systemic nodes.
- Using generic SaaS "card" designs with rounded corners and soft drop shadows.

---

## Proposed Homepage Visual Sequence

**Section 1: The Thesis (Hero)**
- **Text:** `AI IS NOT THE STARTING POINT.` (Graphite, massive)
- **Action:** `THE SYSTEM IS.` (Graphite, massive)
- **Visual:** Below the text, a horizontal or vertical structural skeleton (`PROBLEM → WORKFLOW → DATA`). It is rendered in Stone (inactive).
- **Interaction:** A single Terrawave Signal (Emerald) pulses through the skeleton, sequentially illuminating `INTELLIGENCE → DECISION → ACTION`.

**Section 2: The Philosophy (Terra & Wave)**
- **Text (Terra):** The world as it exists: businesses, people, workflows, constraints. (Rendered on a Deep Earth background with Pale text).
- **Text (Wave):** The movement of intelligence through that world. (A horizontal signal line bisects the section).
- **Conclusion:** "Terrawave builds systems that move intelligence to where it creates leverage."

**Section 3: The Portfolio (System Objects)**
- A grid of architectural System Objects, strictly adhering to the Epistemic and Maturity semantics. Signal lines vertically integrate their internal architectures.

**Section 4: The Discovery Engine**
- A highly structural, form-like interface. User answers questions, mapping the Terra. The final result indicates where the Wave belongs.
