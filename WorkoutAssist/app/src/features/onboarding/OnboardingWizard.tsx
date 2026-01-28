
// app/src/features/onboarding/OnboardingWizard.tsx
import React from 'react';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';
import { useSession } from '../../app/context/SessionContext';

export const OnboardingWizard = ({ navigation }: any) => {
    const { createGuest } = useSession();

    const handleFinish = async () => {
        await createGuest();
        // Navigation will be handled by RootNavigator switching stacks
    };

    return (
        <PlaceholderScreen
            title="Onboarding"
            description="Tell us about yourself (Height, Weight, Goals)."
            action={handleFinish}
            actionLabel="Complete Setup"
            navigation={navigation}
        />
    );
};
