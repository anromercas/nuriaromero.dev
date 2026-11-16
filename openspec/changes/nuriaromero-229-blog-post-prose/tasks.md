# Tasks

Order matters only because 1.1 and 1.2 edit the same `<style>` block; 1.3 is independent.

## 1. Prose polish and contract

- [ ] 1.1 [NRD-232 app] Add `hairline-strong` (#64748b) to `DESIGN.md` (colour token, Colors line and the Shapes border-rule exception) and `src/styles/template.css`, and use it for `.post-prose` th/td borders in `src/layouts/BlogPostLayout.astro`; tests: `tests/blog-post-template.test.js` first (RED: th/td use `var(--hairline-strong)`, token contrast >= 3:1 on `--ink-ground` and `--card-surface`), then suite, `pnpm build` and `pnpm check:seo:dist` green
- [ ] 1.2 [NRD-233 app] Add `.post-prose` rules for `blockquote`, inline `code`, `pre` (own scroll, `max-width: 100%`, card background over Shiki, focus outline), Shiki theme `github-dark-dimmed` in `astro.config.mjs` and `img` (`max-width: 100%`, `height: auto`) on template tokens; tests: `tests/blog-post-template.test.js` first (RED: theme set, rules exist, overflow and sizing declarations, no loose colours), then suite, `pnpm build` and `pnpm check:seo:dist` green
- [ ] 1.3 [NRD-234 app] Make `postContract` assert exactly one H1, the related links block with a link and the closing section linking to `bookingUrl` (`assertPostStructure`, `elementInnerHtml`) in `scripts/lib/post-contract.mjs`, returned object unchanged; tests: `tests/post-contract.test.js` first (RED: valid page plus one failing case per rule), then suite, `pnpm build` and `pnpm check:seo:dist` green with check-seo-18 against the unchanged baseline

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
