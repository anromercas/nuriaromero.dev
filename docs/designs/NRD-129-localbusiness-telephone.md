# NRD-129 - Tie the LocalBusiness JSON-LD telephone to the published phone (SEO P6 gap G1)

## Why

[NRD-129](https://nuriaromerodev.atlassian.net/browse/NRD-129) (site gap G1 of NRD-77, `docs/seo-audit/local-signals-2026-11.md`; checklist item GEO-2 of `docs/seo-audit/page-optimization-checklist.md`; epic NRD-2). Google Maps and answer engines match the business across the GBP listing, the footer and the structured data by name, address and phone. The JSON-LD `telephone` is built from `SITE.whatsapp` (`src/lib/schema.ts:26`, `` `+${SITE.whatsapp}` ``) while the visible phone is `SITE.phone` (`src/components/Footer.astro:64`, `src/pages/contacto.astro:66`, `src/components/seo-local/SeoLocalNap.astro:15`, `src/pages/aviso-legal.astro:24`). Both hold the same number today (`src/data/site.ts:12` `"611 812 431"`, `:14` `"34611812431"`), but nothing ties them: changing one would silently publish two phones for one business.

## What changes

1. **Approach: guard, not refactor (AC 1, option 2).** No product code changes. A new unit test in `tests/nap-consistency.test.js` asserts that the E.164 form of `SITE.phone` equals `+${SITE.whatsapp}` and that `localBusinessSchema()` keeps building `telephone` from `SITE.whatsapp`. Why this option has the smaller diff: deriving `telephone` from `SITE.phone` (option 1) would add a normalisation helper to `src/data/site.ts` or `src/lib/schema.ts` and still leave four `tel:+${SITE.whatsapp}` links (footer, `/contacto/`, `SeoLocalNap`) built from the other field; the single equality assertion ties every surface built from either field at once, with zero change to the rendered HTML. The PR body states this reason (AC 1).
2. **Rendered guard.** `scripts/check-seo-11.mjs` also asserts, on every built page, that the business entity's `telephone` equals the E.164 form of `SITE.phone`, so a divergence introduced anywhere in the schema code (not only in `site.ts`) fails `pnpm check:seo-11:dist` in CI.

The rendered phone, the `tel:` links and the JSON-LD value (`+34611812431`) do not change.

## Out of scope

- G2 (`Person` locality "Sevilla" vs business "La Rinconada"), G3 (`areaServed` literals) and G4 (two GBP URL forms): PO decision 2026-11-15, they wait for the owner's GBP read.
- Changing which field the `tel:` links or the WhatsApp link use; renaming `SITE.whatsapp`.

## Requirements and scenarios

### Requirement: the JSON-LD telephone and the published phone are the same number

`tests/nap-consistency.test.js` SHALL read `src/data/site.ts` and `src/lib/schema.ts` as text (the file's existing `literal()` helper) and SHALL fail when `toE164(SITE.phone) !== "+" + SITE.whatsapp`, where `toE164` strips every non-digit and prefixes `+34` unless the digits already start with the `34` country code and have 11 digits. It SHALL also fail if `localBusinessSchema()` stops building `telephone` as `` `+${SITE.whatsapp}` ``.

#### Scenario: numbers agree (today)

- WHEN `node --test tests/nap-consistency.test.js` runs on the current data
- THEN the new case passes

#### Scenario: numbers diverge

- WHEN `SITE.phone` or `SITE.whatsapp` is edited so that the digits differ (RED evidence: a local, uncommitted edit of `SITE.phone` to `611 812 432`)
- THEN the new case fails with a message naming both values

#### Scenario: schema source changes

- WHEN `telephone` in `localBusinessSchema()` is built from anything other than `` `+${SITE.whatsapp}` ``
- THEN the new case fails

### Requirement: the rendered telephone matches the published phone on every page

`scripts/check-seo-11.mjs` SHALL import `SITE` from `src/data/site.ts` (as it already imports `localTrust`) and, for the business entity of every built page, SHALL `fail()` when `business.telephone !== toE164(SITE.phone)`.

#### Scenario: build check

- WHEN `pnpm build && pnpm check:seo-11:dist` runs
- THEN it passes, and it fails if the built `telephone` differs from `+34` plus the digits of `SITE.phone`

#### Scenario: nothing else moves

- WHEN `pnpm check:seo-10:dist` and `node --test tests/*.test.js` run
- THEN both pass unchanged (the visible phone in `/seo-local-sevilla/` is still `SITE.phone`)

## Files

| Layer | Action | Path                            | Notes                                                                     |
| ----- | ------ | ------------------------------- | ------------------------------------------------------------------------- |
| `app` | modify | `tests/nap-consistency.test.js` | new case "the JSON-LD telephone is the E.164 form of the published phone" |
| `app` | modify | `scripts/check-seo-11.mjs`      | import `SITE`; `telephone` rule on the business entity                    |

`src/data/site.ts`, `src/lib/schema.ts` and every component: read only.

## Interfaces

```js
// shared shape, written inline in both files (no new module: two 3-line copies are
// cheaper than a shared helper for one rule)
const toE164 = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("34") && digits.length === 11
    ? `+${digits}`
    : `+34${digits}`;
};
```

## Data

None. No storage, schema or settings impact; the rendered JSON-LD is byte-identical.

## Test plan (TDD order)

1. `tests/nap-consistency.test.js`: add the case (equality plus the `telephone:\s*\`\+\$\{SITE\.whatsapp\}\``source match). RED: temporarily change`SITE.phone`locally, run`node --test tests/nap-consistency.test.js`, copy the failure line into the subtask comment, revert. GREEN on the real data.
2. `scripts/check-seo-11.mjs`: add the rule; RED the same way on a local build (or by asserting against a deliberately wrong expected value once), then GREEN with `pnpm build && pnpm check:seo-11:dist`.
3. `node --test tests/*.test.js`, `pnpm check:seo-10:dist`, `pnpm check:seo-11:dist` green. Format only the two edited files.

## Real-browser / e2e checks

None needed: no markup, style or script changes. QA confirms in the built `dist/index.html` that the JSON-LD `telephone` is still `+34611812431` and the footer still shows `611 812 431`.

## Risks

- A test that passes on the first run cannot show RED by itself; the RED evidence is the local mutation above. That is the expected shape for a guard story.
- `check-seo-11` imports `.ts` at runtime as `check-seo-10` already does (Node 24 strips types); no new tooling.

## ADRs

Relies on [0003](../adr/0003-single-app-layer-and-src-data.md) (site facts in `src/data`), [0004](../adr/0004-seo-head-and-structured-data.md) (JSON-LD from `src/lib/schema.ts`), [0005](../adr/0005-sitemap-robots-llms-and-seo-checks.md) (build-time `check-seo-*`), [0006](../adr/0006-testing-node-test-and-tdd.md). No new ADR.

## UI spec

### No visual change

This story adds a unit test and a build-time check only (`tests/nap-consistency.test.js`, `scripts/check-seo-11.mjs`). No page, layout, component, style, client script or copy changes. The built HTML of every page stays byte-identical. Checklist items 1-8 (screens, hierarchy, states, copy, design system, responsive, interactions, accessibility): n/a.

### What must stay identical

Every surface that shows or dials the business phone keeps its current markup, text, classes and `href`:

| Surface                         | Path                                            | Visible text            | Link                                                              |
| ------------------------------- | ----------------------------------------------- | ----------------------- | ----------------------------------------------------------------- |
| Footer (every page)             | `src/components/Footer.astro:63-64`             | `611 812 431`           | `tel:+34611812431`, classes `hover:text-blue-500 hover:underline` |
| `/contacto/`                    | `src/pages/contacto.astro:62-66`                | `Teléfono: 611 812 431` | `tel:+34611812431`                                                |
| `/seo-local-sevilla/` NAP block | `src/components/seo-local/SeoLocalNap.astro:15` | `611 812 431`           | `tel:+34611812431`                                                |
| `/aviso-legal/`                 | `src/pages/aviso-legal.astro:24`                | `Teléfono: 611 812 431` | none (plain text)                                                 |
| WhatsApp link                   | `src/data/site.ts:52` (`whatsappUrl`)           | unchanged               | `https://wa.me/34611812431?text=...`                              |
| JSON-LD (not visible)           | `src/lib/schema.ts:26`                          | n/a                     | `"telephone": "+34611812431"`                                     |

The `ux-review` and `a11y-responsive` reviewers have nothing to check beyond confirming that the diff touches no file under `src/`. If a later revision of this story moves to option 1 (deriving `telephone` from `SITE.phone`), the visible phone format above (`611 812 431`, spaced, without `+34`) and the `tel:` targets must still render exactly as listed.

## Tasks

- [ ] 1.1 [NRD-145 app] Guard the JSON-LD telephone against the published phone; tests: new `tests/nap-consistency.test.js` case first (RED by local mutation), then the `check-seo-11` rule.
