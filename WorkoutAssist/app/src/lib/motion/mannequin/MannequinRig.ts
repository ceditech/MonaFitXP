
import * as THREE from 'three';
import { JointName, Pose } from './poses';

const DEG = Math.PI / 180;

const BODY_COLOR = 0x8e24aa;   // brand purple
const ACCENT_COLOR = 0xff7a29; // brand orange (joints/head accent)

/**
 * Procedural humanoid: capsule limbs + sphere joints assembled in a
 * pivot hierarchy so poses are pure joint rotations. No external 3D
 * assets — the whole character is built from primitives at runtime.
 *
 * Hierarchy (pivots):
 *   root (pelvis, y≈0.96)
 *     ├─ spine ─ chest ─ neck ─ head
 *     │        ├─ shoulderL ─ upperArm ─ elbowL ─ forearm ─ hand
 *     │        └─ shoulderR ─ …
 *     ├─ hipL ─ thigh ─ kneeL ─ shin ─ foot
 *     └─ hipR ─ …
 */
export class MannequinRig {
    readonly root = new THREE.Group();
    private joints = new Map<JointName, THREE.Group>();
    private materials: THREE.Material[] = [];
    private geometries: THREE.BufferGeometry[] = [];
    private baseY = 0.96;
    readonly bodyMaterial: THREE.MeshStandardMaterial;

    constructor() {
        this.bodyMaterial = new THREE.MeshStandardMaterial({
            color: BODY_COLOR,
            emissive: BODY_COLOR,
            emissiveIntensity: 0.18,
            roughness: 0.45,
            metalness: 0.25,
        });
        const accentMaterial = new THREE.MeshStandardMaterial({
            color: ACCENT_COLOR,
            emissive: ACCENT_COLOR,
            emissiveIntensity: 0.35,
            roughness: 0.4,
        });
        this.materials.push(this.bodyMaterial, accentMaterial);

        const capsule = (radius: number, length: number, material = this.bodyMaterial) => {
            const geo = new THREE.CapsuleGeometry(radius, length, 4, 10);
            this.geometries.push(geo);
            return new THREE.Mesh(geo, material);
        };
        const sphere = (radius: number, material = accentMaterial) => {
            const geo = new THREE.SphereGeometry(radius, 14, 12);
            this.geometries.push(geo);
            return new THREE.Mesh(geo, material);
        };

        // A limb segment whose PIVOT is at its top and mesh hangs along -Y.
        const limb = (radius: number, length: number): THREE.Group => {
            const group = new THREE.Group();
            const mesh = capsule(radius, length - radius * 2);
            mesh.position.y = -length / 2;
            group.add(mesh, sphere(radius * 1.15)); // joint ball at the pivot
            return group;
        };

        this.root.position.y = this.baseY;
        this.joints.set('root', this.root);

        // Pelvis
        const pelvis = capsule(0.13, 0.1);
        this.root.add(pelvis);

        // Spine → chest → neck → head
        const spine = new THREE.Group();
        spine.position.y = 0.08;
        const chest = capsule(0.15, 0.26);
        chest.position.y = 0.24;
        spine.add(chest);
        this.root.add(spine);
        this.joints.set('spine', spine);

        const neck = new THREE.Group();
        neck.position.y = 0.46;
        const head = sphere(0.115);
        head.position.y = 0.14;
        neck.add(head);
        spine.add(neck);
        this.joints.set('neck', neck);

        // Arms
        const buildArm = (side: 1 | -1, shoulderName: JointName, elbowName: JointName) => {
            const shoulder = new THREE.Group();
            shoulder.position.set(0.235 * side, 0.4, 0);
            const upper = limb(0.055, 0.3);
            shoulder.add(upper);

            const elbow = new THREE.Group();
            elbow.position.y = -0.3;
            const forearm = limb(0.048, 0.27);
            elbow.add(forearm);
            const hand = sphere(0.055, this.bodyMaterial as THREE.MeshStandardMaterial);
            hand.position.y = -0.29;
            elbow.add(hand);

            upper.add(elbow);
            spine.add(shoulder);
            this.joints.set(shoulderName, shoulder);
            this.joints.set(elbowName, elbow);
        };
        buildArm(-1, 'shoulderL', 'elbowL');
        buildArm(1, 'shoulderR', 'elbowR');

        // Legs
        const buildLeg = (side: 1 | -1, hipName: JointName, kneeName: JointName) => {
            const hip = new THREE.Group();
            hip.position.set(0.11 * side, -0.06, 0);
            const thigh = limb(0.07, 0.42);
            hip.add(thigh);

            const knee = new THREE.Group();
            knee.position.y = -0.42;
            const shin = limb(0.055, 0.4);
            knee.add(shin);
            const foot = capsule(0.05, 0.1);
            foot.rotation.x = 90 * DEG;
            foot.position.set(0, -0.43, 0.07);
            knee.add(foot);

            thigh.add(knee);
            this.root.add(hip);
            this.joints.set(hipName, hip);
            this.joints.set(kneeName, knee);
        };
        buildLeg(-1, 'hipL', 'kneeL');
        buildLeg(1, 'hipR', 'kneeR');
    }

    /**
     * The gsap-tweenable target for a joint's rotation (radians).
     * Mirroring: abduction (z) is authored for the LEFT side; the right
     * side flips sign so symmetric poses read naturally in the data.
     */
    jointRotation(name: JointName): THREE.Euler | null {
        return this.joints.get(name)?.rotation ?? null;
    }

    /** Convert a declarative pose (degrees) into per-joint radian targets. */
    poseTargets(pose: Pose): { target: THREE.Euler | THREE.Vector3; values: Record<string, number> }[] {
        const out: { target: THREE.Euler | THREE.Vector3; values: Record<string, number> }[] = [];

        for (const [name, rot] of Object.entries(pose)) {
            if (name === 'posY') continue;
            const joint = this.joints.get(name as JointName);
            if (!joint || typeof rot !== 'object' || rot === null) continue;

            const mirror = name.endsWith('R') ? -1 : 1;
            const values: Record<string, number> = {};
            const r = rot as { x?: number; y?: number; z?: number };
            if (r.x !== undefined) values.x = r.x * DEG;
            if (r.y !== undefined) values.y = r.y * DEG * mirror;
            if (r.z !== undefined) values.z = r.z * DEG * mirror;
            out.push({ target: joint.rotation, values });
        }

        if (pose.posY !== undefined) {
            out.push({ target: this.root.position, values: { y: this.baseY + pose.posY } });
        }

        return out;
    }

    dispose(): void {
        this.geometries.forEach(g => g.dispose());
        this.materials.forEach(m => m.dispose());
    }
}
