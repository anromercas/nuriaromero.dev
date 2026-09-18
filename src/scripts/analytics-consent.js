const CONSENT_KEY = 'site-analytics-consent'

export function createConsentController({ storage, gtag, appendScript, measurementId }) {
  let scriptLoaded = false
  let analyticsAllowed = false

  function enableAnalytics() {
    if (scriptLoaded) return
    analyticsAllowed = true
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
    gtag('consent', 'update', { analytics_storage: 'granted' })
    gtag('js', new Date())
    gtag('config', measurementId, { send_page_view: false })
    appendScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`)
    scriptLoaded = true
  }

  function initialize() {
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

  return { initialize, accept, reject, trackPageView }
}
