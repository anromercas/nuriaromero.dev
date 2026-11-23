// Pure core of scripts/social-publish.mjs: routing, channel mapping, first comment with UTM tags and the
// payloads for the two publishers (Postiz adapter, Metricool adapter). No I/O here.

/** Publisher per network. TikTok stays on Metricool (Direct Post audit not approvable, see the feature doc). */
export const DEFAULT_ROUTES = Object.freeze({
  instagram: "postiz",
  facebook: "postiz",
  youtube: "postiz",
  x: "postiz",
  threads: "postiz",
  linkedin: "postiz",
  "linkedin-page": "postiz",
  tiktok: "metricool",
});
export const PUBLISHERS = ["postiz", "metricool"];

/** Routes: social.publishing.routes (optional) over DEFAULT_ROUTES. */
export function resolveRoutes(publishing) {
  const given = publishing?.routes ?? {};
  for (const [network, route] of Object.entries(given))
    if (!PUBLISHERS.includes(route))
      throw new Error(
        `unknown route "${route}" for ${network} (use ${PUBLISHERS.join(" or ")})`,
      );
  return { ...DEFAULT_ROUTES, ...given };
}

/** The link with utm_source=<network>&utm_medium=social&utm_campaign=<campaign>, existing params kept. */
export function withUtm(url, { network, campaign }) {
  const u = new URL(url);
  u.searchParams.set("utm_source", network);
  u.searchParams.set("utm_medium", "social");
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

/** True when the first comment is switched off for a network (config or --no-comment), as opposed to missing a link. */
export function commentDisabled(network, { config, disabled = [] }) {
  const cfg = config ?? {};
  return (
    cfg.enabled === false ||
    disabled.includes(network) ||
    cfg.networks?.[network]?.enabled === false
  );
}

/**
 * Text of the first comment (Postiz: the second item of `value`) for one network, or null for none.
 * config: { enabled?, text: "... {url} ...", url, networks: { <network>: { enabled?, text?, url? } } }
 * Default (owner-approved): without configured text the comment is just the piece link with its UTM tags. The link
 * is `url` (--comment-url), else the network's url, else config.url; with no link a "{url}" text gives null.
 * `url` and `disabled` are command-line overrides. Cost note: on X the comment is a reply billed as a post,
 * about 0.20 USD with a URL (owner accepted); STRIP_LINKS_FROM_X_POSTS must stay unset in Postiz, since it also
 * strips links from comments.
 */
export function firstComment(
  network,
  { config, campaign, url, disabled = [] },
) {
  if (commentDisabled(network, { config, disabled })) return null;
  const cfg = config ?? {};
  const own = cfg.networks?.[network] ?? {};
  const text = own.text ?? cfg.text ?? "{url}";
  const link = url ?? own.url ?? cfg.url;
  if (!link) return text.includes("{url}") ? null : text;
  return text.replaceAll("{url}", withUtm(link, { network, campaign }));
}

/** Postiz provider identifiers accepted for each network (GET /integrations `identifier`). */
const IDENTIFIERS = {
  instagram: ["instagram", "instagram-standalone"],
  facebook: ["facebook"],
  youtube: ["youtube"],
  x: ["x"],
  threads: ["threads"],
  linkedin: ["linkedin"],
  "linkedin-page": ["linkedin-page"],
};

/**
 * Network -> { id, identifier } or { error } from the Postiz integrations list. `pinned` is
 * social.publishing.postiz.channels ({ <network>: <integration id> }) for networks with several channels.
 * One network's error never affects the others.
 */
export function mapChannels(networks, integrations, pinned = {}) {
  const out = {};
  for (const network of networks) {
    const accepted = IDENTIFIERS[network] ?? [network];
    const candidates = integrations.filter((i) =>
      accepted.includes(i.identifier),
    );
    const pick = (i) =>
      i.disabled
        ? {
            error: `${network} channel is disabled in Postiz (${i.name ?? i.id})`,
          }
        : { id: i.id, identifier: i.identifier };
    if (pinned[network]) {
      const found = candidates.find((i) => i.id === pinned[network]);
      out[network] = found
        ? pick(found)
        : {
            error: `pinned ${network} channel ${pinned[network]} is not in Postiz`,
          };
      continue;
    }
    const enabled = candidates.filter((i) => !i.disabled);
    if (enabled.length === 1) out[network] = pick(enabled[0]);
    else if (enabled.length > 1)
      out[network] = {
        error: `${enabled.length} ${network} channels in Postiz; pin one in social.publishing.postiz.channels`,
      };
    else if (candidates.length) out[network] = pick(candidates[0]);
    else out[network] = { error: `no ${network} channel connected in Postiz` };
  }
  return out;
}

/**
 * The `settings` object Postiz requires per provider. Source: https://docs.postiz.com/public-api/providers/<name>.md
 * (read 2026-11-23): instagram needs post_type (post|story); x needs who_can_reply_post; youtube needs title
 * (2-100 chars) and type (public|unlisted|private); facebook, threads and linkedin(-page) need only __type
 * (linkedin post_as_images_carousel is optional and set for several images).
 */
export function providerSettings(
  network,
  { identifier, title, imageCount = 0 },
) {
  const __type = identifier;
  switch (network) {
    case "instagram":
      return { __type, post_type: "post" };
    case "x":
      return { __type, who_can_reply_post: "everyone" };
    case "youtube":
      if (
        typeof title !== "string" ||
        title.trim().length < 2 ||
        title.trim().length > 100
      )
        throw new Error(
          "youtube needs a title of 2 to 100 characters (a title above the caption block of its copy section, or --youtube-title)",
        );
      return { __type, title: title.trim(), type: "public" };
    case "linkedin":
    case "linkedin-page":
      return imageCount > 1
        ? { __type, post_as_images_carousel: true }
        : { __type };
    default:
      return { __type };
  }
}

/**
 * Body of POST /api/public/v1/posts for one network. Shape verified against
 * https://docs.postiz.com/public-api/posts/create.md (2026-11-23): type, date (UTC ISO), shortLink, tags and
 * posts[{ integration: { id }, value: [{ content, image: [{ id, path }] }], settings: { __type, ... } }].
 * The first comment is the second `value` item: documented as a chained reply for x and threads; for
 * facebook, instagram and linkedin it is how the Postiz editor stores comments (not stated in the public API docs).
 */
export function buildPostizPost({
  integrationId,
  date,
  text,
  media,
  comment,
  settings,
}) {
  const value = [
    { content: text, image: media.map(({ id, path }) => ({ id, path })) },
  ];
  if (comment) value.push({ content: comment, image: [] });
  return {
    type: "schedule",
    date: new Date(date).toISOString(),
    shortLink: false,
    tags: [],
    posts: [{ integration: { id: integrationId }, value, settings }],
  };
}

/**
 * What the orchestrator passes to the Metricool MCP tool createScheduledPost (the script never calls it).
 * The exact argument names of that tool are mapped by the orchestrator.
 */
export function buildMetricoolPayload({
  network,
  text,
  date,
  timezone,
  mediaUrls,
  audio = {},
}) {
  return {
    tool: "createScheduledPost",
    network,
    text,
    date,
    timezone,
    media: [...mediaUrls],
    ...(typeof audio.autoAddMusic === "boolean"
      ? { autoAddMusic: audio.autoAddMusic }
      : {}),
  };
}

/** Requests per hour the Postiz public API allows (docs: 30/hour; override with social.publishing.postiz.rateLimitPerHour). */
export const DEFAULT_RATE_LIMIT = 30;

const MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
};
const mimeOf = (rel) =>
  MIME[rel.split(".").pop().toLowerCase()] ?? "application/octet-stream";
