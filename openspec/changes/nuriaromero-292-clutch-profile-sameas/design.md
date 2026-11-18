## Context

- `SITE.sameAs` (`src/data/site.ts:43-48`): LinkedIn, GitHub, Google Business Profile, Sortlist (NRD-248), readonly tuple. Visible links resolve by network through `profileUrl()` (`src/data/site.ts:52-66`), so appending an entry changes no rendered HTML.
- Consumers of the whole list: `localBusinessSchema()` (`src/lib/schema.ts:34`), `personSchema()` (`src/lib/schema.ts:107`), `buildAiSummary()` (`src/lib/ai-discovery.ts:55`); `tests/ai-discovery.test.js:107` follows `SITE.sameAs` automatically.
- Guards: `scripts/check-seo-11.mjs:74-86` compares the built business `sameAs` with the hardcoded `VERIFIED_SAME_AS` (exact order); `scripts/check-seo-16.mjs` compares `/seo-local-sevilla/` JSON-LD with `tests/fixtures/seo-local-sevilla.baseline.json` (`sameAs` at line 33-38; regenerate with `--write`); `tests/same-as.test.js` (NRD-248).
- Two assertions of `tests/same-as.test.js` contradict this story by construction: "SITE.sameAs contains the Sortlist profile exactly once, as the last entry" and the banned-host list in "sameAs has no profile without a real listing", which includes `clutch.co` (NRD-248 banned it only because Clutch had no public profile then). The story's acceptance criterion names the guards that must pass unchanged (https, no duplicates, footer LinkedIn and GitHub); those three tests are not touched.
- Citation record: `docs/seo-audit/local-signals-2026-11.md`, L6 source row (line 17), "Third-party citations" row (line 96), section C paragraph (line 107), table row "sin URL pública ... Clutch: pendiente de revisión (NRD-292)" (line 113), checklist line 169.
- Clutch profile: `https://clutch.co/profile/nuria-romero`, published 2026-11-18; read by the orchestrator in a real browser the same day (story comment 12010: title "Nuria Romero - Services & Company Info", H1 "Nuria Romero", location Sevilla; "visit website" goes through `r.clutch.co` to `https://nuriaromero.dev`). The phone was not reported in that reading. Clutch answers automated clients with 403 (Cloudflare).

## Goals / Non-Goals

**Goals:** Clutch recorded as a verified citation; Clutch in every published `sameAs`; the build check, baseline and unit tests updated; `pnpm check:seo` green.

**Non-Goals:** any visible link to Clutch; `public/llms.txt`; reviews or paid plans; editing the Clutch profile.

## Decisions

**Approach.** Same two-step path as NRD-160 + NRD-248, now in one story: first the evidence (real-browser reading recorded in the citation record), then the data. Task 1.1 is the gate: a name, city or phone that differs from `SITE` stops the story with `needs-human`; a field Clutch does not show publicly is recorded as "not shown publicly (observed)" and is not a mismatch, as with Sortlist (whose phone is not public either). Task 1.2 appends the URL to the end of `SITE.sameAs` (no reordering, so every consumer and the baseline only gain one line) and to `VERIFIED_SAME_AS`, which stays hardcoded on purpose (two deliberate edits per profile). The URL is stored exactly as Clutch serves it, `https://clutch.co/profile/nuria-romero` (no `www.`, no trailing slash). No ADR: this reuses the ADR 0003/0004 pattern with no new decision.

**Files (all layer `app`).**

- Modify `docs/seo-audit/local-signals-2026-11.md`: Clutch row of "Citas de terceros", L6 row, "Third-party citations" row, section C paragraph, checklist line (task 1.1). Shared doc under `docs/**`, owned by `app`.
- Modify `tests/same-as.test.js`: add a `CLUTCH` constant and a test "SITE.sameAs contains the Clutch profile exactly once, as the last entry, and both JSON-LD nodes publish it"; change the Sortlist test to "exactly once, right before Clutch"; remove `"clutch.co"` from the banned list (task 1.2).
- Modify `src/data/site.ts`: append `"https://clutch.co/profile/nuria-romero"` to `SITE.sameAs` (task 1.2).
- Modify `scripts/check-seo-11.mjs`: append the URL to `VERIFIED_SAME_AS` with the comment `// Clutch: public profile verified in a real browser by NRD-292 (<date>), recorded in docs/seo-audit/local-signals-2026-11.md` (task 1.2).
- Regenerate `tests/fixtures/seo-local-sevilla.baseline.json` with `pnpm build && node scripts/check-seo-16.mjs --write`; the diff must be only the Clutch line and the comma after Sortlist (task 1.2).

**Interfaces.** None new. `SITE.sameAs` keeps its type (readonly string tuple, one more element).

