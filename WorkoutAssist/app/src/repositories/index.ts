
// app/src/repositories/index.ts

import { useSession } from '../session/SessionProvider';
import { MockWorkoutRepository } from '../data/workouts/MockWorkoutRepository';

/**
 * Hook to access the workout repository for the current session.
 * Encapsulates the choice of implementation (Mock vs eventually Firestore).
 */
export const useWorkoutRepo = () => {
    const { session } = useSession();
    // Repository expects the UID to handle data partitioning
    return new MockWorkoutRepository();
    // Note: MockWorkoutRepository currently doesn't take UID in constructor 
    // but the pattern is established here for when it does.
};
