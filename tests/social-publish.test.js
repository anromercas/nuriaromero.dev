import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_ROUTES,
  resolveRoutes,
  withUtm,
  firstComment,
} from "../scripts/lib/social-publish.mjs";
import {
  mapChannels,
  providerSettings,
  buildPostizPost,
  buildMetricoolPayload,
} from "../scripts/lib/social-publish.mjs";
import { publishPiece } from "../scripts/lib/social-publish.mjs";
import {
  parseArgs,
  resolveApiKey,
  harnessDirFromConfig,
} from "../scripts/lib/social-publish.mjs";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

test("routes default to postiz for every network except tiktok", () => {
  assert.equal(DEFAULT_ROUTES.tiktok, "metricool");
  for (const n of [
    "instagram",
    "facebook",
    "youtube",
    "x",
    "threads",
    "linkedin",
    "linkedin-page",
  ])
    assert.equal(DEFAULT_ROUTES[n], "postiz", n);
});

test("resolveRoutes lets social.publishing.routes override the defaults", () => {
  const routes = resolveRoutes({ routes: { instagram: "metricool" } });
  assert.equal(routes.instagram, "metricool");
  assert.equal(routes.facebook, "postiz");
  assert.deepEqual(resolveRoutes(undefined), DEFAULT_ROUTES);
  assert.throws(
    () => resolveRoutes({ routes: { x: "buffer" } }),
    /unknown route "buffer" for x/,
  );
});

test("withUtm adds source, medium and campaign and keeps existing params", () => {
  assert.equal(
    withUtm("https://nuriaromero.dev/seo-local-sevilla/", {
      network: "x",
      campaign: "2026-11-24-piece",
    }),
    "https://nuriaromero.dev/seo-local-sevilla/?utm_source=x&utm_medium=social&utm_campaign=2026-11-24-piece",
  );
  assert.equal(
    withUtm("https://nuriaromero.dev/?a=1#top", {
      network: "facebook",
      campaign: "c",
    }),
    "https://nuriaromero.dev/?a=1&utm_source=facebook&utm_medium=social&utm_campaign=c#top",
  );
});

test("firstComment fills {url} with the tagged link, per network", () => {
  const config = { text: "Más en {url}", url: "https://nuriaromero.dev/" };
  assert.equal(
    firstComment("threads", { config, campaign: "p" }),
    "Más en https://nuriaromero.dev/?utm_source=threads&utm_medium=social&utm_campaign=p",
  );
});

test("firstComment can be disabled or overridden per network and from the command line", () => {
  const config = {
    text: "Más en {url}",
    url: "https://nuriaromero.dev/",
    networks: { instagram: { enabled: false }, x: { text: "Web: {url}" } },
  };
  assert.equal(firstComment("instagram", { config, campaign: "p" }), null);
  assert.match(
    firstComment("x", { config, campaign: "p" }),
    /^Web: https:\/\/nuriaromero\.dev\/\?utm_source=x/,
  );
  assert.equal(
    firstComment("facebook", { config, campaign: "p", disabled: ["facebook"] }),
    null,
  );
  assert.match(
    firstComment("facebook", {
      config,
      campaign: "p",
      url: "https://nuriaromero.dev/blog/",
    }),
    /blog\/\?utm_source=facebook/,
  );
  assert.equal(
    firstComment("facebook", { config: { enabled: false }, campaign: "p" }),
    null,
  );
  assert.equal(
    firstComment("facebook", { config: undefined, campaign: "p" }),
    null,
  );
});

const integrations = [
  { id: "ig1", name: "IG", identifier: "instagram", disabled: false },
  { id: "fb1", name: "FB", identifier: "facebook", disabled: false },
  { id: "yt1", name: "YT", identifier: "youtube", disabled: true },
  { id: "th1", name: "T1", identifier: "threads", disabled: false },
  { id: "th2", name: "T2", identifier: "threads", disabled: false },
];

test("mapChannels maps networks to enabled integrations by provider identifier", () => {
  const map = mapChannels(
    ["instagram", "facebook", "youtube", "x", "threads"],
    integrations,
  );
  assert.deepEqual(map.instagram, { id: "ig1", identifier: "instagram" });
  assert.deepEqual(map.facebook, { id: "fb1", identifier: "facebook" });
  assert.match(map.youtube.error, /youtube channel is disabled in Postiz/);
  assert.match(map.x.error, /no x channel connected in Postiz/);
  assert.match(
    map.threads.error,
    /2 threads channels.*social\.publishing\.postiz\.channels/,
  );
});

