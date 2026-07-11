import {
    clampPulseScale,
    pulseScaleFor,
    progressToAngle,
    drawCountForProgress,
    particleVelocity,
    particlePosition,
    burstColorsFor,
} from '../sceneMath';

describe('clampPulseScale', () => {
    it('clamps into [1.05, 1.4]', () => {
        expect(clampPulseScale(1.2)).toBe(1.2);
        expect(clampPulseScale(0.5)).toBe(1.05);
        expect(clampPulseScale(9)).toBe(1.4);
        expect(clampPulseScale(NaN)).toBe(1.15);
    });

    it('PR pulses punch harder than normal', () => {
        expect(pulseScaleFor('pr')).toBeGreaterThan(pulseScaleFor('normal'));
    });
});

describe('progressToAngle / drawCountForProgress', () => {
    it('maps 0..1 to 0..2π', () => {
        expect(progressToAngle(0)).toBe(0);
        expect(progressToAngle(0.5)).toBeCloseTo(Math.PI, 6);
        expect(progressToAngle(1)).toBeCloseTo(Math.PI * 2, 6);
    });

    it('clamps out-of-range ratios', () => {
        expect(progressToAngle(-1)).toBe(0);
        expect(progressToAngle(2)).toBeCloseTo(Math.PI * 2, 6);
    });

    it('maps ratio to vertex draw count', () => {
        expect(drawCountForProgress(0, 128)).toBe(0);
        expect(drawCountForProgress(0.5, 128)).toBe(64);
        expect(drawCountForProgress(1, 128)).toBe(128);
        expect(drawCountForProgress(1.5, 128)).toBe(128);
    });
});

describe('particleVelocity', () => {
    it('is deterministic', () => {
        expect(particleVelocity(7, 120)).toEqual(particleVelocity(7, 120));
    });

    it('biases every particle upward', () => {
        for (let i = 0; i < 120; i++) {
            expect(particleVelocity(i, 120).vy).toBeGreaterThan(0);
        }
    });

    it('spreads horizontally in both directions', () => {
        const vxs = Array.from({ length: 120 }, (_, i) => particleVelocity(i, 120).vx);
        expect(Math.min(...vxs)).toBeLessThan(0);
        expect(Math.max(...vxs)).toBeGreaterThan(0);
    });

    it('scales with speed', () => {
        const slow = particleVelocity(3, 10, 1);
        const fast = particleVelocity(3, 10, 2);
        expect(fast.vy).toBeCloseTo(slow.vy * 2, 6);
    });
});

describe('particlePosition', () => {
    it('starts at origin and arcs under gravity', () => {
        const v = { vx: 1, vy: 3, vz: 0 };
        expect(particlePosition(v, 0)).toEqual({ x: 0, y: 0, z: 0 });

        const early = particlePosition(v, 0.2);
        expect(early.y).toBeGreaterThan(0); // going up

        const late = particlePosition(v, 3);
        expect(late.y).toBeLessThan(0); // fallen past origin
        expect(late.x).toBeCloseTo(3, 6); // constant horizontal velocity
    });
});

describe('burstColorsFor', () => {
    it('returns a non-empty distinct palette per kind', () => {
        for (const kind of ['finish', 'pr', 'levelUp'] as const) {
            expect(burstColorsFor(kind).length).toBeGreaterThanOrEqual(3);
        }
        expect(burstColorsFor('pr')).not.toEqual(burstColorsFor('finish'));
    });
});
