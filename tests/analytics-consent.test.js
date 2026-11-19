import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ANALYTICS_DOM_EVENT,
  analyticsEventForLink,
  cookieDomainCandidates,
  createConsentController,
  createConsentPanel,
  consentOffset,
  consentPanelPosition,
  createGtag,
  focusRemedy,
  focusScrollDelta,
  isObscured,
  pendingFonts,
  placementFor,
} from '../src/scripts/analytics-consent.js'

const tag = (value) => Object.prototype.toString.call(value)

function withWindow(run) {
  const previous = globalThis.window
  globalThis.window = { location: { pathname: '/' } }
  try {
    return run()
  } finally {
    if (previous === undefined) delete globalThis.window
    else globalThis.window = previous
  }
}

function setupReal(initial = null) {
  const store = new Map(initial ? [['site-analytics-consent', initial]] : [])
  const target = {}
  const scripts = []
  const controller = createConsentController({
    storage: { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) },
    gtag: createGtag(target),
    appendScript: (src) => scripts.push({ src, queued: target.dataLayer.length }),
    measurementId: 'G-NCV98R3HW7',
  })
  return { controller, target, scripts }
}

function setup(initial = null) {
  const store = new Map(initial ? [['site-analytics-consent', initial]] : [])
  const calls = []
  const scripts = []
  const controller = createConsentController({
    storage: { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) },
    gtag: (...args) => calls.push(args),
    appendScript: (src) => scripts.push(src),
    measurementId: 'G-NCV98R3HW7',
  })
  return { controller, store, calls, scripts }
}

test('does not load analytics before affirmative consent', () => {
  const { controller, scripts, calls } = setup()
  controller.initialize()
  assert.deepEqual(scripts, [])
  assert.deepEqual(calls, [
    [
      'consent',
      'default',
      {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      },
    ],
  ])
})

test('acceptance persists consent and loads GA with advertising consent denied', () => {
  const { controller, store, calls, scripts } = setup()
  withWindow(() => controller.accept())
  assert.equal(store.get('site-analytics-consent'), 'accepted')
  assert.deepEqual(scripts, ['https://www.googletagmanager.com/gtag/js?id=G-NCV98R3HW7'])
  assert.ok(calls.some((args) => args[0] === 'consent' && args[1] === 'update' && args[2].analytics_storage === 'granted'))
  assert.equal(calls.some((args) => args[0] === 'consent' && args[2]?.ad_storage === 'granted'), false)
})

test('stored rejection does not load GA', () => {
  const { controller, scripts } = setup('rejected')
  controller.initialize()
  assert.deepEqual(scripts, [])
})

test('revocation prevents further page views and denies analytics consent', () => {
  const { controller, calls } = setup()
  withWindow(() => controller.accept())
  const viewsBeforeRevoke = calls.filter((args) => args[0] === 'event' && args[1] === 'page_view').length
  controller.reject()
  controller.trackPageView()
  assert.ok(calls.some((args) => args[0] === 'consent' && args[1] === 'update' && args[2].analytics_storage === 'denied'))
  assert.equal(calls.filter((args) => args[0] === 'event' && args[1] === 'page_view').length, viewsBeforeRevoke)
})

test('createGtag pushes an Arguments object, not an Array', () => {
  const target = {}
  const gtag = createGtag(target)
  gtag('consent', 'default', { analytics_storage: 'denied' })
  const entry = target.dataLayer[0]
  assert.equal(Array.isArray(entry), false)
  assert.equal(tag(entry), '[object Arguments]')
  assert.deepEqual(Array.from(entry), ['consent', 'default', { analytics_storage: 'denied' }])
  assert.equal(target.gtag, gtag)
})

test('createGtag keeps an existing dataLayer and its entries', () => {
  const existing = ['previous']
  const target = { dataLayer: existing }
  createGtag(target)('js', 1)
  assert.equal(target.dataLayer, existing)
  assert.equal(target.dataLayer[0], 'previous')
  assert.equal(target.dataLayer.length, 2)
})

