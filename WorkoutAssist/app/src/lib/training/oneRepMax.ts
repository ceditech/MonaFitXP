
// Pure 1-rep-max estimation. No React Native imports.

export interface PerformedSet {
    weight: number;
    reps: number;
    completedAt?: string; // ISO date-time
}

export interface E1RMPoint {
    date: string; // YYYY-MM-DD
    e1rm: number;
}

/**
 * Epley estimated 1RM: weight * (1 + reps / 30).
 * reps === 1 returns the weight itself; invalid inputs return 0.
 */
export function epley1RM(weight: number, reps: number): number {
    if (!Number.isFinite(weight) || !Number.isFinite(reps)) return 0;
    if (weight <= 0 || reps <= 0) return 0;
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * Best estimated 1RM per calendar day (from the set's completedAt date part),
 * sorted ascending by date. Sets without completedAt or with no valid e1RM are skipped.
 */
export function e1RMTimeline(sets: PerformedSet[]): E1RMPoint[] {
    const bestByDay = new Map<string, number>();
    for (const s of sets) {
        if (!s.completedAt) continue;
        const e1rm = epley1RM(s.weight, s.reps);
        if (e1rm <= 0) continue;
        const date = s.completedAt.slice(0, 10);
        if (!bestByDay.has(date) || e1rm > bestByDay.get(date)!) {
            bestByDay.set(date, e1rm);
        }
    }
    return [...bestByDay.entries()]
        .map(([date, e1rm]) => ({ date, e1rm }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

/** The single best e1RM across a set list, or 0 when none qualify. */
export function bestE1RM(sets: PerformedSet[]): number {
    return sets.reduce((best, s) => Math.max(best, epley1RM(s.weight, s.reps)), 0);
}