test("mapChannels honours pinned channel ids and instagram-standalone", () => {
  const map = mapChannels(
    ["threads", "instagram"],
    [
      ...integrations.filter((i) => i.identifier !== "instagram"),
      { id: "igs", identifier: "instagram-standalone", disabled: false },
    ],
    { threads: "th2" },
  );
  assert.deepEqual(map.threads, { id: "th2", identifier: "threads" });
  assert.deepEqual(map.instagram, {
    id: "igs",
    identifier: "instagram-standalone",
  });
  assert.match(
    mapChannels(["threads"], integrations, { threads: "nope" }).threads.error,
    /pinned threads channel nope/,
  );
});

test("providerSettings adds the fields each provider requires", () => {
  assert.deepEqual(providerSettings("instagram", { identifier: "instagram" }), {
    __type: "instagram",
    post_type: "post",
  });
  assert.deepEqual(providerSettings("facebook", { identifier: "facebook" }), {
    __type: "facebook",
  });
  assert.deepEqual(providerSettings("x", { identifier: "x" }), {
    __type: "x",
    who_can_reply_post: "everyone",
  });
  assert.deepEqual(providerSettings("threads", { identifier: "threads" }), {
    __type: "threads",
  });
  assert.deepEqual(
    providerSettings("youtube", {
      identifier: "youtube",
      title: "Horario de festivos",
    }),
    {
      __type: "youtube",
      title: "Horario de festivos",
      type: "public",
    },
  );
  assert.throws(
    () => providerSettings("youtube", { identifier: "youtube" }),
    /youtube needs a title of 2 to 100 characters/,
  );
  assert.deepEqual(
    providerSettings("linkedin-page", {
      identifier: "linkedin-page",
      imageCount: 3,
    }),
    {
      __type: "linkedin-page",
      post_as_images_carousel: true,
    },
  );
  assert.deepEqual(
    providerSettings("linkedin", { identifier: "linkedin", imageCount: 1 }),
    { __type: "linkedin" },
  );
});

test("buildPostizPost builds one scheduled post with media and the first comment as the second value item", () => {
  const body = buildPostizPost({
    integrationId: "ig1",
    date: "2026-11-24T10:00:00+01:00",
    text: "Caption",
    media: [{ id: "m1", path: "https://postiz.nuriaromero.dev/uploads/a.jpg" }],
    comment: "Más en https://nuriaromero.dev/",
    settings: { __type: "instagram", post_type: "post" },
  });
  assert.deepEqual(body, {
    type: "schedule",
    date: "2026-11-24T09:00:00.000Z",
    shortLink: false,
    tags: [],
    posts: [
      {
        integration: { id: "ig1" },
        value: [
          {
            content: "Caption",
            image: [
              {
                id: "m1",
                path: "https://postiz.nuriaromero.dev/uploads/a.jpg",
              },
            ],
          },
          { content: "Más en https://nuriaromero.dev/", image: [] },
        ],
        settings: { __type: "instagram", post_type: "post" },
      },
    ],
  });
  const noComment = buildPostizPost({
    integrationId: "fb1",
    date: "2026-11-24T09:00:00Z",
    text: "T",
    media: [],
    comment: null,
    settings: { __type: "facebook" },
  });
  assert.equal(noComment.posts[0].value.length, 1);
});

test("buildMetricoolPayload hands the orchestrator a ready TikTok post with the Postiz media URLs", () => {
  assert.deepEqual(
    buildMetricoolPayload({
      network: "tiktok",
      text: "Caption",
      date: "2026-11-24T10:00:00+01:00",
      timezone: "Europe/Madrid",
      mediaUrls: ["https://postiz.nuriaromero.dev/uploads/a.jpg"],
      audio: { autoAddMusic: true },
    }),
    {
      tool: "createScheduledPost",
      network: "tiktok",
      text: "Caption",
      date: "2026-11-24T10:00:00+01:00",
      timezone: "Europe/Madrid",
      media: ["https://postiz.nuriaromero.dev/uploads/a.jpg"],
      autoAddMusic: true,
    },
  );
});

const allow = {
  allow: true,
  reasons: [],
  files: {
    instagram: ["export/01.jpg", "export/02.jpg"],
    facebook: ["export/01.jpg", "export/02.jpg"],
    x: ["export/01.jpg"],
    tiktok: ["export/01.jpg", "export/02.jpg"],
  },
  audio: { tiktok: { autoAddMusic: true } },
};
const baseInput = () => ({
  piece: "2026-11-24-carrusel-x",
  networks: ["instagram", "facebook", "x", "tiktok"],
  at: "2026-11-24T10:00:00+01:00",
  timezone: "Europe/Madrid",
  gate: allow,
  captions: { instagram: "Cap", facebook: "Cap", x: "Short", tiktok: "Cap" },
  titles: {},
  routes: resolveRoutes({}),
  postiz: {
    firstComment: { text: "Más en {url}", url: "https://nuriaromero.dev/" },
  },
  readFile: async (rel) => new TextEncoder().encode(rel),
});

