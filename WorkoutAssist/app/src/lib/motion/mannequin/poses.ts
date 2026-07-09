
// Pose & animation-clip data for the exercise-demo mannequin.
// Pure data — no three.js imports — so it can be tuned and tested freely.
//
// Conventions (character faces the camera, +Z):
//   - Limbs hang along -Y from their pivot. rotation.x POSITIVE swings the
//     limb FORWARD (toward the viewer); negative swings it backward.
//   - rotation.z on shoulders/hips abducts the limb sideways (positive =
//     away from the body on the LEFT side; the rig mirrors the right side).
//   - spine.x positive = lean forward; root.y offsets the whole body
//     (squat depth, jumps); root.x rotation lays the body down (bench).
// All angles are DEGREES here; the rig converts to radians.

export type JointName =
    | 'root'        // whole-body position.y offset + rotation.x (lying down)
    | 'spine'       // torso lean
    | 'neck'
    | 'shoulderL' | 'shoulderR'
    | 'elbowL' | 'elbowR'
    | 'hipL' | 'hipR'
    | 'kneeL' | 'kneeR';

export interface JointRotation { x?: number; y?: number; z?: number }

/** A pose: joint → rotation (deg). root also supports posY (world offset). */
export type Pose = Partial<Record<JointName, JointRotation>> & { posY?: number };

export interface Keyframe {
    pose: Pose;
    /** Seconds to tween INTO this pose. */
    duration: number;
    ease?: string;
}

export interface ExerciseClip {
    keyframes: Keyframe[];
    /** Whether the clip yoyos (A→B→A) instead of jumping back to frame 0. */
    yoyo?: boolean;
}

export type AnimationKey =
    | 'squat' | 'lunge' | 'deadlift' | 'benchPress' | 'overheadPress'
    | 'row' | 'curl' | 'pushup' | 'pullup' | 'plank' | 'jumpingJack'
    | 'run' | 'crunch' | 'calfRaise' | 'lateralRaise' | 'generic';

const STAND: Pose = {
    root: { x: 0 }, posY: 0,
    spine: { x: 0 }, neck: { x: 0 },
    shoulderL: { x: 0, z: 4 }, shoulderR: { x: 0, z: 4 },
    elbowL: { x: 0 }, elbowR: { x: 0 },
    hipL: { x: 0 }, hipR: { x: 0 },
    kneeL: { x: 0 }, kneeR: { x: 0 },
};

