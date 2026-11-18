import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const footer = readFileSync(
  new URL("../src/components/Footer.astro", import.meta.url),
  "utf8",
);
const contact = readFileSync(
  new URL("../src/pages/contacto.astro", import.meta.url),
  "utf8",
);

const normalize = (url) =>
  url
    .toLowerCase()
    .replace(/^(https:\/\/)www\./, "$1")
    .replace(/\/$/, "");

// --- Task 1.1: profile links resolved by network (NRD-294) ------------------

test("profileUrl resolves LinkedIn and GitHub by network", async () => {
  const { profileUrl } = await import("../src/data/site.ts");
  assert.equal(
    profileUrl("linkedin"),
    "https://linkedin.com/in/nuria-romero-castillo",
  );
  assert.equal(profileUrl("github"), "https://github.com/anromercas");
});

test("findProfileUrl throws when the network has no profile", async () => {
  const { findProfileUrl } = await import("../src/data/site.ts");
  assert.throws(() =>
    findProfileUrl(["https://github.com/anromercas"], "linkedin"),
  );
  assert.equal(
    findProfileUrl(["https://www.linkedin.com/in/x"], "linkedin"),
    "https://www.linkedin.com/in/x",
  );
});

test("footer and contact page resolve profiles by network, not by index", () => {
  assert.match(footer, /href=\{profileUrl\("linkedin"\)\}[\s\S]*?LinkedIn/);
  assert.match(footer, /href=\{profileUrl\("github"\)\}[\s\S]*?GitHub/);
  assert.doesNotMatch(footer, /sameAs\[/);
  assert.match(contact, /href=\{profileUrl\("linkedin"\)\}/);
  assert.doesNotMatch(contact, /sameAs\[/);
});

test("every sameAs entry is a valid, unique https URL", async () => {
  const { SITE } = await import("../src/data/site.ts");
  for (const url of SITE.sameAs) {
    assert.equal(new URL(url).protocol, "https:", url);
  }
  assert.equal(new Set(SITE.sameAs.map(normalize)).size, SITE.sameAs.length);
});

// --- Task 1.2: Sortlist in sameAs (NRD-295) ---------------------------------

const SORTLIST = "https://www.sortlist.es/agency/nuria-romero";

const CLUTCH = "https://clutch.co/profile/nuria-romero";

test("SITE.sameAs contains the Sortlist profile exactly once, right before Clutch", async () => {
  const { SITE } = await import("../src/data/site.ts");
  assert.equal(SITE.sameAs.filter((u) => u === SORTLIST).length, 1);
  assert.equal(SITE.sameAs.indexOf(SORTLIST), SITE.sameAs.indexOf(CLUTCH) - 1);
});

test("business and person JSON-LD publish the Sortlist profile", async () => {
  const { localBusinessSchema, personSchema } =
    await import("../src/lib/schema.ts");
  assert.ok(localBusinessSchema().sameAs.includes(SORTLIST));
  assert.ok(personSchema().sameAs.includes(SORTLIST));
});

// --- Task 1.2: Clutch in sameAs (NRD-292) -----------------------------------

test("SITE.sameAs contains the Clutch profile exactly once, as the last entry, and both JSON-LD nodes publish it", async () => {
  const { SITE } = await import("../src/data/site.ts");
  const { localBusinessSchema, personSchema } =
    await import("../src/lib/schema.ts");
  assert.equal(SITE.sameAs.filter((u) => u === CLUTCH).length, 1);
  assert.equal(SITE.sameAs.at(-1), CLUTCH);
  assert.ok(localBusinessSchema().sameAs.includes(CLUTCH));
  assert.ok(personSchema().sameAs.includes(CLUTCH));
});

test("sameAs has no profile without a real listing", async () => {
  const { SITE } = await import("../src/data/site.ts");
  for (const url of SITE.sameAs) {
    const host = new URL(url).hostname;
    for (const banned of ["crunchbase.com", "wikipedia.org", "wikidata.org"]) {
      assert.ok(!host.endsWith(banned), `${url} is not a verified profile`);
    }
  }
});
