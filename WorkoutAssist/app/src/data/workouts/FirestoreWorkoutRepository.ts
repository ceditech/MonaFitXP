
// app/src/data/workouts/FirestoreWorkoutRepository.ts

import {
    IWorkoutRepository,
    Exercise,
    PlanTemplate,
    UserProfile,
    WorkoutLog,
    UserPlan,
    InProgressWorkout,
    WorkoutSessionSet,
    UserMetrics,
    PersonalRecord
} from '../contracts/IWorkoutRepository';
import { db } from '../../firebase/firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    addDoc,
    runTransaction,
    Timestamp
} from 'firebase/firestore';

export class FirestoreWorkoutRepository implements IWorkoutRepository {

    // --- Catalogs ---

    async getExercises(): Promise<Exercise[]> {
        const q = query(collection(db, 'exerciseCatalog'), limit(100));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise));
    }

    async getExercise(id: string): Promise<Exercise | null> {
        const docRef = doc(db, 'exerciseCatalog', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Exercise;
        }
        return null;
    }

    async getPlanTemplates(): Promise<PlanTemplate[]> {
        const q = query(collection(db, 'planTemplates'), limit(100));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PlanTemplate));
    }

    async getPlanTemplate(id: string): Promise<PlanTemplate | null> {
        const docRef = doc(db, 'planTemplates', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as PlanTemplate;
        }
        return null;
    }

    // --- User Data ---

    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as any;
        }
        return null;
    }

    async saveUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
        const docRef = doc(db, 'users', uid);
        const data = {
            ...profile,
            updatedAt: serverTimestamp(),
        };

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            (data as any).createdAt = serverTimestamp();
            (data as any).onboardingCompleted = profile.onboardingCompleted ?? false;
            await setDoc(docRef, data);
        } else {
            await updateDoc(docRef, data);
        }
    }

    // --- Plans ---

    async getActivePlan(uid: string): Promise<UserPlan | null> {
        const userDocRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userDocRef);

        if (!userSnap.exists()) return null;

        const userData = userSnap.data();
        const activePlanId = userData.activePlanId;

        if (!activePlanId) return null;

        const planRef = doc(db, 'users', uid, 'plans', activePlanId);
        const planSnap = await getDoc(planRef);

        if (planSnap.exists()) {
            const planData = { id: planSnap.id, ...planSnap.data() } as UserPlan;

            if (planData.templateId) {
                const template = await this.getPlanTemplate(planData.templateId);
                if (template) {
                    return {
                        ...planData,
                        ...template,
                        id: planData.id
                    } as any;
                }
            }
            return planData;
        }

        return null;
    }

    async createUserPlan(uid: string, plan: Omit<UserPlan, 'id'>): Promise<string> {
        const plansCollection = collection(db, 'users', uid, 'plans');
        const planData = {
            ...plan,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(plansCollection, planData);
        return docRef.id;
    }

    async activatePlan(uid: string, planId: string): Promise<void> {
        const userRef = doc(db, 'users', uid);
        const planRef = doc(db, 'users', uid, 'plans', planId);

        await runTransaction(db, async (transaction) => {
            const userSnap = await transaction.get(userRef);
            if (!userSnap.exists()) throw new Error("User document does not exist");

            transaction.update(userRef, {
                activePlanId: planId,
                updatedAt: serverTimestamp()
            });

            transaction.update(planRef, {
                active: true,
                updatedAt: serverTimestamp()
            });
        });
    }

    async saveActivePlan(uid: string, plan: any): Promise<void> {
        if (!plan.id) return;
        const planRef = doc(db, 'users', uid, 'plans', plan.id);
        await updateDoc(planRef, {
            ...plan,
            updatedAt: serverTimestamp()
        });
    }

    // --- Workout Execution ---

    async startWorkout(uid: string, workout: Omit<InProgressWorkout, 'id'>): Promise<string> {
        const workoutsCollection = collection(db, 'users', uid, 'workouts');
        const { sets, ...workoutMeta } = workout;

        const workoutData = {
            ...workoutMeta,
            status: 'in_progress',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            startedAt: serverTimestamp(), // Ensure startedAt is set
        };

        const docRef = await addDoc(workoutsCollection, workoutData);

        if (sets && sets.length > 0) {
            for (const set of sets) {
                await this.logSet(uid, docRef.id, set);
            }
        }

        return docRef.id;
    }

    async getInProgressWorkout(uid: string): Promise<InProgressWorkout | null> {
        const workoutsRef = collection(db, 'users', uid, 'workouts');
        const q = query(workoutsRef, where('status', '==', 'in_progress'), limit(5));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return null;

        const docs = [...snapshot.docs].sort((a, b) => {
            const dataA = a.data();
            const dataB = b.data();
            const dateA = this._parseDate(dataA.startedAt).getTime();
            const dateB = this._parseDate(dataB.startedAt).getTime();
            return dateB - dateA;
        });

        const workoutDoc = docs[0];
        const workoutData = workoutDoc.data();

        const setsSnapshot = await getDocs(collection(db, 'users', uid, 'workouts', workoutDoc.id, 'sets'));
        const sets = setsSnapshot.docs.map(d => d.data() as WorkoutSessionSet);

        return {
            id: workoutDoc.id,
            ...workoutData,
            sets
        } as InProgressWorkout;
    }

    async updateInProgressWorkout(uid: string, workout: InProgressWorkout): Promise<void> {
        const workoutRef = doc(db, 'users', uid, 'workouts', workout.id);
        await updateDoc(workoutRef, {
            ...workout,
            updatedAt: serverTimestamp()
        });
    }

    async logSet(uid: string, workoutId: string, set: WorkoutSessionSet): Promise<void> {
        const setDocId = `${set.exerciseId}_${set.setIndex}`;
        const setRef = doc(db, 'users', uid, 'workouts', workoutId, 'sets', setDocId);

        await setDoc(setRef, {
            ...set,
            updatedAt: serverTimestamp(),
        }, { merge: true });

        await updateDoc(doc(db, 'users', uid, 'workouts', workoutId), {
            updatedAt: serverTimestamp()
        });
    }

    async updateWorkoutCursor(uid: string, workoutId: string, cursor: { exerciseIndex: number; setIndex: number }): Promise<void> {
        const workoutRef = doc(db, 'users', uid, 'workouts', workoutId);
        await updateDoc(workoutRef, {
            cursor,
            updatedAt: serverTimestamp()
        });
    }

    async completeWorkout(uid: string, workoutId: string): Promise<void> {
        console.log('[FirestoreRepo] completeWorkout started for id:', workoutId);
        const workoutRef = doc(db, 'users', uid, 'workouts', workoutId);
        const setsRef = collection(db, 'users', uid, 'workouts', workoutId, 'sets');

        const setsSnap = await getDocs(setsRef);
        const sets = setsSnap.docs.map(d => d.data() as WorkoutSessionSet);
        console.log('[FirestoreRepo] Fetched sets for completion:', sets.length);

        const bestByExercise: Record<string, { weight: number, reps: number }> = {};
        sets.forEach(s => {
            if (!s.completedAt) return;
            const weight = s.actualWeight || 0;
            const reps = s.actualReps || 0;
            const currentBest = bestByExercise[s.exerciseId];
            if (!currentBest || weight > currentBest.weight || (weight === currentBest.weight && reps > currentBest.reps)) {
                bestByExercise[s.exerciseId] = { weight, reps };
            }
        });

        const exerciseIds = Object.keys(bestByExercise);

        await runTransaction(db, async (transaction) => {
            const workoutSnap = await transaction.get(workoutRef);
            if (!workoutSnap.exists()) throw new Error("Workout not found");

            const prSnaps: Record<string, any> = {};
            for (const exId of exerciseIds) {
                const prRef = doc(db, 'users', uid, 'stats', 'prs', 'exercises', exId);
                prSnaps[exId] = await transaction.get(prRef);
            }

            const totalSets = sets.length;
            const totalVolume = sets.reduce((sum, s) => sum + ((s.actualWeight || 0) * (s.actualReps || 0)), 0);

            const workoutData = workoutSnap.data();
            const startedAt = this._parseDate(workoutData.startedAt);
            const endedAt = new Date();
            const durationSeconds = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);

            transaction.update(workoutRef, {
                status: 'completed',
                endedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                summary: {
                    totalSets,
                    totalVolume,
                    durationSeconds
                }
            });

            for (const exId of exerciseIds) {
                const best = bestByExercise[exId];
                const prSnap = prSnaps[exId];
                const prRef = doc(db, 'users', uid, 'stats', 'prs', 'exercises', exId);

                let shouldUpdate = true;
                if (prSnap.exists()) {
                    const current = prSnap.data();
                    const currentWeight = current.bestWeight || 0;
                    const currentReps = current.bestReps || 0;
                    if (best.weight < currentWeight || (best.weight === currentWeight && best.reps <= currentReps)) {
                        shouldUpdate = false;
                    }
                }

                if (shouldUpdate) {
                    transaction.set(prRef, {
                        exerciseId: exId,
                        bestWeight: best.weight,
                        bestReps: best.reps,
                        achievedAt: serverTimestamp()
                    }, { merge: true });
                }
            }
        });
        console.log('[FirestoreRepo] completeWorkout finished');
    }

    async abandonWorkout(uid: string, workoutId: string): Promise<void> {
        const workoutRef = doc(db, 'users', uid, 'workouts', workoutId);
        await updateDoc(workoutRef, {
            status: 'abandoned',
            updatedAt: serverTimestamp()
        });
    }

    // --- History ---

    async getHistory(uid: string): Promise<WorkoutLog[]> {
        const workoutsRef = collection(db, 'users', uid, 'workouts');
        const q = query(workoutsRef, where('status', '==', 'completed'), limit(100));
        const snapshot = await getDocs(q);

        const logs = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            const summary = data.summary || {};
            const date = this._parseDate(data.endedAt || data.startedAt);

            return {
                id: docSnap.id,
                date: date.toISOString(),
                templateId: data.planId,
                durationSeconds: summary.durationSeconds || 0,
                totalVolume: summary.totalVolume || 0
            } as WorkoutLog;
        });

        return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    async listWorkouts(uid: string, options?: { status?: string; limit?: number }): Promise<InProgressWorkout[]> {
        const workoutsRef = collection(db, 'users', uid, 'workouts');
        let q = query(workoutsRef);

        if (options?.status) {
            q = query(workoutsRef, where('status', '==', options.status));
        }

        q = query(q, limit(options?.limit || 50));

        const snapshot = await getDocs(q);
        const workouts = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                sets: data.sets || []
            } as InProgressWorkout;
        });

        return workouts.sort((a, b) => {
            const dateA = this._parseDate(a.startedAt).getTime();
            const dateB = this._parseDate(b.startedAt).getTime();
            return dateB - dateA;
        }).slice(0, options?.limit || workouts.length);
    }

    async getWorkout(uid: string, workoutId: string): Promise<InProgressWorkout | null> {
        const workoutRef = doc(db, 'users', uid, 'workouts', workoutId);
        const workoutSnap = await getDoc(workoutRef);

        if (workoutSnap.exists()) {
            const setsSnap = await getDocs(collection(db, 'users', uid, 'workouts', workoutId, 'sets'));
            const sets = setsSnap.docs.map(d => d.data() as WorkoutSessionSet);
            return { id: workoutSnap.id, ...workoutSnap.data(), sets } as InProgressWorkout;
        }
        return null;
    }

    async listWorkoutSets(uid: string, workoutId: string): Promise<WorkoutSessionSet[]> {
        const setsSnap = await getDocs(collection(db, 'users', uid, 'workouts', workoutId, 'sets'));
        return setsSnap.docs.map(d => d.data() as WorkoutSessionSet);
    }

    async saveWorkoutSession(uid: string, session: WorkoutLog): Promise<void> {
        const historyRef = collection(db, 'users', uid, 'workoutLogs');
        await addDoc(historyRef, {
            ...session,
            createdAt: serverTimestamp()
        });
    }

    // --- Metrics ---

    async getMetrics(uid: string): Promise<UserMetrics> {
        try {
            console.log('[FirestoreRepo] Fetching metrics for:', uid);
            const workoutsRef = collection(db, 'users', uid, 'workouts');
            const q = query(workoutsRef, where('status', '==', 'completed'), limit(100));
            const snapshot = await getDocs(q);

            const workouts = snapshot.docs.map(d => d.data());

            // 1. Weekly Stats
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            const weeklyWorkouts = workouts.filter(w => {
                const date = this._parseDate(w.endedAt || w.startedAt);
                return date >= oneWeekAgo;
            });

            const weeklyVolume = weeklyWorkouts.reduce((sum, w) => sum + (w.summary?.totalVolume || 0), 0);

            // 2. Streak & Activity
            const uniqueDays = new Set(workouts.map(w => {
                const date = this._parseDate(w.endedAt || w.startedAt);
                return this._getLocalDateStr(date);
            }));

            // 3. PRs from sub-collection
            const prsRef = collection(db, 'users', uid, 'stats', 'prs', 'exercises');
            const prsSnap = await getDocs(prsRef);
            const prs = prsSnap.docs.map(d => {
                const data = d.data();
                return {
                    ...data,
                    achievedAt: this._parseDate(data.achievedAt).toISOString()
                } as PersonalRecord;
            });

            // 4. Volume History (Last 7 Local Days)
            const volumeHistory: { date: string, volume: number }[] = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = this._getLocalDateStr(d);

                const dayVolume = workouts.reduce((sum, w) => {
                    const wDate = this._getLocalDateStr(this._parseDate(w.endedAt || w.startedAt));
                    return wDate === dateStr ? sum + (w.summary?.totalVolume || 0) : sum;
                }, 0);

                volumeHistory.push({ date: dateStr, volume: dayVolume });
            }

            console.log('[FirestoreRepo] Metrics computed. Volume History points:', volumeHistory.length);

            return {
                streakDays: uniqueDays.size,
                workoutsThisWeek: weeklyWorkouts.length,
                weeklyVolume,
                prs,
                volumeHistory
            };
        } catch (e) {
            console.error('[FirestoreRepo] getMetrics error:', e);
            return {
                streakDays: 0,
                workoutsThisWeek: 0,
                weeklyVolume: 0,
                prs: []
            };
        }
    }

    // --- Private Helpers ---

    private _parseDate(dateAny: any): Date {
        if (!dateAny) return new Date();
        if (dateAny instanceof Date) return dateAny;
        if (typeof dateAny.toDate === 'function') return dateAny.toDate();
        if (dateAny.seconds) return new Timestamp(dateAny.seconds, dateAny.nanoseconds).toDate();
        const d = new Date(dateAny);
        return isNaN(d.getTime()) ? new Date() : d;
    }

    private _getLocalDateStr(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
}
