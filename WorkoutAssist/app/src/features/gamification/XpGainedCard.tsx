
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../shared/ui/Theme';
import { XpAwardRecord } from '../../data/contracts/IWorkoutRepository';
import { xpProgressInLevel, levelFromXp, BADGE_DEFS } from '../../lib/xp/levels';

interface XpGainedCardProps {
    award: XpAwardRecord;
    totalXp: number;
    /** Fires when this award crossed a level boundary (celebration hook). */
    onLevelUp?: (newLevel: number) => void;
}

const BREAKDOWN_LABELS: { key: keyof XpAwardRecord['breakdown']; label: string; icon: string }[] = [
    { key: 'base', label: 'Workout complete', icon: 'checkmark-circle' },
    { key: 'sets', label: 'Sets logged', icon: 'list' },
    { key: 'volume', label: 'Volume bonus', icon: 'barbell' },
    { key: 'prs', label: 'New PRs', icon: 'trophy' },
    { key: 'streak', label: 'Streak bonus', icon: 'flame' },
];

/**
 * Post-workout XP award card: total gained, per-source breakdown, level
 * progress, and any badges earned. Fires onLevelUp for celebrations.
 */
export const XpGainedCard: React.FC<XpGainedCardProps> = ({ award, totalXp, onLevelUp }) => {
    const progress = xpProgressInLevel(totalXp);
    const scale = useRef(new Animated.Value(0.8)).current;

    const leveledUp = award.xp > 0 && levelFromXp(totalXp - award.xp) < progress.level;

    useEffect(() => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
        if (leveledUp) {
            onLevelUp?.(progress.level);
        }
        // Fire once per award
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [award.workoutId]);

    const newBadges = (award.newBadgeIds || [])
        .map(id => BADGE_DEFS.find(b => b.id === id))
        .filter((b): b is NonNullable<typeof b> => !!b);

    return (
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
            <View style={styles.headerRow}>
                <Ionicons name="sparkles" size={18} color={Colors.brandOrange} />
                <Text style={styles.xpTotal}>+{award.xp} XP</Text>
                {leveledUp && (
                    <View style={styles.levelUpPill}>
                        <Text style={styles.levelUpText}>LEVEL {progress.level}!</Text>
                    </View>
                )}
            </View>

            {BREAKDOWN_LABELS.filter(row => (award.breakdown?.[row.key] || 0) > 0).map(row => (
                <View key={row.key} style={styles.breakdownRow}>
                    <Ionicons name={row.icon as any} size={13} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.breakdownLabel}>{row.label}</Text>
                    <Text style={styles.breakdownValue}>+{award.breakdown[row.key]}</Text>
                </View>
            ))}

            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.round(progress.ratio * 100)}%` }]} />
            </View>
            <Text style={styles.progressLabel}>
                Level {progress.level} · {progress.current}/{progress.needed} XP to next level
            </Text>

            {newBadges.length > 0 && (
                <View style={styles.badgesRow}>
                    {newBadges.map(badge => (
                        <View key={badge.id} style={styles.badgeChip}>
                            <Ionicons name={badge.icon as any} size={14} color={Colors.brandOrange} />
                            <Text style={styles.badgeName}>{badge.name}</Text>
                        </View>
                    ))}
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 122, 41, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 122, 41, 0.25)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    xpTotal: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
    },
    levelUpPill: {
        backgroundColor: Colors.brandOrange,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 'auto',
    },
    levelUpText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1,
    },
    breakdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    breakdownLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        fontWeight: '600',
        flex: 1,
    },
    breakdownValue: {
        color: Colors.brandOrange,
        fontSize: 13,
        fontWeight: '800',
    },
    progressTrack: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 3,
        marginTop: 10,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.brandOrange,
        borderRadius: 3,
    },
    progressLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 6,
    },
    badgesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    badgeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 122, 41, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeName: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
});
