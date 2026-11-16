# contact-page Specification

## Purpose
Defines what the contact page `/contacto/` shows and guarantees: a direct answer on how and when to contact, the booking call as the main action with the form as the alternative, a short sourced FAQ that links to the owner pages and matches FAQPage, the NAP, and an unchanged contact form behaviour.

## Requirements

### Requirement: The page answers how and when to contact first

`/contacto/` SHALL open with a single H1 and, within its first two sentences, state how to get in touch (booking a call, or the form) and when to expect a reply, using only facts already published on the site.

#### Scenario: Direct answer in the hero

- **WHEN** the built page is read from the top of `<main>`
- **THEN** there is exactly one H1 and the first two sentences after it say how to contact and when the reply comes

### Requirement: Booking is the main action and the form the alternative

The hero SHALL present the booking button as the primary action and the existing contact form as the alternative in the same first screen on desktop.

#### Scenario: Hero actions

- **WHEN** the hero renders at 1280 px
- **THEN** the booking button is in the copy column and the contact form is in the visual column of the hero

### Requirement: The contact form behaviour does not change

The contact form SHALL keep its markup, fields, names, ids, required flags, consent text, privacy link, honeypot and Formspree submission; only its styling MAY change.

#### Scenario: Markup identical except classes

- **WHEN** the form component source is compared with its pre-change baseline ignoring class attributes
- **THEN** no difference is reported

#### Scenario: Submission states still work

- **WHEN** a visitor submits the form with valid data, with invalid data, and with the network failing
- **THEN** the success state (with the review invite), the validation errors and the error message appear exactly as before

### Requirement: The FAQ is short, sourced and links to the owner pages

The page SHALL show 3 or 4 questions taken from the cross-SERP research in NRD-171 (price of SEO, price of a website, lead time, freelance or agency), answered with the direct answer in the first two sentences, using only prices and lead times already published in site data, each answer linking to the page that owns the topic.

#### Scenario: SEO price answer

- **WHEN** the question about what SEO costs per month is shown
- **THEN** the answer states the published Plan Local and Local Pro prices with VAT not included and links to `/seo-local-sevilla/`

#### Scenario: Website price answer

- **WHEN** the question about what a website costs is shown
- **THEN** the answer states the published "desde 149 €" and "desde 399 €" prices and links to `/diseno-web-sevilla/` and `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/`

#### Scenario: No new or competitor figures

- **WHEN** the visible text is checked
- **THEN** it contains no price, range or lead time that is not already published in site data and no competitor figure

### Requirement: Structured data matches the visible page

The page SHALL emit a BreadcrumbList for Inicio and Contacto and a FAQPage listing exactly the visible questions in order, and MUST NOT emit a Service entity.

#### Scenario: FAQ equals FAQPage and no Service

- **WHEN** the template page check runs on the built page
- **THEN** the visible questions equal the FAQPage questions and no Service entity is present

### Requirement: The page shows the NAP and stays short

The page SHALL show the published business name, address, phone and a Google Maps link, keep the email and LinkedIn contact routes, use no term owned by another page in its title, H1 or H2, and keep at most 450 visible words in `<main>`.

#### Scenario: Word budget

- **WHEN** the template page check measures the built page
- **THEN** the visible word count of `<main>` is at most 450

#### Scenario: NAP present

- **WHEN** the NAP block renders
- **THEN** it shows the name, address and phone from site data and a link to Google Maps that opens in a new tab