export const CLIPS: Record<AnimationKey, ExerciseClip> = {
    squat: {
        yoyo: true,
        keyframes: [
            { pose: { ...STAND, shoulderL: { x: 40 }, shoulderR: { x: 40 } }, duration: 0.4 },
            {
                pose: {
                    posY: -0.42,
                    spine: { x: 28 },
                    shoulderL: { x: 85 }, shoulderR: { x: 85 },
                    hipL: { x: 100 }, hipR: { x: 100 },
                    kneeL: { x: -112 }, kneeR: { x: -112 },
                },
                duration: 1.1, ease: 'power2.inOut',
            },
        ],
    },

    lunge: {
        yoyo: true,
        keyframes: [
            { pose: { ...STAND, shoulderL: { x: 10 }, shoulderR: { x: 10 } }, duration: 0.4 },
            {
                pose: {
                    posY: -0.34,
                    spine: { x: 8 },
                    hipL: { x: 78 }, kneeL: { x: -85 },   // front leg
                    hipR: { x: -30 }, kneeR: { x: -95 },  // trailing leg
                    shoulderL: { x: 10 }, shoulderR: { x: 10 },
                },
                duration: 1.0, ease: 'power2.inOut',
            },
        ],
    },

    deadlift: {
        yoyo: true,
        keyframes: [
            { pose: { ...STAND }, duration: 0.5 },
            {
                pose: {
                    posY: -0.18,
                    spine: { x: 55 },
                    hipL: { x: 62 }, hipR: { x: 62 },
                    kneeL: { x: -35 }, kneeR: { x: -35 },
                    shoulderL: { x: 62 }, shoulderR: { x: 62 }, // arms hang toward bar
                    neck: { x: -20 },
                },
                duration: 1.1, ease: 'power2.inOut',
            },
        ],
    },

    benchPress: {
        yoyo: true,
        keyframes: [
            {
                // Lying on the bench, bar at chest
                pose: {
                    root: { x: -90 }, posY: -0.35,
                    hipL: { x: 55 }, hipR: { x: 55 },
                    kneeL: { x: -80 }, kneeR: { x: -80 },
                    shoulderL: { x: 90, z: 20 }, shoulderR: { x: 90, z: 20 },
                    elbowL: { x: 95 }, elbowR: { x: 95 },
                },
                duration: 0.5,
            },
            {
                // Press to lockout
                pose: {
                    root: { x: -90 }, posY: -0.35,
                    hipL: { x: 55 }, hipR: { x: 55 },
                    kneeL: { x: -80 }, kneeR: { x: -80 },
                    shoulderL: { x: 90, z: 4 }, shoulderR: { x: 90, z: 4 },
                    elbowL: { x: 2 }, elbowR: { x: 2 },
                },
                duration: 0.9, ease: 'power2.inOut',
            },
        ],
    },

    overheadPress: {
        yoyo: true,
        keyframes: [
            {
                // Rack position: elbows bent, hands at shoulders
                pose: { ...STAND, shoulderL: { x: 40, z: 25 }, shoulderR: { x: 40, z: 25 }, elbowL: { x: 120 }, elbowR: { x: 120 } },
                duration: 0.5,
            },
            {
                // Lockout overhead
                pose: {
                    ...STAND,
                    shoulderL: { x: 178, z: 8 }, shoulderR: { x: 178, z: 8 },
                    elbowL: { x: 3 }, elbowR: { x: 3 },
                    spine: { x: -4 },
                },
                duration: 0.9, ease: 'power2.inOut',
            },
        ],
    },

    row: {
        yoyo: true,
        keyframes: [
            {
                // Hinged, arms hanging
                pose: {
                    posY: -0.12,
                    spine: { x: 45 },
                    hipL: { x: 45 }, hipR: { x: 45 },
                    kneeL: { x: -25 }, kneeR: { x: -25 },
                    shoulderL: { x: 55 }, shoulderR: { x: 55 },
                    elbowL: { x: 5 }, elbowR: { x: 5 },
                    neck: { x: -15 },
                },
                duration: 0.5,
            },
            {
                // Pull to torso
                pose: {
                    posY: -0.12,
                    spine: { x: 45 },
                    hipL: { x: 45 }, hipR: { x: 45 },
                    kneeL: { x: -25 }, kneeR: { x: -25 },
                    shoulderL: { x: 15 }, shoulderR: { x: 15 },
                    elbowL: { x: 110 }, elbowR: { x: 110 },
                    neck: { x: -15 },
                },
                duration: 0.8, ease: 'power2.inOut',
            },
        ],
    },

    curl: {
        yoyo: true,
        keyframes: [
            { pose: { ...STAND, elbowL: { x: 8 }, elbowR: { x: 8 } }, duration: 0.4 },
            { pose: { ...STAND, elbowL: { x: 135 }, elbowR: { x: 135 } }, duration: 0.9, ease: 'power2.inOut' },
        ],
    },

    pushup: {
        yoyo: true,
        keyframes: [
            {
                // Top of push-up: body plank, arms extended to the floor
                pose: {
                    root: { x: 78 }, posY: -0.55,
                    shoulderL: { x: 85 }, shoulderR: { x: 85 },
                    elbowL: { x: 5 }, elbowR: { x: 5 },
                    neck: { x: -35 },
                },
                duration: 0.5,
            },
            {
                // Bottom: elbows bent, chest near floor
                pose: {
                    root: { x: 82 }, posY: -0.78,
                    shoulderL: { x: 55, z: 30 }, shoulderR: { x: 55, z: 30 },
                    elbowL: { x: 95 }, elbowR: { x: 95 },
                    neck: { x: -35 },
                },
                duration: 0.8, ease: 'power2.inOut',
            },
        ],
    },

    pullup: {
        yoyo: true,
        keyframes: [
            {
                // Dead hang
                pose: {
                    ...STAND, posY: 0.05,
                    shoulderL: { x: 178, z: 12 }, shoulderR: { x: 178, z: 12 },
                    elbowL: { x: 5 }, elbowR: { x: 5 },
                    kneeL: { x: -40 }, kneeR: { x: -40 },
                },
                duration: 0.5,
            },
            {
                // Chin over bar
                pose: {
                    posY: 0.42,
                    shoulderL: { x: 145, z: 20 }, shoulderR: { x: 145, z: 20 },
                    elbowL: { x: 120 }, elbowR: { x: 120 },
                    kneeL: { x: -55 }, kneeR: { x: -55 },
                    spine: { x: -5 },
                },
                duration: 0.9, ease: 'power2.inOut',
            },
        ],
    },

    plank: {
        yoyo: true,
        keyframes: [
            {
                pose: {
                    root: { x: 80 }, posY: -0.68,
                    shoulderL: { x: 80 }, shoulderR: { x: 80 },
                    elbowL: { x: 90 }, elbowR: { x: 90 }, // forearm plank
                    neck: { x: -35 },
                },
                duration: 0.6,
            },
            {
                // Subtle breathing hold
                pose: {
                    root: { x: 80 }, posY: -0.665,
                    shoulderL: { x: 80 }, shoulderR: { x: 80 },
                    elbowL: { x: 90 }, elbowR: { x: 90 },
                    neck: { x: -32 },
                },
                duration: 1.4, ease: 'sine.inOut',
            },
        ],
    },

    jumpingJack: {
        yoyo: true,
        keyframes: [
            { pose: { ...STAND }, duration: 0.28, ease: 'power1.in' },
            {
                pose: {
                    posY: 0.1,
                    shoulderL: { x: 0, z: 165 }, shoulderR: { x: 0, z: 165 },
                    hipL: { z: 32 }, hipR: { z: 32 },
                },
                duration: 0.28, ease: 'power1.out',
            },
        ],
    },

    run: {
        keyframes: [
            {
                pose: {
                    posY: 0.02, spine: { x: 6 },
                    hipL: { x: 55 }, kneeL: { x: -70 },
                    hipR: { x: -25 }, kneeR: { x: -30 },
                    shoulderL: { x: -30 }, elbowL: { x: 80 },
                    shoulderR: { x: 40 }, elbowR: { x: 80 },
                },
                duration: 0.3, ease: 'sine.inOut',
            },
            {
                pose: {
                    posY: 0.02, spine: { x: 6 },
                    hipL: { x: -25 }, kneeL: { x: -30 },
                    hipR: { x: 55 }, kneeR: { x: -70 },
                    shoulderL: { x: 40 }, elbowL: { x: 80 },
                    shoulderR: { x: -30 }, elbowR: { x: 80 },
                },
                duration: 0.3, ease: 'sine.inOut',
            },
        ],
    },

    crunch: {
        yoyo: true,
        keyframes: [
            {
                // Lying on back, knees up
                pose: {
                    root: { x: -90 }, posY: -0.72,
                    hipL: { x: 70 }, hipR: { x: 70 },
                    kneeL: { x: -95 }, kneeR: { x: -95 },
                    shoulderL: { x: 90, z: 35 }, shoulderR: { x: 90, z: 35 },
                    elbowL: { x: 120 }, elbowR: { x: 120 },
                },
                duration: 0.5,
            },
            {
                // Crunch up
                pose: {
                    root: { x: -90 }, posY: -0.72,
                    spine: { x: 38 }, neck: { x: 22 },
                    hipL: { x: 70 }, hipR: { x: 70 },
                    kneeL: { x: -95 }, kneeR: { x: -95 },
                    shoulderL: { x: 90, z: 35 }, shoulderR: { x: 90, z: 35 },
                    elbowL: { x: 120 }, elbowR: { x: 120 },
                },
                duration: 0.7, ease: 'power2.inOut',
            },
        ],
    },

    calfRaise: {
        yoyo: true,
        keyframes: [
            { pose: { ...STAND }, duration: 0.4 },
            { pose: { ...STAND, posY: 0.09 }, duration: 0.7, ease: 'power2.inOut' },
        ],
    },

    lateralRaise: {
        yoyo: true,
        keyframes: [
            { pose: { ...STAND, shoulderL: { z: 8 }, shoulderR: { z: 8 } }, duration: 0.4 },
            { pose: { ...STAND, shoulderL: { z: 92 }, shoulderR: { z: 92 } }, duration: 0.9, ease: 'power2.inOut' },
        ],
    },

    generic: {
        yoyo: true,
        keyframes: [
            { pose: { ...STAND }, duration: 0.6 },
            {
                pose: {
                    posY: -0.15,
                    spine: { x: 10 },
                    hipL: { x: 35 }, hipR: { x: 35 },
                    kneeL: { x: -40 }, kneeR: { x: -40 },
                    shoulderL: { x: 45 }, shoulderR: { x: 45 },
                },
                duration: 1.0, ease: 'power2.inOut',
            },
        ],
    },
};

