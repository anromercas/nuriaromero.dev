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

export const CONSENT_OFFSET_TOP_PROPERTY = '--consent-offset-top'

// Decides where the fixed panel goes. It sits at the bottom unless that covers
// an element marked data-consent-avoid and the top placement (just below the
// fixed header) covers none of them.
export function consentPanelPosition({ panelRect, avoidRects = [], viewportHeight, headerBottom = 0, gap = 0 }) {
  const bottom = { position: 'bottom' }
  if (!panelRect || panelRect.height <= 0 || !avoidRects.length) return bottom
  const coveredAtBottom = avoidRects.some((rect) => isObscured(rect, panelRect))
  if (!coveredAtBottom) return bottom
  const top = Math.ceil(headerBottom + gap)
  if (top + panelRect.height > viewportHeight) return bottom
  const topRect = { ...panelRect, top, bottom: top + panelRect.height }
  if (avoidRects.some((rect) => isObscured(rect, topRect))) return bottom
  return { position: 'top', top }
}

// What to do when a focused element sits under the panel. At the bottom the
// reserved body padding always leaves scroll travel, so scrolling works. On
// top there is no such travel: it only works when the current scroll is enough
// to lift the element below the panel; otherwise the panel returns to the
// bottom (no reserved padding on top: it would shift the page, see NRD-307).
// The scroll itself is done by focusScrollDelta after the browser's own focus
// scroll (NRD-316); CSS scroll-padding is not relied on for focus, because the
// browser's focus visibility check ignores it.
export function focusRemedy({ rect, panelRect, position, scrollY = 0 }) {
  if (!isObscured(rect, panelRect)) return 'none'
  if (position !== 'top') return 'scroll'
  return scrollY >= Math.ceil(panelRect.bottom) - rect.top ? 'scroll' : 'flip'
}

// Signed px to scroll so a focused element ends fully inside the band the panel
// leaves clear: between the fixed header and the panel at the bottom, below the
// panel on top. 0 when it is not obscured. An element taller than the band
// aligns its top to the band top.
export function focusScrollDelta({ rect, panelRect, position, headerBottom = 0, margin = 8 }) {
  if (!isObscured(rect, panelRect)) return 0
  if (position === 'top') return Math.round(rect.top - (panelRect.bottom + margin))
  const bandTop = headerBottom + margin
  const bandBottom = panelRect.top - margin
  if (rect.height > bandBottom - bandTop || rect.top < bandTop) return Math.round(rect.top - bandTop)
  return Math.round(rect.bottom - bandBottom)
}

// NRD-318: consecutive frames with an unchanged scrollY that count as the
// browser focus scroll having settled, and the cap on frames waited.
export const FOCUS_SETTLE_FRAMES = 4
export const FOCUS_SETTLE_MAX_FRAMES = 60

export const CONSENT_FONT_WAIT_MS = 3000

