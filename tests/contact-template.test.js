import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

// Same normalisation used to capture tests/fixtures/contact-form.markup.txt.
const withoutClasses = (source) =>
  source
    .replace(/\s(class|class:list)=(\{[^}]*\}|"[^"]*")/g, "")
    .replace(/\s+/g, " ")
    .trim();

const form = read("src/components/ContactForm.astro");

// --- ContactForm: style-only restyle (NRD-193) -------------------------------

test("ContactForm markup equals the baseline without classes", () => {
  const baseline = read("tests/fixtures/contact-form.markup.txt").trim();
  assert.equal(withoutClasses(form), baseline);
});

test("ContactForm keeps its fields, ids, required flags and consent", () => {
  for (const name of [
    "name",
    "email",
    "phone",
    "message",
    "_gotcha",
    "privacy",
  ]) {
    assert.match(form, new RegExp(`name="${name}"`), `field ${name}`);
  }
  for (const id of [
    "contact-form",
    "form-status",
    "submit-btn",
    "form-review-invite",
  ]) {
    assert.match(form, new RegExp(`id="${id}"`), `id ${id}`);
  }
  for (const id of ["name", "email", "message", "privacy"]) {
    assert.match(
      form,
      new RegExp(`id="${id}"[^>]*?\\srequired`, "s"),
      `${id} is required`,
    );
  }
  assert.doesNotMatch(form, /id="phone"[^>]*?\srequired/s);
  assert.match(form, /He leído y acepto la/);
  assert.match(form, /href="\/privacidad\/"/);
  assert.match(form, /política de privacidad/);
  assert.match(form, /class="hidden"/, "honeypot stays display:none");
  assert.match(form, /import "\.\.\/scripts\/contact-form\.js"/);
});

test("ContactForm no longer uses the old gray/blue world", () => {
  assert.doesNotMatch(
    form,
    /bg-gray-800|bg-blue-600|ring-blue-500|text-red-500/,
  );
  assert.match(form, /bg-\[var\(--card-surface\)\]/);
  assert.match(form, /focus-visible:outline-sky-400/);
});

test("#form-status remaps the script's toggled colours to status tokens", () => {
  assert.match(
    form,
    /text-gray-300 \[&\.text-red-600\]:text-\[var\(--status-error\)\]/,
  );
  assert.match(form, /\[&\.text-green-600\]:text-\[var\(--status-success\)\]/);
});

test("status tokens exist in DESIGN.md and template.css", () => {
  const design = read("DESIGN.md");
  const css = read("src/styles/template.css");
  assert.match(design, /status-error: "#fca5a5"/);
  assert.match(design, /status-success: "#86efac"/);
  assert.match(css, /--status-error:\s*#fca5a5\s*;/);
  assert.match(css, /--status-success:\s*#86efac\s*;/);
});

test("contact-form.js is untouched by the restyle", () => {
  const script = read("src/scripts/contact-form.js");
  assert.match(script, /text-red-600/);
  assert.match(script, /text-green-600/);
});
