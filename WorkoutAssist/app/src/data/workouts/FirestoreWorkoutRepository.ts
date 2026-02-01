
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
    query,
    limit
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

    // --- User Data (Stub implementations for now) ---

    async getUserProfile(uid: string): Promise<UserProfile | null> {
        throw new Error('FirestoreWorkoutRepository: getUserProfile not yet implemented');
    }

    async saveUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
        throw new Error('FirestoreWorkoutRepository: saveUserProfile not yet implemented');
    }

    // --- Plans (Stub implementations) ---

    async getActivePlan(uid: string): Promise<UserPlan | null> {
        throw new Error('FirestoreWorkoutRepository: getActivePlan not yet implemented');
    }

    async createUserPlan(uid: string, plan: Omit<UserPlan, 'id'>): Promise<string> {
        throw new Error('FirestoreWorkoutRepository: createUserPlan not yet implemented');
    }

    async activatePlan(uid: string, planId: string): Promise<void> {
        throw new Error('FirestoreWorkoutRepository: activatePlan not yet implemented');
    }

    async saveActivePlan(uid: string, plan: any): Promise<void> {
        throw new Error('FirestoreWorkoutRepository: saveActivePlan not yet implemented');
    }

    // --- Workout Execution (Stub implementations) ---

    async startWorkout(uid: string, workout: Omit<InProgressWorkout, 'id'>): Promise<string> {
        throw new Error('FirestoreWorkoutRepository: startWorkout not yet implemented');
    }

    async getInProgressWorkout(uid: string): Promise<InProgressWorkout | null> {
        throw new Error('FirestoreWorkoutRepository: getInProgressWorkout not yet implemented');
    }

    async updateInProgressWorkout(uid: string, workout: InProgressWorkout): Promise<void> {
        throw new Error('FirestoreWorkoutRepository: updateInProgressWorkout not yet implemented');
    }

    async logSet(uid: string, workoutId: string, set: WorkoutSessionSet): Promise<void> {
        throw new Error('FirestoreWorkoutRepository: logSet not yet implemented');
    }

    async updateWorkoutCursor(uid: string, workoutId: string, cursor: { exerciseIndex: number; setIndex: number }): Promise<void> {
        throw new Error('FirestoreWorkoutRepository: updateWorkoutCursor not yet implemented');
    }

    async completeWorkout(uid: string, workoutId: string): Promise<void> {
        throw new Error('FirestoreWorkoutRepository: completeWorkout not yet implemented');
    }

    async abandonWorkout(uid: string, workoutId: string): Promise<void> {
        throw new Error('FirestoreWorkoutRepository: abandonWorkout not yet implemented');
    }

    // --- History (Stub implementations) ---

    async getHistory(uid: string): Promise<WorkoutLog[]> {
        throw new Error('FirestoreWorkoutRepository: getHistory not yet implemented');
    }

    async listWorkouts(uid: string, options?: { status?: string; limit?: number }): Promise<InProgressWorkout[]> {
        throw new Error('FirestoreWorkoutRepository: listWorkouts not yet implemented');
    }

    async getWorkout(uid: string, workoutId: string): Promise<InProgressWorkout | null> {
        throw new Error('FirestoreWorkoutRepository: getWorkout not yet implemented');
    }

    async listWorkoutSets(uid: string, workoutId: string): Promise<WorkoutSessionSet[]> {
        throw new Error('FirestoreWorkoutRepository: listWorkoutSets not yet implemented');
    }

    async saveWorkoutSession(uid: string, session: WorkoutLog): Promise<void> {
        throw new Error('FirestoreWorkoutRepository: saveWorkoutSession not yet implemented');
    }

    // --- Metrics (Stub implementations) ---

    async getMetrics(uid: string): Promise<UserMetrics> {
        throw new Error('FirestoreWorkoutRepository: getMetrics not yet implemented');
    }
}
