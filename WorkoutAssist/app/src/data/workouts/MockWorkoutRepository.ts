
// app/src/data/workouts/MockWorkoutRepository.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    IWorkoutRepository,
    Exercise,
    PlanTemplate,
    UserProfile,
    WorkoutLog,
    UserPlan
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
    async getActivePlan(uid: string): Promise<any | null> {
        const key = `${DATA_PREFIX}${uid}_active_plan`;
        if (this.memCache.has(key)) return this.memCache.get(key);

        const stored = await AsyncStorage.getItem(key);
        if (stored) {
            const parsed = JSON.parse(stored);
            this.memCache.set(key, parsed);
            return parsed;
        }
        return null;
    }

    async saveActivePlan(uid: string, plan: any): Promise<void> {
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

    // --- Metrics ---
    async getMetrics(uid: string): Promise<any> {
        // Return mock metrics for now, or aggregate from history
        return metricsMock;
    }
}
