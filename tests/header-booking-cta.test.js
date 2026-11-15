import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readSource = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

const bookingTags = (source) =>
  source.match(/<BookingButton[\s\S]*?\/>/g) ?? [];

test("header has exactly two BookingButton usages: bar and drawer", async () => {
  const header = await readSource("src/components/Header.astro");
  assert.equal((header.match(/<BookingButton/g) ?? []).length, 2);
});

test("desktop bar CTA is hidden below md with the short label", async () => {
  const header = await readSource("src/components/Header.astro");
  const nav = header.slice(header.indexOf("<nav"), header.indexOf("</nav>"));
  const [barCta] = bookingTags(nav);
  assert.ok(barCta, "bar has a BookingButton");
  const classValue = barCta.match(/class="([^"]*)"/)?.[1] ?? "";
  for (const token of ["hidden", "md:inline-flex", "whitespace-nowrap"]) {
    assert.ok(
      classValue.split(/\s+/).includes(token),
      `bar CTA class has ${token}`,
    );
  }
  assert.match(barCta, /label="Reservar"/);
  const ariaLabel = barCta.match(/ariaLabel="([^"]*)"/)?.[1];
  assert.ok(
    ariaLabel?.startsWith("Reservar"),
    "accessible name starts with visible text",
  );
});

test("bar CTA comes after the nav links and before the mobile toggle", async () => {
  const header = await readSource("src/components/Header.astro");
  const nav = header.slice(header.indexOf("<nav"), header.indexOf("</nav>"));
  const cta = nav.indexOf("<BookingButton");
  assert.ok(cta > nav.indexOf("</ul>"));
  assert.ok(cta < nav.indexOf('id="mobile-menu-btn"'));
});

test("drawer keeps the default-label BookingButton", async () => {
  const header = await readSource("src/components/Header.astro");
  const drawer = header.slice(header.search(/<div\s+id="mobile-menu"/));
  const [drawerCta] = bookingTags(drawer);
  assert.ok(drawerCta, "drawer has a BookingButton");
  assert.doesNotMatch(drawerCta, /label=/);
});

test("header never hardcodes the booking URL", async () => {
  const header = await readSource("src/components/Header.astro");
  assert.doesNotMatch(header, /bookingUrl|calendar\.google\.com/);
});

test("mobile menu toggle keeps its accessibility wiring", async () => {
  const header = await readSource("src/components/Header.astro");
  assert.match(header, /id="mobile-menu-btn"/);
  assert.match(header, /aria-controls="mobile-menu"/);
  assert.match(header, /aria-expanded=/);
});

test("nav links use tighter padding at md to fit the CTA", async () => {
  const header = await readSource("src/components/Header.astro");
  assert.match(header, /px-2\.5 lg:px-3\.5/);
});
