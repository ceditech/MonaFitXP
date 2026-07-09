import AsyncStorage from '@react-native-async-storage/async-storage';
import * as GuestStore from '../guestStore';

// AsyncStorage is mocked globally in jest.setup.js with the official mock.

const GUEST_UID_KEY = 'workoutassist.guestUid';
const MIGRATION_KEY = 'wa_guest_migration_state_v1';

describe('GuestStore', () => {
    beforeEach(async () => {
        await AsyncStorage.clear();
        jest.clearAllMocks();
    });

    describe('getGuestUid', () => {
        it('returns null when no guest uid is stored', async () => {
            expect(await GuestStore.getGuestUid()).toBeNull();
        });

        it('returns the stored guest uid', async () => {
            await AsyncStorage.setItem(GUEST_UID_KEY, 'guest-123');
            expect(await GuestStore.getGuestUid()).toBe('guest-123');
        });
    });

    describe('readGuestWorkouts', () => {
        it('returns empty array when there is no guest uid', async () => {
            expect(await GuestStore.readGuestWorkouts()).toEqual([]);
        });

        it('returns empty array when the guest has no workout details', async () => {
            await AsyncStorage.setItem(GUEST_UID_KEY, 'guest-123');
            expect(await GuestStore.readGuestWorkouts()).toEqual([]);
        });

        it('maps the repository details map to GuestWorkout entries', async () => {
            await AsyncStorage.setItem(GUEST_UID_KEY, 'guest-123');
            const detailsMap = {
                w1: { name: 'Push Day', startedAt: '2026-01-05T10:00:00.000Z' },
                w2: { name: 'Leg Day', startedAt: '2026-01-06T10:00:00.000Z', updatedAtMs: 42 },
            };
            await AsyncStorage.setItem('WA_DATA_guest-123_history_details', JSON.stringify(detailsMap));

            const workouts = await GuestStore.readGuestWorkouts();

            expect(workouts).toHaveLength(2);
            const w1 = workouts.find(w => w.clientId === 'w1')!;
            expect(w1.payload.name).toBe('Push Day');
            expect(w1.createdAtMs).toBe(new Date('2026-01-05T10:00:00.000Z').getTime());
            const w2 = workouts.find(w => w.clientId === 'w2')!;
            expect(w2.updatedAtMs).toBe(42);
        });

        it('returns empty array on corrupted JSON instead of throwing', async () => {
            await AsyncStorage.setItem(GUEST_UID_KEY, 'guest-123');
            await AsyncStorage.setItem('WA_DATA_guest-123_history_details', 'not-json{');
            expect(await GuestStore.readGuestWorkouts()).toEqual([]);
        });
    });

    describe('clearGuestData', () => {
        it('removes the guest uid and all namespaced data keys', async () => {
            await AsyncStorage.setItem(GUEST_UID_KEY, 'guest-123');
            await AsyncStorage.setItem('WA_DATA_guest-123_history', '[]');
            await AsyncStorage.setItem('WA_DATA_guest-123_history_details', '{}');
            await AsyncStorage.setItem('WA_DATA_guest-123_metrics', '{}');

            await GuestStore.clearGuestData();

            expect(await AsyncStorage.getItem(GUEST_UID_KEY)).toBeNull();
            expect(await AsyncStorage.getItem('WA_DATA_guest-123_history')).toBeNull();
            expect(await AsyncStorage.getItem('WA_DATA_guest-123_history_details')).toBeNull();
            expect(await AsyncStorage.getItem('WA_DATA_guest-123_metrics')).toBeNull();
        });

        it('is a no-op when there is no guest uid', async () => {
            await expect(GuestStore.clearGuestData()).resolves.toBeUndefined();
        });
    });

    describe('Migration state', () => {
        it('defaults to idle when nothing is stored', async () => {
            expect(await GuestStore.getMigrationState()).toEqual({ status: 'idle' });
        });

        it('round-trips a stored migration state', async () => {
            await GuestStore.setMigrationState({ status: 'complete' });
            expect(await GuestStore.getMigrationState()).toEqual({ status: 'complete' });
        });

        it('persists failure details', async () => {
            await GuestStore.setMigrationState({ status: 'failed', lastError: 'boom' });
            expect(await GuestStore.getMigrationState()).toEqual({ status: 'failed', lastError: 'boom' });
        });

        it('defaults to idle on corrupted stored state', async () => {
            await AsyncStorage.setItem(MIGRATION_KEY, '{{bad');
            expect(await GuestStore.getMigrationState()).toEqual({ status: 'idle' });
        });
    });
});