// Forces a layout, which starts downloading the fonts the page uses, and
// returns a promise that settles when they are ready or after timeoutMs. Null
// when there is nothing to wait for.
export function pendingFonts(doc, timeoutMs = CONSENT_FONT_WAIT_MS) {
  const fonts = doc.fonts
  if (!fonts) return null
  doc.documentElement?.getBoundingClientRect?.()
  if (fonts.status === 'loaded') return null
  const view = doc.defaultView
  let timer
  const timeout = new Promise((resolve) => {
    timer = view.setTimeout(resolve, timeoutMs)
  })
  const ready = Promise.resolve(fonts.ready).catch(() => {})
  return Promise.race([ready, timeout]).then(() => view.clearTimeout?.(timer))
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
  // navigation, so this runs on every sync, show, hide and resize. It only
  // measures: where the panel sits is decided by place(), never here.
  function update() {
    const style = doc.documentElement?.style
    if (!style) return
    const panel = el('analytics-consent')
    const viewport = doc.defaultView?.innerHeight
    const measurable =
      panel && !panel.hidden && typeof panel.getBoundingClientRect === 'function' && viewport
    const onTop = Boolean(measurable) && panel.getAttribute?.('data-position') === 'top'
    const rect = measurable ? panel.getBoundingClientRect() : null
    const offset = measurable && !onTop ? consentOffset(rect, viewport) : 0
    const offsetTop = onTop ? Math.max(0, Math.ceil(rect.bottom)) : 0
    if (offset > 0) style.setProperty(CONSENT_OFFSET_PROPERTY, `${offset}px`)
    else style.removeProperty(CONSENT_OFFSET_PROPERTY)
    if (offsetTop > 0) style.setProperty(CONSENT_OFFSET_TOP_PROPERTY, `${offsetTop}px`)
    else style.removeProperty(CONSENT_OFFSET_TOP_PROPERTY)
  }

  // The placement is decided once per page view (see reveal) and only redone
  // for a new panel node, a reopen or a width change, so a visible panel never
  // jumps. These remember the node and the width the decision was made at.
  let placedNode = null
  let placedWidth
  let pendingNode = null

  // Returns the panel to its default position at the bottom.
  function resetToBottom(panel) {
    if (panel.getAttribute?.('data-position') === 'top') {
      panel.removeAttribute?.('data-position')
      if (panel.style) panel.style.top = ''
    }
  }

  // Anchors the panel under the fixed header when, at the bottom, it would
  // cover an element marked data-consent-avoid (the hero booking button).
  // Clears any earlier placement and measures the bottom one first, so it runs
  // in the same task that removes `hidden`, before the first paint.
  function place(panel) {
    const viewport = doc.defaultView?.innerHeight
    placedNode = panel
    placedWidth = doc.defaultView?.innerWidth
    resetToBottom(panel)
    if (!viewport || typeof panel.getBoundingClientRect !== 'function') return
    const avoid = doc.querySelectorAll?.('[data-consent-avoid]')
    if (!avoid || !avoid.length) return
    const header = doc.querySelector?.('header.fixed')
    const result = consentPanelPosition({
      panelRect: panel.getBoundingClientRect(),
      avoidRects: Array.from(avoid, (node) => node.getBoundingClientRect()),
      viewportHeight: viewport,
      headerBottom: header ? header.getBoundingClientRect().bottom : 0,
      gap: 8,
    })
    if (result.position !== 'top') return
    panel.setAttribute('data-position', 'top')
    if (panel.style) panel.style.top = `${result.top}px`
  }

  // Shows the panel, decides its placement and publishes the offsets in one
  // synchronous task, so nothing is painted in between.
  function reveal(panel) {
    panel.hidden = false
    place(panel)
    update()
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
    const rect = target.getBoundingClientRect()
    const remedy = focusRemedy({
      rect,
      panelRect: panel.getBoundingClientRect(),
      position: panel.getAttribute?.('data-position') === 'top' ? 'top' : 'bottom',
      scrollY: doc.defaultView?.scrollY ?? 0,
    })
    // NRD-309: an element already under a top panel with no scroll travel left
    // flips it at once. Whatever was decided here, the element is checked again
    // after the browser focus scroll (it may move it under the panel).
    if (remedy === 'flip') {
      resetToBottom(panel)
      update()
    }
    scheduleFocusScroll(target)
  }

  // NRD-316/318: the browser scrolls a focused element into view after focusin,
  // cancels any scroll started inside it and its own check ignores the reserved
  // padding. That scroll is smooth (scroll-behavior: smooth) and can take many
  // frames, so the element is only checked again once scrollY has been stable
  // for FOCUS_SETTLE_FRAMES frames (or after FOCUS_SETTLE_MAX_FRAMES). Whatever
  // focusin decided, the element is then flipped or scrolled instantly (CSS
  // smooth scrolling cannot cancel it) out from under the panel.
  function scheduleFocusScroll(target) {
    const view = doc.defaultView
    if (typeof view?.requestAnimationFrame !== 'function') {
      remedyFocus(target)
      return
    }
    let lastY = view.scrollY ?? 0
    let stable = 0
    let frames = 0
    const tick = () => {
      const panel = el('analytics-consent')
      if (!panel || panel.hidden || doc.activeElement !== target) return
      frames += 1
      const y = view.scrollY ?? 0
      if (y === lastY) stable += 1
      else {
        stable = 0
        lastY = y
      }
      if (stable >= FOCUS_SETTLE_FRAMES || frames >= FOCUS_SETTLE_MAX_FRAMES) {
        remedyFocus(target)
        return
      }
      view.requestAnimationFrame(tick)
    }
    view.requestAnimationFrame(tick)
  }

  // Measures everything again and moves a still obscured element out from under
  // the panel: back to the bottom when a top panel has no scroll travel left,
  // then an instant scroll by the remaining distance.
  function remedyFocus(target) {
    const panel = el('analytics-consent')
    if (!panel || panel.hidden || doc.activeElement !== target) return
    const view = doc.defaultView
    const position = () => (panel.getAttribute?.('data-position') === 'top' ? 'top' : 'bottom')
    const remedy = focusRemedy({
      rect: target.getBoundingClientRect(),
      panelRect: panel.getBoundingClientRect(),
      position: position(),
      scrollY: view?.scrollY ?? 0,
    })
    if (remedy === 'none') return
    if (remedy === 'flip') {
      resetToBottom(panel)
      update()
    }
    const header = doc.querySelector?.('header.fixed')
    const delta = focusScrollDelta({
      rect: target.getBoundingClientRect(),
      panelRect: panel.getBoundingClientRect(),
      position: position(),
      headerBottom: header ? header.getBoundingClientRect().bottom : 0,
    })
    if (!delta || typeof view?.scrollBy !== 'function') return
    try {
      view.scrollBy({ top: delta, behavior: 'instant' })
    } catch {
      view.scrollBy(0, delta)
    }
  }

  function sync() {
    const panel = el('analytics-consent')
    if (!panel) return
    if (storage.getItem(CONSENT_KEY)) {
      collapse()
      panel.hidden = true
      update()
      return
    }
    // Same visible panel (second sync of a page load): only re-measure.
    if (panel === placedNode && !panel.hidden) {
      update()
      return
    }
    if (panel === pendingNode) return
    collapse()
    // Reveal after the web fonts, so the panel is born with its final size.
    const wait = pendingFonts(doc)
    if (!wait) {
      reveal(panel)
      return
    }
    panel.hidden = true
    pendingNode = panel
    update()
    wait.then(() => {
      if (pendingNode !== panel) return
      pendingNode = null
      if (el('analytics-consent') !== panel || storage.getItem(CONSENT_KEY)) return
      reveal(panel)
    })
  }

  // Re-places the panel only when the width changed (device rotation); a
  // height-only change (mobile URL bar) must not flip a visible panel.
  function resize() {
    const panel = el('analytics-consent')
    if (panel && !panel.hidden && panel === placedNode && doc.defaultView?.innerWidth !== placedWidth) {
      place(panel)
    }
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
      place(panel)
      update()
    }
  }

  return { sync, handleClick, handleFocus, update, resize }
}