function fakeClient({
  integrations = [
    { id: "ig1", identifier: "instagram", disabled: false },
    { id: "fb1", identifier: "facebook", disabled: false },
  ],
  failPostFor = [],
} = {}) {
  const calls = { upload: [], posts: [], list: 0 };
  return {
    calls,
    listIntegrations: async () => {
      calls.list++;
      return integrations;
    },
    upload: async ({ name }) => {
      calls.upload.push(name);
      return {
        id: `id-${name}`,
        path: `https://postiz.nuriaromero.dev/uploads/${name}`,
        status: "ready",
      };
    },
    createPost: async (body) => {
      calls.posts.push(body);
      const id = body.posts[0].integration.id;
      if (failPostFor.includes(id))
        throw Object.assign(new Error(`POST /posts failed with HTTP 500`), {
          status: 500,
        });
      return [{ postId: `post-${id}`, integration: id }];
    },
  };
}

test("publishPiece refuses when the approval gate denies and calls nothing", async () => {
  const client = fakeClient();
  const out = await publishPiece({
    ...baseInput(),
    gate: {
      allow: false,
      reasons: [
        {
          code: "approval-stale",
          message: "final approval: export/01.jpg changed",
        },
      ],
    },
    client,
    dryRun: false,
  });
  assert.equal(out.ok, false);
  assert.equal(out.refused, true);
  assert.deepEqual(out.reasons, [
    {
      code: "approval-stale",
      message: "final approval: export/01.jpg changed",
    },
  ]);
  assert.deepEqual(client.calls, { upload: [], posts: [], list: 0 });
});

test("publishPiece dry run builds every payload without any call", async () => {
  const out = await publishPiece({
    ...baseInput(),
    client: null,
    dryRun: true,
  });
  assert.equal(out.ok, true);
  assert.equal(out.dryRun, true);
  assert.equal(out.networks.instagram.route, "postiz");
  assert.equal(out.networks.instagram.status, "dry-run");
  const ig = out.networks.instagram.payload;
  assert.equal(ig.date, "2026-11-24T09:00:00.000Z");
  assert.equal(ig.posts[0].integration.id, "<postiz instagram channel>");
  assert.deepEqual(
    ig.posts[0].value[0].image.map((m) => m.path),
    ["<upload export/01.jpg>", "<upload export/02.jpg>"],
  );
  assert.match(
    ig.posts[0].value[1].content,
    /utm_source=instagram&utm_medium=social&utm_campaign=2026-11-24-carrusel-x/,
  );
  assert.equal(
    out.networks.x.payload.posts[0].settings.who_can_reply_post,
    "everyone",
  );
  assert.equal(out.networks.tiktok.route, "metricool");
  assert.equal(out.networks.tiktok.status, "dry-run");
  assert.deepEqual(out.networks.tiktok.metricool.media, [
    "<upload export/01.jpg>",
    "<upload export/02.jpg>",
  ]);
  assert.equal(out.networks.tiktok.metricool.autoAddMusic, true);
  assert.deepEqual(out.requests, {
    integrations: 1,
    uploads: 2,
    posts: 3,
    total: 6,
  });
});

test("publishPiece uploads each file once, schedules per network and reports partial failures", async () => {
  const client = fakeClient({ failPostFor: ["fb1"] });
  const out = await publishPiece({ ...baseInput(), client, dryRun: false });
  assert.deepEqual(client.calls.upload, ["01.jpg", "02.jpg"]);
  assert.equal(client.calls.list, 1);
  assert.equal(client.calls.posts.length, 2);
  assert.equal(out.networks.instagram.status, "scheduled");
  assert.equal(out.networks.instagram.postId, "post-ig1");
  assert.equal(out.networks.facebook.status, "error");
  assert.match(out.networks.facebook.error, /HTTP 500/);
  assert.equal(out.networks.facebook.httpStatus, 500);
  assert.equal(out.networks.x.status, "error");
  assert.match(out.networks.x.error, /no x channel connected/);
  assert.equal(out.networks.tiktok.status, "ready-for-metricool");
  assert.deepEqual(out.networks.tiktok.metricool.media, [
    "https://postiz.nuriaromero.dev/uploads/01.jpg",
    "https://postiz.nuriaromero.dev/uploads/02.jpg",
  ]);
  assert.equal(out.ok, false);
});

