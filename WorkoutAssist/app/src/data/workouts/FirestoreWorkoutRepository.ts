
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
    UserMetrics
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
    runTransaction
} from 'firebase/firestore';

export class FirestoreWorkoutRepository implements IWorkoutRepository {

    // --- Catalogs (Implemented) ---

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

    // --- User Data (Implemented) ---

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

        // Check if doc exists to set createdAt if missing
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            (data as any).createdAt = serverTimestamp();
            (data as any).onboardingCompleted = profile.onboardingCompleted ?? false;
            await setDoc(docRef, data);
        } else {
            await updateDoc(docRef, data);
        }
    }

    // --- Plans (Implemented) ---

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
            return { id: planSnap.id, ...planSnap.data() } as UserPlan;
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
            if (!userSnap.exists()) {
                throw new Error("User document does not exist");
            }

            // Update user's activePlanId
            transaction.update(userRef, {
                activePlanId: planId,
                updatedAt: serverTimestamp()
            });

            // Update plan activation status
            transaction.update(planRef, {
                active: true,
                updatedAt: serverTimestamp()
            });

            // If there was a previous active plan, we could deactivate it here
            // but activePlanId is our main pointer.
        });
    }

    async saveActivePlan(uid: string, plan: any): Promise<void> {
        // This is often used for updating a customized active plan
        if (!plan.id) return;
        const planRef = doc(db, 'users', uid, 'plans', plan.id);
        await updateDoc(planRef, {
            ...plan,
            updatedAt: serverTimestamp()
        });
    }

    // --- Workout Execution (Implemented) ---

    async startWorkout(uid: string, workout: Omit<InProgressWorkout, 'id'>): Promise<string> {
        console.log('[FirestoreRepo] startWorkout called for uid:', uid);
        const workoutsCollection = collection(db, 'users', uid, 'workouts');
        const workoutData = {
            ...workout,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(workoutsCollection, workoutData);
        console.log('[FirestoreRepo] workout started with id:', docRef.id);
        return docRef.id;
    }

    async getInProgressWorkout(uid: string): Promise<InProgressWorkout | null> {
        console.log('[FirestoreRepo] getInProgressWorkout called for uid:', uid);
        const workoutsRef = collection(db, 'users', uid, 'workouts');
        const q = query(workoutsRef, where('status', '==', 'in_progress'), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('[FirestoreRepo] No in-progress workout found');
            return null;
        }
        const doc = snapshot.docs[0];
        console.log('[FirestoreRepo] Found in-progress workout:', doc.id);
        return { id: doc.id, ...doc.data() } as InProgressWorkout;
    }

    async updateInProgressWorkout(uid: string, workout: InProgressWorkout): Promise<void> {
        const workoutRef = doc(db, 'users', uid, 'workouts', workout.id);
        await updateDoc(workoutRef, {
            ...workout,
            updatedAt: serverTimestamp()
        });
    }

    async logSet(uid: string, workoutId: string, set: WorkoutSessionSet): Promise<void> {
        const workoutRef = doc(db, 'users', uid, 'workouts', workoutId);

        await runTransaction(db, async (transaction) => {
            const workoutSnap = await transaction.get(workoutRef);
            if (!workoutSnap.exists()) {
                throw new Error("Workout document does not exist");
            }

            const workoutData = workoutSnap.data() as InProgressWorkout;
            const sets = [...(workoutData.sets || [])];

            const existingSetIndex = sets.findIndex(
                s => s.exerciseId === set.exerciseId && s.setIndex === set.setIndex
            );

            if (existingSetIndex >= 0) {
                sets[existingSetIndex] = { ...sets[existingSetIndex], ...set };
            } else {
                sets.push(set);
            }

            transaction.update(workoutRef, {
                sets,
                updatedAt: serverTimestamp()
            });
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
        const workoutRef = doc(db, 'users', uid, 'workouts', workoutId);
        await updateDoc(workoutRef, {
            status: 'completed',
            completedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    }

    async abandonWorkout(uid: string, workoutId: string): Promise<void> {
        const workoutRef = doc(db, 'users', uid, 'workouts', workoutId);
        await updateDoc(workoutRef, {
            status: 'abandoned',
            updatedAt: serverTimestamp()
        });
    }

    // --- History (Implemented) ---

    async getHistory(uid: string): Promise<WorkoutLog[]> {
        const workoutsRef = collection(db, 'users', uid, 'workouts');
        const q = query(workoutsRef, where('status', '==', 'completed'), orderBy('completedAt', 'desc'), limit(50));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            // Map InProgressWorkout (stored) to WorkoutLog (summary)
            const durationSeconds = data.pausedElapsedSeconds !== undefined
                ? data.pausedElapsedSeconds
                : 0; // Fallback or calculate from timestamps if needed

            // Basic volume calculation if not stored
            const totalVolume = (data.sets as WorkoutSessionSet[] || []).reduce((sum, s) => {
                return sum + ((s.actualWeight || 0) * (s.actualReps || 0));
            }, 0);

            return {
                id: docSnap.id,
                date: data.completedAt?.toDate?.()?.toISOString() || data.startedAt,
                templateId: data.planId,
                durationSeconds,
                totalVolume
            } as WorkoutLog;
        });
    }

    async listWorkouts(uid: string, options?: { status?: string; limit?: number }): Promise<InProgressWorkout[]> {
        const workoutsRef = collection(db, 'users', uid, 'workouts');
        let q = query(workoutsRef, orderBy('updatedAt', 'desc'));

        if (options?.status) {
            q = query(workoutsRef, where('status', '==', options.status), orderBy('updatedAt', 'desc'));
        }

        if (options?.limit) {
            q = query(q, limit(options.limit));
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InProgressWorkout));
    }

    async getWorkout(uid: string, workoutId: string): Promise<InProgressWorkout | null> {
        const workoutRef = doc(db, 'users', uid, 'workouts', workoutId);
        const workoutSnap = await getDoc(workoutRef);

        if (workoutSnap.exists()) {
            return { id: workoutSnap.id, ...workoutSnap.data() } as InProgressWorkout;
        }
        return null;
    }

    async listWorkoutSets(uid: string, workoutId: string): Promise<WorkoutSessionSet[]> {
        const workout = await this.getWorkout(uid, workoutId);
        return workout ? workout.sets : [];
    }

    async saveWorkoutSession(uid: string, session: WorkoutLog): Promise<void> {
        // This is primarily for manual logs if supported
        const historyRef = collection(db, 'users', uid, 'workoutLogs');
        await addDoc(historyRef, {
            ...session,
            createdAt: serverTimestamp()
        });
    }

    // --- Metrics (Stub implementations) ---

    async getMetrics(uid: string): Promise<UserMetrics> {
        return {
            streakDays: 0,
            workoutsThisWeek: 0,
            weeklyVolume: 0,
            prs: []
        };
    }
}
