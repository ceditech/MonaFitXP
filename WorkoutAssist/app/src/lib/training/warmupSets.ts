
// Pure warm-up set generation. No React Native imports.

import { roundToQuantum } from './progressiveOverload';
import { DEFAULT_BAR_WEIGHT } from './plateCalculator';

export interface WarmupSet {
    weight: number;
    reps: number;
    pct: number;
}

const RAMP: { pct: number; reps: number }[] = [
    { pct: 0.4, reps: 8 },
    { pct: 0.6, reps: 5 },
    { pct: 0.8, reps: 3 },
];

/**
 * Generate a warm-up ramp (40/60/80%) toward a working weight.
 * Weights are rounded to plate-loadable values and steps below the bar
 * weight are skipped. Returns [] when the working weight itself is too
 * light to need a ramp (≤ bar weight).
 */
export function generateWarmups(
    workingWeight: number,
    barWeight: number = DEFAULT_BAR_WEIGHT,
): WarmupSet[] {
    if (!Number.isFinite(workingWeight) || workingWeight <= barWeight) {
        return [];
    }

    const sets: WarmupSet[] = [];
    for (const step of RAMP) {
        const weight = Math.max(roundToQuantum(workingWeight * step.pct), barWeight);
        if (weight < barWeight) continue;
        // Skip steps that collapse into the working weight or a previous step.
        if (weight >= workingWeight) continue;
        if (sets.length > 0 && sets[sets.length - 1].weight === weight) continue;
        sets.push({ weight, reps: step.reps, pct: step.pct });
    }
    return sets;
}
