# Design

## Context

See proposal.md (Why). State on `develop` (f21567c):

- No `src/pages/404.astro`; `public/_redirects` has only the `/servicios/*` 301s (no catch-all), so Netlify serves its generic 404 today and will serve `dist/404.html` with a 404 status once it exists.
- Astro 4.4.5 emits `src/pages/404.astro` as `dist/404.html` (not `404/index.html`). `@astrojs/sitemap` 3.1.6 drops status-code pages (`STATUS_CODE_PAGES = new Set(["404", "500"])` in `node_modules/@astrojs/sitemap/dist/index.js`), so no `astro.config.mjs` change is needed. `public/llms.txt` is a curated static file.
- `src/layouts/Layout.astro` accepts `noindex` and passes it to `src/components/seo/SEO.astro`, which renders `<meta name="robots" content="noindex, nofollow">` when set and ALWAYS renders `<link rel="canonical">` (default `new URL(Astro.url.pathname, Astro.site)`, which would be `https://nuriaromero.dev/404`). No page uses `noindex` today (`rg noindex src`).
- `Layout` always emits the site-wide `localBusinessSchema()` and `websiteSchema()` JSON-LD (no Service, no FAQPage).
- `src/data/services.ts` exports `services` (seven pages including `capilarLocal`, parked per PRD section 5); each has `slug` (trailing slash) and `breadcrumbName`. The Header builds its dropdown from it.
- Checks that walk every `dist/**/*.html`: `check-seo-02` (exactly one H1; BreadcrumbList checks only when present), `check-seo-06` (every internal `href="/..."` exists and ends in `/`), `check-seo-07` (ownership on title, H1, H2; `routeOf("404.html")` gives `/404.html/`, not an owner route), `check-seo-08` (only pages with `<details>`). `check-seo-11` and `check-seo-17` read only `index.html` files.
- `SectionContainer` adds a view-timeline reveal (opacity 0 -> 1 on entry) to every section except `#home-hero`; on a short page a section partly inside the first viewport could start semi-transparent (the class of defect fixed in NRD-196).
- `tests/package-scripts.test.js` requires the `check:seo-NN` / `:dist` pair and the numeric `check:seo:dist` chain for every `scripts/check-seo-NN.mjs`.

## Goals / Non-Goals

**Goals:**

- A branded, readable 404 in the ink world with exits to the home, the six in-focus services and booking; `noindex`, no canonical, outside sitemap and `llms.txt`; CI-enforced.

**Non-Goals:**

- Netlify configuration, redirects, search, analytics, parked pages.

## Decisions

**Approach.** One page composed with the template components, a small data export so the service exits come from `src/data`, a one-line SEO head rule (no canonical on noindex pages) and a dedicated build check, because CI runs unit tests before the build and the story's guarantees (file exists, noindex, not in sitemap) are build facts.

