## MODIFIED Requirements

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
