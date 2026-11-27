import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const script = new URL("../scripts/client-report-web.mjs", import.meta.url)
  .pathname;

// A fake launcher: Search Console daily rows for the asked range, GA4 organic daily rows.
const FAKE = `#!/bin/sh
case "$1" in
  gsc_query)
    if [ "$3" = "2026-11-01" ]; then echo '{"rows":[{"clicks":2,"impressions":40},{"clicks":3,"impressions":60}]}';
    else echo '{"rows":[{"clicks":1,"impressions":30}]}'; fi ;;
  ga4_report)
    echo '{"error":null,"daily_data":[{"date":"20261015","sessions":4},{"date":"20261102","sessions":2},{"date":"20261130","sessions":5},{"date":"20261201","sessions":9}]}' ;;
  *) exit 2 ;;
esac
`;

function withLauncher(body, fn) {
  const dir = mkdtempSync(join(tmpdir(), "client-report-web-"));
  try {
    const run = join(dir, "run.sh");
    writeFileSync(run, body);
    chmodSync(run, 0o755);
    return fn(run);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const call = (run, args) =>
  spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    env: { ...process.env, CLIENT_REPORT_RUN: run },
  });

test("prints the month's Google clicks, appearances and organic visits against the month before", () => {
  withLauncher(FAKE, (run) => {
    const r = call(run, ["--from", "2026-11-01", "--to", "2026-11-30"]);
    assert.equal(r.status, 0, r.stderr);
    const byId = Object.fromEntries(
      JSON.parse(r.stdout).figures.map((f) => [f.id, [f.value, f.previous]]),
    );
    assert.deepEqual(byId, {
      "web-google-clicks": [5, 1],
      "web-google-appearances": [100, 30],
      "web-organic-visits": [7, 4],
    });
  });
});

test("a failing source is left out, never estimated; dates are required", () => {
  withLauncher("#!/bin/sh\necho boom >&2\nexit 1\n", (run) => {
    const r = call(run, ["--from", "2026-11-01", "--to", "2026-11-30"]);
    assert.equal(r.status, 0);
    assert.deepEqual(JSON.parse(r.stdout).figures, []);
    assert.match(r.stderr, /Search Console: boom/);
  });
  assert.equal(call("/bin/false", ["--from", "nope"]).status, 2);
});
