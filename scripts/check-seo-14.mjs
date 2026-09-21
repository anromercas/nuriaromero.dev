import { readFile } from "node:fs/promises"

const failures = []
const expect = (condition, message) => {
  if (!condition) failures.push(message)
}
const read = async (path, label) => {
  try {
    return await readFile(path, "utf8")
  } catch {
    failures.push(`SEO-14: ${label} is missing (${path})`)
    return ""
  }
}

const packageJson = await read("package.json", "package scripts")
const consent = await read("src/scripts/analytics-consent.js", "consent controller")
const consentComponent = await read("src/components/AnalyticsConsent.astro", "consent component")
const headers = await read("public/_headers", "security headers")
const measurement = await read("docs/seo-audit/measurement-seo.md", "measurement protocol")
const task = await read("docs/seo-audit/full-audit-2026-09-21/tasks/14-medicion-seo.md", "SEO-14 evidence")

expect(packageJson.includes('"check:seo-14": "npm run build && node scripts/check-seo-14.mjs"'), "SEO-14: package.json must expose the focused checker")
expect(/consent['"]?, ['"]default['"]/.test(consent), "SEO-14: analytics must establish denied consent defaults")
expect(consent.includes("trackEvent") && consent.includes("ALLOWED_EVENTS"), "SEO-14: event names must be allowlisted")
expect(consentComponent.includes("PUBLIC_GA4_MEASUREMENT_ID"), "SEO-14: the measurement ID must support deployment configuration")
expect(!/GTM-[A-Z0-9]+/.test(consentComponent + consent), "SEO-14: no unapproved GTM container may be embedded")
expect(headers.includes("https://www.googletagmanager.com") && headers.includes("https://www.google-analytics.com") && headers.includes("https://region1.google-analytics.com"), "SEO-14: CSP must allow only the documented analytics endpoints")
for (const phrase of ["dato observado", "estimación", "limitación", "decisión", "Search Console", "Core Web Vitals", "consentimiento"]) {
  expect(measurement.toLowerCase().includes(phrase.toLowerCase()), `SEO-14: measurement protocol must define ${phrase}`)
}
expect(/generate_lead|contact_click|whatsapp_click/.test(measurement), "SEO-14: protocol must document conversion event names")
expect(/pendiente/i.test(task), "SEO-14: task must retain honest pending status where external access is required")
expect(!/(?:\b\d+\s+(?:clics|impresiones|conversiones|consultas|backlinks?)\b|posición\s*[:=]\s*\d)/i.test(measurement), "SEO-14: protocol must not invent performance metrics")

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"))
  process.exit(1)
}

console.log("SEO-14 checks passed: consent-safe measurement protocol, event taxonomy and validation guards are present.")
