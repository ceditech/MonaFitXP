import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys and patterns.
 * 
 * We must match the keys used in MockWorkoutRepository and SessionProvider.
 */
const STORAGE_KEYS = {
    GUEST_UID: 'workoutassist.guestUid',
    PREFIX: 'WA_DATA_',
    MIGRATION_STATE: 'wa_guest_migration_state_v1', // Internal tracker
} as const;

export interface GuestWorkout {
    clientId: string;
    createdAtMs: number;
    updatedAtMs: number;
    payload: any;
}

export interface MigrationState {
    status: 'idle' | 'pending' | 'complete' | 'failed';
    lastError?: string;
}

/**
 * Gets the current guest UID from storage.
 */
export async function getGuestUid(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(STORAGE_KEYS.GUEST_UID);
    } catch (e) {
        return null;
    }
}

/**
 * Reads all guest workouts (history + details) from localStorage/AsyncStorage.
 */
export async function readGuestWorkouts(): Promise<GuestWorkout[]> {
    const guestUid = await getGuestUid();
    if (!guestUid) return [];

    const detailsKey = `${STORAGE_KEYS.PREFIX}${guestUid}_history_details`;

    try {
        const detailsData = await AsyncStorage.getItem(detailsKey);
        if (!detailsData) return [];

        const detailsMap = JSON.parse(detailsData);

        // Convert the repository's map structure to an array the migration logic expects
        return Object.entries(detailsMap).map(([id, workout]: [string, any]) => ({
            clientId: id,
            createdAtMs: new Date(workout.startedAt).getTime(),
            updatedAtMs: workout.updatedAtMs || new Date(workout.startedAt).getTime(),
            payload: workout
        }));
    } catch (error) {
        console.error('[GuestStore] Failed to read guest workouts', error);
        return [];
    }
}

/**
 * Clears all guest-related data from storage.
 */
export async function clearGuestData(): Promise<void> {
    const guestUid = await getGuestUid();
    if (!guestUid) return;

    const keysToRemove = [
        STORAGE_KEYS.GUEST_UID,
        `${STORAGE_KEYS.PREFIX}${guestUid}_history`,
        `${STORAGE_KEYS.PREFIX}${guestUid}_history_details`,
        `${STORAGE_KEYS.PREFIX}${guestUid}_metrics`,
        `${STORAGE_KEYS.PREFIX}${guestUid}_user_plans`,
        `${STORAGE_KEYS.PREFIX}${guestUid}_profile`,
        `${STORAGE_KEYS.PREFIX}${guestUid}_in_progress`,
    ];

    try {
        await AsyncStorage.multiRemove(keysToRemove);
    } catch (e) {
        console.error('[GuestStore] Failed to clear guest data', e);
    }
}

/**
 * Retrieves the current migration state.
 */
export async function getMigrationState(): Promise<MigrationState> {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.MIGRATION_STATE);
        if (!data) return { status: 'idle' };
        return JSON.parse(data);
    } catch (error) {
        return { status: 'idle' };
    }
}

/**
 * Updates the migration state in storage.
 */
export async function setMigrationState(state: MigrationState): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.MIGRATION_STATE, JSON.stringify(state));
    } catch (e) {
        console.error('[GuestStore] Failed to set migration state', e);
    }
}

// Keep synchronous legacy wrappers for MigrationOverlay if needed,
// but we should ideally update MigrationOverlay to handle async status.
// For now, I'll keep the exports as matches to what migrateGuestToAccount expects,
// but it will need to await them.
