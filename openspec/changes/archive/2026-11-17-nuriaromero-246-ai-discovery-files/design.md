## Context

- Static Astro 4.4.5 build. ADR 0018 allows prerendered endpoints under `src/pages/` that read only build-time data, with pure builders in `src/lib/` (no `astro:*` imports) covered by `node --test`; it names "future AI discovery files" as an intended use. Precedent: `src/pages/rss.xml.ts` + `src/lib/rss.ts` + `scripts/check-seo-22.mjs`/`check-seo-23.mjs`.
- FAQPage JSON-LD is emitted in three places, all through `faqSchema` (`src/lib/schema.ts:208`): `src/layouts/ServiceLayout.astro:51` (`page.faqs`, the 8 pages of the `services` registry in `src/data/services.ts:913` and the 4 `niches` in `src/data/niches.ts:422`), `src/pages/index.astro:131` (`homeFaqs`, declared in the page at line 90) and `src/pages/contacto.astro:64` (`contactFaqs`, declared in the page at line 20). The two page-local arrays break "Data lives in `src/data`" for this story's needs.
- `faqSchema` normalizes answers with `faq.a.replace(/\s+/g, " ").trim()`.
- `robots.txt` comes from `astro-robots-txt` with an inline 8-rule `policy` in `astro.config.mjs` (all `allow: '/'`, no `disallow`). `public/llms.txt` is hand-kept and has no crawler rules.
- The sitemap `filter` in `astro.config.mjs` already excludes `/rss.xml`; `@astrojs/sitemap` lists endpoint routes unless filtered.
- `SERVICE_AREA` is a private constant in `src/lib/schema.ts:10`.
- Astro 4.4.5 routes `src/pages/.well-known/` (the scanner skips dot entries except `.well-known`: `node_modules/astro/dist/core/routing/manifest/create.js:168`).
- Netlify serves static `.json` as `application/json` and `.txt` as `text/plain` by extension; `public/_headers` sets no `Content-Type`.
- Node 24 in CI; tests and check scripts already import `src/data/*.ts` directly (`scripts/check-seo-19.mjs:8`).

## Goals / Non-Goals

**Goals:** the three files built from `src/data`; a CI guard that fails on any drift from the FAQPage, prices or `robots.txt`; zero change to built HTML and `robots.txt`.

**Non-Goals:** `/ai/service.json`; generating `llms.txt`; any `public/_headers` edit; any claim of ranking or citation effect; any visible copy change.

## Decisions

**Approach.** Follow the RSS pattern exactly. First move the facts the files need into `src/data` without changing output (home and contact FAQs, crawler policy, service area). Then a pure module `src/lib/ai-discovery.ts` builds the three payloads from `src/data` and reuses `faqSchema`'s answer normalization through a shared exported helper, so `faq.json` and the JSON-LD cannot normalize differently. Three thin endpoints call the builders. `ai.txt` is generated from the same `CRAWLER_POLICY` object that `astro.config.mjs` passes to `robotsTxt`, so the two files agree by construction; the build guard `check-seo-24` still verifies the built files (FAQPage in every built HTML vs `faq.json`, prices vs `src/data`, `ai.txt` vs `robots.txt`, sitemap exclusion), because construction-time agreement does not protect against a future page emitting its own FAQPage. No `dateModified` in the files: the freshness rule forbids build dates and there is no meaningful per-file content date. `/ai/service.json` is skipped (optional in the story; `summary.json` already carries services).

**Files.** All layer `app`.

| Action | Path | Symbols | Task |
| --- | --- | --- | --- |
| create | `src/data/page-faqs.ts` | `homeFaqs`, `contactFaqs` (moved verbatim, typed `ServicePageData["faqs"]`) | 1.1 |
| create | `src/data/crawler-policy.ts` | `CrawlerRule`, `CRAWLER_POLICY` (moved from `astro.config.mjs`, same 8 rules and order) | 1.1 |
| modify | `src/data/site.ts` | export `SERVICE_AREA` (moved from `schema.ts`) | 1.1 |
| modify | `src/lib/schema.ts` | import `SERVICE_AREA`; export `faqAnswerText(a)` and use it in `faqSchema` (1.2) | 1.1, 1.2 |
| modify | `astro.config.mjs` | `robotsTxt({ policy: CRAWLER_POLICY })` (1.1); sitemap `filter` also excludes `/ai/` and `/.well-known/` (1.3) | 1.1, 1.3 |
| modify | `src/pages/index.astro`, `src/pages/contacto.astro` | import FAQs from `@/data/page-faqs` | 1.1 |
| modify | `tests/home-template.test.js`, `tests/contact-template.test.js` | FAQ block readers point at `src/data/page-faqs.ts`; assertions unchanged | 1.1 |
| create | `src/lib/ai-discovery.ts` | `faqPages`, `buildAiFaq`, `buildAiSummary`, `buildAiTxt` | 1.2 |
| create | `src/pages/.well-known/ai.txt.ts`, `src/pages/ai/summary.json.ts`, `src/pages/ai/faq.json.ts` | `GET: APIRoute` | 1.3 |
| create | `scripts/lib/ai-discovery-contract.mjs` | `parseRobotsGroups`, `aiTxtFailures`, `faqFailures`, `priceFailures`, `sitemapFailures` | 1.4 |
| create | `scripts/check-seo-24.mjs` | build guard on `dist/` | 1.4 |
| modify | `package.json` | `check:seo-24`, `check:seo-24:dist`, append to `check:seo:dist` (scripts only, no dependency) | 1.4 |
| create | `tests/ai-discovery.test.js` | data moves (1.1), builders (1.2), endpoints and sitemap filter (1.3) | 1.1-1.3 |
| create | `tests/ai-discovery-contract.test.js` | contract with inline fixtures | 1.4 |

