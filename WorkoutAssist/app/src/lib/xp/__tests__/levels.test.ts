import { levelFromXp, xpForLevel, xpProgressInLevel, BADGE_DEFS } from '../levels';

describe('client level curve (must match server xpCompute)', () => {
    it('matches the documented thresholds', () => {
        expect(xpForLevel(1)).toBe(0);
        expect(xpForLevel(2)).toBe(100);
        expect(xpForLevel(3)).toBe(283);
        expect(xpForLevel(5)).toBe(800);
        expect(xpForLevel(10)).toBe(2700);
    });

    it('inverts at boundaries (incl. float-sensitive exact thresholds)', () => {
        for (let level = 2; level <= 30; level++) {
            const xp = xpForLevel(level);
            expect(levelFromXp(xp)).toBe(level);
            expect(levelFromXp(xp - 1)).toBe(level - 1);
        }
    });

    it('handles zero/invalid xp as level 1', () => {
        expect(levelFromXp(0)).toBe(1);
        expect(levelFromXp(-1)).toBe(1);
        expect(levelFromXp(NaN)).toBe(1);
    });

    it('xpProgressInLevel yields a ratio in [0,1]', () => {
        for (const xp of [0, 50, 100, 283, 799, 800, 2699, 2700, 10000]) {
            const p = xpProgressInLevel(xp);
            expect(p.ratio).toBeGreaterThanOrEqual(0);
            expect(p.ratio).toBeLessThanOrEqual(1);
            expect(p.current).toBeLessThanOrEqual(p.needed);
        }
    });
});

describe('BADGE_DEFS', () => {
    it('defines all 10 server badge ids exactly once', () => {
        const ids = BADGE_DEFS.map(b => b.id);
        expect(new Set(ids).size).toBe(ids.length);
        expect(ids.sort()).toEqual([
            'century_sets', 'consistency_4', 'early_bird', 'first_workout',
            'night_owl', 'pr_hunter', 'streak_30', 'streak_7',
            'volume_100k', 'volume_10k',
        ]);
    });
});
