
// app/src/features/onboarding/OnboardingWizard.tsx
import React from 'react';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';
import { useSession } from '../../session/SessionProvider';

export const OnboardingWizard = ({ navigation }: any) => {
    const { ensureGuestSession } = useSession();

    const handleFinish = async () => {
        await ensureGuestSession();
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
