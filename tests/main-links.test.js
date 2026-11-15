import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mainContent,
  visibleText,
  anchorsIn,
  linkInMain,
} from "../scripts/lib/main-links.mjs";

const page = (header, main, footer = "") =>
  `<html><body><header>${header}</header>${main}<footer>${footer}</footer></body></html>`;

test("link only in the header is not inside main", () => {
  const html = page(
    '<a href="/portfolio/">casos de éxito</a>',
    "<main><p>Hola</p></main>",
  );
  assert.equal(linkInMain(html, "/portfolio/", "casos de éxito"), false);
});

test("link only in the footer is not inside main", () => {
  const html = page(
    "",
    "<main><p>Hola</p></main>",
    '<a href="/portfolio/">casos de éxito</a>',
  );
  assert.equal(linkInMain(html, "/portfolio/", "casos de éxito"), false);
});

test("anchor as plain text plus a link with other text is false", () => {
  const html = page(
    "",
    '<main><p>casos de éxito</p><a href="/portfolio/">ver más</a></main>',
  );
  assert.equal(linkInMain(html, "/portfolio/", "casos de éxito"), false);
});

test("right text on a link with another href is false", () => {
  const html = page("", '<main><a href="/otra/">casos de éxito</a></main>');
  assert.equal(linkInMain(html, "/portfolio/", "casos de éxito"), false);
});

test("nested markup and entities are matched on visible text", () => {
  const html = page(
    "",
    '<main><a class="x" href="/seo-local-sevilla/"><span>SEO local</span> y GEO &amp; más</a></main>',
  );
  assert.equal(
    linkInMain(html, "/seo-local-sevilla/", "SEO local y GEO & más"),
    true,
  );
});

test("single-quoted href is read", () => {
  const html = page(
    "",
    "<main><a href='/portfolio/'>casos de éxito</a></main>",
  );
  assert.equal(linkInMain(html, "/portfolio/", "casos de éxito"), true);
});

test("every main block counts", () => {
  const html = page(
    "",
    '<main><p>uno</p></main><main><a href="/portfolio/">casos de éxito</a></main>',
  );
  assert.equal(linkInMain(html, "/portfolio/", "casos de éxito"), true);
});

test("page without main is always false", () => {
  const html = '<body><a href="/portfolio/">casos de éxito</a></body>';
  assert.equal(mainContent(html), "");
  assert.equal(linkInMain(html, "/portfolio/", "casos de éxito"), false);
});

test("helpers: visibleText and anchorsIn", () => {
  assert.equal(visibleText("<b>a</b>\n  &amp;  b "), "a & b");
  assert.deepEqual(anchorsIn('<a href="/x/">X <i>y</i></a><a>z</a>'), [
    { href: "/x/", text: "X y" },
    { href: null, text: "z" },
  ]);
});
