import {
    writeBatch,
    doc,
    serverTimestamp,
    Firestore
} from 'firebase/firestore';
import * as GuestStore from './guestStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
 * Migrates guest workouts from localStorage/AsyncStorage to Firestore.
 */
export async function migrateGuestWorkoutsToUser({
    uid,
    firestore,
    dryRun = false
}: MigrationParams): Promise<MigrationResult> {
    // @ts-ignore
    const isServer = typeof window === 'undefined' || !window;
    // @ts-ignore
    if (isServer && typeof global.window === 'undefined') {
        // In some RN environments, window might not be global, but we usually aren't "server" either.
        // If we are definitely in a server-like environment (no global window), skip.
        // For Expo, we can usually assume browser/app.
    }

    const guestId = await GuestStore.getGuestUid();
    const guestWorkouts = await GuestStore.readGuestWorkouts();

    if (guestWorkouts.length === 0) {
        if (DEBUG_MIGRATION) console.info('[Migration] No guest workouts found to migrate');
        await GuestStore.setMigrationState({ status: 'complete' });
        return { migratedCount: 0, skippedCount: 0 };
    }

    if (DEBUG_MIGRATION) {
        console.info(`[Migration] Starting migration for user ${uid}. Found ${guestWorkouts.length} workouts.`);
    }

    await GuestStore.setMigrationState({ status: 'pending' });

    try {
        let migratedCount = 0;

        // Chunk workouts into batches
        for (let i = 0; i < guestWorkouts.length; i += BATCH_SIZE) {
            const chunk = guestWorkouts.slice(i, i + BATCH_SIZE);
            const batch = writeBatch(firestore);

            for (const workout of chunk) {
                const { clientId, createdAtMs, updatedAtMs, payload } = workout;
                const workoutRef = doc(firestore, `users/${uid}/workouts/${clientId}`);

                // Strip any internal mock fields we don't want in Firestore if necessary, 
                // but usually payload is the core workout data.
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

        // Migrate Metrics as well
        if (!dryRun && guestId) {
            await migrateGuestMetrics(guestId, uid, firestore);
        }

        if (DEBUG_MIGRATION) {
            console.info(`[Migration] Successfully ${dryRun ? 'previewed' : 'migrated'} ${migratedCount} workouts.`);
        }

        if (!dryRun) {
            await GuestStore.setMigrationState({ status: 'complete' });
            await GuestStore.clearGuestData();
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

        await GuestStore.setMigrationState({
            status: 'failed',
            lastError: errorMessage
        });

        throw error;
    }
}

/**
 * Helper to migrate metrics from AsyncStorage to Firestore
 */
async function migrateGuestMetrics(guestId: string, uid: string, firestore: Firestore) {
    const metricsKey = `WA_DATA_${guestId}_metrics`;
    try {
        const stored = await AsyncStorage.getItem(metricsKey);
        if (stored) {
            const metrics = JSON.parse(stored);
            const metricsRef = doc(firestore, `users/${uid}/metrics/current`);
            await writeBatch(firestore).set(metricsRef, {
                ...metrics,
                migratedFromGuestId: guestId,
                updatedAt: serverTimestamp()
            }, { merge: true }).commit();
            if (DEBUG_MIGRATION) console.log('[Migration] Metrics migrated');
        }
    } catch (e) {
        console.warn('[Migration] Failed to migrate metrics', e);
    }
}
