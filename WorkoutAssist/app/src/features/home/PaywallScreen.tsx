
// app/src/features/home/PaywallScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StyleSheet
} from 'react-native';
import { Colors } from '../../shared/ui/Theme';

interface PricingCardProps {
    tier: string;
    price: string;
    badge?: string;
    benefits: string[];
    onUpgrade?: () => void;
    isCurrent?: boolean;
    isRecommended?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
    tier,
    price,
    badge,
    benefits,
    onUpgrade,
    isCurrent,
    isRecommended
}) => (
    <View style={[styles.card, isRecommended && styles.cardRecommended]}>
        {badge && (
            <View style={[
                styles.badge,
                isCurrent && styles.badgeCurrent,
                isRecommended && styles.badgeRecommended
            ]}>
                <Text style={styles.badgeText}>{badge}</Text>
            </View>
        )}
        <Text style={styles.tierName}>{tier}</Text>
        <View style={styles.priceRow}>
            <Text style={styles.price}>{price}</Text>
            <Text style={styles.priceUnit}>/month</Text>
        </View>
        <View style={styles.benefits}>
            {benefits.map((benefit, idx) => (
                <View key={idx} style={styles.benefitRow}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.benefit}>{benefit}</Text>
                </View>
            ))}
        </View>
        {onUpgrade && (
            <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
                <Text style={styles.upgradeButtonText}>Upgrade to {tier}</Text>
            </TouchableOpacity>
        )}
    </View>
);

export const PaywallScreen = ({ route, navigation }: any) => {
    const { source, templateId } = route?.params || {};
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        console.log('[Analytics] paywall_viewed', { source: source || 'unknown' });
    }, [source]);

    const handleUpgrade = (tier: 'plus' | 'pro') => {
        console.log('[Analytics] upgrade_clicked', { tier });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleDismiss = () => {
        console.log('[Analytics] paywall_dismissed', { source: source || 'unknown' });
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Upgrade to Premium</Text>
                    {templateId && (
                        <Text style={styles.subtitle}>
                            This plan requires a premium subscription
                        </Text>
                    )}
                </View>

                {/* Pricing Cards */}
                <View style={styles.cardsContainer}>
                    <PricingCard
                        tier="Free"
                        price="$0"
                        badge="Current Plan"
                        benefits={[
                            '3 workout templates',
                            'Basic exercise catalog',
                            'Workout history'
                        ]}
                        isCurrent
                    />
                    <PricingCard
                        tier="Plus"
                        price="$9.99"
                        badge="Recommended"
                        benefits={[
                            'All Free features',
                            '20+ premium templates',
                            'Advanced analytics',
                            'Custom workout builder',
                            'Priority support'
                        ]}
                        onUpgrade={() => handleUpgrade('plus')}
                        isRecommended
                    />
                    <PricingCard
                        tier="Pro"
                        price="$19.99"
                        benefits={[
                            'All Plus features',
                            'Unlimited templates',
                            'AI-powered recommendations',
                            'Nutrition tracking',
                            '1-on-1 coaching'
                        ]}
                        onUpgrade={() => handleUpgrade('pro')}
                    />
                </View>

                {/* Footer */}
                <TouchableOpacity onPress={handleDismiss} style={styles.notNowButton}>
                    <Text style={styles.notNowText}>Not now</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Toast */}
            {showToast && (
                <View style={styles.toast}>
                    <Text style={styles.toastText}>Coming soon! Payment integration pending.</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
    },
    cardsContainer: {
        gap: 16,
        marginBottom: 24,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardRecommended: {
        borderColor: Colors.primary,
        borderWidth: 2,
        backgroundColor: 'rgba(255,107,53,0.05)',
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 12,
    },
    badgeCurrent: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    badgeRecommended: {
        backgroundColor: Colors.primary,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
        textTransform: 'uppercase',
    },
    tierName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 20,
    },
    price: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff',
    },
    priceUnit: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        marginLeft: 4,
    },
    benefits: {
        gap: 12,
        marginBottom: 20,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkmark: {
        fontSize: 16,
        color: Colors.primary,
        marginRight: 8,
        marginTop: 2,
    },
    benefit: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        flex: 1,
    },
    upgradeButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    upgradeButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    notNowButton: {
        alignItems: 'center',
        padding: 16,
    },
    notNowText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        textDecorationLine: 'underline',
    },
    toast: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    toastText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
});
