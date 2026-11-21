import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const guideUrl = new URL("docs/blog-voice.md", root);

function guide() {
  assert.ok(existsSync(guideUrl), "docs/blog-voice.md is missing");
  return readFileSync(guideUrl, "utf8");
}

/** Body of the `## <heading>` section, up to the next `## ` heading. */
function section(source, heading) {
  const lines = source.split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  assert.notEqual(start, -1, `section "## ${heading}" not found`);
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith("## "));
  return (end === -1 ? rest : rest.slice(0, end)).join("\n");
}

const siteName = readFileSync(new URL("src/data/site.ts", root), "utf8").match(
  /name:\s*"([^"]+)"/,
)?.[1];

test("guide exists with every rule heading", () => {
  const source = guide();
  for (const heading of [
    "Voice",
    "Value before mechanism",
    "Explain jargon",
    "Never promise rankings",
    "Real proof only",
    "Direct answer first",
    "One brand",
    "Close",
    "Checklist",
  ]) {
    assert.match(
      source,
      new RegExp(`^## ${heading}$`, "m"),
      `missing ## ${heading}`,
    );
  }
});

test("never-promise rule covers position, AI mentions and guarantees", () => {
  const body = section(guide(), "Never promise rankings");
  assert.match(body, /position/i, "rule must mention position");
  assert.match(body, /\bAI\b/, "rule must mention AI");
  assert.match(body, /guarantee/i, "rule must mention guarantee");
});

test("brand string matches SITE.name", () => {
  assert.ok(siteName, "SITE.name not found in src/data/site.ts");
  assert.ok(section(guide(), "One brand").includes(`"${siteName}"`));
});

test("checklist has 5 to 10 items", () => {
  const items = section(guide(), "Checklist")
    .split("\n")
    .filter((line) => /^\d+\.\s+\S/.test(line));
  assert.ok(
    items.length >= 5 && items.length <= 10,
    `found ${items.length} items`,
  );
});
