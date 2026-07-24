import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./firebaseConfig";

// NOTE: App Check is intentionally NOT initialized on native. The Firebase JS
// SDK's only provider is reCAPTCHA (web/DOM), and native App Check needs
// @react-native-firebase/app-check, which this project doesn't use. See
// appCheck.ts and docs/APP_CHECK.md — enforcement must stay off until this gap
// is closed, or the native app would be blocked from the backend.

/**
 * NATIVE (iOS / Android) Firebase setup.
 *
 * The web build (`firebase.ts`) uses `getAuth` + `browserLocalPersistence`,
 * which depends on `localStorage`. React Native has no `localStorage`, so on a
 * device that setup leaves auth unresolved: `onAuthStateChanged` never fires,
 * `SessionProvider.isLoading` never clears, and the app hangs forever on the
 * loading spinner. (Found during the first Android smoke test — every prior
 * verification had been web-only, which is why it went unnoticed.)
 *
 * React Native must instead persist auth through AsyncStorage via
 * `initializeAuth`. This file is picked up automatically by Metro's platform
 * resolution, so the web entry point is left completely untouched.
 */

// Reuse the existing app across Fast Refresh reloads — initializeApp/initializeAuth
// both throw if called twice for the same app. Written defensively because the
// Firebase SDK is mocked in tests and the mock may not implement every export.
function resolveApp() {
    try {
        const existing = typeof getApps === 'function' ? getApps() : undefined;
        if (existing && existing.length > 0 && typeof getApp === 'function') {
            return getApp();
        }
    } catch {
        // fall through to initializeApp
    }
    return initializeApp(firebaseConfig);
}

const firebaseApp = resolveApp();

/**
 * `getReactNativePersistence` ships only in Firebase's React Native entry
 * (`index.rn.d.ts`); the web typings TypeScript resolves here don't declare it.
 * Metro resolves the RN build at runtime, so read it off the namespace rather
 * than importing it directly (which would not typecheck).
 */
const getReactNativePersistence = (firebaseAuth as any).getReactNativePersistence as
    | ((storage: unknown) => unknown)
    | undefined;

function createAuth(): Auth {
    try {
        if (getReactNativePersistence && typeof initializeAuth === 'function') {
            return initializeAuth(firebaseApp, {
                persistence: getReactNativePersistence(AsyncStorage) as never,
            });
        }
    } catch {
        // initializeAuth throws if auth was already initialized for this app
        // (Fast Refresh re-import) — fall through and reuse the existing one.
    }
    // Fallback: auth still works for the session, it just won't persist across
    // app restarts — far better than hanging forever on the loading spinner.
    return getAuth(firebaseApp);
}

const auth = createAuth();
const db = getFirestore(firebaseApp);
// Region must match the deployed functions (us-central1). See firebase.ts.
const functions = getFunctions(firebaseApp, "us-central1");

export { firebaseApp, auth, db, functions };
