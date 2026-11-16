# Proposal

## Why

Tracker: [NRD-171](https://nuriaromerodev.atlassian.net/browse/NRD-171) (epic NRD-162). `/contacto/` is already short (about 151 visible words) but uses the old gray/blue Tailwind world. The owner wants it in the `/seo-local-sevilla/` visual world, and it is the right place to answer, just before contacting, the doubts that repeat across every SERP researched on 2026-11-16: price (SEO and web), lead time, and freelance or agency.

**Depends on NRD-163** (change `nuriaromero-163-reusable-local-components`): this change uses `SeoLocalHero` (with the `visual` slot), `SeoLocalFaq` (with `links`), `SeoLocalNap`, `src/styles/template.css` and `scripts/lib/template-pages.mjs`. Development starts only after NRD-163 is merged into `develop`; the branch is rebased on it first.

## What Changes

- `src/pages/contacto.astro` keeps `Layout`, the breadcrumbs and its title and meta description, and is recomposed on the ink ground: a short hero (single H1 keyword heading, display title with one serif accent phrase, a direct answer on how and when to contact in the first two sentences, the booking button as the main action) with the existing contact form as the alternative in the hero's visual column; a short two-column FAQ (3-4 questions) whose answers link to the owner pages; the NAP block. No proof, bento, process or plans.
- FAQ answers use only prices already published in `src/data` through `tierFrom()` (SEO plans from `seoLocal`, website prices from `disenoWeb`) and the lead time already published ("2 a 4 semanas" from the website FAQ); they link to `/seo-local-sevilla/` for SEO and to `/diseno-web-sevilla/` plus `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` for websites.
- JSON-LD: BreadcrumbList (unchanged) plus FAQPage built from the same FAQ array; no Service (GEO-4).
- `src/components/ContactForm.astro` changes style only (class attributes); markup, fields, names, ids, required flags, consent text, privacy link, honeypot and the Formspree submission in `src/scripts/contact-form.js` stay exactly as they are.
- `/contacto/` registered in `scripts/lib/template-pages.mjs` (`words: [150, 450]`, `service: false`).

## Capabilities

### New Capabilities

- `contact-page`: what `/contacto/` must show and guarantee (direct answer on how to contact, booking first and form as alternative, a short sourced FAQ mirrored in FAQPage that links to owner pages, NAP, no Service, unchanged form behaviour, text budget).

### Modified Capabilities

None (`page-template` from NRD-163 is consumed, not changed).

## Out of scope

- Any change to the form's fields, consent text, processor (Formspree), success/error states or `src/scripts/contact-form.js` (that would require updating `/privacidad/` in the same story and is a compliance change).
- New prices or price copy for websites while S-2026-11-13-1 is open; competitor figures from the research.
- Title and meta description wording (no owned term in them today; kept).
- Header, Footer, BookingButton, WhatsApp floating button.

## Impact

- Code: `src/pages/contacto.astro`, `src/components/ContactForm.astro` (classes only), `scripts/lib/template-pages.mjs`, tests, one fixture.
- Compliance: the `compliance-privacy` reviewer checks `ContactForm.astro` (style-only diff) and that nothing about data collection changed.
- No URL change, no new dependency, no CSP change, no price change. Not radical.
