"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.exportMyData = exports.sanitizeForExport = void 0;
// v1 API — see index.ts. Callables are gcfv1, consistent with the other functions.
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
/**
 * Firestore Timestamps serialize to `{_seconds, _nanoseconds}` over the callable
 * wire — useless in a user-facing data export. Convert them to ISO strings, and
 * recurse through arrays/objects so nested timestamps (e.g. inside a workout) are
 * caught too. Left as a standalone pure function so it can be unit-tested without
 * an emulator.
 */
function sanitizeForExport(value) {
    if (value == null)
        return value;
    // admin Timestamp (duck-typed so a plain {toDate} mock also works in tests).
    if (typeof value.toDate === 'function') {
        return value.toDate().toISOString();
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeForExport);
    }
    if (typeof value === 'object') {
        const out = {};
        for (const [k, v] of Object.entries(value)) {
            out[k] = sanitizeForExport(v);
        }
        return out;
    }
    return value;
}
exports.sanitizeForExport = sanitizeForExport;
/**
 * Serialize a document and everything beneath it. Uses listCollections() so new
 * subcollections (e.g. a future `consents/`) are picked up automatically rather
 * than needing this list kept in sync by hand.
 */
async function exportDocTree(ref) {
    const snap = await ref.get();
    const node = {
        id: ref.id,
        data: snap.exists ? sanitizeForExport(snap.data()) : null,
    };
    const collections = await ref.listCollections();
    if (collections.length) {
        node.subcollections = {};
        for (const col of collections) {
            const docs = await col.get();
            node.subcollections[col.id] = await Promise.all(docs.docs.map(d => exportDocTree(d.ref)));
        }
    }
    return node;
}
/**
 * GDPR Art. 20 — data portability. Returns every document under users/{uid} as
 * JSON. Reads only the caller's own tree (uid comes from the verified token, never
 * from the client payload), so it cannot be used to read another user's data.
 */
exports.exportMyData = functions.https.onCall(async (_data, context) => {
    const uid = context.auth?.uid;
    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'Sign in to export your data.');
    }
    console.log(`[Audit] exportMyData | User: ${uid}`);
    const tree = await exportDocTree(db.collection('users').doc(uid));
    return { exportedAt: new Date().toISOString(), uid, ...tree };
});
/**
 * GDPR Art. 17 — erasure. Deletes the caller's entire Firestore tree, then their
 * Auth record. uid comes from the verified token, so a user can only ever delete
 * themselves — there is no uid parameter to spoof.
 *
 * Firestore is deleted BEFORE Auth on purpose. If Auth deletion then fails, the
 * user still has a (now data-less) login and can retry. The reverse order would
 * risk orphaned PII with no owner and no way to sign in and trigger cleanup.
 *
 * recursiveDelete removes the user doc and every subcollection — workouts, sets,
 * plans, customExercises, stats, workoutLogs, metrics, entitlements, and anything
 * added later. `allow delete: if false` on the client stays: erasure is a
 * server-only, authenticated, deliberate action, never a stray client write.
 */
exports.deleteAccount = functions.https.onCall(async (_data, context) => {
    const uid = context.auth?.uid;
    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'Sign in to delete your account.');
    }
    console.log(`[Audit] deleteAccount START | User: ${uid}`);
    try {
        await db.recursiveDelete(db.collection('users').doc(uid));
        await admin.auth().deleteUser(uid);
        console.log(`[Audit] deleteAccount COMPLETE | User: ${uid}`);
        return { deleted: true };
    }
    catch (error) {
        console.error(`[Audit] deleteAccount FAILED | User: ${uid} | Error:`, error);
        throw new functions.https.HttpsError('internal', 'Could not fully delete your account. Please try again or contact support.');
    }
});
//# sourceMappingURL=account.js.map