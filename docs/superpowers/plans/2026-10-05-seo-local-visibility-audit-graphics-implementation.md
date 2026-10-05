# VisibilityAudit Graphics Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two remaining pure-text blocks inside `src/components/seo-local/VisibilityAudit.astro` (the 5-item review list and the delivery paragraph) with small honest graphics — a vertical checklist-flow diagram and a 3-node delivery-cycle diagram — using only hand-drawn inline SVG icons in the project's existing style.

**Architecture:** No new components beyond four new icon files in `src/components/icons/` (`MapPin`, `Search`, `Gauge`, `Repeat`). `VisibilityAudit.astro` keeps its current three-`<section>` structure; only the internal markup and scoped `<style>` of the second and third sections change. No data-layer changes, no animation, no new libraries.

**Tech Stack:** Astro 4, TypeScript, Node.js built-in test runner (`node:test`, `node:assert/strict`), `astro check`, Astro static build.

**Spec:** `docs/superpowers/specs/2026-10-05-seo-local-visibility-audit-graphics-design.md`

---

## Scope guardrails (do not violate)

- Do **not** modify `tests/seo-local-sevilla-redesign.test.js` or `scripts/check-seo-15.mjs` — they must keep passing unmodified against the new markup.
- Do **not** touch `src/data/services.ts`.
- Do **not** add any animation, transition, or new dependency.
- Keep every icon's root `<svg>` at `viewBox="0 0 24 24"`, `stroke-width="2"`, `stroke="currentColor"`, `fill="none"` (except where noted), `stroke-linecap="round"`, `stroke-linejoin="round"`, using the project's bare `{...Astro.props}` spread convention (the convention used by the existing `Link.astro`, `Briefcase.astro`, `ProfileCheck.astro`, `Star.astro` — not the typed-`Props` convention used by the outlier `Calendar.astro`).

## File map

| Path | Action |
| --- | --- |
| `tests/visibility-audit-graphics.test.js` | Create — new, narrowly scoped regression tests for this redesign |
| `src/components/icons/MapPin.astro` | Create |
| `src/components/icons/Search.astro` | Create |
| `src/components/icons/Gauge.astro` | Create |
| `src/components/icons/Repeat.astro` | Create |
| `src/components/seo-local/VisibilityAudit.astro` | Modify (full rewrite of markup + `<style>`) |

## Verification commands

Run all of these from `/Users/nuria/Desktop/code/nuriaromerodev/portfolio-nuriaromerodev/nuriaromero.dev`:

```bash
node --test tests/visibility-audit-graphics.test.js
node --test tests/seo-local-sevilla-redesign.test.js
npx astro check
npm run build
node scripts/check-seo-15.mjs
node --test tests/*.test.js
git diff --check
```

---

### Task 1: Add the four new icon components

**Files:**
- Create: `tests/visibility-audit-graphics.test.js`
- Create: `src/components/icons/MapPin.astro`
- Create: `src/components/icons/Search.astro`
- Create: `src/components/icons/Gauge.astro`
- Create: `src/components/icons/Repeat.astro`

- [ ] **Step 1: Write the failing test for the new icons**

Create `tests/visibility-audit-graphics.test.js`:

```js
import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("new VisibilityAudit icons follow the project's bare-spread SVG icon convention", async () => {
  const icons = await Promise.all([
    source("src/components/icons/MapPin.astro"),
    source("src/components/icons/Search.astro"),
    source("src/components/icons/Gauge.astro"),
    source("src/components/icons/Repeat.astro"),
  ])

  for (const icon of icons) {
    assert.match(icon, /\{\.\.\.Astro\.props\}/)
    assert.match(icon, /viewBox="0 0 24 24"/)
    assert.match(icon, /stroke="currentColor"/)
    assert.match(icon, /stroke-width="2"/)
  }
})
```

- [ ] **Step 2: Run the test and observe RED**

Run:

```bash
node --test tests/visibility-audit-graphics.test.js
```

Expected: FAIL — the four icon files do not exist yet, so `readFile` rejects with `ENOENT`.

- [ ] **Step 3: Create `src/components/icons/MapPin.astro`**

```astro
<svg
  {...Astro.props}
  width="24"
  height="24"
  viewBox="0 0 24 24"
  stroke-width="2"
  stroke="currentColor"
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
  ><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path
    d="M12 11m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
  ></path><path
    d="M12 21c-3.5 -3.5 -7 -6.5 -7 -10a7 7 0 0 1 14 0c0 3.5 -3.5 6.5 -7 10z"
  ></path></svg
>
```

- [ ] **Step 4: Create `src/components/icons/Search.astro`**

