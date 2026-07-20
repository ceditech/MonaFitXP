/**
 * Feature flags — launch-readiness gating for surfaces that exist in the UI
 * but are not functional yet. A stubbed screen reads as "broken" to a real
 * user; a flagged-off screen simply doesn't exist until it's real.
 *
 * Deliberately a plain constant object for now: no async fetch, no provider,
 * no loading state. When Firebase Remote Config lands (production-readiness
 * phase), swap the values here for RC-backed getters — every call site
 * already goes through this module, so nothing else changes.
 */
export const Flags = {
    /**
     * AI Coach tab. The screen is a static placeholder (no chat, no logic) —
     * hidden until a real experience ships. Flipping this to true restores
     * the tab, its icon, and the Pro gate exactly as before.
     */
    aiCoachEnabled: false,

    /**
     * Payments / upgrade flow. There is no payment provider integrated yet,
     * so upgrade CTAs would dead-end. While false, the paywall presents
     * tiers as "coming at launch" (beta = everything free) instead of
     * showing purchase buttons that go nowhere.
     */
    paymentsEnabled: false,
} as const;

export type FlagName = keyof typeof Flags;
