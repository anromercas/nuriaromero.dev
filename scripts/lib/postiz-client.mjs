// HTTP adapter for the Postiz public API (self-hosted: https://<domain>/api/public/v1).
// Docs: https://docs.postiz.com/public-api/introduction.md. Auth: the API key as the raw Authorization header.
// Rate limit: the docs state 30 requests per hour for the public API, so every call is made once, never retried;
// a failure carries the HTTP status and the caller decides. The key never appears in an error message.

export const DEFAULT_POSTIZ_URL = "https://postiz.nuriaromero.dev";

export class PostizError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = "PostizError";
    this.status = status;
  }
}

export function redact(text, secret) {
  const s = String(text ?? "");
  return secret ? s.split(secret).join("[redacted]") : s;
}

export function createPostizClient({
  baseUrl = DEFAULT_POSTIZ_URL,
  apiKey,
  fetch = globalThis.fetch,
}) {
  if (!apiKey)
    throw new PostizError(
      "Postiz API key is missing (POSTIZ_API_KEY or Keychain item postiz-api-key)",
    );
  const root = `${baseUrl.replace(/\/+$/, "")}/api/public/v1`;

  async function call(method, path, { body, json } = {}) {
    const headers = { Authorization: apiKey };
    if (json !== undefined) headers["Content-Type"] = "application/json";
    let res;
    try {
      res = await fetch(`${root}${path}`, {
        method,
        headers,
        body: json !== undefined ? JSON.stringify(json) : body,
      });
    } catch (error) {
      throw new PostizError(
        redact(`${method} ${path} failed: ${error.message}`, apiKey),
      );
    }
    const text = await res.text();
    if (!res.ok)
      throw new PostizError(
        redact(
          `${method} ${path} failed with HTTP ${res.status}: ${text.slice(0, 300)}`,
          apiKey,
        ),
        res.status,
      );
    try {
      return JSON.parse(text);
    } catch {
      throw new PostizError(
        `${method} ${path} returned a body that is not JSON`,
        res.status,
      );
    }
  }

  return {
    listIntegrations: () => call("GET", "/integrations"),
    upload: ({ name, bytes, type }) => {
      const form = new FormData();
      form.append("file", new Blob([bytes], { type }), name);
      return call("POST", "/upload", { body: form });
    },
    createPost: (payload) => call("POST", "/posts", { json: payload }),
  };
}
