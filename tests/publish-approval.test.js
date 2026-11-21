import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { isDraft } from "../scripts/lib/blog-posts.mjs";
import {
  PUBLISH_LABEL,
  isBlogPost,
  publishedPosts,
  parseLabels,
  checkPublishApproval,
} from "../scripts/lib/publish-approval.mjs";

const CLI = resolve("scripts/check-publish-approval.mjs");
const draft = "---\ntitle: A\ndraft: true\n---\nBody\n";
const flipped = "---\ntitle: A\ndraft: false\n---\nBody\n";
const removed = "---\ntitle: A\n---\nBody\n";
const A = "src/content/blog/a.md";

test("isDraft reads the frontmatter flag only", () => {
  assert.equal(isDraft(draft), true);
  assert.equal(isDraft(flipped), false);
  assert.equal(isDraft(removed), false);
  assert.equal(isDraft("---\ntitle: A\n---\ndraft: true\n"), false);
});

test("isBlogPost matches flat md/mdx posts only", () => {
  assert.equal(isBlogPost(A), true);
  assert.equal(isBlogPost("src/content/blog/a.mdx"), true);
  assert.equal(isBlogPost("src/content/blog/sub/a.md"), false);
  assert.equal(isBlogPost("src/pages/a.md"), false);
});

test("publishedPosts lists flipped, draft-removed and new posts", () => {
  assert.deepEqual(
    publishedPosts([{ path: A, before: draft, after: flipped }]),
    [{ path: A, reason: "flipped" }],
  );
  assert.deepEqual(
    publishedPosts([{ path: A, before: draft, after: removed }]),
    [{ path: A, reason: "draft-removed" }],
  );
  assert.deepEqual(
    publishedPosts([{ path: A, before: null, after: removed }]),
    [{ path: A, reason: "new" }],
  );
});

test("publishedPosts ignores changes that do not publish", () => {
  const none = [
    { path: A, before: null, after: draft },
    { path: A, before: draft, after: draft + "more" },
    { path: A, before: flipped, after: flipped + "more" },
    { path: "src/content/blog/b.md", before: flipped, after: flipped },
    { path: A, before: draft, after: null },
    { path: "src/pages/x.md", before: null, after: removed },
  ];
  assert.deepEqual(publishedPosts(none), []);
});

test("parseLabels handles JSON, empty and null", () => {
  assert.deepEqual(parseLabels('["a","publish-approved"]'), [
    "a",
    "publish-approved",
  ]);
  assert.deepEqual(parseLabels(""), []);
  assert.deepEqual(parseLabels(undefined), []);
  assert.deepEqual(parseLabels("null"), []);
});

test("checkPublishApproval blocks without the label and names path and label", () => {
  const changes = [{ path: A, before: draft, after: flipped }];
  const blocked = checkPublishApproval({ changes, labels: ["pr-approved"] });
  assert.equal(blocked.ok, false);
  assert.equal(
    blocked.message,
    `Publish approval guard: ${A} goes from draft to published (flipped) and the PR lacks the GitHub label "publish-approved". Only the owner adds it.`,
  );
  const ok = checkPublishApproval({
    changes,
    labels: ["pr-approved", PUBLISH_LABEL],
  });
  assert.equal(ok.ok, true);
  assert.match(ok.message, /approved by the GitHub label "publish-approved"/);
});

test("checkPublishApproval passes with nothing published and no labels", () => {
  const r = checkPublishApproval({ changes: [], labels: [] });
  assert.equal(r.ok, true);
  assert.equal(
    r.message,
    "Publish approval guard: no blog post goes from draft to published in this PR.",
  );
});

// Real git run
function git(cwd, ...args) {
  const r = spawnSync(
    "git",
    ["-c", "user.name=t", "-c", "user.email=t@example.com", ...args],
    { cwd, encoding: "utf8" },
  );
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim();
}

function setupRepo(headContent) {
  const dir = mkdtempSync(join(tmpdir(), "publish-guard-"));
  git(dir, "init", "-q", "-b", "main");
  mkdirSync(join(dir, "src/content/blog"), { recursive: true });
  writeFileSync(join(dir, A), draft);
  git(dir, "add", "-A");
  git(dir, "commit", "-q", "-m", "base");
  const base = git(dir, "rev-parse", "HEAD");
  git(dir, "checkout", "-q", "-b", "feature");
  writeFileSync(join(dir, A), headContent);
  git(dir, "commit", "-q", "-am", "change");
  return { dir, base, head: git(dir, "rev-parse", "HEAD") };
}

function runCli(dir, env) {
  return spawnSync("node", [CLI], {
    cwd: dir,
    encoding: "utf8",
    env: { PATH: process.env.PATH, ...env },
  });
}

test("CLI: flipped draft without label exits 1", () => {
  const { dir, base, head } = setupRepo(flipped);
  try {
    const r = runCli(dir, {
      BASE_SHA: base,
      HEAD_SHA: head,
      PR_LABELS: '["pr-approved"]',
    });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /src\/content\/blog\/a\.md/);
    assert.match(r.stderr, /publish-approved/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI: flipped draft with label exits 0", () => {
  const { dir, base, head } = setupRepo(flipped);
  try {
    const r = runCli(dir, {
      BASE_SHA: base,
      HEAD_SHA: head,
      PR_LABELS: '["publish-approved"]',
    });
    assert.equal(r.status, 0, r.stderr);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI: body-only edit of a draft exits 0", () => {
  const { dir, base, head } = setupRepo(draft + "more\n");
  try {
    const r = runCli(dir, { BASE_SHA: base, HEAD_SHA: head, PR_LABELS: "[]" });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /no blog post goes from draft to published/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI: missing BASE_SHA exits 2 with usage message", () => {
  const { dir, head } = setupRepo(flipped);
  try {
    const r = runCli(dir, { HEAD_SHA: head });
    assert.equal(r.status, 2);
    assert.match(r.stderr, /BASE_SHA and HEAD_SHA are required/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI: git error exits 2", () => {
  const { dir, head } = setupRepo(flipped);
  try {
    const r = runCli(dir, { BASE_SHA: "deadbeef", HEAD_SHA: head });
    assert.equal(r.status, 2);
    assert.match(r.stderr, /Publish approval guard: git merge-base failed/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
