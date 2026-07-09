
// Pure progressive-overload suggestion. No React Native imports.

export interface LastSetPerformance {
    weight: number;
    reps: number;
    targetReps: number;
}

export interface OverloadSuggestion {
    weight: number;
    reps: number;
    rationale: 'increase' | 'hold' | 'deload';
}

export interface OverloadOptions {
    /** Weight step for an increase. Default 2.5 (kg). */
    increment?: number;
    /** Rounding quantum for suggested weights. Default 2.5. */
    rounding?: number;
}

/** Round to the nearest multiple of `quantum` (e.g. plate-loadable weights). */
export function roundToQuantum(weight: number, quantum = 2.5): number {
    if (quantum <= 0) return weight;
    return Math.round(weight / quantum) * quantum;
}

/**
 * Suggest the next load for an exercise from its last performance.
 *
 * - All sets hit their target reps → increase weight by `increment`.
 * - Some sets hit target → hold the weight, aim for one more rep.
 * - Two or more sets missed target by ≥2 reps → deload 10% (rounded).
 * - Otherwise → hold.
 *
 * Returns null when there is no usable history.
 */
export function suggestNextLoad(
    lastSets: LastSetPerformance[],
    opts: OverloadOptions = {},
): OverloadSuggestion | null {
    const { increment = 2.5, rounding = 2.5 } = opts;

    const workSets = lastSets.filter(s => s.weight > 0 && s.reps > 0 && s.targetReps > 0);
    if (workSets.length === 0) return null;

    const topWeight = Math.max(...workSets.map(s => s.weight));
    const targetReps = workSets[0].targetReps;

    const allHit = workSets.every(s => s.reps >= s.targetReps);
    const badMisses = workSets.filter(s => s.targetReps - s.reps >= 2).length;

    if (allHit) {
        return {
            weight: roundToQuantum(topWeight + increment, rounding),
            reps: targetReps,
            rationale: 'increase',
        };
    }

    if (badMisses >= 2) {
        return {
            weight: Math.max(roundToQuantum(topWeight * 0.9, rounding), rounding),
            reps: targetReps,
            rationale: 'deload',
        };
    }

    return {
        weight: topWeight,
        reps: targetReps + 1,
        rationale: 'hold',
    };
}
