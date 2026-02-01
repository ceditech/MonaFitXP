
// app/src/data/RepoProvider.tsx

import React, { createContext, useContext, useMemo } from 'react';
import { IWorkoutRepository } from './contracts/IWorkoutRepository';
import { MockWorkoutRepository } from './workouts/MockWorkoutRepository';
import { FirestoreWorkoutRepository } from './workouts/FirestoreWorkoutRepository';
import { useSession } from '../session/SessionProvider';

const WorkoutRepoContext = createContext<IWorkoutRepository | undefined>(undefined);

export const RepoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { session } = useSession();

    const repo = useMemo(() => {
        if (session.mode === 'authenticated') {
            console.log('[RepoProvider] Using FirestoreWorkoutRepository');
            return new FirestoreWorkoutRepository();
        } else {
            console.log('[RepoProvider] Using MockWorkoutRepository');
            return new MockWorkoutRepository();
        }
    }, [session.mode]);

    return (
        <WorkoutRepoContext.Provider value={repo}>
            {children}
        </WorkoutRepoContext.Provider>
    );
};

export const useWorkoutRepo = (): IWorkoutRepository => {
    const context = useContext(WorkoutRepoContext);
    if (context === undefined) {
        throw new Error('useWorkoutRepo must be used within a RepoProvider');
    }
    return context;
};
