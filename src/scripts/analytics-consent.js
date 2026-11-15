export const ANALYTICS_DOM_EVENT = 'site:analytics'

export const CONSENT_KEY = 'site-analytics-consent'
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

export function cookieDomainCandidates(hostname) {
  if (!hostname || !hostname.includes('.') || /^[\d.]+$/.test(hostname)) return []
  const labels = hostname.split('.')
  const candidates = []
  for (let i = 0; i <= labels.length - 2; i += 1) {
    const domain = labels.slice(i).join('.')
    candidates.push(domain, `.${domain}`)
  }
  return candidates
}

function isAnalyticsCookie(name) {
  return name === '_ga' || name.startsWith('_ga_')
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

export function createConsentController({ storage, gtag, appendScript, measurementId, global, cookies }) {
  const disableFlag = `ga-disable-${measurementId}`
  const setDisabled = (value) => {
    if (global && measurementId) global[disableFlag] = value
  }

  function expireAnalyticsCookies() {
    if (!cookies) return
    const names = cookies
      .read()
      .split(';')
      .map((pair) => pair.split('=')[0].trim())
      .filter(isAnalyticsCookie)
    const domains = [null, ...cookieDomainCandidates(global?.location?.hostname)]
    for (const name of names) for (const domain of domains) cookies.expire(name, domain)
  }

  let scriptLoaded = false
  let analyticsAllowed = false

  function setDeniedDefaults() {
    gtag('consent', 'default', DENIED_CONSENT)
  }

  function enableAnalytics() {
    if (analyticsAllowed || !measurementId) return false
    analyticsAllowed = true
    setDisabled(false)
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
    else setDisabled(true)
  }

  function accept() {
    storage.setItem(CONSENT_KEY, 'accepted')
    if (enableAnalytics()) trackPageView()
  }

  function reject() {
    storage.setItem(CONSENT_KEY, 'rejected')
    analyticsAllowed = false
    setDisabled(true)
    if (scriptLoaded) gtag('consent', 'update', { analytics_storage: 'denied' })
    expireAnalyticsCookies()
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

export const CONSENT_OFFSET_PROPERTY = '--consent-offset'

// Space the fixed panel takes from its top edge to the bottom of the viewport.
export function consentOffset(panelRect, viewportHeight) {
  if (!panelRect || panelRect.height <= 0) return 0
  return Math.max(0, Math.ceil(viewportHeight - panelRect.top))
}

export function isObscured(rect, panelRect) {
  if (!rect || !panelRect) return false
  if (rect.width <= 0 && rect.height <= 0) return false
  return (
    rect.bottom > panelRect.top &&
    rect.top < panelRect.bottom &&
    rect.right > panelRect.left &&
    rect.left < panelRect.right
  )
}

export function createConsentPanel({ doc, storage, controller }) {
  // Elements are resolved on every call: View Transitions replaces <body>,
  // so any reference captured earlier would point at detached nodes.
  const el = (id) => doc.getElementById(id)

  function collapse() {
    const settings = el('consent-settings')
    const save = el('consent-save')
    const customize = el('consent-customize')
    if (settings) settings.hidden = true
    if (save) save.hidden = true
    if (customize) customize.setAttribute('aria-expanded', 'false')
  }

  // Publishes the panel height on <html> so the page can reserve it (scroll
  // padding, body padding, WhatsApp button). Astro resets <html> attributes on
  // navigation, so this runs on every sync, show, hide and resize.
  function update() {
    const style = doc.documentElement?.style
    if (!style) return
    const panel = el('analytics-consent')
    const viewport = doc.defaultView?.innerHeight
    const offset =
      panel && !panel.hidden && typeof panel.getBoundingClientRect === 'function' && viewport
        ? consentOffset(panel.getBoundingClientRect(), viewport)
        : 0
    if (offset > 0) style.setProperty(CONSENT_OFFSET_PROPERTY, `${offset}px`)
    else style.removeProperty(CONSENT_OFFSET_PROPERTY)
  }

  function hide() {
    const panel = el('analytics-consent')
    if (panel) panel.hidden = true
    update()
  }

  // WCAG 2.2 SC 2.4.11: bring a focused element out from under the panel.
  function handleFocus(target) {
    if (!target || typeof target.closest !== 'function') return
    const panel = el('analytics-consent')
    if (!panel || panel.hidden || typeof panel.getBoundingClientRect !== 'function') return
    if (target.closest('#analytics-consent')) return
    if (typeof target.getBoundingClientRect !== 'function') return
    if (isObscured(target.getBoundingClientRect(), panel.getBoundingClientRect())) {
      target.scrollIntoView?.({ block: 'nearest' })
    }
  }

  function sync() {
    const panel = el('analytics-consent')
    if (!panel) return
    collapse()
    panel.hidden = Boolean(storage.getItem(CONSENT_KEY))
    update()
  }

  function handleClick(target) {
    if (!target || typeof target.closest !== 'function') return
    if (target.closest('#consent-accept')) {
      controller.accept()
      hide()
    } else if (target.closest('#consent-reject')) {
      controller.reject()
      hide()
    } else if (target.closest('#consent-customize')) {
      const settings = el('consent-settings')
      const save = el('consent-save')
      const customize = el('consent-customize')
      if (!settings || !save || !customize) return
      settings.hidden = !settings.hidden
      save.hidden = settings.hidden
      customize.setAttribute('aria-expanded', String(!settings.hidden))
      update()
    } else if (target.closest('#consent-save')) {
      if (el('analytics-toggle')?.checked) controller.accept()
      else controller.reject()
      hide()
    } else if (target.closest('#cookie-settings')) {
      const panel = el('analytics-consent')
      const settings = el('consent-settings')
      const toggle = el('analytics-toggle')
      const save = el('consent-save')
      const customize = el('consent-customize')
      if (!panel) return
      panel.hidden = false
      if (settings) settings.hidden = false
      if (toggle) toggle.checked = storage.getItem(CONSENT_KEY) === 'accepted'
      if (save) save.hidden = false
      if (customize) customize.setAttribute('aria-expanded', 'true')
      update()
    }
  }

  return { sync, handleClick, handleFocus, update }
}
