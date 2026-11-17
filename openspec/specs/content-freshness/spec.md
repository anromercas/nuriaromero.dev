# content-freshness Specification

## Purpose
Publish truthful freshness signals for the site's pages. Each page's modification date is derived at build time from the real version history of its content, never from the build time or a hand-written value, and it is omitted when the history cannot prove it. That one date feeds the `WebPage` or Article `dateModified` JSON-LD, the visible update label and, for blog posts, the sitemap `lastmod`, so search engines and AI answer engines see consistent, non-faked dates.

## Requirements

### Requirement: Page modification dates come from the content history

The build SHALL derive a page's modification date from the most recent commit that changed the page's own source file or the site-data modules that hold its copy. The date SHALL NOT be the build time or a hand-written value. When the version history cannot prove that date (no repository, an untracked or uncommitted file, or a most recent commit that is the boundary of a shallow clone), the build SHALL omit the date instead of approximating it, and SHALL NOT fail.

#### Scenario: Page changed in an earlier commit

- **WHEN** the last commit touching `src/pages/diseno-web-sevilla.astro` or its data module is dated 2026-11-10T09:30:00+01:00 and the site is built later
- **THEN** the page's modification date is 2026-11-10T09:30:00+01:00

#### Scenario: Several sources

- **WHEN** a page's sources were last changed on different dates
- **THEN** the page's modification date is the most recent of them

#### Scenario: Shallow clone

- **WHEN** the build runs in a shallow clone and the most recent commit touching the page's sources is the shallow boundary
- **THEN** the page publishes no modification date and no visible update label, and the build succeeds

#### Scenario: No repository

- **WHEN** the build runs where `git` or the repository history is unavailable
- **THEN** no page publishes a modification date and the build succeeds

### Requirement: Indexable pages publish dateModified in JSON-LD

Every indexable page that is not a blog post SHALL publish a `WebPage` JSON-LD node with its URL, its title and, when known, `dateModified` in ISO 8601 with a time zone offset. Blog posts SHALL keep publishing `datePublished` and `dateModified` in their Article node. `noindex` pages SHALL publish no `WebPage` freshness node.

#### Scenario: Service page with a known date

- **WHEN** the build renders `/seo-local-sevilla/` with a known modification date
- **THEN** its JSON-LD contains a `WebPage` node whose `url` is "https://nuriaromero.dev/seo-local-sevilla/" and whose `dateModified` is that date in ISO 8601

#### Scenario: Date not later than the build

- **WHEN** the build check reads any `dateModified` in `dist/`
- **THEN** it is a valid ISO 8601 date-time not later than the time the page was built, or the check fails naming the page

#### Scenario: Unregistered page

- **WHEN** a new indexable page is added under `src/pages/` without declaring its sources
- **THEN** a unit test fails naming the route

### Requirement: Visible update label matches the structured data

Service pages and the home SHALL show a discreet label "Actualizado: <mes> de <año>" (Spanish month, Europe/Madrid) whose `<time datetime>` equals the page's JSON-LD `dateModified`, only when that date is known. Legal pages SHALL NOT show the label. The label is build-derived metadata, not owner copy, and SHALL NOT count toward the page's word budget.

#### Scenario: Label on a service page

- **WHEN** `/diseno-web-sevilla/` is built with modification date 2026-11-10T09:30:00+01:00
- **THEN** it shows "Actualizado: noviembre de 2026" in a `<time datetime="2026-11-10T09:30:00+01:00">`

#### Scenario: Label and JSON-LD disagree

- **WHEN** a built page's visible update `<time datetime>` differs from its JSON-LD `dateModified`, or the label is present without `dateModified`
- **THEN** the build check fails naming the page

#### Scenario: Unknown date

- **WHEN** a service page has no known modification date
- **THEN** it renders no update label and no empty placeholder

#### Scenario: Legal page

- **WHEN** `/privacidad/` is built
- **THEN** it shows no "Actualizado:" label from this feature

### Requirement: Blog post dates are visible and coherent

Every blog post SHALL show "Publicado el <fecha>" with a `<time datetime>` equal to its Article `datePublished`, and, when the post has an update date, "Actualizado el <fecha>" with a `<time datetime>` equal to its Article `dateModified`. The sitemap `lastmod` of a post, when present, SHALL equal its Article `dateModified`. Non-blog pages SHALL keep no sitemap `lastmod`.

#### Scenario: Post with an update date

- **WHEN** a post has `pubDate` and `updatedDate`
- **THEN** it shows both labels and each `<time datetime>` equals the matching Article property

#### Scenario: Post without an update date

- **WHEN** a post has only `pubDate`
- **THEN** it shows only "Publicado el", and its Article `dateModified` equals `datePublished`

#### Scenario: Sitemap coherence

- **WHEN** the build check reads the sitemap entry of a post
- **THEN** its `lastmod` equals the post's Article `dateModified`
