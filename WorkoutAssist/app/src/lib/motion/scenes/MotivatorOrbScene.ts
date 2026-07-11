
import * as THREE from 'three';
import { gsap } from 'gsap';
import { MotivatorScene } from './types';
import { pulseScaleFor, PulseKind } from '../sceneMath';

const PURPLE = 0x8e24aa;
const ORANGE = 0xff7a29;
const SUCCESS = 0x34c759;

/**
 * The workout companion: a wireframe-glow icosahedron that "breathes" while
 * idle and punches (scale + emissive flash) whenever a set is logged.
 * PR pulses flash green and hit harder.
 */
export class MotivatorOrbScene implements MotivatorScene {
    private group = new THREE.Group();
    private core!: THREE.Mesh;
    private shell!: THREE.Mesh;
    private coreMaterial!: THREE.MeshStandardMaterial;
    private shellMaterial!: THREE.MeshBasicMaterial;
    private tweens: gsap.core.Tween[] = [];
    private pulseTl: gsap.core.Timeline | null = null;

    init(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
        camera.position.z = 4;

        this.coreMaterial = new THREE.MeshStandardMaterial({
            color: PURPLE,
            emissive: PURPLE,
            emissiveIntensity: 0.55,
            roughness: 0.25,
            metalness: 0.4,
        });
        this.core = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), this.coreMaterial);

        this.shellMaterial = new THREE.MeshBasicMaterial({
            color: ORANGE,
            wireframe: true,
            transparent: true,
            opacity: 0.28,
        });
        this.shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 1), this.shellMaterial);

        this.group.add(this.core, this.shell);
        scene.add(this.group);

        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const key = new THREE.PointLight(0xffffff, 60);
        key.position.set(3, 3, 4);
        scene.add(key);

        // Idle breathing (killed on dispose).
        this.tweens.push(
            gsap.to(this.group.scale, {
                x: 1.06, y: 1.06, z: 1.06,
                duration: 1.6,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
            }),
            gsap.to(this.shellMaterial, {
                opacity: 0.45,
                duration: 1.6,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
            }),
        );
    }

    tick(dt: number): void {
        this.core.rotation.y += dt * 0.35;
        this.shell.rotation.y -= dt * 0.22;
        this.shell.rotation.x += dt * 0.12;
    }

    command(name: string, payload?: unknown): void {
        if (name === 'pulse') {
            this.pulse((payload as PulseKind) || 'normal');
        }
    }

    /** Set-logged celebration: scale punch + emissive flash (green on PR). */
    private pulse(kind: PulseKind): void {
        const punch = pulseScaleFor(kind);
        const flashColor = kind === 'pr' ? SUCCESS : ORANGE;

        this.pulseTl?.kill();
        this.pulseTl = gsap.timeline()
            .to(this.group.scale, { x: punch, y: punch, z: punch, duration: 0.14, ease: 'power2.out' })
            .to(this.group.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' })
            .to(this.coreMaterial, { emissiveIntensity: 1.6, duration: 0.12, ease: 'power2.out' }, 0)
            .to(this.coreMaterial, { emissiveIntensity: 0.55, duration: 0.6, ease: 'power2.in' }, 0.14);

        // Color flash via onUpdate (gsap can't tween THREE.Color directly on hex).
        const from = new THREE.Color(kind === 'pr' ? SUCCESS : PURPLE);
        const to = new THREE.Color(PURPLE);
        const mix = { t: 0 };
        this.coreMaterial.emissive.set(flashColor);
        this.pulseTl.to(mix, {
            t: 1,
            duration: 0.7,
            ease: 'power2.in',
            onUpdate: () => {
                this.coreMaterial.emissive.copy(from.clone().lerp(to, mix.t));
            },
        }, 0.1);
    }

    dispose(): void {
        this.pulseTl?.kill();
        this.tweens.forEach(t => t.kill());
        this.tweens = [];
        this.core.geometry.dispose();
        this.shell.geometry.dispose();
        this.coreMaterial.dispose();
        this.shellMaterial.dispose();
    }
}
