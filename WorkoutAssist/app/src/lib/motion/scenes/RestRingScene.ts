
import * as THREE from 'three';
import { gsap } from 'gsap';
import { MotivatorScene } from './types';
import { drawCountForProgress } from '../sceneMath';

const SEGMENTS = 128;
const PURPLE = 0x8e24aa;
const ORANGE = 0xff7a29;

/**
 * Rest-timer progress ring: a glowing circular arc that drains as rest
 * elapses, warming from purple to orange in the final seconds.
 */
export class RestRingScene implements MotivatorScene {
    private ring!: THREE.Line;
    private track!: THREE.Line;
    private ringMaterial!: THREE.LineBasicMaterial;
    private trackMaterial!: THREE.LineBasicMaterial;
    private geometry!: THREE.BufferGeometry;
    private trackGeometry!: THREE.BufferGeometry;
    private progressProxy = { value: 1 };
    private activeTween: gsap.core.Tween | null = null;

    init(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
        camera.position.z = 3;

        const curve = new THREE.EllipseCurve(0, 0, 1.2, 1.2, Math.PI / 2, Math.PI / 2 + Math.PI * 2, false, 0);
        const points = curve.getPoints(SEGMENTS);

        this.trackGeometry = new THREE.BufferGeometry().setFromPoints(points);
        this.trackMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
        this.track = new THREE.Line(this.trackGeometry, this.trackMaterial);

        this.geometry = new THREE.BufferGeometry().setFromPoints(points);
        this.ringMaterial = new THREE.LineBasicMaterial({ color: PURPLE, linewidth: 2 });
        this.ring = new THREE.Line(this.geometry, this.ringMaterial);

        scene.add(this.track, this.ring);
        this.applyProgress(1);
    }

    tick(): void {
        // Ring is fully tween-driven; slow ambient spin only.
        this.ring.rotation.z += 0;
    }

    command(name: string, payload?: unknown): void {
        if (name === 'setProgress') {
            this.setProgress(Number(payload));
        } else if (name === 'flash') {
            // +15s / skip feedback
            const material = this.ringMaterial;
            gsap.fromTo(material, { opacity: 0.4 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
        }
    }

    /** Tween toward the new remaining-ratio (0..1). */
    private setProgress(ratio: number): void {
        if (!Number.isFinite(ratio)) return;
        this.activeTween?.kill();
        this.activeTween = gsap.to(this.progressProxy, {
            value: Math.min(Math.max(ratio, 0), 1),
            duration: 0.6,
            ease: 'power1.out',
            onUpdate: () => this.applyProgress(this.progressProxy.value),
        });
    }

    private applyProgress(ratio: number): void {
        this.geometry.setDrawRange(0, drawCountForProgress(ratio, SEGMENTS));
        // Warm the color as time runs out.
        const color = new THREE.Color(PURPLE).lerp(new THREE.Color(ORANGE), 1 - ratio);
        this.ringMaterial.color.copy(color);
    }

    dispose(): void {
        this.activeTween?.kill();
        this.geometry.dispose();
        this.trackGeometry.dispose();
        this.ringMaterial.dispose();
        this.trackMaterial.dispose();
    }
}
