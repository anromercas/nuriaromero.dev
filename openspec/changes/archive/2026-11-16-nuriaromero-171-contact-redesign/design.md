# Design

## Context

See proposal.md (Why). Current state on `develop` (d2ea153):

- `src/pages/contacto.astro`: `Layout` with title "Contacto — Pide presupuesto para tu web en Sevilla" and its description, `Schema` with `breadcrumbSchema([{ Inicio, / }, { Contacto, /contacto/ }])`, `<main class="px-4 pt-24">`, `Breadcrumbs`, H1 "Hablemos de tu proyecto", a lead paragraph, a two-column grid with `ContactForm` (title "Escríbeme", description "Rellena el formulario y te respondo en menos de 24 horas laborables.") and a column with a booking card (`BookingButton`), phone, LinkedIn (`SITE.sameAs[0]`) and an address/email card (`SITE.address.full` linking to `SITE.mapsUrl`, `SITE.email`).
- `src/components/ContactForm.astro` (only used here): Tailwind-classed form `#contact-form` with honeypot `_gotcha`, name/email/phone/message fields, consent text and `/privacidad/` link, `#form-status`, `#submit-btn`, `#form-review-invite`; `src/scripts/contact-form.js` posts to Formspree and toggles `text-red-600` / `text-green-600` / `text-gray-300` on `#form-status`.
- Guards: `tests/google-calendar-reserva.test.js` (page uses `BookingButton`, no `whatsappUrl` / "Escríbeme por WhatsApp" / "Formulario de contacto" / "Pedir presupuesto exacto"), `tests/breadcrumb-trailing-slash.test.js` (breadcrumb URLs with trailing slash), `tests/trailing-slash-links.test.js` (privacy link in the form), `tests/google-review-link.test.js` (review invite markup in `ContactForm.astro`), `scripts/check-seo-02.mjs` (shared nav links to `/contacto/` with trailing slash), `scripts/check-seo-07.mjs` (keyword ownership).
- From NRD-163 (must be merged first): `SeoLocalHero` (`visual` slot), `SeoLocalFaq` (`FaqItem.links`), `SeoLocalNap`, `SectionHeading`, `src/styles/template.css` (`.template-ground`), `scripts/lib/template-pages.mjs`, `scripts/check-seo-17.mjs`, `scripts/lib/page-contract.mjs` (`normalizedMain`-style attribute stripping). If the merged API differs from `openspec/changes/nuriaromero-163-reusable-local-components/design.md`, the merged API wins and the developer notes it in the PR.

## Goals / Non-Goals

**Goals:**

- Contact page in the ink world, short, with booking first, the form intact, and a GEO FAQ that answers price, time and freelance-or-agency right before contact.

**Non-Goals:**

- Any change to what the form collects or where it sends it, new prices, new figures, Service JSON-LD, Header/Footer/BookingButton restyle.

## Decisions

**Approach.** The page stays on `Layout` (it is not a service page) with `<main class="template-ground px-4 pt-24">` and three sections inside `SectionContainer`s: hero, FAQ, NAP. The hero reuses `SeoLocalHero` with the form passed in its `visual` slot, so booking and form share the first screen; `SeoLocalHero` already renders `BookingButton`. FAQ copy lives in the page as a typed `FaqItem[]` that feeds both `SeoLocalFaq` and `faqSchema`; prices come only from `tierFrom(seoLocal, ...)` and `tierFrom(disenoWeb, ...)`. `ContactForm.astro` is restyled by changing class attributes only (Tailwind utilities or a scoped `<style>` using the template tokens); a committed fixture of its markup without class attributes, captured before the change, proves nothing else moved. `src/scripts/contact-form.js` is not touched: the status colours it toggles are remapped with Tailwind arbitrary variants in the class of `#form-status` (`[&.text-red-600]:text-[var(--status-error)]`), so neither the script nor the `<style>` block changes.

Alternatives considered: a separate form section below the hero (rejected: the story puts the form in the hero as the alternative to booking); adding a page-specific variant to `ContactForm` (rejected: the component has one consumer, so a direct restyle is simpler); `ServiceLayout variant="template"` with synthetic data (rejected: it would emit a Service, forbidden by GEO-4).

### Section map

