// CLI of the publish approval guard (ADR 0021).
// Env: BASE_SHA, HEAD_SHA, PR_LABELS (JSON array). Exit: 0 ok, 1 blocked, 2 usage/git error.
import { execFileSync } from "node:child_process";
import {
  checkPublishApproval,
  isBlogPost,
  parseLabels,
} from "./lib/publish-approval.mjs";

class GitError extends Error {}

function git(...args) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (error) {
    const first = String(error.stderr ?? error.message)
      .split("\n")[0]
      .trim();
    throw new GitError(
      `Publish approval guard: git ${args[0]} failed: ${first}`,
    );
  }
}

const { BASE_SHA: base, HEAD_SHA: head, PR_LABELS: rawLabels } = process.env;
if (!base || !head) {
  console.error(
    "Publish approval guard: BASE_SHA and HEAD_SHA are required (pull_request event).",
  );
  process.exit(2);
}

try {
  const mergeBase = git("merge-base", base, head).trim();
  const tokens = git(
    "diff",
    "--raw",
    "-z",
    "-M",
    "--diff-filter=d",
    mergeBase,
    head,
    "--",
    "src/content/blog",
  )
    .split("\0")
    .filter((token) => token !== "");

  // Entries: ":<srcmode> <dstmode> <srcsha> <dstsha> <status>", then the path
  // (two paths for renames and copies).
  const changes = [];
  for (let i = 0; i < tokens.length;) {
    const [rawSrcMode, dstMode, , , status] = tokens[i++].split(/\s+/);
    const srcMode = rawSrcMode.replace(/^:/, "");
    const twoPaths = status.startsWith("R") || status.startsWith("C");
    const oldPath = twoPaths ? tokens[i++] : null;
    const path = tokens[i++];
    if (dstMode !== "100644" && dstMode !== "100755") {
      changes.push({ path, before: null, after: null, special: true });
      continue;
    }
    const sourcePath = oldPath ?? path;
    // Trust the previous content only when the source is a regular blog post;
    // anything else (A, T, other folders, symlinks) reads as a new file.
    const trusted =
      status !== "A" &&
      !status.startsWith("T") &&
      isBlogPost(sourcePath) &&
      (srcMode === "100644" || srcMode === "100755");
    changes.push({
      path,
      before: trusted ? git("show", `${mergeBase}:${sourcePath}`) : null,
      after: git("show", `${head}:${path}`),
    });
  }

  const result = checkPublishApproval({
    changes,
    labels: parseLabels(rawLabels),
  });
  (result.ok ? console.log : console.error)(result.message);
  process.exit(result.ok ? 0 : 1);
} catch (error) {
  if (error instanceof GitError) {
    console.error(error.message);
    process.exit(2);
  }
  throw error;
}
