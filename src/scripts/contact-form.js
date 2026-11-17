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
import { validateContactFields } from './contact-form-validation.js';

function initContactForm() {
  const ENDPOINT = 'https://formspree.io/f/mdklbyaz';

  const form = document.getElementById('contact-form');

  // El listener queda enganchado a astro:page-load, que dispara en cada
  // navegación del sitio, no solo en /contacto/. Que el formulario no esté
  // presente en la página actual es la situación normal en el resto de
  // páginas, así que salimos en silencio (sin warning) en ese caso.
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  // NRD-247: errors go to a role="alert" region; #form-status stays polite.
  const errorEl = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');
  // Optional: only rendered when the GBP is verified (see ContactForm.astro).
  const reviewInvite = document.getElementById('form-review-invite');

  if (!statusEl || !errorEl || !submitBtn) {
    console.warn('[ContactForm] Elementos no encontrados en el DOM.');
    return;
  }

  function setStatus(msg, type = 'info') {
    statusEl.textContent = msg;
    statusEl.classList.remove('text-red-600','text-green-600','text-gray-300');
    if (type === 'success') statusEl.classList.add('text-green-600');
    else if (type === 'error') statusEl.classList.add('text-red-600');
    else statusEl.classList.add('text-gray-300');
  }

  function setError(msg) {
    errorEl.textContent = msg;
  }

  const FIELDS = ['name', 'email', 'message', 'privacy'];

  function clearFieldError(field) {
    const control = document.getElementById(field);
    const errorP = document.getElementById(`${field}-error`);
    if (control) control.removeAttribute('aria-invalid');
    if (errorP) {
      errorP.textContent = '';
      errorP.hidden = true;
    }
  }

  function showFieldError(field, message) {
    const control = document.getElementById(field);
    const errorP = document.getElementById(`${field}-error`);
    if (control) control.setAttribute('aria-invalid', 'true');
    if (errorP) {
      errorP.textContent = `Error: ${message}`;
      errorP.hidden = false;
    }
  }

  function readValues() {
    const data = new FormData(form);
    return {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
      privacy: form.elements.privacy?.checked === true,
    };
  }

  // Correcting a field clears its own error straight away.
  for (const field of FIELDS) {
    const control = document.getElementById(field);
    if (!control) continue;
    control.addEventListener('input', () => clearFieldError(field));
    control.addEventListener('change', () => clearFieldError(field));
  }

  function setReviewInvite(visible) {
    if (reviewInvite) reviewInvite.hidden = !visible;
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

    const errors = validateContactFields(readValues());
    const invalid = new Map(errors.map((e) => [e.field, e.message]));
    for (const field of FIELDS) {
      if (invalid.has(field)) showFieldError(field, invalid.get(field));
      else clearFieldError(field);
    }
    if (errors.length) {
      setReviewInvite(false);
      setStatus('');
      setError('Revisa los campos marcados.');
      document.getElementById(errors[0].field)?.focus();
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent || 'Enviar mensaje';
    submitBtn.textContent = 'Enviando…';
    setStatus('');
    setError('');
    setReviewInvite(false);

    try {
      let res;
      try { res = await postFormData(); }
      catch { res = await postJSON(); }

      if (res.ok) {
        setStatus('✅ ¡Mensaje enviado correctamente! Te responderé en breve.', 'success');
        setReviewInvite(true);
        form.reset();
        document.dispatchEvent(new CustomEvent('site:analytics', { detail: { name: 'form_submit', params: { placement: 'contact_form' } } }));
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
        setReviewInvite(false);
        setError(msg);
      }
    } catch (err) {
      console.error('[ContactForm] Error de red/JS:', err);
      setReviewInvite(false);
      setError('⚠️ Error de conexión. Inténtalo de nuevo en unos minutos.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

document.addEventListener('astro:page-load', initContactForm);
