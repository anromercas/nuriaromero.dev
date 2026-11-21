// Reads the title and draft flag of every blog post (src/content/blog/*.md|mdx).
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

/** True when the frontmatter block has the line `draft: true`. */
export function isDraft(source) {
  const frontmatter = FRONTMATTER.exec(source)?.[1] ?? "";
  return /^draft:\s*true\s*$/m.test(frontmatter);
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
