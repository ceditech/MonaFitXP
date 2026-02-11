
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

export const ensureEntitlementDoc = functions.auth.user().onCreate(async (user: admin.auth.UserRecord) => {
    const uid = user.uid;
    console.log(`[Audit] ensureEntitlementDoc Start | User: ${uid} | Email: ${user.email}`);

    try {
        const batch = db.batch();

        // 1. Create Entitlement document
        const entitlementRef = db.collection('users').doc(uid).collection('entitlements').doc('current');
        batch.set(entitlementRef, {
            tier: 'free',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 2. Ensure User Profile exists
        const userRef = db.collection('users').doc(uid);
        batch.set(userRef, {
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            onboardingCompleted: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // 3. Initialize empty Metrics summary
        const metricsRef = db.collection('users').doc(uid).collection('metrics').doc('summary');
        batch.set(metricsRef, {
            streakDays: 0,
            workoutsThisWeek: 0,
            weeklyVolume: 0,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        await batch.commit();
        console.log(`[Audit] Initialization complete for user: ${uid}`);

    } catch (error) {
        console.error(`[Audit] FAILED to initialize user | User: ${uid} | Error:`, error);
    }

    return null;
});
