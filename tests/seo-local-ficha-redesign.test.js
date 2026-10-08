import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")
const seoLocalData = async () => {
  const services = await source("src/data/services.ts")
  return services.slice(services.indexOf("export const seoLocal"), services.indexOf("export const capilarLocal"))
}

test("T1: serif accent font is installed and the layout exposes optional slots with default fallbacks", async () => {
  const [pkg, layout, types, data] = await Promise.all([
    source("package.json"),
    source("src/layouts/ServiceLayout.astro"),
    source("src/data/types.ts"),
    seoLocalData(),
  ])

  assert.match(pkg, /"@fontsource\/instrument-serif"/)
  for (const name of ["hero", "benefits", "process"]) {
    assert.match(layout, new RegExp(`<slot name="${name}">[\\s\\S]*?</slot>`))
  }
  assert.match(layout, /<slot name="hero">[\s\S]*?<ServiceHero/)
  assert.match(layout, /<slot name="benefits">[\s\S]*?<BenefitsGrid/)
  assert.match(layout, /<slot name="process">[\s\S]*?<ProcessSteps/)
  assert.match(types, /titleAccent\?:\s*string/)
  assert.match(data, /titleAccent:\s*"cuando importa"/)
  assert.ok(data.includes("La pregunta es si te encuentran cuando importa."))
})

test("T2: hero, listing mock and proof strip honour the proof and label rules", async () => {
  const [hero, mock, proof, route] = await Promise.all([
    source("src/components/seo-local/SeoLocalHero.astro"),
    source("src/components/seo-local/ListingMock.astro"),
    source("src/components/seo-local/ProofStrip.astro"),
    source("src/pages/seo-local-sevilla.astro"),
  ])

  assert.match(hero, /instrument-serif\/400-italic\.css/)
  assert.match(hero, /titleAccent/)
  assert.match(hero, /<BookingButton/)
  assert.match(hero, /Ver los planes/)
  assert.match(hero, /href="#precios"/)
  assert.match(mock, /Ejemplo ilustrativo/)
  assert.match(mock, /Tu negocio/)
  for (const label of ["Horarios actualizados", "Servicios claros", "Fotos nuevas", "Reseñas respondidas"]) {
    assert.ok(mock.includes(label), label)
  }
  assert.match(mock, /prefers-reduced-motion:\s*no-preference/)
  assert.match(proof, /\+10 años/)
  assert.match(proof, /de experiencia/)
  assert.match(proof, /2 webs en Sevilla/)
  assert.match(proof, /reviews\s*\?/)
  assert.match(proof, /GoogleReviewsData \| null/)
  assert.match(route, /getGoogleReviews\(\)/)
  assert.match(route, /<SeoLocalHero/)
  assert.match(route, /slot="hero"/)
})


test("T3: review bento is asymmetric, has six drawn tiles and one illustrative label", async () => {
  const [bento, route] = await Promise.all([
    source("src/components/seo-local/ReviewBento.astro"),
    source("src/pages/seo-local-sevilla.astro"),
  ])

  assert.match(bento, /Qué se revisa para que/)
  assert.match(bento, /instrument-serif\/400-italic\.css/)
  assert.match(bento, /te encuentren/)
  assert.match(bento, /grid-template-areas/)
  assert.match(bento, /@media \(max-width:\s*767px\)/)
  assert.equal((bento.match(/<h3/g) ?? []).length, 6)
  assert.ok((bento.match(/<svg/g) ?? []).length >= 6)
  assert.equal((bento.match(/Ejemplo ilustrativo/g) ?? []).length, 1)
  assert.match(bento, /fontanero cerca de mí/)
  assert.match(bento, /llamadas/)
  assert.match(bento, /clics/)
  assert.match(bento, /rutas/)
  assert.doesNotMatch(bento, /pacientes|tratamientos|garantiz/i)
  assert.match(route, /<ReviewBento \/>/)
})

test("batch A review fixes: singular opinion, caption attached to grid, balanced ficha tile, one matched state per directory row", async () => {
  const [proof, bento] = await Promise.all([
    source("src/components/seo-local/ProofStrip.astro"),
    source("src/components/seo-local/ReviewBento.astro"),
  ])

  assert.match(proof, /userRatingCount === 1 \? "opinión" : "opiniones"/)
  assert.ok(bento.indexOf("Ejemplo ilustrativo") > bento.indexOf('class="bento"'), "caption must follow the grid")
  assert.match(bento, /class="bento-caption"/)
  assert.match(bento, /<svg viewBox="0 40 360 150"/)
  assert.doesNotMatch(bento, /<circle cx="28" cy="(24|65|106)" r="7" class="soft">/)
})

