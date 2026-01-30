import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { Colors } from '../../shared/ui/Theme';
import { useWorkoutRepo } from '../../repositories';
import { useSession } from '../../session/SessionProvider';
import { InProgressWorkout } from '../../data/contracts/IWorkoutRepository';

export const WorkoutHistoryScreen = ({ navigation }: any) => {
    const { session } = useSession();
    const uid = session.uid || '';
    const repo = useWorkoutRepo();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [history, setHistory] = useState<InProgressWorkout[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadHistory = useCallback(async (isRefreshing = false) => {
        try {
            if (!isRefreshing) setLoading(true);
            setError(null);

            if (!uid) {
                console.warn('[WorkoutHistoryScreen] No UID available yet');
                return;
            }

            const list = await repo.listWorkouts(uid, { status: 'completed' });
            setHistory(list);
        } catch (e: any) {
            console.error('[WorkoutHistoryScreen] Error loading history:', e);
            setError(`Failed to load history: ${e?.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [uid, repo]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const onRefresh = () => {
        setRefreshing(true);
        loadHistory(true);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const renderItem = ({ item }: { item: InProgressWorkout }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('WorkoutSummary', { workoutId: item.id })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.dateText}>{formatDate(item.startedAt)}</Text>
                <Text style={styles.titleText}>{item.name}</Text>
            </View>

            <View style={styles.metricsRow}>
                <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Duration</Text>
                    <Text style={styles.metricValue}>{formatDuration(item.pausedElapsedSeconds || 0)}</Text>
                </View>
                <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Sets</Text>
                    <Text style={styles.metricValue}>{item.sets.filter(s => s.completedAt).length}</Text>
                </View>
                <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Volume</Text>
                    <Text style={styles.metricValue}>
                        {item.sets.reduce((sum, s) => sum + ((s.actualWeight || 0) * (s.actualReps || 0)), 0)} kg
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.brandPurple} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>History</Text>
            </View>

            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Complete a workout to see it here.</Text>
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => navigation.navigate('HomeToday')}
                        >
                            <Text style={styles.emptyButtonText}>Start Workout</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
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
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardHeader: {
        marginBottom: 12,
    },
    dateText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    titleText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 2,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        paddingTop: 12,
    },
    metric: {
        alignItems: 'center',
    },
    metricLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    metricValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        marginTop: 2,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: Colors.brandPurple,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    emptyButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
});