**Interfaces.**

```ts
// src/data/crawler-policy.ts
export interface CrawlerRule { userAgent: string; allow?: string | string[]; disallow?: string | string[] }
export const CRAWLER_POLICY: CrawlerRule[]

// src/data/site.ts
export const SERVICE_AREA: readonly { "@type": "City" | "AdministrativeArea"; name: string }[]

// src/lib/schema.ts
export function faqAnswerText(answer: string): string // answer.replace(/\s+/g, " ").trim()

// src/lib/ai-discovery.ts
type FaqEntry = ServicePageData["faqs"][number]
export function faqPages(): { url: string; faqs: FaqEntry[] }[] // "/", "/contacto/", services[].slug, niches[].slug
export function buildAiFaq(): {
  site: string; inLanguage: "es"
  pages: { url: string; questions: { question: string; answer: string }[] }[]
}
export function buildAiSummary(): {
  name: string; url: string; description: string; logo: string
  contact: { email: string; telephone: string } // telephone as in JSON-LD: `+${SITE.whatsapp}`
  address: { streetAddress: string; postalCode: string; addressLocality: string; addressRegion: string; addressCountry: string }
  areaServed: string[]; sameAs: string[]
  services: { name: string; url: string; description: string; priceFrom?: string; plans?: { name: string; from: string }[] }[]
  sectors: { name: string; url: string; priceFrom: string }[]
  resources: { llmsTxt: string; aiTxt: string; faq: string; sitemap: string }
}
export function buildAiTxt(): string

// scripts/lib/ai-discovery-contract.mjs
export function parseRobotsGroups(text: string): Map<string, { allow: string[]; disallow: string[] }>
export function aiTxtFailures(input: { aiTxt: string; robotsTxt: string }): string[]
export function faqFailures(input: { faqJson: object; pages: { route: string; html: string }[] }): string[]
export function priceFailures(input: { summary: object; services: ServicePageData[]; niches: ServicePageData[] }): string[]
export function sitemapFailures(sitemapXml: string): string[]
```

Mapping rules: `services[].name` = `breadcrumbName`, `description` = `seo.description`, `url` = `new URL(slug, SITE.url).href`, `priceFrom` = `pricing.from` only when `ownOffer !== false`, `plans` = `pricing.tiers?.map(({ name, from }) => ({ name, from }))` when present; `address` maps `SITE.address` exactly like `localBusinessSchema` (municipality as `addressLocality`); `areaServed` = `SERVICE_AREA.map((a) => a.name)`. `ai.txt` layout:

```
# ai.txt de nuriaromero.dev
# Generado en el build a partir de los datos del sitio. Las reglas coinciden con /robots.txt.

User-agent: *
Allow: /

User-agent: GPTBot
Allow: /
(one group per CRAWLER_POLICY rule, same order, blank line between groups)

# Recursos
LLMs-Txt: https://nuriaromero.dev/llms.txt
AI-Summary: https://nuriaromero.dev/ai/summary.json
AI-FAQ: https://nuriaromero.dev/ai/faq.json
Sitemap: https://nuriaromero.dev/sitemap-index.xml
```

`parseRobotsGroups` treats consecutive `User-agent` lines as one group (standard robots grouping), ignores comments, blank lines and non-rule directives (`Sitemap`, `Host`, the resource lines), and compares paths as sets per agent.

**Data.** No schema, storage or settings change. Data moves only: `homeFaqs`, `contactFaqs`, `CRAWLER_POLICY`, `SERVICE_AREA` relocated with identical values. No migration. Built HTML and `robots.txt` must be byte-identical after task 1.1 (compare with a `develop` build).

