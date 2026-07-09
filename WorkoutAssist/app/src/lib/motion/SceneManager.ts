
import * as THREE from 'three';
import { gsap } from 'gsap';
import { MotivatorScene, SceneKind } from './scenes/types';
import { MotivatorOrbScene } from './scenes/MotivatorOrbScene';
import { RestRingScene } from './scenes/RestRingScene';
import { CelebrationScene } from './scenes/CelebrationScene';
import { ExerciseDemoScene } from './scenes/ExerciseDemoScene';

const SCENES: Record<SceneKind, new () => MotivatorScene> = {
    orb: MotivatorOrbScene,
    ring: RestRingScene,
    celebration: CelebrationScene,
    exerciseDemo: ExerciseDemoScene,
};

/**
 * Platform-agnostic owner of the three.js scene graph and the active
 * MotivatorScene. Adapters (web canvas / expo-gl) drive `tick()` from their
 * render loop and forward imperative commands. `dispose()` is idempotent.
 */
export class SceneManager {
    readonly scene = new THREE.Scene();
    readonly camera: THREE.PerspectiveCamera;
    private motivator: MotivatorScene;
    private lastTime = 0;
    private disposed = false;

    constructor(kind: SceneKind, aspect: number) {
        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
        this.motivator = new SCENES[kind]();
        this.motivator.init(this.scene, this.camera);
    }

    setAspect(aspect: number): void {
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
    }

    /** Called by the adapter each frame with a high-res timestamp (ms). */
    tick(nowMs: number): void {
        if (this.disposed) return;
        const dt = this.lastTime === 0 ? 0.016 : Math.min((nowMs - this.lastTime) / 1000, 0.1);
        this.lastTime = nowMs;
        this.motivator.tick(dt);
    }

    command(name: string, payload?: unknown): void {
        if (this.disposed) return;
        this.motivator.command(name, payload);
    }

    dispose(): void {
        if (this.disposed) return;
        this.disposed = true;
        this.motivator.dispose();
        this.scene.clear();
        // Kill any strays targeting our objects (scenes kill their own, this is belt-and-braces).
        gsap.globalTimeline.getChildren(true, true, true).forEach(tween => {
            const targets: any[] = (tween as any).targets?.() || [];
            if (targets.some(t => t?.isObject3D || t?.isMaterial)) tween.kill();
        });
    }
}
