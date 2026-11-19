import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

// NRD-311: in CI the unit tests run after `pnpm build`, so the dist/ cases
// execute. If the build is missing there, fail instead of skipping silently.
const distDir = new URL("../dist/", import.meta.url);
const hasBuild =
  existsSync(new URL("index.html", distDir)) &&
  existsSync(new URL("_astro/", distDir));
const inCI = process.env.CI === "true";

test(
  "in CI the unit tests run on a built dist/ (NRD-311)",
  { skip: !inCI && "not in CI" },
  () => {
    assert.ok(
      hasBuild,
      "dist/ is not built: in CI, pnpm build must run before node --test (NRD-311)",
    );
  },
);
