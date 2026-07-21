import { Alert, Platform } from 'react-native';

export interface AlertPayload {
    title: string;
    message?: string;
}

type Listener = (payload: AlertPayload) => void;

let host: Listener | null = null;

/**
 * Called by <AlertHost /> on mount, and with null on unmount. Not for app code.
 */
export function registerAlertHost(listener: Listener | null): void {
    host = listener;
}

/**
 * Show a branded, app-styled alert.
 *
 * Imperative on purpose: every caller is an async catch block, not a render
 * path, so a hook-based API would force each screen to hold alert state it does
 * not otherwise need. This dispatches to <AlertHost />, mounted once at the app
 * root, which owns the actual UI.
 *
 * If no host is mounted — unit tests, or a failure before App mounts — it falls
 * back to the platform alert so a message is never lost entirely. That path is
 * the last resort, not the design:
 *   - native: react-native's Alert, which works correctly there
 *   - web:    window.alert, because react-native-web ships Alert as a literal
 *             no-op (`class Alert { static alert() {} }`), which is what made
 *             every failure on web silent in the first place
 *
 * Deliberately no `buttons` array. Alert's button callbacks have no faithful
 * fallback equivalent, and silently dropping them would recreate exactly the
 * class of bug this replaced. A caller needing choices should render a real
 * in-app dialog.
 */
export function showAlert(title: string, message?: string): void {
    if (host) {
        host({ title, message });
        return;
    }

    if (Platform.OS !== 'web') {
        Alert.alert(title, message);
        return;
    }

    const text = message ? `${title}\n\n${message}` : title;

    // Reached through globalThis, not `window`: this tsconfig has no DOM lib,
    // and widening `lib` to type one call would suppress genuine web/native
    // mistakes elsewhere. Guarded because an error message must never itself be
    // the thing that throws.
    const g = globalThis as { alert?: (message?: string) => void };
    if (typeof g?.alert === 'function') {
        g.alert(text);
    } else {
        console.warn(`[showAlert] ${text}`);
    }
}
