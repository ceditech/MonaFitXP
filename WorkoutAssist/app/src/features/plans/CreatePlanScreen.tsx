
// app/src/features/plans/CreatePlanScreen.tsx
import React from 'react';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';

export const CreatePlanScreen = ({ navigation }: any) => {
    return (
        <PlaceholderScreen
            title="Create Custom Plan"
            description="Builder wizard for new plans."
            navigation={navigation}
        />
    );
};
