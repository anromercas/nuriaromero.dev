import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const brief = readFileSync(
  new URL("../.claude/harness/seo.md", import.meta.url),
  "utf8",
);
const section = brief.slice(brief.indexOf("## Weekly blog idea refresh"));

test("the brief has a weekly blog idea refresh section", () => {
  assert.ok(brief.includes("## Weekly blog idea refresh"));
});

test("it names the script, the weekly cadence, the call budget and the report section", () => {
  assert.ok(section.includes("scripts/blog-ideas-refresh.mjs"));
  assert.match(section, /once a week/i);
  assert.ok(section.includes("maxCallsPerRun"));
  assert.match(section, /at most 6/i);
  assert.ok(section.includes("Ideas para el blog"));
});

test("it says the run does not commit and adds no paid service", () => {
  assert.match(section, /does not commit/i);
  assert.match(section, /no paid service/i);
  assert.ok(section.includes("aprueba idea"));
});
