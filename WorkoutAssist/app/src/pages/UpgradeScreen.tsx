
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors } from '../shared/ui/Theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEntitlement } from '../core/entitlements/EntitlementProvider';

export const UpgradeScreen = ({ route, navigation }: any) => {
    const { entitlement } = useEntitlement();
    const { reason } = route.params || {};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <MaterialCommunityIcons name="crown" size={64} color={Colors.brandPurple} />
                    <Text style={styles.title}>Unlock MonaFit XP Pro</Text>
                    {reason === 'pro_required' && (
                        <View style={styles.reasonBadge}>
                            <Text style={styles.reasonText}>Pro Required for this feature</Text>
                        </View>
                    )}
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.currentPlanText}>
                        Current Plan: <Text style={styles.planName}>{entitlement.plan}</Text>
                    </Text>
                </View>

                <View style={styles.features}>
                    <View style={styles.featureItem}>
                        <Ionicons name="sparkles" size={20} color={Colors.brandPurple} />
                        <Text style={styles.featureText}>AI Coach Personalized Guidance</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="sparkles" size={20} color={Colors.brandPurple} />
                        <Text style={styles.featureText}>Unlimited Workout Generations</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="sparkles" size={20} color={Colors.brandPurple} />
                        <Text style={styles.featureText}>Advanced Progress Analytics</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => console.log('Stripe flow coming soon')}>
                        <Text style={styles.primaryBtnText}>Upgrade Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.secondaryBtnText}>Maybe Later</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        marginTop: 16,
        textAlign: 'center',
    },
    reasonBadge: {
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 12,
    },
    reasonText: {
        color: Colors.brandPurple,
        fontSize: 14,
        fontWeight: '700',
    },
    infoBox: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 30,
        alignItems: 'center',
    },
    currentPlanText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
    },
    planName: {
        color: '#fff',
        fontWeight: '800',
    },
    features: {
        width: '100%',
        marginBottom: 40,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: 12,
        borderRadius: 12,
    },
    featureText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 12,
        fontWeight: '500',
    },
    footer: {
        width: '100%',
    },
    primaryBtn: {
        backgroundColor: Colors.brandPurple,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    secondaryBtn: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    secondaryBtnText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 16,
        fontWeight: '600',
    },
});
