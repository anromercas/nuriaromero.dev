## Why

Tracker: [NRD-292](https://nuriaromerodev.atlassian.net/browse/NRD-292).

Answer engines confirm an entity by joining external profiles. NRD-160 and NRD-248 registered the owner's Sortlist profile as a citation and published it in `SITE.sameAs`. Clutch published the owner's free profile on 2026-11-18 (`https://clutch.co/profile/nuria-romero`, story comment 12010), so it can follow the same path: verified in a real browser, recorded as a third-party citation, then added to the official profile list that feeds the JSON-LD and `/ai/summary.json`.

## What Changes

- `docs/seo-audit/local-signals-2026-11.md`, "Citas de terceros": the Clutch row moves from "sin URL pública ... pendiente de revisión" to the public URL with the name, address and phone observed in a real browser and the date; the rows and lines that still call Clutch pending are updated. The "visit website" link goes through the `r.clutch.co` tracking redirect, so it is recorded as a citation, not a backlink.
- `SITE.sameAs` (`src/data/site.ts`) gains `https://clutch.co/profile/nuria-romero` as the last entry, so `#business`, `#person` (`src/lib/schema.ts`) and `/ai/summary.json` (`src/lib/ai-discovery.ts`) publish it.
- The verified-profile allowlist of `scripts/check-seo-11.mjs` and the `/seo-local-sevilla/` JSON-LD baseline (`tests/fixtures/seo-local-sevilla.baseline.json`) gain the URL.
- `tests/same-as.test.js` gains the Clutch assertions. Two NRD-248 assertions that were written for a list without Clutch are adjusted, because they contradict this story by construction: "Sortlist is the last entry" becomes "Sortlist is right before Clutch", and `clutch.co` leaves the banned-host list (Crunchbase, Wikipedia and Wikidata stay). The guards the story names (https only, no duplicates, footer still links LinkedIn and GitHub) are not touched.
- Gate: if the profile shows a name, city or phone that differs from `SITE`, the URL is not added and the story gets `needs-human` so the owner corrects the profile.

## Out of scope

- Paid Clutch plans, reviews, client data or unverified figures (story).
- A visible Clutch link anywhere on the site (footer, `/contacto/`, `public/llms.txt`); `check-seo-09` keeps allowing only LinkedIn and GitHub in `llms.txt`.
- Crunchbase, Wikipedia or Wikidata profiles; splitting `sameAs` between the business and the person node.
- Correcting the Clutch profile itself (owner's account).

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `site-identity`: the official profile list includes the verified Clutch profile, and a third-party profile enters the list only after its real-browser citation record matches `SITE`.

## Impact

- `docs/seo-audit/local-signals-2026-11.md`, `src/data/site.ts`, `scripts/check-seo-11.mjs`, `tests/fixtures/seo-local-sevilla.baseline.json`, `tests/same-as.test.js`.
- Public JSON-LD and `/ai/summary.json` gain one URL. No dependency, page, URL, visible copy or price change; nothing radical.
