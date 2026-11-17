## MODIFIED Requirements

### Requirement: The reference page renders unchanged

`/seo-local-sevilla/` SHALL keep its visible text, heading outline, `<main>` markup except `class` and `data-astro-cid-*` attributes, and JSON-LD (Service with one offer per plan, FAQPage, BreadcrumbList) after the sections become reusable. Build-derived freshness data (the `WebPage` node with `dateModified` and the visible update label) SHALL be excluded from the comparison, because its presence and value depend on the build's version history. A story that changes the reference page on purpose SHALL regenerate the baseline in the same commit.

#### Scenario: JSON-LD and headings match the committed baseline

- **WHEN** the site is built and the reference page check runs
- **THEN** the JSON-LD, without the build-derived `WebPage` freshness node, and the h1-h3 outline of `/seo-local-sevilla/` equal the committed baseline

#### Scenario: Freshness node present or absent

- **WHEN** the reference page is built once with full history (freshness node present) and once in a shallow clone (node absent)
- **THEN** the reference page check passes in both builds with the same baseline

#### Scenario: Main markup comparison

- **WHEN** the `<main>` of the page built before the change is compared with the one built after it, ignoring `class` and `data-astro-cid-*` attributes and the visible update label
- **THEN** no difference is reported

#### Scenario: Screenshots

- **WHEN** QA captures `/seo-local-sevilla/` before and after at 375, 768 and 1280 px
- **THEN** the captures are identical except for justified antialiasing differences and the update label
