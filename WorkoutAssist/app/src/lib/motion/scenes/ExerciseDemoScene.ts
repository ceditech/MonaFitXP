
import * as THREE from 'three';
import { gsap } from 'gsap';
import { MotivatorScene } from './types';
import { MannequinRig } from '../mannequin/MannequinRig';
import { CLIPS, AnimationKey, isAnimationKey } from '../mannequin/poses';

const PURPLE = 0x8e24aa;
const ORANGE = 0xff7a29;
const SUCCESS = 0x34c759;

/**
 * Exercise form demo: a procedural mannequin performing the selected
 * exercise on a lit stage, with a slow camera orbit. Driven entirely by
 * GSAP keyframe timelines over joint rotations — no 3D asset files.
 *
 * Commands:
 *   setExercise(animationKey) — switch the demonstrated movement
 *   pulse('normal'|'pr')      — set-logged feedback (glow + tempo punch)
 */
export class ExerciseDemoScene implements MotivatorScene {
    private rig!: MannequinRig;
    private camera!: THREE.PerspectiveCamera;
    private platform!: THREE.Mesh;
    private ring!: THREE.Mesh;
    private platformMaterial!: THREE.MeshStandardMaterial;
    private ringMaterial!: THREE.MeshBasicMaterial;
    private clipTl: gsap.core.Timeline | null = null;
    private pulseTl: gsap.core.Timeline | null = null;
    private elapsed = 0;
    private currentKey: AnimationKey | null = null;

    init(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
        this.camera = camera;
        camera.position.set(0, 0.9, 2.85);
        camera.lookAt(0, 0.72, 0);

        this.rig = new MannequinRig();
        scene.add(this.rig.root);

        // Stage: disc platform + glowing ring
        this.platformMaterial = new THREE.MeshStandardMaterial({
            color: 0x211a35, roughness: 0.85, metalness: 0.1,
        });
        this.platform = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.25, 0.06, 40), this.platformMaterial);
        this.platform.position.y = -0.03;
        scene.add(this.platform);

        this.ringMaterial = new THREE.MeshBasicMaterial({ color: PURPLE, transparent: true, opacity: 0.85 });
        this.ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.015, 10, 60), this.ringMaterial);
        this.ring.rotation.x = Math.PI / 2;
        this.ring.position.y = 0.01;
        scene.add(this.ring);

        // Lighting: soft key + purple/orange rim accents
        scene.add(new THREE.AmbientLight(0xffffff, 0.55));
        const key = new THREE.PointLight(0xffffff, 45);
        key.position.set(2.5, 3.2, 3);
        scene.add(key);
        const rimPurple = new THREE.PointLight(PURPLE, 30);
        rimPurple.position.set(-3, 1.5, -1.5);
        scene.add(rimPurple);
        const rimOrange = new THREE.PointLight(ORANGE, 18);
        rimOrange.position.set(3, 0.6, -2);
        scene.add(rimOrange);

        this.playClip('generic');
    }

    tick(dt: number): void {
        this.elapsed += dt;
        // Gentle camera orbit (±18°) so the movement reads in 3D.
        const angle = Math.sin(this.elapsed * 0.35) * 0.32;
        this.camera.position.x = Math.sin(angle) * 2.85;
        this.camera.position.z = Math.cos(angle) * 2.85;
        this.camera.lookAt(0, 0.72, 0);
        // Ring shimmer
        this.ringMaterial.opacity = 0.65 + Math.sin(this.elapsed * 2) * 0.2;
    }

    command(name: string, payload?: unknown): void {
        if (name === 'setExercise') {
            const key = String(payload);
            this.playClip(isAnimationKey(key) ? key : 'generic');
        } else if (name === 'pulse') {
            this.pulse(payload === 'pr');
        }
    }

    /** Build and start the looping GSAP timeline for a clip. */
    private playClip(key: AnimationKey): void {
        if (key === this.currentKey) return;
        this.currentKey = key;

        this.clipTl?.kill();
        const clip = CLIPS[key];
        const tl = gsap.timeline({ repeat: -1, yoyo: !!clip.yoyo, repeatDelay: 0.05 });

        for (const frame of clip.keyframes) {
            const targets = this.rig.poseTargets(frame.pose);
            const position = tl.duration(); // append point for simultaneous joint tweens
            for (const { target, values } of targets) {
                tl.to(target, { ...values, duration: frame.duration, ease: frame.ease || 'power1.inOut' }, position);
            }
        }
        this.clipTl = tl;
    }

    /** Set-logged feedback: body glow (green on PR) + brief tempo boost. */
    private pulse(isPr: boolean): void {
        const material = this.rig.bodyMaterial;
        const flash = new THREE.Color(isPr ? SUCCESS : ORANGE);
        const base = new THREE.Color(PURPLE);

        this.pulseTl?.kill();
        material.emissive.copy(flash);
        const mix = { t: 0 };
        this.pulseTl = gsap.timeline()
            .to(material, { emissiveIntensity: 0.9, duration: 0.12, ease: 'power2.out' })
            .to(material, { emissiveIntensity: 0.18, duration: 0.7, ease: 'power2.in' })
            .to(mix, {
                t: 1, duration: 0.8, ease: 'power2.in',
                onUpdate: () => material.emissive.copy(flash.clone().lerp(base, mix.t)),
            }, 0);

        if (this.clipTl) {
            gsap.to(this.clipTl, { timeScale: 1.6, duration: 0.15 })
                .then(() => this.clipTl && gsap.to(this.clipTl, { timeScale: 1, duration: 0.6 }));
        }
        this.ringMaterial.color.set(isPr ? SUCCESS : ORANGE);
        gsap.delayedCall(0.9, () => this.ringMaterial.color.set(PURPLE));
    }

    dispose(): void {
        this.clipTl?.kill();
        this.pulseTl?.kill();
        this.rig.dispose();
        this.platform.geometry.dispose();
        this.platformMaterial.dispose();
        this.ring.geometry.dispose();
        this.ringMaterial.dispose();
    }
}
