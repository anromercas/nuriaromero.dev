// One isolated production build (ADR 0019, NRD-372): CONTEXT=production, fake
// credentials and a preloaded fetch stub. Proves a single Place Details request
// for the whole build and the reviews rendered on every page that shows them.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { isolatedBuild } from "./helpers/isolated-build.mjs";

const stub = fileURLToPath(
  new URL("./helpers/places-fetch-stub.mjs", import.meta.url),
);

const REVIEW_TEXT = "Reseña de prueba NRD-372";
const STAT = "4,8 en Google";
const PAGES = [
  "",
  "seo-local-sevilla",
  "diseno-web-sevilla",
  "tienda-online-sevilla",
  "desarrollo-software-medida",
  "automatizaciones",
  "inteligencia-artificial",
  "seo-para-ia",
  "sobre-mi",
  "portfolio",
];

const htmlOf = (dist, page) =>
  readFileSync(join(dist, page, "index.html"), "utf8");

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

describe("production build with Places credentials", () => {
  let build;
  let logDir;
  let logFile;

  before(
    async () => {
      logDir = mkdtempSync(join(tmpdir(), "nrd-places-stub-"));
      logFile = join(logDir, "requests.log");
      build = await isolatedBuild({
        env: {
          CONTEXT: "production",
          GOOGLE_PLACES_API_KEY: "test-key",
          GOOGLE_PLACE_ID: "test-place-id",
          PLACES_STUB_LOG: logFile,
        },
        preload: [stub],
      });
    },
    { timeout: 240_000 },
  );

  after(async () => {
    await build?.cleanup();
    if (logDir) rmSync(logDir, { recursive: true, force: true });
  });

  it("makes exactly one Place Details request for the whole build", () => {
    const lines = readFileSync(logFile, "utf8").split("\n").filter(Boolean);
    assert.equal(lines.length, 1);
    assert.match(lines[0], /\/test-place-id$/);
  });

  for (const page of PAGES) {
    it(`renders the reviews on /${page}`, () => {
      const html = htmlOf(build.dist, page);
      if (page === "portfolio") {
        assert.ok(html.includes(REVIEW_TEXT), "review quote missing");
      } else {
        assert.ok(
          html.includes(REVIEW_TEXT) || html.includes(STAT),
          "review quote and rating stat both missing",
        );
      }
    });
  }

  it("emits the reviews JSON-LD on the home", () => {
    const home = join(build.dist, "index.html");
    assert.match(readFileSync(home, "utf8"), /aggregateRating/);
  });

  it("never writes the API key into the output", () => {
    for (const file of walk(build.dist)) {
      assert.ok(
        !readFileSync(file).includes("test-key"),
        `API key leaked into ${file}`,
      );
    }
  });
});
