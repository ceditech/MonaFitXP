
// Pure math for the motivator scenes. No three/gsap/RN imports — fully unit
// testable. Scene classes consume these so their behavior is verifiable
// without a GL context.

export type PulseKind = 'normal' | 'pr';
export type BurstKind = 'finish' | 'pr' | 'levelUp';

/** Clamp a pulse intensity into the safe visual range. */
export function clampPulseScale(intensity: number): number {
    if (!Number.isFinite(intensity)) return 1.15;
    return Math.min(Math.max(intensity, 1.05), 1.4);
}

/** Pulse scale per kind: PRs punch harder. */
export function pulseScaleFor(kind: PulseKind): number {
    return clampPulseScale(kind === 'pr' ? 1.35 : 1.18);
}

/**
 * Ring progress (0..1 remaining) → sweep angle in radians.
 * Full ring at 1, empty at 0.
 */
export function progressToAngle(ratio: number): number {
    const clamped = Math.min(Math.max(ratio, 0), 1);
    return clamped * Math.PI * 2;
}

/**
 * Points drawn for a progress ring built from `segments` vertices.
 * setDrawRange-compatible: returns the vertex count for the given ratio.
 */
export function drawCountForProgress(ratio: number, segments: number): number {
    const clamped = Math.min(Math.max(ratio, 0), 1);
    return Math.round(clamped * segments);
}

export interface ParticleInit {
    /** Unit-ish direction * speed, y biased upward. */
    vx: number;
    vy: number;
    vz: number;
}

/**
 * Deterministic radial particle velocity for particle `i` of `count`.
 * Deterministic (no RNG) so tests can assert the distribution: golden-angle
 * spiral over a hemisphere, upward-biased.
 */
export function particleVelocity(i: number, count: number, speed = 3): ParticleInit {
    const golden = Math.PI * (3 - Math.sqrt(5)); // golden angle
    const theta = i * golden;
    // Spread elevation between 15° and 85° so bursts fly mostly upward.
    const t = count > 1 ? i / (count - 1) : 0.5;
    const elevation = (Math.PI / 12) + t * (Math.PI * 0.39);

    return {
        vx: Math.cos(theta) * Math.cos(elevation) * speed,
        vy: Math.sin(elevation) * speed,
        vz: Math.sin(theta) * Math.cos(elevation) * speed * 0.4,
    };
}

/** Gravity-integrated particle position at time t (seconds). */
export function particlePosition(v: ParticleInit, t: number, gravity = 4.5): { x: number; y: number; z: number } {
    return {
        x: v.vx * t,
        y: v.vy * t - 0.5 * gravity * t * t,
        z: v.vz * t,
    };
}

/** Burst palettes per kind (hex ints for three materials). */
export function burstColorsFor(kind: BurstKind): number[] {
    switch (kind) {
        case 'pr': return [0x34c759, 0x8ee9a1, 0xffffff];        // success greens
        case 'levelUp': return [0xff7a29, 0xffc46b, 0xffffff];   // brand orange
        case 'finish':
        default: return [0x8e24aa, 0xc46bff, 0xff7a29];          // purple/orange
    }
}