**Data.** `SITE.sameAs` gains one entry. No schema, storage, settings or migration impact.

**Test plan (TDD order).**

1. Task 1.1 (NRD-296): no behavior change, no test. Real-browser reading first, then the record. `node --test tests/*.test.js` stays green. Covers scenarios "Clutch profile is recorded as a citation" and "A profile whose NAP differs is not published".
2. Task 1.2 (NRD-297), RED first in `tests/same-as.test.js`:
   - `SITE.sameAs` contains `https://clutch.co/profile/nuria-romero` exactly once and as the last entry; `localBusinessSchema().sameAs` and `personSchema().sameAs` include it (fails).
   - Sortlist test changed to: exactly once, and `SITE.sameAs.indexOf(SORTLIST) === SITE.sameAs.indexOf(CLUTCH) - 1` (fails while Clutch is absent).
   - Banned-host test without `clutch.co` (still passes; standing guard for Crunchbase, Wikipedia, Wikidata).
   - Implement the data line; GREEN (the https/unique test still passes with the new entry). Then `pnpm build` and `node scripts/check-seo-11.mjs` fails on the allowlist (scenario "Unverified profile fails the build check" observed); update `VERIFIED_SAME_AS`; regenerate the check-seo-16 baseline; `pnpm check:seo:dist` green. Covers "Sortlist profile is published in structured data" (now with Clutch as the last entry), "Invalid or duplicate profile fails the tests", "Profiles without a real listing are absent".

**Real-browser / e2e checks (QA).**

1. Home page source on the dev server (`http://localhost:4399`): the `#business` and `#person` JSON-LD `sameAs` end with `https://www.sortlist.es/agency/nuria-romero`, `https://clutch.co/profile/nuria-romero`; `/ai/summary.json` lists the same five URLs.
2. Footer of `/` and `/contacto/`: still only "LinkedIn" and "GitHub" links with unchanged `href`s; no Clutch link anywhere.
3. Open `https://clutch.co/profile/nuria-romero` in the real Chrome (devtools-mcp, CDP 9333; never `curl`/fetch): public page of "Nuria Romero", location Sevilla, "visit website" leading to nuriaromero.dev; values match the row written by task 1.1. Screenshot to `$TMPDIR/nuriaromero-qa/NRD-292/clutch-profile.png`. If the browser is blocked as a bot, QA cites the task 1.1 record and story comment 12010.

**ADRs relied on.** ADR 0003 (single app layer, facts in `src/data`), ADR 0004 (structured data only through `schema.ts`), ADR 0005 (SEO checks), ADR 0006 (node:test and TDD).

## Owner-account actions (executed by the orchestrator)

- Read the public Clutch profile in the user's signed-in Chrome to confirm name, location, phone and the outgoing link, only if the developer's and QA's browser is blocked as a bot: **executable owner action** (attended session; unattended, queued in `.claude/state/attended-actions.json`). Read-only.
- Correct the name, city or phone on the Clutch profile if it differs from `SITE`: **hard limit** (provider/site settings in the owner's account); the story gets `needs-human`.

## Risks / Trade-offs

- Changing two NRD-248 assertions could look like weakening the guard; it is not: the ban on `clutch.co` existed only because no public profile existed, and the ordering assertion moves with the new tail. The three guards the story names stay byte-identical.
- The phone may not be shown publicly on Clutch (it was not reported in comment 12010). Treated as "not shown", like Sortlist, and stated in the developer's story comment for the PO; only a different value blocks.
- Regenerating the baseline could hide unrelated drift; the subtask requires the fixture diff to be only the Clutch line and the Sortlist comma.
- The Clutch URL is a company profile and also lands on `#person`, like Sortlist and the Google Business Profile already do; one list keeps both nodes consistent (ADR 0004).

## UI spec

No visual change: Clutch goes into JSON-LD `sameAs` and `/ai/summary.json` only; no page, layout, component or style is edited, and the footer and `/contacto/` HTML stay byte-identical.

- Why the rendered links cannot change: the visible profile links (`src/components/Footer.astro:60,69`, `src/pages/contacto.astro:68`) resolve through `profileUrl()` (`src/data/site.ts:64`), which picks only hosts listed in `PROFILE_HOSTS` (`linkedin.com`, `github.com`). The developer must not add `clutch` to `PROFILE_HOSTS` or render `SITE.sameAs` anywhere.
- Copy, states, responsive, interactions, accessibility: n/a (no UI element added or edited). GEO-ready content: n/a (no visible content changes; the brand string, dates and section copy are untouched).
- Check for `ux-review`: the visible text of `/` and `/contacto/` contains no "Clutch", and the footer still shows exactly "LinkedIn" and "GitHub" with their current `href`s.
