
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

export const onWorkoutCompleted = functions.firestore
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

            // 2. Basic Computations
            const totalSets = sets.length;
            const totalVolume = sets.reduce((sum, s) => sum + ((s.actualWeight || 0) * (s.actualReps || 0)), 0);

            const startedAt = (newData.startedAt as admin.firestore.Timestamp)?.toDate() || new Date();
            const endedAt = (newData.endedAt as admin.firestore.Timestamp)?.toDate() || new Date();
            const durationSeconds = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);

            // 3. Update summary in the workout document itself (redundancy/verification)
            await change.after.ref.update({
                'summary.totalSets': totalSets,
                'summary.totalVolume': totalVolume,
                'summary.durationSeconds': durationSeconds,
                'summary.computedAt': admin.firestore.FieldValue.serverTimestamp()
            });

            // 4. Update Personal Records (PRs)
            const bestByExercise: Record<string, { weight: number, reps: number }> = {};
            sets.forEach(s => {
                const weight = s.actualWeight || 0;
                const reps = s.actualReps || 0;
                if (!bestByExercise[s.exerciseId] || weight > bestByExercise[s.exerciseId].weight || (weight === bestByExercise[s.exerciseId].weight && reps > bestByExercise[s.exerciseId].reps)) {
                    bestByExercise[s.exerciseId] = { weight, reps };
                }
            });

            for (const [exId, best] of Object.entries(bestByExercise)) {
                const prRef = db.collection('users').doc(uid).collection('stats').doc('prs').collection('exercises').doc(exId);
                await db.runTransaction(async (t) => {
                    const prSnap = await t.get(prRef);
                    let shouldUpdate = true;
                    if (prSnap.exists) {
                        const current = prSnap.data()!;
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
                });
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

            // Weekly boundaries (UTC for MVP)
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            const weeklyWorkouts = recentWorkouts.filter(w => (w.endedAt?.toDate() || 0) >= oneWeekAgo);
            const weeklyVolume = weeklyWorkouts.reduce((sum, w) => sum + (w.summary?.totalVolume || 0), 0);

            // Streak (unique days)
            const uniqueDaysSet = new Set(recentWorkouts.map(w => {
                const d = w.endedAt?.toDate() || new Date();
                return d.toISOString().split('T')[0];
            }));

            // Volume History (Last 7 Days) for chart
            const volumeHistory: { date: string, volume: number }[] = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];

                const dayVolume = recentWorkouts.reduce((sum, w) => {
                    const wDate = (w.endedAt?.toDate() || new Date()).toISOString().split('T')[0];
                    return wDate === dateStr ? sum + (w.summary?.totalVolume || 0) : sum;
                }, 0);

                volumeHistory.push({ date: dateStr, volume: dayVolume });
            }

            // 6. Write final metrics summary
            await db.collection('users').doc(uid).collection('metrics').doc('summary').set({
                streakDays: uniqueDaysSet.size,
                workoutsThisWeek: weeklyWorkouts.length,
                weeklyVolume,
                volumeHistory,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log(`[Audit] Metrics summary updated successfully. | User: ${uid}`);

        } catch (error) {
            console.error(`[Audit] FAILED to compute metrics | User: ${uid} | Workout: ${workoutId} | Error:`, error);
        }

        return null;
    });
