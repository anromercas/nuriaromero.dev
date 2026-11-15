# Local signals, November 2026 (NRD-77)

SEO method phase 6 of 8 (epic NRD-2). Records what is publicly observable about our Google Business Profile (GBP) and the local-pack competitors of "seo local sevilla" and "agencia seo sevilla", checks the NAP (name, address, phone) across the places we control, maps the GBP services and links to the owner pages of ADR 0013, and gives the owner a change checklist and a monthly review routine. It changes nothing in the profile and nothing in the site.

Conventions: analysis in English, queries, page copy and GBP wording in Spanish verbatim. **Dato observado** is a value with its source and date. "sin dato público; lo confirma la propietaria" means the value is not publicly observable by the tools used and only the owner can read it; it is not 0 and it is not a statement that the field is empty. No value here is estimated or inferred.

## Fuentes y fechas

| Id  | Source                                                                                                                                                                                                                                              | Date       | Used for                                                                      |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| L0  | Step 0 data run of NRD-77 (`.claude/state/seo/2026-11-15-NRD-77-local.md`, untracked; raw JSON in `.claude/state/seo/raw/2026-11-15-NRD-77/`). 9 of 10 DataForSEO calls (`business_data_business_listings_search`), 3 page reads of 15, no failures | 2026-11-15 | Our profile (section A), competitor fields (section B), citations (section C) |
| L1  | Daily SEO report `.claude/state/seo/2026-11-13.md` (local packs of both head terms, `serp_organic_live_advanced` at Seville)                                                                                                                        | 2026-11-13 | Pack membership and review counts; the raw SERP of that day was not saved     |
| L2  | Daily SEO report `.claude/state/seo/2026-11-14.md`                                                                                                                                                                                                  | 2026-11-14 | Pack change in "seo local sevilla"; same pack in "agencia seo sevilla"        |
| L3  | Daily SEO report `.claude/state/seo/2026-11-15.md` (local pack of `diseño web sevilla` only)                                                                                                                                                        | 2026-11-15 | Context: review counts 13 to 77 in a related pack                             |
| L4  | Built site `dist/index.html` (local `pnpm build` of this branch, file dated 2026-11-15 15:17) and the source it renders: `src/data/site.ts`, `src/data/local-trust.ts`, `src/lib/schema.ts`, `src/components/Footer.astro`                          | 2026-11-15 | NAP of the footer and the JSON-LD (section "Consistencia NAP")                |
| L5  | `docs/adr/0013-seo-site-architecture.md` (owner map, status Proposed) and `docs/google-review-request-template.md`                                                                                                                                  | 2026-11-15 | Owner pages per cluster; review-request rules                                 |

Local-pack clusters of the owner map (ADR 0013, "Consequences", NRD-77 line): SL-1, SL-2, DW-1 and SW-1 have a local pack in their SERP; GEO-1, DW-2, IA-2 and TO-3 do not. This document compares the two SEO head terms of SL-1 and records no competitor for the other clusters (gap, see "Huecos de datos").

## Ficha de Google Business Profile (nuestra vs top 3 por término)

### Nuestra ficha (place id `ChIJ8Uv-vM9f0CoR8J75dj4I0HM`)

Step 0 (L0, 2026-11-15): DataForSEO returned no record for our place id, our domain or our name (calls 1, 2, 3, 5 and 9 of the ledger). Every Google-side field below is therefore "sin dato público; lo confirma la propietaria". **This is not evidence that the profile is missing or incomplete**: the Business Listings database simply has no record of it (a service-area or recently changed listing can be absent). What the repository itself records about the profile is shown separately and is owner-declared, not read from Google.