| #   | Section     | Component                          | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --- | ----------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Breadcrumbs | `Breadcrumbs` (unchanged)          | Inicio > Contacto                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 2   | Hero        | `SeoLocalHero`                     | `keyword` = the H1 (sentence case, no term owned by another page; e.g. a "Contacto" heading in the owner's words), `title` with one accent phrase, `subtitle` = direct answer (book a 30-minute call, or write through the form and get a reply in under 24 working hours, both already published), `primaryCtaLabel` default booking label, no `secondaryLink` (or `#preguntas` if the UI spec asks), `<ContactForm slot="visual" title="Escríbeme" description="Rellena el formulario y te respondo en menos de 24 horas laborables." />` |
| 3   | FAQ         | `SeoLocalFaq`                      | keyword heading (h2, sentence case, no owned term), display title with one accent, `lede` one line, `faqs={contactFaqs}` (3-4 items), `ctaLabel` default                                                                                                                                                                                                                                                                                                                                                                                    |
| 4   | NAP         | `SeoLocalNap` + one page paragraph | `keyword` h2 without owned terms; after it, one line with `mailto:${SITE.email}` and LinkedIn `SITE.sameAs[0]` (`target="_blank" rel="noopener noreferrer"`), styled with template tokens                                                                                                                                                                                                                                                                                                                                                   |

### FAQ (GEO block, 3-4 items)

Sources: NRD-171 "Investigación" (cross-SERP questions). First two sentences answer; about 40-60 words each; `tú`.

1. "¿Cuánto cobra un SEO al mes?": `tierFrom(seoLocal, "Local")` and `tierFrom(seoLocal, "Local Pro")` (both include "+ IVA"); `links: [{ label: "Planes de SEO local", href: "/seo-local-sevilla/" }]`.
2. "¿Cuánto cuesta hacer una página web?": `tierFrom(disenoWeb, "Landing de una página")` and `tierFrom(disenoWeb, "Web completa (hasta 5 páginas)")`, "desde", fixed price agreed in writing; `links: [{ label: "Diseño web en Sevilla", href: "/diseno-web-sevilla/" }, { label: "Guía para entender el precio de una web", href: "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/" }]`. No new price copy (S-2026-11-13-1).
3. "¿Cuánto se tarda?": only what is already published (a website usually takes 2 to 4 weeks from having the content; the reply to a message comes in under 24 working hours); link to `/diseno-web-sevilla/`.
4. "¿Freelance o agencia?" (optional, drop if the budget is tight): you talk directly to the person who does the work; `links: [{ label: "Agencia o consultora", href: "/seo-local-sevilla/#agencia-o-consultora" }]`.

### Files

All in layer `app`.

Create:

- `tests/contact-template.test.js` (app).
- `tests/fixtures/contact-form.markup.txt` (app): `src/components/ContactForm.astro` with every `class="..."` and `class:list={...}` attribute removed and whitespace collapsed, captured from `develop` before the restyle.

Modify:

- `src/components/ContactForm.astro` (app): class attribute values only; its existing `<style>` block stays byte-identical (the baseline fixture strips only class attributes, so any other change fails it).
- `DESIGN.md` (shared path, app) and `src/styles/template.css` (app): register two status tokens, `status-error: "#fca5a5"` and `status-success: "#86efac"` (front matter colours plus a one-line "Status" note under Colors: form feedback text only, never decoration), and the matching `--status-error` / `--status-success` custom properties (task 1.1).
- `src/pages/contacto.astro` (app): sections as above, imports `SeoLocalHero`, `SeoLocalFaq`, `SeoLocalNap`, `ContactForm`, `Breadcrumbs`, `SectionContainer`, `faqSchema`, `breadcrumbSchema`, `tierFrom`, `seoLocal`, `disenoWeb`, `SITE`; drops `MailIcon`, `LinkedInIcon` glyph icons and the old cards.
- `scripts/lib/template-pages.mjs` (app): `{ route: "/contacto/", words: [150, 450], service: false }`.

Unchanged and must stay green: `src/scripts/contact-form.js`, `tests/google-calendar-reserva.test.js`, `tests/breadcrumb-trailing-slash.test.js`, `tests/trailing-slash-links.test.js`, `tests/google-review-link.test.js`, `scripts/check-seo-02.mjs`, `scripts/check-seo-07.mjs`, `/privacidad/`, `/cookies/`, `public/_headers`.

### Interfaces

No new interface. Page-local `const contactFaqs: FaqItem[]` (type from `@/components/seo-local/types`). The fixture helper in the test strips `\s(class|class:list)=(\{[^}]*\}|"[^"]*")` and collapses whitespace.

### Data

