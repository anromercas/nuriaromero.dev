import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const layout = readFileSync(
  new URL("../src/layouts/Layout.astro", import.meta.url),
  "utf8",
);

test("Layout has no OS color scheme media query (site is dark-only)", () => {
  assert.doesNotMatch(layout, /prefers-color-scheme/);
});

test("Layout has no dead #header-nav rule or blur keyframes", () => {
  assert.doesNotMatch(layout, /#header-nav/);
  assert.doesNotMatch(layout, /@keyframes\s+blur/);
});

test("Layout keeps the fixed dark mode setup", () => {
  assert.match(layout, /<html lang="es" class="dark">/);
  assert.match(layout, /color-scheme:\s*dark/);
});
