# site-navigation Specification

## Purpose
Defines what the shared header menu and footer navigation list on every page: the in-focus services grouped in the "Servicios" menu, the sector pages in the footer "Por sector" column, and the guarantee that pages outside the menu keep contextual internal links from their parent service. The classification lives once in the site data and both components render it.

## Requirements

### Requirement: The services menu lists only services, in two headed groups

The header "Servicios" menu, on desktop and on mobile, SHALL list only the seven service pages, in two groups with a visible heading each, in this order: "Visibilidad" (SEO local en Sevilla, SEO para IA) and "Webs y desarrollo" (Diseño web en Sevilla, Tienda online en Sevilla, Software a medida, Automatizaciones, Inteligencia artificial). It MUST NOT contain any sector page (the four niche web pages and the clínicas capilares page).

#### Scenario: Desktop dropdown shows two groups of services

- **WHEN** a visitor opens the "Servicios" dropdown on a desktop viewport of any page
- **THEN** it shows the heading "Visibilidad" followed by `/seo-local-sevilla/` and `/seo-para-ia/`, then the heading "Webs y desarrollo" followed by `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/desarrollo-software-medida/`, `/automatizaciones/` and `/inteligencia-artificial/`
- **AND** no link to `/web-para-restaurantes-sevilla/`, `/web-para-clinicas-sevilla/`, `/web-para-comercios-sevilla/`, `/web-para-abogados-gestorias-sevilla/` or `/seo-para-clinicas-capilares-sevilla/` appears in the dropdown

#### Scenario: Mobile accordion shows the same groups

- **WHEN** a visitor opens the mobile menu at 375 px and expands "Servicios"
- **THEN** the same two headings and seven service links appear in the same order
- **AND** no sector page link appears in the accordion

#### Scenario: SEO para IA is in Visibilidad

- **WHEN** the menu is rendered
- **THEN** `/seo-para-ia/` appears in the "Visibilidad" group, right after `/seo-local-sevilla/`

### Requirement: Navigation classification lives in site data

The grouping of services and the list of sector pages SHALL be defined once in the site data under `src/data`, and the header and footer SHALL be built from it. Every page rendered from the service or niche data SHALL be classified exactly once, either as a menu service or as a sector page.

#### Scenario: Every service-template page is classified once

- **WHEN** the navigation data is compared with all service and niche page data
- **THEN** each page appears in exactly one of the menu groups or the sector list, and none is missing

#### Scenario: Components hold no page lists

- **WHEN** the header and footer source is inspected
- **THEN** neither builds its service or sector lists by combining the service and niche arrays itself; both read the navigation data

### Requirement: The footer lists sector pages under "Por sector"

The footer SHALL show a column headed "Por sector" listing the five sector pages: "Web para restaurantes", "Web para clínicas", "Web para comercios", "Web para despachos y gestorías" and "SEO para clínicas capilares en Sevilla", each linking to its page with a trailing slash. The heading "Webs por sector" MUST NOT appear. The footer "Servicios" column SHALL list the seven menu services and no sector page.

#### Scenario: Footer on any page

- **WHEN** any page is rendered
- **THEN** its footer has a "Por sector" column with the five sector links, and a "Servicios" column with the seven services
- **AND** the text "Webs por sector" is absent

### Requirement: Sector pages keep a contextual link from their parent service

Every sector page SHALL receive at least one contextual internal link from the main content of a parent service page in the menu: each niche web page from `/diseno-web-sevilla/`, and `/seo-para-clinicas-capilares-sevilla/` from `/seo-local-sevilla/`.

#### Scenario: Parent services link their sector pages

- **WHEN** the internal-link map is read
- **THEN** `/diseno-web-sevilla/` has a contextual link to each of the four niche web pages and `/seo-local-sevilla/` has a contextual link to `/seo-para-clinicas-capilares-sevilla/`

#### Scenario: The links are rendered

- **WHEN** the site is built
- **THEN** the built `/diseno-web-sevilla/` and `/seo-local-sevilla/` pages contain those links inside `<main>`

### Requirement: The Servicios menu keeps its active state and accessibility

The "Servicios" menu item SHALL be marked current (`aria-current="page"` and the active colour) on every page listed in the menu, and only there. Group headings MUST NOT be links, buttons or focusable, and MUST NOT be HTML heading elements; each group's list SHALL be labelled by its heading. Every menu link SHALL stay reachable with the keyboard, and every mobile menu link and control SHALL keep a touch target of at least 44 px.

#### Scenario: Active state on a service page

- **WHEN** a visitor is on `/seo-para-ia/` or any other menu service page
- **THEN** the "Servicios" item is marked current on desktop and mobile

#### Scenario: No active state on a sector page

- **WHEN** a visitor is on `/web-para-clinicas-sevilla/`
- **THEN** the "Servicios" item is not marked current

#### Scenario: Keyboard and touch

- **WHEN** a keyboard user tabs through the desktop header
- **THEN** focus enters the dropdown and visits each of the seven service links in order, never a group heading
- **AND** on mobile each service link and the accordion button measure at least 44 px high
