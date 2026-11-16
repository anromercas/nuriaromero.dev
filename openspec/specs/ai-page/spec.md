# ai-page Specification

## Purpose
Defines what `/inteligencia-artificial/` shows and guarantees on the template: the intent placement "IA para negocios en Sevilla" without terms owned by other pages, the section order of `/seo-local-sevilla/`, a short text budget, a sourced FAQ mirrored in FAQPage, honest chatbot and proof claims, and the published price as the only plan.

## Requirements

### Requirement: The page keeps its intent placement

`/inteligencia-artificial/` SHALL keep the title, the meta description and the single H1 of its intent row ("IA para negocios en Sevilla", "chatbots que atienden clientes", "Inteligencia artificial aplicada a tu negocio") and the process and pricing keyword headings ("Así es el proceso de implantar IA en tu negocio", "Cuánto cuesta implementar IA en tu negocio"), and MUST NOT use a term owned by another page, nor "posicionamiento en IA" or "GEO", in the title, H1 or any H2.

#### Scenario: Intent signals kept

- **WHEN** the page is built
- **THEN** the title, description, only H1 and the process and pricing H2 contain their intent signals unchanged

#### Scenario: No term of another owner in headings

- **WHEN** the keyword ownership check runs on the built page
- **THEN** no title, H1 or H2 of the page targets a term owned by another page, and no H2 contains "GEO" or "posicionamiento en IA"

### Requirement: The page follows the template section order

The page SHALL render, in this order: hero with a drawn chatbot conversation that hands off to a person, the booking button and a secondary link to the price; proof strip; bento of what AI can do in the business with one sentence per tile; process timeline; the comparison "¿IA a medida o ChatGPT tal cual?"; one plan; FAQ; related links; closing band and NAP; and no legacy block.

#### Scenario: Sections in reference order

- **WHEN** the built page `<main>` is read top to bottom
- **THEN** the sections appear in the order above, each opening with a sentence-case keyword heading followed by a display title with one serif accent phrase

#### Scenario: Legacy blocks removed

- **WHEN** the built page is inspected
- **THEN** it contains no legacy benefits grid, process list, pricing card, FAQ, CTA block, gray Tailwind card or glyph icon

### Requirement: The page stays within its text budget

The visible words in the page `<main>` SHALL be between 750 and 850, measured with the template page check method (live third-party content excluded).

#### Scenario: Word budget

- **WHEN** the template page check measures the built page
- **THEN** the visible word count of `<main>` is at least 750 and at most 850

### Requirement: The FAQ uses only sourced questions and matches FAQPage

The FAQ SHALL hold only questions from the story research, each answered directly in its first two sentences, and the FAQPage structured data MUST list the same questions in the same order. The FAQ MUST NOT repeat a question of `/automatizaciones/`.

#### Scenario: Only sourced questions

- **WHEN** the FAQ is read
- **THEN** it holds, in this order, the questions about the best AI for companies (also covering which AI companies use), the difference with ChatGPT, how to implement AI, what an AI agent for companies is, whether a chatbot can serve customers, and cost and timing

#### Scenario: FAQ equals FAQPage

- **WHEN** the template page check compares the visible FAQ with the FAQPage JSON-LD
- **THEN** both list the same questions in the same order

#### Scenario: No duplicate of the automation question

- **WHEN** the FAQ questions are compared, normalised, with the `/automatizaciones/` FAQ
- **THEN** none is equal to "¿Cuál es la mejor IA para automatizar procesos?"

### Requirement: Which AI to use is answered without naming a best brand

The answers about the best AI for companies and about ChatGPT SHALL give criteria to choose by use case and MUST NOT present any brand or model as "the best".

#### Scenario: Best AI answered with criteria

- **WHEN** the "best AI for companies" and the ChatGPT answers are read
- **THEN** they explain how to choose by use case and contain no claim that a named brand or model is the best

### Requirement: The chatbot answer stays honest

The answer about whether a chatbot can serve customers SHALL say that it answers with the business information, hands the conversation to a person when it does not know, and MUST NOT guarantee that every answer is correct.

#### Scenario: Handoff and no absolute guarantee

- **WHEN** the chatbot answer is read
- **THEN** it mentions the handoff to a person and contains no absolute guarantee of correct answers

### Requirement: Price and timing come from the published data

The cost and timing answer SHALL give the published starting price from site data ("desde 399 €") and the pilot time already published (one to two weeks, depending on the information to prepare), and the page MUST NOT show any other price, lead time or competitor figure. The only plan SHALL be built from the page pricing data and equal the single Service offer.

#### Scenario: Price answer from data

- **WHEN** the cost and timing question is read
- **THEN** its answer gives the published starting price from site data and the one-to-two-week pilot, and no other figure

#### Scenario: One plan, one offer

- **WHEN** the plans section and the Service JSON-LD are compared
- **THEN** there is exactly one plan, its price is the published starting price, and the Service has one Offer with the same amount

### Requirement: Proof and illustrations are honest

The proof strip SHALL show only the published experience figure and the live Google rating when it exists; the page MUST NOT show an AI project, client, metric or testimonial that is not published and verified; every drawing SHALL be captioned "Ejemplo ilustrativo" and carry no names, numbers or dates.

#### Scenario: Proof strip without reviews

- **WHEN** the site is built without Google reviews
- **THEN** the proof strip shows only the experience figure and no empty cell

#### Scenario: Illustrations are examples

- **WHEN** the hero and bento drawings are inspected
- **THEN** each is marked "Ejemplo ilustrativo" or sits under that caption and contains no names, digits or dates

### Requirement: Internal links stay coherent

The related links SHALL keep the reciprocal link to `/automatizaciones/` and the link to `/desarrollo-software-medida/` with their registered anchors, and SHALL add a contextual link to the GEO guide before the conversion link.

#### Scenario: Related links

- **WHEN** the related links of the built page are read
- **THEN** they include `/automatizaciones/` ("automatizaciones conectadas con tu negocio"), `/desarrollo-software-medida/` ("desarrollo de software a medida para empresas") and `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/`, with trailing slashes
