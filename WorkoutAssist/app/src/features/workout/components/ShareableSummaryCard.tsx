
import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShareCardData } from '../../../lib/share/shareCard.types';

interface ShareableSummaryCardProps {
    data: ShareCardData;
}

const CARD_SIZE = 360; // captured at pixelRatio 3 → 1080×1080

/**
 * The branded 1:1 share card. Rendered off-screen on native and captured
 * via react-native-view-shot; the web share path draws an equivalent
 * design onto a canvas instead (see shareCard.ts).
 */
export const ShareableSummaryCard = forwardRef<View, ShareableSummaryCardProps>(({ data }, ref) => {
    const footerBits: string[] = [];
    if (data.xpGained != null) footerBits.push(`+${data.xpGained} XP`);
    if (data.level != null) footerBits.push(`Level ${data.level}`);
    if (data.streakDays != null && data.streakDays > 0) footerBits.push(`${data.streakDays}-day streak`);

    return (
        <View ref={ref} collapsable={false} style={styles.card}>
            <LinearGradient
                colors={['#1A1A2E', '#2A1040']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <Text style={styles.wordmark}>MonaFitXP</Text>
                <Text style={styles.workoutName} numberOfLines={1}>{data.workoutName}</Text>
                <Text style={styles.date}>{data.dateLabel}</Text>

                <View style={styles.durationRing}>
                    <Text style={styles.duration}>{data.durationLabel}</Text>
                    <Text style={styles.durationLabel}>DURATION</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{data.totalSets}</Text>
                        <Text style={styles.statLabel}>SETS</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{data.totalVolume}</Text>
                        <Text style={styles.statLabel}>VOLUME (KG)</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{data.bestSetLabel || '—'}</Text>
                        <Text style={styles.statLabel}>BEST SET</Text>
                    </View>
                </View>

                {footerBits.length > 0 && (
                    <Text style={styles.footer}>{footerBits.join('  ·  ')}</Text>
                )}
                <Text style={styles.tagline}>Tracked with MonaFitXP</Text>
            </LinearGradient>
        </View>
    );
});

ShareableSummaryCard.displayName = 'ShareableSummaryCard';

const styles = StyleSheet.create({
    card: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        borderRadius: 0,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 24,
    },
    wordmark: {
        color: '#FF7A29',
        fontSize: 18,
        fontWeight: '900',
    },
    workoutName: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '800',
        marginTop: 10,
    },
    date: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    durationRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: 'rgba(142, 36, 170, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
    },
    duration: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
    },
    durationLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 22,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 8,
        fontWeight: '800',
        letterSpacing: 0.5,
        marginTop: 2,
    },
    footer: {
        color: '#FF7A29',
        fontSize: 14,
        fontWeight: '800',
        marginTop: 18,
    },
    tagline: {
        color: 'rgba(255,255,255,0.35)',
        fontSize: 10,
        fontWeight: '600',
        marginTop: 'auto',
    },
});
