
import * as THREE from 'three';
import { gsap } from 'gsap';
import { MotivatorScene } from './types';
import { particleVelocity, particlePosition, burstColorsFor, BurstKind, ParticleInit } from '../sceneMath';

const PARTICLE_COUNT = 120; // modest for low-end devices

/**
 * Confetti-style particle burst for workout finish / PR / level-up moments.
 * Instanced mesh + deterministic velocities; a single GSAP tween drives the
 * time parameter, physics is closed-form (sceneMath.particlePosition).
 */
export class CelebrationScene implements MotivatorScene {
    private mesh!: THREE.InstancedMesh;
    private geometry!: THREE.BufferGeometry;
    private material!: THREE.MeshBasicMaterial;
    private velocities: ParticleInit[] = [];
    private clock = { t: -1 }; // -1 = idle (hidden)
    private activeTween: gsap.core.Tween | null = null;
    private dummy = new THREE.Object3D();

    init(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
        camera.position.z = 5;

        this.geometry = new THREE.PlaneGeometry(0.09, 0.09);
        this.material = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
            vertexColors: false,
        });
        this.mesh = new THREE.InstancedMesh(this.geometry, this.material, PARTICLE_COUNT);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.mesh.visible = false;
        scene.add(this.mesh);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            this.velocities.push(particleVelocity(i, PARTICLE_COUNT, 3.2));
        }
    }

    tick(): void {
        if (this.clock.t < 0) return;

        const t = this.clock.t;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Stagger: later particles launch slightly later.
            const localT = Math.max(t - (i / PARTICLE_COUNT) * 0.25, 0);
            const p = particlePosition(this.velocities[i], localT);
            this.dummy.position.set(p.x, p.y - 1.5, p.z);
            this.dummy.rotation.set(localT * 5 + i, localT * 3, i);
            const scale = Math.max(1 - localT * 0.45, 0.05);
            this.dummy.scale.setScalar(scale);
            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);
        }
        this.mesh.instanceMatrix.needsUpdate = true;
    }

    command(name: string, payload?: unknown): void {
        if (name === 'burst') {
            this.burst((payload as BurstKind) || 'finish');
        }
    }

    private burst(kind: BurstKind): void {
        const colors = burstColorsFor(kind);
        // Recolor via instance colors.
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            this.mesh.setColorAt(i, new THREE.Color(colors[i % colors.length]));
        }
        if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;

        this.mesh.visible = true;
        this.material.opacity = 1;
        this.activeTween?.kill();
        this.clock.t = 0;
        this.activeTween = gsap.to(this.clock, {
            t: 2.2,
            duration: 2.2,
            ease: 'none',
            onComplete: () => {
                this.mesh.visible = false;
                this.clock.t = -1;
            },
        });
        gsap.to(this.material, { opacity: 0, duration: 0.8, delay: 1.4, ease: 'power2.in' });
    }

    dispose(): void {
        this.activeTween?.kill();
        this.geometry.dispose();
        this.material.dispose();
        this.mesh.dispose();
    }
}
