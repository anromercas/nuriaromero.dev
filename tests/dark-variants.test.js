import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../..");

// Files or directories that must stay free of `dark:` variants (the site is dark-only).
const SCOPES = [
  "src/layouts/Layout.astro",
  "src/layouts/BlogPostLayout.astro",
  "src/layouts/LegalLayout.astro",
  "src/components/Header.astro",
  "src/components/Footer.astro",
  "src/components/EntryContentStyles.astro",
  "src/components/services/PricingCard.astro",
  "src/components/services/ServiceHero.astro",
  "src/components/services/FAQ.astro",
  "src/components/services/CTASection.astro",
  "src/components/services/ProcessSteps.astro",
  "src/components/services/BenefitsGrid.astro",
  "src/components/Breadcrumbs.astro",
  "src/components/TitleSection.astro",
  "src/components/InternalLinks.astro",
];

// A class token, not a word like "dark-only" in a comment.
const DARK = /(^|[\s"'`{(])dark:/;

function walk(path) {
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path).flatMap((name) => walk(join(path, name)));
}

test("no dark: variant in layouts and components", () => {
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
