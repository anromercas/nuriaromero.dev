# Design: blog RSS feed at /rss.xml with rel="alternate"

## Context

See proposal.md - Why. Current state on `develop`:

- Blog posts are the `blog` content collection (`src/content/config.ts`: `title`, `description`, `pubDate`, optional `updatedDate`, `image`, `tags`, `draft` default false). Four published posts in `src/content/blog/*.md`. `src/pages/blog/index.astro:13` and `src/pages/blog/[slug].astro:7` read `getCollection("blog", ({ data }) => !data.draft)`; post URLs are `/blog/<slug>/` (`src/layouts/BlogPostLayout.astro:19`).
- `src/components/seo/SEO.astro` owns every `<link>`/`<meta>` of the head (invariant "SEO head goes through one component"); `src/layouts/Layout.astro` renders it on every page, including the noindex 404.
- `astro.config.mjs`: `site: 'https://nuriaromero.dev/'`, no `output` (static default), sitemap filter `(page) => !page.includes('/components')`, robots policy allows `/` for every agent.
- The invariant "Static output" (`.claude/harness/invariants.md:9`) lists "an endpoint under `src/pages/`" as a violation; its purpose is "no server runtime, SSR adapter or API routes". `openspec/config.yaml` context repeats "no SSR adapter, endpoints or netlify.toml".
- `tests/package-scripts.test.js` derives the expected `check:seo-NN` / `check:seo-NN:dist` scripts from the `scripts/check-seo-*.mjs` files, so a new check file must be wired in `package.json`.
- `src/data/navigation.ts` shows how a module stays importable by `node --test` (relative `.ts` imports).
- Check numbering: `scripts/check-seo-21.mjs` already exists on `develop` (NRD-26, `/seo-para-ia/`), and NRD-242 (same sprint, PR #108, open) adds `scripts/check-seo-22.mjs` plus `scripts/lib/freshness-contract.mjs` with `check:seo-22`/`check:seo-22:dist`. `tests/package-scripts.test.js` requires one script per number, so this story uses `check-seo-23` (`check:seo-23`, `check:seo-23:dist`), appended to `check:seo:dist` after the `check-seo-22` wiring.

## Goals / Non-Goals

**Goals:**

- A feed built from the same collection and filter as the blog, with a pure, unit-tested XML builder.
- Output stays static: the endpoint is prerendered to `dist/rss.xml` at build time.

**Non-Goals:**

- No `@astrojs/rss` (new dependency = owner decision), no full-content items, no UI link.

## Decisions

**Approach.** A pure function `buildRssFeed(channel, items)` in `src/lib/rss.ts` sorts items by `pubDate` descending, escapes text (`&`, `<`, `>`, `"`, `'`), formats dates with `toUTCString()` (RFC 822) and returns the XML string (RSS 2.0 with the `atom` namespace for a `self` link; no `lastBuildDate`, so the file only changes when a post changes). `src/pages/rss.xml.ts` exports `GET` (Astro static endpoint, prerendered because the project output is static): it reads `getCollection("blog", ({ data }) => !data.draft)`, maps each entry to `{ title, link: new URL(`/blog/${slug}/`, SITE.url).href, description, pubDate }` and returns `new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })`. `SEO.astro` adds the alternate link after the canonical. `astro.config.mjs` sitemap filter also drops URLs ending in `/rss.xml`. Alternatives rejected: `@astrojs/rss` (dependency), an `astro:build:done` integration hook or a post-build script (would re-parse frontmatter outside the content layer, as `getBlogLastmodBySlug` must, and duplicate the draft filter), a hand-kept `public/rss.xml` (drifts).

**Invariant wording.** "Static output" keeps its intent and becomes explicit: prerendered endpoints that write a static file at build time (`src/pages/*.xml.ts`, `*.json.ts`) are allowed; server endpoints (`export const prerender = false`), adapters and API routes stay violations. ADR 0018 records it; the same wording goes into `openspec/config.yaml` context.

### Files

| Action | Path                                                                       | Symbols                                                                                            | Layer |
| ------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----- |
| create | `src/lib/rss.ts`                                                           | `RssChannel`, `RssItem`, `escapeXml`, `buildRssFeed`                                               | app   |
| create | `src/pages/rss.xml.ts`                                                     | `GET: APIRoute`                                                                                    | app   |
| modify | `astro.config.mjs`                                                         | sitemap `filter` also excludes `/rss.xml`                                                          | app   |
| modify | `.claude/harness/invariants.md`                                            | "Static output" item wording (shared path, tracked `.claude/` file)                                | app   |
| modify | `openspec/config.yaml`                                                     | context line "Fully static output: ..." wording (design path, shared)                              | app   |
| modify | `src/components/seo/SEO.astro`                                             | `<link rel="alternate" type="application/rss+xml" title="Blog de Nuria Romero" href="/rss.xml" />` | app   |
| create | `scripts/check-seo-23.mjs`                                                 | dist check (below)                                                                                 | app   |
| modify | `package.json`                                                             | `check:seo-23`, `check:seo-23:dist`, append to `check:seo:dist`                                    | app   |
| create | `tests/rss-feed.test.js`                                                   | unit and source tests                                                                              | app   |
| create | `docs/adr/0018-build-time-endpoints.md`, index row in `docs/adr/README.md` | written with this design                                                                           | app   |

New invariant text (replace the "Static output" item):

> **Static output** - the site is a fully static Astro build (`output` static in `astro.config.mjs`); no server runtime, SSR adapter or API routes; third-party APIs are called at build time only (`src/lib/google-reviews.ts`). Prerendered endpoints that emit a static file at build time (`src/pages/rss.xml.ts`, ADR 0018) are allowed. Netlify config lives in `public/_headers` and `public/_redirects`; there is no `netlify.toml` (ADR 0001). Why: Netlify static hosting and deploy budget. Violation: an adapter, `export const prerender = false`, an endpoint that is not prerendered or that reads the request at runtime, or a `netlify.toml`.

`.claude/` guard for that edit: change only this item's text; never remove or weaken a `permissions.deny` entry, never add an allow rule that reads `.env`, never disable the team-harness plugin or its hooks; no change to `.claude/harness.json`.

`openspec/config.yaml` line becomes: "- Fully static output: no SSR adapter, server endpoints or netlify.toml (prerendered build-time endpoints such as rss.xml are allowed); third-party APIs only at build time."

### Interfaces

```ts
// src/lib/rss.ts (no imports from astro:*, so node --test can import it)
export interface RssChannel {
  title: string;
  link: string;
  description: string;
  language: string;
  selfUrl: string;
}
export interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
}
export function escapeXml(text: string): string;
/** RSS 2.0 string; items sorted by pubDate descending; no lastBuildDate. */
export function buildRssFeed(
  channel: RssChannel,
  items: readonly RssItem[],
): string;

// src/pages/rss.xml.ts
export const GET: APIRoute; // channel: title "Blog de Nuria Romero", link `${SITE.url}/blog/`, language "es-ES",
// description "Artículos sobre SEO local, webs y GEO para negocios locales.", selfUrl `${SITE.url}/rss.xml`
```

Feed shape (one item shown):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog de Nuria Romero</title>
    <link>https://nuriaromero.dev/blog/</link>
    <description>…</description>
    <language>es-ES</language>
    <atom:link href="https://nuriaromero.dev/rss.xml" rel="self" type="application/rss+xml"/>
    <item>
      <title>…</title>
      <link>https://nuriaromero.dev/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/</link>
      <guid isPermaLink="true">https://nuriaromero.dev/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/</guid>
      <description>…</description>
      <pubDate>Sun, 21 Sep 2026 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>
```

`scripts/check-seo-23.mjs` (reads `dist/` and `src/content/blog/*.md` frontmatter, like `astro.config.mjs` does): `dist/rss.xml` exists, starts with the XML declaration and has one `<rss version="2.0">` and one `<channel>`; every non-draft post has exactly one item with link `https://nuriaromero.dev/blog/<slug>/` and non-empty title, description and pubDate; no draft slug appears; item `pubDate`s are non-increasing; every `dist/**/*.html` (skip `informes/`) contains the alternate link once; no `dist/sitemap-*.xml` contains `rss.xml`; `dist/robots.txt` has no `Disallow` matching `/rss.xml`.

### Data

None: no schema or storage change; the feed is derived from the existing collection at build time.

### Test plan (TDD order)

1. `tests/rss-feed.test.js` (RED first, imports `src/lib/rss.ts`):
   - two items given oldest first come out newest first ("Newest first");
   - `escapeXml('A & B <c> "d"')` and a title with `&` produce escaped, well-formed output ("Special characters");
   - links keep the trailing slash; `guid isPermaLink="true"` equals the link; no `lastBuildDate`;
   - source assertions: `src/pages/rss.xml.ts` filters `!data.draft`, does not set `prerender = false`; `astro.config.mjs` filter excludes `rss.xml` ("Draft post", "Sitemap and robots").
2. Task 1.2 adds: source assertion that `SEO.astro` contains the alternate link once ("Discovery link on a post and on the home"); `tests/package-scripts.test.js` turns RED when `scripts/check-seo-23.mjs` exists without its scripts, GREEN after wiring.
3. `scripts/check-seo-23.mjs` RED on the current `dist/` (no feed, no link), GREEN after `pnpm build` ("Every published post is in the feed", "Post missing from the feed fails the build check", "Missing discovery link fails the build check").
4. Full suite, `pnpm build`, `pnpm check:seo:dist` green.

### Real-browser / e2e checks

- Open `http://localhost:4399/rss.xml` from `pnpm preview` or the dev server: the browser shows/downloads XML with four items, newest first.
- Validate the built `dist/rss.xml` with the W3C feed validator (paste the file content; no account needed) and attach the result to QA evidence.
- View source of the home and a post: one alternate link in the head.

### ADRs relied on

ADR 0001 (static output), ADR 0004 (SEO head in one component), ADR 0005 (sitemap and build checks), new ADR 0018.

## Risks / Trade-offs

- [Invariant reworded by a story] → wording only, intent unchanged (no runtime); recorded in ADR 0018 and reported to the human for confirmation.
- [Netlify serves `rss.xml` as `application/xml` instead of `application/rss+xml`] → feed readers accept both; adding a header rule is infra territory (`public/_headers`) and not needed.
- [Date-only frontmatter becomes midnight UTC] → `pubDate` shows 00:00 GMT, same instant the blog already uses in `toISOString()`; consistent.
- [Merge conflict with NRD-241 in `SEO.astro` and with NRD-242 in `package.json` `check:seo:dist`] → different lines in `SEO.astro`; in `package.json` the NRD-244 wiring (`check:seo-23`, `check:seo-23:dist`, `check:seo:dist`) touches the same lines as PR #108 (`check:seo-22`, `check:seo-22:dist`, `check:seo:dist`), so whichever lands second needs a trivial merge: keep both script pairs and keep `check:seo:dist` in numeric order, `check-seo-22` then `check-seo-23`.

## Migration Plan

None. Rollback is reverting the commits (the feed URL disappears; no redirect needed since it never existed).

## UI spec

No visible UI changes. The story adds a build-time feed file and one non-rendered `<link>` in the head; no page, layout region, component, token or style changes. Checklist items 2 (hierarchy), 3 (states), 5 (design system reuse), 6 (responsive), 7 (interactions) and 9 (GEO-ready visible content) are n/a.

### Head discovery link (`src/components/seo/SEO.astro`)

- Placement: directly after the canonical link, rendered on every page through `src/layouts/Layout.astro` (also on noindex pages such as the 404: the link points to the feed, not to the page, so it is harmless there).
- Exact markup: `<link rel="alternate" type="application/rss+xml" title="Blog de Nuria Romero" href="/rss.xml" />`. The `title` is the accessible name feed readers and browser extensions show; it must match the channel title byte for byte.
- No visible "RSS" icon, button or footer link (design Non-Goal "no UI link"). Assumption: discovery through the head link is enough for readers, aggregators and answer engines; a visible subscribe link would be a new UI element and is a separate product decision.

### Feed copy (`src/pages/rss.xml.ts`, channel and items)

- Channel title: `Blog de Nuria Romero` (fixed by the acceptance criteria).
- Channel description: `Artículos sobre SEO local, webs y GEO para negocios locales.` (fixed by the design's Interfaces; Spanish, same tone as the blog index).
- Channel language: `es-ES`.
- Item title and description: the post's frontmatter `title` and `description` verbatim, escaped, never truncated or rewritten, so the feed reads exactly like the blog cards and the post meta description.
- Brand: written exactly as `Nuria Romero` in the channel title; no other brand strings are introduced.

### Accessibility hand-off

- The only user-facing name is the link `title` above; nothing enters the tab order or the accessibility tree of the page.
