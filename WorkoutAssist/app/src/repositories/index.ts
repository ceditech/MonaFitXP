import { useMemo } from 'react';
import { useSession } from '../session/SessionProvider';
import { MockWorkoutRepository } from '../data/workouts/MockWorkoutRepository';

/**
 * Hook to access the workout repository for the current session.
 * Encapsulates the choice of implementation (Mock vs eventually Firestore).
 */
export const useWorkoutRepo = () => {
    return useMemo(() => new MockWorkoutRepository(), []);
};