**Test plan (TDD order).**
1. Task 1.1, `tests/ai-discovery.test.js`: `page-faqs.ts` exports `homeFaqs` (6-8 items) and `contactFaqs` (3-4); `CRAWLER_POLICY` has the 8 agents with `allow: "/"`; `localBusinessSchema().areaServed` deep-equals `SERVICE_AREA` (RED: modules/exports missing). Move data (GREEN). Point the FAQ block readers in `tests/home-template.test.js` (line 381) and `tests/contact-template.test.js` (line 97) at `src/data/page-faqs.ts`; keep `faqSchema(homeFaqs)`, `faqs={homeFaqs}` and the contact equivalents asserted on the pages. Full suite, `pnpm build`, `pnpm check:seo:dist`; diff `dist/robots.txt` and `dist/index.html`/`dist/contacto/index.html` FAQPage against a `develop` build. Scenario: "Discovery files are built only from site data".
2. Task 1.2, `tests/ai-discovery.test.js`: `buildAiFaq().pages` equals `faqPages()` mapped through `faqSchema(...).mainEntity` (question `name`, answer `acceptedAnswer.text`), same order, absolute URLs; `buildAiSummary()` prices equal `pricing.from` for every `services`/`niches` entry, `/seo-para-ia/` has no `priceFrom`, `name === SITE.name`; `JSON.stringify` of both payloads contains no ISO date of today; `buildAiTxt()` parsed per agent equals `CRAWLER_POLICY` and contains the four resource URLs; `faqAnswerText` collapses `\n\n`. RED, then implement. Scenarios: summary, faq.json, ai.txt content.
3. Task 1.3, `tests/ai-discovery.test.js`: source tests (each endpoint imports its builder from `@/lib/ai-discovery`, contains no `prerender = false` and does not read `request`; sitemap `filter` excludes `/ai/` and `/.well-known/`); `{ skip: !existsSync(dist) }` test that the three files exist and the JSON parses. RED, then endpoints and filter, then `pnpm build`. Scenarios: files exist, not in sitemap.
4. Task 1.4, `tests/ai-discovery-contract.test.js` with inline fixtures: faq.json question absent from FAQPage; FAQPage question absent from faq.json; page with FAQPage absent from faq.json; answer differs; order differs; price differs from data; plan price differs; registry service missing; ai.txt `Allow: /` vs robots `Disallow: /`; extra agent in ai.txt; missing `llms.txt` link; sitemap listing `/ai/summary.json`; green fixtures for each. RED, then contract, `scripts/check-seo-24.mjs`, `package.json` (keeps `tests/package-scripts.test.js` green), `pnpm build && pnpm check:seo:dist`. Scenarios: every guard-failure scenario.

**Real-browser / e2e checks (QA).**
- On a preview of the build (`pnpm build && pnpm preview`): open `/.well-known/ai.txt`, `/ai/summary.json`, `/ai/faq.json`; JSON renders as JSON, text as text, Spanish characters (á, é, ñ, €) are not mojibake.
- Spot-check two answers in `faq.json` against the visible FAQ on `/` and `/tienda-online-sevilla/`, and two prices in `summary.json` against the visible pricing.
- `dist/sitemap-0.xml` lists none of the three files; `dist/robots.txt` unchanged versus `develop`.
- After the scheduled promotion to `main`: `curl -sI https://nuriaromero.dev/ai/summary.json` and `/.well-known/ai.txt` show `Content-Type` `application/json` and `text/plain` (public request, no owner account needed). A different type opens an infra story; this story does not edit `public/_headers`.

**ADRs relied on.** ADR 0018 (prerendered build-time endpoints), ADR 0001 (static output, no `netlify.toml`), ADR 0017 (build-derived freshness: no build dates), ADR 0016 (canonical brand). No new ADR: the pattern is the one ADR 0018 already decided.

**GEO page quality.** AI discovery files generated at build from site data, never hand-kept, never contradicting `robots.txt`, low priority with no claimed ranking or citation weight; one brand string (`SITE.name`); `sameAs` only from `SITE.sameAs` (real profiles); no build date (freshness). Direct-answer and keyword rules do not apply (no page copy changes).

## Risks / Trade-offs

- `astro.config.mjs` importing a `.ts` data file: Astro first tries a native `import()` of the `.mjs` config (Node 24 strips erasable TS types) and falls back to its Vite loader, which handles TS. Keep `crawler-policy.ts` to erasable syntax (no enums, no namespaces). If `pnpm build` on Netlify ever fails on it, the fallback is `src/data/crawler-policy.mjs` with a JSDoc type; the developer reports it rather than inlining the policy again.
- Moving `homeFaqs`/`contactFaqs` touches two template tests that read page source; the change only repoints the block reader, never weakens assertions.
- `faqFailures` relies on extracting JSON-LD from built HTML; pages emit one FAQPage each today. If a page ever emits two, the guard reports it instead of guessing.
- Low value: the files are unproven for AI engines (story says so); cost is kept small by reusing existing data and the RSS pattern. Size: four subtasks for a 3-point story; the FAQ/policy move adds roughly one subtask over the story's estimate (see tracker comment).
- `public/llms.txt` stays hand-kept and could drift from `summary.json`; out of scope here, flagged to the PO as a follow-up.
