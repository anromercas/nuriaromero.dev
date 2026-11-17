import test from "node:test";
import assert from "node:assert/strict";

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
