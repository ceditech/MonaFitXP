import {
    computeWorkoutXp,
    levelFromXp,
    xpForLevel,
    xpProgressInLevel,
    evaluateBadges,
    hourInTz,
    ALL_BADGE_IDS,
    BadgeEvaluationState,
} from '../xpCompute';

describe('computeWorkoutXp', () => {
    const base = { setCount: 12, totalVolume: 3000, newPrCount: 1, streakDays: 3, workoutsAwardedToday: 0 };

    it('computes a typical workout award', () => {
        const award = computeWorkoutXp(base);
        expect(award.breakdown).toEqual({
            base: 50,
            sets: 120,   // 12 * 10
            volume: 30,  // 3000 / 100
            prs: 100,    // 1 * 100
            streak: 30,  // 3 * 10
        });
        expect(award.total).toBe(330);
    });

    it('caps sets at 40, volume at 50, PRs at 3, streak at 7', () => {
        const award = computeWorkoutXp({
            setCount: 100,
            totalVolume: 999999,
            newPrCount: 10,
            streakDays: 30,
            workoutsAwardedToday: 0,
        });
        expect(award.breakdown).toEqual({ base: 50, sets: 400, volume: 50, prs: 300, streak: 70 });
        expect(award.total).toBe(870); // documented max
    });

    it('awards zero once the daily cap is reached', () => {
        expect(computeWorkoutXp({ ...base, workoutsAwardedToday: 2 }).total).toBe(0);
        expect(computeWorkoutXp({ ...base, workoutsAwardedToday: 3 }).total).toBe(0);
    });

    it('still awards for the second workout of the day', () => {
        expect(computeWorkoutXp({ ...base, workoutsAwardedToday: 1 }).total).toBe(330);
    });

    it('clamps negative inputs to zero', () => {
        const award = computeWorkoutXp({
            setCount: -5, totalVolume: -100, newPrCount: -1, streakDays: -2, workoutsAwardedToday: 0,
        });
        expect(award.total).toBe(50); // base only
    });
});

describe('level curve', () => {
    it('matches the documented thresholds', () => {
        expect(xpForLevel(1)).toBe(0);
        expect(xpForLevel(2)).toBe(100);
        expect(xpForLevel(3)).toBe(283);
        expect(xpForLevel(5)).toBe(800);
        expect(xpForLevel(10)).toBe(2700);
    });

    it('levelFromXp inverts xpForLevel at boundaries', () => {
        for (let level = 2; level <= 30; level++) {
            const xp = xpForLevel(level);
            expect(levelFromXp(xp)).toBe(level);
            expect(levelFromXp(xp - 1)).toBe(level - 1);
        }
    });

    it('is monotonically non-decreasing', () => {
        let prev = levelFromXp(0);
        for (let xp = 0; xp <= 20000; xp += 137) {
            const level = levelFromXp(xp);
            expect(level).toBeGreaterThanOrEqual(prev);
            prev = level;
        }
    });

    it('handles zero and invalid xp', () => {
        expect(levelFromXp(0)).toBe(1);
        expect(levelFromXp(-50)).toBe(1);
        expect(levelFromXp(NaN)).toBe(1);
    });

    it('xpProgressInLevel reports sensible progress', () => {
        const p = xpProgressInLevel(150); // level 2 spans 100..283
        expect(p.level).toBe(2);
        expect(p.current).toBe(50);
        expect(p.needed).toBe(183);
        expect(p.ratio).toBeCloseTo(50 / 183, 5);
    });
});

describe('evaluateBadges', () => {
    const baseState: BadgeEvaluationState = {
        lifetimeWorkouts: 1,
        lifetimeVolume: 500,
        lifetimeSets: 10,
        lifetimePrs: 1,
        streakDays: 1,
        workoutsThisWeek: 1,
        completionHour: 12,
        earnedBadgeIds: [],
    };

    it('awards first_workout on the first workout', () => {
        expect(evaluateBadges(baseState)).toEqual(['first_workout']);
    });

    it('never re-awards earned badges', () => {
        expect(evaluateBadges({ ...baseState, earnedBadgeIds: ['first_workout'] })).toEqual([]);
    });

    it('awards time-of-day badges', () => {
        expect(evaluateBadges({ ...baseState, completionHour: 6, earnedBadgeIds: ['first_workout'] }))
            .toEqual(['early_bird']);
        expect(evaluateBadges({ ...baseState, completionHour: 22, earnedBadgeIds: ['first_workout'] }))
            .toEqual(['night_owl']);
        expect(evaluateBadges({ ...baseState, completionHour: 8, earnedBadgeIds: ['first_workout'] }))
            .toEqual([]); // 8am is not early_bird
    });

    it('awards streak, consistency, volume, pr and set-count badges at thresholds', () => {
        const state: BadgeEvaluationState = {
            lifetimeWorkouts: 50,
            lifetimeVolume: 100_000,
            lifetimeSets: 100,
            lifetimePrs: 5,
            streakDays: 30,
            workoutsThisWeek: 4,
            completionHour: 12,
            earnedBadgeIds: ['first_workout'],
        };
        expect(evaluateBadges(state).sort()).toEqual([
            'century_sets', 'consistency_4', 'pr_hunter',
            'streak_30', 'streak_7', 'volume_100k', 'volume_10k',
        ]);
    });

    it('can award every badge exactly once across a lifetime', () => {
        const everything: BadgeEvaluationState = {
            lifetimeWorkouts: 100,
            lifetimeVolume: 200_000,
            lifetimeSets: 500,
            lifetimePrs: 20,
            streakDays: 40,
            workoutsThisWeek: 6,
            completionHour: 6,
            earnedBadgeIds: [],
        };
        const first = evaluateBadges(everything);
        // night_owl unreachable in the same workout as early_bird
        expect(first.sort()).toEqual(ALL_BADGE_IDS.filter(id => id !== 'night_owl').sort());
        expect(evaluateBadges({ ...everything, earnedBadgeIds: first })).toEqual([]);
    });
});

describe('hourInTz', () => {
    it('returns the hour in the given timezone', () => {
        const instant = new Date('2026-01-02T03:30:00Z');
        expect(hourInTz(instant, 'UTC')).toBe(3);
        expect(hourInTz(instant, 'America/New_York')).toBe(22); // previous evening
        expect(hourInTz(instant, 'Asia/Tokyo')).toBe(12);
    });

    it('normalizes midnight and falls back to UTC on bad tz', () => {
        const midnight = new Date('2026-01-02T00:00:00Z');
        expect(hourInTz(midnight, 'UTC')).toBe(0);
        expect(hourInTz(midnight, 'Not/AZone')).toBe(0);
    });
});
