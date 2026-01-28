
// app/src/features/catalog/ExerciseCatalogScreen.tsx
import React from 'react';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';

export const ExerciseCatalogScreen = ({ navigation }: any) => {
    return (
        <PlaceholderScreen
            title="Exercise Catalog"
            description="Browse all available exercises."
            action={() => navigation.navigate('ExerciseDetail')}
            actionLabel="View Exercise Details"
            navigation={navigation}
        />
    );
};
