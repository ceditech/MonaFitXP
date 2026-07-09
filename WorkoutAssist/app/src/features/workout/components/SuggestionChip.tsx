
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../shared/ui/Theme';
import { useEntitlement } from '../../../core/entitlements/EntitlementProvider';
import { WorkoutSessionSet } from '../../../data/contracts/IWorkoutRepository';
import { suggestNextLoad, OverloadSuggestion } from '../../../lib/training';

interface SuggestionChipProps {
    lastSets: WorkoutSessionSet[] | null;
    onApply: (weight: number, reps: number) => void;
}

const RATIONALE_LABEL: Record<OverloadSuggestion['rationale'], string> = {
    increase: 'Time to go up!',
    hold: 'Push for one more rep',
    deload: 'Ease off to rebuild',
};

/**
 * Progressive-overload suggestion below the exercise name.
 * Plus feature: free users see a locked upsell chip instead. Never blocks
 * the player — renders nothing without history.
 */
export const SuggestionChip: React.FC<SuggestionChipProps> = ({ lastSets, onApply }) => {
    const { isPlus } = useEntitlement();
    const navigation = useNavigation<any>();

    const suggestion = useMemo(() => {
        if (!lastSets || lastSets.length === 0) return null;
        return suggestNextLoad(lastSets.map(s => ({
            weight: s.actualWeight || 0,
            reps: s.actualReps || 0,
            targetReps: s.targetReps,
        })));
    }, [lastSets]);

    if (!lastSets || lastSets.length === 0 || !suggestion) return null;

    const lastTop = lastSets.reduce(
        (best, s) => ((s.actualWeight || 0) > (best.actualWeight || 0) ? s : best),
        lastSets[0],
    );

    if (!isPlus) {
        return (
            <TouchableOpacity
                style={[styles.chip, styles.lockedChip]}
                onPress={() => navigation.navigate('Upgrade', { reason: 'plus_required' })}
                activeOpacity={0.8}
            >
                <Ionicons name="lock-closed" size={14} color={Colors.brandOrange} />
                <Text style={styles.lockedText}>Smart suggestion — unlock with Plus</Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={styles.chip}
            onPress={() => onApply(suggestion.weight, suggestion.reps)}
            activeOpacity={0.8}
        >
            <Ionicons name="trending-up" size={14} color={Colors.brandPurple} />
            <Text style={styles.chipText}>
                Last: {lastTop.actualWeight}kg × {lastTop.actualReps} → Try{' '}
                <Text style={styles.chipHighlight}>{suggestion.weight}kg × {suggestion.reps}</Text>
            </Text>
            <Text style={styles.rationale}>{RATIONALE_LABEL[suggestion.rationale]}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(142, 36, 170, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(142, 36, 170, 0.35)',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginHorizontal: 24,
        marginBottom: 8,
        gap: 6,
    },
    lockedChip: {
        backgroundColor: 'rgba(255, 122, 41, 0.08)',
        borderColor: 'rgba(255, 122, 41, 0.3)',
    },
    chipText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 13,
        fontWeight: '600',
    },
    chipHighlight: {
        color: Colors.brandPurple,
        fontWeight: '800',
    },
    rationale: {
        width: '100%',
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 20,
    },
    lockedText: {
        color: Colors.brandOrange,
        fontSize: 13,
        fontWeight: '700',
    },
});
