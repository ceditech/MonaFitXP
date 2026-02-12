import * as GuestStore from '../guestStore';

jest.mock('uuid', () => ({
    v4: () => 'mock-uuid',
}));

// Mock localStorage
const storage: Record<string, string> = {};
const localStorageMock = {
    getItem: jest.fn((key: string) => storage[key] || null),
    setItem: jest.fn((key: string, value: string) => { storage[key] = value; }),
    removeItem: jest.fn((key: string) => { delete storage[key]; }),
    clear: jest.fn(() => { Object.keys(storage).forEach(k => delete storage[k]); }),
    length: 0,
    key: jest.fn((index: number) => Object.keys(storage)[index] || null),
};

Object.defineProperty(global, 'localStorage', { value: localStorageMock });
Object.defineProperty(global, 'window', { value: {} });

describe('GuestStore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    describe('getOrCreateGuestId', () => {
        it('should generate a new guest ID if none exists', () => {
            const id = GuestStore.getOrCreateGuestId();
            expect(id).toBeDefined();
            expect(typeof id).toBe('string');
            expect(localStorage.setItem).toHaveBeenCalledWith('wa_guest_id_v1', id);
        });

        it('should return existing guest ID if it exists', () => {
            const existingId = 'existing-id';
            localStorage.setItem('wa_guest_id_v1', existingId);
            const id = GuestStore.getOrCreateGuestId();
            expect(id).toBe(existingId);
            expect(localStorage.setItem).toHaveBeenCalledTimes(1); // Set in setup
        });
    });

    describe('Workout CRUD', () => {
        const mockWorkout: GuestStore.GuestWorkout = {
            clientId: 'workout-1',
            createdAtMs: 1000,
            updatedAtMs: 1000,
            payload: { name: 'Test Workout' }
        };

        it('should upsert and read workouts', () => {
            GuestStore.upsertGuestWorkout(mockWorkout);
            const workouts = GuestStore.readGuestWorkouts();
            expect(workouts).toHaveLength(1);
            expect(workouts[0].clientId).toBe(mockWorkout.clientId);
        });

        it('should update an existing workout', () => {
            GuestStore.upsertGuestWorkout(mockWorkout);
            const updatedWorkout = { ...mockWorkout, payload: { name: 'Updated' } };
            GuestStore.upsertGuestWorkout(updatedWorkout);

            const workouts = GuestStore.readGuestWorkouts();
            expect(workouts).toHaveLength(1);
            expect(workouts[0].payload.name).toBe('Updated');
        });

        it('should remove a workout', () => {
            GuestStore.upsertGuestWorkout(mockWorkout);
            GuestStore.removeGuestWorkout(mockWorkout.clientId);
            expect(GuestStore.readGuestWorkouts()).toHaveLength(0);
        });

        it('should clear all workouts', () => {
            GuestStore.upsertGuestWorkout(mockWorkout);
            GuestStore.clearGuestWorkouts();
            expect(GuestStore.readGuestWorkouts()).toHaveLength(0);
        });
    });

    describe('Migration State', () => {
        it('should get and set migration state', () => {
            expect(GuestStore.getMigrationState()).toEqual({ status: 'idle' });

            const newState: GuestStore.MigrationState = { status: 'complete' };
            GuestStore.setMigrationState(newState);
            expect(GuestStore.getMigrationState()).toEqual(newState);
        });
    });
});
