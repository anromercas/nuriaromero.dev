export const ANALYTICS_DOM_EVENT = 'site:analytics'

const CONSENT_KEY = 'site-analytics-consent'
const ALLOWED_EVENTS = new Set([
  'contact_click',
  'form_submit',
  'form_error',
  'generate_lead',
  'whatsapp_click',
])

const ALLOWED_PARAMS = new Set(['contact_method', 'placement', 'service_slug', 'error_type'])

const DENIED_CONSENT = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
}

export function placementFor(element) {
  const landmarks = 'header,nav,main,footer,aside'
  let outermost = element.closest(landmarks)
  while (outermost?.parentElement?.closest(landmarks)) {
    outermost = outermost.parentElement.closest(landmarks)
  }
  return outermost?.localName ?? 'page'
}

export function analyticsEventForLink({ href, placement, bookingUrl }) {
  if (href === bookingUrl) return { name: 'contact_click', params: { contact_method: 'booking', placement } }
  if (href.startsWith('tel:')) return { name: 'contact_click', params: { contact_method: 'phone', placement } }
  if (href.startsWith('mailto:')) return { name: 'contact_click', params: { contact_method: 'email', placement } }
  if (href.startsWith('https://wa.me/')) return { name: 'whatsapp_click', params: { placement } }
  return null
}

export function createGtag(target) {
  target.dataLayer = target.dataLayer || []
  target.gtag =
    target.gtag ||
    function gtag() {
      target.dataLayer.push(arguments)
    }
  return target.gtag
}

export function createConsentController({ storage, gtag, appendScript, measurementId }) {
  let scriptLoaded = false
  let analyticsAllowed = false

  function setDeniedDefaults() {
    gtag('consent', 'default', DENIED_CONSENT)
  }

  function enableAnalytics() {
    if (analyticsAllowed || !measurementId) return false
    analyticsAllowed = true
    gtag('consent', 'update', { analytics_storage: 'granted' })
    if (!scriptLoaded) {
      gtag('js', new Date())
      gtag('config', measurementId, { send_page_view: false })
      appendScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`)
      scriptLoaded = true
    }
    return true
  }

  function initialize() {
    setDeniedDefaults()
    if (storage.getItem(CONSENT_KEY) === 'accepted') enableAnalytics()
  }

  function accept() {
    storage.setItem(CONSENT_KEY, 'accepted')
    if (enableAnalytics()) trackPageView()
  }

  function reject() {
    storage.setItem(CONSENT_KEY, 'rejected')
    analyticsAllowed = false
    if (scriptLoaded) gtag('consent', 'update', { analytics_storage: 'denied' })
  }

  function trackPageView() {
    if (analyticsAllowed) gtag('event', 'page_view', { page_path: window.location.pathname })
  }

  function trackEvent(name, params = {}) {
    if (!analyticsAllowed || !ALLOWED_EVENTS.has(name)) return
    const safe = Object.fromEntries(
      Object.entries(params ?? {}).filter(([key]) => ALLOWED_PARAMS.has(key)),
    )
    gtag('event', name, {
      ...safe,
      page_path: window.location.pathname,
    })
  }

  return { initialize, accept, reject, trackPageView, trackEvent }
}
