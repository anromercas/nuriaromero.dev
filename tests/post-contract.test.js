import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { postBodyHtml, postContract } from "../scripts/lib/post-contract.mjs";
import { bookingUrl } from "../src/data/site.ts";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const ld = (payload) =>
  `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;

const page = `<!doctype html><html lang="es"><head>
<title>Mi post | Nuria</title>
<meta name="description" content="Una descripción">
<link rel="canonical" href="https://nuriaromero.dev/blog/x/">
${ld({ "@context": "https://schema.org", "@graph": [{ "@type": "Organization" }, { "@type": "Article", headline: "Mi post" }] })}
${ld({ "@type": "BreadcrumbList", itemListElement: [] })}
${ld({ "@type": "WebSite" })}
</head><body><main><article>
<header><h1>Mi post</h1><p>Por <a href="/sobre-mi/">Nuria</a></p></header>
<div class="x" data-post-body><h2>A</h2><div><p>B <a href="/c/">d</a></p></div><p>E</p></div>
</article>
<nav aria-label="Contenido relacionado"><a href="/rel/">Relacionado</a></nav>
<section aria-labelledby="post-cierre-title"><h2 id="post-cierre-title">Cierre</h2><a href="${bookingUrl.replaceAll("&", "&amp;")}">Reservar</a></section>
</main></body></html>`;

test("postBodyHtml returns the inner HTML closed by balanced divs", () => {
  const body = postBodyHtml(page);
  assert.ok(body.includes("<h2>A</h2>"));
  assert.ok(body.includes("<p>E</p>"));
  assert.ok(!body.includes("Relacionado"));
  assert.ok(!body.includes("Mi post"));
});

test("postContract freezes head, JSON-LD and body", () => {
  const contract = postContract(page);
  assert.equal(contract.title, "Mi post | Nuria");
  assert.equal(contract.description, "Una descripción");
  assert.equal(contract.canonical, "https://nuriaromero.dev/blog/x/");
  assert.deepEqual(
    contract.jsonld.map((e) => e["@type"]),
    ["Article", "BreadcrumbList"],
  );
  assert.equal(contract.bodyText, "A B d E");
  assert.deepEqual(contract.bodyLinks, [{ href: "/c/", text: "d" }]);
});

test("a page without the marker throws", () => {
  assert.throws(
    () => postContract("<html><body><main></main></body></html>"),
    /post body marker not found/,
  );
});

test("the layout marks the body wrapper and package.json has check-seo-18", () => {
  assert.match(read("src/layouts/BlogPostLayout.astro"), /data-post-body/);
  const scripts = JSON.parse(read("package.json")).scripts;
  assert.equal(
    scripts["check:seo-18"],
    "pnpm build && node scripts/check-seo-18.mjs",
  );
  assert.equal(scripts["check:seo-18:dist"], "node scripts/check-seo-18.mjs");
  assert.ok(
    scripts["check:seo:dist"].includes("&& node scripts/check-seo-18.mjs"),
  );
});

// --- Structure rules (NRD-234) -------------------------------------------------

test("postContract rejects a post without exactly one h1", () => {
  assert.throws(
    () => postContract(page.replace("<h1>Mi post</h1>", "")),
    /exactly one h1 \(found 0\)/,
  );
  assert.throws(
    () =>
      postContract(page.replace("<h1>Mi post</h1>", "<h1>A</h1><h1>B</h1>")),
    /exactly one h1 \(found 2\)/,
  );
});

test("postContract rejects a missing or empty related links block", () => {
  const nav = /<nav aria-label="Contenido relacionado">[\s\S]*?<\/nav>/;
  assert.throws(
    () => postContract(page.replace(nav, "")),
    /related links block not found/,
  );
  assert.throws(
    () =>
      postContract(
        page.replace(
          nav,
          '<nav aria-label="Contenido relacionado"><p>x</p></nav>',
        ),
      ),
    /related links block not found/,
  );
});

test("postContract rejects a missing closing or one without the booking link", () => {
  const closing =
    /<section aria-labelledby="post-cierre-title">[\s\S]*?<\/section>/;
  assert.throws(
    () => postContract(page.replace(closing, "")),
    /closing booking link not found/,
  );
  assert.throws(
    () =>
      postContract(
        page.replace(
          closing,
          '<section aria-labelledby="post-cierre-title"><a href="/otro/">x</a></section>',
        ),
      ),
    /closing booking link not found/,
  );
});

test("postContract accepts an explicit bookingUrl", () => {
  const html = page.replace(
    /<section aria-labelledby[\s\S]*?<\/section>/,
    '<section aria-labelledby="post-cierre-title"><a href="/reserva/">x</a></section>',
  );
  assert.equal(
    postContract(html, { bookingUrl: "/reserva/" }).title,
    "Mi post | Nuria",
  );
});