```astro
<svg
  {...Astro.props}
  width="24"
  height="24"
  viewBox="0 0 24 24"
  stroke-width="2"
  stroke="currentColor"
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
  ><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle
    cx="10"
    cy="10"
    r="6"
  ></circle><path d="M20 20l-5.5 -5.5"></path></svg
>
```

- [ ] **Step 5: Create `src/components/icons/Gauge.astro`**

```astro
<svg
  {...Astro.props}
  width="24"
  height="24"
  viewBox="0 0 24 24"
  stroke-width="2"
  stroke="currentColor"
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
  ><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path
    d="M12 13l3 -3"
  ></path><path d="M4.6 15a9 9 0 1 1 14.8 0"></path></svg
>
```

- [ ] **Step 6: Create `src/components/icons/Repeat.astro`**

```astro
<svg
  {...Astro.props}
  width="24"
  height="24"
  viewBox="0 0 24 24"
  stroke-width="2"
  stroke="currentColor"
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
  ><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path
    d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"
  ></path><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"></path></svg
>
```

- [ ] **Step 7: Run the test and observe GREEN**

Run:

```bash
node --test tests/visibility-audit-graphics.test.js
```

Expected: PASS (1/1).

- [ ] **Step 8: Type-check and commit**

Run:

```bash
npx astro check
```

Expected: exit 0.

```bash
git add tests/visibility-audit-graphics.test.js src/components/icons/MapPin.astro src/components/icons/Search.astro src/components/icons/Gauge.astro src/components/icons/Repeat.astro
git commit -m "feat(icons): add map-pin, search, gauge and repeat icons"
```

---

### Task 2: Rewrite VisibilityAudit's checklist and delivery sections as graphics

**Files:**
- Modify: `tests/visibility-audit-graphics.test.js`
- Modify: `src/components/seo-local/VisibilityAudit.astro`

- [ ] **Step 1: Add the failing structural test**

Append to `tests/visibility-audit-graphics.test.js`:

```js
test("VisibilityAudit renders a checklist-flow and a delivery-cycle instead of plain text", async () => {
  const audit = await source("src/components/seo-local/VisibilityAudit.astro")

  assert.match(audit, /import MapPin from "@\/components\/icons\/MapPin\.astro"/)
  assert.match(audit, /import Search from "@\/components\/icons\/Search\.astro"/)
  assert.match(audit, /import Gauge from "@\/components\/icons\/Gauge\.astro"/)
  assert.match(audit, /import Repeat from "@\/components\/icons\/Repeat\.astro"/)
  assert.match(audit, /class="audit-flow"/)
  assert.doesNotMatch(audit, /class="audit-list"/)
  assert.match(audit, /class="audit-cycle"/)
  assert.match(audit, /Trabajo revisable/)
  assert.match(audit, /Prioridades acordadas/)
  assert.match(audit, /Vídeo-informe mensual/)
  assert.match(audit, /cada mes/)
  assert.doesNotMatch(audit, /transition:|animation:/)
})
```

- [ ] **Step 2: Run the test and observe RED**

Run:

```bash
node --test tests/visibility-audit-graphics.test.js
```

Expected: FAIL on the second test — the current `VisibilityAudit.astro` has no icon imports, no `audit-flow`/`audit-cycle` classes, and still has `class="audit-list"`.

- [ ] **Step 3: Rewrite `src/components/seo-local/VisibilityAudit.astro`**

Replace the entire file with:

