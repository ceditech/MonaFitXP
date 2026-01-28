
// app/src/features/catalog/ExerciseDetailScreen.tsx
import React from 'react';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';

export const ExerciseDetailScreen = ({ navigation }: any) => {
    return (
        <PlaceholderScreen
            title="Exercise Details"
            description="Instructions and muscle map."
            nextLabel="Back"
            action={() => navigation.goBack()}
            actionLabel="Back"
            navigation={navigation}
        />
    );
};
