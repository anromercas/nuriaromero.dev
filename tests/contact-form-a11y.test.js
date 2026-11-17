import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// NRD-247: accessible per-field error recovery on the contact form.

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const form = read("src/components/ContactForm.astro");
const script = read("src/scripts/contact-form.js");

const { validateContactFields } = await import(
  new URL("src/scripts/contact-form-validation.js", root)
);

const valid = {
  name: "Ana",
  email: "ana@example.com",
  message: "Hola",
  privacy: true,
};

const MESSAGES = {
  name: "Escribe tu nombre.",
  emailEmpty: "Escribe tu correo electrónico.",
  emailInvalid: "Escribe un correo válido, por ejemplo tu@email.com.",
  message: "Escribe tu mensaje.",
  privacy: "Acepta la política de privacidad para enviar el mensaje.",
};

// --- validator -----------------------------------------------------------

test("valid input yields no errors", () => {
  assert.deepEqual(validateContactFields(valid), []);
});

test("empty fields yield the four errors in form order", () => {
  assert.deepEqual(
    validateContactFields({ name: "", email: "", message: "", privacy: false }),
    [
      { field: "name", message: MESSAGES.name },
      { field: "email", message: MESSAGES.emailEmpty },
      { field: "message", message: MESSAGES.message },
      { field: "privacy", message: MESSAGES.privacy },
    ],
  );
});

test("whitespace-only name and message count as empty", () => {
  const errors = validateContactFields({
    ...valid,
    name: "  ",
    message: " \n",
  });
  assert.deepEqual(
    errors.map((e) => e.field),
    ["name", "message"],
  );
});

test("an invalid email gets its own message", () => {
  for (const email of ["ana", "ana@", "ana@example", "a b@c.de"]) {
    assert.deepEqual(validateContactFields({ ...valid, email }), [
      { field: "email", message: MESSAGES.emailInvalid },
    ]);
  }
});

test("only the unchecked privacy box fails when the rest is valid", () => {
  assert.deepEqual(validateContactFields({ ...valid, privacy: false }), [
    { field: "privacy", message: MESSAGES.privacy },
  ]);
});

// --- markup --------------------------------------------------------------

test("every validated control points aria-describedby to a hidden error <p>", () => {
  for (const id of ["name", "email", "message", "privacy"]) {
    const tag =
      form.match(
        new RegExp(`<(?:input|textarea)\\s[^>]*?id="${id}"[^>]*?>`, "s"),
      )?.[0] ?? "";
    assert.ok(tag, `#${id} found`);
    assert.match(tag, new RegExp(`aria-describedby="${id}-error"`), id);
    assert.match(
      form,
      new RegExp(`<p\\s[^>]*?id="${id}-error"[^>]*?\\shidden`, "s"),
      `#${id}-error exists and starts hidden`,
    );
  }
});

test("field errors carry a visible 'Error:' prefix, not just colour", () => {
  assert.match(script, /Error:/);
  assert.match(form, /field-error/);
});

test("errors have a role=alert region and #form-status stays polite", () => {
  assert.match(form, /<p\s[^>]*?id="form-error"[^>]*?role="alert"/s);
  assert.match(form, /<p\s+id="form-status"[^>]*?aria-live="polite"/s);
});

test("the error colour uses the AA status token", () => {
  assert.match(form, /var\(--status-error\)/);
});

// --- script --------------------------------------------------------------

test("contact-form.js uses the validator, aria-invalid and focus()", () => {
  assert.match(script, /from\s+['"]\.\/contact-form-validation\.js['"]/);
  assert.match(script, /validateContactFields/);
  assert.match(script, /aria-invalid/);
  assert.match(script, /\.focus\(\)/);
  assert.match(script, /Revisa los campos marcados\./);
});

test("contact-form.js no longer delegates to native validation bubbles", () => {
  assert.doesNotMatch(script, /reportValidity/);
  assert.doesNotMatch(script, /checkValidity/);
});

test("contact-form.js clears a field error on input/change", () => {
  assert.match(script, /addEventListener\(\s*['"]input['"]/);
  assert.match(script, /addEventListener\(\s*['"]change['"]/);
});

test("network and Formspree errors go to #form-error", () => {
  assert.match(script, /getElementById\(['"]form-error['"]\)/);
  assert.match(script, /setError\(\s*msg\s*\)/);
  assert.match(script, /setError\(\s*['"]⚠️ Error de conexión/);
});

test("submitted data and endpoint are unchanged", () => {
  assert.match(script, /https:\/\/formspree\.io\/f\/mdklbyaz/);
  assert.match(script, /new FormData\(form\)/);
});
