
// app/src/features/workout/WorkoutPlayerScreen.tsx
import React from 'react';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';

export const WorkoutPlayerScreen = ({ navigation }: any) => {
    return (
        <PlaceholderScreen
            title="Workout In Progress"
            description="Timer, Sets, Logger"
            action={() => navigation.navigate('WorkoutSummary')}
            actionLabel="Finish Workout"
            navigation={navigation}
        />
    );
};
