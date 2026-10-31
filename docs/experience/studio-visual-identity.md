# Terrawave / Structured Wave visual identity

## Implemented

- An Earth-and-wave symbol: a circular Earth with simplified land forms and three waves across its surface, a lowercase Manrope wordmark, and a matching SVG favicon. Shared navigation, the approach section and the homepage footer use the same mark.
- Self-hosted Next font assets: Manrope for interface/body/headlines, Fraunces italic for editorial emphasis, Geist Mono for technical annotations. No browser request to Google Fonts is required.
- An interactive SVG system study on the homepage. Structure, Judgment and Intelligence buttons change the explanatory text and visual emphasis. It illustrates principles, not a live simulation or customer result. Buttons support keyboard input; updated explanations use a polite live region.
- Seven original vector project identity panels in the public work collection, plus the platform mark. Terrawave itself is excluded from the homepage and all work collections; its graph record remains only as implementation provenance. Each project has its own palette and visual motif. Artwork is labelled illustrative and does not claim to be a screenshot, a client-approved brand or a product result.
- A warmer paper/forest palette, stronger typographic hierarchy, editorial project collection, approach section, numbered capability layers, refined founder presentation and a new closing/footer composition.
- Light entrance/scroll transitions, project artwork hover movement and a slow abstract orbital motion. Core content renders without JavaScript. Reduced-motion preferences disable animation/transitions and keep reveal content visible. Scroll is never hijacked.
- Mapping has an illustrated entry guide, role glyphs for the five allocation approaches, and an overview generated directly from the proposed/inferred workflow steps. Clarifications update the overview and detailed list together. A keyboard-focusable horizontal rail contains long workflows on phones; uncertainty and mandatory human review remain explicit.
- Explore displays the selected system's identity panel; switching systems updates the artwork and scope label. Capabilities, services, proposed possibilities and evidence pages have distinct explanatory diagrams. Capability detail pages share the building-block guide, opportunity detail pages use their actual proposed sequence, project/system detail pages retain individual artwork, and the 404 page includes a broken-path guide. The game route retains its existing illustrated environment.

## Boundaries

Founders retain their supplied photographs and name mapping. Existing graph maturity, evidence, scope and uncertainty are unchanged. The system study leads to the same work exploration and problem-mapping paths. Discovery contact/Google Form integration remains deferred.

Artwork was built as SVG and CSS instead of generated raster images: it remains crisp at every size, uses no external image service and introduces no additional image-download weight. Project identity panels use deterministic markup; they do not call AI APIs.

## Verification

`scripts/visual-playtest.mjs` covers seven listed identities, platform exclusion, font rendering, shared logo, pointer/keyboard study controls, project filters and navigation, product/project artwork, founder identity, discovery availability, widths 390/768/1024px, reduced motion and browser runtime errors. `scripts/page-visuals-playtest.mjs` checks each page family, platform exclusion, clarified workflow/overview agreement, Explore selection/artwork agreement and phone overflow. Screenshots in `tmp/visual-review/` and `tmp/page-visuals/` support manual layout inspection. Standard discovery/PDF regression remains in `scripts/playtest.mjs`.