test("T4: process section shows the real person, a timeline without numerals and an accessible monthly cycle", async () => {
  const [proc, route, layout] = await Promise.all([
    source("src/components/seo-local/SeoLocalProcess.astro"),
    source("src/pages/seo-local-sevilla.astro"),
    source("src/layouts/ServiceLayout.astro"),
  ])

  assert.match(proc, /Hablas con <em>quien hace el trabajo<\/em>/)
  assert.match(proc, /instrument-serif\/400-italic\.css/)
  assert.match(proc, /import \{ Image \} from "astro:assets"/)
  assert.match(proc, /@\/assets\/perfil-home\.webp/)
  assert.match(proc, /alt="Nuria Romero, desarrolladora web freelance en Sevilla"/)
  assert.match(proc, /loading="lazy"/)
  assert.match(proc, /<figcaption>Nuria Romero, desarrolladora web freelance en Sevilla<\/figcaption>/)
  assert.match(proc, /seoLocal\.process/)
  assert.match(proc, /class="timeline"/)
  assert.doesNotMatch(proc, /list-style:\s*decimal/)
  for (const label of ["Trabajo revisable", "Prioridades acordadas", "Vídeo-informe mensual", "cada mes"]) {
    assert.ok(proc.includes(label), label)
  }
  assert.match(proc, /<svg[^>]*class="cycle-diagram"[^>]*aria-hidden="true"/)
  assert.match(proc, /<marker|<path[^>]*class="[^"]*\barrow\b/)
  assert.match(proc, /aria-labelledby="proceso-title"[\s\S]*?id="proceso-title"/)
  assert.match(proc, /class="cycle-list"/)
  assert.doesNotMatch(proc, /pacientes|tratamientos|garantiz/i)
  assert.doesNotMatch(proc, /(?:transition|animation):/)
  assert.match(route, /<SeoLocalProcess/)
  assert.match(route, /slot="process"/)
  assert.match(layout, /<slot name="process">/)
})

test("T5: real proof section reuses reviews and the two client sites, with no KPI figures", async () => {
  const [proof, route, layout] = await Promise.all([
    source("src/components/seo-local/RealProof.astro"),
    source("src/pages/seo-local-sevilla.astro"),
    source("src/layouts/ServiceLayout.astro"),
  ])

  assert.match(proof, /Trabajo que <em>puedes ver<\/em>/)
  assert.match(proof, /reviews\.reviews\[0\]/)
  assert.match(proof, /<Projects only=\{\["arkady", "adfsevilla"\]\}/)
  assert.match(proof, /sin confirmación del cliente|confirmación del cliente/)
  assert.match(proof, /aria-labelledby="prueba-title"[\s\S]*?id="prueba-title"/)
  assert.doesNotMatch(proof, /pacientes|tratamientos|garantiz|%/i)
  assert.match(route, /getGoogleReviews\(\)/)
  assert.equal((route.match(/getGoogleReviews\(\)/g) ?? []).length, 1)
  assert.match(route, /<RealProof reviews=\{reviewsData\}/)
  assert.match(layout, /<slot name="before-pricing" \/>/)
})

test("T6: plans use the dark language, mark Local Pro as recommended and leave other pages untouched", async () => {
  const [plans, layout, route] = await Promise.all([
    source("src/components/seo-local/SeoLocalPlans.astro"),
    source("src/layouts/ServiceLayout.astro"),
    source("src/pages/seo-local-sevilla.astro"),
  ])

  assert.match(plans, /id="precios"/)
  assert.match(plans, /seoLocal\.pricing\.tiers/)
  assert.match(plans, /Recomendado/)
  assert.match(plans, /<BookingButton/)
  assert.match(plans, /tier\.ctaLabel/)
  assert.match(plans, /rgb\(250 204 21\)/)
  assert.doesNotMatch(plans, /pacientes|tratamientos|garantiz|✓/i)
  assert.match(layout, /<slot name="pricing">[\s\S]*?<PricingCard/)
  assert.match(route, /slot="pricing"/)
})

test("review fix round 1: padded cycle viewBox, sr-only cycle list, stretched photo column", async () => {
  const proc = await source("src/components/seo-local/SeoLocalProcess.astro")

  assert.match(proc, /viewBox="0 0 440 300"/)
  assert.match(proc, /\.cycle-list \{[^}]*position:\s*absolute[^}]*clip:\s*rect\(0,\s*0,\s*0,\s*0\)/)
  assert.match(proc, /\.person \{[^}]*display:\s*flex/)
  assert.match(proc, /object-fit:\s*cover/)
})

