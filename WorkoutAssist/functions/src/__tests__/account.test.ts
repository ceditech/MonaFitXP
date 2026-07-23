import { sanitizeForExport } from '../account';

describe('sanitizeForExport', () => {
    it('converts Firestore-like Timestamps to ISO strings', () => {
        const ts = { toDate: () => new Date('2026-07-22T10:00:00.000Z') };
        expect(sanitizeForExport(ts)).toBe('2026-07-22T10:00:00.000Z');
    });

    it('recurses into nested objects and arrays', () => {
        const ts = { toDate: () => new Date('2026-01-02T03:04:05.000Z') };
        const input = {
            name: 'Alice',
            createdAt: ts,
            workouts: [{ id: 'w1', at: ts }],
        };
        expect(sanitizeForExport(input)).toEqual({
            name: 'Alice',
            createdAt: '2026-01-02T03:04:05.000Z',
            workouts: [{ id: 'w1', at: '2026-01-02T03:04:05.000Z' }],
        });
    });

    it('leaves primitives and null untouched', () => {
        expect(sanitizeForExport(null)).toBeNull();
        expect(sanitizeForExport(undefined)).toBeUndefined();
        expect(sanitizeForExport(42)).toBe(42);
        expect(sanitizeForExport('x')).toBe('x');
        expect(sanitizeForExport(true)).toBe(true);
    });
});

// The auth guards are the security-critical part: an unauthenticated caller must
// never reach the Firestore/Auth operations. firebase-functions-test wraps the
// callable so we can invoke it with no auth context and assert it throws before
// touching any backend. The authenticated delete/export paths exercise
// recursiveDelete + admin.auth and are covered by the emulator integration check
// (see functions/README / npm run test:rules host), not here.
describe('callable auth guards', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fft = require('firebase-functions-test')();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const account = require('../account');

    afterAll(() => fft.cleanup());

    it('deleteAccount rejects an unauthenticated caller', async () => {
        const wrapped = fft.wrap(account.deleteAccount);
        await expect(wrapped({}, {})).rejects.toMatchObject({ code: 'unauthenticated' });
    });

    it('exportMyData rejects an unauthenticated caller', async () => {
        const wrapped = fft.wrap(account.exportMyData);
        await expect(wrapped({}, {})).rejects.toMatchObject({ code: 'unauthenticated' });
    });
});
