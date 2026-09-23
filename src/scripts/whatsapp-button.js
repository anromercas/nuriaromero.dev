// SEO-27: extraído de WhatsAppButton.astro (era `<script is:inline>`) para
// eliminar 'unsafe-inline' de script-src en la CSP. Comportamiento idéntico.
//
// SEO-17 follow-up: this shared component's script is byte-identical across
// pages, so Astro's View Transitions does NOT re-run it on client-side
// navigation (only astro:page-load / astro:after-swap listeners re-run logic
// per navigation). Without this, clicking an internal link to the home page
// never (re)attaches the IntersectionObserver to the freshly-swapped DOM,
// reproducing the original overlap bug. We re-query the DOM and
// (re)initialize the guard on astro:page-load, which fires both on the
// initial hard load and after every subsequent swap (same event
// AnalyticsConsent.astro already relies on) — this guard isn't paint-critical
// like ThemeToggle's dark-mode/scroll fix (which must run before paint via
// astro:after-swap), so page-load's slightly later timing is fine.
let whatsAppHeroGuardObserver = null

function initWhatsAppFloatingButtonHeroGuard() {
  const floatingButton = document.getElementById("whatsapp-floating-button")
  const heroCta = document.querySelector("[data-seo12-primary-cta]")

  if (whatsAppHeroGuardObserver) {
    whatsAppHeroGuardObserver.disconnect()
    whatsAppHeroGuardObserver = null
  }

  if (!floatingButton || !heroCta || !("IntersectionObserver" in window)) return

  const mobileQuery = window.matchMedia("(max-width: 767px)")

  function setHidden(hidden) {
    floatingButton.classList.toggle("is-hero-cta-visible", hidden)
  }

  whatsAppHeroGuardObserver = new IntersectionObserver(
    function (entries) {
      const entry = entries[0]
      setHidden(mobileQuery.matches && entry.isIntersecting)
    },
    { threshold: 0 },
  )

  whatsAppHeroGuardObserver.observe(heroCta)

  mobileQuery.addEventListener("change", function (event) {
    if (!event.matches) setHidden(false)
  })
}

document.addEventListener("astro:page-load", initWhatsAppFloatingButtonHeroGuard)
