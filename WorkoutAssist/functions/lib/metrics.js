"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onWorkoutCompleted = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const metricsCompute_1 = require("./metricsCompute");
const xpCompute_1 = require("./xpCompute");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.onWorkoutCompleted = functions.firestore
    .document('users/{uid}/workouts/{workoutId}')
    .onWrite(async (change, context) => {
    const { uid, workoutId } = context.params;
    const newData = change.after.data();
    const oldData = change.before.data();
    console.log(`[Audit] onWorkoutCompleted Start | User: ${uid} | Workout: ${workoutId} | Trigger: ${change.before.exists ? 'Update' : 'Create'}`);
    if (!newData) {
        console.log(`[Audit] Workout deleted, skipping metrics. | Workout: ${workoutId}`);
        return null;
    }
    // Condition: Transition to "completed" OR Creation as "completed"
    const isNewlyCompleted = newData.status === 'completed' && (!oldData || oldData.status !== 'completed');
    if (!isNewlyCompleted) {
        console.log(`[Audit] Workout state not "newly completed", skipping. | Status: ${newData.status}`);
        return null;
    }
    console.log(`[Audit] Computing metrics... | Workout: ${workoutId}`);
    try {
        // 1. Fetch Workout Sets
        const setsSnapshot = await db.collection('users').doc(uid)
            .collection('workouts').doc(workoutId)
            .collection('sets').get();
        const sets = setsSnapshot.docs.map(doc => doc.data());
        // Resolve the user's timezone for day-bucketed metrics (streak, volume history).
        // Falls back to UTC so a missing/invalid profile can never break metrics.
        let timeZone = 'UTC';
        try {
            const profileSnap = await db.collection('users').doc(uid).get();
            const tz = profileSnap.data()?.timezone;
            if (typeof tz === 'string' && tz.length > 0) {
                timeZone = tz;
            }
        }
        catch (tzError) {
            console.warn(`[Audit] Could not read timezone, defaulting to UTC | User: ${uid} | Error:`, tzError);
        }
        // 2. Basic Computations
        const { totalSets, totalVolume } = (0, metricsCompute_1.computeWorkoutTotals)(sets);
        const startedAt = newData.startedAt?.toDate() || new Date();
        const endedAt = newData.endedAt?.toDate() || new Date();
        const durationSeconds = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);
        // 3. Update summary in the workout document itself (redundancy/verification)
        await change.after.ref.update({
            'summary.totalSets': totalSets,
            'summary.totalVolume': totalVolume,
            'summary.durationSeconds': durationSeconds,
            'summary.computedAt': admin.firestore.FieldValue.serverTimestamp()
        });
        // 4. Update Personal Records (PRs), counting new ones for XP
        const bestByExercise = (0, metricsCompute_1.computeBestByExercise)(sets);
        let newPrCount = 0;
        for (const [exId, best] of Object.entries(bestByExercise)) {
            const prRef = db.collection('users').doc(uid).collection('stats').doc('prs').collection('exercises').doc(exId);
            const wasNewPr = await db.runTransaction(async (t) => {
                const prSnap = await t.get(prRef);
                let shouldUpdate = true;
                if (prSnap.exists) {
                    const current = prSnap.data();
                    if (best.weight < current.bestWeight || (best.weight === current.bestWeight && best.reps <= current.bestReps)) {
                        shouldUpdate = false;
                    }
                }
                if (shouldUpdate) {
                    t.set(prRef, {
                        exerciseId: exId,
                        bestWeight: best.weight,
                        bestReps: best.reps,
                        achievedAt: admin.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                }
                return shouldUpdate;
            });
            if (wasNewPr)
                newPrCount++;
        }
        // 5. Aggregate Metrics (Incremental or Recent Scan)
        // For MVP, we scan recent workouts (limit 50) to compute streak and weekly volume
        const recentWorkoutsSnap = await db.collection('users').doc(uid)
            .collection('workouts')
            .where('status', '==', 'completed')
            .orderBy('endedAt', 'desc')
            .limit(50)
            .get();
        const recentWorkouts = recentWorkoutsSnap.docs.map(d => d.data());
        // Normalize workouts to plain {endedAt, totalVolume} for the pure helpers.
        const now = new Date();
        const completedWorkouts = recentWorkouts.map(w => ({
            endedAt: w.endedAt?.toDate() || now,
            totalVolume: w.summary?.totalVolume || 0,
        }));
        // Weekly window: rolling last 7 days. Compared as absolute instants, so this is
        // timezone-independent and correct regardless of the user's locale.
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weeklyWorkouts = completedWorkouts.filter(w => w.endedAt >= oneWeekAgo);
        const weeklyVolume = weeklyWorkouts.reduce((sum, w) => sum + w.totalVolume, 0);
        // Streak: consecutive calendar days (in the user's timezone) ending today/yesterday.
        const todayKey = (0, metricsCompute_1.dayKeyInTz)(now, timeZone);
        const workoutDayKeys = completedWorkouts.map(w => (0, metricsCompute_1.dayKeyInTz)(w.endedAt, timeZone));
        const streakDays = (0, metricsCompute_1.computeStreakDays)(workoutDayKeys, todayKey);
        // Volume History (last 7 days, timezone-aware) for chart.
        const volumeHistory = (0, metricsCompute_1.computeVolumeHistory)(completedWorkouts, todayKey, timeZone, 7);
        // 6. Write final metrics summary
        await db.collection('users').doc(uid).collection('metrics').doc('summary').set({
            streakDays,
            workoutsThisWeek: weeklyWorkouts.length,
            weeklyVolume,
            volumeHistory,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log(`[Audit] Metrics summary updated successfully. | User: ${uid}`);
        // 7. Gamification (XP / levels / badges) — server-authoritative.
        // Own try/catch: an XP failure must never break metrics.
        try {
            await awardWorkoutXp({
                uid,
                workoutId,
                setCount: totalSets,
                totalVolume,
                newPrCount,
                streakDays,
                workoutsThisWeek: weeklyWorkouts.length,
                endedAt,
                timeZone,
                todayKey,
            });
        }
        catch (xpError) {
            console.error(`[Audit] FAILED to award XP (metrics unaffected) | User: ${uid} | Workout: ${workoutId} | Error:`, xpError);
        }
    }
    catch (error) {
        console.error(`[Audit] FAILED to compute metrics | User: ${uid} | Workout: ${workoutId} | Error:`, error);
    }
    return null;
});
/** Max workout ids kept for retry-idempotency. */
const AWARDED_IDS_KEPT = 30;
/**
 * Transactionally update users/{uid}/metrics/gamification for a completed
 * workout: XP (with daily cap + idempotency), lifetime counters, level, badges.
 * The doc lives under metrics/ so existing rules already deny client writes.
 */
async function awardWorkoutXp(params) {
    const { uid, workoutId } = params;
    const gamificationRef = db.collection('users').doc(uid).collection('metrics').doc('gamification');
    await db.runTransaction(async (t) => {
        const snap = await t.get(gamificationRef);
        const state = snap.exists ? snap.data() : {};
        const awardedIds = state.xpAwardedWorkoutIds || [];
        if (awardedIds.includes(workoutId)) {
            console.log(`[Audit] XP already awarded for workout, skipping. | Workout: ${workoutId}`);
            return;
        }
        // Daily cap tracker rolls over with the (timezone-aware) day key.
        const dayXpCount = state.dayXpCount?.dayKey === params.todayKey
            ? state.dayXpCount.count
            : 0;
        const award = (0, xpCompute_1.computeWorkoutXp)({
            setCount: params.setCount,
            totalVolume: params.totalVolume,
            newPrCount: params.newPrCount,
            streakDays: params.streakDays,
            workoutsAwardedToday: dayXpCount,
        });
        const totalXp = (state.totalXp || 0) + award.total;
        const lifetimeWorkouts = (state.lifetimeWorkouts || 0) + 1;
        const lifetimeVolume = (state.lifetimeVolume || 0) + params.totalVolume;
        const lifetimeSets = (state.lifetimeSets || 0) + params.setCount;
        const lifetimePrs = (state.lifetimePrs || 0) + params.newPrCount;
        const newBadgeIds = (0, xpCompute_1.evaluateBadges)({
            lifetimeWorkouts,
            lifetimeVolume,
            lifetimeSets,
            lifetimePrs,
            streakDays: params.streakDays,
            workoutsThisWeek: params.workoutsThisWeek,
            completionHour: (0, xpCompute_1.hourInTz)(params.endedAt, params.timeZone),
            earnedBadgeIds: Object.keys(state.badges || {}),
        });
        const badges = { ...(state.badges || {}) };
        for (const id of newBadgeIds) {
            badges[id] = { earnedAt: admin.firestore.FieldValue.serverTimestamp() };
        }
        t.set(gamificationRef, {
            totalXp,
            level: (0, xpCompute_1.levelFromXp)(totalXp),
            lifetimeWorkouts,
            lifetimeVolume,
            lifetimeSets,
            lifetimePrs,
            badges,
            lastAward: {
                workoutId,
                xp: award.total,
                breakdown: award.breakdown,
                newBadgeIds,
                at: admin.firestore.FieldValue.serverTimestamp(),
            },
            xpAwardedWorkoutIds: [...awardedIds, workoutId].slice(-AWARDED_IDS_KEPT),
            dayXpCount: {
                dayKey: params.todayKey,
                count: dayXpCount + (award.total > 0 ? 1 : 0),
            },
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        console.log(`[Audit] XP awarded | User: ${uid} | Workout: ${workoutId} | XP: ${award.total} | Badges: ${newBadgeIds.join(',') || 'none'}`);
    });
}
//# sourceMappingURL=metrics.js.map