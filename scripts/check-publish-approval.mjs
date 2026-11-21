// CLI of the publish approval guard (ADR 0021).
// Env: BASE_SHA, HEAD_SHA, PR_LABELS (JSON array). Exit: 0 ok, 1 blocked, 2 usage/git error.
import { execFileSync } from "node:child_process";
import { checkPublishApproval, parseLabels } from "./lib/publish-approval.mjs";

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
    "--name-status",
    "-z",
    "-M",
    "--diff-filter=AMR",
    mergeBase,
    head,
    "--",
    "src/content/blog",
  )
    .split("\0")
    .filter((token) => token !== "");

  const changes = [];
  for (let i = 0; i < tokens.length;) {
    const status = tokens[i++];
    if (status.startsWith("R")) {
      const oldPath = tokens[i++];
      const path = tokens[i++];
      changes.push({
        path,
        before: git("show", `${mergeBase}:${oldPath}`),
        after: git("show", `${head}:${path}`),
      });
    } else {
      const path = tokens[i++];
      changes.push({
        path,
        before: status === "A" ? null : git("show", `${mergeBase}:${path}`),
        after: git("show", `${head}:${path}`),
      });
    }
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
