import { PlanTemplate, UserProfile } from '../../data/contracts/IWorkoutRepository';
import { PlanTier } from '../../core/entitlements/entitlement.model';

/**
 * Picks the starting plan template for a user finishing onboarding.
 *
 * Replaces the original one-liner:
 *
 *     templates.find(t => t.id.toLowerCase().includes(formData.goal || '')) || templates[0]
 *
 * which never matched anything — template ids are `tpl_001`..`tpl_004` and contain
 * no goal string — so every user silently received `templates[0]` ("Full Body
 * Foundation") no matter what they picked. The goal question was decorative.
 *
 * Two things to know about the fix:
 *
 * 1. `PlanTemplate` has no goal taxonomy today, so goal genuinely cannot drive the
 *    choice. `goal` is declared optional on the contract and scored highest when
 *    present, so seeding it later starts working with no change here. Until then
 *    we rank on the fields that DO exist: difficulty, daysPerWeek, equipment.
 *
 * 2. Premium templates are filtered out for free users. The old code was
 *    accidentally safe (it always returned the free `templates[0]`); any fix that
 *    makes matching actually work would otherwise hand a free user `tpl_002` or
 *    `tpl_004` and auto-activate a paid plan.
 */

const EXPERIENCE_TO_DIFFICULTY: Record<
    NonNullable<UserProfile['experience']>,
    PlanTemplate['difficulty']
> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
};

export type SelectionReason =
    | 'scored'          // a template was ranked and chosen
    | 'no-templates'    // the catalog was empty
    | 'none-eligible';  // every template was gated behind a tier the user lacks

export interface TemplateSelection {
    template: PlanTemplate | null;
    reason: SelectionReason;
    /** Populated for 'scored'; useful for logging why this plan was chosen. */
    score?: number;
}

/** Free users may only be auto-assigned non-premium templates. */
function isEligible(template: PlanTemplate, tier: PlanTier): boolean {
    return !template.isPremium || tier === 'plus' || tier === 'pro';
}

function scoreTemplate(template: PlanTemplate, profile: Partial<UserProfile>): number {
    let score = 0;

    // Goal — strongest signal, but only once templates actually carry it.
    if (template.goal && profile.goal && template.goal === profile.goal) {
        score += 8;
    }

    // Experience -> difficulty.
    if (profile.experience && EXPERIENCE_TO_DIFFICULTY[profile.experience] === template.difficulty) {
        score += 4;
    }

    // Schedule fit. An exact match is worth more than "close enough", and a
    // template demanding more days than the user committed to is penalised —
    // an unachievable plan is worse than a slightly easy one.
    if (typeof profile.daysPerWeek === 'number') {
        const delta = template.daysPerWeek - profile.daysPerWeek;
        if (delta === 0) score += 3;
        else if (delta < 0) score += 1;           // fewer days than available: fine
        else if (delta === 1) score += 0;         // one extra day: neutral
        else score -= 2;                          // materially more than committed
    }

    // Equipment: fraction of the template's requirements the user actually has.
    // Templates listing gear the user lacks are a dead end on day one.
    if (profile.equipment?.length && template.equipment?.length) {
        const owned = new Set(profile.equipment.map(e => e.toLowerCase()));
        const met = template.equipment.filter(e => owned.has(e.toLowerCase())).length;
        score += 3 * (met / template.equipment.length);
    }

    return score;
}

export function selectPlanTemplate(
    templates: PlanTemplate[],
    profile: Partial<UserProfile>,
    tier: PlanTier,
): TemplateSelection {
    if (!templates?.length) {
        return { template: null, reason: 'no-templates' };
    }

    const eligible = templates.filter(t => isEligible(t, tier));
    if (!eligible.length) {
        return { template: null, reason: 'none-eligible' };
    }

    // Stable: ties resolve to the earlier template, so the same answers always
    // produce the same plan.
    let best = eligible[0];
    let bestScore = scoreTemplate(best, profile);

    for (const candidate of eligible.slice(1)) {
        const candidateScore = scoreTemplate(candidate, profile);
        if (candidateScore > bestScore) {
            best = candidate;
            bestScore = candidateScore;
        }
    }

    return { template: best, reason: 'scored', score: bestScore };
}
