## ADDED Requirements

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
