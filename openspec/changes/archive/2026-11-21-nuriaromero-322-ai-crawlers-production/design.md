## Context

- `src/data/crawler-policy.ts` holds the robots policy (8 rules, all `allow: "/"`), consumed by `astro-robots-txt` in `astro.config.mjs:72` and by `buildAiTxt` in `src/lib/ai-discovery.ts`. Guards: `tests/ai-discovery.test.js:16` and `tests/ai-discovery-contract.test.js`.
- `public/_headers` (infra-owned, Netlify format): a path pattern on an unindented line, then indented `Name: value` lines. Today: `/*` (security headers and CSP), `/_astro/*` (cache), `/informes/*` (`X-Robots-Tag: noindex, nofollow`).
- Production deploys from `main` only; develop is promoted by a scheduled task. The evidence therefore reflects what is live today, which is what answer engines see.

## Goals / Non-Goals

**Goals:** a header-level guard so a noindex rule can never reach public pages; dated production evidence per AI user-agent.

**Non-Goals:** editing headers, robots, CSP or Netlify; fixing a block (owner); re-testing robots/ai.txt.

## Decisions

**Approach.** One subtask, one commit. The test carries its own small parser for the Netlify `_headers` format (no shared module: one consumer, about 15 lines), so `src/` stays untouched. It runs the rule against inline fixture strings first (to observe RED and pin the semantics), then against the real file. The production check is a one-off, read-only `curl` loop whose output goes into the PR body; it is evidence, not a recurring test, because unit tests must not depend on the network.

**Files (layer `app`).**

- Create `tests/robots-headers.test.js`:
  - `parseHeaders(text)` returns `Array<{ pattern: string, headers: Array<{ name: string, value: string }> }>`: an unindented, non-empty, non-comment line starts a block; indented `Name: value` lines belong to it; `#` lines are ignored.
  - `noindexViolations(blocks)` returns `string[]`: one message per block whose pattern is not exactly `/informes/*` (so `/*` always counts) and that has a header named `x-robots-tag` (case-insensitive) whose comma/space-separated tokens include `noindex` or `none` (case-insensitive token match, so `nonexistent` does not count).
  - Cases: fixture `/*` with noindex fails; fixture `/blog/*` with `none` fails; fixture with only `/informes/*` noindex passes; the real `public/_headers` passes; the real `/informes/*` block still has a `noindex` token.
- No other file changes.

**Interfaces.** Test-local functions only (above).

**Data.** None.

**Test plan (TDD order).**

1. Write `tests/robots-headers.test.js` with the fixture cases and a stub `noindexViolations` returning `[]`: the `/*` and `/blog/*` cases fail (RED). Implement the parser and rule: GREEN. Add the real-file cases (green on the current file).
2. Run `node --test tests/*.test.js` and `pnpm build`.

**Real-browser / e2e checks.** No browser check. Production evidence by the developer (QA repeats it only if the PR table is missing or shows a non-200). Read-only GETs, one pass, 48 requests, for example:

```sh
for ua in GPTBot OAI-SearchBot ClaudeBot Claude-Web anthropic-ai PerplexityBot Google-Extended "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"; do
  for p in / /seo-para-ia/ /seo-local-sevilla/ /llms.txt /robots.txt /ai/summary.json; do
    curl -sS -A "$ua" -D - -o /dev/null -w "%{http_code} %{size_download}\n" "https://nuriaromero.dev$p" | rg -i "^x-robots-tag|^[0-9]{3} "
  done
done
```

The bare names are the product tokens the vendors document; the developer may use the full vendor UA strings instead and says which in the PR. Table columns: UA, URL, status, X-Robots-Tag (or "none"), bytes, same as control (yes/no).

**ADRs relied on.** ADR 0001 (Netlify config in `public/_headers`, no `netlify.toml`), ADR 0018 (build-time endpoints, `/ai/summary.json`).

## Risks / Trade-offs

- A WAF may treat the developer IP differently from the crawler IP ranges of each vendor. A 200 here proves there is no user-agent-based block, not that no IP-based block exists; the PR says so. Netlify does not block these bots by default.
- The test-local parser could drift from Netlify semantics for unusual patterns (placeholders, splats in the middle). The rule is conservative: any pattern other than `/informes/*` with noindex fails.