/** Infer an animation key from an exercise's name (fallback when no explicit media.animationKey). */
export function inferAnimationKey(name: string): AnimationKey {
    const n = name.toLowerCase();
    if (n.includes('leg press') || n.includes('squat')) return 'squat';
    if (n.includes('lunge') || n.includes('step up') || n.includes('step-up')) return 'lunge';
    if (n.includes('leg curl') || n.includes('hamstring') || n.includes('deadlift') || n.includes('hinge') || n.includes('good morning')) return 'deadlift';
    if (n.includes('bench') || (n.includes('chest') && n.includes('press')) || n.includes('fly')) return 'benchPress';
    if (n.includes('overhead') || n.includes('shoulder press') || n.includes('military') || n.includes('tricep')) return 'overheadPress';
    if (n.includes('row') || n.includes('face pull')) return 'row';
    if (n.includes('curl')) return 'curl';
    if (n.includes('push-up') || n.includes('pushup') || n.includes('push up') || n.includes('dip')) return 'pushup';
    if (n.includes('pull-up') || n.includes('pullup') || n.includes('pull up') || n.includes('chin') || n.includes('pulldown') || n.includes('pull down') || n.includes('lat ')) return 'pullup';
    if (n.includes('plank')) return 'plank';
    if (n.includes('jack') || n.includes('burpee') || n.includes('box jump') || n.includes('jump')) return 'jumpingJack';
    if (n.includes('run') || n.includes('sprint') || n.includes('treadmill') || n.includes('cardio') || n.includes('cycl') || n.includes('bike') || n.includes('jump rope') || n.includes('mountain climber')) return 'run';
    if (n.includes('crunch') || n.includes('sit-up') || n.includes('situp') || n.includes('sit up') || n.includes('ab ')) return 'crunch';
    if (n.includes('calf')) return 'calfRaise';
    if (n.includes('lateral raise') || n.includes('side raise') || n.includes('raise')) return 'lateralRaise';
    if (n.includes('press')) return 'overheadPress';
    return 'generic';
}

export function isAnimationKey(key: string | undefined): key is AnimationKey {
    return !!key && key in CLIPS;
}
