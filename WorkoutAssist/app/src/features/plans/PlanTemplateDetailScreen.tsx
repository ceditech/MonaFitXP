
// app/src/features/plans/PlanTemplateDetailScreen.tsx
import React from 'react';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';

export const PlanTemplateDetailScreen = ({ navigation }: any) => {
    return (
        <PlaceholderScreen
            title="Template Details"
            description="Review exercises in this plan."
            action={() => navigation.goBack()}
            actionLabel="Start this Plan (Back to Home)"
            navigation={navigation}
        />
    );
};
