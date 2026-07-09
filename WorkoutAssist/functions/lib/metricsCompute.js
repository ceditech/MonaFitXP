"use strict";
// functions/src/metricsCompute.ts
//
// Pure, dependency-free metrics computations extracted from the onWorkoutCompleted
// trigger so they can be unit tested and reasoned about in isolation.
// Nothing here touches Firestore, firebase-admin, or the network.
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeBestByExercise = exports.computeWorkoutTotals = exports.computeVolumeHistory = exports.computeStreakDays = exports.previousDayKey = exports.dayKeyInTz = void 0;
/**
 * Format a Date as YYYY-MM-DD in the given IANA timezone.
 * en-CA yields the ISO-style YYYY-MM-DD ordering. Falls back to UTC if the
 * timezone string is invalid so a bad profile value can never throw.
 */
function dayKeyInTz(date, timeZone) {
    const format = (tz) => new Intl.DateTimeFormat('en-CA', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
    try {
        return format(timeZone);
    }
    catch {
        return format('UTC');
    }
}
exports.dayKeyInTz = dayKeyInTz;
/**
 * Given a YYYY-MM-DD key, return the previous calendar day as YYYY-MM-DD.
 * Uses UTC-midnight arithmetic so it is immune to DST shifts.
 */
function previousDayKey(dayKey) {
    const [y, m, d] = dayKey.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() - 1);
    return dt.toISOString().slice(0, 10);
}
exports.previousDayKey = previousDayKey;
/**
 * Current streak = number of consecutive calendar days (in the user's timezone)
 * with at least one completed workout, ending at today or yesterday.
 *
 * The streak is anchored on `todayKey`: if there is no workout today we look back
 * one day (a rest day today should not instantly zero an otherwise-active streak).
 * A gap of more than one day breaks the streak and returns 0.
 */
function computeStreakDays(dayKeys, todayKey) {
    const days = new Set(dayKeys);
    if (days.size === 0)
        return 0;
    let cursor = todayKey;
    if (!days.has(cursor)) {
        cursor = previousDayKey(cursor);
        if (!days.has(cursor))
            return 0; // most recent workout was more than a day ago
    }
    let streak = 0;
    while (days.has(cursor)) {
        streak++;
        cursor = previousDayKey(cursor);
    }
    return streak;
}
exports.computeStreakDays = computeStreakDays;
/**
 * Build per-day volume totals for the last `days` calendar days (in the user's
 * timezone), oldest first, ending at `todayKey`. Days with no workouts report 0.
 */
function computeVolumeHistory(workouts, todayKey, timeZone, days = 7) {
    const byDay = new Map();
    for (const w of workouts) {
        const key = dayKeyInTz(w.endedAt, timeZone);
        byDay.set(key, (byDay.get(key) || 0) + (w.totalVolume || 0));
    }
    const keys = [];
    let cursor = todayKey;
    for (let i = 0; i < days; i++) {
        keys.push(cursor);
        cursor = previousDayKey(cursor);
    }
    keys.reverse(); // oldest -> newest
    return keys.map((date) => ({ date, volume: byDay.get(date) || 0 }));
}
exports.computeVolumeHistory = computeVolumeHistory;
/** Total set count and total volume (weight x reps) for a workout's sets. */
function computeWorkoutTotals(sets) {
    const totalSets = sets.length;
    const totalVolume = sets.reduce((sum, s) => sum + (s.actualWeight || 0) * (s.actualReps || 0), 0);
    return { totalSets, totalVolume };
}
exports.computeWorkoutTotals = computeWorkoutTotals;
/**
 * Best lift per exercise across a set list, ranked by weight then reps.
 * Mirrors the PR-selection rule used when persisting personal records.
 */
function computeBestByExercise(sets) {
    const best = {};
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
exports.computeBestByExercise = computeBestByExercise;
//# sourceMappingURL=metricsCompute.js.map