test("finish review: layout exposes faq, related and closing slots with legacy fallbacks", async () => {
  const layout = await source("src/layouts/ServiceLayout.astro")

  assert.match(layout, /<slot name="faq"><SectionContainer>[\s\S]*?<FAQ[\s\S]*?<\/SectionContainer><\/slot>/)
  assert.match(layout, /<slot name="related"><SectionContainer>[\s\S]*?<InternalLinks[\s\S]*?<\/SectionContainer><\/slot>/)
  assert.match(layout, /<slot name="closing"><SectionContainer>[\s\S]*?<CTASection[\s\S]*?<\/SectionContainer><\/slot>/)
})

test("finish review: FAQ, related links and closing CTA are bespoke and keep the data", async () => {
  const [faq, related, closing, route] = await Promise.all([
    source("src/components/seo-local/SeoLocalFaq.astro"),
    source("src/components/seo-local/SeoLocalRelated.astro"),
    source("src/components/seo-local/SeoLocalClosing.astro"),
    source("src/pages/seo-local-sevilla.astro"),
  ])

  assert.match(faq, /seoLocal\.faqs/)
  assert.match(faq, /<details/)
  assert.match(faq, /<summary/)
  assert.match(faq, /<BookingButton/)
  assert.match(faq, /aria-labelledby="faq-title"[\s\S]*?id="faq-title"/)
  assert.match(faq, /<em>/)
  assert.match(faq, /class="indicator"[^>]*aria-hidden="true"/)
  assert.doesNotMatch(faq, /ProfileCheck|›/)
  assert.match(faq, /:focus-visible/)

  assert.match(related, /internalLinksBySource/)
  assert.match(related, /<nav[^>]*aria-label="Contenido relacionado"/)
  assert.match(related, /links\.length > 0/)
  assert.doesNotMatch(related, /rounded-xl|bg-gray/)

  assert.match(closing, /<ListingMock/)
  assert.match(closing, /<BookingButton/)
  assert.match(closing, /seoLocal\.cta/)
  assert.match(closing, /<em>/)
  assert.match(closing, /aria-labelledby="cierre-title"[\s\S]*?id="cierre-title"/)

  for (const slot of ["faq", "related", "closing"]) assert.match(route, new RegExp(`slot="${slot}"`))
})

