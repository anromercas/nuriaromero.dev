// Pure core of the publish approval guard (ADR 0021): which blog posts a PR
// makes published, and whether the owner's label is present.
import { isDraft } from "./blog-posts.mjs";

export const PUBLISH_LABEL = "publish-approved";

export function isBlogPost(path) {
  return /^src\/content\/blog\/[^/]+\.mdx?$/.test(path);
}

/** changes: [{ path, before: string | null, after: string | null }] */
export function publishedPosts(changes) {
  const posts = [];
  for (const { path, before, after } of changes) {
    if (!isBlogPost(path) || after === null) continue;
    if (isDraft(after)) continue;
    if (before !== null && !isDraft(before)) continue;
    const reason =
      before === null
        ? "new"
        : /^draft:\s*false\s*$/m.test(after)
          ? "flipped"
          : "draft-removed";
    posts.push({ path, reason });
  }
  return posts;
}

export function parseLabels(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((name) => typeof name === "string")
      : [];
  } catch {
    return [];
  }
}

export function checkPublishApproval({ changes, labels }) {
  const published = publishedPosts(changes);
  if (published.length === 0) {
    return {
      ok: true,
      published,
      message:
        "Publish approval guard: no blog post goes from draft to published in this PR.",
    };
  }
  const ok = labels.includes(PUBLISH_LABEL);
  const message = published
    .map(({ path, reason }) =>
      ok
        ? `Publish approval guard: ${path} goes from draft to published (${reason}), approved by the GitHub label "${PUBLISH_LABEL}".`
        : `Publish approval guard: ${path} goes from draft to published (${reason}) and the PR lacks the GitHub label "${PUBLISH_LABEL}". Only the owner adds it.`,
    )
    .join("\n");
  return { ok, published, message };
}
