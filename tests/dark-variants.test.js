import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../..");

// Files or directories that must stay free of `dark:` variants (the site is dark-only).
const SCOPES = ["src"];

// A class token, not a word like "dark-only" in a comment.
const DARK = /(^|[\s"'`{(])dark:/;

function walk(path) {
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path).flatMap((name) => walk(join(path, name)));
}

test("no dark: variant anywhere under src", () => {
  const hits = [];
  for (const scope of SCOPES) {
    for (const file of walk(join(root, scope))) {
      if (!/\.(astro|ts|js|mjs|css)$/.test(file)) continue;
      readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (DARK.test(line))
            hits.push(`${relative(root, file)}:${i + 1}: ${line.trim()}`);
        });
    }
  }
  assert.deepEqual(hits, [], `dark: variants found:\n${hits.join("\n")}`);
});

test("tailwind config has no darkMode setting", () => {
  assert.doesNotMatch(
    readFileSync(join(root, "tailwind.config.mjs"), "utf8"),
    /\bdarkMode\s*:/,
  );
});

test("home hero keeps a space after </strong> before the next word", () => {
  const src = readFileSync(join(root, "src/pages/index.astro"), "utf8");
  assert.doesNotMatch(src, /<\/strong>[A-Za-zÁ-ú]/);
});

// Inline text must stay glued to its tags: punctuation on its own line after a
// closing inline tag renders as " ." (whitespace between the link and the dot).
test("pages keep punctuation glued to a closing inline tag", () => {
  const hits = [];
  for (const file of walk(join(root, "src/pages"))) {
    if (!file.endsWith(".astro")) continue;
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (
        i > 0 &&
        /^\s*[.,:;]/.test(line) &&
        /<\/(a|strong|em|b|span)>\s*$/.test(lines[i - 1])
      )
        hits.push(`${relative(root, file)}:${i + 1}: ${line.trim()}`);
    });
  }
  assert.deepEqual(hits, [], `detached punctuation:\n${hits.join("\n")}`);
});
