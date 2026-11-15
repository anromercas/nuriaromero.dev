import assert from "node:assert/strict";
import test from "node:test";

import { countH1 } from "../scripts/lib/one-h1.mjs";

test("countH1 returns 2 for a page with two H1", () => {
  const html = `<main><section><h1>Uno</h1></section><section><h1>Dos</h1></section></main>`;
  assert.equal(countH1(html), 2);
});

test("countH1 returns 0 for a page with only H2 headings", () => {
  const html = `<main><h2>Uno</h2><h2>Dos</h2></main>`;
  assert.equal(countH1(html), 0);
});

test("countH1 ignores markup that is not a heading", () => {
  const html = [
    `<!-- <h1>old</h1> -->`,
    `<script>const s = "<h1>"</script>`,
    `<style>/* <h1> */</style>`,
    `<template><h1>tpl</h1></template>`,
    `<header class="site">nav</header>`,
    `<h10>not a heading</h10>`,
    `<H1 class="kw">Real</H1>`,
  ].join("\n");
  assert.equal(countH1(html), 1);
});

test("countH1 returns 1 for a minimal real page shape", () => {
  const html = `<!doctype html><html><head><title>t</title></head><body><header><nav>x</nav></header><main><h1 class="a">Titulo</h1><h2>Sub</h2></main><footer>f</footer></body></html>`;
  assert.equal(countH1(html), 1);
});

test("countH1 counts self-closing-like and attribute-less start tags", () => {
  assert.equal(countH1(`<h1>a</h1><h1\n class="x">b</h1>`), 2);
});