test('consent default is queued before gtag.js is requested', () => {
  withWindow(() => {
    const { controller, target, scripts } = setupReal()
    controller.initialize()
    controller.accept()
    assert.deepEqual(Array.from(target.dataLayer[0]), [
      'consent',
      'default',
      { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' },
    ])
    assert.equal(scripts.length, 1)
    const before = target.dataLayer.slice(0, scripts[0].queued).map((entry) => Array.from(entry))
    assert.ok(before.some((a) => a[0] === 'consent' && a[1] === 'update' && a[2].analytics_storage === 'granted'))
    assert.ok(before.some((a) => a[0] === 'js'))
    assert.ok(before.some((a) => a[0] === 'config' && a[1] === 'G-NCV98R3HW7'))
    assert.ok(target.dataLayer.every((entry) => tag(entry) === '[object Arguments]'))
  })
})

test('accepting sends a page_view for the current page once', () => {
  withWindow(() => {
    const { controller, target } = setupReal()
    controller.initialize()
    controller.accept()
    controller.accept()
    const views = target.dataLayer.map((entry) => Array.from(entry)).filter((a) => a[0] === 'event' && a[1] === 'page_view')
    assert.equal(views.length, 1)
    assert.deepEqual(views[0][2], { page_path: '/' })
  })
})

test('stored consent on initialize does not send an extra page_view', () => {
  withWindow(() => {
    const { controller, target } = setupReal('accepted')
    controller.initialize()
    const events = target.dataLayer.map((entry) => Array.from(entry)).filter((a) => a[0] === 'event')
    assert.equal(events.length, 0)
  })
})

test('AnalyticsConsent.astro uses createGtag instead of an Array-pushing wrapper', async () => {
  const { readFile } = await import('node:fs/promises')
  const source = await readFile(new URL('../src/components/AnalyticsConsent.astro', import.meta.url), 'utf8')
  assert.match(source, /import\s*\{[^}]*\bcreateGtag\b[^}]*\}\s*from\s*["']\.\.\/scripts\/analytics-consent\.js["']/)
  assert.match(source, /createGtag\(window\)/)
  assert.doesNotMatch(source, /dataLayer\.push\(args\)/)
})

test('accept, reject and accept again re-grants consent without reloading the script', () => {
  withWindow(() => {
    const { controller, target, scripts } = setupReal()
    controller.initialize()
    controller.accept()
    controller.reject()
    const before = target.dataLayer.length
    controller.accept()
    const fresh = target.dataLayer.slice(before).map((entry) => Array.from(entry))
    assert.equal(scripts.length, 1)
    assert.ok(fresh.some((a) => a[0] === 'consent' && a[1] === 'update' && a[2].analytics_storage === 'granted'))
    assert.equal(fresh.some((a) => a[2]?.ad_storage === 'granted'), false)
    assert.equal(fresh.filter((a) => a[0] === 'event' && a[1] === 'page_view').length, 1)
    controller.trackEvent('contact_click')
    assert.equal(Array.from(target.dataLayer.at(-1))[1], 'contact_click')
  })
})

test('homepage related links include the contextual resources page', async () => {
  const { readFile } = await import('node:fs/promises')
  const links = await readFile(new URL('../src/data/internal-links.ts', import.meta.url), 'utf8')
  const homepageLinks = links.match(/"\/": \[([\s\S]*?)\n  \],/)?.[1] ?? ''
  assert.match(homepageLinks, /path: "\/recursos\/".*kind: "contextual"/)
})

test('cookie policy links use the canonical trailing-slash path', async () => {
  const { readFile } = await import('node:fs/promises')
  const [consent, privacy] = await Promise.all([
    readFile(new URL('../src/components/AnalyticsConsent.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/privacidad.astro', import.meta.url), 'utf8'),
  ])
  assert.match(consent, /href="\/cookies\/"/)
  assert.match(privacy, /href="\/cookies\/"/)
})

test('about portrait imports and renders the Astro WebP asset', async () => {
  const { access, readFile } = await import('node:fs/promises')
  const about = await readFile(new URL('../src/pages/sobre-mi.astro', import.meta.url), 'utf8')
  assert.match(about, /import\s+portrait\s+from\s+['"]@\/assets\/perfil-profesional\.webp['"]/)
  assert.match(about, /<Image[\s\S]*?src=\{portrait\}/)
  await access(new URL('../src/assets/perfil-profesional.webp', import.meta.url))
})

test('every import.meta.env variable read in src is declared in env.d.ts', async () => {
  const { readFile, readdir } = await import('node:fs/promises')
  const envTypes = await readFile(new URL('../src/env.d.ts', import.meta.url), 'utf8')
  const declared = envTypes.match(/interface ImportMetaEnv\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''
  assert.match(declared, /readonly PUBLIC_GA4_MEASUREMENT_ID\?: string/)

  const srcDir = new URL('../src/', import.meta.url)
  const entries = await readdir(srcDir, { recursive: true })
  const used = new Set()
  for (const entry of entries.filter((name) => /\.(astro|ts)$/.test(name) && !name.endsWith('env.d.ts'))) {
    const source = await readFile(new URL(entry, srcDir), 'utf8')
    for (const match of source.matchAll(/import\.meta\.env\.(\w+)/g)) used.add(match[1])
  }
  for (const name of used) {
    assert.match(declared, new RegExp(`readonly ${name}\\??: `), `${name} is not declared in src/env.d.ts`)
  }
})

const BOOKING =
  "https://calendar.google.com/calendar/appointments/schedules/abc?gv=true";

test("analyticsEventForLink maps the booking URL to contact_click", () => {
  assert.deepEqual(
    analyticsEventForLink({
      href: BOOKING,
      placement: "main",
      bookingUrl: BOOKING,
    }),
    {
      name: "contact_click",
      params: { contact_method: "booking", placement: "main" },
    },
  );
});

test("analyticsEventForLink returns null for a booking URL with a different query", () => {
  assert.equal(
    analyticsEventForLink({
      href: `${BOOKING}&x=1`,
      placement: "main",
      bookingUrl: BOOKING,
    }),
    null,
  );
});

test("analyticsEventForLink maps tel: and mailto: without sending the value", () => {
  const phone = analyticsEventForLink({
    href: "tel:+34600000000",
    placement: "footer",
    bookingUrl: BOOKING,
  });
  assert.deepEqual(phone, {
    name: "contact_click",
    params: { contact_method: "phone", placement: "footer" },
  });
  const email = analyticsEventForLink({
    href: "mailto:hola@example.com",
    placement: "main",
    bookingUrl: BOOKING,
  });
  assert.deepEqual(email, {
    name: "contact_click",
    params: { contact_method: "email", placement: "main" },
  });
  assert.doesNotMatch(JSON.stringify([phone, email]), /600000000|example\.com/);
});

test("analyticsEventForLink maps wa.me links to whatsapp_click", () => {
  assert.deepEqual(
    analyticsEventForLink({
      href: "https://wa.me/34600000000?text=hola",
      placement: "page",
      bookingUrl: BOOKING,
    }),
    { name: "whatsapp_click", params: { placement: "page" } },
  );
});

test("analyticsEventForLink ignores internal and external unrelated links", () => {
  assert.equal(
    analyticsEventForLink({
      href: "/seo-local-sevilla/",
      placement: "nav",
      bookingUrl: BOOKING,
    }),
    null,
  );
  assert.equal(
    analyticsEventForLink({
      href: "https://example.com/",
      placement: "main",
      bookingUrl: BOOKING,
    }),
    null,
  );
});

test("placementFor returns the nearest landmark or page", () => {
  const el = (landmark) => ({
    closest: (selector) => {
      assert.equal(selector, "header,nav,main,footer,aside");
      return landmark ? { localName: landmark } : null;
    },
  });
  assert.equal(placementFor(el("footer")), "footer");
  assert.equal(placementFor(el("header")), "header");
  assert.equal(placementFor(el(null)), "page");
});

test("conversion events are gated by consent and sent once after accept", () => {
  withWindow(() => {
    const { controller, target } = setupReal();
    const events = () =>
      target.dataLayer
        .map((e) => Array.from(e))
        .filter((a) => a[0] === "event" && a[1] === "contact_click");
    controller.initialize();
    controller.trackEvent("contact_click", {
      contact_method: "booking",
      placement: "main",
    });
    assert.equal(events().length, 0);
    controller.accept();
    controller.trackEvent("contact_click", {
      contact_method: "booking",
      placement: "main",
    });
    assert.equal(events().length, 1);
    assert.deepEqual(events()[0][2], {
      contact_method: "booking",
      placement: "main",
      page_path: "/",
    });
    controller.reject();
    controller.trackEvent("contact_click", {
      contact_method: "booking",
      placement: "main",
    });
    assert.equal(events().length, 1);
  });
});

test("every event name the mapper returns is allowlisted by trackEvent", () => {
  withWindow(() => {
    const links = [
      "tel:+34600000000",
      "mailto:a@b.es",
      "https://wa.me/34600000000",
      BOOKING,
    ];
    const { controller, target } = setupReal();
    controller.initialize();
    controller.accept();
    for (const href of links) {
      const found = analyticsEventForLink({
        href,
        placement: "main",
        bookingUrl: BOOKING,
      });
      controller.trackEvent(found.name, found.params);
    }
    const names = target.dataLayer
      .map((e) => Array.from(e))
      .filter((a) => a[0] === "event" && a[1] !== "page_view")
      .map((a) => a[1]);
    assert.deepEqual(names, [
      "contact_click",
      "contact_click",
      "whatsapp_click",
      "contact_click",
    ]);
  });
});

test("contact form dispatches site:analytics and the consent component listens to it", async () => {
  const { readFile } = await import("node:fs/promises");
  const form = await readFile(
    new URL("../src/scripts/contact-form.js", import.meta.url),
    "utf8",
  );
  assert.equal(ANALYTICS_DOM_EVENT, "site:analytics");
  assert.match(form, /new CustomEvent\(['"]site:analytics['"]/);
  assert.match(form, /name:\s*['"]form_submit['"]/);
  assert.match(form, /placement:\s*['"]contact_form['"]/);
  const component = await readFile(
    new URL("../src/components/AnalyticsConsent.astro", import.meta.url),
    "utf8",
  );
  assert.match(component, /addEventListener\(\s*ANALYTICS_DOM_EVENT/);
  assert.match(component, /analyticsEventForLink/);
});

function fakeTree(chain) {
  // chain: landmark names from the outermost ancestor down to the link
  const nodes = chain.map((localName) => ({ localName, parentElement: null }))
  nodes.forEach((node, i) => {
    node.parentElement = i > 0 ? nodes[i - 1] : null
    node.closest = (selector) => {
      const set = selector.split(',')
      for (let cur = node; cur; cur = cur.parentElement) if (set.includes(cur.localName)) return cur
      return null
    }
  })
  return nodes[nodes.length - 1]
}

test('placementFor resolves the outermost landmark for a CTA nested in a nav inside main', () => {
  assert.equal(placementFor(fakeTree(['body', 'main', 'div', 'nav', 'a'])), 'main')
})

test('placementFor resolves header for a link in the header nav', () => {
  assert.equal(placementFor(fakeTree(['body', 'header', 'nav', 'a'])), 'header')
})

test('placementFor keeps footer and falls back to page without a landmark', () => {
  assert.equal(placementFor(fakeTree(['body', 'footer', 'div', 'a'])), 'footer')
  assert.equal(placementFor(fakeTree(['body', 'div', 'a'])), 'page')
})

test('trackEvent drops params that are not in the taxonomy', () => {
  withWindow(() => {
    const { controller, target } = setupReal()
    controller.initialize()
    controller.accept()
    controller.trackEvent('contact_click', {
      contact_method: 'phone',
      placement: 'footer',
      email: 'a@b.es',
      href: 'tel:+34600000000',
      page_path: '/spoofed',
    })
    const sent = target.dataLayer.map((e) => Array.from(e)).find((a) => a[0] === 'event' && a[1] === 'contact_click')
    assert.deepEqual(sent[2], { contact_method: 'phone', placement: 'footer', page_path: '/' })
  })
})

test('privacy and cookie pages disclose the measured contact interactions', async () => {
  const { readFile } = await import('node:fs/promises')
  for (const page of ['privacidad', 'cookies']) {
    const source = (await readFile(new URL(`../src/pages/${page}.astro`, import.meta.url), 'utf8')).replace(/\s+/g, ' ')
    assert.match(source, /clics en los enlaces de reserva, teléfono, correo y WhatsApp/, page)
    assert.match(source, /envío correcto del formulario de contacto/, page)
  }
})

const FLAG = 'ga-disable-G-NCV98R3HW7'

function setupKillSwitch(initial = null, cookieNames = []) {
  const store = new Map(initial ? [['site-analytics-consent', initial]] : [])
  const global = { location: { hostname: 'www.nuriaromero.dev', pathname: '/' } }
  const log = []
  const expired = []
  const controller = createConsentController({
    storage: { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) },
    gtag: (...args) => log.push({ args, flag: global[FLAG] }),
    appendScript: (src) => log.push({ args: ['script', src], flag: global[FLAG] }),
    measurementId: 'G-NCV98R3HW7',
    global,
    cookies: { read: () => cookieNames.map((n) => `${n}=1`).join('; '), expire: (name, domain) => expired.push([name, domain]) },
  })
  return { controller, global, log, expired }
}

test('revoke after accept sets the ga-disable flag before the consent update', () => {
  withWindow(() => {
    const { controller, global, log } = setupKillSwitch()
    controller.initialize()
    controller.accept()
    controller.reject()
    assert.equal(global[FLAG], true)
    const denied = log.filter((l) => l.args[0] === 'consent' && l.args[1] === 'update' && l.args[2].analytics_storage === 'denied')
    assert.equal(denied.length, 1)
    assert.equal(denied[0].flag, true)
  })
})

test('initialize sets the flag for no choice or rejected and clears it for accepted', () => {
  withWindow(() => {
    for (const [initial, expected] of [[null, true], ['rejected', true], ['accepted', false]]) {
      const { controller, global } = setupKillSwitch(initial)
      controller.initialize()
      assert.equal(global[FLAG], expected, String(initial))
    }
  })
})

test('accept after revoke clears the flag before consent granted and page_view, loading the script once', () => {
  withWindow(() => {
    const { controller, global, log } = setupKillSwitch()
    controller.initialize()
    controller.accept()
    controller.reject()
    const mark = log.length
    controller.accept()
    assert.equal(global[FLAG], false)
    const after = log.slice(mark)
    const granted = after.find((l) => l.args[0] === 'consent' && l.args[2]?.analytics_storage === 'granted')
    const view = after.find((l) => l.args[0] === 'event' && l.args[1] === 'page_view')
    assert.equal(granted.flag, false)
    assert.equal(view.flag, false)
    assert.equal(log.filter((l) => l.args[0] === 'script').length, 1)
  })
})

test('revoke expires _ga and _ga_* cookies on every candidate domain and nothing else', () => {
  withWindow(() => {
    const { controller, expired } = setupKillSwitch(null, ['_ga', '_ga_ABC123', 'theme', 'site-analytics-consent'])
    controller.initialize()
    controller.accept()
    controller.reject()
    const domains = [null, ...cookieDomainCandidates('www.nuriaromero.dev')]
    assert.deepEqual(expired.filter(([n]) => n === '_ga').map(([, d]) => d), domains)
    assert.deepEqual(expired.filter(([n]) => n === '_ga_ABC123').map(([, d]) => d), domains)
    assert.equal(expired.every(([n]) => n === '_ga' || n === '_ga_ABC123'), true)
  })
})

test('revoke does not throw without the optional global and cookies dependencies', () => {
  withWindow(() => {
    const { controller } = setup()
    controller.initialize()
    controller.accept()
    assert.doesNotThrow(() => controller.reject())
  })
})

test('cookieDomainCandidates covers localhost, the apex domain and www', () => {
  assert.deepEqual(cookieDomainCandidates('localhost'), [])
  assert.deepEqual(cookieDomainCandidates('127.0.0.1'), [])
  assert.deepEqual(cookieDomainCandidates('nuriaromero.dev'), ['nuriaromero.dev', '.nuriaromero.dev'])
  assert.deepEqual(cookieDomainCandidates('www.nuriaromero.dev'), [
    'www.nuriaromero.dev',
    '.www.nuriaromero.dev',
    'nuriaromero.dev',
    '.nuriaromero.dev',
  ])
})

test('AnalyticsConsent.astro passes window and a document.cookie adapter to the controller', async () => {
  const { readFile } = await import('node:fs/promises')
  const source = await readFile(new URL('../src/components/AnalyticsConsent.astro', import.meta.url), 'utf8')
  assert.match(source, /global:\s*window/)
  assert.match(source, /cookies:/)
  assert.match(source, /document\.cookie/)
})

test('measurement doc no longer claims a clean revoke or carries superseded rows', async () => {
  const { readFile } = await import('node:fs/promises')
  const doc = await readFile(new URL('../docs/seo-audit/measurement-seo.md', import.meta.url), 'utf8')
  assert.doesNotMatch(doc, /no sale ninguna petición más/)
  assert.doesNotMatch(doc, /superseded/)
})

function fakeDomWorld(ids) {
  const build = (label, hidden) => {
    const make = (id, extra = {}) => ({
      id,
      hidden: false,
      checked: false,
      attrs: {},
      setAttribute(name, value) {
        this.attrs[name] = value
      },
      closest(selector) {
        return selector === `#${id}` ? this : null
      },
      ...extra,
    })
    const nodes = {}
    for (const id of ids) nodes[id] = make(id)
    nodes['analytics-consent'].hidden = hidden
    nodes['consent-settings'].hidden = true
    nodes['consent-save'].hidden = true
    nodes['consent-customize'].attrs['aria-expanded'] = 'false'
    nodes.label = label
    return nodes
  }
  const world = { current: null }
  world.doc = { getElementById: (id) => world.current[id] ?? null }
  world.build = build
  return world
}

const PANEL_IDS = [
  'analytics-consent',
  'consent-settings',
  'analytics-toggle',
  'consent-customize',
  'consent-save',
  'consent-accept',
  'consent-reject',
  'cookie-settings',
]

function panelSetup(stored) {
  const store = new Map(stored ? [['site-analytics-consent', stored]] : [])
  const calls = []
  const controller = {
    accept: () => calls.push('accept'),
    reject: () => calls.push('reject'),
  }
  const world = fakeDomWorld(PANEL_IDS)
  const a = world.build('A', true)
  const b = world.build('B', true)
  world.current = a
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) }
  const panel = createConsentPanel({ doc: world.doc, storage, controller })
  return { world, a, b, panel, calls }
}

test('panel: cookie-settings click after a DOM swap opens the new panel and leaves the old one', () => {
  const { world, a, b, panel } = panelSetup('accepted')
  world.current = b
  panel.handleClick(b['cookie-settings'])
  assert.equal(b['analytics-consent'].hidden, false)
  assert.equal(b['consent-settings'].hidden, false)
  assert.equal(b['consent-save'].hidden, false)
  assert.equal(b['analytics-toggle'].checked, true)
  assert.equal(a['analytics-consent'].hidden, true)
})

test('panel: reject after a DOM swap calls the controller and hides the new panel', () => {
  const { world, b, panel, calls } = panelSetup('accepted')
  world.current = b
  b['analytics-consent'].hidden = false
  panel.handleClick(b['consent-reject'])
  assert.deepEqual(calls, ['reject'])
  assert.equal(b['analytics-consent'].hidden, true)
})

test('panel: sync after a swap shows the panel when no choice is stored', () => {
  const { world, b, panel } = panelSetup(null)
  world.current = b
  panel.sync()
  assert.equal(b['analytics-consent'].hidden, false)
  assert.equal(b['consent-settings'].hidden, true)
  assert.equal(b['consent-save'].hidden, true)
  assert.equal(b['consent-customize'].attrs['aria-expanded'], 'false')
})

test('panel: sync after a swap keeps it hidden with a stored choice and does not touch consent', () => {
  const { world, b, panel, calls } = panelSetup('rejected')
  world.current = b
  panel.sync()
  assert.equal(b['analytics-consent'].hidden, true)
  assert.deepEqual(calls, [])
})

test('panel: customize toggles settings, save applies the toggle', () => {
  const { world, b, panel, calls } = panelSetup(null)
  world.current = b
  panel.sync()
  panel.handleClick(b['consent-customize'])
  assert.equal(b['consent-settings'].hidden, false)
  assert.equal(b['consent-save'].hidden, false)
  assert.equal(b['consent-customize'].attrs['aria-expanded'], 'true')
  b['analytics-toggle'].checked = true
  panel.handleClick(b['consent-save'])
  assert.deepEqual(calls, ['accept'])
  assert.equal(b['analytics-consent'].hidden, true)
  panel.handleClick(b['consent-accept'])
  assert.deepEqual(calls, ['accept', 'accept'])
})

test('AnalyticsConsent.astro no longer caches panel elements and syncs on page-load', async () => {
  const { readFile } = await import('node:fs/promises')
  const source = await readFile(new URL('../src/components/AnalyticsConsent.astro', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /const panel = document\.querySelector/)
  assert.match(source, /panel\.sync\(\)/)
  assert.match(source, /panel\.handleClick\(/)
})

const rect = (top, bottom, left = 0, right = 100) => ({ top, bottom, left, right, height: bottom - top, width: right - left })

test('consentOffset is the viewport space from the panel top to the bottom edge', () => {
  assert.equal(consentOffset(rect(600, 792), 800), 200)
  assert.equal(consentOffset(rect(640.2, 792), 800), 160)
  assert.equal(consentOffset(rect(0, 0), 800), 0)
  assert.equal(consentOffset(null, 800), 0)
})

test('isObscured is true only when the element rect intersects the panel rect', () => {
  const panelRect = rect(600, 792, 8, 392)
  assert.equal(isObscured(rect(700, 740, 20, 200), panelRect), true)
  assert.equal(isObscured(rect(500, 560, 20, 200), panelRect), false)
  assert.equal(isObscured(rect(700, 740, 400, 500), panelRect), false)
  assert.equal(isObscured(rect(0, 0, 0, 0), panelRect), false)
})

function offsetSetup(stored, panelRect = rect(600, 792, 8, 392)) {
  const props = new Map()
  const { world, a, b, panel, calls } = panelSetup(stored)
  world.doc.documentElement = {
    style: {
      setProperty: (name, value) => props.set(name, value),
      removeProperty: (name) => props.delete(name),
    },
  }
  // NRD-316: the focus remedy runs in the next frame (after the UA focus
  // scroll), so the view queues animation frames and records scrollBy calls.
  const frames = []
  const scrolls = []
  world.doc.defaultView = {
    innerHeight: 800,
    requestAnimationFrame: (cb) => frames.push(cb),
    scrollBy: (arg) => scrolls.push(arg),
  }
  const flushFrames = () => {
    while (frames.length) frames.shift()()
  }
  const scrolled = []
  for (const nodes of [a, b]) nodes['analytics-consent'].getBoundingClientRect = () => panelRect
  // Building a target focuses it, like the browser does before focusin.
  const target = (r, extra = {}) => {
    const node = {
      getBoundingClientRect: () => r,
      scrollIntoView: (opts) => scrolled.push(opts),
      closest: () => null,
      ...extra,
    }
    world.doc.activeElement = node
    return node
  }
  return { world, a, b, panel, calls, props, scrolled, scrolls, frames, flushFrames, target }
}

test('panel: sync publishes --consent-offset while visible and removes it when answered', () => {
  const { world, b, panel, props } = offsetSetup(null)
  world.current = b
  panel.sync()
  assert.equal(props.get('--consent-offset'), '200px')
  panel.handleClick(b['consent-reject'])
  assert.equal(props.has('--consent-offset'), false)
})

test('panel: sync with a stored choice leaves no --consent-offset on a fresh page', () => {
  const { world, b, panel, props } = offsetSetup('accepted')
  props.set('--consent-offset', '200px')
  world.current = b
  panel.sync()
  assert.equal(props.has('--consent-offset'), false)
})

test('panel: opening and customizing re-measure the offset, update() follows resize', () => {
  let current = rect(600, 792, 8, 392)
  const { world, b, panel, props } = offsetSetup('accepted')
  b['analytics-consent'].getBoundingClientRect = () => current
  world.current = b
  panel.handleClick(b['cookie-settings'])
  assert.equal(props.get('--consent-offset'), '200px')
  current = rect(500, 792, 8, 392)
  panel.update()
  assert.equal(props.get('--consent-offset'), '300px')
  current = rect(450, 792, 8, 392)
  panel.handleClick(b['consent-customize'])
  assert.equal(props.get('--consent-offset'), '350px')
})

test('panel: handleFocus scrolls only an obscured element outside the panel, after the next frame', () => {
  const { world, b, panel, scrolled, scrolls, flushFrames, target } = offsetSetup(null)
  world.current = b
  panel.sync()
  panel.handleFocus(target(rect(700, 740, 20, 200)))
  assert.deepEqual(scrolls, [])
  flushFrames()
  assert.deepEqual(scrolls, [{ top: 148, behavior: 'instant' }])
  panel.handleFocus(target(rect(100, 140, 20, 200)))
  flushFrames()
  assert.equal(scrolls.length, 1)
  panel.handleFocus(target(rect(700, 740, 20, 200), { closest: (s) => (s === '#analytics-consent' ? b['analytics-consent'] : null) }))
  flushFrames()
  assert.equal(scrolls.length, 1)
  panel.handleFocus(null)
  panel.handleFocus({})
  flushFrames()
  assert.equal(scrolls.length, 1)
  assert.equal(scrolled.length, 0)
})

test('panel: handleFocus does nothing while the panel is hidden', () => {
  const { world, b, panel, scrolled, scrolls, frames, flushFrames, target } = offsetSetup('accepted')
  world.current = b
  panel.sync()
  panel.handleFocus(target(rect(700, 740, 20, 200)))
  flushFrames()
  assert.equal(frames.length, 0)
  assert.equal(scrolled.length, 0)
  assert.equal(scrolls.length, 0)
})

test('layout reserves the consent offset: scroll-padding, body padding, WhatsApp button, focusin and resize', async () => {
  const { readFile } = await import('node:fs/promises')
  const consent = await readFile(new URL('../src/components/AnalyticsConsent.astro', import.meta.url), 'utf8')
  const whatsapp = await readFile(new URL('../src/components/WhatsAppButton.astro', import.meta.url), 'utf8')
  assert.match(consent, /scroll-padding-bottom:\s*var\(--consent-offset/)
  assert.match(consent, /padding-bottom:\s*var\(--consent-offset/)
  assert.match(consent, /addEventListener\("focusin"/)
  assert.match(consent, /addEventListener\("resize"/)
  assert.match(consent, /panel\.handleFocus\(/)
  assert.match(consent, /aria-controls="consent-settings"/)
  assert.match(whatsapp, /bottom-\[calc\(var\(--consent-offset,0px\)\+1rem\)\]/)
  assert.match(whatsapp, /sm:bottom-\[calc\(var\(--consent-offset,0px\)\+1\.25rem\)\]/)
})

// NRD-71 regression: the floating WhatsApp button must clear the consent panel.
// The bottom inset is parsed from the real WhatsAppButton.astro class so the test
// breaks if the --consent-offset term is removed.
async function whatsappSource() {
  const { readFile } = await import('node:fs/promises')
  return readFile(new URL('../src/components/WhatsAppButton.astro', import.meta.url), 'utf8')
}

// Resolves the unprefixed `bottom-[...]` class to px given the published offset.
function buttonBottomPx(source, offset) {
  const match = source.match(/(?<![\w:-])bottom-\[calc\((var\(--consent-offset,0px\)\+)?([\d.]+)rem\)\]/)
  assert.ok(match, 'WhatsAppButton.astro has an unprefixed bottom-[calc(...)] class')
  const usesOffset = match[1] !== undefined
  return (usesOffset ? offset : 0) + Number(match[2]) * 16
}

function buttonRect(viewport, bottomPx, size = 48, right = 16) {
  const bottom = viewport.height - bottomPx
  const rightEdge = viewport.width - right
  return { top: bottom - size, bottom, left: rightEdge - size, right: rightEdge, width: size, height: size }
}

const consentViewports = [
  { name: '390x844 (QA geometry)', width: 390, height: 844, panelHeight: 212 },
  { name: '360x800 at 35vh max height', width: 360, height: 800, panelHeight: 800 * 0.35 },
  { name: '414x896 at 35vh max height', width: 414, height: 896, panelHeight: 896 * 0.35 },
]

for (const vp of consentViewports) {
  test(`WhatsApp button clears the consent panel at ${vp.name}`, async () => {
    const source = await whatsappSource()
    const panel = {
      top: vp.height - vp.panelHeight,
      bottom: vp.height,
      left: 9,
      right: vp.width - 8,
      height: vp.panelHeight,
      width: vp.width - 17,
    }
    // Pre-fix behavior: no offset applied, the button sits on top of the panel.
    assert.equal(isObscured(buttonRect(vp, 16), panel), true)
    // Current class: the offset published by the panel is applied.
    const offset = consentOffset(panel, vp.height)
    const fixed = buttonRect(vp, buttonBottomPx(source, offset))
    assert.equal(isObscured(fixed, panel), false)
    assert.ok(fixed.bottom <= panel.top)
    // The same geometry with the term stripped from the class must be obscured.
    const mutated = source.replaceAll('var(--consent-offset,0px)+', '')
    assert.equal(isObscured(buttonRect(vp, buttonBottomPx(mutated, offset)), panel), true)
  })
}

// NRD-305: the panel must not cover the hero booking button on short viewports.
const bugMeasures = (overrides = {}) => ({
  panelRect: rect(447, 659, 8, 367),
  avoidRects: [rect(548, 592, 20, 200)],
  viewportHeight: 667,
  headerBottom: 64,
  gap: 8,
  ...overrides,
});

test("consentPanelPosition anchors the panel on top when the bottom placement covers the CTA (375x667)", () => {
  assert.deepEqual(consentPanelPosition(bugMeasures()), {
    position: "top",
    top: 72,
  });
});

test("consentPanelPosition keeps the panel at the bottom when nothing is covered (390x844)", () => {
  const result = consentPanelPosition(
    bugMeasures({
      panelRect: rect(632, 836, 8, 382),
      avoidRects: [rect(548, 592, 20, 200)],
      viewportHeight: 844,
    }),
  );
  assert.deepEqual(result, { position: "bottom" });
});

test("consentPanelPosition keeps the bottom when the top placement would also cover an element", () => {
  const result = consentPanelPosition(
    bugMeasures({
      avoidRects: [rect(548, 592, 20, 200), rect(80, 120, 20, 200)],
    }),
  );
  assert.deepEqual(result, { position: "bottom" });
});

test("consentPanelPosition keeps the bottom without avoid rects", () => {
  assert.deepEqual(consentPanelPosition(bugMeasures({ avoidRects: [] })), {
    position: "bottom",
  });
});

function positionSetup(stored, avoid) {
  const ctx = offsetSetup(stored, rect(447, 659, 8, 367));
  ctx.world.doc.defaultView.innerHeight = 667;
  const styles = {};
  for (const nodes of [ctx.a, ctx.b]) {
    const panelNode = nodes["analytics-consent"];
    panelNode.style = styles;
    panelNode.getBoundingClientRect = () => {
      const onTop = panelNode.attrs["data-position"] === "top";
      const top = onTop ? Number.parseFloat(styles.top) : 447;
      return rect(top, top + 212, 8, 367);
    };
    panelNode.getAttribute = function (name) {
      return this.attrs[name] ?? null;
    };
    panelNode.removeAttribute = function (name) {
      delete this.attrs[name];
    };
  }
  ctx.world.doc.querySelector = (selector) =>
    selector.includes("header")
      ? { getBoundingClientRect: () => rect(8, 64, 0, 375) }
      : null;
  ctx.world.doc.querySelectorAll = (selector) =>
    selector === "[data-consent-avoid]"
      ? avoid.map((r) => ({ getBoundingClientRect: () => r }))
      : [];
  return { ...ctx, styles };
}

test("panel: sync with the CTA covered anchors the panel on top and publishes --consent-offset-top", () => {
  const { world, b, panel, props, styles } = positionSetup(null, [
    rect(548, 592, 20, 200),
  ]);
  world.current = b;
  panel.sync();
  assert.equal(b["analytics-consent"].attrs["data-position"], "top");
  assert.equal(styles.top, "72px");
  assert.equal(props.has("--consent-offset"), false);
  assert.equal(props.get("--consent-offset-top"), "284px");
});

test("panel: sync without overlap keeps the NRD-80 bottom behavior", () => {
  const { world, b, panel, props, styles } = positionSetup(null, [
    rect(300, 340, 20, 200),
  ]);
  world.current = b;
  panel.sync();
  assert.equal(b["analytics-consent"].attrs["data-position"], undefined);
  assert.equal(styles.top, undefined);
  assert.equal(props.get("--consent-offset"), "220px");
  assert.equal(props.has("--consent-offset-top"), false);
});

test("panel: reopening from cookie-settings places the panel on top too", () => {
  const { world, b, panel, props } = positionSetup("accepted", [
    rect(548, 592, 20, 200),
  ]);
  world.current = b;
  panel.handleClick(b["cookie-settings"]);
  assert.equal(b["analytics-consent"].attrs["data-position"], "top");
  assert.equal(props.has("--consent-offset"), false);
});

test("panel: handleFocus scrolls an element hidden behind a top-anchored panel", () => {
  const { world, b, panel, scrolls, flushFrames, target } = positionSetup(null, [
    rect(548, 592, 20, 200),
  ]);
  world.current = b;
  world.doc.defaultView.scrollY = 400;
  panel.sync();
  panel.handleFocus(target(rect(100, 140, 20, 200)));
  flushFrames();
  assert.deepEqual(scrolls, [{ top: -192, behavior: "instant" }]);
  panel.handleFocus(target(rect(500, 540, 20, 200)));
  flushFrames();
  assert.equal(scrolls.length, 1);
  assert.equal(b["analytics-consent"].attrs["data-position"], "top");
});

// NRD-309: with the panel on top and no scroll travel, it returns to the bottom.
const focusMeasures = (overrides = {}) => ({
  rect: rect(102, 134, 20, 200),
  panelRect: rect(72, 284, 8, 367),
  position: "top",
  scrollY: 0,
  ...overrides,
});

test("focusRemedy: none without overlap", () => {
  assert.equal(focusRemedy(focusMeasures({ rect: rect(300, 340, 20, 200) })), "none");
});

test("focusRemedy: scroll when the panel is at the bottom", () => {
  assert.equal(
    focusRemedy(
      focusMeasures({
        position: "bottom",
        panelRect: rect(447, 659, 8, 367),
        rect: rect(500, 540, 20, 200),
      }),
    ),
    "scroll",
  );
});

test("focusRemedy: flip when the panel is on top and scrollY is 0 (NRD-309 QA case)", () => {
  assert.equal(focusRemedy(focusMeasures()), "flip");
});

test("focusRemedy: scroll when the panel is on top and scrollY is 400", () => {
  assert.equal(focusRemedy(focusMeasures({ scrollY: 400 })), "scroll");
});

test("focusRemedy: boundary scrollY = ceil(panel bottom) - top scrolls, one less flips", () => {
  assert.equal(focusRemedy(focusMeasures({ scrollY: 182 })), "scroll");
  assert.equal(focusRemedy(focusMeasures({ scrollY: 181 })), "flip");
});

test("panel: focus under the top panel at scrollY 0 returns the panel to the bottom without scrolling", () => {
  const { world, b, panel, props, styles, scrolled, scrolls, flushFrames, target } = positionSetup(null, [
    rect(548, 592, 20, 200),
  ]);
  world.current = b;
  world.doc.defaultView.scrollY = 0;
  panel.sync();
  assert.equal(b["analytics-consent"].attrs["data-position"], "top");
  panel.handleFocus(target(rect(102, 134, 20, 200)));
  flushFrames();
  assert.equal(b["analytics-consent"].attrs["data-position"], undefined);
  assert.equal(styles.top, "");
  assert.equal(props.get("--consent-offset"), "220px");
  assert.equal(props.has("--consent-offset-top"), false);
  assert.equal(scrolls.length, 0);
  // The booking button is now under the bottom panel: scroll as usual, stay at the bottom.
  panel.handleFocus(target(rect(548, 592, 20, 200)));
  flushFrames();
  assert.deepEqual(scrolls, [{ top: 153, behavior: "instant" }]);
  assert.equal(scrolled.length, 0);
  assert.equal(b["analytics-consent"].attrs["data-position"], undefined);
});

// NRD-316: after the flip the focused hero button (600-644) sat under the
// bottom panel (447-659) and the synchronous scrollIntoView never moved it.
test("panel: NRD-316 sequence, breadcrumb flips the panel, then the CTA is scrolled above it after the frame", () => {
  const { world, b, panel, scrolled, scrolls, frames, flushFrames, target } = positionSetup(null, [
    rect(548, 592, 20, 200),
  ]);
  world.current = b;
  world.doc.defaultView.scrollY = 0;
  panel.sync();
  assert.equal(b["analytics-consent"].attrs["data-position"], "top");
  panel.handleFocus(target(rect(102, 134, 20, 200)));
  flushFrames();
  assert.equal(b["analytics-consent"].attrs["data-position"], undefined);
  assert.equal(scrolls.length, 0);
  panel.handleFocus(target(rect(600, 644, 20, 200)));
  assert.equal(scrolls.length, 0);
  assert.equal(frames.length, 1);
  flushFrames();
  assert.deepEqual(scrolls, [{ top: 205, behavior: "instant" }]);
  assert.equal(scrolled.length, 0);
});

test("panel: no scroll when focus moved elsewhere or the panel was hidden before the frame", () => {
  const { world, b, panel, scrolls, flushFrames, target } = positionSetup(null, [
    rect(548, 592, 20, 200),
  ]);
  world.current = b;
  panel.sync();
  panel.handleFocus(target(rect(102, 134, 20, 200)));
  flushFrames();
  panel.handleFocus(target(rect(600, 644, 20, 200)));
  world.doc.activeElement = {};
  flushFrames();
  assert.equal(scrolls.length, 0);
  panel.handleFocus(target(rect(600, 644, 20, 200)));
  b["analytics-consent"].hidden = true;
  flushFrames();
  assert.equal(scrolls.length, 0);
});

test("panel: the frame remedy falls back to scrollBy(0, delta) when the options form throws, and runs at once without requestAnimationFrame", () => {
  const { world, b, panel, flushFrames, target } = positionSetup(null, [
    rect(548, 592, 20, 200),
  ]);
  world.current = b;
  panel.sync();
  panel.handleFocus(target(rect(102, 134, 20, 200)));
  flushFrames();
  const calls = [];
  world.doc.defaultView.scrollBy = (...args) => {
    calls.push(args);
    if (typeof args[0] === "object") throw new TypeError("unsupported");
  };
  panel.handleFocus(target(rect(600, 644, 20, 200)));
  flushFrames();
  assert.deepEqual(calls, [[{ top: 205, behavior: "instant" }], [0, 205]]);
  calls.length = 0;
  world.doc.defaultView.requestAnimationFrame = undefined;
  panel.handleFocus(target(rect(600, 644, 20, 200)));
  assert.deepEqual(calls, [[{ top: 205, behavior: "instant" }], [0, 205]]);
});

test("focusScrollDelta: bottom panel lifts the hero button above it (NRD-316 QA case)", () => {
  assert.equal(
    focusScrollDelta({
      rect: rect(600, 644, 20, 200),
      panelRect: rect(447, 659, 8, 367),
      position: "bottom",
      headerBottom: 60,
    }),
    205,
  );
});

test("focusScrollDelta: 0 when the element is not obscured", () => {
  assert.equal(
    focusScrollDelta({
      rect: rect(300, 340, 20, 200),
      panelRect: rect(447, 659, 8, 367),
      position: "bottom",
      headerBottom: 60,
    }),
    0,
  );
});

test("focusScrollDelta: top panel moves the element below it", () => {
  assert.equal(
    focusScrollDelta({
      rect: rect(102, 134, 20, 200),
      panelRect: rect(72, 284, 8, 367),
      position: "top",
    }),
    -190,
  );
});

test("focusScrollDelta: an element taller than the clear band aligns its top to the band top", () => {
  assert.equal(
    focusScrollDelta({
      rect: rect(300, 700, 20, 200),
      panelRect: rect(447, 659, 8, 367),
      position: "bottom",
      headerBottom: 60,
    }),
    232,
  );
});

test("NRD-305 sources: the hero actions opt in and the layout reserves scroll-padding-top", async () => {
  const { readFile } = await import("node:fs/promises");
  const hero = await readFile(
    new URL("../src/components/seo-local/SeoLocalHero.astro", import.meta.url),
    "utf8",
  );
  const consent = await readFile(
    new URL("../src/components/AnalyticsConsent.astro", import.meta.url),
    "utf8",
  );
  assert.match(hero, /<div class="hero-actions"[^>]*data-consent-avoid/);
  assert.match(consent, /scroll-padding-top:\s*var\(--consent-offset-top/);
  assert.match(consent, /\[data-position="top"\]/);
});

// NRD-307: the placement is decided once per page view, after the web fonts.
test("consentPanelPosition keeps the CTA uncovered at the NRD-305 viewports with post-font geometry", () => {
  const viewports = [
    { width: 360, height: 640 },
    { width: 375, height: 667 },
    { width: 375, height: 812 },
    { width: 390, height: 844 },
  ];
  for (const { width, height } of viewports) {
    const cta = rect(height - 120, height - 76, 20, 200);
    const panelRect = rect(height - 220, height, 8, width - 8);
    const result = consentPanelPosition({
      panelRect,
      avoidRects: [cta],
      viewportHeight: height,
      headerBottom: 64,
      gap: 8,
    });
    const placed =
      result.position === "top"
        ? {
            ...panelRect,
            top: result.top,
            bottom: result.top + panelRect.height,
          }
        : panelRect;
    assert.equal(isObscured(cta, placed), false, `${width}x${height}`);
  }
});

function fontsSetup(stored, avoid, status = "loading") {
  const ctx = positionSetup(stored, avoid);
  const timers = [];
  let resolveReady;
  const ready = new Promise((resolve) => {
    resolveReady = resolve;
  });
  const layouts = [];
  ctx.world.doc.fonts = { status, ready };
  ctx.world.doc.documentElement.getBoundingClientRect = () => {
    layouts.push("layout");
    return rect(0, 667);
  };
  const view = ctx.world.doc.defaultView;
  view.innerWidth = 375;
  view.setTimeout = (fn, ms) => {
    timers.push({ fn, ms });
    return timers.length;
  };
  view.clearTimeout = () => {};
  return { ...ctx, view, timers, layouts, resolveReady };
}

const COVERED = () => [rect(548, 592, 20, 200)];
const CLEAR = () => [rect(300, 340, 20, 200)];

test("panel: a second sync of the same visible panel keeps the bottom placement after the CTA moves under it", () => {
  const avoid = CLEAR();
  const { world, b, panel, props, styles } = positionSetup(null, avoid);
  world.current = b;
  panel.sync();
  assert.equal(b["analytics-consent"].attrs["data-position"], undefined);
  avoid[0] = rect(548, 592, 20, 200);
  panel.sync();
  assert.equal(b["analytics-consent"].attrs["data-position"], undefined);
  assert.equal(styles.top, undefined);
  assert.equal(props.has("--consent-offset"), true);
});

test("panel: a second sync keeps the top placement after the CTA moves away", () => {
  const avoid = COVERED();
  const { world, b, panel, props, styles } = positionSetup(null, avoid);
  world.current = b;
  panel.sync();
  assert.equal(b["analytics-consent"].attrs["data-position"], "top");
  avoid[0] = rect(300, 340, 20, 200);
  panel.sync();
  assert.equal(b["analytics-consent"].attrs["data-position"], "top");
  assert.equal(styles.top, "72px");
  assert.equal(props.has("--consent-offset"), false);
  assert.equal(props.has("--consent-offset-top"), true);
});

test("panel: the first reveal waits for document.fonts.ready and decides with the post-font geometry", async () => {
  const avoid = CLEAR();
  const { world, b, panel, props, resolveReady } = fontsSetup(null, avoid);
  world.current = b;
  panel.sync();
  assert.equal(b["analytics-consent"].hidden, true);
  assert.equal(props.size, 0);
  avoid[0] = rect(548, 592, 20, 200);
  resolveReady();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(b["analytics-consent"].hidden, false);
  assert.equal(b["analytics-consent"].attrs["data-position"], "top");
  assert.equal(props.has("--consent-offset-top"), true);
});

test("panel: repeated sync while fonts are pending reveals and places once", async () => {
  const { world, b, panel, timers, resolveReady } = fontsSetup(null, COVERED());
  world.current = b;
  let placements = 0;
  const original = b["analytics-consent"].setAttribute;
  b["analytics-consent"].setAttribute = function (name, value) {
    if (name === "data-position") placements += 1;
    return original.call(this, name, value);
  };
  panel.sync();
  panel.sync();
  assert.equal(timers.length, 1);
  resolveReady();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(b["analytics-consent"].hidden, false);
  assert.equal(placements, 1);
});

test("panel: the font wait is capped", async () => {
  const { world, b, panel, timers } = fontsSetup(null, COVERED());
  world.current = b;
  panel.sync();
  assert.equal(b["analytics-consent"].hidden, true);
  assert.equal(timers.length, 1);
  assert.equal(timers[0].ms, 3000);
  timers[0].fn();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(b["analytics-consent"].hidden, false);
});

test("panel: resize that only changes the height keeps the placement; a width change re-places it", () => {
  const avoid = COVERED();
  const { world, b, panel, view } = fontsSetup(null, avoid, "loaded");
  world.current = b;
  panel.sync();
  assert.equal(b["analytics-consent"].attrs["data-position"], "top");
  avoid[0] = rect(300, 340, 20, 200);
  view.innerHeight = 600;
  panel.resize();
  assert.equal(b["analytics-consent"].attrs["data-position"], "top");
  view.innerWidth = 667;
  panel.resize();
  assert.equal(b["analytics-consent"].attrs["data-position"], undefined);
});

test("panel: a swapped panel node (View Transitions) gets a fresh placement", () => {
  const avoid = COVERED();
  const { world, a, b, panel } = fontsSetup(null, avoid, "loaded");
  world.current = a;
  panel.sync();
  assert.equal(a["analytics-consent"].attrs["data-position"], "top");
  avoid[0] = rect(300, 340, 20, 200);
  world.current = b;
  panel.sync();
  assert.equal(b["analytics-consent"].hidden, false);
  assert.equal(b["analytics-consent"].attrs["data-position"], undefined);
});

test("pendingFonts returns null without document.fonts or when status is loaded and forces a layout first", () => {
  assert.equal(pendingFonts({}), null);
  const layouts = [];
  const doc = {
    fonts: { status: "loaded", ready: Promise.resolve() },
    documentElement: { getBoundingClientRect: () => layouts.push(1) },
    defaultView: { setTimeout: () => 1 },
  };
  assert.equal(pendingFonts(doc), null);
  assert.equal(layouts.length, 1);
  const loading = {
    ...doc,
    fonts: { status: "loading", ready: new Promise(() => {}) },
    defaultView: { setTimeout: (fn) => fn() },
  };
  assert.ok(pendingFonts(loading, 5) instanceof Promise);
});

test("AnalyticsConsent.astro routes resize to panel.resize()", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(
    new URL("../src/components/AnalyticsConsent.astro", import.meta.url),
    "utf8",
  );
  assert.match(
    source,
    /addEventListener\("resize",\s*\(\)\s*=>\s*panel\.resize\(\)\)/,
  );
  assert.doesNotMatch(
    source,
    /addEventListener\("resize",\s*\(\)\s*=>\s*panel\.update\(\)\)/,
  );
});
