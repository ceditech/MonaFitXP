
// app/src/app/context/GuestSessionManager.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { MockWorkoutRepository } from '../../data/workouts/MockWorkoutRepository';

const SESSION_KEY = 'WA_SESSION_USER_ID';
const SESSION_TYPE_KEY = 'WA_SESSION_TYPE';

export class GuestSessionManager {
    static async getSession(): Promise<{ uid: string | null; isGuest: boolean }> {
        try {
            const uid = await AsyncStorage.getItem(SESSION_KEY);
            const type = await AsyncStorage.getItem(SESSION_TYPE_KEY);
            return { uid, isGuest: type === 'guest' };
        } catch (e) {
            return { uid: null, isGuest: false };
        }
    }

    static async createGuestSession(): Promise<string> {
        const uid = uuidv4();
        await AsyncStorage.setItem(SESSION_KEY, uid);
        await AsyncStorage.setItem(SESSION_TYPE_KEY, 'guest');

        // Initialize empty profile
        const repo = new MockWorkoutRepository();
        await repo.saveUserProfile(uid, { uid, isGuest: true, createdAt: new Date().toISOString() });

        return uid;
    }

    static async clearSession(): Promise<void> {
        await AsyncStorage.removeItem(SESSION_KEY);
        await AsyncStorage.removeItem(SESSION_TYPE_KEY);
    }
}
