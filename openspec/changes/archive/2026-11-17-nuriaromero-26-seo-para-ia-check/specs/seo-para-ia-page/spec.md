## ADDED Requirements

### Requirement: A build check guards the page contract

The SEO checks run by CI SHALL include a check of the built `/seo-para-ia/` page that fails, listing every failure, when the page does not have exactly one H1 containing "SEO para IA", a canonical equal to `https://nuriaromero.dev/seo-para-ia/`, JSON-LD with Service, FAQPage and BreadcrumbList and a Service without `offers`, "consultor" only in the single home link, no promise wording, its URL in the sitemap and its entry in `llms.txt`.

#### Scenario: Built page passes

- **WHEN** the site is built and the SEO checks run
- **THEN** the page check exits 0 and prints a pass line

#### Scenario: Missing page fails

- **WHEN** the check runs against a build directory without `seo-para-ia/index.html`
- **THEN** it exits 1 and names the missing file

#### Scenario: Contract violations fail

- **WHEN** the page has two H1, an H1 without "SEO para IA", another canonical, no FAQPage, a Service with `offers`, a second "consultor", a promise phrase, no sitemap entry or no `llms.txt` entry
- **THEN** the check reports each of those failures and exits 1

#### Scenario: Run by CI

- **WHEN** `pnpm check:seo:dist` runs
- **THEN** it runs the page check in numeric order with the other checks, and `check:seo-21` and `check:seo-21:dist` exist
