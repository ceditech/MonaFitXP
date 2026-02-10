
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '../../shared/ui/Theme';
import { useWorkoutRepo } from '../../repositories';
import { useSession } from '../../session/SessionProvider';
import { InProgressWorkout, WorkoutSessionSet } from '../../data/contracts/IWorkoutRepository';

export const WorkoutSummaryScreen = ({ route, navigation }: any) => {
    console.log('[WorkoutSummaryScreen] Mounting with params:', route.params);
    const { workoutId } = route.params || {};
    const { session } = useSession();
    const uid = session.uid || '';
    const repo = useWorkoutRepo();

    const [loading, setLoading] = useState(true);
    const [workout, setWorkout] = useState<InProgressWorkout | null>(null);
    const [exercises, setExercises] = useState<Record<string, any>>({});
    const [error, setError] = useState<string | null>(null);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (workoutId && uid) {
            loadData();
        } else {
            console.warn('[WorkoutSummaryScreen] Missing workoutId or uid:', { workoutId, uid });
            if (!workoutId) setError('Missing workout ID');
        }
    }, [workoutId, uid]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [workoutData, catalog] = await Promise.all([
                repo.getWorkout(uid, workoutId),
                repo.getExercises()
            ]);

            if (!workoutData) {
                setError('Workout not found');
            } else {
                setWorkout(workoutData);

                // Map catalog for easy lookup
                const exerciseMap: Record<string, any> = {};
                catalog.forEach((ex: any) => {
                    exerciseMap[ex.id] = ex;
                });
                setExercises(exerciseMap);
            }
        } catch (e) {
            console.error('[WorkoutSummaryScreen] Error loading data:', e);
            setError('Failed to load summary');
        } finally {
            setLoading(false);
        }
    };

    // --- Calculations ---
    const summary = useMemo(() => {
        if (!workout) {
            console.log('[WorkoutSummaryScreen] summary useMemo: no workout');
            return null;
        }

        // Use pre-calculated summary if available
        const ws = (workout as any).summary;

        if (ws && !workout.sets) {
            return {
                durationDisplay: formatDuration(ws.durationSeconds || 0),
                totalSets: ws.totalSets || 0,
                totalVolume: ws.totalVolume || 0,
                recap: [] // Can't recap without sets, but at least won't crash
            };
        }

        if (!workout.sets) {
            console.log('[WorkoutSummaryScreen] summary useMemo: workout.sets is missing');
            return null;
        }

        const completedSets = workout.sets.filter(s => s.completedAt);
        const totalVolume = completedSets.reduce((sum, s) => sum + ((s.actualWeight || 0) * (s.actualReps || 0)), 0);

        // Final duration from summary or secondsElapsed
        const durationSeconds = ws?.durationSeconds || workout.pausedElapsedSeconds || 0;
        const durationDisplay = formatDuration(durationSeconds);

        // Grouping sets by exercise
        const recap: Record<string, { name: string, sets: WorkoutSessionSet[], bestSet: WorkoutSessionSet | null }> = {};

        workout.sets.forEach(set => {
            if (!recap[set.exerciseId]) {
                recap[set.exerciseId] = {
                    name: exercises[set.exerciseId]?.name || 'Unknown Exercise',
                    sets: [],
                    bestSet: null
                };
            }
            recap[set.exerciseId].sets.push(set);

            // Best set logic: highest volume
            const currentVolume = (set.actualWeight || 0) * (set.actualReps || 0);
            const bestVolume = recap[set.exerciseId].bestSet
                ? (recap[set.exerciseId].bestSet!.actualWeight || 0) * (recap[set.exerciseId].bestSet!.actualReps || 0)
                : -1;

            if (currentVolume > bestVolume) {
                recap[set.exerciseId].bestSet = set;
            }
        });

        return {
            durationDisplay,
            totalSets: ws?.totalSets ?? completedSets.length,
            totalVolume: ws?.totalVolume ?? totalVolume,
            recap: Object.values(recap)
        };
    }, [workout, exercises]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.brandPurple} />
                </View>
            </SafeAreaView>
        );
    }

    if (error || !workout) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error || 'Something went wrong'}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={loadData}>
                        <Text style={styles.retryBtnText}>Retry</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backBtnText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Workout Complete!</Text>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                </View>

                {summary && (
                    <>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryValue}>{summary.durationDisplay}</Text>
                                <Text style={styles.summaryLabel}>Duration</Text>
                            </View>
                            <View style={[styles.summaryCard, styles.summaryCardMain]}>
                                <Text style={styles.summaryValue}>{summary.totalSets}</Text>
                                <Text style={styles.summaryLabel}>Total Sets</Text>
                            </View>
                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryValue}>{summary.totalVolume}</Text>
                                <Text style={styles.summaryLabel}>Volume (kg)</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Exercise Recap</Text>
                        {summary.recap.map((item, idx) => (
                            <View key={idx} style={styles.recapCard}>
                                <Text style={styles.recapExerciseName}>{item.name}</Text>
                                <View style={styles.recapStats}>
                                    <Text style={styles.recapText}>{item.sets.length} Sets Completed</Text>
                                    {item.bestSet && (
                                        <Text style={styles.bestSetText}>
                                            Best: {item.bestSet.actualWeight}kg x {item.bestSet.actualReps}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </>
                )}

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.doneBtn}
                        onPress={() => navigation.navigate('Main', { screen: 'MainTabs', params: { screen: 'WorkoutHistory' } })}
                    >
                        <Text style={styles.doneBtnText}>Done</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeBtn}
                        onPress={() => navigation.navigate('Main', { screen: 'MainTabs', params: { screen: 'HomeToday' } })}
                    >
                        <Text style={styles.homeBtnText}>Back to Home</Text>
                    </TouchableOpacity>
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
        padding: 24,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
    },
    workoutName: {
        color: Colors.brandPurple,
        fontSize: 18,
        fontWeight: '600',
        marginTop: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 16,
        alignItems: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    summaryCardMain: {
        borderColor: Colors.brandPurple,
        borderWidth: 1,
    },
    summaryValue: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        marginTop: 2,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 15,
    },
    recapCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    recapExerciseName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },
    recapStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recapText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    bestSetText: {
        color: Colors.brandPurple,
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        marginTop: 20,
    },
    doneBtn: {
        backgroundColor: Colors.brandPurple,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: Colors.brandPurple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    doneBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    homeBtn: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    homeBtnText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 18,
        marginBottom: 20,
    },
    retryBtn: {
        backgroundColor: Colors.brandPurple,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    retryBtnText: {
        color: '#fff',
        fontWeight: '700',
    },
    backBtn: {
        padding: 10,
    },
    backBtnText: {
        color: 'rgba(255,255,255,0.4)',
    }
});
