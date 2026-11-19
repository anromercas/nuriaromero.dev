## Context

NRD-310 fixed the mobile CLS of the font swap by adding two metric-matched local fallback faces in `src/styles/fonts.css` (`@font-face "Onest Fallback"`, lines 27-38; `@font-face "Instrument Serif Fallback"`, lines 40-51) and inserting them in every published stack:

- `src/layouts/Layout.astro:101` (`html`): `"Onest Variable", "Onest Fallback", system-ui, sans-serif`
- `src/styles/template.css:92` (`.tpl-accent`): `"Instrument Serif", "Instrument Serif Fallback", Georgia, serif`
- `src/components/seo-local/SeoLocalCycle.astro:99`: same Instrument Serif stack

`DESIGN.md` still records the pre-NRD-310 stacks: the seven `typography.*.fontFamily` tokens in the front matter (lines 31, 37, 43, 49, 54, 60, 65) and the "Display / Body Font" / "Accent Font" lines (160-161). Existing guards: `tests/font-loading.test.js` pins the CSS stacks; `tests/template-components.test.js` pins `DESIGN.md` colour tokens against `template.css` (`designColors()`), but nothing compares the `DESIGN.md` font tokens with the CSS. The `page-template` spec requirement "Ink tokens live in one place" already says `DESIGN.md` records the token values; this change extends it to the font stacks (same reasoning as NRD-278 / ADR 0013 docs drift).

## Goals / Non-Goals

**Goals:**

- `DESIGN.md` shows the published stacks verbatim, in the tokens and in the Typography prose, and explains the fallback faces in one sentence.
- A test fails whenever `DESIGN.md` and the CSS stacks drift apart again.

**Non-Goals:**

- Any change under `src/`, any change to the built HTML, font loading or fallback metrics.
- Rewriting other parts of `DESIGN.md`.

## Decisions

**Approach.** Edit `DESIGN.md` in place and add one drift test. The test reads the source of truth (the CSS), not a copy of the strings, so a future stack change in `Layout.astro` or `template.css` without a `DESIGN.md` update fails the suite. Tokens are stored as YAML single-quoted scalars holding the CSS stack verbatim (`fontFamily: '"Onest Variable", "Onest Fallback", system-ui, sans-serif'`), so the value can be pasted into CSS unchanged and stays valid YAML. The test unquotes either YAML quote style, so a Prettier pass cannot break it.

**Files**

| Path | Action | Layer | Symbols / lines |
| --- | --- | --- | --- |
| `tests/design-md-fonts.test.js` | create | app | new drift test |
| `DESIGN.md` | modify | app (shared path, edited in the `app` subtask) | front matter `typography.{display,headline,accent,title,stat,body,label}.fontFamily`; "## Typography" lines "Display / Body Font", "Accent Font" plus one new sentence |

**Interfaces** (test-local helpers, not exported):

- `cssStack(source: string, selector: string): string` - returns the `font-family` value (without `;`) of the first rule `selector {` in `source`.
- `designFontTokens(design: string): Record<string, string>` - parses the `typography:` block of the `DESIGN.md` front matter into `{ display: "<stack>", ... }`, unquoting `'...'` (with `''` -> `'`) or `"..."` (JSON) scalars.

**Data:** none.

**Test plan (TDD order)** - `tests/design-md-fonts.test.js` first, RED against the current `DESIGN.md`, then edit `DESIGN.md` to GREEN:

1. "DESIGN.md font tokens equal the published stacks" (scenario *Font tokens carry the published stacks*): `onest = cssStack(Layout.astro, "html")`, `serif = cssStack(template.css, ".tpl-accent")`; sanity-assert they contain `"Onest Fallback"` / `"Instrument Serif Fallback"`; assert `designFontTokens` has exactly the seven keys, `accent === serif` and every other key `=== onest`. RED today (tokens lack the fallbacks).
2. "Typography lines show the published stacks" (scenario *Typography lines show the published stacks*): in the slice from `## Typography` to the next `### `, the line starting `**Display / Body Font:**` includes `onest` and the line starting `**Accent Font:**` includes `serif`. RED today.
3. "DESIGN.md explains the fallback faces" (scenario *The fallback faces are explained*): the same slice matches `src/styles/fonts.css`, `NRD-310`, `/CLS|layout shift/` and a keep-instruction (`/keep|do not remove|never remove/i`). RED today.
4. Scenario *Documentation-only change*: verified at review with `git diff --stat develop...HEAD` (only `DESIGN.md`, the new test and the design change); no automated test.

No fakes or fixtures: the test reads repository files with `readFileSync`, like `tests/template-components.test.js`.

**`DESIGN.md` target text** (English, as the rest of the file):

- Front matter: display, headline, title, stat, body, label: `fontFamily: '"Onest Variable", "Onest Fallback", system-ui, sans-serif'`; accent: `fontFamily: '"Instrument Serif", "Instrument Serif Fallback", Georgia, serif'`. Only those seven lines change.
- Typography:
  - `**Display / Body Font:** Onest Variable, stack `"Onest Variable", "Onest Fallback", system-ui, sans-serif`, set globally in Layout at 106.25% root size.`
  - `**Accent Font:** Instrument Serif, italic 400 only, stack `"Instrument Serif", "Instrument Serif Fallback", Georgia, serif`, imported where used.`
  - New sentence right after: `The fallback faces "Onest Fallback" and "Instrument Serif Fallback" are metric-matched local fonts defined in `src/styles/fonts.css`: they keep text the same size while the web font loads, so the swap causes no layout shift (CLS, NRD-310). Keep them in the stack whenever either font is used on another page.`
- Formatting: run `pnpm format DESIGN.md` only if `pnpm prettier --check DESIGN.md` passes on the unmodified file; otherwise leave the rest of the file untouched to avoid an unrelated diff.

**Real-browser / e2e checks:** none (documentation and tests only; built HTML unchanged). QA may confirm `pnpm build` output is byte-identical for one page if desired.

**ADRs relied on:** 0006 (node:test and TDD), 0008 (English docs/code), 0014 (template tokens recorded in `DESIGN.md`).

## Risks / Trade-offs

- [The `typography` block parser is regex-based] -> Mitigation: it only needs the fixed two-level shape already used by the file; the test asserts exactly seven keys so a parse miss fails loudly instead of passing vacuously.
- [Prettier could rewrite the YAML quotes] -> Mitigation: the test accepts both quote styles.
- [`SeoLocalCycle.astro` has its own copy of the serif stack] -> Not covered by this test (it is covered by `tests/font-loading.test.js`, which requires the fallback in every Instrument Serif stack).
