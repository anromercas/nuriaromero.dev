## Context

`docs/seo-audit/local-signals-2026-11.md` (NRD-77) is the record of local signals. Its "Citas de terceros (sección C del Step 0)" subsection (line 104) says, as of 2026-11-15, that no directory listing with our NAP was found, and lists only an unconfirmed Malt profile. The "Consistencia NAP" table (line 87 onwards) has a "Third-party citations" row with "none found". The "Fuentes y fechas" table (line 9) lists sources L0 to L4.

On 2026-11-18 the owner created a public Sortlist profile (tracker comments on NRD-160): name, Sevilla/La Rinconada address, phone, link to the site, logo, and two services, "software development" from 999 EUR (as on `/desarrollo-software-medida/`) and "SEO local" from 300 EUR per month + VAT linking to `/seo-local-sevilla/`. Clutch is under review and not public (NRD-292). Sortlist answers automated clients with HTTP 403, so only a real browser can confirm the public page.

`SITE` (`src/data/site.ts:3-50`) holds the NAP: `name` "Nuria Romero", `phone` "611 812 431", `address.locality` "Sevilla", `address.full` "Camino Andalucía, 426, 41309 La Rinconada, Sevilla", `url` "https://nuriaromero.dev".

The scheduled SEO run reads `.claude/harness/seo.md` (its `seo.brief`), not the audit documents, so a follow-up recorded only in the audit document would not reach it.

## Goals / Non-Goals

**Goals:** a verified, dated record of the Sortlist citation and its NAP comparison; Clutch recorded as pending without a URL; the AI-citation follow-up recorded where the next SEO run reads it.

**Non-Goals:** editing any directory profile; `sameAs` (NRD-248); Clutch's URL (NRD-292); running the AI-citation check now; changing the site.

## Decisions

**Approach.** One documentation commit. The real-browser check comes first and its observations, not the owner's comment, fill the Sortlist row; if no real browser is available, the row carries the owner-entered data marked as such and the status "pendiente de comprobación en navegador real", and the orchestrator runs the check (see Owner-account actions). The "Citas de terceros" subsection keeps its existing table and Malt row (historical, dated 2026-11-15) and gains the Sortlist and Clutch rows plus a dated intro sentence that replaces "no directory ... was found" with the 2026-11-18 state. The follow-up check goes into a "Seguimiento" paragraph at the end of that subsection and into a new "## Pending checks" section at the end of the SEO brief, so the scheduled run actually performs it and reports it like any other finding.

**Files (layer `app`; both are shared paths routed to the story's only layer).**

- Modify `docs/seo-audit/local-signals-2026-11.md`:
  - "Fuentes y fechas": new row `L5`, "Owner's Sortlist and Clutch sign-up (NRD-160 comments, 2026-11-18) and real-browser read of the Sortlist profile", date of the check, used for "Citas de terceros".
  - "Consistencia NAP" table, row "Third-party citations": Sortlist values as observed (name, address, phone) with evidence `L5`.
  - "Citas de terceros": intro sentence updated with the 2026-11-18 state; table rows for Sortlist (URL `https://www.sortlist.es/agency/nuria-romero`; name, address and phone as shown; date "2026-11-18 (alta), <fecha> (comprobación en navegador real)"; status "Pública; enlaza a nuriaromero.dev; servicios: Desarrollo de software a medida desde 999 EUR; SEO local desde 300 EUR/mes + IVA, enlaza a /seo-local-sevilla/"; any NAP difference stated as "discrepancia: <campo> (para la propietaria)") and for Clutch (URL cell "sin URL pública", status "pendiente de revisión (NRD-292)").
  - "Seguimiento" paragraph: "Comprobación pendiente para la próxima ejecución SEO programada: si ChatGPT y Perplexity citan nuriaromero.dev (o el perfil de Sortlist) al responder `aplicaciones web a medida sevilla` y `desarrollo de software a medida sevilla`. Línea base 2026-11-15: no citado (NRD-124). Se registra el resultado, sin prometer ninguno."
- Modify `.claude/harness/seo.md`: append `## Pending checks` with one bullet (queries, engines ChatGPT and Perplexity, baseline 2026-11-15 not cited per NRD-124, origin NRD-160 and the Sortlist citation of 2026-11-18, "report the result once and remove this entry"). `.claude/` guard: no change to `permissions.deny`, no allow rule reading `.env`, no change to the team-harness plugin, its hooks or `.claude/harness.json`.

Data values in the documents stay in Spanish where they quote the profile or the site (document convention: analysis in English, wording verbatim).

**Interfaces.** None.

**Data.** None (no schema, storage or settings impact).

**Test plan (TDD order).** No behavior change, so no new test (`skip_specs: true`; same precedent as NRD-77, which created this document without tests). Checks: `node --test tests/*.test.js` stays green; `git diff develop --stat` lists only the two files; `pnpm format` on both files.

**Real-browser / e2e checks.** `docs/` is QA-exempt (`repo.qaExemptPaths`) but `.claude/harness/seo.md` is not, so QA may or may not run on this PR; the Sortlist check therefore runs inside the subtask, and QA, when it runs, repeats it:

1. Open `https://www.sortlist.es/agency/nuria-romero` in a real Chrome (devtools-mcp on the CDP port 9333; not `curl`/fetch, which get 403). Expect the public agency page without a login wall.
2. Read the name ("Nuria Romero"), locality (Sevilla, or the full address `SITE.address.full`), phone ("611 812 431" in any spacing or with +34), and the website link (`https://nuriaromero.dev`, with or without trailing slash or tracking parameters added by Sortlist). Read the listed services and minimum prices.
3. Screenshot to `$TMPDIR/nuriaromero-qa/NRD-160/sortlist-profile.png`, cited in the PR.
4. The document row equals what the browser shows. A NAP difference is not a failure: it must appear in the row and in the PR for the owner. A failure is a non-public profile, or a row that disagrees with the page.

**ADRs relied on.** ADR 0013 (owner pages: the SEO local service links to `/seo-local-sevilla/`), ADR 0012 (keyword ownership, unaffected).

## Owner-account actions (executed by the orchestrator)

- Open the public Sortlist profile in the user's signed-in Chrome and compare its NAP with `SITE`, only if neither the developer nor QA could reach a real browser: **executable owner action** (attended session in the user's browser; unattended, queued in `.claude/state/attended-actions.json`). Read-only; never edit the profile.
- Correct any NAP mismatch on the Sortlist profile, or enter the tax ID: **hard limit** (provider/site settings in the owner's account; the story says the team does not edit the profile).

## Risks / Trade-offs

- Sortlist may also block the CDP-driven Chrome as a bot. Then the fallback is the orchestrator's check in the user's browser; the row stays "pendiente de comprobación" rather than copying the owner's comment as verified.
- Editing the SEO brief adds a standing instruction that must be removed once reported; the bullet says so, so it does not linger.
- The audit document mixes a dated November baseline with a later update; the intro sentence dates each state to keep the record honest.

## UI spec

No UI surface. This story changes only `docs/seo-audit/local-signals-2026-11.md` and `.claude/harness/seo.md`; neither is built into the site, so no page, component, token, copy or responsive behavior changes and nothing visible to visitors changes. It carries the `app` layer label only because that layer owns the shared doc paths. Checklist items 1-9: n/a. `ux-review` has nothing to check beyond confirming the diff touches no file under `src/`.
