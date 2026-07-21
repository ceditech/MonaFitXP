/**
 * Firestore security-rules tests (run against the local emulator — free, no
 * Firebase project or billing required).
 *
 *   npm run test:rules
 *
 * These lock down the launch-blocking guarantees:
 *  - default deny for anonymous/unknown paths
 *  - per-user data isolation (owner-only)
 *  - metrics (XP/gamification) are server-write-only  -> anti-cheat
 *  - entitlements (tier/Pro) are server-write-only     -> no self-granted Pro
 */
import {
    initializeTestEnvironment,
    assertFails,
    assertSucceeds,
    RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

const ALICE = 'alice_uid';
const BOB = 'bob_uid';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
        projectId: 'demo-workoutassist',
        firestore: {
            rules: readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8'),
            host: '127.0.0.1',
            port: 8080,
        },
    });
});

afterAll(async () => {
    await testEnv?.cleanup();
});

beforeEach(async () => {
    await testEnv.clearFirestore();
});

/** Authenticated context for a given uid (optionally with the admin claim). */
const asUser = (uid: string, admin = false) =>
    testEnv.authenticatedContext(uid, admin ? { admin: true } : {}).firestore();
const asAnon = () => testEnv.unauthenticatedContext().firestore();

/** Seed a doc bypassing rules, so read-tests aren't testing writes. */
const seed = (path: string, data: Record<string, unknown>) =>
    testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), path), data);
    });

describe('default deny', () => {
    it('blocks anonymous reads of the exercise catalog', async () => {
        await seed('exerciseCatalog/ex_001', { name: 'Barbell Squat' });
        await assertFails(getDoc(doc(asAnon(), 'exerciseCatalog/ex_001')));
    });

    it('blocks reads/writes of an unknown top-level collection, even signed in', async () => {
        await assertFails(getDoc(doc(asUser(ALICE), 'somethingRandom/doc1')));
        await assertFails(setDoc(doc(asUser(ALICE), 'somethingRandom/doc1'), { a: 1 }));
    });
});

describe('global catalogs', () => {
    it('lets any signed-in user read, but non-admins cannot write', async () => {
        await seed('exerciseCatalog/ex_001', { name: 'Barbell Squat' });
        await assertSucceeds(getDoc(doc(asUser(ALICE), 'exerciseCatalog/ex_001')));
        await assertFails(setDoc(doc(asUser(ALICE), 'exerciseCatalog/ex_001'), { name: 'hacked' }));
    });

    it('allows admin writes', async () => {
        await assertSucceeds(
            setDoc(doc(asUser(ALICE, true), 'exerciseCatalog/ex_999'), { name: 'New' }),
        );
    });

    it('protects plan templates the same way', async () => {
        await seed('planTemplates/tpl_001', { name: 'Full Body' });
        await assertSucceeds(getDoc(doc(asUser(ALICE), 'planTemplates/tpl_001')));
        await assertFails(setDoc(doc(asUser(ALICE), 'planTemplates/tpl_001'), { name: 'x' }));
        await assertSucceeds(setDoc(doc(asUser(ALICE, true), 'planTemplates/tpl_002'), { name: 'y' }));
    });
});

describe('user profile isolation', () => {
    it('lets the owner create and read their own profile', async () => {
        await assertSucceeds(setDoc(doc(asUser(ALICE), `users/${ALICE}`), { displayName: 'Alice' }));
        await assertSucceeds(getDoc(doc(asUser(ALICE), `users/${ALICE}`)));
    });

    it("blocks another user from reading or writing someone else's profile", async () => {
        await seed(`users/${ALICE}`, { displayName: 'Alice' });
        await assertFails(getDoc(doc(asUser(BOB), `users/${ALICE}`)));
        await assertFails(setDoc(doc(asUser(BOB), `users/${ALICE}`), { displayName: 'Bob' }));
    });

    it('denies profile deletion even by the owner', async () => {
        await seed(`users/${ALICE}`, { displayName: 'Alice' });
        await assertFails(deleteDoc(doc(asUser(ALICE), `users/${ALICE}`)));
    });
});

describe('user subcollections (workouts, plans)', () => {
    it('allows the owner and blocks everyone else', async () => {
        await assertSucceeds(
            setDoc(doc(asUser(ALICE), `users/${ALICE}/workouts/w1`), { planId: 'tpl_001' }),
        );
        await assertFails(
            setDoc(doc(asUser(BOB), `users/${ALICE}/workouts/w1`), { planId: 'evil' }),
        );

        await assertSucceeds(setDoc(doc(asUser(ALICE), `users/${ALICE}/plans/p1`), { name: 'Mine' }));
        await assertFails(getDoc(doc(asUser(BOB), `users/${ALICE}/plans/p1`)));
    });

    it('protects nested workout sets', async () => {
        await assertSucceeds(
            setDoc(doc(asUser(ALICE), `users/${ALICE}/workouts/w1/sets/s1`), { reps: 10 }),
        );
        await assertFails(
            setDoc(doc(asUser(BOB), `users/${ALICE}/workouts/w1/sets/s1`), { reps: 99 }),
        );
    });
});

