
// app/src/features/auth/SignUpScreen.tsx
import React from 'react';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';

export const SignUpScreen = ({ navigation }: any) => {
    return (
        <PlaceholderScreen
            title="Create Account"
            description="Join WorkoutAssist today."
            nextRoute="Welcome"
            nextLabel="Back"
            navigation={navigation}
        />
    );
};
