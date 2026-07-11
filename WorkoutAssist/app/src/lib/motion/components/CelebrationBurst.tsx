
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { SceneHost, SceneHostHandle } from '../SceneHost';
import { BurstKind } from '../sceneMath';

export interface CelebrationBurstHandle {
    burst(kind: BurstKind): void;
}

interface CelebrationBurstProps {
    /** Fire this burst automatically on mount (e.g. 'finish' on the summary). */
    autoBurst?: BurstKind;
    height?: number;
}

/**
 * Full-width particle celebration overlay. Renders nothing when GL is
 * unavailable — celebrations are pure garnish, never functional.
 */
export const CelebrationBurst = forwardRef<CelebrationBurstHandle, CelebrationBurstProps>(
    ({ autoBurst, height = 260 }, ref) => {
        const hostRef = useRef<SceneHostHandle>(null);

        useImperativeHandle(ref, () => ({
            burst(kind: BurstKind) {
                hostRef.current?.command('burst', kind);
            },
        }), []);

        useEffect(() => {
            if (autoBurst) {
                // Small delay so the lazy canvas has a chance to mount; the
                // adapter queues commands that arrive before scene-ready anyway.
                const timer = setTimeout(() => hostRef.current?.command('burst', autoBurst), 350);
                return () => clearTimeout(timer);
            }
        }, [autoBurst]);

        return (
            <View pointerEvents="none" style={[styles.overlay, { height }]}>
                <SceneHost ref={hostRef} kind="celebration" height={height} fallback={null} />
            </View>
        );
    },
);

CelebrationBurst.displayName = 'CelebrationBurst';

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
});