```astro
---
import Link from "@/components/icons/Link.astro"
import Star from "@/components/icons/Star.astro"
import MapPin from "@/components/icons/MapPin.astro"
import Search from "@/components/icons/Search.astro"
import Gauge from "@/components/icons/Gauge.astro"
import ProfileCheck from "@/components/icons/ProfileCheck.astro"
import Briefcase from "@/components/icons/Briefcase.astro"
import Calendar from "@/components/icons/Calendar.astro"
import Repeat from "@/components/icons/Repeat.astro"
---

<section id="revision-local" class="audit-panel" aria-labelledby="diagnostico-title">
  <p class="audit-kicker">Visibilidad local</p>
  <h2 id="diagnostico-title">Estar en Google no siempre significa aparecer cuando te necesitan.</h2>
  <p class="audit-copy">Puede que tu ficha exista, pero que muestre información antigua, que tu web no explique bien lo que haces o que las señales públicas de tu negocio no coincidan.</p>
  <div class="audit-annotation" aria-label="Diagnóstico: presencia local por revisar">
    <span aria-hidden="true">↗</span>
    <p>La revisión empieza por detectar dónde se rompe el recorrido.</p>
  </div>
</section>

<section class="audit-panel" aria-labelledby="revision-title">
  <p class="audit-kicker">Revisión</p>
  <h2 id="revision-title">Antes de corregir, hay que saber qué no está claro.</h2>
  <ul class="audit-flow">
    <li>
      <MapPin class="audit-flow-icon" aria-hidden="true" />
      <span><strong>Ficha de Google:</strong> categoría, servicios, horarios, descripción y señales visibles.</span>
    </li>
    <li>
      <Link class="audit-flow-icon" aria-hidden="true" />
      <span><strong>Información pública:</strong> que los datos del negocio sean consistentes donde la gente los consulta.</span>
    </li>
    <li>
      <Search class="audit-flow-icon" aria-hidden="true" />
      <span><strong>Búsquedas locales:</strong> cómo explicar tus servicios y zonas con palabras que entiende tu cliente.</span>
    </li>
    <li>
      <Star class="audit-flow-icon" aria-hidden="true" />
      <span><strong>Opiniones y contenido:</strong> un proceso para pedir reseñas auténticas y mantener la ficha viva.</span>
    </li>
    <li>
      <Gauge class="audit-flow-icon" aria-hidden="true" />
      <span><strong>Web y medición:</strong> qué conviene aclarar en la web y qué acciones se pueden observar.</span>
    </li>
  </ul>
</section>

<section class="audit-panel audit-proof" aria-labelledby="evidencia-title">
  <p class="audit-kicker">Entrega verificable</p>
  <h2 id="evidencia-title">Qué recibirás durante el trabajo.</h2>
  <p class="audit-copy">No se muestran cifras ni resultados que no estén verificados. Lo que sí vas a poder revisar, cada mes:</p>
  <div class="audit-cycle">
    <div class="audit-cycle-step">
      <ProfileCheck class="audit-cycle-icon" />
      <p>Trabajo revisable</p>
    </div>
    <div class="audit-cycle-step">
      <Briefcase class="audit-cycle-icon" />
      <p>Prioridades acordadas</p>
    </div>
    <div class="audit-cycle-step">
      <Calendar class="audit-cycle-icon" />
      <p>Vídeo-informe mensual</p>
    </div>
    <div class="audit-cycle-loop">
      <Repeat class="audit-cycle-icon" aria-hidden="true" />
      <span>cada mes</span>
    </div>
  </div>
</section>

<style>
  .audit-panel {
    position: relative;
    isolation: isolate;
    max-width: 72rem;
    margin-inline: auto;
    padding: clamp(1.5rem, 4vw, 3.5rem);
    border-block: 1px solid rgb(71 85 105 / 0.85);
    color: rgb(226 232 240);
    background: rgb(2 6 23);
  }

  .audit-panel::before {
    position: absolute;
    z-index: -1;
    inset: 0;
    content: "";
    opacity: 0.16;
    background-image: linear-gradient(rgb(51 65 85 / 0.8) 1px, transparent 1px);
    background-size: 100% 2.25rem;
    pointer-events: none;
  }

  .audit-kicker {
    margin: 0 0 1rem;
    color: rgb(125 211 252);
    font-size: 0.78rem;
    font-weight: 750;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h2 {
    max-width: 18ch;
    margin: 0;
    color: white;
    font-size: clamp(1.8rem, 4vw, 3.5rem);
    line-height: 1.04;
    letter-spacing: -0.035em;
  }

  .audit-copy {
    max-width: 65ch;
    margin: 1.5rem 0 0;
    color: rgb(203 213 225);
    font-size: 1.075rem;
    line-height: 1.7;
  }

  .audit-annotation {
    display: flex;
    gap: 0.75rem;
    max-width: 44rem;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid rgb(56 189 248 / 0.9);
    color: rgb(186 230 253);
  }

  .audit-annotation span {
    flex: none;
    color: rgb(56 189 248);
    font-size: 1.5rem;
    line-height: 1;
  }

  .audit-annotation p { margin: 0; line-height: 1.5; }

  .audit-flow {
    position: relative;
    display: grid;
    gap: 0;
    margin: 1.75rem 0 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid rgb(71 85 105);
  }

  .audit-flow::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 1.1875rem;
    width: 1px;
    content: "";
    background: rgb(56 189 248 / 0.45);
  }

  .audit-flow li {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    max-width: 70ch;
    padding: 1rem 0;
    border-bottom: 1px solid rgb(71 85 105);
    color: rgb(203 213 225);
    line-height: 1.6;
  }

  .audit-flow-icon {
    position: relative;
    z-index: 1;
    flex: none;
    width: 2.375rem;
    height: 2.375rem;
    padding: 0.5rem;
    border-radius: 9999px;
    border: 1px solid rgb(56 189 248 / 0.6);
    color: rgb(56 189 248);
    background: rgb(2 6 23);
  }

  .audit-flow strong { color: white; }

  .audit-cycle {
    display: grid;
    gap: 1.5rem;
    max-width: 44rem;
    margin: 2rem 0 0;
  }

  .audit-cycle-step {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem 1rem;
    border: 1px solid rgb(71 85 105);
    color: rgb(203 213 225);
  }

  .audit-cycle-step p { margin: 0; line-height: 1.5; }

  .audit-cycle-icon {
    flex: none;
    width: 1.5rem;
    height: 1.5rem;
    color: rgb(56 189 248);
  }

  .audit-cycle-loop {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-left: 1rem;
    color: rgb(125 211 252);
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .audit-proof { margin-bottom: 0; }

  @media (max-width: 767px) {
    .audit-panel { padding: 1.5rem; }
    h2 { max-width: 100%; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { transition: none !important; animation: none !important; }
  }
</style>
```

