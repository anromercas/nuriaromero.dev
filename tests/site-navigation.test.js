import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const { serviceMenuGroups, serviceMenuLinks, sectorLinks } = await import(
  new URL("../src/data/navigation.ts", import.meta.url)
);
const { services } = await import(
  new URL("../src/data/services.ts", import.meta.url)
);
const { niches } = await import(
  new URL("../src/data/niches.ts", import.meta.url)
);
const { internalLinksBySource } = await import(
  new URL("../src/data/internal-links.ts", import.meta.url)
);

const CAPILAR = "/seo-para-clinicas-capilares-sevilla/";
const nicheSlugs = niches.map((n) => n.slug);

test("service menu has two headed groups in the agreed order", () => {
  assert.deepEqual(
    serviceMenuGroups.map((g) => g.heading),
    ["Visibilidad", "Webs y desarrollo"],
  );
  assert.deepEqual(
    serviceMenuGroups.map((g) => g.items.map((i) => i.url)),
    [
      ["/seo-local-sevilla/", "/seo-para-ia/"],
      [
        "/diseno-web-sevilla/",
        "/tienda-online-sevilla/",
        "/desarrollo-software-medida/",
        "/automatizaciones/",
        "/inteligencia-artificial/",
      ],
    ],
  );
});

test("no niche or capilar page is in the service menu", () => {
  const urls = serviceMenuLinks.map((l) => l.url);
  for (const slug of [...nicheSlugs, CAPILAR])
    assert.ok(!urls.includes(slug), slug);
  assert.deepEqual(
    serviceMenuLinks,
    serviceMenuGroups.flatMap((g) => g.items),
  );
});

test("sectorLinks are the niches then capilar, titled by breadcrumbName", () => {
  assert.deepEqual(
    sectorLinks.map((l) => l.url),
    [...nicheSlugs, CAPILAR],
  );
  const bySlug = new Map(
    [...niches, ...services].map((p) => [p.slug, p.breadcrumbName]),
  );
  for (const l of sectorLinks) assert.equal(l.title, bySlug.get(l.url));
});

test("every services/niches page is classified exactly once", () => {
  const classified = [...serviceMenuLinks, ...sectorLinks].map((l) => l.url);
  assert.equal(new Set(classified).size, classified.length, "no duplicates");
  const expected = new Set([...services, ...niches].map((p) => p.slug));
  assert.deepEqual(new Set(classified), expected);
});

test("every navigation url ends with a slash", () => {
  for (const l of [...serviceMenuLinks, ...sectorLinks])
    assert.ok(l.url.endsWith("/"), l.url);
});

test("parent services link their sector pages contextually", () => {
  const has = (source, path) =>
    internalLinksBySource[source].some(
      (l) => l.path === path && l.kind === "contextual",
    );
  for (const slug of nicheSlugs)
    assert.ok(has("/diseno-web-sevilla/", slug), slug);
  assert.ok(has("/seo-local-sevilla/", CAPILAR));
});

const header = await readFile(
  new URL("../src/components/Header.astro", import.meta.url),
  "utf8",
);
const footer = await readFile(
  new URL("../src/components/Footer.astro", import.meta.url),
  "utf8",
);

test("Header reads navigation data, not page lists", () => {
  assert.match(header, /from "@\/data\/navigation"/);
  assert.doesNotMatch(header, /@\/data\/niches/);
  assert.doesNotMatch(header, /@\/data\/services/);
  assert.ok(!header.includes("[...services, ...niches]"));
});

test("Header renders group headings as non-interactive <p> labelling their lists", () => {
  assert.equal(
    header.split("serviceMenuGroups.map").length - 1,
    2,
    "desktop and mobile",
  );
  assert.match(header, /<p\s+id=\{`servicios-grupo-\$\{i\}`\}/);
  assert.match(header, /<p\s+id=\{`servicios-movil-grupo-\$\{i\}`\}/);
  assert.match(header, /aria-labelledby=\{`servicios-grupo-\$\{i\}`\}/);
  assert.match(header, /aria-labelledby=\{`servicios-movil-grupo-\$\{i\}`\}/);
  assert.doesNotMatch(header, /<(a|button|h\d)\b[^>]*>\s*\{group\.heading\}/);
});

test("Header active state comes from serviceMenuLinks", () => {
  assert.match(header, /isServiciosActive\s*=\s*serviceMenuLinks\.some\(/);
});

test("Header keeps touch targets", () => {
  assert.ok(header.includes("flex min-h-12 items-center px-4 py-2.5 text-sm"));
  assert.ok(header.includes("mobile-accordion-btn flex min-h-11 min-w-11"));
});

test("Footer shows Servicios and Por sector from navigation data", () => {
  assert.ok(footer.includes("Por sector"));
  assert.ok(!footer.includes("Webs por sector"));
  assert.ok(
    footer.includes("sectorLinks") && footer.includes("serviceMenuLinks"),
  );
  assert.doesNotMatch(footer, /@\/data\/niches/);
  assert.doesNotMatch(footer, /@\/data\/services/);
});

test("check-seo-02 flags niche pages as sector pages, rejected in the header", async () => {
  const src = await readFile(
    new URL("../scripts/check-seo-02.mjs", import.meta.url),
    "utf8",
  );
  for (const slug of [
    "restaurantes",
    "clinicas",
    "comercios",
    "abogados-gestorias",
  ]) {
    assert.match(
      src,
      new RegExp(`url: "/web-para-${slug}-sevilla/"[^}]*sector: true`),
    );
  }
  assert.ok(!/capilares[^}]*sector: true/.test(src));
  assert.ok(
    src.includes("navigation: sector page must not be in the header menu"),
  );
});
