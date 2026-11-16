import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const page = read("src/pages/sobre-mi.astro");

test("/sobre-mi/ renders on the template ground", () => {
  assert.match(page, /<main class="template-ground/);
  assert.match(page, /import Layout from "@\/layouts\/Layout\.astro"/);
});

test("/sobre-mi/ composes the template sections in order", () => {
  const order = [
    "<Breadcrumbs",
    "<SeoLocalHero",
    "<ProofStrip",
    "<SeoLocalProcess",
    "<RealProof",
    "<SeoLocalClosing",
  ];
  let last = -1;
  for (const tag of order) {
    const at = page.indexOf(tag);
    assert.ok(at > last, `${tag} appears after the previous section`);
    last = at;
  }
});

test("/sobre-mi/ drops the legacy blocks and the sections it does not carry", () => {
  for (const banned of [
    "components/Hero.astro",
    "<Hero",
    "AboutMe",
    "Experience",
    "TitleSection",
    "text-gray-",
    "bg-gray-",
    "SeoLocalFaq",
    "SeoLocalPlans",
    "SeoLocalNap",
    "ReviewBento",
  ]) {
    assert.ok(!page.includes(banned), `page has no ${banned}`);
  }
});

test("/sobre-mi/ uses the ink project cards and only published projects", () => {
  assert.match(page, /projectsVariant="ink"/);
  assert.match(page, /projects=\{\["arkady", "adfsevilla"\]\}/);
});

test("/sobre-mi/ emits Person and BreadcrumbList only", () => {
  assert.match(
    page,
    /schema=\{\[personSchema\(\), breadcrumbSchema\(breadcrumbs\)\]\}/,
  );
  assert.doesNotMatch(page, /faqSchema|serviceSchema/);
});

test("/sobre-mi/ links once to the home and once to SEO local", () => {
  const home = page.match(/<a href="\/">consultor SEO en Sevilla<\/a>/g) ?? [];
  assert.equal(home.length, 1);
  const local = page.match(/<a href="\/seo-local-sevilla\/">/g) ?? [];
  assert.equal(local.length, 1);
});

test("/sobre-mi/ puts the real portrait in the hero and not in the process", () => {
  assert.match(page, /@\/assets\/perfil-profesional\.webp/);
  assert.match(page, /<SeoLocalProcess[\s\S]*?portrait=\{false\}/);
  assert.match(
    page,
    /alt="Nuria Romero, desarrolladora web y consultora SEO en Sevilla"/,
  );
});

test("/sobre-mi/ keeps the career record as an ordered list in the aside slot", () => {
  assert.match(page, /slot="aside"/);
  assert.match(page, /<ol class="career-list"/);
});

test("the components only the old /sobre-mi/ used are gone", () => {
  for (const name of [
    "Hero",
    "AboutMe",
    "Experience",
    "ExperienceItem",
    "Badge",
    "SocialPill",
  ]) {
    assert.ok(
      !existsSync(new URL(`src/components/${name}.astro`, root)),
      `${name}.astro is deleted`,
    );
  }
});

test("templatePages registers /sobre-mi/ with 550-600 words and no Service", () => {
  const registry = read("scripts/lib/template-pages.mjs");
  assert.match(
    registry,
    /\{\s*route:\s*"\/sobre-mi\/",\s*words:\s*\[550,\s*600\],\s*service:\s*false\s*\}/,
  );
});
