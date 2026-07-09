import {
    normalizeEntitlement,
    deriveIsPro,
    deriveIsPlus,
    isStatusActive,
    tierLabel,
    meetsTier,
    effectiveTier,
    TIER_RANK,
    INITIAL_ENTITLEMENT_STATE,
    PlanTier,
} from '../entitlement.model';

describe('normalizeEntitlement', () => {
    it('passes through a canonical tier doc', () => {
        expect(normalizeEntitlement({ tier: 'plus', status: 'active' })).toMatchObject({
            tier: 'plus',
            status: 'active',
        });
    });

    it('maps a legacy { plan: "PRO" } doc to tier "pro"', () => {
        expect(normalizeEntitlement({ plan: 'PRO' }).tier).toBe('pro');
    });

    it('maps a legacy { plan: "FREE" } doc to tier "free"', () => {
        expect(normalizeEntitlement({ plan: 'FREE' }).tier).toBe('free');
    });

    it('falls back to FREE for null / garbage / unknown tier', () => {
        expect(normalizeEntitlement(null)).toEqual(INITIAL_ENTITLEMENT_STATE);
        expect(normalizeEntitlement(undefined)).toEqual(INITIAL_ENTITLEMENT_STATE);
        expect(normalizeEntitlement({ tier: 'platinum' }).tier).toBe('free');
    });
});

describe('isStatusActive', () => {
    it('treats a missing status as active (minimal backend doc)', () => {
        expect(isStatusActive(undefined)).toBe(true);
    });

    it('is active for active and trialing', () => {
        expect(isStatusActive('active')).toBe(true);
        expect(isStatusActive('trialing')).toBe(true);
    });

    it('is inactive for inactive and past_due', () => {
        expect(isStatusActive('inactive')).toBe(false);
        expect(isStatusActive('past_due')).toBe(false);
    });
});

describe('deriveIsPro', () => {
    it('is true for an active pro tier', () => {
        expect(deriveIsPro({ tier: 'pro', status: 'active' })).toBe(true);
    });

    it('is true for a pro tier with no status (backend minimal doc)', () => {
        expect(deriveIsPro({ tier: 'pro' })).toBe(true);
    });

    it('is false for a past_due pro tier', () => {
        expect(deriveIsPro({ tier: 'pro', status: 'past_due' })).toBe(false);
    });

    it('is false for plus and free tiers', () => {
        expect(deriveIsPro({ tier: 'plus', status: 'active' })).toBe(false);
        expect(deriveIsPro({ tier: 'free' })).toBe(false);
    });
});

describe('deriveIsPlus', () => {
    it('is true for an active plus tier', () => {
        expect(deriveIsPlus({ tier: 'plus', status: 'active' })).toBe(true);
    });

    it('is true for pro tier (pro is a superset of plus)', () => {
        expect(deriveIsPlus({ tier: 'pro', status: 'active' })).toBe(true);
    });

    it('is false for free tier', () => {
        expect(deriveIsPlus({ tier: 'free' })).toBe(false);
    });

    it('is false for a past_due plus tier', () => {
        expect(deriveIsPlus({ tier: 'plus', status: 'past_due' })).toBe(false);
    });
});

describe('meetsTier', () => {
    const tiers: PlanTier[] = ['free', 'plus', 'pro'];

    it('grants access when tier rank >= minTier rank (full matrix)', () => {
        for (const tier of tiers) {
            for (const minTier of tiers) {
                expect(meetsTier(tier, minTier)).toBe(TIER_RANK[tier] >= TIER_RANK[minTier]);
            }
        }
    });

    it('pro satisfies plus requirements', () => {
        expect(meetsTier('pro', 'plus')).toBe(true);
    });

    it('plus does not satisfy pro requirements', () => {
        expect(meetsTier('plus', 'pro')).toBe(false);
    });

    it('every tier satisfies free', () => {
        expect(meetsTier('free', 'free')).toBe(true);
        expect(meetsTier('plus', 'free')).toBe(true);
        expect(meetsTier('pro', 'free')).toBe(true);
    });
});

describe('effectiveTier', () => {
    it('returns the tier while status is usable', () => {
        expect(effectiveTier({ tier: 'pro', status: 'active' })).toBe('pro');
        expect(effectiveTier({ tier: 'plus', status: 'trialing' })).toBe('plus');
        expect(effectiveTier({ tier: 'pro' })).toBe('pro'); // minimal backend doc
    });

    it('demotes paid tiers to free when the subscription lapses', () => {
        expect(effectiveTier({ tier: 'pro', status: 'past_due' })).toBe('free');
        expect(effectiveTier({ tier: 'plus', status: 'inactive' })).toBe('free');
    });
});

describe('tierLabel', () => {
    it('renders human-readable labels', () => {
        expect(tierLabel('free')).toBe('Free');
        expect(tierLabel('plus')).toBe('Plus');
        expect(tierLabel('pro')).toBe('Pro');
    });
});
