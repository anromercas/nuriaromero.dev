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
  assert.match(types, /h1Accent\?:\s*string/)
  assert.match(data, /h1Accent:\s*"cuando importa"/)
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
  assert.match(hero, /h1Accent/)
  assert.match(hero, /<BookingButton/)
  assert.match(hero, /Ver los planes/)
  assert.match(hero, /href="#precios"/)
  assert.match(mock, /Ejemplo ilustrativo/)
  assert.match(mock, /Tu negocio/)
  for (const label of ["Horarios actualizados", "Servicios claros", "Fotos nuevas", "Reseñas respondidas"]) {
    assert.ok(mock.includes(label), label)
  }
  assert.match(mock, /prefers-reduced-motion:\s*no-preference/)
  assert.match(proof, /\+10 años de experiencia/)
  assert.match(proof, /2 webs de negocios locales en Sevilla/)
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
