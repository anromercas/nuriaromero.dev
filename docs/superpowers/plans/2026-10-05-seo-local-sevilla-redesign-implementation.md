# SEO Local Sevilla Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/seo-local-sevilla/` as the approved “Parte de visibilidad local” conversion page, with truthful Local and Local Pro plan data and a call-booking CTA.

**Architecture:** Keep `src/pages/seo-local-sevilla.astro` as the route-composition boundary and keep `ServiceLayout.astro` responsible for the common service-page shell, schema, pricing, FAQ, internal links, and final CTA. Put the audit-sheet-specific diagnostic/proof composition in a narrowly scoped `src/components/seo-local/` component, and retain all commercial facts in the `seoLocal` record. Make the smallest shared API extension necessary to render the required “Reservar una llamada” CTA while keeping every other service page’s existing booking text unchanged.

**Tech Stack:** Astro 4, TypeScript, Tailwind CSS, JSON-LD Schema.org, Node.js built-in test runner, `astro check` and Astro static build.

---

## Scope and non-negotiable business rules

- **Plan Local:** `300 €/mes + IVA` (taxes not included).
- **Plan Local Pro:** `500 €/mes + IVA`, marked **Recomendado**.
- There is **no** standalone initial project or setup fee, and no confirmed contractual minimum term. Do not write a suggested three-month minimum as a condition or contract term.
- The only primary conversion is **Reservar una llamada**, using the existing official `bookingUrl` through `BookingButton`.
- Address Seville local businesses generally, especially businesses where every client matters. Do not use clinic-only terms such as “pacientes” or “tratamientos”.
- Do not state or imply guaranteed rankings, traffic, leads, calls, conversions, or recommendations/citations from AI assistants.
- Do not invent testimonials, case-study outcomes, metrics, social proof, rankings, or competitor findings. The proof block must show a truthful description of deliverables/process instead.
- Keep the redesign route-local. Shared components may change only to support the required CTA label without altering the default output of other service pages.

## File map

| Path | Action | Responsibility |
| --- | --- | --- |
| `tests/seo-local-sevilla-redesign.test.js` | Create | Source-level regression tests for offer truth, CTA wording, route-local structure, semantic/a11y hooks, and prohibited claims. |
| `src/data/types.ts` | Modify | Add optional CTA-label fields to existing service-page data contracts; preserve defaults for all other service records. |
| `src/data/services.ts` | Modify | Make `seoLocal` the sole source of the approved prices, inclusions, safe copy, metadata, FAQ answers, and CTA labels. |
| `src/components/BookingButton.astro` | Modify | Accept an optional visible/accessible label while retaining “Reserva una primera sesión” as the default. |
| `src/components/services/ServiceHero.astro` | Modify | Forward a page-specific primary CTA label to `BookingButton`. |
| `src/components/services/PricingCard.astro` | Modify | Use the existing per-tier `ctaLabel` when rendering the booking CTA, keeping its current default otherwise. |
| `src/components/services/CTASection.astro` | Modify | Accept and forward an optional closing CTA label. |
| `src/layouts/ServiceLayout.astro` | Modify | Pass page-owned CTA labels to hero and closing CTA without changing the generic section order or schema ownership. |
| `src/components/seo-local/VisibilityAudit.astro` | Create | Page-local “Parte de visibilidad local” diagnostic, inspection and transparent proof modules. No shared abstraction. |
| `src/pages/seo-local-sevilla.astro` | Modify | Compose the redesigned sequence and route-local styling around `ServiceLayout`; remove retired clinical/comparison/case-study claims. |
| `scripts/check-seo-15.mjs` | Create | Inspect built `dist/seo-local-sevilla/index.html` and JSON-LD for commercial truth, required CTA, heading order and banned legacy/clinic/guarantee wording. |

