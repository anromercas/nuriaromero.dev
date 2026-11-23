#!/usr/bin/env node
// social-publish.mjs - schedule ONE approved social piece: Postiz for every network routed to it, and a ready
// Metricool payload for TikTok (the orchestrator passes it to the Metricool MCP tool createScheduledPost; this
// script never calls Metricool). Feature doc: odd/tasks/social-publishing-postiz.md (P1-T5).
//
// Usage:
//   node scripts/social-publish.mjs --piece <dir> --at <ISO datetime with Z or offset> [--confirm]
//        [--config .claude/harness.json] [--harness-dir <team-harness>] [--networks a,b]
//        [--comment-url <url>] [--no-comment x,instagram] [--youtube-title <title>]
//
// - Dry run by default: builds and prints every payload, no upload, no post, no API key needed.
//   Real calls only with --confirm, after the owner confirmed the piece in the session.
// - Approval: the team-harness publishing gate (scripts/social-gate.mjs checkGate, sha256-bound piece state) must
//   ALLOW the piece for --at; a DENY stops before any call. Found via --harness-dir, TEAM_HARNESS_DIR or the
//   $schema path of the config.
// - Routes: social.publishing.routes over the defaults (tiktok -> metricool, the rest -> postiz). Postiz options
//   in social.publishing.postiz: url (default https://postiz.nuriaromero.dev), channels (network -> integration
//   id), rateLimitPerHour (default 30, the documented public API limit), firstComment { text with {url}, url,
//   networks: { <network>: { enabled, text, url } } }. These keys are optional and not yet in the team-harness
//   schema, so built-in defaults apply until the schema allows them.
// - First comment: the website link with utm_source=<network>&utm_medium=social&utm_campaign=<piece>. On X it is
//   a reply billed as a post (about 0.20 USD with a URL, accepted by the owner); STRIP_LINKS_FROM_X_POSTS must
//   stay unset in Postiz.
// - API key: POSTIZ_API_KEY, else the macOS Keychain item postiz-api-key. Never printed or stored.
// - Output: one JSON result on stdout (per network: route, status, payload, postId or metricool payload, error);
//   human messages on stderr. Exit 0 all scheduled (or dry run ok), 1 refused or any network failed, 2 usage.
// - After a real run, record the post ids with the team-harness social-state.mjs advance --to scheduled.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  createPostizClient,
  DEFAULT_POSTIZ_URL,
} from "./lib/postiz-client.mjs";
import {
  harnessDirFromConfig,
  parseArgs,
  publishPiece,
  resolveApiKey,
  resolveRoutes,
} from "./lib/social-publish.mjs";

const say = (line) => process.stderr.write(`${line}\n`);

async function main(argv) {
  let args;
  try {
    args = parseArgs(argv);
  } catch (error) {
    say(`social-publish: ${error.message}`);
    return 2;
  }
  if (args.help) {
    say(
      readFileSync(new URL(import.meta.url), "utf8")
        .split("\n")
        .filter((l) => l.startsWith("//"))
        .map((l) => l.slice(3))
        .join("\n"),
    );
    return 0;
  }

  const config = JSON.parse(readFileSync(args.config, "utf8"));
  const social = config.social ?? {};
  const publishing = social.publishing ?? {};
  const postiz = publishing.postiz ?? {};
  const routes = resolveRoutes(publishing);
  const thDir = harnessDirFromConfig({
    config,
    flag: args.harnessDir,
    env: process.env,
  });
  const gateMod = await import(
    pathToFileURL(join(thDir, "scripts/social-gate.mjs")).href
  );
  const layoutMod = await import(
    pathToFileURL(join(thDir, "scripts/lib/social-layout.mjs")).href
  );
  const layout = layoutMod.socialLayout(social);

  const pieceDir = resolve(args.piece);
  const state = JSON.parse(readFileSync(join(pieceDir, "state.json"), "utf8"));
  const piece = state.piece ?? basename(pieceDir);
  const networks = (state.networks ?? []).filter(
    (n) => !args.networks || args.networks.includes(n),
  );

  const metricoolCount = networks.filter(
    (n) => routes[n] === "metricool",
  ).length;
  const gate = gateMod.checkGate({
    pieceDir,
    piecesDir: social.piecesDir ? resolve(social.piecesDir) : undefined,
    publishing,
    layout,
    scheduledFor: args.at,
    // The monthly quota of the gate is Metricool's: only the networks routed there spend it.
    posts: Math.max(1, metricoolCount),
  });
  if (!gate.allow) {
    say(`DENY ${piece}`);
    for (const r of gate.reasons ?? []) say(`FAIL ${r.code}: ${r.message}`);
  }

  const captions = {};
  for (const group of gateMod.postGroups({ pieceDir, layout }).groups)
    for (const n of group.networks) captions[n] = group.text;
  let copy = "";
  try {
    copy = readFileSync(join(pieceDir, layout.files.copy), "utf8");
  } catch {
    // a missing copy file already leaves every caption empty
  }
  const titles = Object.fromEntries(
    networks.map((n) => [
      n,
      layoutMod.titleIn(layoutMod.sectionOf(copy, n) ?? ""),
    ]),
  );
  if (args.youtubeTitle) titles.youtube = args.youtubeTitle;

  let client = null;
  if (gate.allow && !args.dryRun) {
    let apiKey;
    try {
      apiKey = resolveApiKey({
        env: process.env,
        keychain: (service) =>
          execFileSync(
            "security",
            ["find-generic-password", "-s", service, "-w"],
            { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
          ),
      });
    } catch (error) {
      say(`social-publish: ${error.message}`);
      return 2;
    }
    client = createPostizClient({
      baseUrl: postiz.url ?? DEFAULT_POSTIZ_URL,
      apiKey,
    });
  }

  const result = await publishPiece({
    piece,
    networks,
    at: args.at,
    timezone: publishing.timezone,
    gate,
    captions,
    titles,
    routes,
    postiz,
    client,
    readFile: (rel) => readFile(join(pieceDir, rel)),
    dryRun: args.dryRun,
    commentUrl: args.commentUrl,
    noComment: args.noComment,
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (args.dryRun && !result.refused)
    say(
      `Dry run: nothing uploaded or scheduled for ${piece}. Pass --confirm for real calls.`,
    );
  for (const [n, e] of Object.entries(result.networks))
    if (e.status === "error") say(`FAIL ${n}: ${e.error}`);
  if (result.error) say(`FAIL upload: ${result.error}`);
  return result.ok ? 0 : 1;
}

process.exitCode = await main(process.argv.slice(2));
