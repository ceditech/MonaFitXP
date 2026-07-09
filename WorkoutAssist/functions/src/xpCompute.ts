
// functions/src/xpCompute.ts
//
// Pure, dependency-free XP / level / badge computations. Mirrors the
// metricsCompute.ts pattern: no Firestore, no firebase-admin, fully unit
// testable. The Firestore trigger orchestrates I/O and calls into these.

export interface XpBreakdown {
    base: number;
    sets: number;
    volume: number;
    prs: number;
    streak: number;
}

export interface XpAward {
    total: number;
    breakdown: XpBreakdown;
}

export interface WorkoutXpInput {
    setCount: number;
    totalVolume: number;
    newPrCount: number;
    streakDays: number;
    /** XP-earning workouts already awarded today (daily-cap tracker). */
    workoutsAwardedToday: number;
}

// --- XP formula constants (documented in the plan) ---
const BASE_XP = 50;
const MAX_BASE_AWARDS_PER_DAY = 2;
const XP_PER_SET = 10;
const MAX_COUNTED_SETS = 40;
const VOLUME_DIVISOR = 100;
const MAX_VOLUME_XP = 50;
const XP_PER_PR = 100;
const MAX_COUNTED_PRS = 3;
const STREAK_XP_PER_DAY = 10;
const MAX_STREAK_DAYS_COUNTED = 7;

/**
 * XP for a newly-completed workout. Once the daily base cap is exhausted the
 * whole award is zero (prevents grinding XP with junk workouts).
 */
export function computeWorkoutXp(input: WorkoutXpInput): XpAward {
    const zero: XpBreakdown = { base: 0, sets: 0, volume: 0, prs: 0, streak: 0 };

    if (input.workoutsAwardedToday >= MAX_BASE_AWARDS_PER_DAY) {
        return { total: 0, breakdown: zero };
    }

    const breakdown: XpBreakdown = {
        base: BASE_XP,
        sets: Math.min(Math.max(input.setCount, 0), MAX_COUNTED_SETS) * XP_PER_SET,
        volume: Math.min(Math.floor(Math.max(input.totalVolume, 0) / VOLUME_DIVISOR), MAX_VOLUME_XP),
        prs: Math.min(Math.max(input.newPrCount, 0), MAX_COUNTED_PRS) * XP_PER_PR,
        streak: Math.min(Math.max(input.streakDays, 0), MAX_STREAK_DAYS_COUNTED) * STREAK_XP_PER_DAY,
    };

    const total = breakdown.base + breakdown.sets + breakdown.volume + breakdown.prs + breakdown.streak;
    return { total, breakdown };
}

// --- Level curve: level = floor((xp/100)^(2/3)) + 1 ---

export function levelFromXp(totalXp: number): number {
    if (!Number.isFinite(totalXp) || totalXp <= 0) return 1;
    // Epsilon guards float error at exact thresholds (e.g. pow(8, 2/3) → 3.999…96).
    return Math.floor(Math.pow(totalXp / 100, 2 / 3) + 1e-9) + 1;
}

/** Total XP required to reach `level` (inverse of levelFromXp). */
export function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.ceil(100 * Math.pow(level - 1, 1.5));
}

/** Progress within the current level, for progress bars. */
export function xpProgressInLevel(totalXp: number): { level: number; current: number; needed: number; ratio: number } {
    const level = levelFromXp(totalXp);
    const floor = xpForLevel(level);
    const ceiling = xpForLevel(level + 1);
    const needed = ceiling - floor;
    const current = Math.max(totalXp - floor, 0);
    return { level, current, needed, ratio: needed > 0 ? Math.min(current / needed, 1) : 1 };
}

// --- Badges ---

export type BadgeId =
    | 'first_workout'
    | 'early_bird'
    | 'night_owl'
    | 'streak_7'
    | 'streak_30'
    | 'consistency_4'
    | 'volume_10k'
    | 'volume_100k'
    | 'pr_hunter'
    | 'century_sets';

export interface BadgeEvaluationState {
    lifetimeWorkouts: number; // AFTER this workout
    lifetimeVolume: number;   // AFTER this workout
    lifetimeSets: number;     // AFTER this workout
    lifetimePrs: number;      // AFTER this workout
    streakDays: number;
    workoutsThisWeek: number;
    /** Hour 0-23 of workout completion in the user's timezone. */
    completionHour: number;
    /** Already-earned badge ids (never re-award). */
    earnedBadgeIds: string[];
}

interface BadgeRule {
    id: BadgeId;
    earned: (s: BadgeEvaluationState) => boolean;
}

const BADGE_RULES: BadgeRule[] = [
    { id: 'first_workout', earned: s => s.lifetimeWorkouts >= 1 },
    { id: 'early_bird', earned: s => s.completionHour < 8 },
    { id: 'night_owl', earned: s => s.completionHour >= 21 },
    { id: 'streak_7', earned: s => s.streakDays >= 7 },
    { id: 'streak_30', earned: s => s.streakDays >= 30 },
    { id: 'consistency_4', earned: s => s.workoutsThisWeek >= 4 },
    { id: 'volume_10k', earned: s => s.lifetimeVolume >= 10_000 },
    { id: 'volume_100k', earned: s => s.lifetimeVolume >= 100_000 },
    { id: 'pr_hunter', earned: s => s.lifetimePrs >= 5 },
    { id: 'century_sets', earned: s => s.lifetimeSets >= 100 },
];

export const ALL_BADGE_IDS: BadgeId[] = BADGE_RULES.map(r => r.id);

/** Newly earned badge ids for this workout (excludes already-earned). */
export function evaluateBadges(state: BadgeEvaluationState): BadgeId[] {
    const earned = new Set(state.earnedBadgeIds);
    return BADGE_RULES
        .filter(rule => !earned.has(rule.id) && rule.earned(state))
        .map(rule => rule.id);
}

/** Hour (0-23) of a Date in an IANA timezone; falls back to UTC. */
export function hourInTz(date: Date, timeZone: string): number {
    const format = (tz: string) =>
        parseInt(
            new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', hour12: false }).format(date),
            10,
        );
    try {
        return format(timeZone) % 24; // en-GB can emit "24" at midnight
    } catch {
        return format('UTC') % 24;
    }
}
