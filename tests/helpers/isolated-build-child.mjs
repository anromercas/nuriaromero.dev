// Runs one Astro build for tests/helpers/isolated-build.mjs in its own process.
import { join } from "node:path";
import { build } from "astro";

const root = process.argv[2];
if (!root) {
  console.error("isolated-build-child: missing root argument");
  process.exit(2);
}

await build({
  root,
  cacheDir: join(root, ".astro-cache"),
  logLevel: "error",
});
