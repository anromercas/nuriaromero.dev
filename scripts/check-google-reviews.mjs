// usage: node scripts/check-google-reviews.mjs [htmlPath = "dist/index.html"]
// Exit 0 when the reviews JSON-LD only declares what the page shows (the rating stat
// and the quoted review) or is absent; exit 1 with "GOOGLE-REVIEWS: <reason>" per failure.
// The rules live in scripts/lib/google-reviews-contract.mjs. They depend on the visible
// stat text built in src/pages/index.astro ("X,X en Google" / "N opiniones") and on the
// data-review-* hooks of src/components/seo-local/RealProof.astro. Change them together.
import { readFile } from "node:fs/promises";
import { googleReviewsFailures } from "./lib/google-reviews-contract.mjs";

const htmlPath = process.argv[2] ?? "dist/index.html";
const html = await readFile(htmlPath, "utf8");
const { failures, summary } = googleReviewsFailures(html);

if (failures.length > 0) {
  for (const failure of failures) console.error(`GOOGLE-REVIEWS: ${failure}`);
  process.exit(1);
}
console.log(`GOOGLE-REVIEWS OK: ${summary}`);
