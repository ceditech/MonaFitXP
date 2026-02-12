import * as GuestStore from '../guestStore';
import { migrateGuestWorkoutsToUser } from '../migrateGuestToAccount';
import { writeBatch, doc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
    writeBatch: jest.fn(),
    doc: jest.fn(),
    serverTimestamp: jest.fn(() => 'mock-server-timestamp'),
}));

jest.mock('../guestStore', () => ({
    getOrCreateGuestId: jest.fn(),
    readGuestWorkouts: jest.fn(),
    setMigrationState: jest.fn(),
    clearGuestWorkouts: jest.fn(),
}));

describe('migrateGuestWorkoutsToUser', () => {
    const mockFirestore = {} as any;
    const mockUid = 'user-123';
    const mockBatch = {
        set: jest.fn(),
        commit: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (writeBatch as jest.Mock).mockReturnValue(mockBatch);
        Object.defineProperty(global, 'window', { value: {}, writable: true, configurable: true });
    });

    it('should return 0 counts if running on SSR', async () => {
        const originalWindow = global.window;
        // @ts-ignore
        delete global.window;

        const result = await migrateGuestWorkoutsToUser({ uid: mockUid, firestore: mockFirestore });
        expect(result).toEqual({ migratedCount: 0, skippedCount: 0 });

        global.window = originalWindow;
    });

    it('should handle empty guest workouts', async () => {
        (GuestStore.readGuestWorkouts as jest.Mock).mockReturnValue([]);

        const result = await migrateGuestWorkoutsToUser({ uid: mockUid, firestore: mockFirestore });

        expect(result).toEqual({ migratedCount: 0, skippedCount: 0 });
        expect(GuestStore.setMigrationState).toHaveBeenCalledWith({ status: 'complete' });
    });

    it('should migrate workouts in batches', async () => {
        const workouts = [
            { clientId: 'w1', payload: { name: 'W1' }, createdAtMs: 1, updatedAtMs: 2 },
            { clientId: 'w2', payload: { name: 'W2' }, createdAtMs: 3, updatedAtMs: 4 },
        ];
        (GuestStore.readGuestWorkouts as jest.Mock).mockReturnValue(workouts);
        (GuestStore.getOrCreateGuestId as jest.Mock).mockReturnValue('guest-456');
        (doc as jest.Mock).mockImplementation((db, path) => ({ path }));

        const result = await migrateGuestWorkoutsToUser({ uid: mockUid, firestore: mockFirestore });

        expect(result.migratedCount).toBe(2);
        expect(mockBatch.set).toHaveBeenCalledTimes(2);
        expect(mockBatch.commit).toHaveBeenCalledTimes(1);
        expect(GuestStore.setMigrationState).toHaveBeenCalledWith({ status: 'pending' });
        expect(GuestStore.setMigrationState).toHaveBeenCalledWith({ status: 'complete' });
        expect(GuestStore.clearGuestWorkouts).toHaveBeenCalled();
    });

    it('should only compute counts in dryRun mode', async () => {
        const workouts = [{ clientId: 'w1', payload: { name: 'W1' }, createdAtMs: 1, updatedAtMs: 2 }];
        (GuestStore.readGuestWorkouts as jest.Mock).mockReturnValue(workouts);

        const result = await migrateGuestWorkoutsToUser({
            uid: mockUid,
            firestore: mockFirestore,
            dryRun: true
        });

        expect(result.migratedCount).toBe(1);
        expect(mockBatch.set).not.toHaveBeenCalled();
        expect(mockBatch.commit).not.toHaveBeenCalled();
        expect(GuestStore.clearGuestWorkouts).not.toHaveBeenCalled();
    });

    it('should set failed state on error', async () => {
        (GuestStore.readGuestWorkouts as jest.Mock).mockReturnValue([{ clientId: 'w1' }]);
        mockBatch.commit.mockRejectedValue(new Error('Firestore failure'));

        await expect(migrateGuestWorkoutsToUser({ uid: mockUid, firestore: mockFirestore }))
            .rejects.toThrow('Firestore failure');

        expect(GuestStore.setMigrationState).toHaveBeenCalledWith({
            status: 'failed',
            lastError: 'Firestore failure'
        });
        expect(GuestStore.clearGuestWorkouts).not.toHaveBeenCalled();
    });
});
