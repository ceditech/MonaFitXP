import { selectPlanTemplate } from '../selectPlanTemplate';
import { PlanTemplate, UserProfile } from '../../../data/contracts/IWorkoutRepository';

// Mirrors the seeded catalog (app/src/data/mocks/planTemplates.json) — including
// the fact that tpl_002 and tpl_004 are premium, which is what makes the
// entitlement filtering below load-bearing.
const TEMPLATES: PlanTemplate[] = [
    {
        id: 'tpl_001', name: 'Full Body Foundation', difficulty: 'Beginner',
        daysPerWeek: 3, isPremium: false, shortDescription: '',
        equipment: ['Dumbbells', 'Bench'], blocks: [],
    },
    {
        id: 'tpl_002', name: 'Upper Body Power', difficulty: 'Intermediate',
        daysPerWeek: 4, isPremium: true, shortDescription: '',
        equipment: ['Barbell', 'Rack'], blocks: [],
    },
    {
        id: 'tpl_003', name: 'Leg Day Protocol', difficulty: 'Intermediate',
        daysPerWeek: 3, isPremium: false, shortDescription: '',
        equipment: ['Barbell', 'Leg Press'], blocks: [],
    },
    {
        id: 'tpl_004', name: 'Elite Hypertrophy', difficulty: 'Advanced',
        daysPerWeek: 5, isPremium: true, shortDescription: '',
        equipment: ['Full Gym'], blocks: [],
    },
];

const profile = (over: Partial<UserProfile> = {}): Partial<UserProfile> => ({
    goal: 'hypertrophy',
    experience: 'intermediate',
    daysPerWeek: 3,
    equipment: ['Barbell', 'Leg Press'],
    ...over,
});

describe('selectPlanTemplate', () => {
    describe('entitlement gating', () => {
        it('never assigns a premium template to a free user', () => {
            // An advanced user whose answers point squarely at tpl_004.
            const { template } = selectPlanTemplate(
                TEMPLATES,
                profile({ experience: 'advanced', daysPerWeek: 5, equipment: ['Full Gym'] }),
                'free',
            );
            expect(template!.isPremium).toBe(false);
            expect(template!.id).not.toBe('tpl_004');
        });

        it.each(['plus', 'pro'] as const)('allows premium templates for %s', tier => {
            const { template } = selectPlanTemplate(
                TEMPLATES,
                profile({ experience: 'advanced', daysPerWeek: 5, equipment: ['Full Gym'] }),
                tier,
            );
            expect(template!.id).toBe('tpl_004');
        });

        it('reports none-eligible when every template is premium and user is free', () => {
            const premiumOnly = TEMPLATES.filter(t => t.isPremium);
            const { template, reason } = selectPlanTemplate(premiumOnly, profile(), 'free');
            expect(template).toBeNull();
            expect(reason).toBe('none-eligible');
        });
    });

    describe('ranking', () => {
        it('regression: does not always return the first template', () => {
            // The original `id.includes(goal)` matcher never matched, so every
            // user silently got tpl_001. This user's answers point at tpl_003.
            const { template } = selectPlanTemplate(TEMPLATES, profile(), 'free');
            expect(template!.id).toBe('tpl_003');
        });

        it('matches difficulty to experience', () => {
            const { template } = selectPlanTemplate(
                TEMPLATES,
                profile({ experience: 'beginner', equipment: ['Dumbbells', 'Bench'] }),
                'free',
            );
            expect(template!.difficulty).toBe('Beginner');
        });

        it('prefers goal when templates carry one', () => {
            const tagged = TEMPLATES.map(t =>
                t.id === 'tpl_001' ? { ...t, goal: 'hypertrophy' as const } : t,
            );
            // Answers otherwise favour tpl_003; the goal tag should outweigh them.
            const { template } = selectPlanTemplate(tagged, profile(), 'free');
            expect(template!.id).toBe('tpl_001');
        });

        it('penalises templates demanding more days than committed', () => {
            const { template } = selectPlanTemplate(
                TEMPLATES,
                profile({ experience: undefined, equipment: undefined, daysPerWeek: 3 }),
                'free',
            );
            expect(template!.daysPerWeek).toBeLessThanOrEqual(3);
        });

        it('is deterministic: equal scores resolve to the earlier template', () => {
            const twins: PlanTemplate[] = [
                { ...TEMPLATES[0], id: 'a' },
                { ...TEMPLATES[0], id: 'b' },
            ];
            expect(selectPlanTemplate(twins, profile(), 'free').template!.id).toBe('a');
        });
    });

    describe('degenerate input', () => {
        it('reports no-templates for an empty catalog', () => {
            const { template, reason } = selectPlanTemplate([], profile(), 'free');
            expect(template).toBeNull();
            expect(reason).toBe('no-templates');
        });

        it('still returns a template when the profile is empty', () => {
            const { template, reason } = selectPlanTemplate(TEMPLATES, {}, 'free');
            expect(template).not.toBeNull();
            expect(reason).toBe('scored');
        });
    });
});