| Field                     | Value read from Google (L0, 2026-11-15)      | Declared in the repository (not a Google reading)                                                                                                                                                                                                                                                                                        |
| ------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primary category          | sin dato público; lo confirma la propietaria | none recorded                                                                                                                                                                                                                                                                                                                            |
| Secondary categories      | sin dato público; lo confirma la propietaria | none recorded                                                                                                                                                                                                                                                                                                                            |
| Service area              | sin dato público; lo confirma la propietaria | `serviceArea: "Sevilla y área metropolitana"` (`src/data/local-trust.ts:35`), shown in the footer as "Zona de servicio: Sevilla y área metropolitana" (`src/components/Footer.astro:56`). Comment at `local-trust.ts:24-27`: since 2026-10-01 the profile shows a public address instead of being a service-area business, per the owner |
| Services list             | sin dato público; lo confirma la propietaria | none recorded                                                                                                                                                                                                                                                                                                                            |
| Website link              | sin dato público; lo confirma la propietaria | none recorded                                                                                                                                                                                                                                                                                                                            |
| Appointment link          | sin dato público; lo confirma la propietaria | the site's own booking URL is `bookingUrl` (`src/data/site.ts:54`); whether the profile uses it is not recorded                                                                                                                                                                                                                          |
| Review count and average  | sin dato público; lo confirma la propietaria | the built home page shows `aggregateRating` `ratingValue` 5 and `reviewCount` 1 in JSON-LD (L4, `dist/index.html`, 2026-11-15), produced from the Places API at build time (`src/lib/google-reviews.ts:76`); the 2026-11-13 report read the same value (L1)                                                                              |
| Address                   | sin dato público; lo confirma la propietaria | `publicAddress: SITE.address.full` = "Camino Andalucía, 426, 41309 La Rinconada, Sevilla" (`src/data/local-trust.ts:34`, `src/data/site.ts:30`); verified by the owner 2026-09-25 and updated 2026-10-01 (`local-trust.ts:24-27`)                                                                                                        |
| Phone                     | sin dato público; lo confirma la propietaria | `SITE.phone` "611 812 431" (`src/data/site.ts:12`); `local-trust.ts:24` records that it matched the profile on 2026-09-25                                                                                                                                                                                                                |
| Hours, attributes, photos | sin dato público; lo confirma la propietaria | none recorded                                                                                                                                                                                                                                                                                                                            |
| Status                    | n/a                                          | `status: "verified"` (`src/data/local-trust.ts:28`)                                                                                                                                                                                                                                                                                      |

### Top 3 del paquete local, "seo local sevilla"

Pack membership comes from the 2026-11-13 report (L1), the basis of Step 0. The 2026-11-14 report (L2) shows that the third place changed: Posiciona Tu Web Sevilla left and **Antonio Castro - Marketing Digital y SEO (68 reviews, 5.0)** entered. Step 0 did not read that business, so its row has only the count and its source.

| Position (L1, 2026-11-13) | Business                 | Position change (L2, 2026-11-14)                                                           |
| ------------------------- | ------------------------ | ------------------------------------------------------------------------------------------ |
| 1                         | Slocal                   | unchanged                                                                                  |
| 2                         | SEO Wolf Sevilla         | unchanged                                                                                  |
| 3                         | Posiciona Tu Web Sevilla | replaced by Antonio Castro - Marketing Digital y SEO (68, 5.0), source L2, fields not read |

### Top 3 del paquete local, "agencia seo sevilla"

Same three businesses in L1 (2026-11-13) and L2 (2026-11-14): 1 Starenlared, 2 Posiciona Tu Web Sevilla, 3 Slocal.

### Campos públicos de los competidores

Source for every cell: Step 0 (L0), `business_data_business_listings_search`, 2026-11-15, except the review count column cross-checked with L1 and L2. Four distinct businesses cover both terms. "not returned" means the tool returned no value; it is not 0.