Files deliberately not changed: `src/lib/schema.ts` continues to derive the Service offer from `page.pricing.from`; its existing implementation will emit the canonical `300` offer from `seoLocal`. `src/pages/seo-para-clinicas-capilares-sevilla.astro` and `capilarLocal` remain a separate niche surface and must not be “corrected” as part of this general-business page redesign.

## Verification commands

Use these exact commands from `/Users/nuria/Desktop/code/nuriaromerodev/portfolio-nuriaromerodev/nuriaromero.dev`:

```bash
node --test tests/seo-local-sevilla-redesign.test.js
npm run build
node scripts/check-seo-15.mjs
node --test tests/*.test.js
```

For visual verification, start the existing app only if it is not already running:

```bash
npm run dev -- --host 127.0.0.1
```

Inspect `http://127.0.0.1:4321/seo-local-sevilla/` at **1440×900** and **390×844**. Use keyboard-only navigation to reach the hero CTA, each plan CTA, FAQ summaries, and final CTA. If a development server selects another port, use the port printed by Astro rather than starting a second server.

### Task 1: Add failing commercial and route-contract tests

**Files:**
- Create: `tests/seo-local-sevilla-redesign.test.js`

- [ ] **Step 1: Write the failing source-level tests before changing production code**

Create `tests/seo-local-sevilla-redesign.test.js` with these assertions (use the repository’s `node:test`, `node:assert/strict`, and `node:fs/promises` style):

```js
import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

const legacyOrUnsafe = /299\s*€|199\s*€|349\s*€|proyecto inicial|mínimo de tres meses|permanencia obligatoria|pacientes|tratamientos/i
const positivePromise = /(?:garantizamos|garantiza(?:mos)? más|primeras posiciones|más (?:tráfico|leads|llamadas|contactos)|te recomienda(?:rá)? (?:Google|ChatGPT|un asistente))/i

test("seo local data exposes only the approved recurring offer", async () => {
  const services = await source("src/data/services.ts")
  const seoLocal = services.slice(services.indexOf("export const seoLocal"), services.indexOf("export const capilarLocal"))

  assert.match(seoLocal, /from:\s*"300 € \\+ IVA"/)
  assert.match(seoLocal, /name:\s*"Local"[\\s\\S]*?from:\s*"300 €\\/mes \\+ IVA"/)
  assert.match(seoLocal, /name:\s*"Local Pro"[\\s\\S]*?from:\s*"500 €\\/mes \\+ IVA"[\\s\\S]*?recommended:\s*true/)
  assert.doesNotMatch(seoLocal, /initial:\s*\{/)
  assert.doesNotMatch(seoLocal, legacyOrUnsafe)
  assert.doesNotMatch(seoLocal, positivePromise)
})

test("seo local composition is diagnostic-led and books a call", async () => {
  const [route, audit, services] = await Promise.all([
    source("src/pages/seo-local-sevilla.astro"),
    source("src/components/seo-local/VisibilityAudit.astro"),
    source("src/data/services.ts"),
  ])
  const seoLocal = services.slice(services.indexOf("export const seoLocal"), services.indexOf("export const capilarLocal"))

  assert.match(route, /<ServiceLayout page=\{seoLocal\}>/)
  assert.match(route, /<VisibilityAudit \/>/)
  assert.match(audit, /<section[\s\S]*?<h2/)
  assert.match(audit, /aria-labelledby=/)
  assert.match(audit, /<ul/)
  assert.match(audit, /Qué recibirás|Trabajo que podrás revisar/)
  assert.match(seoLocal, /primaryCtaLabel:\s*"Reservar una llamada"/)
  assert.match(seoLocal, /ctaLabel:\s*"Reservar una llamada"/)
})

test("booking button supports a page-specific call label without changing its safe default", async () => {
  const button = await source("src/components/BookingButton.astro")

  assert.match(button, /label\?:\s*string/)
  assert.match(button, /ariaLabel\?:\s*string/)
  assert.match(button, /label\s*=\s*"Reserva una primera sesión"/)
  assert.match(button, /ariaLabel\s*=\s*label/)
})
```

