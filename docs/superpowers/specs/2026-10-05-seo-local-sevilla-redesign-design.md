# SEO Local Sevilla Redesign Design

**Date:** 2026-10-05
**Status:** Approved visual direction; ready for implementation planning
**Surface:** `/seo-local-sevilla/`
**Mode:** Persuade

## Goal

Redesign the SEO local service page so a local-business owner in Seville feels their visibility problem has been understood, can see the concrete work behind the service, and has one unambiguous next action: reserve a call.

## Scope

This is a replacement visual and content treatment for the existing SEO local route, not a new service. It retains the service-page architecture and booking flow while replacing the old offer, copy hierarchy, and presentation with the approved **“Parte de visibilidad local”** direction.

The page serves owners, managers, and decision-makers of Seville local businesses where each client matters. It must speak to general businesses, not a clinic niche.

## Source of Truth

- `PRODUCT.md` defines the current product and commercial constraints.
- `odd/tasks/seo-local-sevilla.md` holds the user-validated brief and historical implementation record.
- `src/data/services.ts` is the intended single source of commercial page data.
- Existing shared service components and the route are implementation evidence, not authority for superseded pricing or claims.

## Commercial Facts and Copy Guardrails

| Item | Approved fact |
| --- | --- |
| Plan Local | 300 EUR/month, taxes not included |
| Plan Local Pro | 500 EUR/month, taxes not included; recommended |
| Initial standalone project | Not offered |
| Contractual minimum | Not confirmed; do not state one |
| Primary conversion | Reserve a call |

The page may explain the work and measurement, but must not state or imply guaranteed rankings, traffic, leads, calls, or AI-assistant recommendations. It must avoid clinic-only terms such as “patients” and “treatments.” Any technical term must be explained in plain business language at first use.

## Experience Direction

### Visual world: Parte de visibilidad local

The page should feel like a careful, high-signal audit sheet rather than a generic service landing page:

- dark technical working surface with generous negative space;
- thin inspection rules, restrained grids, and status labels that clarify progression;
- one deliberate blue annotation gesture for diagnosis or emphasis;
- yellow reserved for the recommended Local Pro plan and the strongest action moments;
- clear, sober typography and practical Spanish copy over decorative effects;
- motion, if used, only to help reveal sequence or focus, never to distract from reading or action.

### Conversion narrative

The content must progress in this order:

1. **Symptom:** the owner recognizes the mismatch between being present online and being found when it matters.
2. **What is failing:** the page names the visibility gaps without assuming the visitor knows SEO terminology.
3. **What gets fixed:** the page makes the operational work concrete and intelligible.
4. **Plan scope:** the visitor can compare Local and Local Pro without hidden qualification or invented commitments.
5. **Verifiable proof:** only evidence that can be shown truthfully; no invented results, social proof, rankings, or testimonials.
6. **FAQs:** answer practical buying objections in clear language.
7. **Final CTA:** reiterate the diagnostic value and link to the existing call-booking action.

The hero should establish the business pain and immediately offer “Reservar una llamada.” Secondary actions may support page exploration, but must not compete with the booking conversion.

## Content Hierarchy

### Hero

- Eyebrow/status label establishing local visibility context.
- H1 centered on the commercial consequence of being hard to find locally, rather than SEO jargon.
- Short supporting paragraph that names Google/Maps and the gap between visibility and useful enquiries without making a performance promise.
- Primary `BookingButton` labelled for booking a call.
- Compact diagnostic/annotation motif that reinforces the audit-sheet visual direction.

### Diagnostic sections

- A symptom-led section that reflects common owner pain in specific, plain language.
- A structured “inspection” sequence explaining the areas reviewed: business listing, accurate business information, local search intent, directory consistency, reviews process, content/website clarity, and measurement.
- Brief translations of technical ideas into their business meaning. For example, explain that structured information helps search engines understand what the business does and where it serves; do not make the mechanism the headline.

### Plans

Use the same commercial facts consistently in page copy, the data model, SEO metadata, FAQ answers, and schema.

**Plan Local — 300 EUR/month + taxes**

- Google Business Profile work and current business information.
- Relevant local-search wording.
- Consistent business data in directories.
- Monthly photos and posts.
- Review-generation plan.
- Measurement of calls, clicks, and route requests where available.
- Monthly video report and next steps.
- Direct WhatsApp contact and quarterly call.

**Plan Local Pro — 500 EUR/month + taxes — recommended**

Includes Plan Local, plus:

- website redesign;
- complete review and strategic plan;
- website organization by services and areas;
- technical hygiene so search engines can interpret the site;
- clearer search-result titles;
- service and local-area pages when relevant to the business;
- content structure that helps Google and AI systems understand the business, without promising recommendation or citation;
- intentional internal linking.

The plan comparison must make the scope difference legible before the price. Yellow highlight is exclusive to Local Pro and key CTA emphasis; it cannot make the non-recommended plan hard to read or inaccessible.

### Proof and FAQs

The proof section is bounded by evidence. It may show the process, deliverables, real interface examples, or verified work samples only if their source and claim are confirmed. If no eligible proof is confirmed, replace outcome-shaped social proof with a transparent “what you will receive” evidence module; do not fabricate substitutes.