test("publishPiece refuses before any call when the run would exceed the hourly request budget", async () => {
  const client = fakeClient();
  const out = await publishPiece({
    ...baseInput(),
    postiz: { rateLimitPerHour: 5 },
    client,
    dryRun: false,
  });
  assert.equal(out.ok, false);
  assert.equal(out.refused, true);
  assert.match(
    out.reasons[0].message,
    /6 Postiz requests.*limit of 5 per hour/,
  );
  assert.deepEqual(client.calls, { upload: [], posts: [], list: 0 });
});

test("publishPiece reports a network without caption or youtube title as an error and keeps the rest", async () => {
  const input = baseInput();
  input.networks = ["instagram", "youtube"];
  input.gate = {
    ...allow,
    files: { instagram: ["export/01.jpg"], youtube: ["export/v.mp4"] },
  };
  input.captions = { youtube: "Cap" };
  const out = await publishPiece({ ...input, client: null, dryRun: true });
  assert.match(out.networks.instagram.error, /no caption for instagram/);
  assert.match(out.networks.youtube.error, /youtube needs a title/);
  const ok = await publishPiece({
    ...input,
    captions: { instagram: "a", youtube: "b" },
    titles: { youtube: "Título" },
    client: null,
    dryRun: true,
  });
  assert.equal(ok.networks.youtube.payload.posts[0].settings.title, "Título");
});

test("an upload failure stops the run before any post is created", async () => {
  const client = fakeClient();
  client.upload = async () => {
    throw Object.assign(new Error("POST /upload failed with HTTP 413"), {
      status: 413,
    });
  };
  const out = await publishPiece({ ...baseInput(), client, dryRun: false });
  assert.equal(out.ok, false);
  assert.match(out.error, /HTTP 413/);
  assert.equal(client.calls.posts.length, 0);
});

test("parseArgs defaults to a dry run and needs --confirm for real calls", () => {
  const a = parseArgs([
    "--piece",
    "social/piezas/p",
    "--at",
    "2026-11-24T10:00:00+01:00",
  ]);
  assert.equal(a.dryRun, true);
  assert.equal(a.piece, "social/piezas/p");
  assert.deepEqual(a.noComment, []);
  const b = parseArgs([
    "--piece",
    "p",
    "--at",
    "2026-11-24T10:00:00Z",
    "--confirm",
    "--no-comment",
    "x,instagram",
    "--networks",
    "facebook",
  ]);
  assert.equal(b.dryRun, false);
  assert.deepEqual(b.noComment, ["x", "instagram"]);
  assert.deepEqual(b.networks, ["facebook"]);
  assert.throws(
    () => parseArgs(["--at", "2026-11-24T10:00:00Z"]),
    /--piece is required/,
  );
  assert.throws(() => parseArgs(["--piece", "p"]), /--at is required/);
  assert.throws(
    () => parseArgs(["--piece", "p", "--at", "2026-11-24 10:00"]),
    /--at must be an ISO datetime with Z or an offset/,
  );
  assert.throws(
    () =>
      parseArgs([
        "--piece",
        "p",
        "--at",
        "2026-11-24T10:00:00Z",
        "--bogus",
        "1",
      ]),
    /unknown option --bogus/,
  );
});

test("resolveApiKey prefers POSTIZ_API_KEY, then the Keychain item postiz-api-key", () => {
  assert.equal(
    resolveApiKey({ env: { POSTIZ_API_KEY: "env-key" }, keychain: () => "kc" }),
    "env-key",
  );
  let asked;
  assert.equal(
    resolveApiKey({
      env: {},
      keychain: (service) => {
        asked = service;
        return "kc-key\n";
      },
    }),
    "kc-key",
  );
  assert.equal(asked, "postiz-api-key");
  assert.throws(
    () =>
      resolveApiKey({
        env: {},
        keychain: () => {
          throw new Error("not found");
        },
      }),
    /Postiz API key not found/,
  );
});

test("harnessDirFromConfig finds team-harness from the config $schema, overridable", () => {
  const config = { $schema: "/opt/team-harness/templates/harness.schema.json" };
  assert.equal(harnessDirFromConfig({ config }), "/opt/team-harness");
  assert.equal(
    harnessDirFromConfig({ config, env: { TEAM_HARNESS_DIR: "/env/th" } }),
    "/env/th",
  );
  assert.equal(
    harnessDirFromConfig({
      config,
      flag: "/flag/th",
      env: { TEAM_HARNESS_DIR: "/env/th" },
    }),
    "/flag/th",
  );
  assert.throws(
    () => harnessDirFromConfig({ config: {} }),
    /team-harness folder unknown/,
  );
});

