
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
    WorkoutSessionSet,
    UserMetrics,
    PersonalRecord,
    GamificationState
} from '../contracts/IWorkoutRepository';

import exerciseCatalog from '../mocks/exerciseCatalog.json';
import planTemplates from '../mocks/planTemplates.json';
import metricsMock from '../mocks/metrics.json';

const DATA_PREFIX = 'WA_DATA_';

export class MockWorkoutRepository implements IWorkoutRepository {
    private memCache: Map<string, any> = new Map();

    // --- Catalogs ---
    async getExercises(): Promise<Exercise[]> {
        return (exerciseCatalog as unknown) as Exercise[];
    }

    async getExercise(id: string): Promise<Exercise | null> {
        const exercises = await this.getExercises();
        return exercises.find(e => e.id === id) || null;
    }

    async getMergedExercises(uid: string): Promise<Exercise[]> {
        const [catalog, custom] = await Promise.all([
            this.getExercises(),
            this.listCustomExercises(uid),
        ]);
        return [...catalog, ...custom];
    }

    async listCustomExercises(uid: string): Promise<Exercise[]> {
        const key = `${DATA_PREFIX}${uid}_custom_exercises`;
        if (this.memCache.has(key)) return this.memCache.get(key);
        try {
            const stored = await AsyncStorage.getItem(key);
            const parsed: Exercise[] = stored ? JSON.parse(stored) : [];
            this.memCache.set(key, parsed);
            return parsed;
        } catch {
            return [];
        }
    }

    async createCustomExercise(uid: string, exercise: Omit<Exercise, 'id' | 'isCustom' | 'ownerUid'>): Promise<string> {
        const key = `${DATA_PREFIX}${uid}_custom_exercises`;
        const list = await this.listCustomExercises(uid);
        const id = `custom_${Math.random().toString(36).substr(2, 9)}`;
        const newExercise: Exercise = { ...exercise, id, isCustom: true, ownerUid: uid };
        const updated = [...list, newExercise];
        this.memCache.set(key, updated);
        await AsyncStorage.setItem(key, JSON.stringify(updated));
        return id;
    }

    async deleteCustomExercise(uid: string, exerciseId: string): Promise<void> {
        const key = `${DATA_PREFIX}${uid}_custom_exercises`;
        const list = await this.listCustomExercises(uid);
        const updated = list.filter(e => e.id !== exerciseId);
        this.memCache.set(key, updated);
        await AsyncStorage.setItem(key, JSON.stringify(updated));
    }

    async getFavoriteExerciseIds(uid: string): Promise<string[]> {
        const profile = await this.getUserProfile(uid);
        return profile?.favoriteExerciseIds || [];
    }

