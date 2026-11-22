# seo-local-page Specification

## Purpose

Defines the FAQ of `/seo-local-sevilla/`: it answers what local SEO is, what it costs (prices read from the single pricing source in `seoLocal.pricing`) and how the Google Business Profile fits each plan, with direct answers and no promised result.

## Requirements

### Requirement: The local SEO FAQ defines local SEO first

`seoLocal.faqs` in `src/data/services.ts` SHALL open with the entry "¿Qué es el SEO local?", answered "Es el trabajo para que tu negocio aparezca en Google y en Google Maps cuando alguien cerca de ti busca lo que ofreces. Incluye tu ficha de Google, tus reseñas y, según el plan, tu web."

#### Scenario: New entries in place

- **WHEN** the questions of `seoLocal.faqs` are listed in order
- **THEN** there are 11, the first is "¿Qué es el SEO local?" and "¿Cuánto cuesta el SEO local?" comes immediately after "¿Qué diferencia hay entre Local y Local Pro?", with the other 9 existing questions unchanged and in their current relative order

### Requirement: The local SEO FAQ states the price from the pricing source

`seoLocal.faqs` SHALL contain "¿Cuánto cuesta el SEO local?" right after "¿Qué diferencia hay entre Local y Local Pro?", answered `El plan Local cuesta ${tierFrom(seoLocal, "Local")} y el Local Pro, ${tierFrom(seoLocal, "Local Pro")}. Se facturan mes a mes y no hay cuota de puesta en marcha aparte.` Both prices SHALL be read from `seoLocal.pricing.tiers` when the answer is read, never written as literals.

#### Scenario: Price answer renders the plan prices

- **WHEN** the answer of "¿Cuánto cuesta el SEO local?" is read
- **THEN** it equals "El plan Local cuesta 300 €/mes + IVA y el Local Pro, 500 €/mes + IVA. Se facturan mes a mes y no hay cuota de puesta en marcha aparte."

#### Scenario: Price answer stops reading the pricing source

- **WHEN** the `from` of the "Local" tier of `seoLocal.pricing` is changed in a test and the answer of "¿Cuánto cuesta el SEO local?" is read again
- **THEN** the answer contains the changed value; and if the answer is rewritten with a typed price instead of `tierFrom(seoLocal, ...)`, `tests/seo-local-faq.test.js` fails

#### Scenario: Structured data and AI files stay equal to the visible FAQ

- **WHEN** the site is built and `pnpm check:seo:dist` and `node --test tests/*.test.js` run
- **THEN** the FAQPage JSON-LD of `/seo-local-sevilla/` and its page in `/ai/faq.json` list the same 11 questions and answers as the visible FAQ, and `check-seo-16` matches the regenerated baseline fixture

### Requirement: The Google Maps entry explains the Google Business Profile and the plans

The answer of "¿Cómo puede aparecer mi negocio en Google Maps?" SHALL keep its first sentence, SHALL add, as its second sentence, "Esa ficha es la base del SEO local: el plan Local la mantiene al día y Local Pro suma el trabajo en la web.", and SHALL keep its closing sentence on distance and the first position. It SHALL contain no digit.

#### Scenario: Merged L8 sentence

- **WHEN** the answer of "¿Cómo puede aparecer mi negocio en Google Maps?" is read
- **THEN** it starts with "Con una ficha de Google Business Profile completa y coherente", contains "Esa ficha es la base del SEO local: el plan Local la mantiene al día y Local Pro suma el trabajo en la web." and contains no digit

### Requirement: Local SEO FAQ answers lead with the answer and promise nothing

Every answer of `seoLocal.faqs` added or changed by this requirement set SHALL open with a sentence that directly answers its question and SHALL NOT promise a position, a result, a timeline or a citation by an AI assistant.

#### Scenario: No promises in the new answers

- **WHEN** the answers of "¿Qué es el SEO local?", "¿Cuánto cuesta el SEO local?" and "¿Cómo puede aparecer mi negocio en Google Maps?" are scanned
- **THEN** none matches a promise of a guaranteed result, a first or top position, a timeline in days, weeks or months, or a recommendation or citation by ChatGPT or an AI assistant
