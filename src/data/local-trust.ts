/**
 * Human-owned local-trust registry.
 *
 * Keep empty URLs and proof records until the owner has verified the asset,
 * its public NAP, and the consent/evidence trail for anything published.
 */
export type TrustStatus = "pending-human-approval" | "verified"

export interface SocialProofRecord {
  id: string
  kind: "testimonial" | "case-study" | "review"
  status: TrustStatus
  consentReference: string | null
  evidenceReference: string | null
  publicUrl: string | null
}

export const localTrust = {
  gbp: {
    // Verificado 2026-09-25: confirmado por la propietaria y contrastado
    // contra la ficha pública (vista "Gestionas este Perfil de Empresa",
    // teléfono coincide con SITE.phone). Negocio de zona de servicio, sin
    // dirección pública — publicAddress se mantiene en null a propósito.
    status: "verified" as TrustStatus,
    profileUrl: "https://www.google.com/maps/place/?q=place_id:ChIJ8Uv-vM9f0CoR8J75dj4I0HM" as string | null,
    placeId: "ChIJ8Uv-vM9f0CoR8J75dj4I0HM" as string | null,
    publicAddress: null as string | null,
    serviceArea: "Sevilla y área metropolitana",
  },
  socialProof: [] as SocialProofRecord[],
} as const