const baseName = (rel) => rel.split("/").pop();
const placeholder = (rel) => ({
  id: `<upload ${rel}>`,
  path: `<upload ${rel}>`,
});

/** social.publishing.postiz.rateLimitPerHour when it is a positive integer, else DEFAULT_RATE_LIMIT. */
export function rateLimitOf(postiz) {
  const n = postiz?.rateLimitPerHour;
  return Number.isInteger(n) && n > 0 ? n : DEFAULT_RATE_LIMIT;
}

const passThrough = { run: (fn) => fn(), plan: () => null };

/**
 * Publishes one piece through its routes. Inputs are plain data computed by the CLI from the team-harness gate
 * (scripts/social-gate.mjs checkGate: allow, reasons, files per network, audio) and the piece captions; `client`
 * is the Postiz adapter (null in a dry run). Every Postiz request goes through `limiter.run` (scripts/lib/
 * rate-limit.mjs), which waits for the hourly window instead of refusing, so nothing is dropped; `limiter.plan`
 * reports the budget in the result. Returns one JSON-able result; never throws for a network failure.
 * A denied gate or a failed upload stops the run before any post is created.
 */
export async function publishPiece({
  piece,
  networks,
  at,
  timezone,
  gate,
  captions = {},
  titles = {},
  routes,
  postiz = {},
  client,
  readFile,
  dryRun = true,
  commentUrl,
  noComment = [],
  limiter = passThrough,
}) {
  const result = { piece, at, dryRun, ok: false, networks: {} };
  if (!gate?.allow)
    return {
      ...result,
      refused: true,
      reasons: gate?.reasons ?? [
        { code: "gate", message: "the approval gate did not allow" },
      ],
    };

  // Build what does not depend on Postiz: caption, comment, settings inputs.
  const plan = {};
  for (const network of networks) {
    const route = routes[network];
    const entry = (result.networks[network] = {
      route: route ?? null,
      status: "pending",
    });
    const fail = (message) =>
      Object.assign(entry, { status: "error", error: message });
    if (!route) {
      fail(`no route for ${network}`);
      continue;
    }
    const files = gate.files?.[network] ?? [];
    const text = captions[network];
    if (!text) {
      fail(`no caption for ${network} in the copy file`);
      continue;
    }
    if (route === "postiz") {
      try {
        providerSettings(network, {
          identifier: network,
          title: titles[network],
          imageCount: files.length,
        });
      } catch (error) {
        fail(error.message);
        continue;
      }
    }
    const commentOpts = {
      config: postiz.firstComment,
      campaign: piece,
      url: commentUrl,
      disabled: noComment,
    };
    const comment =
      route === "postiz" ? firstComment(network, commentOpts) : null;
    if (
      route === "postiz" &&
      comment === null &&
      !commentDisabled(network, commentOpts)
    )
      entry.warnings = [
        `no link for the first comment of ${network} (set --comment-url or social.publishing.postiz.firstComment.url); publishing without a comment`,
      ];
    plan[network] = { route, files, text, comment };
  }

  const planned = Object.keys(plan);
  const uniqueFiles = [...new Set(planned.flatMap((n) => plan[n].files))];
  const postCount = planned.filter((n) => plan[n].route === "postiz").length;
  const requests = {
    integrations: postCount ? 1 : 0,
    uploads: uniqueFiles.length,
    posts: postCount,
  };
  requests.total = requests.integrations + requests.uploads + requests.posts;
  result.requests = requests;
  const budget = limiter.plan?.(requests.total);
  if (budget) result.rateLimit = budget;

  // Channels and media: placeholders in a dry run, real calls otherwise.
  let channels = Object.fromEntries(
    planned.map((n) => [n, { id: `<postiz ${n} channel>`, identifier: n }]),
  );
  const media = {};
  if (dryRun) for (const rel of uniqueFiles) media[rel] = placeholder(rel);
  else {
    try {
      if (postCount)
        channels = mapChannels(
          planned.filter((n) => plan[n].route === "postiz"),
          await limiter.run(() => client.listIntegrations()),
          postiz.channels ?? {},
        );
      for (const rel of uniqueFiles) {
        const bytes = await readFile(rel);
        const uploaded = await limiter.run(() =>
          client.upload({ name: baseName(rel), bytes, type: mimeOf(rel) }),
        );
        media[rel] = { id: uploaded.id, path: uploaded.path };
      }
    } catch (error) {
      return {
        ...result,
        error: error.message,
        httpStatus: error.status ?? null,
      };
    }
  }

  for (const network of planned) {
    const { route, files, text, comment } = plan[network];
    const entry = result.networks[network];
    const items = files.map((rel) => media[rel]);
    if (route === "metricool") {
      entry.metricool = buildMetricoolPayload({
        network,
        text,
        date: at,
        timezone,
        mediaUrls: items.map((m) => m.path),
        audio: gate.audio?.[network],
      });
      entry.status = dryRun ? "dry-run" : "ready-for-metricool";
      continue;
    }
    const channel = channels[network];
    if (!channel || channel.error) {
      Object.assign(entry, {
        status: "error",
        error: channel?.error ?? `no ${network} channel`,
      });
      continue;
    }
    const settings = providerSettings(network, {
      identifier: channel.identifier,
      title: titles[network],
      imageCount: files.length,
    });
    entry.payload = buildPostizPost({
      integrationId: channel.id,
      date: at,
      text,
      media: items,
      comment,
      settings,
    });
    if (dryRun) {
      entry.status = "dry-run";
      continue;
    }
    try {
      const created = await limiter.run(() => client.createPost(entry.payload));
      Object.assign(entry, {
        status: "scheduled",
        postId: created?.[0]?.postId ?? null,
      });
    } catch (error) {
      Object.assign(entry, {
        status: "error",
        error: error.message,
        httpStatus: error.status ?? null,
      });
    }
  }
  result.ok = Object.values(result.networks).every((e) => e.status !== "error");
  return result;
}

