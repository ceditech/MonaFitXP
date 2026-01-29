
// app/src/data/workouts/MockWorkoutRepository.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    IWorkoutRepository,
    Exercise,
    PlanTemplate,
    UserProfile,
    WorkoutLog,
    UserPlan,
    InProgressWorkout,
    WorkoutSessionSet
} from '../contracts/IWorkoutRepository';

import exerciseCatalog from '../mocks/exerciseCatalog.json';
import planTemplates from '../mocks/planTemplates.json';
import metricsMock from '../mocks/metrics.json';

const DATA_PREFIX = 'WA_DATA_';

export class MockWorkoutRepository implements IWorkoutRepository {
    private memCache: Map<string, any> = new Map();

    // --- Catalogs ---
    async getExercises(): Promise<Exercise[]> {
        return exerciseCatalog as Exercise[];
    }

    async getPlanTemplates(): Promise<PlanTemplate[]> {
        return planTemplates as PlanTemplate[];
    }

    async getPlanTemplate(id: string): Promise<PlanTemplate | null> {
        const templates = await this.getPlanTemplates();
        return templates.find(t => t.id === id) || null;
    }

    // --- User Profile ---
    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const key = `${DATA_PREFIX}${uid}_profile`;
        console.log('[MockRepo] getUserProfile key:', key);
        // Try memory
        if (this.memCache.has(key)) {
            console.log('[MockRepo] found in memCache');
            return this.memCache.get(key);
        }

