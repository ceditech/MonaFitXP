import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { Colors } from '../../shared/ui/Theme';
import { useWorkoutRepo } from '../../repositories';
import { useSession } from '../../session/SessionProvider';
import { InProgressWorkout, WorkoutSessionSet, Exercise } from '../../data/contracts/IWorkoutRepository';

export const WorkoutDetailScreen = ({ route, navigation }: any) => {
    const { workoutId } = route.params || {};
    const { session } = useSession();
    const uid = session.uid || '';
    const repo = useWorkoutRepo();

    const [loading, setLoading] = useState(true);
    const [workout, setWorkout] = useState<InProgressWorkout | null>(null);
    const [exercises, setExercises] = useState<Record<string, Exercise>>({});
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [workoutData, exerciseList] = await Promise.all([
                repo.getWorkout(uid, workoutId),
                repo.getExercises()
            ]);

            if (!workoutData) {
                setError('Workout not found');
            } else {
                setWorkout(workoutData);

                const exerciseMap: Record<string, Exercise> = {};
                exerciseList.forEach(ex => {
                    exerciseMap[ex.id] = ex;
                });
                setExercises(exerciseMap);
            }
        } catch (e: any) {
            console.error('[WorkoutDetailScreen] Error loading data:', e);
            setError(`Failed to load details: ${e?.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    }, [uid, workoutId, repo]);

    useEffect(() => {
        if (workoutId) {
            loadData();
        } else {
            setError('No workout ID provided');
            setLoading(false);
        }
    }, [workoutId, loadData]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Group sets by exercise
    const groupedSets = useMemo(() => {
        if (!workout || !workout.sets) return [];

        const groups: Record<string, { exercise: Exercise | null, sets: WorkoutSessionSet[] }> = {};

        workout.sets.forEach(set => {
            if (!groups[set.exerciseId]) {
                groups[set.exerciseId] = {
                    exercise: exercises[set.exerciseId] || null,
                    sets: []
                };
            }
            groups[set.exerciseId].sets.push(set);
        });

        return Object.values(groups);
    }, [workout, exercises]);

    const totalVolume = useMemo(() => {
        if (!workout || !workout.sets) return (workout as any)?.summary?.totalVolume || 0;
        return workout.sets.reduce((sum, s) => sum + ((s.actualWeight || 0) * (s.actualReps || 0)), 0);
    }, [workout]);

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
                    <Text style={styles.errorText}>{error || 'Workout not found'}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={loadData}>
                        <Text style={styles.retryBtnText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.dateText}>{formatDate(workout.startedAt)}</Text>
                    <Text style={styles.titleText}>{workout.name}</Text>

                    <View style={styles.metricsBar}>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Duration</Text>
                            <Text style={styles.metricValue}>
                                {(workout as any).summary?.durationSeconds
                                    ? formatDuration((workout as any).summary.durationSeconds)
                                    : formatDuration(workout.pausedElapsedSeconds || 0)}
                            </Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Sets</Text>
                            <Text style={styles.metricValue}>
                                {(workout as any).summary?.totalSets ?? (workout.sets ? workout.sets.filter(s => s.completedAt).length : 0)}
                            </Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Volume</Text>
                            <Text style={styles.metricValue}>{totalVolume} kg</Text>
                        </View>
                    </View>
                </View>

                {groupedSets.map((group, idx) => (
                    <View key={group.exercise?.id || idx} style={styles.exerciseSection}>
                        <Text style={styles.exerciseName}>{group.exercise?.name || 'Unknown Exercise'}</Text>

                        <View style={styles.tableHeader}>
                            <Text style={[styles.columnLabel, styles.colIndex]}>Set</Text>
                            <Text style={styles.columnLabel}>Target</Text>
                            <Text style={styles.columnLabel}>Actual</Text>
                            <Text style={[styles.columnLabel, styles.colRpe]}>RPE</Text>
                        </View>

                        {group.sets.map((set, setIdx) => (
                            <View key={setIdx} style={styles.setRow}>
                                <Text style={[styles.cellText, styles.colIndex]}>{set.setIndex + 1}</Text>
                                <Text style={styles.cellText}>
                                    {set.targetWeight}kg x {set.targetReps}
                                </Text>
                                <Text style={[styles.cellText, styles.actualText]}>
                                    {set.actualWeight}kg x {set.actualReps}
                                </Text>
                                <Text style={[styles.cellText, styles.colRpe]}>{set.rpe || '-'}</Text>
                            </View>
                        ))}
                    </View>
                ))}
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
        padding: 20,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    errorText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    retryBtn: {
        backgroundColor: Colors.brandPurple,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryBtnText: {
        color: '#fff',
        fontWeight: '700',
    },
    header: {
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    dateText: {
        color: Colors.brandPurple,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    titleText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 20,
    },
    metricsBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
    },
    metricItem: {
        alignItems: 'center',
        flex: 1,
    },
    metricLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    metricValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 2,
    },
    exerciseSection: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    exerciseName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        paddingLeft: 4,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
    },
    columnLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    setRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.03)',
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    cellText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        flex: 1,
        textAlign: 'center',
    },
    actualText: {
        color: '#fff',
        fontWeight: '600',
    },
    colIndex: {
        flex: 0.5,
    },
    colRpe: {
        flex: 0.5,
    },
});
