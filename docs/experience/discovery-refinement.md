# Terrawave discovery refinement — 20 October 2026

## Audit and decisions

The first version put the entire System Lens before the work collection. Its first result exposed 18–21 entities, correction controls, four assumption selectors and five allocation choices together. Its text download retained evidence but was hard to scan. The four browsing index routes did not exist.

The refined experience has two equal, early choices: **Explore our work** (`/systems`) and **Map your problem** (`/think`). The homepage no longer mounts the mapping form. It shows a filterable work collection early, using the same collection as the systems index. Deployed systems are first; CA Automation explicitly retains limited-capacity scope. The founders, supplied photo mapping, original photos and existing architecture explorer are retained.

System Lens starts with one question and three examples. Its initial interpretation is a short, correctable hypothesis with up to three related processes. The detailed graph and allocation controls are closed native disclosures. Assumptions survive editing; restart explicitly clears them. Human / Rules / Hybrid / AI / No AI have plain-language labels and distinct qualitative trade-offs. No allocation is recommended by default when assumptions are unknown.

## Browsing and evidence

- `/systems`: six graph-backed systems with filters, problem descriptions derived from recorded relationships, unordered workflow previews, stage and evidence labels.
- `/systems/[id]`: concise problem/process/capability overview, linked capabilities, visible evidence gaps and optional detailed architecture.
- `/capabilities` and `/capabilities/[id]`: group browsing, connected information, related systems and inspectable relationships.
- `/services`: actual service names and recorded context, without invented scope or deliverables.
- `/case-studies`: evidence register and implementation notes for deployed work. No measured customer case study is represented as available; no result figures or empty case-study cards are added.

Maturity, deployment scope and evidence remain separate. Manaswini's missing evidence category is displayed as missing. CA Automation's recorded prototype evidence does not become customer validation merely because maturity is deployed.

## Visual PDF

Two A4 pages, built on demand in the browser. Page 1 has the statement, provisional finding, an explicitly unverified current-state discovery skeleton, grouped graph context, uncertainty and next step. Page 2 has an illustrative candidate flow with task ownership, a five-way alternatives table, assumptions and discovery questions. No actual workflow order or quantitative impact is invented.

The complete original UTF-8 statement and full graph context/assumptions are attached inside the PDF. The visible statement is an excerpt if long. Browser font rendering preserves non-Latin scripts in that excerpt. The text-only fallback for automated generation explicitly points to the original attachment when standard PDF fonts cannot represent its script.

One direct dependency, `pdf-lib`, was added for reliable browser-only PDF serialization. It is lazy-loaded at download time; no Python service, browser binary, paid API or submission endpoint is added to the product. Python/pdfplumber/pypdf are used only for local PDF quality verification. The future Google Form remains intentionally deferred.

## Outcome graph synchronization

| Outcome | Current implementation |
| --- | --- |
| Curiosity and credibility | Two clear paths, actual work cards and retained founder photographs |
| Understand / interpret the problem | One question, examples and a concise correctable lexical match |
| Validate / reveal the system | Graph-derived context; optional entity groups and actual relationship inspection |
| Explore consequences / choose intelligence | Optional four assumptions; all five alternatives; explicit qualitative trade-offs |
| Explain with evidence and uncertainty | Maturity/scope/evidence remain visible; current workflow is unverified; proposed workflow is illustrative |
| Map / start discovery | Visual PDF and next questions; online enquiry intentionally deferred |

Functional verification is recorded after checks complete. Conversion improvement and first-time usability remain hypotheses for user playtesting.

## Verified results

- Seven logic/PDF tests pass, including long and Unicode input and fixed two-page A4 output.
- TypeScript passes. The final production Webpack rebuild, including the PDF word-wrapping refinement, generated all 33 pages successfully.
- Full lint: zero errors, 14 pre-existing unused-variable warnings in the retained game and old Think sources.
- Graph validation and `git diff --check` pass.
- The isolated browser test passes both entry paths, filters, system/capability links, graph entity interaction, all five allocations and recommendation branches, assumption retention on edit, restart, unsupported input, context correction and actual PDF download. No browser page errors were observed.
- Mobile overflow checks pass at 390px for the homepage, systems, Lens, capabilities, services and evidence pages; the homepage also passes at 320px. Desktop and mobile screenshots were inspected.
- Keyboard-only checks pass for problem entry/submission, native disclosure toggling, all five allocation buttons, edit focus and restart.
- The actual downloaded two-page PDF was reopened, rendered and visually inspected. Page count, text bounds and full original/source attachments pass. A separate long Hindi/English/emoji statement was downloaded and rendered to verify script preservation and excerpt handling. Its attachment matches the complete submitted statement (outer whitespace is trimmed by the form). The final refinement wraps at word boundaries and uses grapheme boundaries for oversized tokens.
- Sample browser download: `output/pdf/terrawave-system-brief.pdf`. QA images and stress-test PDFs live under ignored `tmp/`; generated artifacts are not mixed with source control changes.
- Local site remains available at `http://localhost:3000` using the existing development server. The user's open browser was not controlled; testing used an isolated headless Chrome profile with bundled Playwright.

No commit, push, merge, deployment or publication was performed. Existing game/prototype sources and unrelated changes were retained. Online enquiry submission remains deferred until a Google Form is supplied; no usability or conversion lift is claimed.

## Local checks

- `npm test`: matching, provenance, all five recommendation paths, work browsing scope, brief model and two-page PDF generation with long/Unicode input.
- `npm run typecheck`, `npm run lint`, `npm run build -- --webpack`.
- `scripts/playtest.mjs`: isolated headless Chrome; uses Playwright from `TERRAWAVE_PLAYWRIGHT` or a local installation. Checks both visitor paths, browsing links/filters, progressive disclosure, all five allocations, edit/restart, unsupported contexts, actual PDF download and mobile horizontal overflow.
- `scripts/inspect-brief.py INPUT.pdf OUTPUT_DIRECTORY`: checks two A4 pages, text bounds and full original/source attachments, then renders both pages with pdfplumber/PDFium for visual inspection.

## Manual playtest

1. From the homepage, choose Explore our work. Filter to In use; inspect CA Automation and Manaswini. Follow a capability link and read the evidence notes.
2. Choose Map your problem. Try an example and read the short starting point before opening any extra detail.
3. Expand the map, inspect one entity, then collapse it. Compare assumptions and all five approaches. Edit the problem; confirm assumptions remain. Start over; confirm they clear.
4. Download the visual PDF. Review both pages and the attached original/source text. The current-state diagram must remain labelled unverified, and the candidate diagram illustrative.
5. Repeat on mobile and with keyboard-only navigation. No information should be submitted or enquiry booked.