1. **No `SectionContainer` on the 404.** The page wraps hero and related links in one local container (`<div class="nf-wrap">`, scoped CSS: `max-width: 56rem; margin-inline: auto`) and places `SeoLocalClosing` directly in `<main>` (it is already full-bleed with `margin-inline: -1rem`). This removes the reveal animation entirely, so nothing visible at first paint can start below AA (story criterion), on a page short enough that the closing often sits in the first viewport.
2. **Exits from data.** `src/data/services.ts` exports `focusServices = [seoLocal, disenoWeb, tiendaOnline, desarrolloSoftware, automatizaciones, inteligenciaArtificial]` (PRD section 5 order: local SEO first). The page maps them to `{ path: s.slug, anchor: s.breadcrumbName }` and prepends `{ path: "/", anchor: "Inicio" }` (UI spec may adjust the home anchor), passed to `SeoLocalRelated` with a `label` from the UI spec and an `ariaLabel` equal to that label (TL decision 2026-11-16: `SeoLocalRelated` gets an optional `ariaLabel` prop, default "Contenido relacionado", so the landmark name matches the visible label; every existing caller keeps today's output). `src/data/internal-links.ts` is NOT used: `check-seo-06` resolves every map key to `dist/<key>/index.html`, which does not exist for the 404.
3. **No canonical on noindex pages.** In `SEO.astro`, render `<link rel="canonical">` only when `!noindex`. A canonical on a page that asks not to be indexed is a contradictory signal, and the default one would point at `/404` without a trailing slash. The robots content stays `noindex, nofollow` (existing behaviour of the prop; crawlers do not process 404-status pages, and changing it has no effect worth a second variant). `og:url` keeps using the computed URL (harmless).
4. **No breadcrumbs, no page schema.** A 404 has no place in the hierarchy; adding a BreadcrumbList would also trip the "last item equals canonical" rule of `check-seo-02`. Only the site-wide Layout entities remain.
5. **Copy.** Title and description from the UI spec (title must not contain an owned term; for example "Página no encontrada — Nuria Romero"). Keyword H1 in business language ("Esta página no existe o ha cambiado de dirección" style), display title with one accent, one orienting sentence; closing keyword h2 without an owned term. Spanish, `tú`, no figures, no promises.
6. **Build check.** `scripts/check-seo-19.mjs` (number = next free on `develop`; 19 after NRD-222's 18): reads `dist/404.html`, `dist/llms.txt`, every `dist/sitemap-*.xml`; imports `focusServices` from `src/data/services.ts` and `bookingUrl` from `src/data/site.ts` (as `check-seo-02` imports `store-offer.ts`); asserts the contract listed in the Test plan; prints every failure then exits 1.
7. **Explicit exclusion from `templatePages`.** The header comment of `scripts/lib/template-pages.mjs` is NOT edited; instead the check header documents that the 404 is outside `templatePages` on purpose (noindex, `404.html` path, no word target) and that `check-seo-19` owns its contract. The test asserts `templatePages` has no `/404` route, so the exclusion is tested, not implicit.

### Files

All in layer `app`.

Create:

- `src/pages/404.astro`.
- `scripts/check-seo-19.mjs`.
- `tests/not-found-page.test.js`.

Modify:

- `src/data/services.ts`: `export const focusServices = [...]` after `services`, with a one-line English comment (in-focus service pages per PRD section 5; parked pages excluded).
- `src/components/seo/SEO.astro`: `{!noindex && <link rel="canonical" href={canonical} />}`.
- `src/components/seo-local/SeoLocalRelated.astro`: optional prop `ariaLabel?: string` (default `"Contenido relacionado"`) used as the `nav` `aria-label`; no other change, existing callers unchanged.
- `package.json`: `check:seo-19` and `check:seo-19:dist` after the previous pair; ` && node scripts/check-seo-19.mjs` at the end of `check:seo:dist`.

Unchanged and expected green: `public/_redirects`, `public/_headers`, `astro.config.mjs`, `public/llms.txt`, `scripts/lib/template-pages.mjs`, checks 02, 06, 07, 11, 17.

### Interfaces

```ts
// src/data/services.ts
export const focusServices: ServicePageData[]; // seoLocal, disenoWeb, tiendaOnline, desarrolloSoftware, automatizaciones, inteligenciaArtificial
```

```astro
<!-- src/pages/404.astro (outline) -->
<Layout title=... description=... noindex>
  <main class="template-ground px-4 pt-24">
    <div class="nf-wrap">
      <SeoLocalHero keyword=... title={{ text, accent }} subtitle=... />
      <SeoLocalRelated label=... links={exits} />
    </div>
    <SeoLocalClosing headingId="nf-cierre-title" keyword=... title=... text=... />
  </main>
</Layout>
```

### Data

None: no storage or settings change. `focusServices` is a derived export of existing data.

### Test plan (TDD order)

Task 1.1 (NRD-227), RED first in `tests/not-found-page.test.js`:

1. Source: `src/pages/404.astro` exists; uses `<Layout` with `noindex`; `<main class="template-ground`; `<SeoLocalHero`, `<SeoLocalRelated`, `<SeoLocalClosing` in that order; imports `focusServices` from `@/data/services`; no `SectionContainer`, `Breadcrumbs`, `Schema`, `serviceSchema`, `faqSchema`, `text-gray-`; `focusServices` exported with exactly the six slugs and without `/seo-para-clinicas-capilares-sevilla/` nor any niche slug; `SEO.astro` renders the canonical under `!noindex`; `public/_redirects` and `public/_headers` contain no `404`; `templatePages` has no `/404` route; `package.json` has the new check pair; `SeoLocalRelated.astro` declares `ariaLabel` with default "Contenido relacionado" and the 404 passes `ariaLabel` equal to its `label`. Scenarios "Template sections", "Netlify configuration untouched", "Exits from data" (source half).
2. Built (skip without `dist/404.html`): robots meta with `noindex`; no canonical; exactly one H1; links `href="/"` and every `focusServices` slug inside `<main>`; booking URL present; no `"@type":"Service"`/`FAQPage`; `dist/sitemap-0.xml` and `dist/llms.txt` without `/404`; `dist/index.html` still has a canonical. Scenarios "404 page built", "Hero answer", "Closing with booking", "Noindex without canonical", "Outside sitemap and llms.txt", "No service structured data", "Indexable pages keep their canonical".
3. Write `scripts/check-seo-19.mjs` with the step 2 assertions (CI enforcement) plus "every other built `index.html` keeps a canonical"; implement; `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green (02 one H1 in `404.html`, 06 links, 07 ownership, 19 contract).

### Real-browser / e2e checks (QA)

- `pnpm dev` / `astro preview`: open `/una-ruta-que-no-existe/`; the custom 404 renders (preview serves `404.html` for unknown routes).
- 375 and 1280 px: no overflow, hero, pills wrap, closing band; every text in the first viewport fully opaque and AA from first paint (no reveal animation).
- Keyboard: header, hero CTA, every exit pill, closing CTA, footer; visible focus on pills.
- Head: robots `noindex, nofollow`, no canonical (view source).

### Owner-account actions (executed by the orchestrator)

- After the next scheduled promotion of `develop` to `main`, request `https://nuriaromero.dev/<random-path>/` and confirm a 404 status with the custom page body (read-only HTTP request, no account needed) - executable owner action.

### ADRs relied on

0001, 0003, 0004, 0005, 0006, 0008, 0012, 0014.

## Risks / Trade-offs

- [Check number collides with NRD-222] -> take the next free number on `develop` at implementation time and rebase; `tests/package-scripts.test.js` catches a broken chain.
- [`/404` served with 200 by Netlify pretty URLs] -> the page is noindex, has no canonical, is linked from nowhere and is outside the sitemap; acceptable.
- [Canonical rule affects a future noindex page] -> intended: any noindex page should not declare a canonical; covered by the "indexable pages keep their canonical" assertion.
- [No reveal animation differs from other template pages] -> deliberate for a short exit page (story AA criterion); visual consistency comes from tokens and sections, not the reveal.
- Size: 2 points, one work unit; no size concern.

## UI spec

Visual authority: `DESIGN.md` (ink template world, "Using the components on another page") and `src/styles/template.css`. Surface mode: recovery exit (the visitor arrived by a broken or old link and needs orientation first, the booking call second). Design skill `impeccable:impeccable` (shape) used in advice mode; its interview and setup steps were skipped (unattended), so the copy and hierarchy calls below are marked `Assumption:` where no acceptance criterion fixes them.

### Page `src/pages/404.astro`

**Layout and order** (top to bottom, inside the existing `Layout` header and footer):

1. `<main class="template-ground px-4 pt-24">` (ink ground with the 10% sky wash at the top, from `template.css`).
2. `<div class="nf-wrap">` (scoped CSS: `max-width: 56rem; margin-inline: auto; padding-bottom: 4rem`, `6rem` from 768 px, so the gap to the closing band matches the 6rem section rhythm of `space-y-24` on wider screens). Assumption: the padding values; the design fixes only max-width and centring. The 56rem matches `.closing-inner` so the hero, the pills and the closing copy share one left edge.
   1. `SeoLocalHero` (`src/components/seo-local/SeoLocalHero.astro`), no `visual` slot, so it renders as `.hero-solo` (single column at every width).
   2. `SeoLocalRelated` (`src/components/seo-local/SeoLocalRelated.astro`), the top-ruled pill row, directly under the hero (no extra wrapper, no `SectionHeading`: it is a navigation row, not a section).
3. `SeoLocalClosing` (`src/components/seo-local/SeoLocalClosing.astro`), no `visual` slot (`.closing-solo`, no sky radial), directly in `<main>`, last element of `<main>`. It is full-bleed by its own `margin-inline: -1rem`.

No `SectionContainer`, no `Breadcrumbs`, no `SectionHeading` outside the two components, no drawing, no `ProofStrip`, no `.band` wrapper. Nothing else is added.

**Hierarchy.** Main information: the H1 (the page does not exist or has moved). Primary action in the first viewport: the exits (home link next to the booking button, then the pill row); the booking button is the single filled control, as everywhere in this world. Secondary: the closing band, which repeats the booking for visitors who did not find their page. Reading order equals DOM order: H1 keyword, display title, orienting sentence, booking button, home link, pill label, pills, closing heading, closing text, closing booking, meta.

**Head copy** (props of `Layout`, plus `noindex`):

- `title`: `Página no encontrada — Nuria Romero`. Assumption: wording proposed in design decision 5; contains no owned term from `keywordOwners` in `src/data/seo-intents.ts`.
- `description`: `La página que buscas no existe o ha cambiado de dirección. Desde aquí puedes volver al inicio, ver los servicios o reservar una llamada.` Assumption: no criterion fixes it; plain business language, no figures.

**Hero copy** (props of `SeoLocalHero`):

- `keyword` (renders the only H1): `Esta página no existe o ha cambiado de dirección`. Assumption: wording from design decision 5, owner-term free.
- `title`: `{ text: "Elige por dónde seguir", accent: "por dónde seguir" }`. Assumption: one serif accent phrase per The One Serif Phrase Rule; short so the 16ch display wraps to two lines at most at 320 px.
- `subtitle` (the one orienting sentence): `Si has llegado por un enlace antiguo o con una errata, aquí abajo tienes el inicio y los servicios; si lo prefieres, reserva una llamada y lo vemos juntos.` Assumption: one sentence, `tú`, no promise of an outcome.
- `primaryCtaLabel`: omitted (site default `BookingButton` label "Reserva una primera sesión", as on `/recursos/`).
- `secondaryLink`: `{ label: "Volver al inicio", href: "/" }`. Assumption: the most common 404 recovery sits next to the button as the underlined `.hero-link`, reachable before the pills by keyboard; it duplicates the "Inicio" pill on purpose (one is the inline answer, the other part of the full exit list).

**Exit pills** (props of `SeoLocalRelated`):

- `label`: `Páginas principales`. Assumption: the component default "Sigue leyendo" does not fit a 404.
- `links`, in this order: `{ path: "/", anchor: "Inicio" }`, then `focusServices` mapped to `{ path: s.slug, anchor: s.breadcrumbName }` in PRD order, which renders: "SEO local en Sevilla", "Diseño web en Sevilla", "Tienda online en Sevilla", "Software a medida", "Automatizaciones", "Inteligencia artificial". Anchors come from data; no hand-written service text in the page. Home anchor "Inicio" kept (matches the breadcrumbs vocabulary of the site).

**Closing copy** (props of `SeoLocalClosing`):

- `headingId`: `nf-cierre-title`.
- `keyword` (H2): `Reserva una llamada`. Assumption: same keyword as the `/recursos/` closing; owner-term free.
- `title`: `{ text: "¿No encuentras lo que buscabas?", accent: "lo que buscabas" }`. Assumption.
- `text`: `Cuéntame qué necesita tu negocio y te digo si puedo ayudarte con la web, el SEO local o la automatización de tareas.` Assumption: honest scope, no figure, no promise of results.
- `ctaLabel` and `meta`: omitted (component defaults "Reservar una llamada" and "30 minutos · Sin compromiso · Directamente conmigo", the existing site-wide wording).

**States.** Static page, no data fetching: loading, error and partial states n/a. Empty: n/a in practice, the link list always holds "Inicio"; if `focusServices` were ever empty the row still renders with the single "Inicio" pill (the component hides the nav only for zero links). Disabled: n/a. Success: n/a.

**Design system reuse.** Tokens only from `src/styles/template.css`: `--ink-ground` (via `.template-ground`), `--ink-closing`, `--hairline`, `--hairline-quiet`, `--sky-signal`, `--sky-accent`, `--text-strong`, `--text-body`, `--text-secondary`, `--text-muted`; shared classes `.tpl-kw`, `.tpl-display`, `.tpl-accent` (through `SectionHeading`). Components: `Layout` (`src/layouts/Layout.astro`), `SeoLocalHero`, `SeoLocalRelated`, `SeoLocalClosing`, `BookingButton` (`src/components/BookingButton.astro`, rendered by hero and closing). The only page CSS is the scoped `.nf-wrap` rule; no Tailwind colour utilities (`text-gray-*` etc.), no new token, no new component.

**Responsive.**

- 320-767 px: everything single column. The H1 keyword (1.0625rem) may wrap to two or three lines; the display title (clamp min 2.25rem) to two. Hero actions wrap: the booking button and "Volver al inicio" sit on one row when they fit and stack otherwise (existing `flex-wrap` with `0.75rem 1.5rem` gap); below 370 px the booking label drops "primera" (existing behaviour). The pill row wraps: label on its own line when needed, pills flowing in rows with 0.5rem gaps. The closing band spans edge to edge (its -1rem margin cancels the `px-4` of `main`) with no horizontal overflow.
- 768 px and up: same single-column composition (no visual slot); display sizes grow along their clamps; `.nf-wrap` bottom padding becomes 6rem.
- 1024 px and up: content capped at 56rem and centred; the closing band background stays full width with its copy on the same 56rem column. `.nf-wrap` uses 56rem at every width instead of the `SectionContainer` steps (42rem at md); the difference only shows between 768 and 1023 px and keeps hero, pills and closing copy on one left edge (confirmed by the TL, 2026-11-16).

**Interactions.** All existing, nothing new: pill hover turns the border to `--sky-signal` and text to `--sky-accent` (0.2s); `.hero-link` hover to `--sky-accent`; booking hover to `action-blue-hover`; focus is the 2px `--sky-signal` outline on pills and hero link, the ring on the booking button. Booking links open the schedule in a new tab (existing `BookingButton`). No entrance or reveal animation anywhere on the page: every text in the first viewport is fully opaque from first paint (story AA criterion). No client script.

**Accessibility hand-off.**

- Headings: exactly one H1 (hero keyword) and one H2 (closing keyword, `aria-labelledby="nf-cierre-title"` on the closing section); display titles stay `<p>` as in the component.
- Focus order: header controls, hero booking button, "Volver al inicio", the seven pills in list order, closing booking button, footer. Do not autofocus anything and do not add `role="alert"` or live regions: the 404 is a normal page load, the H1 and `<title>` carry the message.
- The pill row is a `<nav>` landmark named by `ariaLabel="Páginas principales"`, the same text as its visible label (TL decision: new optional `ariaLabel` prop on `SeoLocalRelated`, default unchanged).
- No icon-only controls on the page beyond those already in the header and footer.
