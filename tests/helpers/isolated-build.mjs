// Builds a temporary copy of the site with extra posts and files, so tests can
// render fixture content without ever touching src/content or dist/ (ADR 0019).
import { spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repo = fileURLToPath(new URL("../../", import.meta.url));
const childScript = fileURLToPath(
  new URL("./isolated-build-child.mjs", import.meta.url),
);

// Below the 240 s before-hook timeout of the callers, so a hang fails clearly.
const BUILD_TIMEOUT_MS = 220_000;

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
 *           files?: { path: string, contents: string | Buffer }[],
 *           env?: Record<string, string>,
 *           preload?: string[] }} input
 *   env is merged after the GOOGLE_* deletion below; preload holds absolute
 *   paths, each passed to the build child as `--import <file URL>`.
 * @returns {Promise<{ root: string, dist: string, cleanup: () => Promise<void> }>}
 */
export async function isolatedBuild({
  posts = [],
  files = [],
  env: extraEnv = {},
  preload = [],
} = {}) {
  // The root lives inside the repo (under .astro/, which is gitignored) so
  // module resolution walks up to the repo's own node_modules and follows
  // pnpm's real paths. A temp dir outside the repo needs a symlinked
  // node_modules, which hides pnpm's nested siblings (astro -> zod) on CI.
  const parent = join(repo, ".astro");
  await mkdir(parent, { recursive: true });
  const root = await mkdtemp(join(parent, "nrd-isolated-build-"));
  const cleanup = () => rm(root, { recursive: true, force: true });

  try {
    for (const entry of COPIED) {
      await cp(join(repo, entry), join(root, entry), { recursive: true });
    }

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
    Object.assign(env, extraEnv);
    const imports = preload.flatMap((file) => [
      "--import",
      pathToFileURL(file).href,
    ]);
    const run = spawnSync(process.execPath, [...imports, childScript, root], {
      cwd: root,
      env,
      encoding: "utf8",
      timeout: BUILD_TIMEOUT_MS,
      killSignal: "SIGKILL",
    });
    if (run.error?.code === "ETIMEDOUT") {
      throw new Error(
        `isolated build timed out after ${BUILD_TIMEOUT_MS} ms:\n${run.stderr || run.stdout}`,
      );
    }
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
