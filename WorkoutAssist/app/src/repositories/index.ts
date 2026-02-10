import { useMemo } from 'react';
import { useSession } from '../session/SessionProvider';
import { MockWorkoutRepository } from '../data/workouts/MockWorkoutRepository';
import { FirestoreWorkoutRepository } from '../data/workouts/FirestoreWorkoutRepository';

/**
 * Hook to access the workout repository for the current session.
 * Encapsulates the choice of implementation (Mock vs Firestore).
 */
export const useWorkoutRepo = () => {
    const { session } = useSession();

    return useMemo(() => {
        if (session.mode === 'authenticated') {
            return new FirestoreWorkoutRepository();
        }
        return new MockWorkoutRepository();
    }, [session.mode]);
};
