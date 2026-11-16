## MODIFIED Requirements

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

The shared SEO head SHALL omit the canonical link and the `og:url` meta when a page sets `noindex`, and SHALL keep emitting both for every other page.

#### Scenario: Indexable pages keep their canonical

- **WHEN** any built page without `noindex` is read
- **THEN** it still has its canonical link, unchanged, and an `og:url` meta equal to it

#### Scenario: Noindex pages omit og:url

- **WHEN** a page that sets `noindex` is built
- **THEN** its head has neither a canonical link nor an `og:url` meta
