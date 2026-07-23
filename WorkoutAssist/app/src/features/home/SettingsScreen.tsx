
// app/src/features/home/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSession } from '../../session/SessionProvider';
import { Colors, Spacing, Typography } from '../../shared/ui/Theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MainStackParamList } from '../../app/navigation/Routes';
import { requestDataExport, deliverExport } from '../../data/accountApi';
import { showAlert } from '../../shared/ui/showAlert';

interface Props {
    navigation: NativeStackNavigationProp<MainStackParamList>;
}

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
    const { session, signOut } = useSession();
    const isGuest = session.mode === 'guest';
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const data = await requestDataExport();
            await deliverExport(data);
        } catch (e) {
            showAlert('Export failed', 'Could not export your data. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const renderSettingItem = (
        title: string,
        icon: keyof typeof Ionicons.glyphMap,
        onPress: () => void,
        color: string = Colors.white,
        subtitle?: string
    ) => (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{title}</Text>
                {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.title}>Settings</Text>
                </View>

                {isGuest && (
                    <View style={styles.promoCard}>
                        <LinearGradient
                            colors={[Colors.brandPurple, '#7B1FA2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.promoGradient}
                        >
                            <View style={styles.promoContent}>
                                <Ionicons name="cloud-upload" size={32} color="#fff" style={styles.promoIcon} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.promoTitle}>Save Your Progress</Text>
                                    <Text style={styles.promoText}>Create an account to sync your workouts and unlock pro features.</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.promoBtn}
                                onPress={() => navigation.navigate('SignUp')}
                            >
                                <Text style={styles.promoBtnText}>Create Account</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>ACCOUNT</Text>
                    {renderSettingItem(
                        'Notification Preferences',
                        'notifications-outline',
                        () => navigation.navigate('NotificationPrefs'),
                        '#4FC3F7'
                    )}
                    {renderSettingItem(
                        'Premium Subscription',
                        'star-outline',
                        () => navigation.navigate('Upgrade', { reason: 'settings' }),
                        '#FFB74D'
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>APP</Text>
                    {renderSettingItem(
                        'Health & Safety Disclaimer',
                        'fitness-outline',
                        () => navigation.navigate('Legal', { doc: 'disclaimer' }),
                        '#90A4AE'
                    )}
                    {renderSettingItem(
                        'Privacy Policy',
                        'shield-checkmark-outline',
                        () => navigation.navigate('Legal', { doc: 'privacy' }),
                        '#90A4AE'
                    )}
                    {renderSettingItem(
                        'Terms of Service',
                        'document-text-outline',
                        () => navigation.navigate('Legal', { doc: 'terms' }),
                        '#90A4AE'
                    )}
                </View>

                {!isGuest && (
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>DATA & PRIVACY</Text>
                        <TouchableOpacity style={styles.item} onPress={handleExport} disabled={isExporting}>
                            <View style={[styles.iconContainer, { backgroundColor: '#4DB6AC15' }]}>
                                {isExporting ? (
                                    <ActivityIndicator size="small" color="#4DB6AC" />
                                ) : (
                                    <Ionicons name="download-outline" size={22} color="#4DB6AC" />
                                )}
                            </View>
                            <View style={styles.itemContent}>
                                <Text style={styles.itemTitle}>Export My Data</Text>
                                <Text style={styles.itemSubtitle}>Download everything we store about you</Text>
                            </View>
                        </TouchableOpacity>
                        {renderSettingItem(
                            'Delete Account',
                            'trash-outline',
                            () => navigation.navigate('DeleteAccount'),
                            '#FF5252',
                            'Permanently erase your account and data'
                        )}
                    </View>
                )}

                <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
                    <Ionicons name="log-out-outline" size={20} color="#FF5252" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>{isGuest ? 'Exit Guest Mode' : 'Log Out'}</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.versionText}>Version 1.0.0 (Beta)</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a1a',
    },
    scroll: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        marginTop: 20,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
    },
    promoCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 32,
    },
    promoGradient: {
        padding: 20,
    },
    promoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    promoIcon: {
        marginRight: 16,
    },
    promoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    promoText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 18,
    },
    promoBtn: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    promoBtnText: {
        color: Colors.brandPurple,
        fontSize: 15,
        fontWeight: '700',
    },
    section: {
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 1.5,
        marginBottom: 16,
        marginLeft: 4,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 14,
        borderRadius: 16,
        marginBottom: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    itemSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 2,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        padding: 16,
        borderRadius: 16,
        marginTop: 10,
    },
    logoutText: {
        color: '#FF5252',
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.2)',
        fontWeight: '500',
    },
});
