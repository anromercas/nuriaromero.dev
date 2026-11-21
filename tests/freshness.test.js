import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const {
  getLastModified,
  formatMonthYear,
  newestPublishedPostDate,
  latestDate,
} = await import("../src/lib/freshness.ts");

const run = (cwd, args, env = {}) =>
  execFileSync("git", args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: "pipe",
  });

function makeRepo() {
  const dir = mkdtempSync(join(tmpdir(), "fresh-"));
  run(dir, ["init", "-q"]);
  run(dir, ["config", "user.name", "T"]);
  run(dir, ["config", "user.email", "t@example.com"]);
  run(dir, ["config", "commit.gpgsign", "false"]);
  return dir;
}

function commit(dir, file, content, date) {
  mkdirSync(join(dir, file, ".."), { recursive: true });
  writeFileSync(join(dir, file), content);
  run(dir, ["add", file]);
  run(dir, ["commit", "-q", "-m", `change ${file}`], {
    GIT_COMMITTER_DATE: date,
    GIT_AUTHOR_DATE: date,
  });
}

test("Page changed in an earlier commit returns its ISO date", () => {
  const dir = makeRepo();
  commit(dir, "a.txt", "1", "2026-11-10T09:30:00+01:00");
  commit(dir, "b.txt", "1", "2026-11-12T10:00:00+01:00");
  assert.equal(
    getLastModified(["a.txt"], { cwd: dir }),
    "2026-11-10T09:30:00+01:00",
  );
});

test("Several sources return the newest date", () => {
  const dir = makeRepo();
  commit(dir, "a.txt", "1", "2026-11-10T09:30:00+01:00");
  commit(dir, "b.txt", "1", "2026-11-12T10:00:00+01:00");
  assert.equal(
    getLastModified(["a.txt", "b.txt"], { cwd: dir }),
    "2026-11-12T10:00:00+01:00",
  );
});

test("No repository: untracked path and non-repository directory", () => {
  const dir = makeRepo();
  commit(dir, "a.txt", "1", "2026-11-10T09:30:00+01:00");
  writeFileSync(join(dir, "new.txt"), "x");
  assert.equal(getLastModified(["new.txt"], { cwd: dir }), undefined);
  const plain = mkdtempSync(join(tmpdir(), "plain-"));
  assert.equal(getLastModified(["a.txt"], { cwd: plain }), undefined);
});

test("Shallow clone: boundary commit yields undefined", () => {
  const dir = makeRepo();
  commit(dir, "old.txt", "1", "2026-11-01T09:00:00+01:00");
  commit(dir, "mid.txt", "1", "2026-11-05T09:00:00+01:00");
  commit(dir, "new.txt", "1", "2026-11-10T09:00:00+01:00");
  const clone = mkdtempSync(join(tmpdir(), "clone-"));
  run(clone, ["clone", "-q", "--depth", "2", pathToFileURL(dir).href, "c"]);
  const cwd = join(clone, "c");
  assert.equal(
    getLastModified(["new.txt"], { cwd }),
    "2026-11-10T09:00:00+01:00",
  );
  assert.equal(getLastModified(["mid.txt"], { cwd }), undefined);
  assert.equal(getLastModified(["old.txt"], { cwd }), undefined);
});

test("formatMonthYear writes the Spanish month in Europe/Madrid", () => {
  assert.equal(
    formatMonthYear("2026-11-10T09:30:00+01:00"),
    "noviembre de 2026",
  );
  assert.equal(formatMonthYear("2026-09-30T23:30:00Z"), "octubre de 2026");
});

const post = (pubDate, extra = {}) => ({
  data: { pubDate: new Date(pubDate), ...extra },
});

test("newestPublishedPostDate ignores a newer draft", () => {
  assert.equal(
    newestPublishedPostDate([
      post("2026-11-10"),
      post("2026-11-21", { draft: true }),
    ]),
    new Date("2026-11-10").toISOString(),
  );
});

test("newestPublishedPostDate prefers updatedDate over pubDate", () => {
  assert.equal(
    newestPublishedPostDate([
      post("2026-11-10", { updatedDate: new Date("2026-11-19") }),
      post("2026-11-15"),
    ]),
    new Date("2026-11-19").toISOString(),
  );
});

test("newestPublishedPostDate returns undefined without published posts", () => {
  assert.equal(newestPublishedPostDate([]), undefined);
  assert.equal(
    newestPublishedPostDate([post("2026-11-21", { draft: true })]),
    undefined,
  );
});

test("latestDate returns the newest ISO date and ignores undefined", () => {
  assert.equal(
    latestDate("2026-11-10T09:30:00+01:00", "2026-11-10T09:00:00Z", undefined),
    "2026-11-10T09:00:00Z",
  );
  assert.equal(
    latestDate(undefined, "2026-11-12T10:00:00Z"),
    "2026-11-12T10:00:00Z",
  );
  assert.equal(latestDate(undefined, undefined), undefined);
  assert.equal(latestDate(), undefined);
});
