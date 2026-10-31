# Terrawave / System Lens

> Historical first implementation. The two-path homepage, progressively disclosed Lens and visual PDF now supersede the homepage-embedded Lens and text download described below. See `discovery-refinement.md` for the current implementation and validation.

## Audit before implementation — 20 October 2026

The three largest weaknesses are (1) a long company-led homepage with repeated explanations before useful visitor input, (2) disconnected interactions: Think offers cosmetic allocation changes and silent failures, Explore offers a separate wizard that discards earlier answers, and the homepage discovery prototype gives every visitor the same answer, and (3) an incomplete trust-to-conversation path: placeholder founder photos, hash navigation broken on subpages, and inactive discovery buttons.

Actual routes: /, /think, /explore, /systems/[id], /play. There are no /systems index, /capabilities, /services, /case-studies or /about pages. Capabilities and founders currently live on the homepage; services and evidence are graph entities. Do not manufacture pages or case studies just to fill that list.

Retain the semantic YAML loader/queries, product pages, maturity/evidence fields, Geist fonts and earth/emerald tokens. Improve navigation, homepage hierarchy, truthful evidence presentation and conversion. Replace the homepage's duplicate interactive demonstrations with one problem-to-decision experience. Keep the pre-existing game and untracked Think implementation intact as source; do not promote the game. Preserve existing globals.css changes. No new dependencies or model API.

## Concept comparison

Scores 1–5 are design judgments, not usability findings. Columns: originality, clarity, curiosity, usefulness, conversion, feasibility, brand fit.

| Direction | Scores | Trade-off |
| --- | --- | --- |
| A Living System | 4/4/4/5/5/4/5 | Strong entry point; bounded vocabulary must not masquerade as comprehension. |
| B Consequence Engine | 5/3/5/4/4/3/5 | Memorable; numerical simulations would imply evidence we do not have. |
| C System That Disagrees | 4/5/4/5/4/5/5 | Clear differentiation; avoid a contrarian gimmick or predetermined answer. |
| D Business X-Ray | 3/5/4/5/4/5/5 | Easy to grasp; a fixed workflow can feel irrelevant to a visitor. |

Three viable product directions: a problem-first Living System with qualitative consequences; a workflow-first Business X-Ray; or a decision-first System That Disagrees. Recommend the first, borrowing the allocation discipline of C and the visible structure of D. B becomes a small assumption comparison, not a separate engine or game.

## Implementation plan and acceptance criteria

1. One editorial homepage and /think experience, shared System Lens. Input and examples lead to graph-derived problem matches; a visitor can correct the selected match. Unknown text returns an explicit empty state. No claim of language-model understanding.
2. Display connected entities grouped by role with actual relationship labels and IDs. Only literal graph edges are displayed. A connection is evidence about Terrawave's model, not a verified fact about the visitor's operation.
3. Visitor-confirmed rules, data readiness, stakes and judgment assumptions produce a transparent provisional allocation. All five alternatives remain selectable; qualitative consequences and recommendation update when assumptions change. No invented ROI.
4. Equal-size founder portraits, using exact original filename mapping, with names from the graph and existing supported co-founder designation. Preserve originals, derive optimized WebP files.
5. Export a discovery brief including the original input, graph references, assumptions, selected allocation and unknowns. A real conversation handoff requires a verified contact destination, absent from this repository.
6. Run graph validation, meaningful logic tests, lint, TypeScript and production build. Start a persistent dev server, open the browser and playtest desktop/mobile and existing routes.

## Outcome graph synchronization

| Graph nodes | Implementation | Verified status |
| --- | --- | --- |
| A–C, T | Editorial entry, visitor description, founder context | Homepage and both photo assets return HTTP 200; visual browser verification pending |
| D–G, U | Conservative matching, correctable graph context, explicit provenance | Logic tests pass; browser interaction pending |
| H–K | Assumption controls, qualitative trade-offs, provisional recommendation | All five recommendation branches tested; browser interaction pending |
| L–P | Human / deterministic / hybrid / AI / no-AI comparison | Implemented; browser interaction pending |
| Q–R | Rationale, graph evidence, maturity and explicit unknowns | Brief/evidence tests pass; browser interaction pending |
| S | Downloadable discovery brief; verified contact if supplied | Brief generation tested; actual enquiry intentionally deferred by user until a Google Form exists |

