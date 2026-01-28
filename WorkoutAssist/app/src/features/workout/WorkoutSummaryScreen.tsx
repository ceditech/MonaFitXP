
// app/src/features/workout/WorkoutSummaryScreen.tsx
import React from 'react';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';

export const WorkoutSummaryScreen = ({ navigation }: any) => {
    return (
        <PlaceholderScreen
            title="Workout Complete!"
            description="Stats and Celebration."
            action={() => navigation.popToTop()}
            actionLabel="Done"
            navigation={navigation}
        />
    );
};