Do **not** weaken the banned-term regular expression to accommodate old copy. Its purpose is to force the approved general-business surface content.

- [ ] **Step 2: Run the test and observe RED**

Run:

```bash
node --test tests/seo-local-sevilla-redesign.test.js
```

Expected: FAIL. The current source has the old suggested-three-month wording, the old route does not import `VisibilityAudit`, and `BookingButton` has no custom-label contract yet. Record the actual failures in the task evidence.

- [ ] **Step 3: Commit the test-first checkpoint**

```bash
git add tests/seo-local-sevilla-redesign.test.js
git commit -m "test: define seo local redesign contract"
```

Expected: one conventional work-unit commit containing only the failing contract test. Do not add unrelated untracked `.impeccable/`, `.superpowers/`, or lead files.

### Task 2: Make service data and CTA plumbing truthful

**Files:**
- Modify: `src/data/types.ts`
- Modify: `src/data/services.ts`
- Modify: `src/components/BookingButton.astro`
- Modify: `src/components/services/ServiceHero.astro`
- Modify: `src/components/services/PricingCard.astro`
- Modify: `src/components/services/CTASection.astro`
- Modify: `src/layouts/ServiceLayout.astro`
- Test: `tests/seo-local-sevilla-redesign.test.js`

- [ ] **Step 1: Expand the data contracts minimally**

In `src/data/types.ts`, add optional labels only where they are consumed; do not add a new cross-site CTA model:

```ts
hero: {
  h1: string
  subtitle: string
  primaryCtaLabel?: string
  secondaryCta?: { label: string; href: string }
}
// ...
cta?: {
  title: string
  text: string
  buttonLabel?: string
}
```

The existing `pricing.tiers[].ctaLabel` remains the per-plan label source. Do not add `initial` to `seoLocal`; the legacy interface remains only for unrelated existing service pages.

- [ ] **Step 2: Update only the `seoLocal` record in `src/data/services.ts`**

Replace the entire `seoLocal` object with data that expresses the approved offer. Preserve the exported name and slug. Its required values are:

```ts
seo: {
  title: "SEO local en Sevilla | Planes desde 300 €/mes + IVA",
  description: "SEO local en Sevilla para negocios donde cada cliente cuenta: ficha de Google desde 300 €/mes + IVA o ficha y web desde 500 €/mes + IVA.",
},
hero: {
  h1: "Tu negocio está en Sevilla. La pregunta es si te encuentran cuando importa.",
  subtitle: "Reviso la ficha de Google y, si hace falta, la web para ordenar la información que ve quien busca tus servicios cerca. Sin promesas de posiciones: con trabajo claro y seguimiento.",
  primaryCtaLabel: "Reservar una llamada",
  secondaryCta: { label: "Ver qué se revisa", href: "#revision-local" },
},
sectionTitles: {
  benefits: "Qué se revisa para que tu presencia local tenga sentido",
  process: "Cómo trabajamos el SEO local",
  pricing: "Dos planes, con un alcance claro",
  faq: "Preguntas antes de empezar",
},
pricing: {
  from: "300 € + IVA",
  note: "Los dos planes se facturan mes a mes. No hay proyecto inicial independiente ni una permanencia contractual indicada en esta página.",
  tiers: [
    {
      name: "Local",
      from: "300 €/mes + IVA",
      ctaLabel: "Reservar una llamada",
      includes: [
        "Ficha de Google completa y ordenada",
        "Servicios, horarios y descripción actualizados",
        "Lenguaje alineado con las búsquedas locales relevantes",
        "Datos coherentes en guías y directorios",
        "Fotos y publicaciones nuevas cada mes",
        "Plan para solicitar opiniones auténticas",
        "Medición de llamadas, clics y rutas cuando estén disponibles",
        "Vídeo-informe mensual, próximos pasos y contacto directo por WhatsApp",
      ],
      note: "Para negocios que necesitan poner en orden y cuidar su ficha de Google.",
    },
    {
      name: "Local Pro",
      from: "500 €/mes + IVA",
      recommended: true,
      ctaLabel: "Reservar una llamada",
      includes: [
        "Todo lo incluido en Local",
        "Rediseño de la web y revisión completa con plan estratégico",
        "Web organizada por servicios y zonas cuando corresponda",
        "Corrección de errores que dificultan que Google interprete la web",
        "Títulos más claros para los resultados de búsqueda",
        "Páginas por servicio y zona cuando aporten valor",
        "Información estructurada para que buscadores y sistemas de IA entiendan el negocio",
        "Páginas conectadas entre sí de forma intencional",
      ],
      note: "Para negocios que necesitan trabajar ficha y web como un mismo sistema.",
    },
  ],
},
cta: {
  title: "Aclaremos qué está frenando tu presencia local",
  text: "En una llamada vemos si este servicio encaja con tu negocio y cuál sería el siguiente paso útil.",
  buttonLabel: "Reservar una llamada",
},
```