## Photograph provenance

Exact input mapping: `Downloads/Adarsh.png` → Adarsh Singh Pawar; `Downloads/Rahul.png` → Rahul Arora. Both original PNGs are preserved unchanged under `public/founders/originals/`. Derived 800 × 1000 WebP files use the same quality setting (85), with no face editing, generation or identity replacement. Their sizes are 76,486 and 68,920 bytes respectively. Both share the same responsive frame and crop rule. Names come from Person entities; co-founder labels are supported by existing site copy and FOUNDED_BY edges. No biographies or extra credentials were added.

## Hypothesis and limits

Test whether a visitor can find a relevant context, explain why an allocation is suggested and prepare a useful discovery brief without explanation from a founder. Local functional testing cannot establish enjoyment, conversion lift or real-world system suitability. Rules are a discovery aid and must be validated with workflow owners. The knowledge graph records maturity and evidence categories, not public independent case-study proof.

## Validation and handoff

- `npm test`: 4 tests passed, covering graph matching, unsupported/empty input, duplicate-token resistance, actual edge provenance, all five allocation branches, unknown assumptions and discovery brief contents.
- `npm run typecheck`: passed. Production build's TypeScript phase also passed.
- `npm run graph:validate`: passed; no dangling edges or unexplained orphan entities.
- `npm run lint`: exit 0, no errors, 14 unused-variable warnings in pre-existing game/Think modules. Those sources were left intact.
- `git diff --check`: passed.
- Default Turbopack build was stopped after remaining at compile without output. `node node_modules/next/dist/bin/next build --webpack` passed, prerendering 13 pages.
- Persistent dev server: `node node_modules/next/dist/bin/next dev --webpack --hostname 127.0.0.1 --port 3000` at **http://127.0.0.1:3000**.
- HTTP 200 verified for `/`, `/think`, `/explore`, `/play`, `/systems/ca_automation`, `/systems/examos`, and both optimized founder photos. Homepage HTML includes the new hero and founder image references.
- Browser connector failed with a closed transport; native Computer Use `list_apps` timed out after retry and kernel recovery. Codex browser opening was queued, not confirmed. No visual browser, mobile, keyboard or download-click verification is claimed.
- No commit, push, merge, deployment or publication was performed. Existing untracked game and Think component/interpreter sources remain in place; `/think` now renders the replacement System Lens. Existing globals.css additions were preserved.

### Personal playtest

1. Open the homepage and choose Invoice reconciliation. Confirm or change the matched context; expand a graph entity and the recorded relationships.
2. Set reliable inputs, fixed rules, low stakes and no contextual judgment: the provisional recommendation should be Deterministic.
3. Change inputs to fragmented: it should become No AI. Change back to reliable inputs, variable rules, high stakes and contextual judgment: it should become Human. Remove contextual judgment: Hybrid. Lower stakes: AI.
4. Select all five comparison buttons; confirm that gains, costs and controls change. An alternative selection must not rewrite the provisional recommendation.
5. Download a brief. Confirm that it includes the original description, context IDs, graph relationships, assumptions, selected comparison and unknowns. Nothing should be submitted.
6. Submit an unsupported phrase, such as “purple moon zeppelins.” Confirm that no graph context is invented. Change context to “None of these” for a supported phrase and confirm that the graph disappears.
7. Check both founder photos and names, the portfolio maturity labels and navigation on desktop and a narrow mobile viewport. Open `/think` directly and follow a system link back to System Lens.

Acceptance remains partial for browser interaction/visual QA and commercial conversion. The enquiry integration is intentionally deferred by the user until a Google Form is provided. No measured conversion, usability or performance improvement is claimed.
