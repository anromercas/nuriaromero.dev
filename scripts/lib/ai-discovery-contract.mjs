// Pure contract between the AI discovery files and the rest of the build (NRD-246).
// Each function returns a list of failure messages; empty means the contract holds.

const sortedSet = (list) => [...new Set(list)].sort();
const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

/** robots.txt-style text -> Map<agent, { allow, disallow }>. Consecutive User-agent lines share a group. */
export function parseRobotsGroups(text) {
  const groups = new Map();
  let agents = [];
  let lastWasAgent = false;
  for (const raw of text.split("\n")) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (key === "user-agent") {
      if (!lastWasAgent) agents = [];
      agents.push(value);
      if (!groups.has(value)) groups.set(value, { allow: [], disallow: [] });
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (key !== "allow" && key !== "disallow") continue;
    for (const agent of agents) groups.get(agent)[key].push(value);
  }
  return groups;
}

const RESOURCE_LINKS = ["llms.txt", "ai/summary.json", "ai/faq.json"];

export function aiTxtFailures({ aiTxt, robotsTxt }) {
  const failures = [];
  const ai = parseRobotsGroups(aiTxt);
  const robots = parseRobotsGroups(robotsTxt);
  for (const agent of ai.keys()) {
    if (!robots.has(agent))
      failures.push(`ai.txt has a rule for ${agent} that robots.txt lacks`);
  }
  for (const agent of robots.keys()) {
    if (!ai.has(agent))
      failures.push(`robots.txt has a rule for ${agent} that ai.txt lacks`);
  }
  for (const [agent, rules] of ai) {
    const other = robots.get(agent);
    if (!other) continue;
    for (const kind of ["allow", "disallow"]) {
      const a = sortedSet(rules[kind]);
      const b = sortedSet(other[kind]);
      if (!same(a, b))
        failures.push(
          `${agent}: ai.txt ${kind} [${a.join(", ")}] differs from robots.txt [${b.join(", ")}]`,
        );
    }
  }
  for (const link of RESOURCE_LINKS) {
    if (!aiTxt.includes(`/${link}`))
      failures.push(`ai.txt does not link to ${link}`);
  }
  return failures;
}

function faqPagesIn(html) {
  const found = [];
  const re = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  for (const match of html.matchAll(re)) {
    let doc;
    try {
      doc = JSON.parse(match[1]);
    } catch {
      continue;
    }
    const nodes = Array.isArray(doc) ? doc : (doc["@graph"] ?? [doc]);
    for (const node of nodes) {
      const type = [node?.["@type"]].flat();
      if (type.includes("FAQPage")) found.push(node);
    }
  }
  return found;
}

const routeOf = (url) => new URL(url).pathname;

export function faqFailures({ faqJson, pages }) {
  const failures = [];
  const published = new Map();
  for (const { route, html } of pages) {
    const blocks = faqPagesIn(html);
    if (blocks.length > 1) {
      failures.push(`${route}: more than one FAQPage in the HTML`);
      continue;
    }
    if (blocks.length === 1) published.set(route, blocks[0]);
  }
  const listed = new Map(
    (faqJson.pages ?? []).map((page) => [routeOf(page.url), page]),
  );
  for (const route of published.keys()) {
    if (!listed.has(route))
      failures.push(
        `${route}: publishes a FAQPage but is absent from faq.json`,
      );
  }
  for (const [route, page] of listed) {
    const block = published.get(route);
    if (!block) {
      failures.push(`${route}: listed in faq.json but has no FAQPage`);
      continue;
    }
    const expected = (block.mainEntity ?? []).map((e) => ({
      question: e.name,
      answer: e.acceptedAnswer?.text,
    }));
    const actual = page.questions ?? [];
    const answersByQuestion = new Map(
      expected.map((e) => [e.question, e.answer]),
    );
    let questionsMatch = true;
    for (const { question, answer } of actual) {
      if (!answersByQuestion.has(question)) {
        failures.push(
          `${route}: "${question}" is in faq.json but not in the FAQPage`,
        );
        questionsMatch = false;
      } else if (answersByQuestion.get(question) !== answer) {
        failures.push(
          `${route}: answer to "${question}" differs from the FAQPage`,
        );
      }
    }
    const inJson = new Set(actual.map((e) => e.question));
    for (const { question } of expected) {
      if (!inJson.has(question)) {
        failures.push(
          `${route}: "${question}" is in the FAQPage but not in faq.json`,
        );
        questionsMatch = false;
      }
    }
    if (
      questionsMatch &&
      !same(
        actual.map((e) => e.question),
        expected.map((e) => e.question),
      )
    ) {
      failures.push(`${route}: question order differs from the FAQPage`);
    }
  }
  return failures;
}

export function priceFailures({ summary, services, niches }) {
  const failures = [];
  const base = summary.url;
  const abs = (slug) => new URL(slug, base).href;
  const find = (list, slug) => (list ?? []).find((e) => e.url === abs(slug));

  for (const svc of services) {
    const entry = find(summary.services, svc.slug);
    if (!entry) {
      failures.push(`${svc.slug}: service missing from summary.json`);
      continue;
    }
    if (svc.ownOffer === false) {
      if (entry.priceFrom !== undefined)
        failures.push(
          `${svc.slug}: has no own offer but summary.json lists a price`,
        );
    } else if (entry.priceFrom !== svc.pricing.from) {
      failures.push(
        `${svc.slug}: priceFrom "${entry.priceFrom}" differs from src/data "${svc.pricing.from}"`,
      );
    }
    for (const tier of svc.pricing.tiers ?? []) {
      const plan = (entry.plans ?? []).find((p) => p.name === tier.name);
      if (!plan)
        failures.push(
          `${svc.slug}: plan "${tier.name}" missing from summary.json`,
        );
      else if (plan.from !== tier.from)
        failures.push(
          `${svc.slug}: plan "${tier.name}" price "${plan.from}" differs from src/data "${tier.from}"`,
        );
    }
  }
  for (const niche of niches) {
    const entry = find(summary.sectors, niche.slug);
    if (!entry)
      failures.push(`${niche.slug}: sector missing from summary.json`);
    else if (entry.priceFrom !== niche.pricing.from)
      failures.push(
        `${niche.slug}: priceFrom "${entry.priceFrom}" differs from src/data "${niche.pricing.from}"`,
      );
  }
  return failures;
}

export function sitemapFailures(sitemapXml) {
  const failures = [];
  for (const m of sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const { pathname } = new URL(m[1]);
    if (pathname.startsWith("/ai/") || pathname.startsWith("/.well-known/"))
      failures.push(`sitemap lists ${pathname}`);
  }
  return failures;
}