FAQs must directly answer buying questions such as suitability, what each plan covers, what happens in the call, how measurement is communicated, whether a website is needed, and whether there is a contractual minimum. They must not revive the retired initial-project offer or make timing/results guarantees.

### Final CTA

A calm closing diagnostic statement plus the same booking action. The page should make clear that the call assesses fit and the next useful step; it must not represent the call as a guaranteed audit or outcome unless that is separately confirmed.

## Components and Data Boundaries

### Reuse

- `src/pages/seo-local-sevilla.astro` remains the route composition boundary.
- `src/layouts/ServiceLayout.astro` remains responsible for shared service-page structure.
- `src/components/BookingButton.astro` remains the conversion mechanism and destination.
- `src/components/services/ServiceHero.astro`, `PricingCard.astro`, `FAQ.astro`, and `CTASection.astro` remain reusable presentation primitives when their APIs support the approved hierarchy.
- `src/data/services.ts` owns commercial strings, plan contents, FAQs, metadata, and labels that are page data rather than structural composition.

### New surface-specific composition

The route may add narrowly scoped presentational sections for the diagnostic narrative and verifiable-proof module. Do not generalize a component until a second live surface needs the same shape. Keep structural markup in the route or a focused page-local component; keep commercial facts in `seoLocal` data.

### Data integrity rules

- Do not duplicate the price or inclusions as independently editable literals across route components.
- Do not change shared component behavior for this visual treatment unless the limitation applies to more than this page and regression coverage can prove existing service pages preserve their output.
- Any schema generated from the shared service data must reflect the new plans and disclaimers exactly.

## Responsive and Accessibility Expectations

- Preserve a logical heading order: one H1, sections introduced by H2, plan/detail labels below their owning heading.
- Retain visible focus styles and keyboard-operable booking and FAQ controls.
- Do not communicate the recommended plan, diagnostic status, or important contrast through color alone; labels and text must carry the meaning.
- Maintain readable contrast for muted inspection labels, blue annotations, yellow highlights, and all buttons on the dark surface.
- On narrow screens, inspection panels and plan comparison must collapse into a single reading order without horizontal scrolling, clipped prices, or detached CTA controls.
- The booking action must remain visible and comfortably tappable across viewport sizes.
- Respect reduced-motion preferences for any animation.
- Use semantic lists for plan inclusions and accessible names for decorative or explanatory visual motifs.

## Non-goals

- No paid-media campaign, analytics implementation, remote publishing, or CRM changes.
- No niche-specific landing page, clinic-specific copy, or industry-specific imagery.
- No new pricing tiers, project setup fee, contractual-minimum claim, discounted price, or result guarantee.
- No fabricated reviews, case studies, rankings, performance metrics, or AI-recommendation claims.
- No sitewide visual-system replacement beyond tokens/components strictly required by this route.

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Superseded 299 EUR initial-project and 199/349 EUR tier copy survives in data, metadata, FAQ, or schema. | Search all SEO-local data and generated output for retired amounts and wording; update the data source first. |
| Strong diagnostic copy becomes an implied results promise. | Review every heading, CTA, FAQ, and plan bullet for claims about rankings, traffic, calls, leads, or AI recommendation. |
| Reusable component changes alter other service pages. | Prefer route-local composition; if shared code changes, compare generated output/routes for unaffected services. |
| Dark technical styling reduces legibility or mobile usability. | Verify desktop and mobile screenshots in a bounded pass; use semantic labels, contrast checks, keyboard checks, and reduced-motion behavior. |
| Proof section invites invented evidence. | Gate its content on confirmed sources; render transparent deliverable/process evidence when performance proof is unavailable. |

## Verification Plan

1. Run the project’s static/type check and production build.
2. Confirm generated SEO-local HTML/schema contains only 300 and 500 EUR/month plans, taxes-not-included messaging, Local Pro recommendation, and no initial-project/minimum-term assertion.
3. Search page data, route output, metadata, FAQs, and schema for retired 299, 199, 349, “proyecto inicial,” and clinic-only wording; resolve every match that belongs to this surface.
4. Inspect the page once at desktop and mobile widths in the browser: hierarchy, plan readability, CTA clarity, no overflow, and focused/keyboard-operable interactive elements.
5. Make one batched correction pass if needed, then confirm with one final desktop/mobile pass.
6. Run the established relevant tests and record any unavailable or failing check explicitly.

## Implementation Breakdown

1. Reconcile the existing SEO-local data, route composition, metadata/schema inputs, and task brief with the approved commercial facts; identify all retired claims before code changes.
2. Rework `seoLocal` as the single commercial-content source: plan data, plain-language diagnostic/support copy, FAQs, metadata, and any schema-fed fields.
3. Recompose the route into the approved diagnostic sequence and add only focused presentation units that the shared layout cannot express without unrelated regressions.
4. Apply the “Parte de visibilidad local” visual system in the smallest responsible styling boundary; preserve shared service-page behavior unless an extracted shared primitive has a proven second use.
5. Add or update targeted tests/fixtures only where existing project conventions support them; otherwise use explicit build/output and browser verification.
6. Run the verification plan, fix the bounded findings, and update the ODD task record with observed evidence and the resulting work-unit status.
