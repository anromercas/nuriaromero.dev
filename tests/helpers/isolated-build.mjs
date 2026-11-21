// Builds a temporary copy of the site with extra posts and files, so tests can
// render fixture content without ever touching src/content or dist/ (ADR 0019).
import { spawnSync } from "node:child_process";
import {
  cp,
  mkdir,
  mkdtemp,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = fileURLToPath(new URL("../../", import.meta.url));
const childScript = fileURLToPath(
  new URL("./isolated-build-child.mjs", import.meta.url),
);

// Explicit allow-list: never .env*, .git or dist.
const COPIED = [
  "src",
  "public",
  "astro.config.mjs",
  "tsconfig.json",
  "tailwind.config.mjs",
  "package.json",
];

const toFrontmatter = (value) =>
  typeof value === "string"
    ? value
    : Object.entries(value)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join("\n");

/**
 * @param {{ posts?: { slug: string, frontmatter: Record<string, unknown> | string, body: string }[],
 *           files?: { path: string, contents: string | Buffer }[] }} input
 * @returns {Promise<{ root: string, dist: string, cleanup: () => Promise<void> }>}
 */
export async function isolatedBuild({ posts = [], files = [] } = {}) {
  // realpath: on macOS tmpdir() is a /var -> /private/var symlink, and Vite
  // breaks when the same file is reached through both spellings.
  const root = await mkdtemp(
    join(await realpath(tmpdir()), "nrd-isolated-build-"),
  );
  const cleanup = () => rm(root, { recursive: true, force: true });

  try {
    for (const entry of COPIED) {
      await cp(join(repo, entry), join(root, entry), { recursive: true });
    }
    await symlink(
      join(repo, "node_modules"),
      join(root, "node_modules"),
      "dir",
    );

    for (const post of posts) {
      const file = join(root, "src", "content", "blog", `${post.slug}.md`);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(
        file,
        `---\n${toFrontmatter(post.frontmatter)}\n---\n\n${post.body}\n`,
      );
    }
    for (const { path, contents } of files) {
      const file = resolve(root, path);
      if (!file.startsWith(root))
        throw new Error(`file path escapes root: ${path}`);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, contents);
    }

    const env = { ...process.env };
    delete env.GOOGLE_PLACES_API_KEY;
    delete env.GOOGLE_PLACE_ID;
    const run = spawnSync(process.execPath, [childScript, root], {
      cwd: root,
      env,
      encoding: "utf8",
    });
    if (run.status !== 0) {
      throw new Error(
        `isolated build failed (exit ${run.status}):\n${run.stderr || run.stdout}`,
      );
    }
  } catch (error) {
    await cleanup();
    throw error;
  }

  return { root, dist: join(root, "dist"), cleanup };
}