const CLI = resolve("scripts/social-publish.mjs");

/** A temp project with a fake team-harness gate (no real approval rules: those are tested in team-harness). */
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "social-publish-"));
  const th = join(root, "team-harness");
  mkdirSync(join(th, "scripts/lib"), { recursive: true });
  writeFileSync(
    join(th, "scripts/social-gate.mjs"),
    `
export function checkGate({ pieceDir, scheduledFor, posts }) {
  if (process.env.FAKE_GATE_DENY) return { piece: "p", allow: false, reasons: [{ code: "approval-required", message: "the final approval is missing" }], warnings: [] };
  return { piece: "p", allow: true, reasons: [], warnings: [], files: { instagram: ["export/01.jpg"], tiktok: ["export/01.jpg"] }, audio: { tiktok: { autoAddMusic: false } }, seen: { scheduledFor, posts } };
}
export function postGroups() {
  return { piece: "p", groups: [{ networks: ["instagram", "tiktok"], text: "Caption", files: ["export/01.jpg"] }], problems: [] };
}
`,
  );
  writeFileSync(
    join(th, "scripts/lib/social-layout.mjs"),
    `
export const socialLayout = () => ({ files: { copy: "textos.md", credits: "creditos.json" }, headings: {} });
export const sectionOf = () => null;
export const titleIn = () => "";
`,
  );
  const piece = join(root, "social/piezas/2026-11-24-carrusel-x");
  mkdirSync(join(piece, "export"), { recursive: true });
  writeFileSync(join(piece, "export/01.jpg"), "x");
  writeFileSync(
    join(piece, "textos.md"),
    "## All networks\n\n```\nCaption\n```\n",
  );
  writeFileSync(
    join(piece, "state.json"),
    JSON.stringify({
      piece: "2026-11-24-carrusel-x",
      networks: ["instagram", "tiktok"],
      state: "approved",
    }),
  );
  mkdirSync(join(root, ".claude"));
  writeFileSync(
    join(root, ".claude/harness.json"),
    JSON.stringify({
      $schema: join(th, "templates/harness.schema.json"),
      social: {
        piecesDir: "social/piezas",
        publishing: { timezone: "Europe/Madrid" },
      },
    }),
  );
  return { root, piece };
}

function run(root, args, env = {}) {
  const clean = { ...process.env, ...env };
  delete clean.POSTIZ_API_KEY;
  delete clean.TEAM_HARNESS_DIR;
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd: root,
    encoding: "utf8",
    env: clean,
  });
}

test("CLI dry run prints one JSON result with Postiz and Metricool payloads and needs no API key", () => {
  const { root, piece } = fixture();
  try {
    const r = run(root, [
      "--piece",
      piece,
      "--at",
      "2026-11-24T10:00:00+01:00",
    ]);
    assert.equal(r.status, 0, r.stderr);
    const out = JSON.parse(r.stdout);
    assert.equal(out.dryRun, true);
    assert.equal(out.networks.instagram.status, "dry-run");
    assert.equal(
      out.networks.instagram.payload.posts[0].value[0].content,
      "Caption",
    );
    assert.equal(out.networks.tiktok.route, "metricool");
    assert.equal(out.networks.tiktok.metricool.timezone, "Europe/Madrid");
    assert.match(r.stderr, /dry run/i);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("CLI refuses with exit 1 when the gate denies, even with --confirm, before touching the API key", () => {
  const { root, piece } = fixture();
  try {
    const r = run(
      root,
      ["--piece", piece, "--at", "2026-11-24T10:00:00+01:00", "--confirm"],
      { FAKE_GATE_DENY: "1" },
    );
    assert.equal(r.status, 1);
    const out = JSON.parse(r.stdout);
    assert.equal(out.refused, true);
    assert.equal(out.reasons[0].code, "approval-required");
    assert.match(r.stderr, /DENY/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("CLI exits 2 on a usage error", () => {
  const r = run(process.cwd(), ["--piece", "x"]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /--at is required/);
});

test("firstComment with only --comment-url and no configured text comments the bare tagged link", () => {
  assert.equal(
    firstComment("facebook", {
      config: undefined,
      campaign: "p",
      url: "https://nuriaromero.dev/",
    }),
    "https://nuriaromero.dev/?utm_source=facebook&utm_medium=social&utm_campaign=p",
  );
});
