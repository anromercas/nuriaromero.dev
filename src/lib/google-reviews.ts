// Integración con Google Places API (New) — Place Details.
// Se ejecuta en build time (este sitio es estático, sin SSR): el fetch va
// en el frontmatter de un componente .astro, nunca en el cliente.
//
// Mientras no exista una ficha de Google Business Profile (o no se hayan
// configurado las variables de entorno), esto debe devolver `null` sin
// intentar ninguna petición ni loguear nada: es el estado esperado hoy.
// Si la petición falla por cualquier motivo (red, API key inválida, place
// no encontrado, sin reseñas todavía) también debe devolver `null` y nunca
// romper `astro build`.

export interface GoogleReview {
  /** Nombre visible del autor de la reseña. */
  author: string
  /** URL de la foto de perfil del autor, si Google la expone. */
  authorPhotoUrl?: string
  /** Enlace al perfil de Google Maps del autor, si existe. */
  authorProfileUrl?: string
  /** Valoración de la reseña, de 1 a 5 estrellas. */
  rating: number
  /** Texto de la reseña (ya localizado por la API si hay traducción). */
  text: string
  /** Fecha relativa tal como la formatea Google (p. ej. "hace 2 semanas"). */
  relativeTime: string
}

export interface GoogleReviewsData {
  /** Hasta 5 reseñas, las que devuelve Place Details. */
  reviews: GoogleReview[]
  /** Valoración media agregada del negocio (para AggregateRating en el futuro). */
  rating: number
  /** Número total de valoraciones del negocio (para AggregateRating en el futuro). */
  userRatingCount: number
  /** Place ID usado, útil para enlazar a la ficha pública. */
  placeId: string
}

const PLACE_DETAILS_BASE_URL = "https://places.googleapis.com/v1/places"

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY
  const placeId = import.meta.env.GOOGLE_PLACE_ID

  // Estado esperado hoy: no hay ficha de Google Business Profile todavía,
  // así que no hay credenciales configuradas. No es un error.
  if (!apiKey || !placeId) {
    return null
  }

  try {
    const response = await fetch(`${PLACE_DETAILS_BASE_URL}/${placeId}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews,rating,userRatingCount",
      },
    })

    if (!response.ok) {
      console.warn(
        `[google-reviews] Place Details respondió ${response.status}; se omite la sección de reseñas.`,
      )
      return null
    }

    const data = await response.json()
    const rawReviews = Array.isArray(data?.reviews) ? data.reviews : []

    if (rawReviews.length === 0) {
      // Ficha sin reseñas todavía: estado válido, la sección no debe mostrarse.
      return null
    }

    const reviews: GoogleReview[] = rawReviews.map(
      (review: {
        authorAttribution?: { displayName?: string; photoUri?: string; uri?: string }
        rating?: number
        text?: { text?: string }
        originalText?: { text?: string }
        relativePublishTimeDescription?: string
      }) => ({
        author: review.authorAttribution?.displayName ?? "Cliente de Google",
        authorPhotoUrl: review.authorAttribution?.photoUri,
        authorProfileUrl: review.authorAttribution?.uri,
        rating: typeof review.rating === "number" ? review.rating : 0,
        text: review.text?.text ?? review.originalText?.text ?? "",
        relativeTime: review.relativePublishTimeDescription ?? "",
      }),
    )

    return {
      reviews,
      rating: typeof data?.rating === "number" ? data.rating : 0,
      userRatingCount: typeof data?.userRatingCount === "number" ? data.userRatingCount : 0,
      placeId,
    }
  } catch (error) {
    console.warn("[google-reviews] No se pudieron obtener las reseñas de Google:", error)
    return null
  }
}