| Field                 | Slocal (Agencia SEO Local)          | SEO Wolf Sevilla                                                      | Posiciona Tu Web Sevilla                                                           | Starenlared                                                                                   |
| --------------------- | ----------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Pack positions        | seo local #1, agencia seo #3        | seo local #2                                                          | seo local #3 (L1; out of the pack in L2), agencia seo #2                           | agencia seo #1                                                                                |
| Place id              | ChIJ4c1oaac54S0RIo9WLky_ges         | ChIJYTaL7AhsEg0Rh9qzKLtZ2Q8                                           | ChIJJewXITFtEg0RcFfChRsC0X0                                                        | ChIJsxQPVw1sEg0ROcfHkkFnjWo                                                                   |
| Primary category      | Marketing agency                    | Internet marketing service                                            | Marketing agency                                                                   | Marketing agency                                                                              |
| Additional categories | Service establishment               | Marketing agency, Marketing consultant, Website designer              | Website designer                                                                   | Internet marketing service, Internet service provider, Marketing consultant, Website designer |
| Rating / reviews      | 5.0 / 4                             | 5.0 / 12                                                              | 5.0 / 27                                                                           | 5.0 / 77                                                                                      |
| Address               | not returned                        | Pje. Mallol, 10, Casco Antiguo, 41003 Sevilla                         | Virgen de la Antigua, 41011 Sevilla                                                | Av. de Menéndez Pelayo, 18, 1ª Plta, 41004 Sevilla                                            |
| Website link          | https://slocal.es/seo-local-sevilla | https://seowolf.es/                                                   | https://www.posicionatuwebsevilla.com/                                             | https://www.starenlared.net/                                                                  |
| Appointment link      | not returned                        | not returned                                                          | not returned                                                                       | not returned                                                                                  |
| Attributes            | welcomes LGBTQ only                 | offers online appointments, requires appointments, no onsite services | offers online appointments, requires appointments, no onsite services, women-owned | offers online appointments, onsite services, requires appointments                            |
| Listed services       | 7                                   | 6                                                                     | 10                                                                                 | 6                                                                                             |
| Photos                | 6                                   | 2                                                                     | 12                                                                                 | 6                                                                                             |
| Hours                 | Mon-Fri 09:00-20:30                 | Mon-Thu 09:00-17:00, Fri 09:00-15:00                                  | Mon-Fri 08:30-13:30                                                                | Mon-Fri 08:00-15:00                                                                           |
| Record updated        | 2026-10-08                          | 2026-09-13                                                            | 2026-09-13                                                                         | 2026-09-14                                                                                    |

Review counts match the 2026-11-13 report (Slocal 4, Wolf Sevilla 12, Posiciona Tu Web Sevilla 27, Starenlared 77) and, for the businesses that stayed, the 2026-11-14 report. Starenlared's 77 reviews are cited from `.claude/state/seo/2026-11-14.md` and `2026-11-13.md`, and re-read by Step 0 (2026-11-15) with the same value.

Observations only, no inference drawn:

- Review counts of the pack businesses range from 4 (Slocal) to 77 (Starenlared); the 2026-11-14 entrant has 68. A business with 4 reviews and no address shown holds the first position of "seo local sevilla" on both days. Review count alone does not explain the pack in these data.
- Competitor primary categories are "Marketing agency" (3) and "Internet marketing service" (1). The primary category of our profile is not publicly read.
- No competitor shows an appointment link in the data returned; the field is "not returned" for all four, so it cannot be compared with ours.
- Services listed per competitor: 6 to 10. The services of our profile are not publicly read.

## Consistencia NAP

The NAP of the site is read from the built home page (L4, `dist/index.html`, 2026-11-15) and the source that renders it. The GBP column is "sin dato público; lo confirma la propietaria" (L0), so the check against the profile is an owner step (see "Cambios en la ficha para la propietaria").

| Surface                                                         | Name                                            | Address                                                                                                  | Phone                                              | Evidence                                                  |
| --------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| Google Business Profile                                         | sin dato público; lo confirma la propietaria    | sin dato público; lo confirma la propietaria                                                             | sin dato público; lo confirma la propietaria       | L0 section A, 2026-11-15                                  |
| Repository declaration of the profile                           | n/a                                             | "Camino Andalucía, 426, 41309 La Rinconada, Sevilla"                                                     | "611 812 431"                                      | `src/data/local-trust.ts:34`, `src/data/site.ts:12,30`    |
| Footer (`<address>`)                                            | "Nuria Romero"                                  | "Camino Andalucía, 426, 41309 La Rinconada, Sevilla"                                                     | link text "611 812 431", `href` `tel:+34611812431` | `src/components/Footer.astro:50,55,64`; `dist/index.html` |
| `LocalBusiness` JSON-LD (`ProfessionalService`, `Organization`) | "Nuria Romero"                                  | street "Camino Andalucía, 426", postal code 41309, locality "La Rinconada", region "Sevilla", country ES | "+34611812431"                                     | `src/lib/schema.ts:20,26,29-36`; `dist/index.html`        |
| `Person` JSON-LD                                                | "Nuria Romero"                                  | locality "Sevilla" only, country ES                                                                      | none                                               | `src/lib/schema.ts:82,88-92`; `dist/index.html`           |
| `/seo-local-sevilla/` NAP block                                 | "SEO local desde La Rinconada, Sevilla" heading | not re-read in this run                                                                                  | `tel:+34611812431`, text from `SITE.phone`         | `src/components/seo-local/SeoLocalNap.astro:6,15`         |
| Third-party citations                                           | none found                                      | none found                                                                                               | none found                                         | L0 section C (see below)                                  |

