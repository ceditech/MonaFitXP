
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { SceneHost, SceneHostHandle } from '../SceneHost';
import { AnimationKey } from '../mannequin/poses';
import { PulseKind } from '../sceneMath';

export interface ExerciseDemoHandle {
    /** Set-logged feedback on the demo character. */
    pulse(kind?: PulseKind): void;
}

interface ExerciseDemoProps {
    /** Which movement the mannequin performs (see mannequin/poses.ts). */
    animationKey: AnimationKey;
    height?: number;
    /** Rendered when GL is unavailable / reduce-motion / crash. */
    fallback?: React.ReactNode;
}

/**
 * Animated 3D form demonstration for an exercise. Switch exercises by
 * changing `animationKey` — the scene tweens into the new movement loop.
 */
export const ExerciseDemo = forwardRef<ExerciseDemoHandle, ExerciseDemoProps>(
    ({ animationKey, height = 300, fallback = null }, ref) => {
        const hostRef = useRef<SceneHostHandle>(null);

        useImperativeHandle(ref, () => ({
            pulse(kind: PulseKind = 'normal') {
                hostRef.current?.command('pulse', kind);
            },
        }), []);

        useEffect(() => {
            // The lazy canvas ref is null until Suspense resolves — retry
            // briefly so the initial exercise isn't lost. Once the adapter
            // exists it queues commands itself, so one delivery is enough.
            if (hostRef.current) {
                hostRef.current.command('setExercise', animationKey);
                return;
            }
            let attempts = 0;
            const timer = setInterval(() => {
                attempts++;
                if (hostRef.current) {
                    hostRef.current.command('setExercise', animationKey);
                    clearInterval(timer);
                } else if (attempts > 50) {
                    clearInterval(timer); // GL unavailable — fallback is showing
                }
            }, 100);
            return () => clearInterval(timer);
        }, [animationKey]);

        return (
            <SceneHost
                ref={hostRef}
                kind="exerciseDemo"
                height={height}
                fallback={fallback}
            />
        );
    },
);

ExerciseDemo.displayName = 'ExerciseDemo';
