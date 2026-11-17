import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");
const titleProp = (src) => src.match(/^\s*title="([^"]*)"/m)?.[1];

test("brandedTitle appends the canonical brand once", async () => {
  const { brandedTitle } = await import("../src/lib/seo-title.ts");
  assert.equal(brandedTitle("Aviso legal"), "Aviso legal | Nuria Romero");
  assert.equal(
    brandedTitle(
      "Diseño web Sevilla | Diseñadora web, precio cerrado desde 149 €",
    ),
    "Diseño web Sevilla | Diseñadora web, precio cerrado desde 149 € | Nuria Romero",
  );
});

test("brandedTitle leaves a title already ending with the brand unchanged", async () => {
  const { brandedTitle } = await import("../src/lib/seo-title.ts");
  const title = "Recursos para citar y compartir — Nuria Romero";
  assert.equal(brandedTitle(title), title);
  assert.equal(
    brandedTitle(brandedTitle("Cookies")).match(/Nuria Romero/g).length,
    1,
  );
});

test("home title keeps the keyword first and has no mid-string brand", async () => {
  const title = titleProp(await source("src/pages/index.astro"));
  assert.ok(title.startsWith("Consultor SEO en Sevilla"));
  assert.doesNotMatch(title, /Nuria Romero/);
});

test("sobre-mi title does not contain the brand", async () => {
  const title = titleProp(await source("src/pages/sobre-mi.astro"));
  assert.equal(title, "Sobre mí — Desarrolladora web en Sevilla");
});

test("legal pages stop using the domain as brand", async () => {
  for (const [page, expected] of [
    ["aviso-legal", "Aviso legal"],
    ["privacidad", "Política de privacidad"],
    ["cookies", "Política de cookies"],
  ]) {
    assert.equal(titleProp(await source(`src/pages/${page}.astro`)), expected);
  }
});

test("SEO.astro renders <title> branded and og/twitter titles raw", async () => {
  const seo = await source("src/components/seo/SEO.astro");
  assert.match(seo, /<title>\{brandedTitle\(title\)\}<\/title>/);
  assert.match(seo, /property="og:title" content=\{title\}/);
  assert.match(seo, /name="twitter:title" content=\{title\}/);
});

test("reviewsSchema node carries name and url for the shared business id", async () => {
  const { reviewsSchema, localBusinessSchema } = await import("../src/lib/schema.ts")
  const node = reviewsSchema({
    rating: 5,
    userRatingCount: 1,
    placeId: "fixture",
    reviews: [{ author: "Ana", rating: 5, text: "Muy bien" }],
  })
  assert.equal(node["@id"], "https://nuriaromero.dev/#business")
  assert.equal(node.name, "Nuria Romero")
  assert.equal(node.url, "https://nuriaromero.dev")
  assert.equal(localBusinessSchema().alternateName, "nuriaromero.dev")
})

test("header logo link is named with the brand and the visible wordmark", async () => {
  const { SITE } = await import("../src/data/site.ts")
  const header = await source("src/components/Header.astro")
  const link = header.match(/<a\s+href="\/"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? ""
  assert.ok(link, "logo link not found")
  assert.doesNotMatch(link, /aria-label/)
  const alt = link.match(/<Image[\s\S]*?alt="([^"]*)"/)?.[1]
  assert.equal(alt, "Nuria Romero, nuriaromero.dev")
  assert.ok(alt.startsWith(SITE.name))
  assert.ok(alt.includes(SITE.shortName))
})

test("llms.txt introduces the site as the website of the canonical brand", async () => {
  const lines = (await source("public/llms.txt")).split("\n")
  assert.equal(lines[0], "# Nuria Romero")
  assert.match(lines[2], /la web de Nuria Romero \(nuriaromero\.dev\)/)
})