// --- Command-line helpers ---

const ISO_WITH_ZONE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const VALUE_FLAGS = [
  "piece",
  "at",
  "config",
  "harness-dir",
  "comment-url",
  "no-comment",
  "youtube-title",
  "networks",
];
const list = (value) =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--confirm") flags.confirm = true;
    else if (arg === "--help" || arg === "-h") flags.help = true;
    else if (arg.startsWith("--") && VALUE_FLAGS.includes(arg.slice(2))) {
      if (i + 1 >= argv.length) throw new Error(`${arg} needs a value`);
      flags[arg.slice(2)] = argv[++i];
    } else throw new Error(`unknown option ${arg}`);
  }
  if (flags.help) return { help: true };
  if (!flags.piece) throw new Error("--piece is required");
  if (!flags.at) throw new Error("--at is required");
  if (!ISO_WITH_ZONE.test(flags.at) || Number.isNaN(Date.parse(flags.at)))
    throw new Error(
      "--at must be an ISO datetime with Z or an offset, e.g. 2026-11-24T10:00:00+01:00",
    );
  return {
    piece: flags.piece,
    at: flags.at,
    dryRun: flags.confirm !== true,
    config: flags.config ?? ".claude/harness.json",
    harnessDir: flags["harness-dir"],
    commentUrl: flags["comment-url"],
    noComment: flags["no-comment"] ? list(flags["no-comment"]) : [],
    youtubeTitle: flags["youtube-title"],
    networks: flags.networks ? list(flags.networks) : null,
  };
}

/** POSTIZ_API_KEY, else `security find-generic-password -s postiz-api-key -w` (injected as `keychain`). */
export function resolveApiKey({ env, keychain }) {
  if (env.POSTIZ_API_KEY) return env.POSTIZ_API_KEY;
  try {
    const key = String(keychain("postiz-api-key")).trim();
    if (key) return key;
  } catch {
    // fall through to the error without echoing what the Keychain said
  }
  throw new Error(
    "Postiz API key not found: set POSTIZ_API_KEY or add the Keychain item postiz-api-key",
  );
}

/** The team-harness folder that holds scripts/social-gate.mjs: --harness-dir, TEAM_HARNESS_DIR, or the config $schema. */
export function harnessDirFromConfig({ config, flag, env = {} }) {
  if (flag) return flag;
  if (env.TEAM_HARNESS_DIR) return env.TEAM_HARNESS_DIR;
  const schema = config?.$schema;
  if (
    typeof schema === "string" &&
    schema.endsWith("/templates/harness.schema.json")
  )
    return schema.slice(0, -"/templates/harness.schema.json".length);
  throw new Error(
    "team-harness folder unknown: pass --harness-dir or set TEAM_HARNESS_DIR",
  );
}
