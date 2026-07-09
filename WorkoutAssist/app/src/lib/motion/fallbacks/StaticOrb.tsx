
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

interface StaticOrbProps {
    height: number;
}

/**
 * GL-free fallback for the motivator orb: a gradient circle with a gentle
 * RN-Animated breathing loop. Rendered when WebGL/expo-gl is unavailable
 * or reduce-motion is on (the loop is subtle enough to keep).
 */
export const StaticOrb: React.FC<StaticOrbProps> = ({ height }) => {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(scale, { toValue: 1.06, duration: 1600, useNativeDriver: true }),
                Animated.timing(scale, { toValue: 1, duration: 1600, useNativeDriver: true }),
            ]),
        );
        loop.start();
        return () => loop.stop();
    }, [scale]);

    const size = Math.min(height * 0.7, 160);

    return (
        <View style={[styles.container, { height }]}>
            <Animated.View style={{ transform: [{ scale }] }}>
                <Svg width={size} height={size}>
                    <Defs>
                        <RadialGradient id="orbGrad" cx="50%" cy="42%" r="60%">
                            <Stop offset="0%" stopColor="#C46BFF" stopOpacity="1" />
                            <Stop offset="65%" stopColor="#8E24AA" stopOpacity="1" />
                            <Stop offset="100%" stopColor="#4A148C" stopOpacity="1" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="url(#orbGrad)" />
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={size / 2 - 1}
                        fill="none"
                        stroke="rgba(255,122,41,0.35)"
                        strokeWidth={1.5}
                    />
                </Svg>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
