/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  // Google Places API (New) — Place Details. Opcionales: mientras no exista
  // ficha de Google Business Profile, se dejan sin configurar y la sección
  // de reseñas no se muestra. Ver .env.example.
  readonly GOOGLE_PLACES_API_KEY?: string
  readonly GOOGLE_PLACE_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
