
import type * as THREE from 'three';

export type SceneKind = 'orb' | 'ring' | 'celebration' | 'exerciseDemo';

/**
 * Contract every motivator scene implements. Scenes are plain classes
 * (no React) driven by the platform adapter's render loop; imperative
 * commands arrive via `command()` from component refs.
 */
export interface MotivatorScene {
    init(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void;
    /** Per-frame update; dt in seconds. */
    tick(dt: number): void;
    /** Imperative command from the host component (pulse, setProgress, burst). */
    command(name: string, payload?: unknown): void;
    dispose(): void;
}
