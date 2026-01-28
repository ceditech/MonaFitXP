
// app/src/features/home/SettingsScreen.tsx
import React from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PlaceholderScreen } from '../../shared/ui/PlaceholderScreen';
import { useSession } from '../../app/context/SessionContext';

interface Props {
    navigation: NativeStackNavigationProp<any>;
}

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
    const { signOut } = useSession();

    return (
        <PlaceholderScreen
            title="Settings"
            description="App configuration."
            action={() => navigation.navigate('NotificationPrefs')}
            actionLabel="Notification Preferences"
            navigation={navigation}
        />
    );
    // Add Logout button in real implementation
};
