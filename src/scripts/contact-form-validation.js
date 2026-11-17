// NRD-247: pure validation for the contact form. No side effects on import so
// it can be unit-tested with node and reused by contact-form.js.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @param {{ name?: string, email?: string, message?: string, privacy?: boolean }} values
 * @returns {{ field: 'name' | 'email' | 'message' | 'privacy', message: string }[]}
 *   Errors in form order; empty when everything is valid.
 */
export function validateContactFields({ name, email, message, privacy } = {}) {
  const errors = [];
  const trimmedEmail = (email ?? "").trim();

  if (!(name ?? "").trim()) {
    errors.push({ field: "name", message: "Escribe tu nombre." });
  }
  if (!trimmedEmail) {
    errors.push({ field: "email", message: "Escribe tu correo electrónico." });
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.push({
      field: "email",
      message: "Escribe un correo válido, por ejemplo tu@email.com.",
    });
  }
  if (!(message ?? "").trim()) {
    errors.push({ field: "message", message: "Escribe tu mensaje." });
  }
  if (!privacy) {
    errors.push({
      field: "privacy",
      message: "Acepta la política de privacidad para enviar el mensaje.",
    });
  }
  return errors;
}
