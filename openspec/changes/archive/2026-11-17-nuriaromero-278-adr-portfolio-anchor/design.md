## Context

ADR 0013 (`docs/adr/0013-seo-site-architecture.md`) table A lists the contextual link rows 1-11 with their anchors. `tests/adr-0013-link-rows.test.js` already pins those rows (as a `rows` array, "ADR 0013 table A, rows 1-11") against `internalLinksBySource` in `src/data/internal-links.ts`, and NRD-243 updated that array for row 5. Nothing ties the ADR text itself to the array, so the ADR still shows the pre-NRD-243 anchor in row 5 (line 171). No test or script reads the ADR today (`rg 0013-seo-site-architecture tests scripts` is empty).

## Goals / Non-Goals

**Goals:** the ADR row 5 matches the published anchor; a test fails if ADR table A and the pinned rows diverge again.

**Non-Goals:** editing row 4 or any other ADR content; rewriting historical designs; touching `src/`.

## Decisions

**Approach.** Edit row 5 of ADR 0013 table A in place: Anchor column "casos de éxito de webs para negocios locales"; Reason column "same; the home already links `/recursos/`. Anchor changed with NRD-243 (2026-11-17) so the link does not spend the home's "Sevilla" cap (14 of 14, NRD-277)". Append to the Status line: "Amended on 2026-11-17 by NRD-278 (table A row 5 anchor, after NRD-243)." Add a doc-sync test in the existing test file instead of a new file: it reads the ADR, slices the section that starts at the line beginning with `_A. \`internalLinksBySource\`` up to the next line starting with `_B.`, takes table rows whose first cell is an integer 1-11, strips backticks and the parenthesised suffixes (`(edit existing row)`, `(P1)`) from the source and target cells, and asserts `[source, target, anchor]` equals `rows[n - 1]`. Because `rows` is already asserted against the data, the ADR is transitively pinned to the data.

**Files (layer `app`).**
- Modify `tests/adr-0013-link-rows.test.js`: new `test("ADR 0013 table A matches the pinned rows", ...)` using `node:fs` `readFileSync(new URL("../docs/adr/0013-seo-site-architecture.md", import.meta.url), "utf8")`; a local `parseTableA(markdown)` helper returning `Map<number, [string, string, string]>`; assert 11 rows found and each equals `rows[n - 1]`.
- Modify `docs/adr/0013-seo-site-architecture.md`: row 5 (line 171) and the Status line (line 3). Row 4 untouched.
- Optional, modify `docs/designs/NRD-119-registry-link-rows.md`: one trailing line, e.g. "Note (2026-11-17, NRD-278): the published row 5 anchor is now kept in ADR 0013 table A; this design is historical." No table edit.

**Interfaces.** Test-local only: `parseTableA(markdown: string): Map<number, [source: string, target: string, anchor: string]>`.

**Data.** None.

**Test plan (TDD order).**
1. Add the doc-sync test; `node --test tests/adr-0013-link-rows.test.js` fails on row 5 (old anchor in the ADR). RED observed.
2. Edit ADR row 5 and Status line; the test passes. GREEN.
3. `pnpm format docs/adr/0013-seo-site-architecture.md tests/adr-0013-link-rows.test.js` (Prettier may realign the table columns; that is expected).
4. `node --test tests/*.test.js` and `pnpm build` green.

**Real-browser / e2e checks.** None: no rendered output changes. QA confirms `git diff develop --stat` touches no `src/` file.

**ADRs relied on.** ADR 0013 (amended here), ADR 0012 (term ownership).

## Risks / Trade-offs

- The parser depends on the ADR's table layout (section marker `_A.` and integer first cell). A future reformat of the ADR could break the test; that is the intended trade-off (a loud failure beats silent drift), and the failure message names the row and both values.
- Prettier realigning the whole table produces a larger diff than one line; acceptable for a docs file.
