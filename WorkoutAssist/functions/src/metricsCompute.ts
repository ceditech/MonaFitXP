
// functions/src/metricsCompute.ts
//
// Pure, dependency-free metrics computations extracted from the onWorkoutCompleted
// trigger so they can be unit tested and reasoned about in isolation.
// Nothing here touches Firestore, firebase-admin, or the network.

/** A completed workout reduced to the fields the metrics summary needs. */
export interface CompletedWorkoutInput {
  endedAt: Date;
  totalVolume: number;
}

/** A single logged set, reduced to the fields totals/PRs need. */
export interface WorkoutSetInput {
  exerciseId: string;
  actualWeight?: number;
  actualReps?: number;
}

export interface VolumeHistoryPoint {
  date: string; // YYYY-MM-DD in the user's timezone
  volume: number;
}

export interface BestLift {
  weight: number;
  reps: number;
}

/**
 * Format a Date as YYYY-MM-DD in the given IANA timezone.
 * en-CA yields the ISO-style YYYY-MM-DD ordering. Falls back to UTC if the
 * timezone string is invalid so a bad profile value can never throw.
 */
export function dayKeyInTz(date: Date, timeZone: string): string {
  const format = (tz: string) =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);

  try {
    return format(timeZone);
  } catch {
    return format('UTC');
  }
}

/**
 * Given a YYYY-MM-DD key, return the previous calendar day as YYYY-MM-DD.
 * Uses UTC-midnight arithmetic so it is immune to DST shifts.
 */
export function previousDayKey(dayKey: string): string {
  const [y, m, d] = dayKey.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
}

/**
 * Current streak = number of consecutive calendar days (in the user's timezone)
 * with at least one completed workout, ending at today or yesterday.
 *
 * The streak is anchored on `todayKey`: if there is no workout today we look back
 * one day (a rest day today should not instantly zero an otherwise-active streak).
 * A gap of more than one day breaks the streak and returns 0.
 */
export function computeStreakDays(dayKeys: string[], todayKey: string): number {
  const days = new Set(dayKeys);
  if (days.size === 0) return 0;

  let cursor = todayKey;
  if (!days.has(cursor)) {
    cursor = previousDayKey(cursor);
    if (!days.has(cursor)) return 0; // most recent workout was more than a day ago
  }

  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor = previousDayKey(cursor);
  }
  return streak;
}

/**
 * Build per-day volume totals for the last `days` calendar days (in the user's
 * timezone), oldest first, ending at `todayKey`. Days with no workouts report 0.
 */
export function computeVolumeHistory(
  workouts: CompletedWorkoutInput[],
  todayKey: string,
  timeZone: string,
  days = 7,
): VolumeHistoryPoint[] {
  const byDay = new Map<string, number>();
  for (const w of workouts) {
    const key = dayKeyInTz(w.endedAt, timeZone);
    byDay.set(key, (byDay.get(key) || 0) + (w.totalVolume || 0));
  }

  const keys: string[] = [];
  let cursor = todayKey;
  for (let i = 0; i < days; i++) {
    keys.push(cursor);
    cursor = previousDayKey(cursor);
  }
  keys.reverse(); // oldest -> newest

  return keys.map((date) => ({ date, volume: byDay.get(date) || 0 }));
}

/** Total set count and total volume (weight x reps) for a workout's sets. */
export function computeWorkoutTotals(sets: WorkoutSetInput[]): {
  totalSets: number;
  totalVolume: number;
} {
  const totalSets = sets.length;
  const totalVolume = sets.reduce(
    (sum, s) => sum + (s.actualWeight || 0) * (s.actualReps || 0),
    0,
  );
  return { totalSets, totalVolume };
}

/**
 * Best lift per exercise across a set list, ranked by weight then reps.
 * Mirrors the PR-selection rule used when persisting personal records.
 */
export function computeBestByExercise(sets: WorkoutSetInput[]): Record<string, BestLift> {
  const best: Record<string, BestLift> = {};
  for (const s of sets) {
    const weight = s.actualWeight || 0;
    const reps = s.actualReps || 0;
    const cur = best[s.exerciseId];
    if (!cur || weight > cur.weight || (weight === cur.weight && reps > cur.reps)) {
      best[s.exerciseId] = { weight, reps };
    }
  }
  return best;
}
