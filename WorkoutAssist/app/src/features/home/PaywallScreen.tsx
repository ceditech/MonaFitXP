
// app/src/features/home/PaywallScreen.tsx
import React from 'react';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';

export const PaywallScreen = ({ navigation }: any) => {
    return (
        <PlaceholderScreen
            title="Premium Access"
            description="Upgrade to unlock features."
            action={() => navigation.goBack()}
            actionLabel="Not Now"
            navigation={navigation}
        />
    );
};
