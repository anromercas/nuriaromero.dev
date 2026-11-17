import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../..");
const self = fileURLToPath(import.meta.url);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

test("theme toggle component, script and icons are gone", () => {
  for (const rel of [
    "src/components/ThemeToggle.astro",
    "src/scripts/theme-toggle.js",
    "src/components/icons/Sun.astro",
    "src/components/icons/Moon.astro",
    "src/components/icons/System.astro",
  ]) {
    assert.equal(existsSync(join(root, rel)), false, `${rel} must not exist`);
  }
});

test("nothing references the theme toggle or its icons", () => {
  const pattern =
    /ThemeToggle|theme-toggle|icons\/(Sun|Moon|System)(\.astro)?["']/;
  const files = ["src", "scripts", "tests"]
    .map((d) => join(root, d))
    .filter((d) => existsSync(d))
    .flatMap(walk)
    .filter((f) => f !== self && /\.(astro|js|mjs|ts|tsx|css|md|mdx)$/.test(f));
  for (const file of files) {
    assert.doesNotMatch(
      readFileSync(file, "utf8"),
      pattern,
      `${file} still references the theme toggle`,
    );
  }
});

test("header renders a single white logo image", () => {
  const header = readFileSync(
    join(root, "src/components/Header.astro"),
    "utf8",
  );
  assert.equal((header.match(/<Image\b/g) ?? []).length, 1);
  assert.match(
    header,
    /import\s+\w+\s+from\s+"@\/assets\/nuriaromerodev-logo-blanco\.svg"/,
  );
  assert.doesNotMatch(header, /dark:hidden|dark:block|logo-negro/);
  assert.match(header, /alt="Nuria Romero, nuriaromero\.dev"/);
  assert.match(header, /loading="eager"/);
});

test("the black logo asset is gone", () => {
  assert.equal(
    existsSync(join(root, "src/assets/nuriaromerodev-logo-negro.svg")),
    false,
  );
});

test("layout has no colour-scheme media block styling body and stays dark", () => {
  const layout = readFileSync(join(root, "src/layouts/Layout.astro"), "utf8");
  assert.doesNotMatch(
    layout,
    /@media\s*\(prefers-color-scheme[^)]*\)\s*\{\s*body\s*\{/,
  );
  assert.match(layout, /class="dark"/);
  assert.match(layout, /color-scheme:\s*dark/);
});
