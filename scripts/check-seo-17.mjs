// NRD-163: build-time contract for every template page listed in
// scripts/lib/template-pages.mjs: word range, visible FAQ equals FAQPage,
// Service presence. Prints every failure, then exits 1.
import { readFile } from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import {
  directAnswer,
  faqPageQuestions,
  jsonLdEntities,
  mainWordCount,
  visibleFaqQuestions,
} from "./lib/page-contract.mjs";
import { templatePages } from "./lib/template-pages.mjs";

const failures = [];

for (const { route, service, words, keySections } of templatePages) {
  const file = new URL(`../dist${route}index.html`, import.meta.url);
  let html;
  try {
    html = await readFile(file, "utf8");
  } catch {
    failures.push(
      `${route}: dist${route}index.html not found (run pnpm build)`,
    );
    continue;
  }

  if (words) {
    const count = mainWordCount(html);
    if (count < words[0] || count > words[1])
      failures.push(
        `${route}: ${count} visible words, expected ${words[0]}-${words[1]}`,
      );
  }

  for (const id of keySections ?? []) {
    const answer = directAnswer(html, id);
    if (!answer) {
      failures.push(`${route}: key section #${id} has no direct answer`);
      continue;
    }
    if (answer.precededByBlock)
      failures.push(
        `${route}: key section #${id} has a list, card or FAQ item before its answer`,
      );
    if (answer.words < 15 || answer.words > 45)
      failures.push(
        `${route}: key section #${id} answer has ${answer.words} words, expected 15-45`,
      );
    if (answer.sentences > 2)
      failures.push(
        `${route}: key section #${id} answer has ${answer.sentences} sentences, expected at most 2`,
      );
  }

  const visible = visibleFaqQuestions(html);
  const structured = faqPageQuestions(html);
  if (!isDeepStrictEqual(visible, structured))
    failures.push(
      `${route}: visible FAQ questions differ from FAQPage\n  visible:    ${JSON.stringify(visible)}\n  structured: ${JSON.stringify(structured)}`,
    );

  const hasService = jsonLdEntities(html).some((e) => e["@type"] === "Service");
  if (hasService !== service)
    failures.push(
      `${route}: Service entity ${hasService ? "present" : "missing"}, expected ${service ? "present" : "absent"}`,
    );
}

if (failures.length) {
  for (const failure of failures) console.error(`check-seo-17: ${failure}`);
  process.exit(1);
}
console.log(
  `check-seo-17: ${templatePages.length} template page(s) match the contract`,
);
