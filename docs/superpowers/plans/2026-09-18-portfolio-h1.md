# Portfolio H1 Implementation Plan

> **For agentic workers:** Implement this plan task-by-task. Keep the existing design scope and use strict TDD with the temporary rendered-output check below.

**Goal:** Add one visible, descriptive H1 to `/portfolio/` while preserving the current title styling.

**Architecture:** Replace only the page-local use of the shared `TitleSection` H2 with a native H1 in `src/pages/portfolio.astro`. Keep the same icon and visual classes; do not change the shared component.

**Tech Stack:** Astro 4, TypeScript, Tailwind CSS, Node.js test runner.

---

### Task 1: Add and verify the portfolio H1

**Files:**
- Modify: `src/pages/portfolio.astro`
- Modify: `docs/seo-audit/portfolio-heading.md` after verification

- [x] **Step 1: Build current output and create a temporary failing regression check**

Run `pnpm run build`, then create `/tmp/portfolio-heading.test.mjs` with:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile("dist/portfolio/index.html", "utf8");
const headings = [...html.matchAll(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi)];
assert.equal(headings.length, 1, "portfolio page must render exactly one H1");
const text = headings[0][2].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
assert.equal(text, "Proyectos web para negocios de Sevilla");
assert.doesNotMatch(headings[0][1], /\bhidden\b|sr-only/);
```

- [x] **Step 2: Run the check and observe the expected failure**

Run `node /tmp/portfolio-heading.test.mjs`. It must fail because the current page renders zero H1 elements.

- [x] **Step 3: Replace the page title with the approved H1**

In `src/pages/portfolio.astro`, remove the `TitleSection` import and replace its usage with:

```astro
<h1 class="flex items-center mb-6 text-3xl font-semibold gap-x-3 text-black/80 dark:text-white">
  <CodeIcon class="size-7" />
  Proyectos web para negocios de Sevilla
</h1>
```

Do not change the introductory paragraph, project list, page metadata, or shared component.

- [x] **Step 4: Rebuild and run the regression check**

Run `pnpm run build`, then `node /tmp/portfolio-heading.test.mjs`. Expected: build exits 0; the test exits 0 and finds one H1 with the approved text.

- [x] **Step 5: Verify responsive presentation and record completion**

Inspect the rendered page at desktop and mobile widths. Confirm the H1 is readable and matches the prior title's visual treatment. Update `docs/seo-audit/portfolio-heading.md` acceptance criteria and verification notes only after evidence is observed.

**Observed:** Previewed `http://localhost:4322/portfolio/` at 1440×900 and 390×844. Both rendered exactly one H1 with the approved text. The mobile heading wraps to two lines within its 358px container; document width matched the 390px viewport, with no horizontal overflow.

## Execution Choice

This is a one-page markup update with a narrow scope, so execute inline; no parallel writer is needed unless implementation unexpectedly expands beyond the two files above.
