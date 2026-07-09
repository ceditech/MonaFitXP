
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../shared/ui/Theme';
import { WorkoutSessionSet } from '../../../data/contracts/IWorkoutRepository';
import { generateWarmups } from '../../../lib/training';

interface WarmupSuggestionProps {
    lastSets: WorkoutSessionSet[] | null;
    /** Hide once the user has started logging sets for this exercise. */
    anySetCompleted: boolean;
}

/**
 * Warm-up ramp toward the last working weight, shown before the first
 * logged set of an exercise. Free feature. Renders nothing without history.
 */
export const WarmupSuggestion: React.FC<WarmupSuggestionProps> = ({ lastSets, anySetCompleted }) => {
    const warmups = useMemo(() => {
        if (!lastSets || lastSets.length === 0) return [];
        const topWeight = Math.max(...lastSets.map(s => s.actualWeight || 0));
        return generateWarmups(topWeight);
    }, [lastSets]);

    if (anySetCompleted || warmups.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <Ionicons name="flame-outline" size={14} color={Colors.brandOrange} />
                <Text style={styles.title}>Warm-up</Text>
            </View>
            <Text style={styles.sets}>
                {warmups.map(w => `${w.weight}kg × ${w.reps}`).join('   ·   ')}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        alignItems: 'center',
        marginHorizontal: 24,
        marginBottom: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 2,
    },
    title: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sets: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 13,
        fontWeight: '600',
    },
});
