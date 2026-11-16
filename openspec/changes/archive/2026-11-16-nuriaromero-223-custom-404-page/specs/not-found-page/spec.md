## Purpose

Defines the custom 404 page served for unmatched URLs: an answer in business language, exits to the home, the in-focus service pages and the booking call, in the `/seo-local-sevilla/` visual world, never indexed or listed.

## ADDED Requirements

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

The page SHALL carry a robots `noindex` meta and no canonical link, SHALL be absent from the sitemap and from `llms.txt`, and SHALL emit no Service or FAQPage entity.

#### Scenario: Noindex without canonical

- **WHEN** the head of `dist/404.html` is read
- **THEN** it has a robots meta containing `noindex` and no `link rel="canonical"`

#### Scenario: Outside sitemap and llms.txt

- **WHEN** the built sitemap files and `dist/llms.txt` are read
- **THEN** neither contains the 404 URL

#### Scenario: No service structured data

- **WHEN** the JSON-LD of `dist/404.html` is read
- **THEN** it contains no Service and no FAQPage entity

### Requirement: Canonical is omitted only on noindex pages

The shared SEO head SHALL omit the canonical link when a page sets `noindex`, and SHALL keep emitting it for every other page.

#### Scenario: Indexable pages keep their canonical

- **WHEN** any built page without `noindex` is read
- **THEN** it still has its canonical link, unchanged

### Requirement: The 404 follows the ink template

The page SHALL use the template ground and the NRD-163 hero, related links and closing sections, and SHALL have no animated element whose initial state falls below WCAG 2.2 AA contrast.

#### Scenario: Template sections

- **WHEN** the 404 source is inspected
- **THEN** it renders `SeoLocalHero`, `SeoLocalRelated` and `SeoLocalClosing` inside a `template-ground` main, with no breadcrumbs and no page schema

#### Scenario: Readable at first paint

- **WHEN** the 404 loads at 375 px and at 1280 px
- **THEN** every text visible in the first viewport meets AA contrast from the first paint
