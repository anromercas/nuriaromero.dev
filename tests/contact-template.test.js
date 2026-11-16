import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

// Same normalisation used to capture tests/fixtures/contact-form.markup.txt,
// plus the one frontmatter import added later (the template tokens).
const withoutClasses = (source) =>
  source
    .replace('import "@/styles/template.css";\n', "")
    .replace(/\s(class|class:list)=(\{[^}]*\}|"[^"]*")/g, "")
    .replace(/\s+/g, " ")
    .trim();

const form = read("src/components/ContactForm.astro");

// --- ContactForm: style-only restyle (NRD-193) -------------------------------

test("ContactForm markup equals the baseline without classes", () => {
  const baseline = read("tests/fixtures/contact-form.markup.txt").trim();
  assert.equal(withoutClasses(form), baseline);
});

test("ContactForm keeps its fields, ids, required flags and consent", () => {
  for (const name of [
    "name",
    "email",
    "phone",
    "message",
    "_gotcha",
    "privacy",
  ]) {
    assert.match(form, new RegExp(`name="${name}"`), `field ${name}`);
  }
  for (const id of [
    "contact-form",
    "form-status",
    "submit-btn",
    "form-review-invite",
  ]) {
    assert.match(form, new RegExp(`id="${id}"`), `id ${id}`);
  }
  for (const id of ["name", "email", "message", "privacy"]) {
    assert.match(
      form,
      new RegExp(`id="${id}"[^>]*?\\srequired`, "s"),
      `${id} is required`,
    );
  }
  assert.doesNotMatch(form, /id="phone"[^>]*?\srequired/s);
  assert.match(form, /He leído y acepto la/);
  assert.match(form, /href="\/privacidad\/"/);
  assert.match(form, /política de privacidad/);
  assert.match(form, /class="hidden"/, "honeypot stays display:none");
  assert.match(form, /import "\.\.\/scripts\/contact-form\.js"/);
});

test("ContactForm no longer uses the old gray/blue world", () => {
  assert.doesNotMatch(
    form,
    /bg-gray-800|bg-blue-600|ring-blue-500|text-red-500/,
  );
  assert.match(form, /bg-\[var\(--card-surface\)\]/);
  assert.match(form, /focus-visible:outline-sky-400/);
});

test("#form-status remaps the script's toggled colours to status tokens", () => {
  assert.match(
    form,
    /text-gray-300 \[&\.text-red-600\]:text-\[var\(--status-error\)\]/,
  );
  assert.match(form, /\[&\.text-green-600\]:text-\[var\(--status-success\)\]/);
});

