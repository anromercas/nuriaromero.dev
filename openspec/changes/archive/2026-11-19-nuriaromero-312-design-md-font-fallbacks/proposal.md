## Why

[NRD-312](https://nuriaromerodev.atlassian.net/browse/NRD-312). NRD-310 (PR #142) added the metric-matched fallback faces "Onest Fallback" and "Instrument Serif Fallback" (`src/styles/fonts.css:27-51`) and put them in the published stacks (`src/layouts/Layout.astro:101`, `src/styles/template.css:92`, `src/components/seo-local/SeoLocalCycle.astro:99`). `DESIGN.md` still documents the old stacks (`typography.*.fontFamily`, lines 31-65; "Display / Body Font" and "Accent Font", lines 160-161), so whoever builds a new page from `DESIGN.md` can drop the fallback and bring back the font-swap CLS that NRD-310 fixed.

## What Changes

- `DESIGN.md` front matter: every `typography.*.fontFamily` token carries the published stack, verbatim from the CSS: `"Onest Variable", "Onest Fallback", system-ui, sans-serif` (display, headline, title, stat, body, label) and `"Instrument Serif", "Instrument Serif Fallback", Georgia, serif` (accent).
- `DESIGN.md` "Typography" section: the "Display / Body Font" and "Accent Font" lines show the same two stacks, followed by one sentence saying the fallback faces exist to avoid layout shift (CLS) on the web-font swap (NRD-310), that they are defined in `src/styles/fonts.css`, and that they stay in the stack whenever the font is used on another page.
- A drift test in `tests/` reads the stacks from `Layout.astro` and `template.css` and fails when `DESIGN.md` disagrees.
- Documentation and tests only: no file under `src/` changes, the built HTML is identical.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `page-template`: the requirement "Ink tokens live in one place" now also covers the font stacks recorded in `DESIGN.md`, including the fallback faces.

## Impact

- `DESIGN.md` (shared path, routed to the `app` subtask), new `tests/design-md-fonts.test.js` (`app`).
- No code, no dependency, no build output change; QA-exempt paths except the test (`repo.qaExemptPaths` lists `DESIGN.md`).
- No radical change.

## Out of scope

- Changing any stack, fallback metric or font loading in `src/` (NRD-310 owns them).
- Rewording the rest of the "Typography" section (for example "imported where used" in the Accent Font line), the hierarchy or the named rules.
- `PRODUCT.md`, ADRs and other docs.
