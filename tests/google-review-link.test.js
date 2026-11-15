import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const readSource = (path) => readFile(new URL(path, root), "utf8");

async function walk(dir) {
  const entries = await readdir(new URL(`${dir}/`, root), {
    withFileTypes: true,
  });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    }),
  );
  return files.flat();
}

const PLACE_ID = "ChIJ8Uv-vM9f0CoR8J75dj4I0HM";

test("derives the write-review URL from one GBP_PLACE_ID in local-trust", async () => {
  const src = await readSource("src/data/local-trust.ts");

  assert.equal(
    src.split(PLACE_ID).length - 1,
    1,
    "place id literal appears once",
  );
  assert.match(src, /const GBP_PLACE_ID = ["']ChIJ8Uv-vM9f0CoR8J75dj4I0HM["']/);
  assert.match(src, /placeId:\s*GBP_PLACE_ID/);
  assert.match(
    src,
    /profileUrl:\s*`https:\/\/www\.google\.com\/maps\/place\/\?q=place_id:\$\{GBP_PLACE_ID\}`/,
  );
  assert.match(
    src,
    /writeReviewUrl:\s*`https:\/\/search\.google\.com\/local\/writereview\?placeid=\$\{GBP_PLACE_ID\}`/,
  );
});

test("writereview only appears in local-trust.ts under src", async () => {
  const files = (await walk("src")).filter((f) =>
    /\.(ts|astro|js|mjs|md|mdx|json)$/.test(f),
  );
  const offenders = [];
  for (const file of files) {
    const src = await readSource(file);
    if (/local\/writereview/.test(src) && !file.endsWith("local-trust.ts"))
      offenders.push(file);
  }
  assert.deepEqual(offenders, []);
});

test("contact form renders a hidden optional review invite after the status row", async () => {
  const src = await readSource("src/components/ContactForm.astro");

  assert.match(src, /localTrust/);
  assert.match(
    src,
    /showReviewInvite\s*=\s*localTrust\.gbp\.status === ["']verified["'] && Boolean\(localTrust\.gbp\.writeReviewUrl\)/,
  );
  assert.match(src, /<p[^>]*id="form-review-invite"[^>]*\shidden[\s>]/);
  const invite =
    src.match(/<p[^>]*id="form-review-invite"[\s\S]*?<\/p>/)?.[0] ?? "";
  assert.match(invite, /href=\{localTrust\.gbp\.writeReviewUrl\}/);
  assert.match(invite, /target="_blank"/);
  assert.match(invite, /rel="noopener noreferrer"/);
  assert.match(invite, /¿Ya has trabajado conmigo\? Si te apetece, puedes/);
  assert.match(invite, /dejar una reseña en Google/);
  assert.match(
    invite,
    /<span class="sr-only">\s*\(se abre en una pestaña nueva\)<\/span>/,
  );
  assert.match(invite, /<\/a>\./);
  assert.doesNotMatch(invite, /aria-live|role=/);
  assert.doesNotMatch(invite, /class="[^"]*\b(block|flex|inline|grid)\b/);
  // The invite sits outside the live region and outside the flex status row.
  const statusIdx = src.indexOf('id="form-status"');
  const buttonIdx = src.indexOf('id="submit-btn"');
  const inviteIdx = src.indexOf('id="form-review-invite"');
  assert.ok(statusIdx < buttonIdx && buttonIdx < inviteIdx);
});

test("review invite copy has no incentive or condition wording", async () => {
  const src = await readSource("src/components/ContactForm.astro");
  const invite =
    src.match(/<p[^>]*id="form-review-invite"[\s\S]*?<\/p>/)?.[0] ?? "";
  assert.ok(invite.length > 0);
  assert.doesNotMatch(
    invite,
    /descuento|regalo|sorteo|a cambio|gratis|premio|oferta|si dejas|solo si|siempre que|obligatori/i,
  );
});

test("contact-form.js shows the invite only on success and hides it elsewhere", async () => {
  const src = await readSource("src/scripts/contact-form.js");

  assert.match(
    src,
    /const reviewInvite = document\.getElementById\('form-review-invite'\)/,
  );
  assert.match(src, /function setReviewInvite\(visible\)/);
  assert.match(src, /if \(reviewInvite\) reviewInvite\.hidden = !visible/);

  const submit = src.slice(src.indexOf("form.addEventListener('submit'"));
  const validation = submit.slice(
    submit.indexOf("!form.checkValidity()"),
    submit.indexOf("submitBtn.disabled = true"),
  );
  assert.match(validation, /setReviewInvite\(false\)/);

  const sending = submit.slice(
    submit.indexOf("submitBtn.disabled = true"),
    submit.indexOf("try {"),
  );
  assert.match(sending, /setReviewInvite\(false\)/);

  const okBranch = submit.slice(
    submit.indexOf("if (res.ok)"),
    submit.indexOf("} else {"),
  );
  assert.match(okBranch, /setReviewInvite\(true\)/);

  const errorBranch = submit.slice(
    submit.indexOf("} else {"),
    submit.indexOf("} catch (err)"),
  );
  assert.match(errorBranch, /setReviewInvite\(false\)/);

  const catchBranch = submit.slice(
    submit.indexOf("} catch (err)"),
    submit.indexOf("} finally"),
  );
  assert.match(catchBranch, /setReviewInvite\(false\)/);

  assert.equal(src.split("setReviewInvite(true)").length - 1, 1);
});