Result of the comparison between the surfaces the site controls:

- **Name:** "Nuria Romero" on every surface; matches `SITE.name` (`src/data/site.ts:6`). No mismatch.
- **Phone:** the same number in two notations, "611 812 431" for people (footer text) and "+34611812431" for machines (`tel:` link, JSON-LD). Equivalent, not a mismatch; `tests/nap-consistency.test.js` guards that both come from `SITE`.
- **Address:** footer and `LocalBusiness` agree (La Rinconada, 41309, Camino Andalucía, 426). The `Person` block gives only "Sevilla" as locality: consistent with the brand locality (`src/data/site.ts:23`) but not the same string as the business address. Recorded as a site-side gap (see "Huecos en el sitio").
- **Service area wording:** footer "Sevilla y área metropolitana" (`local-trust.ts:35`) versus JSON-LD `areaServed` "Sevilla" (City) and "Área metropolitana de Sevilla" (`src/lib/schema.ts:10-13`). Same meaning, different strings. Recorded as a site-side gap.

### Citas de terceros (sección C del Step 0)

Date read 2026-11-15. **No directory or profile listing with our name, address and phone was found**, so no "discrepancia" row exists and the checklist has no "corregir en <directorio>" item from this run. This is not proof that no listing exists:

| URL                                     | Name as shown                          | Address as shown             | Phone as shown | Date       | Status                                                                                                                                                   |
| --------------------------------------- | -------------------------------------- | ---------------------------- | -------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| https://www.malt.fr/profile/nuriaromero | "Nuria Romero" (search-result summary) | Seville-based (summary only) | not read       | 2026-11-15 | Not compared: HTTP 403 to the page read (also via malt.com). Ownership by us is not confirmed. Goes to the owner checklist ("confirmar si es tu perfil") |

- `docs/seo-audit/authority-backlink-register.md` lists no directory (Informa, Axesor and Qdq are recorded there as discarded); the 2026-11-14 backlink baseline (33 referring domains) has no domain that looks like a business directory; none was read (L0).
- The search for the exact name plus phone was refused by the search tool and was not worked around; a phone-only search returned nothing that ties the number to us (L0).
- LinkedIn and the Google Maps profile are linked from our `sameAs` (`src/data/site.ts:44,46`); LinkedIn needs a login and the Maps page is dynamic, so neither was read.

## Huecos de datos

- **Our whole GBP record** (categories, service area, services, website and appointment links, hours, attributes, review count and average): not returned by DataForSEO (4 empty calls plus the domain filter). Needs the owner's reading of the profile or a later re-run once the listing is indexed.
- **Antonio Castro - Marketing Digital y SEO:** in the "seo local sevilla" pack on 2026-11-14 (L2); fields not read, only the review count (68, 5.0) from L2.
- **Raw SERP of 2026-11-13** was not saved, so pack positions and place ids cannot be re-checked against it.
- **Appointment link** not returned for any business, competitors included.
- **Slocal address and SEO Wolf Google phone** not returned.
- **Malt profile** (HTTP 403) and any directory that needs a login were not read; name-plus-phone search was refused by the tool.
- **Other local-pack clusters** (DW-1 `diseño web sevilla`, SW-1 `desarrollo de software a medida sevilla`) have no competitor record here beyond the packs in the daily reports; only the two SEO head terms were compared, as the design scopes.
