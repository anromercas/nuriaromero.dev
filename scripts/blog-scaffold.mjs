// CLI: node scripts/blog-scaffold.mjs --slug <s> --title <t> --description <d>
//        --date <YYYY-MM-DD> --cover <file> --alt <text> [--tags a,b] [--outline <esquema.md>] [--write]
//        [--root <dir>]
// Prints the frontmatter; only --write creates src/content/blog/<slug>.md, and it
// requires an approved, lint-clean --outline with the same slug.
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { isApproved, lintOutline, parseOutline } from "./lib/outline-lint.mjs";
import { buildPostFrontmatter } from "./lib/post-frontmatter.mjs";

function fail(message) {
  console.error(`blog-scaffold: ${message}`);
  process.exit(1);
}

const VALUE_FLAGS = new Set([
  "slug",
  "title",
  "description",
  "date",
  "cover",
  "alt",
  "tags",
  "root",
  "outline",
]);
const opts = {};
let write = false;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const name = args[i].replace(/^--/, "");
  if (!args[i].startsWith("--")) fail(`unexpected argument ${args[i]}`);
  if (name === "write") write = true;
  else if (VALUE_FLAGS.has(name)) {
    if (args[i + 1] === undefined) fail(`--${name} needs a value`);
    opts[name] = args[++i];
  } else fail(`unknown option --${name}`);
}

let built;
try {
  built = buildPostFrontmatter({
    slug: opts.slug,
    title: opts.title,
    description: opts.description,
    pubDate: opts.date,
    tags: opts.tags
      ? opts.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    cover: { file: opts.cover, alt: opts.alt },
  });
} catch (error) {
  fail(error.message);
}

const output = `${built.text}\n`;
if (!write) {
  process.stdout.write(output);
} else {
  const root = opts.root ?? process.cwd();
  if (!opts.outline) fail("--write needs --outline <esquema.md>");
  const outlinePath = resolve(root, opts.outline);
  if (!existsSync(outlinePath)) fail(`outline not found: ${opts.outline}`);
  const outlineText = readFileSync(outlinePath, "utf8");
  const lint = lintOutline(outlineText);
  if (!lint.ok) fail(`outline lint failed:\n- ${lint.errors.join("\n- ")}`);
  const outline = parseOutline(outlineText);
  if (!isApproved(outline))
    fail(`outline is not approved (Estado: ${outline.status})`);
  if (outline.slug !== opts.slug)
    fail(`outline slug ${outline.slug} differs from --slug ${opts.slug}`);
  const relative = `src/content/blog/${opts.slug}.md`;
  const target = join(root, relative);
  if (!existsSync(join(root, "src/assets/blog", opts.cover)))
    fail(`cover not found: src/assets/blog/${opts.cover}`);
  if (existsSync(target)) fail(`${relative} already exists`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, output, { flag: "wx" });
  console.log(`blog-scaffold: wrote ${relative}`);
}
