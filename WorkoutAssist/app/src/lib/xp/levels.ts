
// Display-only level math — MUST stay in sync with functions/src/xpCompute.ts.
// The server (metrics/gamification doc) is the source of truth; these helpers
// only render progress bars and labels from server-provided totals.

export function levelFromXp(totalXp: number): number {
    if (!Number.isFinite(totalXp) || totalXp <= 0) return 1;
    // Epsilon guards float error at exact thresholds (matches server).
    return Math.floor(Math.pow(totalXp / 100, 2 / 3) + 1e-9) + 1;
}

export function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.ceil(100 * Math.pow(level - 1, 1.5));
}

export function xpProgressInLevel(totalXp: number): { level: number; current: number; needed: number; ratio: number } {
    const level = levelFromXp(totalXp);
    const floor = xpForLevel(level);
    const ceiling = xpForLevel(level + 1);
    const needed = ceiling - floor;
    const current = Math.max(totalXp - floor, 0);
    return { level, current, needed, ratio: needed > 0 ? Math.min(current / needed, 1) : 1 };
}

export interface BadgeDef {
    id: string;
    name: string;
    description: string;
    /** Ionicons icon name. */
    icon: string;
}

export const BADGE_DEFS: BadgeDef[] = [
    { id: 'first_workout', name: 'First Rep', description: 'Complete your first workout', icon: 'rocket' },
    { id: 'early_bird', name: 'Early Bird', description: 'Finish a workout before 8am', icon: 'sunny' },
    { id: 'night_owl', name: 'Night Owl', description: 'Finish a workout after 9pm', icon: 'moon' },
    { id: 'streak_7', name: 'On Fire', description: '7-day workout streak', icon: 'flame' },
    { id: 'streak_30', name: 'Unstoppable', description: '30-day workout streak', icon: 'bonfire' },
    { id: 'consistency_4', name: 'Consistent', description: '4 workouts in one week', icon: 'calendar' },
    { id: 'volume_10k', name: 'Ton Lifter', description: '10,000kg lifetime volume', icon: 'barbell' },
    { id: 'volume_100k', name: 'Mountain Mover', description: '100,000kg lifetime volume', icon: 'trophy' },
    { id: 'pr_hunter', name: 'PR Hunter', description: 'Set 5 personal records', icon: 'trending-up' },
    { id: 'century_sets', name: 'Century Club', description: 'Log 100 lifetime sets', icon: 'medal' },
];
