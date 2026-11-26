// One isolated production build (ADR 0019, NRD-372): CONTEXT=production, fake
// credentials and a preloaded fetch stub. Proves a single Place Details request
// for the whole build and the reviews rendered on every page that shows them.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { isolatedBuild } from "./helpers/isolated-build.mjs";

const stub = fileURLToPath(
  new URL("./helpers/places-fetch-stub.mjs", import.meta.url),
);

const REVIEW_TEXT = "Reseña de prueba NRD-372";
const NOT_QUOTED_TEXT = "Segunda reseña NRD-376";
const STAT = "4,8 en Google";
const CHECK = fileURLToPath(
  new URL("../scripts/check-google-reviews.mjs", import.meta.url),
);

const runCheck = (file) =>
  spawnSync(process.execPath, [CHECK, file], { encoding: "utf8" });

const jsonLdBlocks = (html) =>
  [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((m) => m[1]);
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

  it("passes check-google-reviews on the built home", () => {
    const result = runCheck(join(build.dist, "index.html"));
    assert.equal(result.status, 0, result.stderr);
  });

  it("declares exactly one Review on the home, the quoted one", () => {
    const html = htmlOf(build.dist, "");
    const reviews = [];
    const collect = (value) => {
      if (Array.isArray(value)) return value.forEach(collect);
      if (value && typeof value === "object") {
        if ([value["@type"]].flat().includes("Review")) reviews.push(value);
        Object.values(value).forEach(collect);
      }
    };
    jsonLdBlocks(html).forEach((body) => collect(JSON.parse(body)));
    assert.equal(reviews.length, 1);
    assert.equal(reviews[0].reviewBody, REVIEW_TEXT);
    assert.ok(!html.includes(NOT_QUOTED_TEXT), "not quoted review leaked");
  });

  it("fails check-google-reviews when a not visible review is declared", () => {
    const html = htmlOf(build.dist, "");
    const mutated = html.replace(
      /(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/gi,
      (match, open, body, close) => {
        if (!body.includes('"Review"')) return match;
        const data = JSON.parse(body);
        const inject = (value) => {
          if (Array.isArray(value)) return value.forEach(inject);
          if (value && typeof value === "object") {
            if (Array.isArray(value.review)) {
              value.review.push({
                "@type": "Review",
                author: { "@type": "Person", name: "Segunda clienta de prueba" },
                reviewRating: { "@type": "Rating", ratingValue: 4 },
                reviewBody: "Segunda reseña NRD-376 que no se cita",
              });
            }
            Object.values(value).forEach(inject);
          }
        };
        inject(data);
        return `${open}${JSON.stringify(data)}${close}`;
      },
    );
    assert.notEqual(mutated, html, "no review array was mutated");
    const dir = mkdtempSync(join(tmpdir(), "nrd-reviews-mutated-"));
    try {
      const file = join(dir, "index.html");
      writeFileSync(file, mutated);
      const result = runCheck(file);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /not visible/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
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
