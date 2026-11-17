# seo-para-ia-page Specification

## Purpose

Defines what `/seo-para-ia/` shows and guarantees on the template: a national "SEO para IA" placement without terms owned by the home or `/seo-local-sevilla/`, the section order with the editorial hero, a short text budget, a sourced FAQ mirrored in FAQPage, no promise that an AI recommends the business, the Local Pro price read from one source with no own Offer, honest "this site applies it" claims, one home link with the owner anchor, and a place in the menu, footer and 404.

## Requirements

### Requirement: The page has a national "SEO para IA" placement

`/seo-para-ia/` SHALL be an indexable service page whose title (at most 60 characters), meta description (140 to 160 characters) and single H1 contain "SEO para IA" and not "Sevilla", and whose title, H1 and section headings MUST NOT contain "consultor", "SEO local Sevilla" or any term registered to another page.

#### Scenario: Placement fields within limits

- **WHEN** the `seoParaIa` entry is read
- **THEN** its slug is `/seo-para-ia/`, its title has at most 60 characters, its description has 140 to 160 characters, and title, description and H1 contain "SEO para IA" and not "Sevilla"

#### Scenario: No term of the home or the local page

- **WHEN** the title, the H1 and the section headings of the page are read
- **THEN** none contains "consultor" or "SEO local Sevilla", and the keyword ownership check on the built site reports no violation for the page

#### Scenario: Indexable and in the sitemap

- **WHEN** the site is built
- **THEN** `dist/seo-para-ia/index.html` has exactly one `<h1>`, a self-referencing canonical with a trailing slash, and `dist/sitemap-0.xml` lists `https://nuriaromero.dev/seo-para-ia/`

### Requirement: The page follows the template with the editorial hero

The page SHALL be composed only of the template section components, in this order: editorial hero with a page drawing and proof strip; bento of six things worked on; process timeline; "Esta web aplica lo que te propongo"; one plan; FAQ; related links; closing band and NAP. The legacy service hero MUST NOT be used.

#### Scenario: Sections in reference order

- **WHEN** the built page `<main>` is read top to bottom
- **THEN** the sections appear in the order above, each opening with a sentence-case keyword heading followed by a display title with one accent phrase

#### Scenario: Editorial hero only

- **WHEN** the page source is inspected
- **THEN** it renders `SeoLocalHero` with a drawing in its `visual` slot and never `ServiceHero`, and the drawing is captioned "Ejemplo ilustrativo" and shows no brand logo, ranking, rating, figure or recommendation badge

### Requirement: The page stays within its text budget

The visible words in the page `<main>` SHALL be between 750 and 850, measured with the template page check method (live third-party content excluded).

#### Scenario: Word budget

- **WHEN** the template page check runs on the built site
- **THEN** `/seo-para-ia/` reports between 750 and 850 words and a Service entity in its JSON-LD

### Requirement: The FAQ is sourced, direct and mirrored in FAQPage

The page SHALL show six questions taken from real search data (People Also Ask, SERP or AI Overview topics, recorded with their source in the design), whose first sentence answers directly in at most 220 characters, and the FAQPage JSON-LD SHALL hold exactly the visible questions. The answer about recommendation by an AI SHALL say that nobody can promise that an assistant recommends or cites the business.

#### Scenario: FAQ equals FAQPage

- **WHEN** the built page is checked
- **THEN** the six visible FAQ questions equal the FAQPage questions in order

#### Scenario: Direct first sentence

- **WHEN** each FAQ answer is read
- **THEN** its first sentence has at most 220 characters

#### Scenario: Recommendation answered without a promise

- **WHEN** the FAQ answer to "¿Cómo hago que ChatGPT recomiende mi negocio?" is read
- **THEN** it states that no one can promise that an assistant recommends or cites the business, and then says what can be worked on

### Requirement: The copy makes no promise and invents no figure

No visible string of the page or of its data entry SHALL match `/garantiz|primeras posiciones|te sale en|te recomendar|asegur/i` except the negated statement of the recommendation answer, and the only figures SHALL be the published Local Pro price (read from data) and the published experience ("+10 años" / "más de 10 años"). The page MUST NOT contain `[PENDIENTE` or `[VERIFICAR` and MUST NOT publish any figure about its own visibility in AI assistants.

#### Scenario: No promise phrases

- **WHEN** the strings of `seoParaIa` and of the page are scanned with the promise pattern
- **THEN** there is no match outside the negated sentence of the recommendation answer

#### Scenario: Figure whitelist

- **WHEN** every digit run in the `seoParaIa` strings and the page copy is listed
- **THEN** each one is part of the Local Pro price or of the experience figure

### Requirement: The price is the Local Pro plan, read from one source, with no own Offer

The page SHALL state that "SEO para IA" is part of the Local Pro plan and show its price read from the Local Pro tier of the local SEO service data, with no price typed in the page or in the entry. The Service JSON-LD of the page MUST NOT contain `offers`, and the Service JSON-LD of every other service page SHALL stay unchanged.

#### Scenario: Price from the Local Pro tier

