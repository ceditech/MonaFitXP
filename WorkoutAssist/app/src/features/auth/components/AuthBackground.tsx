import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../../shared/ui/Theme';

const { width, height } = Dimensions.get('window');

interface FloatingIconProps {
    name: any;
    size: number;
    duration: number;
    delay: number;
    startPos: { x: number; y: number };
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ name, size, duration, delay, startPos }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const rotate = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let isCancelled = false;

        const animate = () => {
            if (isCancelled) return;

            // Reset values
            translateY.setValue(0);
            translateX.setValue(0);
            rotate.setValue(0);
            opacity.setValue(0);

            Animated.parallel([
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(opacity, {
                        toValue: 0.15,
                        duration: 2000,
                        useNativeDriver: Platform.OS !== 'web',
                    }),
                    Animated.delay(Math.max(0, duration - 6000)),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 4000,
                        useNativeDriver: Platform.OS !== 'web',
                    }),
                ]),
                Animated.timing(translateY, {
                    toValue: -height - 100,
                    duration: duration,
                    easing: Easing.linear,
                    useNativeDriver: Platform.OS !== 'web',
                }),
                Animated.timing(translateX, {
                    toValue: Math.random() * 100 - 50,
                    duration: duration,
                    easing: Easing.linear,
                    useNativeDriver: Platform.OS !== 'web',
                }),
                Animated.timing(rotate, {
                    toValue: 1,
                    duration: duration,
                    easing: Easing.linear,
                    useNativeDriver: Platform.OS !== 'web',
                }),
            ]).start(() => {
                if (!isCancelled) animate();
            });
        };

        animate();
        return () => {
            isCancelled = true;
        };
    }, [delay, duration, height]);

    const rotation = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View
            style={[
                styles.iconContainer,
                {
                    left: startPos.x,
                    top: startPos.y,
                    opacity: opacity,
                    transform: [
                        { translateY: translateY },
                        { translateX: translateX },
                        { rotate: rotation },
                    ],
                },
            ]}
        >
            <MaterialCommunityIcons name={name} size={size} color="#fff" />
        </Animated.View>
    );
};

export const AuthBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const icons = [
        { name: 'dumbbell', size: 24, duration: 25000, delay: 0, startPos: { x: width * 0.1, y: height } },
        { name: 'pulse', size: 20, duration: 30000, delay: 5000, startPos: { x: width * 0.3, y: height } },
        { name: 'heart', size: 18, duration: 22000, delay: 2000, startPos: { x: width * 0.5, y: height } },
        { name: 'trophy', size: 22, duration: 28000, delay: 8000, startPos: { x: width * 0.7, y: height } },
        { name: 'flash', size: 20, duration: 24000, delay: 4000, startPos: { x: width * 0.85, y: height } },
        { name: 'dumbbell', size: 20, duration: 32000, delay: 12000, startPos: { x: width * 0.2, y: height } },
        { name: 'pulse', size: 24, duration: 27000, delay: 15000, startPos: { x: width * 0.6, y: height } },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.brandPurpleDark, '#1A1A2E', Colors.brandOrange]}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {icons.map((icon, index) => (
                    <FloatingIcon key={`icon-${index}`} {...icon} />
                ))}
                {children}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A2E',
    },
    gradient: {
        flex: 1,
    },
    iconContainer: {
        position: 'absolute',
    },
});
