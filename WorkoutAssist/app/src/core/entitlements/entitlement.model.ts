
// Canonical entitlement schema.
//
// Source of truth doc: users/{uid}/entitlements/current
// The backend (functions/src/auth.ts) writes { tier: 'free', ... }, and the
// paywall sells three tiers (Free / Plus / Pro), so `tier` is the single field
// all readers agree on. Older docs used a { plan: 'FREE' | 'PRO' } shape; those
// are handled by normalizeEntitlement below for backward compatibility.

export type PlanTier = 'free' | 'plus' | 'pro';
export type EntitlementStatus = 'active' | 'inactive' | 'trialing' | 'past_due';

export interface Entitlement {
    tier: PlanTier;
    status?: EntitlementStatus;
    limits?: {
        workoutsPerMonth?: number;
        aiGenerationsPerMonth?: number;
    };
    updatedAt?: any; // Firestore Timestamp
    source?: 'system' | 'stripe' | 'admin';
}

export const INITIAL_ENTITLEMENT_STATE: Entitlement = {
    tier: 'free',
    status: 'inactive',
};

/**
 * Normalize a raw Firestore document into a canonical Entitlement.
 * Accepts the current { tier } shape and legacy { plan: 'FREE' | 'PRO' } docs,
 * and defends against missing/garbage data by falling back to FREE.
 */
export function normalizeEntitlement(raw: any): Entitlement {
    if (!raw || typeof raw !== 'object') {
        return { ...INITIAL_ENTITLEMENT_STATE };
    }

    let tier: PlanTier;
    if (raw.tier === 'free' || raw.tier === 'plus' || raw.tier === 'pro') {
        tier = raw.tier;
    } else if (typeof raw.plan === 'string') {
        // Legacy mapping: only FREE and PRO ever existed in the old shape.
        tier = raw.plan.toUpperCase() === 'PRO' ? 'pro' : 'free';
    } else {
        tier = 'free';
    }

    return {
        tier,
        status: raw.status,
        limits: raw.limits,
        updatedAt: raw.updatedAt,
        source: raw.source,
    };
}

/**
 * A tier grants access only when its subscription status is usable.
 * A missing status is treated as active so a minimal { tier } doc (as written
 * by the current backend) still unlocks features.
 */
export function isStatusActive(status?: EntitlementStatus): boolean {
    return !status || status === 'active' || status === 'trialing';
}

/** Pro access. */
export function deriveIsPro(e: Entitlement): boolean {
    return e.tier === 'pro' && isStatusActive(e.status);
}

/** Plus access. Pro is a superset of Plus, so Pro users get Plus features too. */
export function deriveIsPlus(e: Entitlement): boolean {
    return (e.tier === 'plus' || e.tier === 'pro') && isStatusActive(e.status);
}

/** Tier ordering for minimum-tier gating. Higher rank grants lower-rank features. */
export const TIER_RANK: Record<PlanTier, number> = { free: 0, plus: 1, pro: 2 };

/** True when `tier` grants access to features requiring `minTier`. */
export function meetsTier(tier: PlanTier, minTier: PlanTier): boolean {
    return TIER_RANK[tier] >= TIER_RANK[minTier];
}

/** The tier a user effectively has: paid tiers only count while the status is usable. */
export function effectiveTier(e: Entitlement): PlanTier {
    return isStatusActive(e.status) ? e.tier : 'free';
}

const TIER_LABELS: Record<PlanTier, string> = {
    free: 'Free',
    plus: 'Plus',
    pro: 'Pro',
};

/** Human-readable tier label for UI display. */
export function tierLabel(tier: PlanTier): string {
    return TIER_LABELS[tier] ?? 'Free';
}
