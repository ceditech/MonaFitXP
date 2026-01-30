
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
                    <ActivityIndicator size="large" color={Colors.primary} />
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
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
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
                        <Ionicons name="calendar" size={24} color={Colors.primary} />
                        <Text style={styles.statValue}>{metrics?.workoutsThisWeek || 0}</Text>
                        <Text style={styles.statLabel}>This Week</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="barbell" size={24} color="#5856D6" />
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
                        <Ionicons name="trophy" size={20} color={Colors.primary} />
                        <Text style={styles.sectionTitle}>Personal Records</Text>
                    </View>

                    {!metrics?.prs || metrics.prs.length === 0 ? (
                        <View style={styles.emptyPRContainer}>
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
                                        <Text style={styles.prDetail}>
                                            {pr.bestWeight ? `${pr.bestWeight} kg` : ''}
                                            {pr.bestWeight && pr.bestReps ? ' x ' : ''}
                                            {pr.bestReps ? `${pr.bestReps} reps` : ''}
                                        </Text>
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

                {/* Placeholder for future Charts */}
                <View style={[styles.section, { marginBottom: 40 }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="trending-up" size={20} color={Colors.primary} />
                        <Text style={styles.sectionTitle}>Volume Over Time</Text>
                    </View>
                    <View style={styles.chartPlaceholder}>
                        <Text style={styles.chartPlaceholderText}>Detailed charts coming soon</Text>
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
    prDetail: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
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
        borderRadius: 12,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    emptyPRText: {
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
        fontSize: 14,
    },
    chartPlaceholder: {
        height: 150,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    chartPlaceholderText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 14,
    },
    errorText: {
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
