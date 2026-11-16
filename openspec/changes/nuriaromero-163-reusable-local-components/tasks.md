# Tasks

## 1. Guards and shared contract

- [x] 1.1 [NRD-179 app] Template contract tooling and reference baseline: `scripts/lib/page-contract.mjs`, `scripts/lib/template-pages.mjs`, `scripts/check-seo-16.mjs` (with `--write`), `scripts/check-seo-17.mjs`, `scripts/diff-main.mjs`, `tests/fixtures/seo-local-sevilla.baseline.json` captured from unchanged `develop`, `package.json` scripts; tests: `tests/page-contract.test.js` first (RED), then `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green
- [x] 1.2 [NRD-180 app] Shared ink tokens `src/styles/template.css`, `SectionHeading.astro`, `src/components/seo-local/types.ts`; tests: `tests/template-components.test.js` first (tokens equal `DESIGN.md` values, single accent `em`), then suite, build, `check:seo:dist` and `diff-main` against the baseline with no difference

## 2. Sections take content by props

- [x] 2.1 [NRD-181 app] Props and `visual` slot for `SeoLocalHero`, `ProofStrip` (`SITE_PROOF` in `src/data/site.ts`), `SeoLocalClosing`, `SeoLocalNap`; tokens in `ListingMock`; `/seo-local-sevilla/` passes today's data; tests: extend `tests/template-components.test.js` first, migrate the matching assertions of `tests/seo-local-ficha-redesign.test.js`; verify suite, build, `check:seo:dist`, `diff-main` clean
- [x] 2.2 [NRD-182 app] `ReviewBento` + new `BentoTile`, `SeoLocalProcess` + new `SeoLocalCycle` (slots `byline`, `aside`), `RealProof`, `SeoLocalAgencia` by props; the six tile SVGs move to the page verbatim; tests: extend `tests/template-components.test.js` first, migrate T7 and copy assertions of `tests/seo-local-ficha-redesign.test.js`, `tests/visibility-audit-graphics.test.js`, `tests/seo-local-sevilla-redesign.test.js`; verify suite, build, `check:seo:dist`, `diff-main` clean
- [ ] 2.3 [NRD-183 app] `SeoLocalPlans` (slot `lede`), `SeoLocalFaq` (optional `links` per item, FAQPage unchanged), `SeoLocalRelated` by props; tests: extend `tests/template-components.test.js` first, migrate plan and FAQ assertions of `tests/seo-local-posicionamiento-web.test.js` and `tests/seo-local-ficha-redesign.test.js`; verify suite, build, `check:seo:dist` (15, 16, 17), `diff-main` clean

## 3. Optional sections and documentation

- [ ] 3.1 [NRD-184 app] `ServiceLayout` `variant="template"` (no slot fallbacks, `template-ground` on `<main>`), `/seo-local-sevilla/` drops its `<style is:global>`; tests: `ServiceLayout` and page source assertions first; verify suite, build, `check:seo:dist`, `diff-main` clean, a local build without the pricing slot shows no empty band or legacy pricing card, `/automatizaciones/` unchanged
- [ ] 3.2 [NRD-185 app] `DESIGN.md` "Known Drift" no longer describes page-scoped tokens and gains "Using the components on another page" (shared path routed to app); tests: `DESIGN.md` assertions in `tests/template-components.test.js` first; verify suite and build

## Workflow follow-up

- QA attaches the 375/768/1280 px before/after screenshots of `/seo-local-sevilla/` and the `diff-main` output.
- Archive the change at dev-done (`/team-harness:dev`).
