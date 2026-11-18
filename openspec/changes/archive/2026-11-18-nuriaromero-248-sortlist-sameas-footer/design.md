## Context

- `SITE.sameAs` (`src/data/site.ts:43-47`): LinkedIn, GitHub, Google Business Profile (`place_id` form), as a readonly tuple (`as const`).
- Consumers of the whole list: `localBusinessSchema()` (`src/lib/schema.ts:34`, `#business`), `personSchema()` (`src/lib/schema.ts:107`, `#person`), `buildAiSummary()` (`src/lib/ai-discovery.ts:55`, `/ai/summary.json`). Consumers by index: `src/components/Footer.astro:60` (`[0]`, LinkedIn) and `:69` (`[1]`, GitHub), `src/pages/contacto.astro:68` (`[0]`, LinkedIn). The story's line numbers (69, 78, 103) are stale; these are the current ones on `develop` 1671e29.
- Guards: `scripts/check-seo-11.mjs:74-84` compares the built business `sameAs` with a hardcoded `VERIFIED_SAME_AS` allowlist (exact order); `tests/ai-discovery.test.js:107` asserts `summary.sameAs` equals `SITE.sameAs`; `tests/contact-template.test.js:165` asserts the literal `SITE.sameAs[0]` in the contact page; `scripts/check-seo-16.mjs` compares `/seo-local-sevilla/` JSON-LD with `tests/fixtures/seo-local-sevilla.baseline.json` (its `sameAs` at line 33) and documents regeneration with `--write`; `scripts/check-seo-09.mjs:32-35` allows only LinkedIn and GitHub as external links in `public/llms.txt`.
- Node 24 strips TypeScript types, and `site.ts` and `schema.ts` import only relative `.ts` files, so tests import them directly (as `tests/ai-discovery.test.js` already does).
- NRD-160 (merged first) records the real-browser verification of the Sortlist profile in `docs/seo-audit/local-signals-2026-11.md`, "Citas de terceros". Sortlist returns 403 to automated clients.

## Goals / Non-Goals

**Goals:** Sortlist in every published `sameAs`; visible profile links independent of list order; a test that guards validity, uniqueness and the footer links; `pnpm check:seo` green.

**Non-Goals:** Clutch (NRD-292), Crunchbase, Wikipedia/Wikidata; `public/llms.txt`; any visible UI change; a separate `sameAs` per node.

## Decisions

**Approach.** Add a small lookup to the site data, `profileUrl(network)`, that returns the first `SITE.sameAs` URL whose hostname (without `www.`) matches the network's host and throws when none does, so a missing profile breaks the build at render time instead of producing a wrong link. Footer and contact page import it; their HTML output is byte-identical. Then append Sortlist to the end of `SITE.sameAs` (no reordering, so existing consumers and the baseline only gain one line) and to the check's allowlist, which stays hardcoded on purpose: adding a profile requires two deliberate edits, the data and the verified list. Both JSON-LD nodes keep reading the same list (the Google Business Profile is already on `#person`; one source keeps them consistent, ADR 0004). The lookup lives in `src/data/site.ts` because site facts live in `src/data` (ADR 0003).

**Files (all layer `app`).**

- Modify `src/data/site.ts`: export `PROFILE_HOSTS`, `ProfileNetwork`, `findProfileUrl()`, `profileUrl()` (task 1.1); append `"https://www.sortlist.es/agency/nuria-romero"` to `SITE.sameAs` (task 1.2).
- Modify `src/components/Footer.astro`: import `profileUrl` from `@/data/site` (alongside `SITE`); `href={profileUrl("linkedin")}`, `href={profileUrl("github")}` (task 1.1).
- Modify `src/pages/contacto.astro`: `href={profileUrl("linkedin")}` (task 1.1).
- Create `tests/same-as.test.js` (tasks 1.1 and 1.2).
- Modify `tests/contact-template.test.js:165`: `/profileUrl\("linkedin"\)/` instead of `/SITE\.sameAs\[0\]/` (task 1.1).
- Modify `scripts/check-seo-11.mjs:74-81`: append the Sortlist URL to `VERIFIED_SAME_AS`, comment "Sortlist: public profile verified in a real browser by NRD-160 (2026-11-18), recorded in docs/seo-audit/local-signals-2026-11.md" (task 1.2).
- Regenerate `tests/fixtures/seo-local-sevilla.baseline.json` with `pnpm build && node scripts/check-seo-16.mjs --write`; the diff must be only the added Sortlist line(s) in `sameAs` (task 1.2).

