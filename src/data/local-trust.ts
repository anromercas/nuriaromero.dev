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
    status: "pending-human-approval" as TrustStatus,
    profileUrl: null as string | null,
    placeId: null as string | null,
    publicAddress: null as string | null,
    serviceArea: "Sevilla y área metropolitana",
  },
  socialProof: [] as SocialProofRecord[],
} as const
