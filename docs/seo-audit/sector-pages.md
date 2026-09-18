# Strengthen the four sector pages

**Priority:** High
**Evidence:** Four sector pages were identified in the audit; each needs meaningful unique content, proof, and a relevant CTA.
**Dependencies:** Accurate service details and evidence that can be shared publicly.

## Steps

1. Review each of the four existing sector pages independently and note its intended audience, needs, and service fit.
2. Replace generic or repeated copy with useful sector-specific information: relevant problems, approach, deliverables, constraints, and realistic outcomes.
3. Add proof only where substantiated and permitted (for example, a relevant project, testimonial, or concrete experience); do not imply results without evidence.
4. Give each page a clear next step appropriate to that audience.
5. Compare all four pages side by side to ensure they are not near-duplicates.

## Acceptance criteria

- [x] Each page offers meaningful information specific to its sector, not merely swapped keywords or industry labels. (Confirmed in the 2026-09-18 review; content already differentiated by benefits/process/pricing/FAQ.)
- [x] Claims and proof are accurate, attributable, and approved for publication. Revised unsupported claims: removed the "2 seconds / 3G" speed promise (restaurantes), the "Primera en tu especialidad" ranking guarantee and the full-RGPD-compliance wording (clínicas), qualified "sin comisiones" to note payment-gateway fees still apply (comercios), removed "Discreción absoluta" and softened the "las IAs citan" / "mejor posiciona" claims (profesionales), and changed deterministic "convierten" outcome language to "ayudan a convertir" in all four hero subtitles. No new proof, testimonials, or project references were added — none were available to substantiate.
- [x] Each page has a clear, relevant CTA and a coherent heading/content structure. Added a sector-specific `cta` field (`src/data/niches.ts`) wired through `ServiceLayout.astro` into the shared `CTASection`, replacing the generic CTA copy with one CTA per sector.
- [x] No new geo-targeted page is added unless it offers distinct local value, evidence, and a useful purpose beyond location-name substitution. (No new page created.)

## Verification

- `pnpm astro check`: 0 errors.
- `pnpm build`: 21 pages built, no errors.
- Desktop screenshot of `/web-para-clinicas-sevilla/` confirms the new per-sector CTA and corrected copy render correctly.
- Mobile emulation via the browser tool did not actually shrink the viewport in this session, so mobile rendering was not visually confirmed. Risk is low since only text content and an already-optional component prop changed (no layout/CSS touched), but this should be spot-checked on a real device or with working responsive tooling before considering this fully verified.
- Lead/ranking impact remains unverified, as before — no analytics claim is made.
