import * as GuestStore from '../guestStore';
import { migrateGuestWorkoutsToUser } from '../migrateGuestToAccount';
import { writeBatch, doc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
    writeBatch: jest.fn(),
    doc: jest.fn(),
    serverTimestamp: jest.fn(() => 'mock-server-timestamp'),
}));

jest.mock('../guestStore', () => ({
    getGuestUid: jest.fn(),
    readGuestWorkouts: jest.fn(),
    setMigrationState: jest.fn(),
    clearGuestData: jest.fn(),
}));

describe('migrateGuestWorkoutsToUser', () => {
    const mockFirestore = {} as any;
    const mockUid = 'user-123';
    const mockBatch = {
        set: jest.fn(),
        commit: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockBatch.commit.mockResolvedValue(undefined);
        (writeBatch as jest.Mock).mockReturnValue(mockBatch);
        (GuestStore.getGuestUid as jest.Mock).mockResolvedValue('guest-456');
        (GuestStore.readGuestWorkouts as jest.Mock).mockResolvedValue([]);
        (GuestStore.setMigrationState as jest.Mock).mockResolvedValue(undefined);
        (GuestStore.clearGuestData as jest.Mock).mockResolvedValue(undefined);
        (doc as jest.Mock).mockImplementation((_db, path) => ({ path }));
    });

    it('handles empty guest workouts', async () => {
        const result = await migrateGuestWorkoutsToUser({ uid: mockUid, firestore: mockFirestore });

        expect(result).toEqual({ migratedCount: 0, skippedCount: 0 });
        expect(GuestStore.setMigrationState).toHaveBeenCalledWith({ status: 'complete' });
        expect(mockBatch.commit).not.toHaveBeenCalled();
    });

    it('migrates workouts in batches and clears guest data', async () => {
        const workouts = [
            { clientId: 'w1', payload: { name: 'W1' }, createdAtMs: 1, updatedAtMs: 2 },
            { clientId: 'w2', payload: { name: 'W2' }, createdAtMs: 3, updatedAtMs: 4 },
        ];
        (GuestStore.readGuestWorkouts as jest.Mock).mockResolvedValue(workouts);

        const result = await migrateGuestWorkoutsToUser({ uid: mockUid, firestore: mockFirestore });

        expect(result.migratedCount).toBe(2);
        expect(mockBatch.set).toHaveBeenCalledTimes(2);
        expect(mockBatch.set).toHaveBeenCalledWith(
            { path: `users/${mockUid}/workouts/w1` },
            expect.objectContaining({
                clientId: 'w1',
                migratedFromGuestId: 'guest-456',
                source: 'guest',
            }),
            { merge: true },
        );
        expect(GuestStore.setMigrationState).toHaveBeenCalledWith({ status: 'pending' });
        expect(GuestStore.setMigrationState).toHaveBeenCalledWith({ status: 'complete' });
        expect(GuestStore.clearGuestData).toHaveBeenCalled();
    });

    it('only computes counts in dryRun mode', async () => {
        (GuestStore.readGuestWorkouts as jest.Mock).mockResolvedValue([
            { clientId: 'w1', payload: { name: 'W1' }, createdAtMs: 1, updatedAtMs: 2 },
        ]);

        const result = await migrateGuestWorkoutsToUser({
            uid: mockUid,
            firestore: mockFirestore,
            dryRun: true,
        });

        expect(result.migratedCount).toBe(1);
        expect(mockBatch.set).not.toHaveBeenCalled();
        expect(mockBatch.commit).not.toHaveBeenCalled();
        expect(GuestStore.clearGuestData).not.toHaveBeenCalled();
    });

    it('sets failed state on error and does not clear guest data', async () => {
        (GuestStore.readGuestWorkouts as jest.Mock).mockResolvedValue([
            { clientId: 'w1', payload: {}, createdAtMs: 1, updatedAtMs: 1 },
        ]);
        mockBatch.commit.mockRejectedValue(new Error('Firestore failure'));

        await expect(migrateGuestWorkoutsToUser({ uid: mockUid, firestore: mockFirestore }))
            .rejects.toThrow('Firestore failure');

        expect(GuestStore.setMigrationState).toHaveBeenCalledWith({
            status: 'failed',
            lastError: 'Firestore failure',
        });
        expect(GuestStore.clearGuestData).not.toHaveBeenCalled();
    });
});
