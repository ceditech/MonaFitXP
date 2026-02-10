
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl,
    Dimensions
} from 'react-native';
import { Colors } from '../../shared/ui/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutRepo } from '../../repositories';
import { useSession } from '../../session/SessionProvider';
import { UserMetrics, Exercise } from '../../data/contracts/IWorkoutRepository';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 3;

export const ProgressDashboardScreen = ({ navigation }: any) => {
    const { session } = useSession();
    const repo = useWorkoutRepo();
    const [metrics, setMetrics] = useState<UserMetrics | null>(null);
    const [exercises, setExercises] = useState<Record<string, Exercise>>({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        if (!session.uid) return;
        try {
            setError(null);
            const [metricsData, exercisesData] = await Promise.all([
                repo.getMetrics(session.uid),
                repo.getExercises()
            ]);

            // Convert exercise list to map for fast lookup
            const exMap: Record<string, Exercise> = {};
            exercisesData.forEach(ex => {
                exMap[ex.id] = ex;
            });

            setMetrics(metricsData);
            setExercises(exMap);
        } catch (err) {
            console.error('[ProgressDashboard] load error:', err);
            setError('Failed to load metrics. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [session.uid, repo]);

    useEffect(() => {
        loadData();
        console.log('[Analytics] progress_viewed');
    }, [loadData]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handlePROpen = (exerciseId: string) => {
        console.log(`[Analytics] pr_opened: ${exerciseId}`);
        navigation.navigate('ExerciseDetail', { exerciseId });
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.brandPurple} />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Ionicons name="trending-up" size={64} color="rgba(255,255,255,0.1)" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brandPurple} />
                }
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Progress</Text>
                    <Text style={styles.subtitle}>Your fitness achievements at a glance</Text>
                </View>

                {/* KPI Cards */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Ionicons name="flame" size={24} color="#FF9500" />
                        <Text style={styles.statValue}>{metrics?.streakDays || 0}</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="calendar" size={24} color={Colors.brandPurple} />
                        <Text style={styles.statValue}>{metrics?.workoutsThisWeek || 0}</Text>
                        <Text style={styles.statLabel}>This Week</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="barbell" size={24} color="#BA68C8" />
                        <Text style={styles.statValue}>
                            {(metrics?.weeklyVolume || 0) > 1000
                                ? `${((metrics?.weeklyVolume || 0) / 1000).toFixed(1)}k`
                                : metrics?.weeklyVolume || 0}
                        </Text>
                        <Text style={styles.statLabel}>Volume</Text>
                    </View>
                </View>

                {/* PR Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="trophy" size={20} color={Colors.brandPurple} />
                        <Text style={styles.sectionTitle}>Personal Records</Text>
                    </View>

                    {!metrics?.prs || metrics.prs.length === 0 ? (
                        <View style={styles.emptyPRContainer}>
                            <Ionicons name="lock-closed" size={32} color="rgba(255,255,255,0.05)" />
                            <Text style={styles.emptyPRText}>Log workouts to unlock your personal records!</Text>
                        </View>
                    ) : (
                        metrics.prs.map((pr, index) => {
                            const exercise = exercises[pr.exerciseId];
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.prItem}
                                    onPress={() => handlePROpen(pr.exerciseId)}
                                >
                                    <View style={styles.prInfo}>
                                        <Text style={styles.prExerciseName}>
                                            {exercise ? exercise.name : 'Unknown Exercise'}
                                        </Text>
                                        <View style={styles.prBadge}>
                                            <Text style={styles.prDetail}>
                                                {pr.bestWeight ? `${pr.bestWeight} kg` : ''}
                                                {pr.bestWeight && pr.bestReps ? ' x ' : ''}
                                                {pr.bestReps ? `${pr.bestReps} reps` : ''}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.prRight}>
                                        <Text style={styles.prDate}>
                                            {new Date(pr.achievedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </Text>
                                        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>

                {/* Volume Chart */}
                <View style={[styles.section, { marginBottom: 40 }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="trending-up" size={20} color={Colors.brandPurple} />
                        <Text style={styles.sectionTitle}>Volume Over Time</Text>
                    </View>

                    <View style={styles.chartCard}>
                        <View style={styles.chartBody}>
                            {(metrics?.volumeHistory || []).map((day, idx) => {
                                const maxVol = Math.max(...(metrics?.volumeHistory?.map(h => h.volume) || [1]));
                                const height = maxVol > 0 ? (day.volume / maxVol) * 100 : 5;

                                // Parse YYYY-MM-DD as local date to avoid 1-day shift
                                const [y, m, d] = day.date.split('-').map(Number);
                                const dateObj = new Date(y, m - 1, d);
                                const dayLabel = dateObj.toLocaleDateString(undefined, { weekday: 'short' })[0];

                                return (
                                    <View key={idx} style={styles.chartCol}>
                                        <View style={styles.barContainer}>
                                            <View style={[styles.bar, { height: `${Math.max(height, 5)}%`, opacity: height > 10 ? 1 : 0.3 }]} />
                                        </View>
                                        <Text style={styles.chartLabel}>{dayLabel}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={styles.chartFooter}>
                            <Text style={styles.chartFooterText}>Last 7 Days (Total Volume per session)</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        width: COLUMN_WIDTH,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
    },
    prItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    prInfo: {
        flex: 1,
    },
    prExerciseName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
        marginBottom: 4,
    },
    prBadge: {
        backgroundColor: 'rgba(142, 36, 170, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    prDetail: {
        fontSize: 14,
        color: Colors.brandPurple,
        fontWeight: '700',
    },
    prRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    prDate: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
        marginRight: 8,
    },
    emptyPRContainer: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 24,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    emptyPRText: {
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        fontSize: 14,
        marginTop: 12,
    },
    chartCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    chartBody: {
        flexDirection: 'row',
        height: 160,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingBottom: 8,
    },
    chartCol: {
        flex: 1,
        alignItems: 'center',
    },
    barContainer: {
        flex: 1,
        width: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 6,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        backgroundColor: Colors.brandPurple,
        borderRadius: 6,
    },
    chartLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 12,
    },
    chartFooter: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    chartFooterText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        textAlign: 'center',
    },
    errorText: {
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: Colors.brandPurple,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