None. Prices via `tierFrom` from `src/data/services.ts`; NAP and contact routes from `src/data/site.ts`.

### Test plan (TDD order)

1. Task 1.1: first capture `tests/fixtures/contact-form.markup.txt` from the unchanged component and add the test "ContactForm markup equals the baseline without classes" plus explicit assertions (field `name`s `name`, `email`, `phone`, `message`, `_gotcha`; `required` flags; consent text; `/privacidad/` link; ids `contact-form`, `form-status`, `submit-btn`, `form-review-invite`); green before the restyle, it must stay green after. Then restyle. Scenario: "Markup identical except classes".
2. Task 1.2: first add `/contacto/` to `templatePages` (its FAQ check passes trivially while the page has no FAQ, 0 = 0, so the RED evidence is the node test) and write `tests/contact-template.test.js` asserting that `contactFaqs` has 3-4 items, `faqSchema(contactFaqs)` and `faqs={contactFaqs}` are both present, `<main` has `template-ground`, `SeoLocalHero` receives `ContactForm` in `slot="visual"`, `BookingButton` stays reachable through `SeoLocalHero`, no `serviceSchema`, prices only through `tierFrom(`, no "€" literal in the page, links to `/seo-local-sevilla/`, `/diseno-web-sevilla/` and the guide, `mailto:` and LinkedIn present). Then implement. Scenarios: "Direct answer in the hero", "Hero actions", "SEO price answer", "Website price answer", "No new or competitor figures", "FAQ equals FAQPage and no Service", "Word budget", "NAP present".
3. Every task: `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green.

### Real-browser / e2e checks (QA)

- Form states on the dev server: empty submit shows validation errors; valid submit to Formspree shows the success state and the review invite; offline/blocked request shows the error message. The submit button disables while sending. (Use a test message clearly marked as QA; it reaches the owner's Formspree inbox.)
- Contrast of labels, inputs, placeholder, consent text, status messages and focus rings on the ink card: WCAG 2.2 AA.
- Keyboard: tab through booking button, every field, consent link, submit, FAQ summaries, Maps, email and LinkedIn links; visible 2 px focus.
- 375 px: hero stacks (copy, then form), no horizontal overflow; consent banner does not hide the submit button.
- Mobile menu and floating WhatsApp button still work.

### ADRs relied on

0004, 0006, 0007 (Formspree contact form, consent, CSP), 0008, 0012, 0014.

### Answers to the UI spec open questions

- **Status colours:** register tokens rather than accept drift. `status-error` (`#fca5a5`) and `status-success` (`#86efac`) go into the `DESIGN.md` front matter and `src/styles/template.css` in task 1.1 of this story (the first consumer); the NRD-163 token test (every `DESIGN.md` colour defined in `template.css`) covers both. Values unchanged from the UI spec, contrast about 10:1 and 13:1 on `card-surface`.
- **Fixture and `<style>`: confirmed.** The fixture strips only `class` attributes, so the restyle is done only through class values (including arbitrary variants); the existing `<style>` block, markup, text and attributes stay byte-identical.
- **Vertically centred hero copy: accepted.** `SeoLocalHero` centres its columns (`align-items: center`, as on the reference page); top alignment would need a new hero prop, a shared component change outside this story. If the owner wants it, it is a follow-up for the template, not a blocker.

## Risks / Trade-offs

- [Restyling the form accidentally changes behaviour (an attribute or the consent text)] → baseline fixture without classes plus explicit field assertions; `compliance-privacy` review.
- [Status colours toggled by the script lose contrast on ink] → scoped overrides in the component, script untouched.
- [450-word cap vs. 4 FAQ answers] → drop question 4 first.
- [Form in the hero visual column on mobile pushes the FAQ far down] → expected; the booking CTA stays first; the UI spec decides spacing.
- [NRD-163 API differs from its design] → merged API wins; deviations noted in the PR.
- Size: 2 points fits two work units.

## UI spec

Visual authority: `DESIGN.md` (ink world, "The Annotated Storefront") and the NRD-163 components. Mode: Persuade, but the job is a task: the visitor already decided to get in touch and needs the fastest route (call) or the alternative (form), with price and time doubts answered on the way. No new palette, type scale or component. Colour names below are `DESIGN.md` tokens, written as `var(--token)` from `src/styles/template.css` (use the merged names if they differ) or the Tailwind palette class with exactly the same value: `sky-signal` = `sky-400`, `sky-accent` = `sky-300`, `hairline` = `slate-700`, `drawing-soft` = `slate-600`, `text-body` = `slate-200`, `text-secondary` = `slate-300`, `text-muted` = `slate-400`. `card-surface` (`#080f20`) and `ink-ground` (`#050a18`) have no palette equal: use `bg-[var(--card-surface)]` / `bg-[var(--ink-ground)]`.

