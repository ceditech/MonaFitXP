
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEntitlement } from '../entitlements/EntitlementProvider';
import { PlanTier, effectiveTier, meetsTier } from '../entitlements/entitlement.model';
import { Colors } from '../../shared/ui/Theme';

interface RequireTierProps {
    minTier: PlanTier;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Guard for tier-gated features. Redirects to the Upgrade screen when the
 * user's effective tier (paid tiers only count while status is active/trialing)
 * doesn't meet `minTier`. Pro satisfies Plus requirements.
 */
export const RequireTier: React.FC<RequireTierProps> = ({ minTier, children, fallback }) => {
    const { entitlement, loading } = useEntitlement();
    const navigation = useNavigation<any>();

    const hasAccess = meetsTier(effectiveTier(entitlement), minTier);

    React.useEffect(() => {
        if (!loading && !hasAccess) {
            console.log(`[RequireTier] Tier below "${minTier}", redirecting to Upgrade`);
            navigation.navigate('Upgrade', { reason: `${minTier}_required` });
        }
    }, [loading, hasAccess, minTier, navigation]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Verifying plan...</Text>
            </View>
        );
    }

    if (!hasAccess) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
};

/** Guard for Plus-and-above features. */
export const RequirePlus: React.FC<Omit<RequireTierProps, 'minTier'>> = (props) => (
    <RequireTier minTier="plus" {...props} />
);

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