**Interfaces.**

```ts
// src/data/site.ts
export const PROFILE_HOSTS = { linkedin: "linkedin.com", github: "github.com" } as const
export type ProfileNetwork = keyof typeof PROFILE_HOSTS
/** First URL of `list` whose hostname (without "www.") is the network's host; throws if none. */
export function findProfileUrl(list: readonly string[], network: ProfileNetwork): string
/** findProfileUrl(SITE.sameAs, network) */
export function profileUrl(network: ProfileNetwork): string
```

**Data.** `SITE.sameAs` gains one entry. No schema, storage, settings or migration impact.

**Test plan (TDD order).**

1. Task 1.1, RED first in `tests/same-as.test.js` (scenarios "Footer and contact links survive a new profile", "Missing profile fails the build", "Invalid or duplicate profile fails the tests"):
   - `profileUrl("linkedin")` and `profileUrl("github")` return the two current URLs (fails: no export).
   - Source of `Footer.astro` matches `href={profileUrl("linkedin")}` followed by link text `LinkedIn`, and `href={profileUrl("github")}` followed by `GitHub`, and has no `sameAs[`; source of `contacto.astro` has `href={profileUrl("linkedin")}` and no `sameAs[` (fails: index access).
   - Every `SITE.sameAs` entry parses with `new URL`, has protocol `https:`, and the normalized set (lowercase, strip leading `www.`, strip trailing `/`) has the same size as the list (passes already; it is the standing guard).
   - `findProfileUrl(["https://github.com/anromercas"], "linkedin")` throws; `findProfileUrl(["https://www.linkedin.com/in/x"], "linkedin")` returns that URL (fails: no export).
   - Update `tests/contact-template.test.js:165`. Then implement; GREEN; `pnpm build` and `pnpm check:seo:dist` green with no change in `dist/` HTML for footer and contact.
2. Task 1.2, RED first in `tests/same-as.test.js` (scenarios "Sortlist profile is published in structured data", "Profiles without a real listing are absent"):
   - `SITE.sameAs` contains the Sortlist URL exactly once and as the last entry (fails).
   - `localBusinessSchema().sameAs` and `personSchema().sameAs` contain it (fails).
   - No entry's hostname ends with `clutch.co`, `crunchbase.com`, `wikipedia.org` or `wikidata.org` (passes; standing guard).
   - Implement the data line; GREEN. Then `pnpm build` and `node scripts/check-seo-11.mjs` fails (allowlist; scenario "Unverified profile fails the build check" observed), update `VERIFIED_SAME_AS`, regenerate the check-seo-16 baseline, `pnpm check:seo:dist` green. `tests/ai-discovery.test.js:107` follows automatically.

**Real-browser / e2e checks (QA).**

1. On the dev server (`http://localhost:4399`): the footer of `/` shows "LinkedIn" and "GitHub" links with the same `href`s as before (`https://linkedin.com/in/nuria-romero-castillo`, `https://github.com/anromercas`), `target="_blank"`, `rel="noopener noreferrer"`; `/contacto/` "LinkedIn" link likewise. Footer at 375 px unchanged (no new link, no wrap change).
2. Home page source: the `#business` JSON-LD `sameAs` ends with `https://www.sortlist.es/agency/nuria-romero`; `/ai/summary.json` lists it.
3. Open `https://www.sortlist.es/agency/nuria-romero` in the real Chrome (devtools-mcp, CDP port 9333; never `curl`/fetch, which get 403): the public agency page of "Nuria Romero" loads without login and links to nuriaromero.dev. Screenshot to `$TMPDIR/nuriaromero-qa/NRD-248/sortlist-profile.png`. If the browser is blocked as a bot, QA cites the NRD-160 record (row and screenshot) and the orchestrator runs the check (below).

