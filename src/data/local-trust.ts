/**
 * Human-owned local-trust registry.
 *
 * Keep empty URLs and proof records until the owner has verified the asset,
 * its public NAP, and the consent/evidence trail for anything published.
 */
import { SITE } from "./site.ts"

export type TrustStatus = "pending-human-approval" | "verified"

export interface SocialProofRecord {
  id: string
  kind: "testimonial" | "case-study" | "review"
  status: TrustStatus
  consentReference: string | null
  evidenceReference: string | null
  publicUrl: string | null
}

const GBP_PLACE_ID = "ChIJ8Uv-vM9f0CoR8J75dj4I0HM"

export const localTrust = {
  gbp: {
    // Verificado 2026-09-25 (teléfono coincide con SITE.phone) y actualizado
    // 2026-10-01: la propietaria confirma que la ficha dejó de ser de zona
    // de servicio y ahora muestra dirección pública. publicAddress debe
    // coincidir exactamente con SITE.address.full (NAP).
    status: "verified" as TrustStatus,
    profileUrl: `https://www.google.com/maps/place/?q=place_id:${GBP_PLACE_ID}` as string | null,
    placeId: GBP_PLACE_ID as string | null,
    // "Write a review" dialog of the verified profile; used by the contact
    // success state and docs/google-review-request-template.md.
    writeReviewUrl: `https://search.google.com/local/writereview?placeid=${GBP_PLACE_ID}` as string | null,
    publicAddress: SITE.address.full as string | null,
    serviceArea: "Sevilla y área metropolitana",
  },
  socialProof: [] as SocialProofRecord[],
} as const
