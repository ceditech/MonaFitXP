import { v4 as uuidv4 } from 'uuid';

/**
 * Storage keys for guest workout data.
 * wa_guest_id_v1: Persistent guest identifier
 * wa_guest_workouts_v1: Array of GuestWorkout objects
 * wa_guest_migration_state_v1: State of guest-to-user data migration
 */
const STORAGE_KEYS = {
    GUEST_ID: 'wa_guest_id_v1',
    GUEST_WORKOUTS: 'wa_guest_workouts_v1',
    MIGRATION_STATE: 'wa_guest_migration_state_v1',
} as const;

export interface GuestWorkout {
    clientId: string; // uuid
    createdAtMs: number;
    updatedAtMs: number;
    payload: any; // The workout object used in the app
}

export interface MigrationState {
    status: 'idle' | 'pending' | 'complete' | 'failed';
    lastError?: string;
}

const isServer = typeof window === 'undefined';

/**
 * Gets the existing guest ID or creates a new one and stores it.
 */
export function getOrCreateGuestId(): string {
    if (isServer) return '';

    let guestId = localStorage.getItem(STORAGE_KEYS.GUEST_ID);
    if (!guestId) {
        guestId = uuidv4();
        localStorage.setItem(STORAGE_KEYS.GUEST_ID, guestId);
    }
    return guestId;
}

/**
 * Reads all guest workouts from localStorage.
 */
export function readGuestWorkouts(): GuestWorkout[] {
    if (isServer) return [];

    const data = localStorage.getItem(STORAGE_KEYS.GUEST_WORKOUTS);
    if (!data) return [];

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('[GuestStore] Failed to parse guest workouts', error);
        return [];
    }
}

/**
 * Adds or updates a guest workout in localStorage.
 */
export function upsertGuestWorkout(workout: GuestWorkout): void {
    if (isServer) return;

    const workouts = readGuestWorkouts();
    const index = workouts.findIndex((w) => w.clientId === workout.clientId);

    const updatedWorkout = {
        ...workout,
        updatedAtMs: Date.now(),
    };

    if (index >= 0) {
        workouts[index] = updatedWorkout;
    } else {
        workouts.push(updatedWorkout);
    }

    localStorage.setItem(STORAGE_KEYS.GUEST_WORKOUTS, JSON.stringify(workouts));
}

/**
 * Removes a specific guest workout by its clientId.
 */
export function removeGuestWorkout(clientId: string): void {
    if (isServer) return;

    const workouts = readGuestWorkouts();
    const filtered = workouts.filter((w) => w.clientId !== clientId);
    localStorage.setItem(STORAGE_KEYS.GUEST_WORKOUTS, JSON.stringify(filtered));
}

/**
 * Clears all guest workouts from localStorage.
 */
export function clearGuestWorkouts(): void {
    if (isServer) return;
    localStorage.removeItem(STORAGE_KEYS.GUEST_WORKOUTS);
}

/**
 * Retrieves the current migration state.
 */
export function getMigrationState(): MigrationState {
    if (isServer) return { status: 'idle' };

    const data = localStorage.getItem(STORAGE_KEYS.MIGRATION_STATE);
    if (!data) return { status: 'idle' };

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('[GuestStore] Failed to parse migration state', error);
        return { status: 'idle' };
    }
}

/**
 * Updates the migration state in localStorage.
 */
export function setMigrationState(state: MigrationState): void {
    if (isServer) return;
    localStorage.setItem(STORAGE_KEYS.MIGRATION_STATE, JSON.stringify(state));
}
