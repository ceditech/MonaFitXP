
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { SceneHost, SceneHostHandle } from '../SceneHost';
import { StaticRing } from '../fallbacks/StaticRing';

interface RestTimerRingProps {
    /** Remaining ratio 0..1 (restRemaining / restTotal). */
    progress: number;
    size?: number;
}

/**
 * Declarative rest-timer ring: forwards progress changes to the GL scene,
 * or renders the SVG arc when GL is unavailable.
 */
export const RestTimerRing: React.FC<RestTimerRingProps> = ({ progress, size = 200 }) => {
    const hostRef = useRef<SceneHostHandle>(null);

    useEffect(() => {
        hostRef.current?.command('setProgress', progress);
    }, [progress]);

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <SceneHost
                ref={hostRef}
                kind="ring"
                height={size}
                fallback={<StaticRing progress={progress} size={size} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