Write benefits, process and FAQs in the same plain-language, process-first register. Required FAQ subjects: fit for a general Seville business; Local vs. Local Pro; what happens in the call; what is measured and how it is reported; whether a website is needed; no standalone initial project; and no confirmed contractual minimum. The AI FAQ may say structured, clear information can help systems understand the business; it must explicitly say it does not promise a recommendation or citation. Do not reuse clinic-only terms, retired prices, an initial project, or “three months”.

- [ ] **Step 3: Add label defaults and forward the route-specific label**

In `src/components/BookingButton.astro`, use this API while preserving the existing responsive span behavior for the default copy:

```astro
interface Props {
  class?: string
  label?: string
  ariaLabel?: string
}

const {
  class: className,
  label = "Reserva una primera sesión",
  ariaLabel = label,
} = Astro.props
```

Render `{label}` inside the link and use `aria-label={ariaLabel}`. Keep the `<CalendarIcon aria-hidden="true" />`, `target="_blank"`, and `rel="noopener noreferrer"` unchanged. Because the existing “primera” span is specific to the default phrase, render it only when `label === "Reserva una primera sesión"`; for any override render `{label}` as one text node.

Add `primaryCtaLabel?: string` to `ServiceHero` props and render `<BookingButton label={primaryCtaLabel} />`. Add `buttonLabel?: string` to `CTASection` props and render `<BookingButton label={buttonLabel} />`. In `PricingCard`, render `<BookingButton label={tier.ctaLabel} />` for each tier and retain `<BookingButton />` in paths where no label exists. In `ServiceLayout`, pass `page.hero.primaryCtaLabel` to `ServiceHero` and `page.cta?.buttonLabel` to `CTASection`.

- [ ] **Step 4: Run the focused contract test and observe GREEN**

Run:

```bash
node --test tests/seo-local-sevilla-redesign.test.js
```

Expected: the data/CTA plumbing assertions pass, except the route-local component assertion can remain failing until Task 3. If it fails for any other reason, fix the production code rather than loosening the test.

- [ ] **Step 5: Run static checking and commit the data/plumbing work unit**

Run:

```bash
npx astro check
```

Expected: exit 0 with no type errors.

Then commit only this task’s files:

```bash
git add src/data/types.ts src/data/services.ts src/components/BookingButton.astro src/components/services/ServiceHero.astro src/components/services/PricingCard.astro src/components/services/CTASection.astro src/layouts/ServiceLayout.astro
git commit -m "feat: align seo local offer and call CTAs"
```

### Task 3: Build the route-local diagnostic surface and compose the route

