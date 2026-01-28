
// app/src/features/plans/PlanTemplatesScreen.tsx
import React from 'react';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';

export const PlanTemplatesScreen = ({ navigation }: any) => {
    return (
        <PlaceholderScreen
            title="My Plans & Templates"
            description="Select a plan or create a new one."
            action={() => navigation.navigate('PlanTemplateDetail')}
            actionLabel="View Template"
            navigation={navigation}
        />
    );
};
