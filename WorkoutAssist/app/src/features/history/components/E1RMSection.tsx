
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../shared/ui/Theme';
import { useWorkoutRepo } from '../../../repositories';
import { useEntitlement } from '../../../core/entitlements/EntitlementProvider';
import { Exercise, PersonalRecord } from '../../../data/contracts/IWorkoutRepository';
import { epley1RM, e1RMTimeline, E1RMPoint } from '../../../lib/training';

interface E1RMSectionProps {
    uid: string;
    prs: PersonalRecord[];
    exercises: Record<string, Exercise>;
}

/**
 * Estimated 1RM per PR exercise (free) with a tappable per-exercise
 * timeline chart (Plus). Reuses the dashboard's flexbox bar-chart style.
 */
export const E1RMSection: React.FC<E1RMSectionProps> = ({ uid, prs, exercises }) => {
    const repo = useWorkoutRepo();
    const navigation = useNavigation<any>();
    const { isPlus } = useEntitlement();

    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [timeline, setTimeline] = useState<E1RMPoint[]>([]);
    const [timelineLoading, setTimelineLoading] = useState(false);

    const rows = useMemo(() =>
        prs
            .map(pr => ({
                exerciseId: pr.exerciseId,
                name: exercises[pr.exerciseId]?.name || 'Unknown Exercise',
                e1rm: epley1RM(pr.bestWeight || 0, pr.bestReps || 0),
            }))
            .filter(r => r.e1rm > 0)
            .sort((a, b) => b.e1rm - a.e1rm),
        [prs, exercises]);

    if (rows.length === 0) return null;

    const toggleTimeline = async (exerciseId: string) => {
        if (!isPlus) {
            navigation.navigate('Upgrade', { reason: 'plus_required' });
            return;
        }
        if (expandedId === exerciseId) {
            setExpandedId(null);
            return;
        }
        setExpandedId(exerciseId);
        setTimelineLoading(true);
        try {
            const sets = await repo.getExerciseSetHistory(uid, exerciseId);
            setTimeline(e1RMTimeline(sets.map(s => ({
                weight: s.actualWeight || 0,
                reps: s.actualReps || 0,
                completedAt: s.completedAt,
            }))));
        } catch {
            setTimeline([]);
        } finally {
            setTimelineLoading(false);
        }
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Ionicons name="speedometer" size={20} color={Colors.brandPurple} />
                <Text style={styles.sectionTitle}>Estimated 1RM</Text>
                {!isPlus && (
                    <View style={styles.plusPill}>
                        <Ionicons name="lock-closed" size={10} color={Colors.brandOrange} />
                        <Text style={styles.plusPillText}>Timeline: Plus</Text>
                    </View>
                )}
            </View>

            {rows.map(row => (
                <View key={row.exerciseId}>
                    <TouchableOpacity style={styles.row} onPress={() => toggleTimeline(row.exerciseId)}>
                        <Text style={styles.rowName}>{row.name}</Text>
                        <View style={styles.rowRight}>
                            <Text style={styles.rowValue}>{row.e1rm} kg</Text>
                            <Ionicons
                                name={expandedId === row.exerciseId ? 'chevron-up' : 'chevron-down'}
                                size={14}
                                color="rgba(255,255,255,0.3)"
                            />
                        </View>
                    </TouchableOpacity>

                    {expandedId === row.exerciseId && (
                        <View style={styles.chartCard}>
                            {timelineLoading ? (
                                <ActivityIndicator color={Colors.brandPurple} />
                            ) : timeline.length === 0 ? (
                                <Text style={styles.emptyText}>Not enough history yet</Text>
                            ) : (
                                <View style={styles.chartBody}>
                                    {timeline.slice(-10).map((point, idx) => {
                                        const max = Math.max(...timeline.map(p => p.e1rm), 1);
                                        const height = (point.e1rm / max) * 100;
                                        return (
                                            <View key={idx} style={styles.chartCol}>
                                                <Text style={styles.chartValue}>{Math.round(point.e1rm)}</Text>
                                                <View style={styles.barContainer}>
                                                    <View style={[styles.bar, { height: `${Math.max(height, 4)}%` }]} />
                                                </View>
                                                <Text style={styles.chartLabel}>{point.date.slice(5)}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    plusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255, 122, 41, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        marginLeft: 'auto',
    },
    plusPillText: {
        color: Colors.brandOrange,
        fontSize: 10,
        fontWeight: '800',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 8,
    },
    rowName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rowValue: {
        color: Colors.brandPurple,
        fontSize: 16,
        fontWeight: '900',
    },
    chartCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
        minHeight: 120,
        justifyContent: 'center',
    },
    chartBody: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 120,
        gap: 4,
    },
    chartCol: {
        flex: 1,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
    },
    chartValue: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 9,
        fontWeight: '700',
        marginBottom: 2,
    },
    barContainer: {
        flex: 1,
        width: '60%',
        justifyContent: 'flex-end',
    },
    bar: {
        backgroundColor: Colors.brandPurple,
        borderRadius: 4,
        width: '100%',
    },
    chartLabel: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 9,
        fontWeight: '600',
        marginTop: 4,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
        textAlign: 'center',
    },
});
