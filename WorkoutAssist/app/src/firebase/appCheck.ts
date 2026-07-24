import { Platform } from 'react-native';
import type { FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { recaptchaV3SiteKey } from './firebaseConfig';

/**
 * Firebase App Check — abuse defense for the (publicly reachable) backend.
 *
 * WEB ONLY, by necessity. This app uses the Firebase JS SDK on every platform,
 * and the JS SDK's only App Check provider is reCAPTCHA, which needs a DOM. On
 * React Native there is no native provider here — that requires
 * @react-native-firebase/app-check (Play Integrity / App Attest), a separate
 * migration this project hasn't taken. So on native we do nothing, and native
 * requests stay unverified.
 *
 * The consequence, and why it matters: **do not turn on App Check ENFORCEMENT
 * until native is covered**, or the native app gets locked out of Firestore and
 * Functions. Run in monitor mode (register, watch verified-vs-unverified in the
 * console), enforce only web later. Full rollout notes in docs/APP_CHECK.md.
 *
 * Safe by construction: no key configured, or any init error, is a silent no-op
 * — App Check must never be the thing that breaks app startup.
 */
export function initAppCheck(app: FirebaseApp): void {
    if (Platform.OS !== 'web') return;

    if (!recaptchaV3SiteKey) {
        if (__DEV__) {
            console.log('[AppCheck] no reCAPTCHA site key configured; App Check disabled');
        }
        return;
    }

    // In development, request a debug token so localhost can obtain App Check
    // tokens (the token is printed to the console to register once in the
    // Firebase console). Never enabled in production builds.
    if (__DEV__) {
        (globalThis as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean })
            .FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    try {
        initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(recaptchaV3SiteKey),
            isTokenAutoRefreshEnabled: true,
        });
    } catch (e) {
        console.warn('[AppCheck] initialization failed; continuing without App Check', e);
    }
}
