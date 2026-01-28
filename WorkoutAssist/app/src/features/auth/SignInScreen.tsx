
// app/src/features/auth/SignInScreen.tsx
import React from 'react';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';

export const SignInScreen = ({ navigation }: any) => {
    return (
        <PlaceholderScreen
            title="Sign In"
            description="Enter your credentials to access your account."
            nextRoute="Welcome"
            nextLabel="Back"
            navigation={navigation}
        />
    );
};
