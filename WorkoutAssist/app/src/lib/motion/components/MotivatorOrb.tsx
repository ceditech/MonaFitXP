
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { SceneHost, SceneHostHandle } from '../SceneHost';
import { StaticOrb } from '../fallbacks/StaticOrb';
import { PulseKind } from '../sceneMath';

export interface MotivatorOrbHandle {
    /** Punch the orb — call when a set is logged ('pr' hits harder + green). */
    pulse(kind?: PulseKind): void;
}

interface MotivatorOrbProps {
    height?: number;
}

/** The 3D workout companion shown in the player. Safe everywhere: falls back to SVG. */
export const MotivatorOrb = forwardRef<MotivatorOrbHandle, MotivatorOrbProps>(
    ({ height = 240 }, ref) => {
        const hostRef = useRef<SceneHostHandle>(null);

        useImperativeHandle(ref, () => ({
            pulse(kind: PulseKind = 'normal') {
                hostRef.current?.command('pulse', kind);
            },
        }), []);

        return (
            <SceneHost
                ref={hostRef}
                kind="orb"
                height={height}
                fallback={<StaticOrb height={height} />}
            />
        );
    },
);

MotivatorOrb.displayName = 'MotivatorOrb';
