
import { useEffect, useState } from 'react';
import { useWorkoutRepo } from '../../../repositories';
import { WorkoutSessionSet } from '../../../data/contracts/IWorkoutRepository';

/**
 * Loads the user's last logged sets for an exercise. Silent on failure —
 * training insights are additive and must never block the player.
 */
export function useLastPerformance(uid: string | null | undefined, exerciseId: string | undefined) {
    const repo = useWorkoutRepo();
    const [lastSets, setLastSets] = useState<WorkoutSessionSet[] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLastSets(null);
        if (!uid || !exerciseId) return;

        setLoading(true);
        repo.getLastExercisePerformance(uid, exerciseId)
            .then(sets => { if (!cancelled) setLastSets(sets); })
            .catch(() => { /* silent — insight is optional */ })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [uid, exerciseId, repo]);

    return { lastSets, loading };
}