test("status tokens exist in DESIGN.md and template.css", () => {
  const design = read("DESIGN.md");
  const css = read("src/styles/template.css");
  assert.match(design, /status-error: "#fca5a5"/);
  assert.match(design, /status-success: "#86efac"/);
  assert.match(css, /--status-error:\s*#fca5a5\s*;/);
  assert.match(css, /--status-success:\s*#86efac\s*;/);
});

test("contact-form.js is untouched by the restyle", () => {
  const script = read("src/scripts/contact-form.js");
  assert.match(script, /text-red-600/);
  assert.match(script, /text-green-600/);
});

// --- /contacto/ on the template (NRD-194) ------------------------------------

const page = read("src/pages/contacto.astro");
const templatePages = read("scripts/lib/template-pages.mjs");

const faqBlock = () => {
  const start = page.indexOf("const contactFaqs");
  assert.ok(start > -1, "contactFaqs is declared in the page");
  return page.slice(start, page.indexOf("\n]", start) + 2);
};

test("/contacto/ is registered as a template page without Service", () => {
  assert.match(
    templatePages,
    /route:\s*"\/contacto\/",\s*words:\s*\[150,\s*450\],\s*service:\s*false/,
  );
});

test("contactFaqs has 3 or 4 items and feeds both FAQPage and the FAQ", () => {
  const questions = faqBlock().match(/\bq:\s*"/g) ?? [];
  assert.ok(
    questions.length >= 3 && questions.length <= 4,
    `3-4 questions, found ${questions.length}`,
  );
  assert.match(page, /faqSchema\(contactFaqs\)/);
  assert.match(page, /faqs=\{contactFaqs\}/);
  assert.match(page, /breadcrumbSchema\(breadcrumbs\)/);
});

test("the page has no Service entity", () => {
  assert.doesNotMatch(page, /serviceSchema/);
});

test("main uses the ink ground and the template sections", () => {
  assert.match(page, /<main class="template-ground[^"]*"/);
  assert.match(page, /<SeoLocalHero/);
  assert.match(page, /<SeoLocalFaq/);
  assert.match(page, /<SeoLocalNap/);
  assert.match(page, /id="preguntas"/);
});

test("the form sits in the hero visual slot and booking comes from the hero", () => {
  assert.match(page, /<ContactForm\s+slot="visual"/);
  const hero = read("src/components/seo-local/SeoLocalHero.astro");
  assert.match(hero, /<BookingButton/);
  assert.doesNotMatch(page, /<BookingButton/);
});

test("prices come only from tierFrom and no euro literal is in the page", () => {
  assert.match(page, /tierFrom\(seoLocal, "Local"\)/);
  assert.match(page, /tierFrom\(seoLocal, "Local Pro"\)/);
  assert.match(page, /tierFrom\(disenoWeb, "Landing de una página"\)/);
  assert.match(
    page,
    /tierFrom\(disenoWeb, "Web completa \(hasta 5 páginas\)"\)/,
  );
  assert.doesNotMatch(page, /€/);
});

test("FAQ answers link to the owner pages", () => {
  const faqs = faqBlock();
  for (const href of [
    "/seo-local-sevilla/",
    "/diseno-web-sevilla/",
    "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/",
  ]) {
    assert.ok(faqs.includes(`href: "${href}"`), `links to ${href}`);
  }
});

test("NAP block plus email and LinkedIn routes are present", () => {
  assert.match(page, /mailto:\$\{SITE\.email\}/);
  assert.match(page, /SITE\.sameAs\[0\]/);
  assert.match(page, /target="_blank" rel="noopener noreferrer"/);
});

test("the page has one H1 through the hero and no old-world classes", () => {
  assert.doesNotMatch(page, /<h1/);
  assert.match(page, /keyword="Contacto"/);
  assert.doesNotMatch(
    page,
    /MailIcon|LinkedInIcon|text-gray-|bg-gray-|blue-950/,
  );
});

// --- Review round: self-sufficient form and script/remap binding -------------

test("ContactForm loads the template tokens it depends on", () => {
  assert.match(form, /import\s+["']@\/styles\/template\.css["']/);
});

test("every status class the script toggles is remapped in #form-status", () => {
  const script = read("src/scripts/contact-form.js");
  const toggled = new Set(
    [...script.matchAll(/text-(?:red|green|gray)-\d+/g)].map((m) => m[0]),
  );
  assert.ok(toggled.size >= 3, "script toggles its status classes");
  const status = form.match(/<p id="form-status"\s+class="([^"]*)"/)?.[1] ?? "";
  assert.ok(status, "#form-status class found");
  const remapped = new Set(
    [...status.matchAll(/\[&\.(text-[\w-]+)\]:/g)].map((m) => m[1]),
  );
  const initial = status.split(/\s+/).filter((c) => /^text-gray-\d+$/.test(c));
  for (const cls of toggled) {
    if (initial.includes(cls)) continue;
    assert.ok(remapped.has(cls), `${cls} toggled by the script has no remap`);
  }
  for (const cls of remapped) {
    assert.ok(toggled.has(cls), `remap for ${cls} is never toggled by the script`);
  }
  assert.ok(initial.length > 0, "initial neutral class kept on #form-status");
});
