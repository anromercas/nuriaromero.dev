import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readSource = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

const workflowPath = ".github/workflows/ci.yml";

test("CI workflow file exists and is named CI", async () => {
  const yml = await readSource(workflowPath);
  assert.match(yml, /^name: CI$/m);
});

test("runs on pull requests to develop and pushes to develop and main", async () => {
  const yml = await readSource(workflowPath);
  assert.match(yml, /pull_request:\s*\n\s+branches: \[develop\]/);
  assert.match(yml, /push:\s*\n\s+branches: \[develop, main\]/);
});

test("defines the verify job on ubuntu-latest", async () => {
  const yml = await readSource(workflowPath);
  assert.match(yml, /^jobs:\s*\n\s+verify:/m);
  assert.match(yml, /^\s+name: verify$/m);
  assert.match(yml, /^\s+runs-on: ubuntu-latest$/m);
});

test("verify steps run in the required order", async () => {
  const yml = await readSource(workflowPath);
  const markers = [
    "actions/checkout@v4",
    "pnpm/action-setup@v4",
    "version: 11",
    "actions/setup-node@v4",
    "node-version: 24",
    "cache: pnpm",
    "pnpm install --frozen-lockfile",
    "pnpm build",
    "node --test tests/*.test.js",
    "pnpm check:seo:dist",
  ];
  const positions = markers.map((marker) => {
    const index = yml.indexOf(marker);
    assert.notEqual(index, -1, `missing step marker: ${marker}`);
    return index;
  });
  const sorted = [...positions].sort((a, b) => a - b);
  assert.deepEqual(positions, sorted, "steps are out of order");
});

test("runs the unit tests once, after the single build", async () => {
  const yml = await readSource(workflowPath);
  const builds = yml.match(/^\s+(?:- )?run: pnpm build$/gm) ?? [];
  const tests = yml.match(/^\s+(?:- )?run: node --test\b.*$/gm) ?? [];
  assert.equal(builds.length, 1, "expected exactly one `pnpm build` step");
  assert.equal(tests.length, 1, "expected exactly one `node --test` step");
  assert.ok(
    yml.indexOf("run: node --test tests/*.test.js") >
      yml.indexOf("run: pnpm build"),
    "unit tests must run after pnpm build so dist/ cases execute (NRD-311)",
  );
});

test("runs the SEO build checks once, right after the build", async () => {
  const yml = await readSource(workflowPath);
  const checks = yml.match(/^\s+run: pnpm check:seo:dist$/gm) ?? [];
  assert.equal(
    checks.length,
    1,
    "expected exactly one `run: pnpm check:seo:dist` step",
  );
  const build = yml.indexOf("run: pnpm build");
  assert.notEqual(build, -1, "missing `run: pnpm build` step");
  assert.ok(
    yml.indexOf("run: pnpm check:seo:dist") > build,
    "pnpm check:seo:dist must run after pnpm build",
  );
});

test("token permissions are read-only", async () => {
  const yml = await readSource(workflowPath);
  assert.match(yml, /^permissions:\s*\n\s+contents: read$/m);
});

test("does not reference secrets, netlify or deploy", async () => {
  const yml = await readSource(workflowPath);
  assert.doesNotMatch(yml, /secrets\./i);
  assert.doesNotMatch(yml, /netlify/i);
  assert.doesNotMatch(yml, /deploy/i);
});

test("pull_request types include labeled and unlabeled (NRD-370)", async () => {
  const yml = await readSource(workflowPath);
  assert.match(
    yml,
    /pull_request:\s*\n\s+branches: \[develop\]\s*\n\s+types: \[opened, synchronize, reopened, labeled, unlabeled\]/,
  );
});

test("checkout fetches full history for the merge base (NRD-370)", async () => {
  const yml = await readSource(workflowPath);
  assert.match(yml, /actions\/checkout@v4\s*\n\s+with:\s*\n\s+fetch-depth: 0/);
});

test("publish approval guard runs on pull requests only, with env inputs (NRD-370)", async () => {
  const yml = await readSource(workflowPath);
  const step = yml.match(
    /- name: Publish approval guard\n((?: {8,}.*\n)+)/,
  )?.[1];
  assert.ok(step, "missing `Publish approval guard` step");
  assert.match(step, /if: github\.event_name == 'pull_request'/);
  assert.match(
    step,
    /BASE_SHA: \$\{\{ github\.event\.pull_request\.base\.sha \}\}/,
  );
  assert.match(
    step,
    /HEAD_SHA: \$\{\{ github\.event\.pull_request\.head\.sha \}\}/,
  );
  assert.match(
    step,
    /PR_LABELS: \$\{\{ toJSON\(github\.event\.pull_request\.labels\.\*\.name\) \}\}/,
  );
  const run = step.slice(step.indexOf("run:"));
  assert.doesNotMatch(run, /\$\{\{/, "no expression interpolation in run");
});

test("publish approval guard runs the trusted BASE copy, not the PR head (NRD-370)", async () => {
  const yml = await readSource(workflowPath);
  const step = yml.match(
    /- name: Publish approval guard\n((?: {8,}.*\n)+)/,
  )?.[1];
  assert.ok(step, "missing `Publish approval guard` step");
  const run = step.slice(step.indexOf("run:"));
  assert.match(run, /git archive "\$BASE_SHA" scripts/);
  assert.match(run, /RUNNER_TEMP/);
  assert.match(run, /node "\$guard\/scripts\/check-publish-approval\.mjs"/);
  assert.match(
    run,
    /git cat-file -e "\$BASE_SHA:scripts\/check-publish-approval\.mjs"/,
  );
  assert.match(run, /bootstrap/i, "bootstrap fallback must be explained");
  assert.match(run, /node scripts\/check-publish-approval\.mjs/);
});

test("publish approval guard runs before install and the build (NRD-370)", async () => {
  const yml = await readSource(workflowPath);
  const guard = yml.indexOf("- name: Publish approval guard");
  assert.ok(guard > yml.indexOf("actions/setup-node@v4"));
  assert.ok(guard < yml.indexOf("pnpm install --frozen-lockfile"));
  assert.ok(guard < yml.indexOf("run: pnpm build"));
});
