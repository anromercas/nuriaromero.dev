// SEO-27: extraído de ContactForm.astro (era `<script is:inline>`) para
// eliminar 'unsafe-inline' de script-src en la CSP. Comportamiento idéntico.
//
// Fix incluido en esta misma migración: el script original declaraba
// `const ENDPOINT`/`const form`/... en el top level del <script is:inline>.
// Al navegar repetidamente a /contacto/ mediante Astro View Transitions, el
// nuevo <script> insertado en el DOM se ejecutaba en el mismo scope global
// clásico, provocando `Uncaught SyntaxError: Identifier 'ENDPOINT' has
// already been declared`. Envolver toda la lógica en una función con su
// propio scope (como ya hacían WhatsAppButton y Header) y engancharla
// exclusivamente a `astro:page-load` (que también dispara en la carga
// inicial, igual que en WhatsAppButton) elimina la redeclaración de raíz y
// además reengancha el listener de submit al nuevo nodo #contact-form tras
// cada navegación (el formulario no usa transition:persist).
function initContactForm() {
  const ENDPOINT = 'https://formspree.io/f/mdklbyaz';

  const form = document.getElementById('contact-form');

  // El listener queda enganchado a astro:page-load, que dispara en cada
  // navegación del sitio, no solo en /contacto/. Que el formulario no esté
  // presente en la página actual es la situación normal en el resto de
  // páginas, así que salimos en silencio (sin warning) en ese caso.
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (!statusEl || !submitBtn) {
    console.warn('[ContactForm] Elementos no encontrados en el DOM.');
    return;
  }

  function setStatus(msg, type = 'info') {
    statusEl.textContent = msg;
    statusEl.classList.remove('text-red-600','text-green-600','text-gray-600','dark:text-gray-300');
    if (type === 'success') statusEl.classList.add('text-green-600');
    else if (type === 'error') statusEl.classList.add('text-red-600');
    else statusEl.classList.add('text-gray-600','dark:text-gray-300');
  }

  async function postFormData() {
    const data = new FormData(form);
    return fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
  }

  async function postJSON() {
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    if (submitBtn.disabled) return;

    if (!form.checkValidity()) {
      setStatus('Por favor, completa los campos requeridos.', 'error');
      if (form.reportValidity) form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent || 'Enviar mensaje';
    submitBtn.textContent = 'Enviando…';
    setStatus('');

    try {
      let res;
      try { res = await postFormData(); }
      catch { res = await postJSON(); }

      if (res.ok) {
        setStatus('✅ ¡Mensaje enviado correctamente! Te responderé en breve.', 'success');
        form.reset();
      } else {
        let msg = `❌ Error ${res.status}`;
        try {
          const json = await res.json();
          if (Array.isArray(json?.errors) && json.errors.length) {
            msg += ' · ' + json.errors.map((e) => e?.message || '').join(' ');
          } else if (json?.message) {
            msg += ' · ' + json.message;
          }
        } catch {
          const text = await res.text().catch(() => '');
          if (text) msg += ' · ' + text.slice(0, 200);
        }
        setStatus(msg, 'error');
      }
    } catch (err) {
      console.error('[ContactForm] Error de red/JS:', err);
      setStatus('⚠️ Error de conexión. Inténtalo de nuevo en unos minutos.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

document.addEventListener('astro:page-load', initContactForm);
