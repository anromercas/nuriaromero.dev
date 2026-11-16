# Tasks

Prerequisite: NRD-163 (`nuriaromero-163-reusable-local-components`) merged into `develop`; rebase this branch on it before task 1.1.

## 1. Contact page on the template

- [ ] 1.1 [NRD-193 app] Restyle `src/components/ContactForm.astro` to the ink world with class attribute values only (`<style>` block and `src/scripts/contact-form.js` untouched) and register the `status-error` / `status-success` tokens in `DESIGN.md` and `src/styles/template.css`; tests: capture `tests/fixtures/contact-form.markup.txt` from unchanged `develop` and add the markup-without-classes equality and field assertions in `tests/contact-template.test.js` first; verify `node --test tests/*.test.js` and `pnpm build` green
- [ ] 1.2 [NRD-194 app] Recompose `src/pages/contacto.astro` (hero with booking and the form in the `visual` slot, 3-4 sourced FAQ items with owner links and FAQPage, NAP plus email and LinkedIn, no Service) and add `/contacto/` to `scripts/lib/template-pages.mjs` (`words: [150, 450]`, `service: false`); tests: page assertions in `tests/contact-template.test.js` first; verify suite, `pnpm build`, `pnpm check:seo:dist` (02, 07, 17) green

## Workflow follow-up

- QA runs the form states, contrast, keyboard and 375 px checks in design.md; `compliance-privacy` reviews the style-only form diff.
- Archive the change at dev-done (`/team-harness:dev`).
