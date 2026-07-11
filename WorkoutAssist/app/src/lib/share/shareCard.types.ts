
// Shared types + pure view-model mapper for the shareable workout card.

import { InProgressWorkout, GamificationState } from '../../data/contracts/IWorkoutRepository';

export interface ShareCardData {
    workoutName: string;
    dateLabel: string;      // e.g. "Jul 8, 2026"
    durationLabel: string;  // "45:12"
    totalSets: number;
    totalVolume: number;
    bestSetLabel: string | null; // "100kg × 8" or null
    xpGained: number | null;
    level: number | null;
    streakDays: number | null;
}

interface BuildInputs {
    workout: InProgressWorkout;
    summary: { durationDisplay: string; totalSets: number; totalVolume: number } | null;
    gamification?: GamificationState | null;
    streakDays?: number | null;
    now?: Date;
}

/**
 * Pure mapper: workout + summary + gamification → share-card view model.
 * Kept free of RN imports so it's unit-testable and reusable by the
 * native (view-shot) and web (canvas) renderers.
 */
export function buildShareCardData({ workout, summary, gamification, streakDays, now = new Date() }: BuildInputs): ShareCardData {
    // Best set = highest volume completed set.
    let bestSetLabel: string | null = null;
    let bestVolume = 0;
    for (const set of workout.sets || []) {
        if (!set.completedAt) continue;
        const volume = (set.actualWeight || 0) * (set.actualReps || 0);
        if (volume > bestVolume) {
            bestVolume = volume;
            bestSetLabel = `${set.actualWeight}kg × ${set.actualReps}`;
        }
    }

    const award = gamification?.lastAward;
    const awardMatches = award?.workoutId === workout.id;

    return {
        workoutName: workout.name || 'Workout',
        dateLabel: now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        durationLabel: summary?.durationDisplay || '0:00',
        totalSets: summary?.totalSets || 0,
        totalVolume: summary?.totalVolume || 0,
        bestSetLabel,
        xpGained: awardMatches ? award!.xp : null,
        level: gamification?.level ?? null,
        streakDays: streakDays ?? null,
    };
}
