
import { useEffect, useState } from 'react';
import { Platform, AccessibilityInfo } from 'react-native';

let cachedGlSupport: boolean | null = null;

/**
 * One-shot GL capability probe, cached for the app session.
 * - web: try creating a WebGL context on a detached canvas.
 * - native: expo-gl provides the context; assume true and let the
 *   ErrorBoundary catch device-specific failures.
 */
export function canUseGL(): boolean {
    if (cachedGlSupport !== null) return cachedGlSupport;

    if (Platform.OS !== 'web') {
        cachedGlSupport = true;
        return true;
    }

    try {
        // DOM types aren't in the RN tsconfig lib — access via globalThis.
        const doc = (globalThis as any).document;
        if (!doc?.createElement) {
            cachedGlSupport = false;
            return false;
        }
        const canvas = doc.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        cachedGlSupport = !!gl;
        // Free the probe context where supported.
        gl?.getExtension?.('WEBGL_lose_context')?.loseContext?.();
    } catch {
        cachedGlSupport = false;
    }
    return cachedGlSupport;
}

/** Test-only reset for the cached probe. */
export function __resetGlCacheForTests(): void {
    cachedGlSupport = null;
}

/**
 * Whether rich motion should render: GL available AND the user has not
 * enabled reduce-motion. `null` while the accessibility check is in flight
 * (render the fallback during that window).
 */
export function useMotionEnabled(): boolean | null {
    const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);

    useEffect(() => {
        let mounted = true;
        AccessibilityInfo.isReduceMotionEnabled()
            .then(value => { if (mounted) setReduceMotion(value); })
            .catch(() => { if (mounted) setReduceMotion(false); });

        const sub = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (value: boolean) => {
            if (mounted) setReduceMotion(value);
        });

        return () => {
            mounted = false;
            (sub as any)?.remove?.();
        };
    }, []);

    if (reduceMotion === null) return null;
    return !reduceMotion && canUseGL();
}
