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