### Page frame (`src/pages/contacto.astro`)

- `<main class="template-ground px-4 pt-24 pb-24">` with one wrapper `div.space-y-24` (the 6rem `section-gap`, as `ServiceLayout` does) holding three `SectionContainer`s (`src/components/SectionContainer.astro`), in this order: (1) `Breadcrumbs` + `SeoLocalHero`, (2) `SeoLocalFaq` with `id="preguntas"`, (3) `SeoLocalNap` + the contact-routes paragraph. No `.band`, no closing band, no proof, bento, process or plans.
- Reading order: H1 keyword, display title, two-sentence answer, booking button, secondary link, then the form card; then the FAQ intro and its list; then NAP. The booking button is the primary action and the only filled control on the page besides the FAQ intro's own booking button.
- `Breadcrumbs` stays unchanged (old-world colours are accepted drift, see `DESIGN.md` Known Drift).

### Hero (`SeoLocalHero`, `src/components/seo-local/SeoLocalHero.astro`)

Props and exact copy:

- `keyword` (the H1): "Contacto". Assumption: short, sentence case, no owned term, matches the breadcrumb.
- `title`: `{ text: "Hablemos de tu proyecto", accent: "tu proyecto" }` (today's H1 copy, one serif phrase).
- `subtitle`: "Reserva una llamada de 30 minutos o escríbeme en el formulario. Te respondo en menos de 24 horas laborables, sin compromiso." Assumption: GEO-1 answer built only from published facts ("30 minutos · Sin compromiso" in `SeoLocalClosing`/`CTASection`, "menos de 24 horas laborables" in today's form description).
- `primaryCtaLabel`: not passed (BookingButton default "Reserva una primera sesión", which shortens below 370 px as today).
- `secondaryLink`: `{ label: "Ver precios y plazos", href: "#preguntas" }`. Assumption: on mobile the form card sits between the hero copy and the FAQ, so visitors whose doubt is price can jump past it.
- `visual` slot: `<ContactForm slot="visual" title="Escríbeme" description="Rellena el formulario y te respondo en menos de 24 horas laborables." />` (unchanged props; `title` is ignored by the component today and stays so).

Layout: the hero's own grid (stacked below 768 px; 1.05fr / 0.95fr from 768 px). The sky halo of `.hero-visual::before` sits behind the form card; the card is opaque, so the halo only shows around its edges. The copy column vertically centred against the taller form is accepted (component behaviour, not changed here).

### Contact form card (`src/components/ContactForm.astro`, class attributes only)

Every change below is a `class` value; markup, attributes, text, ids, the honeypot and the existing `<style>` block stay byte-identical (the error and success colour overrides use Tailwind arbitrary variants in `#form-status`'s class, so neither a `<style>` edit nor a `contact-form.js` edit is needed). Mapping by element:

| Element                                      | Classes (replace the current ones)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root `div`                                   | `w-full space-y-5 rounded-[1.25rem] border border-slate-700 bg-[var(--card-surface)] p-5 sm:p-6` (card: `card-surface`, `hairline`, `rounded.card`, `card-pad`; drops `max-w-2xl mx-auto`, the hero column sets the width)                                                                                                                                                                                                                                                                                                                      |
| Description wrapper `div`                    | `text-left`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Description `p`                              | `m-0 text-base leading-relaxed text-slate-300`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `form`                                       | `space-y-5`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Honeypot `div`                               | `hidden` (must stay `display: none`; never `sr-only`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Field labels                                 | `mb-1.5 block text-sm font-medium text-slate-200`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Required `*` spans                           | `text-slate-400` (Assumption: red is not in the ink palette; the asterisk keeps its meaning and `required` carries the semantics)                                                                                                                                                                                                                                                                                                                                                                                                               |
| Inputs and textarea                          | `w-full rounded-lg border border-slate-400/60 bg-[var(--ink-ground)] px-4 py-2.5 text-base text-white placeholder:text-slate-400 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-slate-400 focus:border-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400` (Assumption: `text-muted` at 60% gives the field edge about 3.4:1 against the ground for WCAG 1.4.11, plain `hairline` is about 1.9:1; `text-base` keeps 16 px+ so iOS does not zoom) |
| Email/phone grid                             | `grid grid-cols-1 gap-4` at every width (Assumption: the hero column is 320-470 px wide, too narrow for two fields side by side)                                                                                                                                                                                                                                                                                                                                                                                                                |
| Consent row                                  | `flex items-start gap-3`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Checkbox                                     | `mt-1 size-4 shrink-0 accent-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400`                                                                                                                                                                                                                                                                                                                                                                                                |
| Consent label                                | `text-sm leading-relaxed text-slate-300`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Privacy link                                 | `rounded-sm text-sky-300 underline decoration-sky-400/70 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400`                                                                                                                                                                                                                                                                                                                                        |
| Actions row (`div` around status and button) | `flex flex-col-reverse gap-3` (button on top, status message under it)                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `#form-status`                               | `text-sm text-gray-300 [&.text-red-600]:text-[var(--status-error)] [&.text-green-600]:text-[var(--status-success)]` (keep `text-gray-300` as the initial class: the script toggles it)                                                                                                                                                                                                                                                                                                                                                                                      |
| `#submit-btn`                                | `inline-flex w-full items-center justify-center rounded-full border border-sky-400 bg-transparent px-5 py-2.5 font-medium text-white transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-sky-400/10 hover:text-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-60`                                                                                                                                        |
| `#form-review-invite`                        | `text-sm leading-relaxed text-slate-300`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Review link                                  | same classes as the privacy link (keeps its `sr-only` child)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

Hierarchy decisions:

- Submit is an outlined pill (`sky-signal` 1px border, transparent fill), not a second filled blue button: the booking pill stays the single filled control and the visual primary of the first screen. Assumption: a composition of the pill shape and the `sky-signal` hover border of the related-link pills, not a new component.
- Status under a full-width button: the message appears where the eye is after clicking, and long Formspree errors wrap without squeezing the button. Visual order differs from DOM order only for the non-focusable status paragraph (it is `aria-live`), so focus order is unaffected. Assumption.
- Error `red-300` (`#fca5a5`, about 10:1 on `card-surface`) and success `green-300` (`#86efac`, about 13:1) replace `red-600` (about 4:1, fails AA) and `green-600`. Tech Lead decision: registered as `status-error` / `status-success` tokens in `DESIGN.md` and `src/styles/template.css` in this story (task 1.1), with these same values, so the ink world keeps one source of colours. The messages carry their own emoji and text, so colour is not the only signal.

States (all driven by the unchanged script):

- Idle: empty status; nothing shifts because the status sits under the button.
- Invalid submit: native `reportValidity` bubble on the first invalid field plus "Por favor, completa los campos requeridos." in `status-error` under the button.
- Sending: button text "Enviando…", disabled at 60% opacity with a `not-allowed` cursor.
- Success: "✅ ¡Mensaje enviado correctamente! Te responderé en breve." in `status-success`, form cleared, review invite shown when the GBP is verified.
- Server error: "❌ Error {status} · {detail}" in `status-error`, wrapping over several lines inside the card.
- Network error: "⚠️ Error de conexión. Inténtalo de nuevo en unos minutos." in `status-error`.
- Empty, partial or loading page data: n/a (static build; prices resolve at build time through `tierFrom`, which fails the build if a tier is missing).

### FAQ (`SeoLocalFaq`, `src/components/seo-local/SeoLocalFaq.astro`)

- Wrapper: `SectionContainer id="preguntas"` (its `scroll-m-20` keeps the target clear of the fixed header).
- `headingId`: "contacto-faq-title". `keyword` (h2): "Preguntas antes de contactar". `title`: `{ text: "Precio, plazos y con quién hablas", accent: "con quién hablas" }`. `lede`: "Si tu duda no está aquí, la resolvemos en la llamada." (the published lede of the reference FAQ). `ctaLabel`: default. Assumption: headings in the owner's words, no owned term.
- Questions and answers (`contactFaqs`, `tú`; the first sentence is the bold lead the component splits out; `{...}` is the `tierFrom` value, never a literal):
  1. q "¿Cuánto cobra un SEO al mes?" a "El plan Local cuesta {tierFrom(seoLocal, "Local")} y el Local Pro, {tierFrom(seoLocal, "Local Pro")}. Los dos son mensuales y en la página de SEO local tienes lo que incluye cada uno." links `[{ label: "Planes de SEO local", href: "/seo-local-sevilla/" }]`.
  2. q "¿Cuánto cuesta hacer una página web?" a "Una landing de una página parte de {tierFrom(disenoWeb, "Landing de una página")} y una web completa de hasta 5 páginas, de {tierFrom(disenoWeb, "Web completa (hasta 5 páginas)")}. El precio queda cerrado y pactado por escrito antes de empezar." links as in the design (service page, then the guide).
  3. q "¿Cuánto se tarda?" a "Una web de negocio local suele estar lista en 2 a 4 semanas desde que tengo todos los contenidos. Si me escribes, te respondo en menos de 24 horas laborables, y el plazo exacto de tu proyecto se cierra en la propuesta." links `[{ label: "Diseño web en Sevilla", href: "/diseno-web-sevilla/" }]`.
  4. q "¿Mejor un freelance o una agencia?" a "Conmigo hablas directamente con quien hace el trabajo, sin nadie en medio. Una agencia tiene más manos para llevar a la vez campañas, redes y diseño, así que depende de lo que necesites." links `[{ label: "Agencia o consultora", href: "/seo-local-sevilla/#agencia-o-consultora" }]`.
     Assumption: all four answers reword copy already published in `src/data/services.ts` (diseño web FAQ and process step) and `SeoLocalAgencia`; no new figure. Drop item 4 first if the 450-word cap is hit.
- All accordions start closed (component default). Layout, sticky intro from 1024 px and the drawn indicator come from the component unchanged.

### NAP and contact routes (`SeoLocalNap`, `src/components/seo-local/SeoLocalNap.astro`)

- `headingId`: "contacto-nap-title". `keyword` (h2): "Datos de contacto". Assumption: neutral, no owned term.
- Right after the component, one paragraph in the same `SectionContainer`: "También puedes escribirme a {SITE.email} o encontrarme en LinkedIn. Trabajo con negocios de Sevilla y su área metropolitana, y en remoto para el resto de España." The email is `<a href="mailto:...">`; "LinkedIn" is `<a href={SITE.sameAs[0]} target="_blank" rel="noopener noreferrer">LinkedIn<span class="sr-only"> (se abre en una pestaña nueva)</span></a>`. Assumption: the second sentence is today's published coverage line, kept as local relevance in few words.
- Paragraph classes: `mt-4 max-w-[65ch] text-base leading-relaxed text-slate-300`; links use the same text-link classes as the privacy link. No glyph icons (`MailIcon`, `LinkedInIcon` go away).

### Responsive

- 320-767 px: everything single column. Hero: keyword, display, subtitle, actions (booking and "Ver precios y plazos" wrap onto two lines when needed), then the form card at full width (`p-5`). FAQ intro above the list. NAP stacked. No horizontal overflow; the halo stays clipped.
- 768-1023 px: hero in two columns; the form card fills the 0.95fr column (about 320 px), all fields stacked, full-width submit. FAQ still stacked.
- 1024 px and up: hero columns about 470 / 425 px inside `lg:max-w-4xl`; FAQ 0.8fr / 1.2fr with sticky intro.
- At 375 px the consent banner and the floating WhatsApp button must not cover the submit button (already in the QA real-browser checks).

### Interactions

- Hover: input border to `text-muted`; submit gets a 10% `sky-signal` tint and `sky-accent` text; text links turn white; booking pill and FAQ unchanged. All transitions 0.2s `cubic-bezier(0.16, 1, 0.3, 1)`; no entrance animation added (the existing `SectionContainer` reveal stays).
- Focus: 2px `sky-signal` outline with 2px offset on every field, the checkbox, links and the submit (the old blue rings go away).
- Validation timing: on submit only (script unchanged); no inline per-field validation.
- Optimistic updates, destructive actions, confirmations: n/a.

### Accessibility hand-off

- Focus order: breadcrumb "Inicio", booking button, "Ver precios y plazos", Nombre, Correo electrónico, Teléfono, Mensaje, privacy checkbox, privacy link, Enviar mensaje, (review link when shown), FAQ booking button, the four summaries (and links inside an open answer), phone, "Ver en Google Maps", email, LinkedIn.
- One H1 ("Contacto"); the h2s are the two keyword headings; display titles stay paragraphs.
- Results are announced by the existing `aria-live="polite"` status; nothing to add.
- The honeypot must stay `display: none` (class `hidden`); turning it into `sr-only` would expose it to screen readers.
- The form card has no visible heading (the component ignores `title`, and its markup cannot change in this story); the hero copy above names it.
