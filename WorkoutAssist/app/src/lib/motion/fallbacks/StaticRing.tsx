
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface StaticRingProps {
    /** Remaining ratio 0..1. */
    progress: number;
    size?: number;
}

/** GL-free rest-ring fallback: SVG arc driven directly by the progress prop. */
export const StaticRing: React.FC<StaticRingProps> = ({ progress, size = 180 }) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.min(Math.max(progress, 0), 1);
    const dashOffset = circumference * (1 - clamped);
    // Warm from purple to orange as time runs out (matches the GL scene).
    const color = clamped > 0.5 ? '#8E24AA' : clamped > 0.25 ? '#B84A8A' : '#FF7A29';

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="none"
                />
                <Circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={color} strokeWidth={strokeWidth} fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