        // Try storage
        try {
            const stored = await AsyncStorage.getItem(key);
            console.log('[MockRepo] storage item:', stored);
            if (stored) {
                const parsed = JSON.parse(stored);
                this.memCache.set(key, parsed);
                return parsed;
            }
        } catch (e) {
            console.warn('[MockRepo] Failed to load profile', e);
        }
        console.log('[MockRepo] profile not found');
        return null;
    }

    async saveUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
        const key = `${DATA_PREFIX}${uid}_profile`;
        const existing = await this.getUserProfile(uid) || { uid, isGuest: true, createdAt: new Date().toISOString() };
        const updated = { ...existing, ...profile };

        this.memCache.set(key, updated);
        await AsyncStorage.setItem(key, JSON.stringify(updated));
    }

    // --- Active Plan ---
    async getActivePlan(uid: string): Promise<UserPlan | null> {
        const key = `${DATA_PREFIX}${uid}_user_plans`;
        let plans: UserPlan[] = [];
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
            plans = JSON.parse(stored);
        }
        const activeUserPlan = plans.find(p => p.active);
        if (!activeUserPlan) return null;

        // Hydrate with template info
        const template = await this.getPlanTemplate(activeUserPlan.templateId);
        if (!template) return activeUserPlan;

        return {
            ...activeUserPlan,
            ...template, // This adds name, difficulty, sessionMinutes (once added), etc.
            id: activeUserPlan.id // Ensure we keep the user plan ID
        } as any;
    }

    async createUserPlan(uid: string, plan: Omit<UserPlan, 'id'>): Promise<string> {
        const key = `${DATA_PREFIX}${uid}_user_plans`;
        const id = Math.random().toString(36).substr(2, 9);
        const newPlan: UserPlan = { ...plan, id };

        const stored = await AsyncStorage.getItem(key);
        let plans: UserPlan[] = stored ? JSON.parse(stored) : [];

        // If the new plan is active, deactivate others
        if (newPlan.active) {
            plans = plans.map(p => ({ ...p, active: false }));
        }

        plans.push(newPlan);
        await AsyncStorage.setItem(key, JSON.stringify(plans));
        this.memCache.set(key, plans);

        return id;
    }

    async activatePlan(uid: string, planId: string): Promise<void> {
        const key = `${DATA_PREFIX}${uid}_user_plans`;
        const stored = await AsyncStorage.getItem(key);
        if (!stored) return;

        let plans: UserPlan[] = JSON.parse(stored);
        plans = plans.map(p => ({
            ...p,
            active: p.id === planId
        }));

        await AsyncStorage.setItem(key, JSON.stringify(plans));
        this.memCache.set(key, plans);
    }

    async saveActivePlan(uid: string, plan: any): Promise<void> {
        // Keep for legacy/backward compatibility if needed by other screens
        const key = `${DATA_PREFIX}${uid}_active_plan`;
        this.memCache.set(key, plan);
        await AsyncStorage.setItem(key, JSON.stringify(plan));
    }

    // --- History ---
    async getHistory(uid: string): Promise<WorkoutLog[]> {
        const key = `${DATA_PREFIX}${uid}_history`;
        if (this.memCache.has(key)) return this.memCache.get(key);

        const stored = await AsyncStorage.getItem(key);
        if (stored) {
            const parsed = JSON.parse(stored);
            this.memCache.set(key, parsed);
            return parsed;
        }
        return [];
    }

    async saveWorkoutSession(uid: string, session: WorkoutLog): Promise<void> {
        const history = await this.getHistory(uid);
        history.push(session);

        const key = `${DATA_PREFIX}${uid}_history`;
        this.memCache.set(key, history);
        await AsyncStorage.setItem(key, JSON.stringify(history));
    }

    // --- Workout Execution ---
    async startWorkout(uid: string, workout: Omit<InProgressWorkout, 'id'>): Promise<string> {
        const key = `${DATA_PREFIX}${uid}_in_progress`;
        const id = `wo_${Math.random().toString(36).substr(2, 9)}`;
        const newWorkout: InProgressWorkout = { ...workout, id };

        await AsyncStorage.setItem(key, JSON.stringify(newWorkout));
        this.memCache.set(key, newWorkout);
        return id;
    }

    async getInProgressWorkout(uid: string): Promise<InProgressWorkout | null> {
        const key = `${DATA_PREFIX}${uid}_in_progress`;
        if (this.memCache.has(key)) return this.memCache.get(key);

        const stored = await AsyncStorage.getItem(key);
        if (stored) {
            const parsed = JSON.parse(stored);
            this.memCache.set(key, parsed);
            return parsed;
        }
        return null;
    }

    async updateInProgressWorkout(uid: string, workout: InProgressWorkout): Promise<void> {
        const key = `${DATA_PREFIX}${uid}_in_progress`;
        await AsyncStorage.setItem(key, JSON.stringify(workout));
        this.memCache.set(key, workout);
    }

    async logSet(uid: string, workoutId: string, set: WorkoutSessionSet): Promise<void> {
        const workout = await this.getInProgressWorkout(uid);
        if (!workout || workout.id !== workoutId) return;

        // Correctly typed update
        const existingSetIndex = workout.sets.findIndex(
            s => s.exerciseId === set.exerciseId && s.setIndex === set.setIndex
        );

        if (existingSetIndex >= 0) {
            workout.sets[existingSetIndex] = { ...workout.sets[existingSetIndex], ...set };
        } else {
            workout.sets.push(set);
        }

        const key = `${DATA_PREFIX}${uid}_in_progress`;
        await AsyncStorage.setItem(key, JSON.stringify(workout));
        this.memCache.set(key, workout);
    }

    async updateWorkoutCursor(uid: string, workoutId: string, cursor: { exerciseIndex: number; setIndex: number }): Promise<void> {
        const workout = await this.getInProgressWorkout(uid);
        if (!workout || workout.id !== workoutId) return;

        workout.cursor = cursor;

        const key = `${DATA_PREFIX}${uid}_in_progress`;
        await AsyncStorage.setItem(key, JSON.stringify(workout));
        this.memCache.set(key, workout);
    }

    async completeWorkout(uid: string, workoutId: string): Promise<void> {
        const workout = await this.getInProgressWorkout(uid);
        if (!workout || workout.id !== workoutId) return;

        // 1. Move to history
        const durationSeconds = Math.floor((new Date().getTime() - new Date(workout.startedAt).getTime()) / 1000);

        // Volume calculation
        const totalVolume = workout.sets.reduce((sum, set) => {
            if (set.actualWeight && set.actualReps) {
                return sum + (set.actualWeight * set.actualReps);
            }
            return sum;
        }, 0);

        const log: WorkoutLog = {
            id: workout.id,
            date: new Date().toISOString(),
            templateId: workout.planId,
            durationSeconds,
            totalVolume
        };

        await this.saveWorkoutSession(uid, log);

        // 2. Clear in progress
        const key = `${DATA_PREFIX}${uid}_in_progress`;
        await AsyncStorage.removeItem(key);
        this.memCache.delete(key);

        // Update metrics (mock)
        const mKey = `${DATA_PREFIX}${uid}_metrics`;
        const mStored = await AsyncStorage.getItem(mKey);
        const m = mStored ? JSON.parse(mStored) : { streakDays: 0, workoutsCompleted: 0 };
        m.workoutsCompleted += 1;
        await AsyncStorage.setItem(mKey, JSON.stringify(m));
    }

    async abandonWorkout(uid: string, workoutId: string): Promise<void> {
        const key = `${DATA_PREFIX}${uid}_in_progress`;
        await AsyncStorage.removeItem(key);
        this.memCache.delete(key);
    }

    // --- Metrics ---
    async getMetrics(uid: string): Promise<any> {
        // Return mock metrics for now, or aggregate from history
        return metricsMock;
    }
}
