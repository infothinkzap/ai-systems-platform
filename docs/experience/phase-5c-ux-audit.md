# Phase 5C UX Audit

## 1. Current Strengths
- The canonical Terrawave semantic graph is robust and correctly models entities (68 entities, 89 relationships).
- The visual design system correctly implements the light-first palette (#F4F2EC, #17191B, #3FAF9B) with Geist fonts.
- Next.js server components correctly load graph data without hardcoding.
- The Control Room prototype correctly renders structural relationships between problems, workflows, and capabilities without relying on generic D3 visualizers.

## 2. Current Weaknesses
- **Homepage Hero**: Is currently static text rather than an interactive architectural sequence. It explains the philosophy but doesn't *demonstrate* it.
- **Control Room Default State**: Defaults to whichever product appears first in the array rather than explicitly loading the deployed `manaswini_operations` system.
- **System Portfolio**: The systems on the homepage render as standard software product cards rather than distinctive architectural objects. They lack epistemic status distinction.
- **Control Room Experience**: The "Remove AI" toggle functions mechanically but lacks a powerful visual transition showing the underlying deterministic/human architecture remaining intact. Decision tracing isn't animated.
- **Opportunity Mapper**: Currently a 3-step prototype instead of the complete 6-step problem-mapping flow requested.

## 3. UX Opportunities
- **Hero Sequence**: Introduce an interactive hover/tap sequence (PROBLEM → WORKFLOW → DATA → INTELLIGENCE → DECISION → ACTION) that acts as the primary visual grammar of the site.
- **System Objects**: Redesign system cards to explicitly display Name, Type, Maturity, Epistemic Status, Problem, Workflow, and Intelligence entry point.
- **Control Room Impact**: Animate the "Trace Decision" and "Remove AI" interactions to emphasize the "Automation does not eliminate accountability. It relocates it deliberately." principle.
- **System Routing**: Create a dynamic `app/systems/[id]/page.tsx` structural shell to support deeper architectural exploration per system.

## 4. Proposed Experience Architecture
- **Global Theme**: "SYSTEM FIRST, AI SECOND."
- **Homepage**: 
  - Hero interactive sequence.
  - "Discover Where AI Fits" drives into Opportunity Mapper.
  - System objects replace generic cards.
  - Founders placeholder added.
- **Explore (Control Room)**:
  - Default: Manaswini Designer Studio.
  - Explicit responsibility states (Human, Deterministic, AI, Hybrid, No AI Required).
  - Experiential transitions on toggle states.

## 5. Items Explicitly NOT Worth Building
- 3D graph engines or WebGL visualizers.
- D3 network explorers.
- User authentication, databases, or CRM backends.
- Fake analytics or pricing systems.
- AI Chatbots.
