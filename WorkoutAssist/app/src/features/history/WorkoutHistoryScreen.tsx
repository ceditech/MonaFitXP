
// app/src/features/history/WorkoutHistoryScreen.tsx
import React from 'react';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';

export const WorkoutHistoryScreen = ({ navigation }: any) => {
    return (
        <PlaceholderScreen
            title="History"
            description="Past workouts list."
            action={() => navigation.navigate('WorkoutDetail')}
            actionLabel="View Details"
            navigation={navigation}
        />
    );
};
