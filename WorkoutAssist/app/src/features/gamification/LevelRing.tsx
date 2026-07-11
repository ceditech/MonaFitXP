
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../shared/ui/Theme';
import { xpProgressInLevel } from '../../lib/xp/levels';

interface LevelRingProps {
    totalXp: number;
    size?: number;
}

/**
 * Level indicator: progress ring toward the next level with the current
 * level number centered. SVG-based (no GL dependency).
 */
export const LevelRing: React.FC<LevelRingProps> = ({ totalXp, size = 52 }) => {
    const { level, ratio } = xpProgressInLevel(totalXp);
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - ratio);

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={Colors.brandOrange}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
            <View style={styles.labelWrap}>
                <Text style={styles.levelText}>{level}</Text>
                <Text style={styles.lvlCaption}>LVL</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelWrap: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
        lineHeight: 18,
    },
    lvlCaption: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 7,
        fontWeight: '800',
        letterSpacing: 1,
    },
});
