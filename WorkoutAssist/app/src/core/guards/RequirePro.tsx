
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useEntitlement } from '../entitlements/EntitlementProvider';
import { Colors } from '../../shared/ui/Theme';
import { useNavigation } from '@react-navigation/native';

interface RequireProProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Higher-Order Component/Guard to protect Pro-only features.
 * Redirects to Upgrade screen if user is not Pro.
 */
export const RequirePro: React.FC<RequireProProps> = ({ children, fallback }) => {
    const { isPro, loading } = useEntitlement();
    const navigation = useNavigation<any>();

    React.useEffect(() => {
        if (!loading && !isPro) {
            console.log('[RequirePro] Not Pro, redirecting to Upgrade');
            navigation.navigate('Upgrade', { reason: 'pro_required' });
        }
    }, [loading, isPro, navigation]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Verifying plan...</Text>
            </View>
        );
    }

    if (!isPro) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.brandDarkBlue,
    },
    loadingText: {
        marginTop: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
    },
});
