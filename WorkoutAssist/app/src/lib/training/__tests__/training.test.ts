import { epley1RM, e1RMTimeline, bestE1RM } from '../oneRepMax';
import { suggestNextLoad, roundToQuantum } from '../progressiveOverload';
import { platesFor, DEFAULT_BAR_WEIGHT } from '../plateCalculator';
import { generateWarmups } from '../warmupSets';

describe('epley1RM', () => {
    it('computes the Epley formula', () => {
        expect(epley1RM(100, 5)).toBeCloseTo(116.7, 1);
        expect(epley1RM(60, 10)).toBeCloseTo(80, 1);
    });

    it('returns the weight itself for a single rep', () => {
        expect(epley1RM(140, 1)).toBe(140);
    });

    it('returns 0 for invalid input', () => {
        expect(epley1RM(0, 5)).toBe(0);
        expect(epley1RM(100, 0)).toBe(0);
        expect(epley1RM(-10, 5)).toBe(0);
        expect(epley1RM(NaN, 5)).toBe(0);
    });
});

describe('e1RMTimeline', () => {
    it('keeps the best e1RM per day, sorted ascending', () => {
        const sets = [
            { weight: 100, reps: 5, completedAt: '2026-01-10T10:00:00Z' }, // 116.7
            { weight: 105, reps: 3, completedAt: '2026-01-10T10:20:00Z' }, // 115.5
            { weight: 95, reps: 8, completedAt: '2026-01-03T09:00:00Z' },  // 120.3
        ];
        const timeline = e1RMTimeline(sets);
        expect(timeline).toEqual([
            { date: '2026-01-03', e1rm: 120.3 },
            { date: '2026-01-10', e1rm: 116.7 },
        ]);
    });

    it('skips sets without completedAt or without a valid e1RM', () => {
        const sets = [
            { weight: 100, reps: 5 },
            { weight: 0, reps: 5, completedAt: '2026-01-10T10:00:00Z' },
        ];
        expect(e1RMTimeline(sets)).toEqual([]);
    });
});

describe('bestE1RM', () => {
    it('returns the max e1RM across sets', () => {
        expect(bestE1RM([
            { weight: 100, reps: 5 },
            { weight: 120, reps: 1 },
        ])).toBeCloseTo(120, 1);
    });

    it('returns 0 for no usable sets', () => {
        expect(bestE1RM([])).toBe(0);
    });
});

describe('roundToQuantum', () => {
    it('rounds to the nearest 2.5 by default', () => {
        expect(roundToQuantum(61.3)).toBe(62.5); // above the 61.25 midpoint
        expect(roundToQuantum(61.2)).toBe(60);   // below the midpoint
        expect(roundToQuantum(63.75)).toBe(65);
    });
});

describe('suggestNextLoad', () => {
    const hit = (weight: number, reps = 8) => ({ weight, reps, targetReps: 8 });

    it('suggests +2.5kg when all sets hit target', () => {
        const s = suggestNextLoad([hit(60), hit(60), hit(60)]);
        expect(s).toEqual({ weight: 62.5, reps: 8, rationale: 'increase' });
    });

    it('respects a custom increment', () => {
        const s = suggestNextLoad([hit(100)], { increment: 5 });
        expect(s).toEqual({ weight: 105, reps: 8, rationale: 'increase' });
    });

    it('holds weight and adds a rep on partial success', () => {
        const s = suggestNextLoad([
            { weight: 60, reps: 8, targetReps: 8 },
            { weight: 60, reps: 7, targetReps: 8 },
        ]);
        expect(s).toEqual({ weight: 60, reps: 9, rationale: 'hold' });
    });

    it('deloads 10% when two or more sets miss badly', () => {
        const s = suggestNextLoad([
            { weight: 100, reps: 5, targetReps: 8 },
            { weight: 100, reps: 4, targetReps: 8 },
            { weight: 100, reps: 8, targetReps: 8 },
        ]);
        expect(s).toEqual({ weight: 90, reps: 8, rationale: 'deload' });
    });

    it('rounds deload weights to plate-loadable values', () => {
        const s = suggestNextLoad([
            { weight: 62.5, reps: 4, targetReps: 8 },
            { weight: 62.5, reps: 4, targetReps: 8 },
        ]);
        expect(s!.weight).toBe(57.5); // 56.25 → 57.5
        expect(s!.rationale).toBe('deload');
    });

    it('returns null without usable history', () => {
        expect(suggestNextLoad([])).toBeNull();
        expect(suggestNextLoad([{ weight: 0, reps: 0, targetReps: 8 }])).toBeNull();
    });
});

describe('platesFor', () => {
    it('breaks a standard weight into per-side plates', () => {
        const r = platesFor(100);
        expect(r).not.toBeNull();
        expect(r!.platesPerSide).toEqual([25, 15]);
        expect(r!.achievableWeight).toBe(100);
        expect(r!.remainder).toBe(0);
    });

    it('handles the bar-only case', () => {
        const r = platesFor(20);
        expect(r!.platesPerSide).toEqual([]);
        expect(r!.achievableWeight).toBe(DEFAULT_BAR_WEIGHT);
    });

    it('reports a remainder for unachievable targets', () => {
        const r = platesFor(61, 20, [25, 20, 15, 10, 5, 2.5]);
        // per side 20.5 → 20 + (nothing smaller than 2.5 fits 0.5) → achievable 60
        expect(r!.achievableWeight).toBe(60);
        expect(r!.remainder).toBe(1);
    });

    it('returns null below the bar weight or for invalid input', () => {
        expect(platesFor(15)).toBeNull();
        expect(platesFor(NaN)).toBeNull();
    });

    it('supports custom bars', () => {
        const r = platesFor(65, 15);
        expect(r!.barWeight).toBe(15);
        expect(r!.platesPerSide).toEqual([25]);
    });

    it('avoids floating point drift with small plates', () => {
        const r = platesFor(22.5, 20, [1.25]);
        expect(r!.platesPerSide).toEqual([1.25]);
        expect(r!.remainder).toBe(0);
    });
});

describe('generateWarmups', () => {
    it('generates a 40/60/80% ramp rounded to plates', () => {
        const w = generateWarmups(100);
        expect(w).toEqual([
            { weight: 40, reps: 8, pct: 0.4 },
            { weight: 60, reps: 5, pct: 0.6 },
            { weight: 80, reps: 3, pct: 0.8 },
        ]);
    });

    it('clamps light steps to the bar weight and dedupes', () => {
        const w = generateWarmups(40);
        // 40%→16→bar(20), 60%→24→22.5... check no dupes and all < working weight
        expect(w.length).toBeGreaterThan(0);
        expect(new Set(w.map(s => s.weight)).size).toBe(w.length);
        expect(w.every(s => s.weight >= 20 && s.weight < 40)).toBe(true);
    });

    it('returns [] when the working weight needs no ramp', () => {
        expect(generateWarmups(20)).toEqual([]);
        expect(generateWarmups(15)).toEqual([]);
        expect(generateWarmups(NaN)).toEqual([]);
    });
});
