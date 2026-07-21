import { Alert, Platform } from 'react-native';

/**
 * Cross-platform replacement for `Alert.alert`.
 *
 * react-native-web ships Alert as a literal no-op:
 *
 *     class Alert { static alert() {} }
 *
 * so every `Alert.alert(...)` call silently does nothing on web — which is the
 * platform this app actually deploys to. That turned "Failed to save exercise",
 * "Failed to activate plan" and the auth failures into silent dead ends: the
 * action failed, the user saw nothing, and nothing in the UI explained why.
 *
 * `window.alert` is crude, but it is the only surface that reaches the user
 * without adding a toast dependency ($0 constraint). Screens that already render
 * an inline error banner should prefer that; this exists for the cases that have
 * no other surface.
 *
 * Deliberately does NOT accept a `buttons` array. Alert's button callbacks have
 * no faithful `window.alert` equivalent, and silently dropping them would
 * recreate this exact class of bug. A call site needing choices should use
 * `Alert.alert` directly on native, or render a real in-app dialog.
 */
export function showAlert(title: string, message?: string): void {
    if (Platform.OS !== 'web') {
        Alert.alert(title, message);
        return;
    }

    const text = message ? `${title}\n\n${message}` : title;

    // Reached via globalThis rather than `window`: this project's tsconfig has no
    // DOM lib (it targets react-native), and widening `lib` just to type one call
    // would suppress genuine web/native mistakes elsewhere. In a browser
    // globalThis === window.
    const host = globalThis as { alert?: (message?: string) => void };

    // Guarded: the test environment and any SSR pass have no usable alert, and an
    // error message must never itself be the thing that throws.
    if (typeof host?.alert === 'function') {
        host.alert(text);
    } else {
        console.warn(`[showAlert] ${text}`);
    }
}