**Files:**
- Create: `src/components/seo-local/VisibilityAudit.astro`
- Modify: `src/pages/seo-local-sevilla.astro`
- Test: `tests/seo-local-sevilla-redesign.test.js`

- [ ] **Step 1: Create the page-local `VisibilityAudit` component**

Create `src/components/seo-local/VisibilityAudit.astro`. It has no props and contains three semantically separate sections, each using `aria-labelledby` and an H2:

```astro
<section id="revision-local" aria-labelledby="diagnostico-title">
  <p class="audit-kicker">PARTE 01 · VISIBILIDAD LOCAL</p>
  <h2 id="diagnostico-title">Estar en Google no siempre significa aparecer cuando te necesitan.</h2>
  <p>Puede que tu ficha exista, pero que muestre información antigua, que tu web no explique bien lo que haces o que las señales públicas de tu negocio no coincidan.</p>
  <div class="audit-annotation" aria-label="Diagnóstico: presencia local por revisar">
    <span aria-hidden="true">↗</span>
    <p>La revisión empieza por detectar dónde se rompe el recorrido.</p>
  </div>
</section>

<section aria-labelledby="revision-title">
  <p class="audit-kicker">PARTE 02 · REVISIÓN</p>
  <h2 id="revision-title">Antes de corregir, hay que saber qué no está claro.</h2>
  <ul>
    <li><strong>Ficha de Google:</strong> categoría, servicios, horarios, descripción y señales visibles.</li>
    <li><strong>Información pública:</strong> que los datos del negocio sean consistentes donde la gente los consulta.</li>
    <li><strong>Búsquedas locales:</strong> cómo explicar tus servicios y zonas con palabras que entiende tu cliente.</li>
    <li><strong>Opiniones y contenido:</strong> un proceso para pedir reseñas auténticas y mantener la ficha viva.</li>
    <li><strong>Web y medición:</strong> qué conviene aclarar en la web y qué acciones se pueden observar.</li>
  </ul>
</section>

<section aria-labelledby="evidencia-title">
  <p class="audit-kicker">PARTE 03 · ENTREGA VERIFICABLE</p>
  <h2 id="evidencia-title">Qué recibirás durante el trabajo.</h2>
  <p>No se muestran cifras ni resultados que no estén verificados. Sí podrás revisar el trabajo realizado, las prioridades acordadas y el vídeo-informe mensual con el siguiente paso.</p>
</section>
```

Use a `<style>` block scoped to this component to create the audit-sheet world: dark opaque panels, restrained one-pixel rules, a subtle grid with a pseudo-element, muted but contrast-safe labels, one blue annotation line/arrow, and no yellow. Make the rules responsive: no fixed width, no `overflow-x`, one-column flow below `768px`, and readable line lengths. Include `@media (prefers-reduced-motion: reduce)` that disables any transition/animation used by the annotation. Do not use decorative images, fake data charts, artificial badges, or interactive custom controls.

- [ ] **Step 2: Recompose `src/pages/seo-local-sevilla.astro` around the approved narrative**

Keep `ServiceLayout page={seoLocal}`. Replace all current route-specific sections (including the clinic-capilar cross-sell, manual comparison table, project list, `LocalTrustStatus`, and “programa” claims) with the page-local diagnostic component in the `before-benefits` slot:

```astro
---
import ServiceLayout from "@/layouts/ServiceLayout.astro"
import VisibilityAudit from "@/components/seo-local/VisibilityAudit.astro"
import { seoLocal } from "@/data/services"
---

<ServiceLayout page={seoLocal}>
  <Fragment slot="before-benefits">
    <VisibilityAudit />
  </Fragment>
</ServiceLayout>
```

Route-level CSS may only supply the overall dark inspection surface and vertical rhythm that the component cannot own. Do not add an extra H1: `ServiceHero` owns the single H1. Do not duplicate plan price/inclusions manually; `PricingCard` must read the values from `seoLocal`. The service-layout sequence becomes: hero → diagnosis → benefits → process → pricing → FAQ → internal links → final booking CTA, which matches the approved symptom → failure → fix → scope → proof → FAQ → CTA narrative.

