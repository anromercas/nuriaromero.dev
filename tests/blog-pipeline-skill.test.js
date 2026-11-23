import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { lintOutline } from "../scripts/lib/outline-lint.mjs";

const repoRoot = new URL("../", import.meta.url).pathname;
const skillDir = ".claude/skills/blog-pipeline";
const read = (path) => readFileSync(join(repoRoot, path), "utf8");
const skill = () => read(`${skillDir}/SKILL.md`);

test("frontmatter has name blog-pipeline and a description", () => {
  const match = skill().match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, "SKILL.md needs YAML frontmatter");
  assert.match(match[1], /^name: blog-pipeline$/m);
  assert.match(match[1], /^description: \S.+$/m);
});

test("the five approval points are named in order", () => {
  const text = skill();
  let from = 0;
  for (const name of [
    "Aprobación 1 (tema)",
    "Aprobación 2 (esquema)",
    "Aprobación 3 (portada)",
    "Aprobación 4 (borrador)",
    "Aprobación 5 (publicación)",
  ]) {
    const at = text.indexOf(name, from);
    assert.ok(at >= 0, `${name} missing or out of order`);
    from = at + name.length;
  }
});

test("the skill names the scripts, the voice guide and the artifacts", () => {
  const text = skill();
  for (const needle of [
    "scripts/blog-shortlist.mjs",
    "scripts/blog-outline-lint.mjs",
    "scripts/blog-scaffold.mjs",
    "scripts/blog-word-count.mjs",
    "docs/blog-voice.md",
    "seo/contenido/<slug>/tema.md",
    "seo/contenido/<slug>/esquema.md",
  ]) {
    assert.ok(text.includes(needle), `${needle} not named in SKILL.md`);
  }
});

test("the skill never instructs draft: false and says only the owner flips it", () => {
  const text = skill();
  assert.doesNotMatch(text, /draft:\s*false/);
  assert.match(text, /only the owner flips `draft`/);
});

test("the publish label is named, owner-only, and never added by the skill", () => {
  const text = skill();
  assert.match(
    text,
    /Only the owner applies `publish-approved`; the skill never adds it\./,
  );
  assert.doesNotMatch(text, /gh pr edit/);
  assert.doesNotMatch(text, /draft:\s*false/);
  assert.match(
    read("docs/designs/NRD-327-blog-content-pipeline.md"),
    /publish-approved/,
  );
});

test("templates/esquema.md passes the outline lint", () => {
  const template = read(`${skillDir}/templates/esquema.md`);
  assert.deepEqual(lintOutline(template.replaceAll("<slug>", "mi-tema")), {
    ok: true,
    errors: [],
  });
  assert.match(template, /^- Estado: pendiente de aprobación$/m);
  assert.match(template, /^- Portada:\s*$/m);
});

test("templates/tema.md has the topic fields", () => {
  const template = read(`${skillDir}/templates/tema.md`);
  for (const field of [
    "Slug",
    "Pregunta",
    "Palabra clave",
    "Intención",
    "Volumen",
    "Pilar",
    "Página destino",
    "Fuentes",
  ]) {
    assert.match(template, new RegExp(`^- ${field}:`, "m"), field);
  }
  assert.match(template, /^- Estado: pendiente de aprobación$/m);
});

// Scaffold command exactly as written in the marked block of SKILL.md.
const SAMPLE = {
  slug: "mi-tema",
  title: "Mi tema de prueba",
  description: "Descripción de prueba.",
  date: "2026-11-24",
  cover: "mi-tema.jpg",
  alt: "Imagen de prueba",
  tags: "seo local,google",
};

function scaffoldArgv(root) {
  const block = skill().match(
    /<!-- blog-pipeline:scaffold -->\s*```bash\n([\s\S]*?)\n```/,
  );
  assert.ok(block, "marked scaffold block not found");
  const filled = block[1].replace(/<(\w+)>/g, (_, key) => {
    assert.ok(key in SAMPLE, `unknown placeholder <${key}>`);
    return SAMPLE[key];
  });
  const argv = [...filled.matchAll(/"([^"]*)"|(\S+)/g)].map(
    (m) => m[1] ?? m[2],
  );
  assert.equal(argv[0], "node");
  return [...argv.slice(1), "--root", root];
}

async function sandbox(status) {
  const root = await mkdtemp(join(tmpdir(), "nrd-skill-"));
  await mkdir(join(root, "src/assets/blog"), { recursive: true });
  await mkdir(join(root, "src/content/blog"), { recursive: true });
  await mkdir(join(root, "seo/contenido", SAMPLE.slug), { recursive: true });
  await writeFile(join(root, "src/assets/blog", SAMPLE.cover), "x");
  const outline = read(`${skillDir}/templates/esquema.md`)
    .replaceAll("<slug>", SAMPLE.slug)
    .replace("pendiente de aprobación", status);
  await writeFile(
    join(root, "seo/contenido", SAMPLE.slug, "esquema.md"),
    outline,
  );
  return root;
}

test("scaffold block as written yields draft: true with an approved outline", async () => {
  const root = await sandbox("aprobado (2026-11-24)");
  try {
    const r = spawnSync(process.execPath, scaffoldArgv(root), {
      cwd: repoRoot,
    });
    assert.equal(r.status, 0, r.stderr.toString());
    const post = readFileSync(
      join(root, "src/content/blog", `${SAMPLE.slug}.md`),
      "utf8",
    );
    assert.match(post, /^draft: true$/m);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("scaffold block writes nothing with a pending outline", async () => {
  const root = await sandbox("pendiente de aprobación");
  try {
    const r = spawnSync(process.execPath, scaffoldArgv(root), {
      cwd: repoRoot,
    });
    assert.equal(r.status, 1);
    assert.equal(
      existsSync(join(root, "src/content/blog", `${SAMPLE.slug}.md`)),
      false,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("step 0 records the owner's decisions and the topic step starts from the queue", () => {
  const text = skill();
  const step0 = text.indexOf("## Step 0");
  const step1 = text.indexOf("## Step 1");
  assert.ok(step0 >= 0 && step0 < step1, "## Step 0 must come before step 1");
  const zero = text.slice(step0, step1);
  const topic = text.slice(step1, text.indexOf("## Step 2"));
  assert.ok(zero.includes("scripts/blog-idea-status.mjs"));
  assert.ok(zero.includes("seo/contenido/ideas.json"));
  assert.ok(topic.includes("aprobada"));
  assert.ok(topic.includes("en curso"));
  assert.ok(text.includes("publicada"));
});