**ADRs relied on.** ADR 0003 (single app layer, facts in `src/data`), ADR 0004 (SEO head and structured data only through `schema.ts`), ADR 0005 (SEO checks), ADR 0006 (node:test and TDD).

## Owner-account actions (executed by the orchestrator)

- Open the public Sortlist profile in the user's signed-in Chrome to confirm it is public and is the owner's, only when QA's browser is blocked: **executable owner action** (attended session; unattended, queued in `.claude/state/attended-actions.json`). Read-only.

## Risks / Trade-offs

- `profileUrl` matches by hostname; a second profile on the same host (two GitHub accounts) would resolve to the first. Acceptable: the brand has one per network, and the uniqueness test catches literal duplicates.
- The Sortlist URL is an agency profile and also appears on `#person`, like the Google Business Profile already does. Splitting per node is a larger change with no evidence of benefit; out of scope.
- Regenerating the baseline could hide an unrelated drift; the subtask requires the fixture diff to be only the Sortlist line(s).
- If NRD-160 records the profile as not public, task 1.2 does not add it and the developer comments on the story; task 1.1 still ships.

## UI spec

**No visual change.** This story changes only where the existing profile links get their `href` (`profileUrl()` instead of `SITE.sameAs[n]`). Sortlist goes into the JSON-LD `sameAs` and `/ai/summary.json` only. It gets no visible link anywhere: no footer link, no contact-page link, no icon or badge. The rendered HTML of the two surfaces below must be byte-identical to `develop` before the change.

### Footer profile links (`src/components/Footer.astro`, the `<address>` block)

Must stay identical:

- Order and content: `LinkedIn` · `GitHub`, in that order, on one `<p>`, separated by the literal `·`. No third link.
- `href`: `https://linkedin.com/in/nuria-romero-castillo` and `https://github.com/anromercas`, exactly as now (no `www.`, no trailing slash).
- `target="_blank"` and `rel="noopener noreferrer"` on both.
- `class="hover:text-blue-500 hover:underline"`: same hover and focus behavior. No new tokens or components.
- Labels: `LinkedIn` and `GitHub`, exact case. No added visible text and no `sr-only` text (the footer has none today; adding it would break byte-identity).
- Layout at 375 px: same `<p>` on one line, same wrap points, same footer height. From `sm` (3-column grid) up, unchanged.

### Contact page LinkedIn link (`src/pages/contacto.astro`, paragraph under `SeoLocalNap`)

Must stay identical:

- Same inline link in the same sentence, with the same `href`, `target="_blank"`, `rel="noopener noreferrer"`, `class={textLink}`.
- Label `LinkedIn` plus the existing `<span class="sr-only"> (se abre en una pestaña nueva)</span>`, unchanged.
- No Sortlist mention added to this copy.

### Checklist

- Screens/layout, hierarchy, responsive: unchanged (see above).
- States: n/a. These are static links with no loading, empty or error state. If a profile is missing, `profileUrl()` throws at build time, so a broken link can never render.
- Copy: no new strings.
- Interactions: unchanged (hover color and underline; opens in a new tab).
- Accessibility hand-off: the accessible names stay `LinkedIn` and `GitHub` in the footer, and `LinkedIn (se abre en una pestaña nueva)` on `/contacto/`. Focus order is unchanged: footer links follow the phone link, LinkedIn before GitHub. Nothing is announced.
- GEO-ready content: n/a. No visible content changes; the structured data belongs to the design above and to `seo-review`.