- [ ] **Step 3: Run the focused test and observe GREEN**

Run:

```bash
node --test tests/seo-local-sevilla-redesign.test.js
```

Expected: all tests pass. The test now proves that the page uses the local audit component, maintains one route composition owner, renders semantic section/list hooks, and has no legacy/clinic/guarantee strings in `seoLocal`.

- [ ] **Step 4: Build and inspect the generated route manually**

Run:

```bash
npm run build
```

Expected: `astro check` and `astro build` both exit 0.

Then inspect the desktop and mobile viewports stated in **Verification commands**. Evidence required:

- exactly one readable H1;
- primary hero, both plan, and final CTAs say “Reservar una llamada” and open the official calendar link in a new tab;
- Local Pro is identified by text as “Recomendado” and yellow is not the only signal;
- no horizontal scroll, clipped price, detached CTA, or focus loss at 390px;
- keyboard focus is visible on CTAs and FAQ summaries; Enter/Space opens each `<details>` FAQ;
- blue inspection annotation and muted labels remain readable; yellow is restricted to Local Pro / strongest action emphasis;
- no animation plays when reduced motion is enabled.

- [ ] **Step 5: Commit the route-local visual work unit**

```bash
git add src/components/seo-local/VisibilityAudit.astro src/pages/seo-local-sevilla.astro
git commit -m "feat: redesign seo local Sevilla landing"
```

### Task 4: Add built-output regression verification and close the work

**Files:**
- Create: `scripts/check-seo-15.mjs`
- Test: `tests/seo-local-sevilla-redesign.test.js`

- [ ] **Step 1: Write the failing built-output verifier**

Create `scripts/check-seo-15.mjs` using `node:assert/strict` and `node:fs/promises`. Read `dist/seo-local-sevilla/index.html`. Normalize HTML to plain text with `replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")`. Assert all of the following:

```js
assert.match(html, /<h1\b[^>]*>/i)
assert.match(text, /300 €\/mes \+ IVA/)
assert.match(text, /500 €\/mes \+ IVA/)
assert.match(text, /Recomendado/)
assert.match(text, /Reservar una llamada/)
assert.match(text, /Los dos planes se facturan mes a mes/)
assert.doesNotMatch(text, /299\s*€|199\s*€|349\s*€|proyecto inicial|mínimo de tres meses|pacientes|tratamientos/i)
assert.doesNotMatch(text, /(?:garantizamos|garantiza(?:mos)? más|primeras posiciones|más (?:tráfico|leads|llamadas|contactos)|te recomienda(?:rá)? (?:Google|ChatGPT|un asistente))/i)
```

Extract the single `<script type="application/ld+json">` payload, parse it, traverse its `@graph`, and find the `Service` entity. Assert `offers.price === "300"`, `offers.priceCurrency === "EUR"`, `offers.url` ends in `/seo-local-sevilla/`, and no serialized schema text includes legacy price strings, `proyecto inicial`, `pacientes`, or `tratamientos`. Print `SEO-15 OK: seo-local-sevilla commercial and schema checks passed` only after all assertions pass.

- [ ] **Step 2: Run the verifier and observe RED before its schema assertions are finalized**

Run:

```bash
node scripts/check-seo-15.mjs
```

Expected before the final implementation is complete: it fails if `dist` is stale or any expected output is missing. Rebuild rather than weakening output assertions.

- [ ] **Step 3: Rebuild and run all automated verification**

Run, in order:

```bash
npm run build
node scripts/check-seo-15.mjs
node --test tests/seo-local-sevilla-redesign.test.js
node --test tests/*.test.js
git diff --check
```

Expected: every command exits 0. Treat a failure in an existing test as a regression to fix before closing; do not delete or relax unrelated tests.

