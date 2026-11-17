import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { focusableIn, nextFocusIndex } from "../src/scripts/focus-trap.js";

const readSource = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

const header = await readSource("src/components/Header.astro");

const openingTags = (source, name) =>
  source.match(new RegExp(`<${name}\\b[^>]*>`, "g")) ?? [];

test("no <ul> is a direct child of another <ul>", () => {
  assert.doesNotMatch(header, /<ul\b[^>]*>\s*<ul\b/);
});

test("desktop Servicios button is a disclosure with aria-expanded/aria-controls", () => {
  const button = openingTags(header, "button").find((tag) =>
    tag.includes('aria-controls="servicios-menu"'),
  );
  assert.ok(button, "button controls #servicios-menu");
  assert.match(button, /aria-expanded="false"/);
  assert.doesNotMatch(button, /aria-haspopup/);
  assert.doesNotMatch(button, /aria-label/);
  assert.match(header, /id="servicios-menu"/);
});

test("desktop panel is state-driven, not hover/focus-within driven", () => {
  assert.doesNotMatch(header, /group-hover:block|group-focus-within:block/);
});

test("no header link carries an aria-label replacing its visible text", () => {
  for (const tag of openingTags(header, "a")) {
    assert.doesNotMatch(tag, /aria-label/, tag);
  }
  assert.doesNotMatch(header, /aria-label=\{link\.label\}/);
});

test("mobile accordion panel is an inert div while closed", () => {
  const panel = openingTags(header, "div").find((tag) =>
    tag.includes('id="mobile-submenu-servicios"'),
  );
  assert.ok(panel, "accordion panel is a div");
  assert.match(panel, /\binert\b/);
  assert.match(panel, /mobile-accordion-panel/);
});

test("#mobile-menu is a modal dialog with its own close button", () => {
  const dialog = openingTags(header, "div").find((tag) =>
    tag.includes('id="mobile-menu"'),
  );
  assert.ok(dialog);
  assert.match(dialog, /role="dialog"/);
  assert.match(dialog, /aria-modal="true"/);
  assert.match(dialog, /aria-label="Menú de navegación"/);
  const drawer = header.slice(header.search(/<div\s+id="mobile-menu"/));
  assert.match(drawer, /id="mobile-menu-close"/);
  assert.match(drawer, /aria-label="Cerrar menú"/);
  assert.match(drawer, /min-h-11 min-w-11/);
});

test("header scripts are external modules (CSP, no inline)", () => {
  assert.match(header, /import "\.\.\/scripts\/header-services-menu\.js"/);
  assert.match(header, /import "\.\.\/scripts\/header-mobile-menu\.js"/);
  assert.doesNotMatch(header, /<script[^>]*is:inline/);
});

test("nextFocusIndex wraps forward and backward", () => {
  assert.equal(nextFocusIndex(3, 0, false), 1);
  assert.equal(nextFocusIndex(3, 2, false), 0);
  assert.equal(nextFocusIndex(3, 1, true), 0);
  assert.equal(nextFocusIndex(3, 0, true), 2);
});

test("nextFocusIndex handles unknown focus and empty lists", () => {
  assert.equal(nextFocusIndex(3, -1, false), 0);
  assert.equal(nextFocusIndex(3, -1, true), 2);
  assert.equal(nextFocusIndex(0, -1, false), -1);
});

test("focusableIn skips disabled, hidden and inert-contained elements", () => {
  const make = (id, { inert = false, disabled = false } = {}) => ({
    id,
    disabled,
    closest: (sel) => (sel === "[inert]" && inert ? {} : null),
  });
  const items = [
    make("a"),
    make("b", { inert: true }),
    make("c", { disabled: true }),
    make("d"),
  ];
  const root = { querySelectorAll: () => items };
  assert.deepEqual(
    focusableIn(root).map((el) => el.id),
    ["a", "d"],
  );
});
