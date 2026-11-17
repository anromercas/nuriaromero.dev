# not-found-page Specification

## Purpose
Defines the custom 404 page served for unmatched URLs: an answer in business language, exits to the home, the in-focus service pages and the booking call, in the `/seo-local-sevilla/` visual world, never indexed or listed.

## Requirements

### Requirement: The site builds its own 404 page

The build SHALL produce `dist/404.html` from `src/pages/404.astro`, served by Netlify for unmatched paths without any change to `public/_redirects`, `public/_headers` or Netlify configuration.

#### Scenario: 404 page built

- **WHEN** the site is built
- **THEN** `dist/404.html` exists and renders the site header, the 404 content and the footer

#### Scenario: Netlify configuration untouched

- **WHEN** the change is applied
- **THEN** `public/_redirects` and `public/_headers` are unchanged and no `netlify.toml` exists

### Requirement: The 404 explains and orients in business language

The page SHALL open with one H1 saying in plain business language that the page does not exist or has moved, and one sentence pointing to the exits, in Spanish addressing the visitor as `tú`, without invented figures or promises.

#### Scenario: Hero answer

- **WHEN** the hero of the built 404 is read
- **THEN** there is exactly one H1 stating the page does not exist or has changed, followed by one orienting sentence and the booking button

### Requirement: The 404 offers exits to home, services and booking

The page SHALL link, with trailing slashes, to the home and to every in-focus service page taken from `src/data` (not written by hand in the page), and SHALL end with the closing band holding the booking button. It MUST NOT link to parked pages.

#### Scenario: Exits from data

- **WHEN** the built 404 is compared with the in-focus service list exported by `src/data/services.ts`
- **THEN** it links to `/` and to every listed service slug, each with a trailing slash, and to no parked page

#### Scenario: Closing with booking

- **WHEN** the end of the built 404 `<main>` is read
- **THEN** the last section is the closing band with a link to the booking schedule

### Requirement: The 404 is never indexed or listed

The page SHALL carry a robots `noindex` meta, no canonical link and no `og:url` meta, SHALL be absent from the sitemap and from `llms.txt`, and SHALL emit no Service or FAQPage entity.

#### Scenario: Noindex without canonical

- **WHEN** the head of `dist/404.html` is read
- **THEN** it has a robots meta containing `noindex`, no `link rel="canonical"` and no `og:url` meta

#### Scenario: Outside sitemap and llms.txt

- **WHEN** the built sitemap files and `dist/llms.txt` are read
- **THEN** neither contains the 404 URL

#### Scenario: No service structured data

- **WHEN** the JSON-LD of `dist/404.html` is read
- **THEN** it contains no Service and no FAQPage entity

### Requirement: Canonical is omitted only on noindex pages

The shared SEO head SHALL omit the canonical link and the `og:url` meta when a page sets `noindex`, and SHALL keep emitting both for every other page. On every indexable built page the `og:url` meta SHALL appear exactly once and SHALL equal the page's canonical href, absolute and ending in a trailing slash. A build check run by CI SHALL walk every built HTML page and fail on any page that breaks this rule.

#### Scenario: Indexable pages keep their canonical

- **WHEN** any built page without `noindex` is read
- **THEN** it still has its canonical link, unchanged, and an `og:url` meta equal to it

#### Scenario: Noindex pages omit og:url

- **WHEN** a page that sets `noindex` is built
- **THEN** its head has neither a canonical link nor an `og:url` meta

#### Scenario: og:url appears once with a trailing slash

- **WHEN** an indexable built page is read
- **THEN** it has exactly one `og:url` meta and exactly one canonical link, both with the same absolute URL ending in `/`

#### Scenario: Every built page is guarded

- **WHEN** `pnpm check:seo:dist` runs after `pnpm build`
- **THEN** every HTML file under `dist/` is checked, including service, blog, legal, the 404 and private report pages, and the run fails if any page breaks the rule

#### Scenario: Removing og:url from a service page fails the guard

- **WHEN** the guard reads a service page whose `og:url` meta was removed
- **THEN** it reports that page as missing `og:url`

#### Scenario: Adding og:url to the 404 fails the guard

- **WHEN** the guard reads a `noindex` 404 page that declares an `og:url` meta
- **THEN** it reports that a noindex page must not declare `og:url`

### Requirement: The 404 follows the ink template

The page SHALL use the template ground and the NRD-163 hero, related links and closing sections, and SHALL have no animated element whose initial state falls below WCAG 2.2 AA contrast.

#### Scenario: Template sections

- **WHEN** the 404 source is inspected
- **THEN** it renders `SeoLocalHero`, `SeoLocalRelated` and `SeoLocalClosing` inside a `template-ground` main, with no breadcrumbs and no page schema

#### Scenario: Readable at first paint

- **WHEN** the 404 loads at 375 px and at 1280 px
- **THEN** every text visible in the first viewport meets AA contrast from the first paint
