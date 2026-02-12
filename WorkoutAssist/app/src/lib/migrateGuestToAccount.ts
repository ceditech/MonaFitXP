import {
    writeBatch,
    doc,
    serverTimestamp,
    Firestore
} from 'firebase/firestore';
import * as GuestStore from './guestStore';

const DEBUG_MIGRATION = true;
const BATCH_SIZE = 450;

interface MigrationParams {
    uid: string;
    firestore: Firestore;
    dryRun?: boolean;
}

interface MigrationResult {
    migratedCount: number;
    skippedCount: number;
}

/**
 * Migrates guest workouts from localStorage to Firestore.
 * This function is SSR-safe and only executes in a browser environment.
 */
export async function migrateGuestWorkoutsToUser({
    uid,
    firestore,
    dryRun = false
}: MigrationParams): Promise<MigrationResult> {
    const isServer = typeof window === 'undefined';
    if (isServer) {
        if (DEBUG_MIGRATION) console.warn('[Migration] Skipping migration on SSR');
        return { migratedCount: 0, skippedCount: 0 };
    }

    const guestId = GuestStore.getOrCreateGuestId();
    const guestWorkouts = GuestStore.readGuestWorkouts();

    if (guestWorkouts.length === 0) {
        if (DEBUG_MIGRATION) console.info('[Migration] No guest workouts found to migrate');
        GuestStore.setMigrationState({ status: 'complete' });
        return { migratedCount: 0, skippedCount: 0 };
    }

    if (DEBUG_MIGRATION) {
        console.info(`[Migration] Starting migration for user ${uid}. Found ${guestWorkouts.length} workouts.`);
    }

    GuestStore.setMigrationState({ status: 'pending' });

    try {
        let migratedCount = 0;

        // Chunk workouts into batches
        for (let i = 0; i < guestWorkouts.length; i += BATCH_SIZE) {
            const chunk = guestWorkouts.slice(i, i + BATCH_SIZE);
            const batch = writeBatch(firestore);

            for (const workout of chunk) {
                const { clientId, createdAtMs, updatedAtMs, payload } = workout;
                const workoutRef = doc(firestore, `users/${uid}/workouts/${clientId}`);

                const migrationData = {
                    ...payload,
                    clientId,
                    createdAtMs,
                    updatedAtMs,
                    migratedFromGuestId: guestId,
                    migratedAt: serverTimestamp(),
                    source: 'guest'
                };

                if (!dryRun) {
                    batch.set(workoutRef, migrationData, { merge: true });
                }
                migratedCount++;
            }

            if (!dryRun) {
                await batch.commit();
            }
        }

        if (DEBUG_MIGRATION) {
            console.info(`[Migration] Successfully ${dryRun ? 'previewed' : 'migrated'} ${migratedCount} workouts.`);
        }

        if (!dryRun) {
            GuestStore.setMigrationState({ status: 'complete' });
            GuestStore.clearGuestWorkouts();
        }

        return {
            migratedCount: migratedCount,
            skippedCount: 0
        };

    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (DEBUG_MIGRATION) {
            console.error('[Migration] Failed to migrate guest workouts', errorMessage);
        }

        GuestStore.setMigrationState({
            status: 'failed',
            lastError: errorMessage
        });

        throw error;
    }
}
