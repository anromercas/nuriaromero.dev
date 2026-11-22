// Reads the title and draft flag of every blog post (src/content/blog/*.md|mdx).
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * True only when the frontmatter has exactly one `draft` key and it is the
 * literal `true` (optionally followed by a comment). Anything else (no
 * frontmatter, `True`, quoted values, duplicate keys) reads as published, so
 * callers that guard publication fail closed.
 */
export function isDraft(source) {
  const frontmatter = FRONTMATTER.exec(source)?.[1];
  if (frontmatter === undefined) return false;
  const lines = frontmatter
    .split(/\r?\n/)
    .filter((line) => /^draft\s*:/.test(line));
  return lines.length === 1 && /^draft:[ \t]*true[ \t]*(#.*)?$/.test(lines[0]);
}

/**
 * Lenient reading for the "before" side of a guard: a `draft` line that is not
 * the strict `draft: false` counts as draft, so a later flip still needs the
 * owner's label. No `draft` key or no frontmatter reads as published.
 */
export function wasDraft(source) {
  const frontmatter = FRONTMATTER.exec(source)?.[1];
  if (frontmatter === undefined) return false;
  const lines = frontmatter
    .split(/\r?\n/)
    .filter((line) => /^draft\s*:/.test(line));
  if (lines.length === 0) return false;
  return !(
    lines.length === 1 && /^draft:[ \t]*false[ \t]*(#.*)?$/.test(lines[0])
  );
}

export async function readPosts(dir) {
  const names = (await readdir(dir))
    .filter((name) => /\.mdx?$/.test(name))
    .sort();
  const posts = [];
  for (const name of names) {
    const source = await readFile(join(dir, name), "utf8");
    const frontmatter = FRONTMATTER.exec(source)?.[1] ?? "";
    const title = /^title:\s*(.+)$/m
      .exec(frontmatter)?.[1]
      .trim()
      .replace(/^(["'])([\s\S]*)\1$/, "$2");
    posts.push({
      slug: name.replace(/\.mdx?$/, ""),
      title: title ?? "",
      draft: isDraft(source),
    });
  }
  return posts.sort((a, b) => a.slug.localeCompare(b.slug));
}