- **WHEN** `seoParaIa.pricing.from` and the plan card are read
- **THEN** both equal the Local Pro tier `from` of `seoLocal`, and neither `src/pages/seo-para-ia.astro` nor the `seoParaIa` source contains a "€" literal

#### Scenario: No own Offer

- **WHEN** the built page JSON-LD is parsed
- **THEN** the Service entity has no `offers` property, and the other service pages still emit their existing Offers

### Requirement: "This site applies it" states only real facts

The section "Esta web aplica lo que te propongo" SHALL cite only what the build really has: FAQ blocks with a direct answer first, structured data for business, service, FAQ and breadcrumbs, a public `llms.txt`, and robots rules that allow the crawlers it names. Every assistant or crawler named SHALL map to a user agent allowed in the robots policy of `astro.config.mjs`.

#### Scenario: Named crawlers are allowed

- **WHEN** the assistants named in the section are mapped to their crawler user agents
- **THEN** each user agent is allowed in the robots policy of `astro.config.mjs`

### Requirement: The page links to the home once, with the owner anchor

The page SHALL contain exactly one link to `/`, with the exact anchor "consultor SEO en Sevilla", and no other occurrence of "consultor".

#### Scenario: One home link

- **WHEN** the page source is scanned for `<a href="/">consultor SEO en Sevilla</a>`
- **THEN** there is exactly one match, and "consultor" appears nowhere else in the page source or in the `seoParaIa` strings

### Requirement: The page is in the menu, the footer and the 404

The service list that builds the header dropdown and the footer SHALL include `/seo-para-ia/` with the label "SEO para IA", and the in-focus service list that the 404 page links SHALL include it.

#### Scenario: Listed as an in-focus service

- **WHEN** `services` and `focusServices` are read
- **THEN** both contain the `/seo-para-ia/` entry right after `/seo-local-sevilla/`

### Requirement: Internal links reach the page without cannibalising the owners

The site SHALL link to `/seo-para-ia/` from the home, `/seo-local-sevilla/`, the GEO guide and `/inteligencia-artificial/`, and the page SHALL link to the GEO guide, `/seo-local-sevilla/`, `/sobre-mi/`, `/diseno-web-sevilla/` and `/contacto/`, with ADR 0013 table A rows 8 to 11 verbatim. No anchor MAY point a term owned by the home or `/seo-local-sevilla/` to another page.

#### Scenario: ADR rows 8 to 11 exist

- **WHEN** the link map is read
- **THEN** each of ADR 0013 table A rows 8 to 11 exists once with its exact anchor, as a contextual link placed before the conversion link of its source

#### Scenario: Owner anchors stay with their owners

- **WHEN** every row of the link map is scanned
- **THEN** "consultor SEO en Sevilla" only points to `/`, anchors to `/seo-local-sevilla/` contain neither "SEO para IA" nor "posicionamiento en IA", and anchors to `/seo-para-ia/` contain neither "consultor" nor "SEO local"

#### Scenario: One home link on the page

- **WHEN** `/seo-para-ia/` is built
- **THEN** its `<main>` contains exactly one link to `/` with the anchor "consultor SEO en Sevilla" (the byline link; the breadcrumb "Inicio" link is not counted) and no other anchor containing "consultor"

#### Scenario: Links render inside main

- **WHEN** the internal-link and reciprocal-link checks run on the built site
- **THEN** every new row and both new reciprocal pairs are found as links inside `<main>` of their source pages

### Requirement: The page is registered as the national GEO owner

The intent registry SHALL hold a row for `/seo-para-ia/` whose title, description, H1 and content signals are copied from the page, whose intent states national scope without Seville-qualified queries, and the keyword registry SHALL name `/seo-para-ia/` as the owner of "posicionamiento en ia" and "seo para ia", with both terms tracked for that page. The `/seo-local-sevilla/` intent row SHALL stay unchanged.

#### Scenario: Intent row matches the built page

- **WHEN** the intent check runs on the built site
- **THEN** the `/seo-para-ia/` row's signals are found in its title, description, H1 and visible text

#### Scenario: Ownership registered and respected

- **WHEN** the keyword registry is read and the ownership check runs on the built site
- **THEN** "posicionamiento en ia" and "seo para ia" are owned by `/seo-para-ia/`, both are tracked for it, and no other page targets them in its title, H1 or H2

#### Scenario: Local row unchanged

- **WHEN** the `/seo-local-sevilla/` intent row is compared with its previous value
- **THEN** it is identical

### Requirement: llms.txt lists the page honestly

`public/llms.txt` SHALL list `https://nuriaromero.dev/seo-para-ia/` under "## Servicios" in the same format as the other entries, with the label "SEO para IA", the statement that it is included in the Local Pro plan with the published Local Pro price, and a line saying that no mention or position is guaranteed; the entry MUST NOT contain "garantiza" or "posiciona primero".

#### Scenario: Entry present and honest

- **WHEN** `public/llms.txt` is read
- **THEN** the "## Servicios" section has one line linking `https://nuriaromero.dev/seo-para-ia/` that names Local Pro with its price equal to the Local Pro tier of the data, contains "Sin garantía", and matches neither "garantiza" nor "posiciona primero"
