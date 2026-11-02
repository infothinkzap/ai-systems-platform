# Release verification — 2 November 2026

Changes tested: eight-project collection including Counterpoint, removed portfolio stage labels, contributor career descriptions, local testimonial drafts, eleven interactive reported-example stories and text-only proposed extensions.

## Results

- Twelve automated logic/model/PDF tests passed.
- Semantic graph validation passed: no dangling references, undocumented relationship types or unexplained orphan entities.
- Production build and TypeScript passed; Next generated 76 pages.
- Production server sweep passed: 74 real routes returned 200 and an unknown route returned the branded 404.
- Production browser discovery regression passed: both entry paths, project/capability navigation, graph controls, five allocation modes, edit/restart, unsupported input, PDF download and mobile overflow.
- Production opportunity regression passed: library and scope-prefill, required domain cases, astrology chart/method clarification, human approval preserved in comparisons, inferred/vague/unrelated requests, PDF download and mobile layouts.
- Production page-family visual/interaction regression passed, including Explore artwork selection and clarified workflow overviews.
- Local review-story regression passed: 13 career attributions, 11 expandable examples, 33 keyboard-driven step transitions, single selected step, text-only suggestions, no avatar/stage UI, mobile widths and reduced-motion interaction; no browser runtime errors.
- ESLint: zero errors; 14 existing unused-code warnings in legacy game/Think sources.
- Git whitespace check passed.

The final production run also confirmed all 13 approved quotes, 13 career attributions and 11 interactive stories are rendered in production, with no draft labels or project stage UI. All 33 keyboard-driven steps and the 74-route sweep passed after enabling the section. Targeted release lint passed with no new errors.

## Test-environment findings

The first concurrent browser run timed out on a screenshot and element stability during the build. Browser background-throttling flags were added and screenshot capture made optional for functional regression runs. Sequential reruns against the production server passed, using `TERRAWAVE_SKIP_SCREENSHOTS=1`. Screenshots were inspected during the preceding visual implementation work; this release run does not claim a fresh full screenshot audit.

The route sweep initially included Next's internal `/_global-error` endpoint, which intentionally returns an error. It now excludes the two framework-internal error routes and separately verifies a real missing public URL returns 404.

## Publication decision

The user explicitly confirmed “then quotes are approved, add them” on 2 November 2026. The release includes the approved wording alongside the interactive case summaries and careers. The development-only guard and draft labels have been removed. This is written publication copy approved through the user, not an audio transcript or independent validation of customer outcomes.

These checks cover the listed website flows. They do not guarantee every browser/device combination, validate the underlying external project implementations or independently verify reported customer outcomes. Discovery contact submission remains deferred as previously requested.