    async toggleFavorite(uid: string, exerciseId: string): Promise<string[]> {
        const current = await this.getFavoriteExerciseIds(uid);
        const updated = current.includes(exerciseId)
            ? current.filter(id => id !== exerciseId)
            : [...current, exerciseId];
        await this.saveUserProfile(uid, { favoriteExerciseIds: updated });
        return updated;
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

    async listWorkouts(uid: string, options?: { status?: string; limit?: number }): Promise<InProgressWorkout[]> {
        const key = `${DATA_PREFIX}${uid}_history_details`;
        let details: Record<string, InProgressWorkout> = {};

        if (this.memCache.has(key)) {
            details = this.memCache.get(key);
        } else {
            const stored = await AsyncStorage.getItem(key);
            if (stored) {
                details = JSON.parse(stored);
                this.memCache.set(key, details);
            }
        }

        let list = Object.values(details);

        if (options?.status) {
            list = list.filter(w => w.status === options.status);
        }

        // Sort by startedAt desc
        list.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

        if (options?.limit) {
            list = list.slice(0, options.limit);
        }

        return list;
    }

    async getWorkout(uid: string, workoutId: string): Promise<InProgressWorkout | null> {
        const key = `${DATA_PREFIX}${uid}_history_details`;
        if (this.memCache.has(key)) {
            const details = this.memCache.get(key);
            return details[workoutId] || null;
        }

        const stored = await AsyncStorage.getItem(key);
        if (stored) {
            const details = JSON.parse(stored);
            this.memCache.set(key, details);
            return details[workoutId] || null;
        }
        return null;
    }

    async listWorkoutSets(uid: string, workoutId: string): Promise<WorkoutSessionSet[]> {
        const workout = await this.getWorkout(uid, workoutId);
        return workout ? workout.sets : [];
    }

    async getLastExercisePerformance(uid: string, exerciseId: string): Promise<WorkoutSessionSet[] | null> {
        // listWorkouts already returns most-recent-first
        const completed = await this.listWorkouts(uid, { status: 'completed' });
        for (const workout of completed) {
            const exerciseSets = (workout.sets || [])
                .filter(s => s.exerciseId === exerciseId && (s.actualReps || 0) > 0)
                .sort((a, b) => a.setIndex - b.setIndex);
            if (exerciseSets.length > 0) {
                return exerciseSets;
            }
        }
        return null;
    }

    async getExerciseSetHistory(uid: string, exerciseId: string, maxWorkouts = 20): Promise<WorkoutSessionSet[]> {
        const completed = await this.listWorkouts(uid, { status: 'completed', limit: maxWorkouts });
        const all: WorkoutSessionSet[] = [];
        for (const workout of completed) {
            all.push(...(workout.sets || [])
                .filter(s => s.exerciseId === exerciseId && (s.actualReps || 0) > 0)
                .sort((a, b) => a.setIndex - b.setIndex));
        }
        return all;
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
        // Use pausedElapsedSeconds if available (accurate frozen time), otherwise calculate from startedAt
        const durationSeconds = workout.pausedElapsedSeconds !== undefined
            ? workout.pausedElapsedSeconds
            : Math.floor((new Date().getTime() - new Date(workout.startedAt).getTime()) / 1000);

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

        // 2. Clear in progress and save details to history
        // Store the final duration in the detailed object for recap
        const updatedWorkout: InProgressWorkout = {
            ...workout,
            status: 'completed',
            pausedElapsedSeconds: durationSeconds
        };
        const dKey = `${DATA_PREFIX}${uid}_history_details`;
        const dStored = await AsyncStorage.getItem(dKey);
        const d = dStored ? JSON.parse(dStored) : {};
        d[workoutId] = updatedWorkout;
        await AsyncStorage.setItem(dKey, JSON.stringify(d));
        this.memCache.set(dKey, d);

        const key = `${DATA_PREFIX}${uid}_in_progress`;
        await AsyncStorage.removeItem(key);
        this.memCache.delete(key);

        // Update metrics (mock)
        const mKey = `${DATA_PREFIX}${uid}_metrics`;
        const currentMetrics = await this.getMetrics(uid);

        const updatedMetrics: UserMetrics = {
            ...currentMetrics,
            workoutsThisWeek: currentMetrics.workoutsThisWeek + 1,
            weeklyVolume: currentMetrics.weeklyVolume + totalVolume,
            // Simple logic: if volume > current PR volume for an exercise, update it (very simplified)
            // PR update logic would go here in a real implementation
        };

        await AsyncStorage.setItem(mKey, JSON.stringify(updatedMetrics));
        this.memCache.set(mKey, updatedMetrics);
    }

    async abandonWorkout(uid: string, workoutId: string): Promise<void> {
        const key = `${DATA_PREFIX}${uid}_in_progress`;
        await AsyncStorage.removeItem(key);
        this.memCache.delete(key);
    }

    async getMetrics(uid: string): Promise<UserMetrics> {
        const key = `${DATA_PREFIX}${uid}_metrics`;
        const stored = await AsyncStorage.getItem(key);

        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed && parsed.prs && Array.isArray(parsed.prs)) {
                    return parsed;
                }
            } catch (e) {
                console.error('[MockWorkoutRepository] Metrics parse error:', e);
            }
        }

        // Default mock metrics if none stored or invalid
        const defaultMetrics: UserMetrics = {
            streakDays: metricsMock.streakDays || 3,
            workoutsThisWeek: 2,
            weeklyVolume: metricsMock.totalVolumeKg || 5400,
            prs: [
                {
                    exerciseId: 'ex_001', // Bench Press
                    bestWeight: 100,
                    bestReps: 5,
                    achievedAt: new Date(Date.now() - 86400000 * 2).toISOString()
                },
                {
                    exerciseId: 'ex_002', // Barbell Squat
                    bestWeight: 140,
                    bestReps: 3,
                    achievedAt: new Date(Date.now() - 86400000 * 5).toISOString()
                }
            ]
        };

        return defaultMetrics;
    }

    async getGamification(uid: string): Promise<GamificationState | null> {
        // Canned mid-progress state so gamification UI is visible in mock mode.
        return {
            totalXp: 950,
            level: 5,
            lifetimeWorkouts: 12,
            lifetimeVolume: 14200,
            lifetimeSets: 96,
            lifetimePrs: 4,
            badges: {
                first_workout: { earnedAt: new Date(Date.now() - 86400000 * 30).toISOString() },
                consistency_4: { earnedAt: new Date(Date.now() - 86400000 * 12).toISOString() },
                volume_10k: { earnedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
            },
        };
    }

    async getEntitlement(uid: string): Promise<{ tier: string }> {
        return { tier: 'free' };
    }
}
