import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useSession } from '../../session/SessionProvider';
import { useWorkoutRepo } from '../../repositories';
import { Colors } from '../../shared/ui/Theme';
import { UserProfile, GamificationState } from '../../data/contracts/IWorkoutRepository';
import { LevelRing } from '../gamification/LevelRing';

export const HomeTodayScreen = ({ navigation }: any) => {
    const { session, signOut } = useSession();
    const repo = useWorkoutRepo();

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activePlan, setActivePlan] = useState<any | null>(null);
    const [metrics, setMetrics] = useState<any>(null);
    const [gamification, setGamification] = useState<GamificationState | null>(null);

    const loadData = async () => {
        if (!session.uid) return;
        try {
            const [p, plan, m, g] = await Promise.all([
                repo.getUserProfile(session.uid),
                repo.getActivePlan(session.uid),
                repo.getMetrics(session.uid),
                repo.getGamification(session.uid).catch(() => null)
            ]);
            setProfile(p);
            setActivePlan(plan);
            setMetrics(m);
            setGamification(g);
        } catch (error) {
            console.error('Error loading home data:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        console.log('[Analytics] home_viewed');
        loadData();
    }, [session.uid]);

    const onRefresh = () => {
        setIsRefreshing(true);
        loadData();
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.brandPurple} />
            </View>
        );
    }

    const renderAction = (title: string, icon: string, route: string, color: string) => (
        <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
                console.log(`[Analytics] quick_action_clicked: ${title}`);
                navigation.navigate(route);
            }}
        >
            <View style={[styles.actionIconContainer, { backgroundColor: `${color}20` }]}>
                <Text style={{ color, fontSize: 24 }}>{icon}</Text>
            </View>
            <Text style={styles.actionLabel}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={Colors.brandPurple} />
                }
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Ready for your workout?</Text>
                        <Text style={styles.userName}>{profile?.name || 'Guest User'}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        {gamification && <LevelRing totalXp={gamification.totalXp} />}
                        {profile?.goal && (
                            <View style={styles.goalChip}>
                                <Text style={styles.goalText}>{profile.goal.replace('_', ' ').toUpperCase()}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {session.mode === 'guest' && (
                    <TouchableOpacity
                        style={styles.guestBanner}
                        onPress={() => navigation.navigate('SignUp')}
                    >
                        <View style={styles.guestBannerContent}>
                            <Text style={styles.guestBannerTitle}>Unlock Full Potential 🚀</Text>
                            <Text style={styles.guestBannerText}>Create an account to save your progress and sync across devices.</Text>
                        </View>
                        <View style={styles.guestBannerBtn}>
                            <Text style={styles.guestBannerBtnText}>Sign Up</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Metrics Widget */}
                <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricVal}>{metrics?.streakDays || 0}</Text>
                        <Text style={styles.metricLabel}>Day Streak</Text>
                    </View>
                    <View style={styles.metricDivider} />
                    <View style={styles.metricItem}>
                        <Text style={styles.metricVal}>{metrics?.workoutsThisWeek || 0}</Text>
                        <Text style={styles.metricLabel}>Completed</Text>
                    </View>
                </View>

                {/* Main Hero Card */}
                <View style={styles.heroSection}>
                    {activePlan ? (
                        <TouchableOpacity
                            style={styles.heroCard}
                            onPress={() => {
                                console.log('[HomeTodayScreen] Navigating to WorkoutPlayer', { planId: activePlan.templateId });
                                navigation.navigate('WorkoutPlayer', { planId: activePlan.templateId });
                            }}
                            activeOpacity={0.9}
                        >
                            <View style={styles.heroTag}>
                                <Text style={styles.heroTagText}>TODAY'S WORKOUT</Text>
                            </View>
                            <Text style={styles.heroTitle}>{activePlan.name}</Text>
                            <View style={styles.heroMeta}>
                                <Text style={styles.heroMetaText}>🕒 {activePlan.sessionMinutes || profile?.sessionMinutes || 45}m</Text>
                                <Text style={styles.heroMetaText}>⚡ {activePlan.blocks?.length || 0} Exercises</Text>
                            </View>
                            <View style={styles.heroBtn}>
                                <Text style={styles.heroBtnText}>Start Workout</Text>
                                <Text style={{ color: 'white', fontSize: 18, marginLeft: 8 }}>{'>'}</Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.heroCard, styles.heroCardEmpty]}
                            onPress={() => navigation.navigate('PlanTemplates')}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.heroTitleEmpty}>No Active Plan</Text>
                            <Text style={styles.heroSubEmpty}>Find a specialized training plan to reach your goals faster.</Text>
                            <View style={styles.heroBtnSecondary}>
                                <Text style={styles.heroBtnText}>Browse Plans</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Quick Actions Grid */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    <View style={styles.actionsRow}>
                        {renderAction('Exercises', '📚', 'ExerciseCatalog', '#4FC3F7')}
                        {renderAction('Plans', '📋', 'PlanTemplates', '#FFB74D')}
                    </View>
                    <View style={styles.actionsRow}>
                        {renderAction('Progress', '📈', 'ProgressDashboard', '#BA68C8')}
                        {renderAction('Settings', '⚙️', 'Settings', '#90A4AE')}
                    </View>
                </View>

                {/* Dev Logout - Temporary */}
                <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Logout (Dev)</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue || '#0a0a1a',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue || '#0a0a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scroll: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 32,
    },
    headerRight: {
        alignItems: 'center',
        gap: 8,
    },
    greeting: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        fontWeight: '500',
    },
    userName: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.5,
        marginTop: 4,
    },
    goalChip: {
        backgroundColor: 'rgba(142, 36, 170, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(142, 36, 170, 0.4)',
    },
    goalText: {
        color: Colors.brandPurple,
        fontSize: 11,
        fontWeight: '700',
    },
    metricsRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 32,
    },
    metricItem: {
        flex: 1,
        alignItems: 'center',
    },
    metricVal: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '800',
    },
    metricLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        marginTop: 4,
    },
    metricDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 4,
    },
    heroSection: {
        marginBottom: 32,
    },
    heroCard: {
        backgroundColor: Colors.brandPurple,
        borderRadius: 32,
        padding: 28,
        shadowColor: Colors.brandPurple,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    heroCardEmpty: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.08)',
        borderStyle: 'dashed',
        shadowOpacity: 0,
        elevation: 0,
    },
    heroTag: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 16,
    },
    heroTagText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
    },
    heroTitle: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 12,
    },
    heroTitleEmpty: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    heroSubEmpty: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 24,
    },
    heroMeta: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    heroMetaText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
    },
    heroBtn: {
        backgroundColor: '#fff',
        height: 56,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroBtnSecondary: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroBtnText: {
        color: Colors.brandDarkBlue,
        fontSize: 17,
        fontWeight: '700',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
    },
    actionsGrid: {
        gap: 16,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    actionCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionLabel: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    logoutBtn: {
        marginTop: 40,
        padding: 16,
        alignItems: 'center',
    },
    logoutText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 14,
        fontWeight: '600',
    },
    guestBanner: {
        backgroundColor: 'rgba(142, 36, 170, 0.15)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 32,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(142, 36, 170, 0.3)',
    },
    guestBannerContent: {
        flex: 1,
        marginRight: 12,
    },
    guestBannerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    guestBannerText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        lineHeight: 18,
    },
    guestBannerBtn: {
        backgroundColor: Colors.brandPurple,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    guestBannerBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
});
