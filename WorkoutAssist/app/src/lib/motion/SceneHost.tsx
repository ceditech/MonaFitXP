
import React, { Suspense, forwardRef } from 'react';
import { ErrorBoundary } from '../../shared/ui/ErrorBoundary';
import { useMotionEnabled } from './capabilities';
import { SceneKind } from './scenes/types';
import type { ThreeCanvasHandle } from './adapters/adapterTypes';

// Lazy import keeps three (+expo-three/gsap) out of the initial bundle;
// Metro resolves the platform adapter (.native / web) behind this import.
const ThreeCanvasLazy = React.lazy(() => import('./adapters/ThreeCanvas'));

export interface SceneHostProps {
    kind: SceneKind;
    height: number;
    /** Rendered while loading, when GL is unavailable, on crash, or reduce-motion. */
    fallback?: React.ReactNode;
}

export type SceneHostHandle = ThreeCanvasHandle;

/**
 * The single entry point for 3D motivator visuals. Guarantees the workout
 * flow keeps working when GL is missing or the scene crashes: every failure
 * path renders the (SVG) fallback instead.
 */
export const SceneHost = forwardRef<SceneHostHandle, SceneHostProps>(
    ({ kind, height, fallback = null }, ref) => {
        const motionEnabled = useMotionEnabled();

        if (motionEnabled !== true) {
            return <>{fallback}</>;
        }

        return (
            <ErrorBoundary fallback={fallback}>
                <Suspense fallback={<>{fallback}</>}>
                    <ThreeCanvasLazy ref={ref} kind={kind} height={height} />
                </Suspense>
            </ErrorBoundary>
        );
    },
);

SceneHost.displayName = 'SceneHost';