- [ ] **Step 4: Conduct the bounded visual/a11y confirmation pass**

With the built route in the browser, perform the desktop+mobile inspection in one batch, make at most one batched correction pass, then repeat both viewports once. Record the two viewport sizes, keyboard/focus result, reduced-motion result, absence of horizontal overflow, and actual CTA destination in the implementation evidence. Stop after the confirmation pass; do not enter an open-ended polish loop.

- [ ] **Step 5: Commit the verifier work unit**

```bash
git add scripts/check-seo-15.mjs
git commit -m "test: verify seo local commercial output"
```

## Completion evidence

Before declaring the redesign complete, retain these observed artifacts in the task/PR description:

1. RED output from Task 1 and Task 4 (or a clear explanation if an existing stale build made Task 4 fail for a different expected reason).
2. GREEN outputs for the focused test, `npm run build`, `scripts/check-seo-15.mjs`, complete Node test suite, and `git diff --check`.
3. Desktop and mobile inspection evidence, including focus order and reduced-motion check.
4. A `git show --stat --oneline` for each of the three work-unit commits, demonstrating the scoped changes.
5. A final source/output search showing no retired offer terms in the **general SEO-local surface**:

```bash
rg -n -i "299\s*€|199\s*€|349\s*€|proyecto inicial|mínimo de tres meses|pacientes|tratamientos" \
  src/data/services.ts src/pages/seo-local-sevilla.astro src/components/seo-local scripts/check-seo-15.mjs tests/seo-local-sevilla-redesign.test.js
```

Do not search/modify the separate `capilarLocal` service as evidence for this general-business page; it is intentionally allowed to contain clinic terminology.

## Risks and containment

| Risk | Containment |
| --- | --- |
| Legacy prices or three-month wording survive in `seoLocal`, FAQ schema, or output. | Test source and generated HTML/JSON-LD independently; fail on each prohibited phrase. |
| A shared CTA change changes other service-page copy. | Keep the default label byte-for-byte equivalent; pass overrides only through `seoLocal`; run the entire existing test suite. |
| The route drifts into generic cards or fabricated proof. | Constrain `VisibilityAudit` to audit-sheet sections, actual process/deliverables, and no outcome metrics/testimonials. |
| Dark visual treatment harms accessibility/mobile reading. | Use semantic headings/lists, visible focus styles inherited from booking/FAQ primitives, contrast-safe text classes, no horizontal overflow, and one bounded desktop/mobile/a11y verification cycle. |
| Schema claims a recurring 300 €/month plan ambiguously. | Keep the existing valid numeric Service Offer (`300`, `EUR`) and make the recurring/tax qualification clear in visible page text; do not invent a schema billing-period structure without verified project convention. |

## Plan self-review

- **Spec coverage:** Hero/pain/booking call (Tasks 2–3); symptom → failure → concrete work → plans → transparent proof → FAQs → final CTA (Task 3); visual direction and restrained blue/yellow treatment (Task 3); commercial facts and copy guardrails (Tasks 1–2); service data/schema alignment (Tasks 2 and 4); desktop/mobile, keyboard, focus, contrast, and reduced-motion checks (Tasks 3–4); no invented proof/claims (Tasks 1–4).
- **Placeholder scan:** No `TODO`, `TBD`, “implement later”, generic test instruction, or undefined production API remains. All introduced properties (`primaryCtaLabel`, `buttonLabel`, `tier.ctaLabel`, `label`, `ariaLabel`) are defined before use.
- **Terminology/type consistency:** `seoLocal` remains `ServicePageData`; price display uses `300 € + IVA`, `300 €/mes + IVA`, and `500 €/mes + IVA`; the schema normalizes `page.pricing.from` to the numeric `300`; every SEO-local CTA property resolves to the exact visible label “Reservar una llamada”; `VisibilityAudit` is page-local and referenced exactly once by the route.
