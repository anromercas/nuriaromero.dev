## Context

[NRD-298](https://nuriaromerodev.atlassian.net/browse/NRD-298). The web prices guide `src/content/blog/cuanto-cuesta-una-pagina-web-en-sevilla.md` (Markdown, `BlogPostLayout`) currently opens with "esta guía no da cifras de mercado" and its "Respuesta corta" says "no hay una cifra única fiable". NRD-128 froze that with two guards in `tests/price-post-intent.test.js` (`ALLOWED_NUMBERS` = {2, 5, 75, 10}, and no "€"/"euro"/"EUR"). The owner answered S-2026-11-13-1 YES on 2026-11-19: the post may answer with the published web design tariffs and a table, from the single source `disenoWeb.pricing` in `src/data/services.ts` (NRD-10): `tiers[0]` "Landing de una página", from "149 €"; `tiers[1]` "Web completa (hasta 5 páginas)", from "399 €", each with an `includes` list. `tests/diseno-web-template.test.js:169` already imports `disenoWeb` from `../src/data/services.ts` under Node 24, so a test can read the source directly.

The post has 8 H2 sections, the maximum the existing guard allows, so the table cannot get its own H2. `src/layouts/BlogPostLayout.astro` already styles `.post-prose table`, `th`, `td` (including a `max-width: 479px` rule), so a GFM table renders. Those rules set `overflow-wrap: anywhere` on every `th`/`td`, which lowers each cell's min-content width to about one character; with the auto table layout a long third column can squeeze a short price column until "149 €" splits across lines (see the decision "Price column never wraps"). The only other blog table (`que-es-geo-posicionamiento-ia-negocios-sevilla.md`) uses no column alignment. `scripts/check-seo-18.mjs` freezes every built post's body text and dates in `tests/fixtures/blog-posts.baseline.json`; a story that edits a post on purpose regenerates it in the same commit.

## Goals / Non-Goals

**Goals:**

- The post's opening paragraph and "Respuesta corta" answer the price question with my published rates, with their date, as "mis tarifas".
- A table of the two web design tiers equal to `disenoWeb.pricing.tiers`.
- A drift test: the post fails the unit tests when its figures, tier names or included items diverge from the source, or when any foreign figure appears.

**Non-Goals:**

- No FAQ block or FAQPage JSON-LD; no other service prices (the store price in `tiers[1].note` stays out); no market range.
- No change to `src/data/services.ts`, `/diseno-web-sevilla/`, `public/llms.txt` or JSON-LD builders. The only style change is the scoped no-wrap rule for right-aligned table cells (decision "Price column never wraps"); no other layout or style change.
- No conversion of the post to MDX or a data-driven component (would need a new integration, `@astrojs/mdx`, which is a new dependency and out of proportion for two rows).

## Decisions

**Approach.** The post keeps being plain Markdown and carries the rates as text; the single source is enforced by the unit test, which imports `disenoWeb` and compares the post against it (the pattern NRD-10 already uses for `public/llms.txt` in `tests/single-price-source.test.js`). The opening paragraph and the "Respuesta corta" lead state both "desde" prices, "mis tarifas" and the rate date; the table follows the lead inside "Respuesta corta" so the H2 count stays at 8 and the direct-answer rule still sees a paragraph first. The rate date is the post's `updatedDate` in long Spanish form ("19 de noviembre de 2026"): it is the date on which the post states the rates as current, it is set from the content commit date (ADR 0017, build-derived freshness: never faked), and the test ties the two together so the date in the text cannot drift from the frontmatter. The NRD-128 number guards are replaced by a narrower rule that still blocks market ranges: every euro amount must be a tier amount, currency words are banned, and every number of three or more digits must be a tier amount or the rate year.

Alternative considered: a dedicated `pricing.updated` field in `ServicePageData`. Rejected: it changes a shared type and the service page data for a date no page renders today, and the AC only needs the date the post states the rates.

**Price column never wraps (decided now, not deferred to QA).** The `overflow-wrap: anywhere` risk is structural, not cosmetic: the auto table layout distributes width roughly by max-content, so with a "Qué incluye" cell of about 250 characters the "Precio" column can drop to a few pixels at 375 px and break "149 €" or even the digits. Fix: the post's delimiter row right-aligns the price column (`| --- | ---: | --- |`); `mdast-util-to-hast` 13 (the version Astro 4 uses here) emits `align="right"` on those `th`/`td`; `src/layouts/BlogPostLayout.astro` gets one scoped rule inside the existing `.post-prose` table block:

```css
.post-prose :global(th[align="right"]),
.post-prose :global(td[align="right"]) {
  white-space: nowrap;
  overflow-wrap: normal;
}
```

This keeps the cell text identical to the source (no NBSP, no HTML in Markdown), touches no other table (the GEO post table has no aligned columns), and follows the usual convention that right-aligned numeric columns do not wrap. Rejected: (a) `td:nth-child(2) { white-space: nowrap }` would also stop wrapping the long second column of the GEO post table and overflow it at 375 px; (b) a non-breaking space in `src/data/services.ts` changes the price source and every page that renders it, and does not stop `overflow-wrap: anywhere` from breaking inside the amount; (c) leaving it to QA ships a likely visible defect in the first block of the post.

**Files** (all layer `app`):

- modify `tests/price-post-intent.test.js`: import `disenoWeb`; remove `ALLOWED_NUMBERS`, `numbersOf` and the two NRD-128 guards; add the tests listed in the test plan. Keep every other test unchanged.
- modify `tests/helpers/post-sections.js`: add `markdownTable(markdown)` (first GFM table in a Markdown fragment, rows as arrays of trimmed cell strings, header and delimiter rows excluded) and `firstParagraph(body)` (the first block before the first H2) if the developer prefers them shared; otherwise keep them local in the test file.
- modify `src/content/blog/cuanto-cuesta-una-pagina-web-en-sevilla.md`: opening paragraph, "Respuesta corta" lead plus table, any sentence that says the post gives no figures, `updatedDate`.
- modify `src/layouts/BlogPostLayout.astro`: add the scoped `th[align="right"]`, `td[align="right"]` no-wrap rule right after the existing `.post-prose :global(td:first-child)` rule. Nothing else in the layout changes.
- modify `tests/blog-post-template.test.js` (it already reads `BlogPostLayout.astro` as `layout` and checks the table rules): add a source assertion that `BlogPostLayout.astro` holds the rule (selector `td[align="right"]` with `white-space: nowrap`).
- modify `tests/fixtures/blog-posts.baseline.json`: regenerated with `pnpm build && node scripts/check-seo-18.mjs --write`; the diff must touch only the `cuanto-cuesta-una-pagina-web-en-sevilla` entry (body text, `dateModified`).

**Interfaces** (test helpers, plain JS):

```js
/** First GFM table in a Markdown fragment: data rows as arrays of trimmed cells. */
export function markdownTable(markdown) // -> string[][]  ([] when no table)
/** Text of the body before the first H2, trimmed, first block only. */
export function firstParagraph(body) // -> string
```

Expected table shape in the post (cells exactly as in the source; "Qué incluye" is `includes.join("; ")`):

```md
| Tarifa | Precio | Qué incluye |
| --- | ---: | --- |
| Landing de una página | Desde 149 € | Diseño a medida adaptado a móvil; Textos optimizados para SEO local en Sevilla; ... |
| Web completa (hasta 5 páginas) | Desde 399 € | Todo lo de la landing, más estructura completa por secciones; ... |
```

Copy guidance (Spanish, `tú`, no jargon, final wording is the developer's): the opening paragraph says these are my rates, not a market price ("no doy cifras de mercado, solo mis tarifas"); the "Respuesta corta" lead is one or two sentences, 15 to 45 words, e.g. "Con mis tarifas, vigentes a 19 de noviembre de 2026, una landing de una página cuesta desde 149 € y una web completa de hasta 5 páginas, desde 399 €." The dominio/hosting remark may follow the table, never before it. Keep the hub link `[...](/diseno-web-sevilla/)` and every other section as is.

**Data:** none. No schema, settings or storage change; `src/data/services.ts` is read only. `Article.dateModified` and the sitemap `lastmod` follow the new `updatedDate` through the existing build path.

**Test plan (TDD order):** in `tests/price-post-intent.test.js` (and 2b in `tests/blog-post-template.test.js`), written first and seen failing against the current post:

1. "the opening paragraph and the short answer give my published rates" -> scenario "Price answer first": both blocks contain "mis tarifas", each `tier.from` and the long es-ES `updatedDate` (`new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(data.updatedDate))`). Fails today (no figures).
2. "the short answer table equals disenoWeb.pricing.tiers" -> scenario "Rates table": `markdownTable(section)` deep-equals `tiers.map(t => [t.name, \`Desde ${t.from}\`, t.includes.join("; ")])`, with a message naming the first differing tier; the delimiter row (which `markdownTable` must recognise even with colons) right-aligns the second column (`---:`) and no other. Fails today (no table).
2b. In `tests/blog-post-template.test.js`: `BlogPostLayout.astro` contains a rule whose selector includes `td[align="right"]` and whose body sets `white-space: nowrap`. Fails today.
3. "every euro amount and long number comes from the tiers" -> scenarios "Drift between post and source fails" and "Foreign figure fails": euro amounts via `/(\d{1,3}(?:\.\d{3})*|\d+)\s?€/g` on the body without link URLs must be in `{tier amounts}`; no `/\beuros?\b|\bEUR\b/i`; numbers via `/\d+(?:\.\d{3})*/g` (after stripping link URLs and `^\d+\. ` list markers) with three or more digits must be a tier amount or the year of `updatedDate`. Passes today, fails if "800 €" or "5.000" is added (check by hand once).
4. "no sentence claims the post gives no figures" -> scenario "No contradiction with the table": sentences of `plainText(body)` matching `/\bno (?:da|doy|hay)\b[^.]*\bcifras?\b/i` must contain "de mercado". Fails today ("no hay una cifra única fiable").
5. Unchanged and still green: term in title/description, description length, direct answer per H2 (the new lead must pass), exact content headings, at most 8 H2, hub link and reciprocal pair, guarantees only negative, update date coherent.
6. Then `pnpm build`, regenerate the `check-seo-18` baseline, `pnpm check:seo:dist` green.

No fakes or fixtures beyond the regenerated baseline.

**Real-browser / e2e checks (QA):**

- `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` at 375 px: the rates table is readable, the name and "Qué incluye" cells wrap, "Desde 149 €" and "Desde 399 €" each stay on one line (right-aligned), and there is no horizontal page scroll; at desktop width it aligns with the prose column. Also open `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` at 375 px: its table is unchanged (still wraps in every column).
- Fallback if the price column plus the other two still overflow at 320-375 px (not expected: "Desde 399 €" is about 85 px at 14 px type): report a `qa-bug`; the TL fix is to reduce the cell padding under 480 px, never to wrap the price.
- Order under "Respuesta corta": heading, lead paragraph, table. Prices read "Desde 149 €" / "Desde 399 €", identical to the plan cards on `/diseno-web-sevilla/`.
- "Actualizado el" shows the new date, equal to the date written in the rate sentence.
- Dark-only styles: table header and borders are visible against the ink surface.

**GEO page quality (seo-review):** freshness from the real content change (`updatedDate` = content commit date, not bumped by builds); direct answer first in "Respuesta corta"; no keyword stuffing; no structured data change.

**ADRs relied on:** 0012 (keyword ownership registry, the post owns "cuanto cuesta una pagina web en sevilla"), 0017 (build-derived freshness), and the `src/data` single-source invariant. No new ADR: the decision is local to one post and follows the existing drift-test pattern.

## Risks / Trade-offs

- [Rates written twice: data and post text] -> Mitigation: the drift test fails on any change to `disenoWeb.pricing.tiers` not mirrored in the post; a future price change (itself a radical change that needs the owner) will surface this test.
- [The rate date ties to `updatedDate`, so any later content edit must also restate the date] -> Mitigation: intentional; restating the date re-confirms the rates whenever the post changes, and the test makes it impossible to forget.
- [GFM table cell text with `|` would break parsing] -> The current `includes` items contain no `|`; the drift test would fail visibly if one were added.
- [Long "Qué incluye" cells squeeze the price column at 375 px (`overflow-wrap: anywhere` on every cell)] -> Mitigation: decision "Price column never wraps" (right-aligned price column plus scoped no-wrap rule); the other columns keep wrapping; QA checks both blog tables at 375 px.
- [The no-wrap rule applies to any future right-aligned column in any post] -> Intentional convention for short numeric columns; a future table that right-aligns a long column would need its own decision.
- [`align` attribute depends on the Markdown pipeline] -> Verified in `mdast-util-to-hast@13.0.2` (`lib/handlers/table-row.js` sets `properties.align`); if an Astro upgrade switched to inline `style="text-align:right"`, the QA 375 px check would show the price wrapping again.

## UI spec

Scope: rendered Markdown content of `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` only (`src/content/blog/cuanto-cuesta-una-pagina-web-en-sevilla.md` inside the `.post-prose` of `src/layouts/BlogPostLayout.astro`). No component or token change; the only style change is the scoped no-wrap rule for right-aligned table cells from the decision "Price column never wraps" (see 5 and 7). Mode: Read (the visitor wants to understand a price). The post is not a pricing page, so the table stays a plain data table, not plan cards.

### 1. Screens and layout

- One screen changes: the post body. Header (`post-title`, `post-lede`, `post-meta`), breadcrumbs, related links and the closing band are untouched.
- Body order at the top of `.post-prose`, top to bottom:
  1. Opening paragraph (the first block before the first H2), rewritten.
  2. `## Respuesta corta` (heading text unchanged).
  3. Lead paragraph (the direct price answer), one sentence.
  4. The rates table.
  5. One follow-up paragraph (domain/hosting and how to compare). It must come after the table, never between lead and table.
  6. `## ¿Qué hace variar el presupuesto de una web?` and every following section, unchanged.
- No new H2 or H3 (the H2 count stays at 8). No blockquote, callout, bold block or HR around the table.

### 2. Hierarchy

- Primary information: the two "desde" prices. They appear three times on purpose, each with its own job: opening paragraph (answer for the skimmer and for AI extraction), "Respuesta corta" lead (direct answer under its question), table (what each rate includes).
- Reading order inside "Respuesta corta": heading, lead, table, follow-up. The table supports the lead; it is not the answer itself.
- No action is added to the body. The existing hub link to `/diseno-web-sevilla/` (last section) and the layout's closing band stay the only conversion paths. Assumption: no booking or "ver tarifas" link next to the table, to keep the post a guide and avoid a second CTA in the answer block.
- The table carries no "Recomendado" marker, no yellow and no extra bold, even though `tiers[1].recommended` is true in the source: DESIGN.md "The Reserved Yellow Rule" keeps yellow for plan cards, and the cells must equal the source text exactly.

### 3. States

n/a for loading, empty, error, partial and disabled: static content rendered at build time. The only "state" is freshness: the rate date in the copy and "Actualizado el" both come from `updatedDate` (see 6).

### 4. Copy (Spanish, `tú`, exact strings)

`<fecha>` below is always the long es-ES form of the post's `updatedDate` (e.g. "19 de noviembre de 2026"), and `updatedDate` is the real content commit date. It is never a fixed date unrelated to `updatedDate`.

- Opening paragraph (replaces "No hay una tarifa única para una web: ... entre presupuestos."):
  "No hay un precio de mercado único para una web, así que aquí no doy cifras de mercado, solo mis tarifas: a <fecha>, una landing de una página cuesta desde 149 € y una web completa de hasta 5 páginas, desde 399 €. El resto de la guía te ayuda a comparar lo que incluye cada presupuesto."
  Assumption: the wording is mine. It follows the design's copy guidance ("no doy cifras de mercado, solo mis tarifas") and fits tests 1 and 4: the only "no ... cifras" sentence contains "de mercado", and the only numbers are 149, 399, 5, the day and the year.
- "Respuesta corta" lead (replaces both current sentences of that block):
  "Con mis tarifas, vigentes a <fecha>, una landing de una página cuesta desde 149 € y una web completa de hasta 5 páginas, desde 399 €."
  One sentence, about 30 words (inside the 15 to 45 rule). Taken from the design's example. Assumption: no second sentence, so the word count stays well under 45.
- Table: header row exactly `Tarifa | Precio | Qué incluye` (fixed by the design), delimiter row exactly `| --- | ---: | --- |` (price column right-aligned, no other column aligned). Data rows exactly as the design's expected table shape: tier `name`, `Desde <from>`, `includes.join("; ")`. No trailing period, no added words, no bold, no links inside cells.
- Follow-up paragraph after the table:
  "El dominio y el hosting los pagas tú directamente, a tu nombre. Para comparar con otros presupuestos, revisa qué incluye cada partida y qué se cobra aparte."
  Assumption: the first sentence reuses the published FAQ answer in `disenoWeb.faqs` (`src/data/services.ts`), so it adds no new claim. The second keeps the comparison advice of the current "Respuesta corta". No figures in it.
- Microcopy constraints for the developer:
  - Prices are written only as `149 €` and `399 €` (number, space, euro sign, as in the source). Never "149€", "149 euros", "EUR", "a partir de 149", "+IVA" or ranges.
  - Always "desde" before a price. Never present a price as final or as a market average.
  - "mis tarifas" appears in the opening paragraph and in the lead.
  - The store price in `tiers[1].note` and any other service price stay out of the post.
  - Every other sentence stays as it is, except any sentence that claims the post gives no figures (rewritten as above).

### 5. Design system reuse

- Table: GFM table styled by the existing `.post-prose :global(table|th|td)` rules in `src/layouts/BlogPostLayout.astro` (lines 252-283, plus the `max-width: 479px` block at 344-352): `--hairline-strong` cell borders, `--card-surface` header fill, `--text-strong` header text, `--text-secondary` cells, `--text-body` weight 600 for the first column, 0.9375rem type (0.875rem under 480 px).
- Plus exactly one new scoped rule, added right after the existing `.post-prose :global(td:first-child)` rule (decision "Price column never wraps"): `.post-prose :global(th[align="right"]), .post-prose :global(td[align="right"]) { white-space: nowrap; overflow-wrap: normal; }`. It applies only to cells of a right-aligned column (`---:`, rendered as `align="right"`), so the GEO post table, which has no aligned columns, is unaffected.
- Paragraphs: existing `.post-prose p` (68ch, `--text-secondary`, 1.0625rem / 1.75).
- Tokens live in `src/styles/template.css`. DESIGN.md: "Hairline Strong ... for data-table cell borders". Precedent for a GFM table in a post: `src/content/blog/que-es-geo-posicionamiento-ia-negocios-sevilla.md` (3 columns, long cells).
- New component: none.

### 6. Dates: "Actualizado el" vs the rate date

- `post-meta` renders "Actualizado el <fecha>" from `updatedDate` (`toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })`), the same long form the copy uses, so both read identically on the page.
- "Publicado el" (`pubDate` 2026-07-07) stays unchanged.
- The body phrases the rate date as "a <fecha>" (opening) and "vigentes a <fecha>" (lead), never "actualizado". The body date means "these prices are current as of this day"; the meta line means "this page last changed that day". They are the same day by construction.

### 7. Responsive

- 320 to 479 px: the table keeps its three columns at 100 % of the content width. No horizontal scroll container and no stacking (Markdown cannot produce one, and the design allows only the scoped no-wrap rule). The "Precio" column is right-aligned and stays on one line; the "Tarifa" and "Qué incluye" columns wrap. The "Qué incluye" cells become the tallest block at the top of the post (roughly 15 to 25 lines each at 375 px). That is acceptable because the lead above already gives the answer.
- Expected at 375 px: no horizontal page scroll; "Desde 149 €" and "Desde 399 €" each stay on one line, right-aligned in their cells; tier names and "Qué incluye" items wrap at word boundaries.
- Resolved risk: `overflow-wrap: anywhere` on every cell could let the auto table layout squeeze "Precio" until "149 €" split. The decision "Price column never wraps" (right-aligned column plus the scoped no-wrap rule in 5) resolves it. QA still checks it in a real browser at 375 px, on this post and on `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` (its table must still wrap in every column).
- 480 px and up: the table spans the full container width (`src/components/SectionContainer.astro`: `md:max-w-2xl`, `lg:max-w-4xl`). Its left edge aligns with the paragraphs. It may be wider than the 68ch paragraphs, as in the GEO post; that is the expected look, not a defect.

### 8. Interactions

n/a: no interactive element is added. The table has no links, sorting or toggles. Existing link hover and focus styles are unchanged.

### 9. Accessibility hand-off

- GFM renders `<table><thead><tr><th>Tarifa</th><th align="right">Precio</th><th>Qué incluye</th></tr></thead><tbody>...` (price `td` also carry `align="right"`; it changes only alignment and wrapping, not semantics). The three `th` are the column headers. Browsers infer column scope for a simple table with one header row, so `scope` is not needed.
- No `<caption>`: GFM cannot produce one. The lead paragraph right before the table acts as its visible description. Assumption: no raw HTML table or caption in the Markdown, because the design's `markdownTable()` helper and the `check-seo-18` baseline expect a GFM table.
- First-column cells stay `td` (bold through `td:first-child`), not row headers. Acceptable for a two-row table.
- Reading order equals visual order (heading, lead, table, follow-up). No content is hidden or reordered.
- Contrast: every color comes from existing dark-theme tokens (`--text-strong` on `--card-surface` headers, `--text-secondary` and `--text-body` on the ink ground, `--hairline-strong` borders at 3:1 or more per DESIGN.md). The site is dark-only (`<html class="dark">` and `color-scheme: dark` in `src/layouts/Layout.astro`); there is no light theme to check.
- `lang="es"` on `<html>` lets `hyphens: auto` hyphenate Spanish words correctly in narrow cells.

### 10. GEO-ready content

- The opening paragraph and the "Respuesta corta" lead each answer "¿cuánto cuesta?" in their first sentence, before any context.
- The visible date is the real content change date (`updatedDate` = content commit date, ADR 0017), never a fixed or bumped date.
- Brand: the changed copy names no brand. "Nuria Romero Castillo" in `post-meta` is unchanged.
- No keyword stuffing: "página web" and "Sevilla" are not added to the new sentences beyond natural use. No hidden text.
