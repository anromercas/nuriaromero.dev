const CONSENT_KEY = 'site-analytics-consent'
const ALLOWED_EVENTS = new Set([
  'contact_click',
  'form_submit',
  'form_error',
  'generate_lead',
  'whatsapp_click',
])

const DENIED_CONSENT = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
}

export function createConsentController({ storage, gtag, appendScript, measurementId }) {
  let scriptLoaded = false
  let analyticsAllowed = false

  function setDeniedDefaults() {
    gtag('consent', 'default', DENIED_CONSENT)
  }

  function enableAnalytics() {
    if (scriptLoaded || !measurementId) return
    analyticsAllowed = true
    gtag('consent', 'update', { analytics_storage: 'granted' })
    gtag('js', new Date())
    gtag('config', measurementId, { send_page_view: false })
    appendScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`)
    scriptLoaded = true
  }

  function initialize() {
    setDeniedDefaults()
    if (storage.getItem(CONSENT_KEY) === 'accepted') enableAnalytics()
  }

  function accept() {
    storage.setItem(CONSENT_KEY, 'accepted')
    enableAnalytics()
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
    gtag('event', name, {
      ...params,
      page_path: window.location.pathname,
    })
  }

  return { initialize, accept, reject, trackPageView, trackEvent }
}
