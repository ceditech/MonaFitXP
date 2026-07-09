
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../shared/ui/Theme';
import { BADGE_DEFS } from '../../lib/xp/levels';

interface BadgesSectionProps {
    earnedBadges: Record<string, { earnedAt: any }>;
}

/** Grid of earned + locked badges for the progress dashboard. */
export const BadgesSection: React.FC<BadgesSectionProps> = ({ earnedBadges }) => {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Ionicons name="ribbon" size={20} color={Colors.brandPurple} />
                <Text style={styles.sectionTitle}>Badges</Text>
                <Text style={styles.count}>
                    {Object.keys(earnedBadges).length}/{BADGE_DEFS.length}
                </Text>
            </View>

            <View style={styles.grid}>
                {BADGE_DEFS.map(badge => {
                    const earned = !!earnedBadges[badge.id];
                    return (
                        <View key={badge.id} style={[styles.badge, !earned && styles.badgeLocked]}>
                            <Ionicons
                                name={(earned ? badge.icon : 'lock-closed') as any}
                                size={22}
                                color={earned ? Colors.brandOrange : 'rgba(255,255,255,0.15)'}
                            />
                            <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]}>
                                {badge.name}
                            </Text>
                            <Text style={styles.badgeDesc} numberOfLines={2}>
                                {badge.description}
                            </Text>
                        </View>
                    );
                })}
            </View>
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
    count: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 'auto',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    badge: {
        width: '31%',
        flexGrow: 1,
        backgroundColor: 'rgba(255, 122, 41, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 122, 41, 0.2)',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
    },
    badgeLocked: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderColor: 'rgba(255,255,255,0.06)',
    },
    badgeName: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
        marginTop: 6,
        textAlign: 'center',
    },
    badgeNameLocked: {
        color: 'rgba(255,255,255,0.3)',
    },
    badgeDesc: {
        color: 'rgba(255,255,255,0.35)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 2,
    },
});
