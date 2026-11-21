import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Regression (NRD-328, CI on Linux with pnpm): the isolated build must resolve
// packages through the repo's own node_modules by walking up from a root that
// lives inside the repo. A symlinked node_modules plus preserveSymlinks hides
// pnpm's nested siblings (astro -> zod) and the build fails on CI.
const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
const helper = read("./helpers/isolated-build.mjs");
const child = read("./helpers/isolated-build-child.mjs");

test("the isolated build does not symlink node_modules", () => {
  assert.doesNotMatch(helper, /symlink\(/);
});

test("the child build does not preserve symlinks", () => {
  assert.doesNotMatch(child, /preserveSymlinks/);
});

test("the temp root lives inside the repo so resolution walks up to its node_modules", () => {
  assert.doesNotMatch(helper, /tmpdir\(/);
  assert.match(helper, /\.astro/);
});