describe('profile PII validation', () => {
    it('accepts a profile with no health fields at all', async () => {
        await assertSucceeds(
            setDoc(doc(asUser(ALICE), `users/${ALICE}`), { name: 'Alice', daysPerWeek: 3 }),
        );
    });

    it('accepts injuryFlags drawn from the known vocabulary', async () => {
        await assertSucceeds(
            setDoc(doc(asUser(ALICE), `users/${ALICE}`), {
                injuryFlags: ['knees', 'lower_back'],
            }),
        );
    });

    it('rejects unknown injury ids, a non-list, and an over-long list', async () => {
        await assertFails(
            setDoc(doc(asUser(ALICE), `users/${ALICE}`), { injuryFlags: ['knees', 'freetext'] }),
        );
        await assertFails(
            setDoc(doc(asUser(ALICE), `users/${ALICE}`), { injuryFlags: 'knees' }),
        );
        await assertFails(
            setDoc(doc(asUser(ALICE), `users/${ALICE}`), {
                injuryFlags: Array.from({ length: 21 }, () => 'knees'),
            }),
        );
    });

    it('lets a profile set dateOfBirth once', async () => {
        await assertSucceeds(
            setDoc(doc(asUser(ALICE), `users/${ALICE}`), { dateOfBirth: '1990-05-01' }),
        );
    });

    it('blocks editing dateOfBirth after it is set (age-gate tamper)', async () => {
        await seed(`users/${ALICE}`, { dateOfBirth: '1990-05-01' });
        await assertFails(
            setDoc(
                doc(asUser(ALICE), `users/${ALICE}`),
                { dateOfBirth: '2010-05-01' },
                { merge: true },
            ),
        );
    });

    it('still allows unrelated profile edits once dateOfBirth is set', async () => {
        await seed(`users/${ALICE}`, { dateOfBirth: '1990-05-01', daysPerWeek: 3 });
        await assertSucceeds(
            setDoc(doc(asUser(ALICE), `users/${ALICE}`), { daysPerWeek: 5 }, { merge: true }),
        );
    });

    it("blocks writing health data into another user's profile", async () => {
        await assertFails(
            setDoc(doc(asUser(BOB), `users/${ALICE}`), { injuryFlags: ['knees'] }),
        );
    });
});

describe('custom exercises validation', () => {
    const valid = { name: 'My Lift', muscles: ['chest'] };

    it('accepts a well-formed custom exercise from the owner', async () => {
        await assertSucceeds(
            setDoc(doc(asUser(ALICE), `users/${ALICE}/customExercises/c1`), valid),
        );
    });

    it('rejects an empty name, an over-long name, and a non-list muscles field', async () => {
        await assertFails(
            setDoc(doc(asUser(ALICE), `users/${ALICE}/customExercises/c2`), { ...valid, name: '' }),
        );
        await assertFails(
            setDoc(doc(asUser(ALICE), `users/${ALICE}/customExercises/c3`), {
                ...valid,
                name: 'x'.repeat(81),
            }),
        );
        await assertFails(
            setDoc(doc(asUser(ALICE), `users/${ALICE}/customExercises/c4`), {
                ...valid,
                muscles: 'chest',
            }),
        );
    });

    it("blocks writing into another user's custom exercises", async () => {
        await assertFails(
            setDoc(doc(asUser(BOB), `users/${ALICE}/customExercises/c5`), valid),
        );
    });
});

describe('metrics are server-write-only (anti-cheat)', () => {
    it('lets the owner read their metrics', async () => {
        await seed(`users/${ALICE}/metrics/gamification`, { xp: 100, level: 2 });
        await assertSucceeds(getDoc(doc(asUser(ALICE), `users/${ALICE}/metrics/gamification`)));
    });

    it('blocks the owner from writing XP/level themselves', async () => {
        await assertFails(
            setDoc(doc(asUser(ALICE), `users/${ALICE}/metrics/gamification`), {
                xp: 999999,
                level: 99,
            }),
        );
    });

    it("blocks another user from reading or writing someone's metrics", async () => {
        await seed(`users/${ALICE}/metrics/gamification`, { xp: 100 });
        await assertFails(getDoc(doc(asUser(BOB), `users/${ALICE}/metrics/gamification`)));
        await assertFails(
            setDoc(doc(asUser(BOB), `users/${ALICE}/metrics/gamification`), { xp: 0 }),
        );
    });
});

describe('entitlements are server-write-only (no self-granted Pro)', () => {
    it('lets the owner get their own entitlement doc', async () => {
        await seed(`users/${ALICE}/entitlements/current`, { tier: 'free' });
        await assertSucceeds(getDoc(doc(asUser(ALICE), `users/${ALICE}/entitlements/current`)));
    });

    it('blocks a client from granting itself pro', async () => {
        await assertFails(
            setDoc(doc(asUser(ALICE), `users/${ALICE}/entitlements/current`), { tier: 'pro' }),
        );
    });

    it('blocks overwriting an existing free entitlement with pro', async () => {
        await seed(`users/${ALICE}/entitlements/current`, { tier: 'free' });
        await assertFails(
            setDoc(doc(asUser(ALICE), `users/${ALICE}/entitlements/current`), { tier: 'pro' }),
        );
    });

    it('denies listing the entitlements collection', async () => {
        await seed(`users/${ALICE}/entitlements/current`, { tier: 'free' });
        await assertFails(getDocs(collection(asUser(ALICE), `users/${ALICE}/entitlements`)));
    });

    it("blocks another user from reading someone's entitlement", async () => {
        await seed(`users/${ALICE}/entitlements/current`, { tier: 'pro' });
        await assertFails(getDoc(doc(asUser(BOB), `users/${ALICE}/entitlements/current`)));
    });
});