Note on `Calendar`: it is the one icon with a typed `Props` interface (`{ class?: string }`) that does not spread `Astro.props` onto the `<svg>`, so an `aria-hidden` prop passed to it would be silently dropped — it already bakes `aria-hidden="true"` into its own markup, which is why it is used above without an explicit `aria-hidden` prop.

- [ ] **Step 4: Run the new test and observe GREEN**

Run:

```bash
node --test tests/visibility-audit-graphics.test.js
```

Expected: PASS (2/2).

- [ ] **Step 5: Confirm the existing contract test still passes unmodified**

Run:

```bash
node --test tests/seo-local-sevilla-redesign.test.js
```

Expected: PASS (3/3) — unchanged from before this task, proving the new markup still satisfies `<section...<h2`, `aria-labelledby=`, `<ul`, and the `Qué recibirás` heading text.

- [ ] **Step 6: Type-check, build, and run full regression**

Run, in order:

```bash
npx astro check
npm run build
node scripts/check-seo-15.mjs
node --test tests/*.test.js
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 7: Manual desktop/mobile check**

Start the dev server only if not already running:

```bash
npm run dev -- --host 127.0.0.1
```

Inspect `http://127.0.0.1:4321/seo-local-sevilla/` at **1440×900** and **390×844**:
- the checklist section shows 5 rounded icon badges threaded by one vertical line, one column at both widths, no horizontal scroll;
- the delivery section shows 3 bordered rows plus a "cada mes" repeat row, one column at both widths;
- enable "reduce motion" in OS accessibility settings and confirm nothing animates (there is nothing to disable, by design);
- confirm icon badges are purely decorative (`aria-hidden`) and the surrounding text remains readable by a screen reader (inspect via the browser's accessibility tree or `VoiceOver`/`NVDA` if available).

- [ ] **Step 8: Commit the redesign**

```bash
git add tests/visibility-audit-graphics.test.js src/components/seo-local/VisibilityAudit.astro
git commit -m "feat(seo-local): turn VisibilityAudit's checklist and delivery copy into diagrams"
```

---

## Completion evidence

Before declaring this done, retain:

1. RED output from Task 1 Step 2 and Task 2 Step 2.
2. GREEN output from `node --test tests/*.test.js`, `npx astro check`, `npm run build`, `node scripts/check-seo-15.mjs`, `git diff --check`.
3. Desktop (1440×900) and mobile (390×844) manual inspection notes, including the reduced-motion check.
4. `git show --stat --oneline` for both work-unit commits.

## Plan self-review

- **Spec coverage:** checklist-flow (Task 2), delivery-cycle (Task 2), new icon files with the correct convention (Task 1), no data/animation/library changes (guardrails + Task 2 test's `doesNotMatch(/transition:|animation:/)`), existing tests stay green (Task 2 Steps 5–6).
- **Placeholder scan:** no TBD/TODO; every code block is complete and copy-pasteable; every icon referenced in `VisibilityAudit.astro` has a corresponding creation step in Task 1 or already exists in the repo (`Link`, `Star`, `ProfileCheck`, `Briefcase`, `Calendar`).
- **Type/name consistency:** import names (`MapPin`, `Search`, `Gauge`, `Repeat`, `Link`, `Star`, `ProfileCheck`, `Briefcase`, `Calendar`) match the CSS class names used in the same file (`audit-flow-icon`, `audit-cycle-icon`) and the test assertions in both tasks use the exact same strings.