test("finish review: the hero listing fills in on a scroll timeline with a completed fallback", async () => {
  const mock = await source("src/components/seo-local/ListingMock.astro")

  assert.match(mock, /animation-timeline:\s*scroll\(/)
  assert.match(mock, /@supports \(animation-timeline:\s*scroll\(\)\)/)
  assert.match(mock, /prefers-reduced-motion:\s*no-preference/)
  assert.match(mock, /class="scene"/)
  assert.match(mock, /class="rating-row"/)
  assert.match(mock, /animate\?:\s*boolean/)
  assert.match(mock, /Ejemplo ilustrativo/)
  assert.doesNotMatch(mock, /\d[,.]\d\s*(?:\/|sobre)/)
})

test("finish review: bento is truly asymmetric, measurement reads side by side, labels are legible", async () => {
  const bento = await source("src/components/seo-local/ReviewBento.astro")

  assert.match(bento, /"ficha ficha ficha ficha dir dir"/)
  assert.match(bento, /"busq busq op op op op"/)
  assert.match(bento, /"busq busq web web web web"/)
  assert.match(bento, /\.t-med\s*\{[^}]*flex-direction:\s*row/)
  const sizes = [...bento.matchAll(/\.tile :global\(\.(?:label|strong)\) \{[^}]*font-size:\s*(\d+)px/g)].map((m) => Number(m[1]))
  assert.ok(sizes.length >= 1 && sizes.every((size) => size >= 17), `label sizes ${sizes}`)
})

test("finish review: real proof renders one pull-quote and the proof strip is a three-cell band", async () => {
  const [proof, strip] = await Promise.all([
    source("src/components/seo-local/RealProof.astro"),
    source("src/components/seo-local/ProofStrip.astro"),
  ])

  assert.match(proof, /<blockquote/)
  assert.match(proof, /reviews\.reviews\[0\]|reviews\?\.reviews/)
  assert.doesNotMatch(proof, /import GoogleReviews/)
  assert.match(proof, /Projects only=\{\["arkady", "adfsevilla"\]\}/)
  assert.match(strip, /<strong>\+10 años<\/strong>/)
  assert.match(strip, /de experiencia/)
  assert.match(strip, /2 webs en Sevilla/)
  assert.match(strip, /de negocios locales/)
  assert.match(strip, /border-left/)
})

test("finish review: ink-blue ground, cycle labels are large, plan buttons align and Pro is lifted on purpose", async () => {
  const [route, proc, plans, hero] = await Promise.all([
    source("src/pages/seo-local-sevilla.astro"),
    source("src/components/seo-local/SeoLocalProcess.astro"),
    source("src/components/seo-local/SeoLocalPlans.astro"),
    source("src/components/seo-local/SeoLocalHero.astro"),
  ])

  assert.match(route, /<style is:global>[\s\S]*?main\s*\{[\s\S]*?rgb\(5 10 24\)/)
  assert.match(route, /\.band\b/)
  assert.match(hero, /radial-gradient/)
  const cycle = [...proc.matchAll(/\.cycle-diagram :global\(\.(?:label|centre)\) \{[^}]*font-size:\s*(\d+)px/g)].map((m) => Number(m[1]))
  assert.ok(cycle.length === 2 && cycle.every((size) => size >= 19), `cycle sizes ${cycle}`)
  assert.match(proc, /text-anchor="middle" class="label">Vídeo-informe/)
  assert.match(plans, /\.plan :global\(a\)[\s\S]*?margin-top:\s*auto|\.plan-cta\s*\{[^}]*margin-top:\s*auto/)
  assert.match(plans, /\.plan\.recommended\s*\{[^}]*margin-top:\s*-0\.75rem/)
})

test("bento named areas are not reset by a later grid-column: auto", async () => {
  const bento = await source("src/components/seo-local/ReviewBento.astro")

  assert.doesNotMatch(bento, /grid-area:\s*\w+;\s*grid-column:\s*auto/)
})

test("hero glow pool never bleeds past the page gutter (no horizontal scroll on mobile)", async () => {
  const hero = await source("src/components/seo-local/SeoLocalHero.astro")

  assert.match(hero, /\.hero-visual::before\s*\{[^}]*inset:\s*-25%\s+-1rem/)
})

test("listing pending state keeps text legible (>= 4.5:1 needs at least 0.7 opacity)", async () => {
  const mock = await source("src/components/seo-local/ListingMock.astro")

  assert.match(mock, /@keyframes check-in\s*\{\s*from\s*\{\s*opacity:\s*0\.(?:7|8|9)/)
})

test("T7: every section has a small keyword heading above its display title, one h1 only", async () => {
  const read = (name) => source(`src/components/seo-local/${name}.astro`)
  const [hero, bento, proc, proof, plans, faq, closing, data] = await Promise.all([
    read("SeoLocalHero"), read("ReviewBento"), read("SeoLocalProcess"), read("RealProof"),
    read("SeoLocalPlans"), read("SeoLocalFaq"), read("SeoLocalClosing"), seoLocalData(),
  ])
  const keyword = (text, id, label) => {
    const kw = text.indexOf(`<h2 id="${id}" class="kw">${label}</h2>`)
    assert.ok(kw >= 0, `${id} keyword heading`)
    assert.ok(text.indexOf('class="display"') > kw, `${id} display title follows the keyword heading`)
  }

  keyword(bento, "revision-title", "Posicionamiento en Google Maps para negocios locales")
  keyword(proc, "proceso-title", "Consultor de SEO local en Sevilla")
  keyword(proof, "prueba-title", "Webs de negocios locales en Sevilla")
  keyword(plans, "planes-title", "Cuánto cuesta el SEO local en Sevilla")
  keyword(faq, "faq-title", "Preguntas frecuentes sobre SEO local en Sevilla")
  keyword(closing, "cierre-title", "Reserva una llamada sobre SEO local en Sevilla")
  assert.match(hero, /<h1 class="kw">\{h1\}<\/h1>\s*<p class="display">/)
  assert.match(data, /h1:\s*"SEO local Sevilla"/)
  assert.match(data, /title:\s*"Tu negocio está en Sevilla\. La pregunta es si te encuentran cuando importa\."/)
  assert.match(data, /title:\s*"SEO local Sevilla \| Planes desde 300 €\/mes \+ IVA"/)
  for (const heading of ["Ficha de Google Business Profile", "Datos coherentes en directorios locales", "Búsquedas locales en Sevilla", "Reseñas de Google", "Web para negocios locales", "Medición de llamadas, clics y rutas"]) {
    assert.ok(bento.includes(`<h3>${heading}</h3>`), heading)
  }
  for (const component of [bento, proc, proof, plans, faq, closing]) {
    assert.equal((component.match(/<h1/g) ?? []).length, 0)
    assert.doesNotMatch(component, /<h[1-3][^>]*>[^<]*agencia/i)
    assert.match(component, /\.kw \{[^}]*font-weight:\s*600[^}]*\}/)
    assert.doesNotMatch(component, /\.kw \{[^}]*(?:uppercase|letter-spacing)/)
  }
  assert.match(data, /¿Cómo puede aparecer mi negocio en Google Maps\?/)
  assert.match(data, /¿Eres una agencia de SEO local\?/)
  assert.match(data, /nadie puede prometer la primera posición/)
})
