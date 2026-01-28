
// app/src/session/sessionStorage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const GUEST_UID_KEY = 'workoutassist.guestUid';

export const sessionStorage = {
    getGuestUid: async (): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(GUEST_UID_KEY);
        } catch (e) {
            console.error('Failed to load guest UID', e);
            return null;
        }
    },

    saveGuestUid: async (uid: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(GUEST_UID_KEY, uid);
        } catch (e) {
            console.error('Failed to save guest UID', e);
        }
    },

    removeGuestUid: async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem(GUEST_UID_KEY);
        } catch (e) {
            console.error('Failed to remove guest UID', e);
        }
    },

    generateUid: (): string => {
        return uuidv4();
    }
};
