import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const homePath = join(root, "dist", "index.html")
const consentPath = join(root, "src", "components", "AnalyticsConsent.astro")
const homeSourcePath = join(root, "src", "pages", "index.astro")

const failures = []
const requireText = (text, pattern, message) => {
  if (!pattern.test(text)) failures.push(message)
}

if (!existsSync(homePath)) {
  failures.push("dist/index.html is missing; run the build before this check")
} else {
  const home = readFileSync(homePath, "utf8")
  requireText(home, /seo12-home-hero/, "home hero marker is missing")
  requireText(home, /data-seo12-primary-cta/, "home primary CTA marker is missing")
  requireText(home, /href="https:\/\/wa\.me\//, "home primary CTA must point to WhatsApp")
}

const consentSource = readFileSync(consentPath, "utf8")
requireText(consentSource, /max-height:\s*min\(35vh,\s*18\.5rem\)/, "mobile consent panel needs a bounded height")
requireText(consentSource, /overflow-y:\s*auto/, "mobile consent panel needs internal scrolling")
requireText(consentSource, /min-height:\s*3rem/, "consent controls must meet the 48px touch-target minimum")
requireText(consentSource, /focus-visible/, "consent controls need visible keyboard focus")

const nicheRoutes = [
  "web-para-restaurantes-sevilla",
  "web-para-clinicas-sevilla",
  "web-para-comercios-sevilla",
  "web-para-abogados-gestorias-sevilla",
]
for (const route of nicheRoutes) {
  const routePath = join(root, "dist", route, "index.html")
  if (!existsSync(routePath)) {
    failures.push(`${route} output is missing`)
    continue
  }
  requireText(readFileSync(routePath, "utf8"), /href=\"\/contacto(?:\/|\")/, `${route} lost its contact CTA`)
}

const homeSource = readFileSync(homeSourcePath, "utf8")
requireText(homeSource, /data-seo12-hero/, "home source is missing the hero marker")
requireText(homeSource, /data-seo12-primary-cta/, "home source is missing the primary CTA marker")

if (failures.length > 0) {
  console.error(`SEO-12 check failed (${failures.length})`)
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log("SEO-12 check passed: hero CTA, consent constraints, and keyboard target safeguards are present")
