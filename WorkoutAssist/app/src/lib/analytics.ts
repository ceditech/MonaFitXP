import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics';
import { firebaseApp } from '../firebase/firebase';
import { addAnalyticsBreadcrumb } from '../core/observability/sentry';

/**
 * WEB analytics backend: Firebase Analytics (GA4), which the JS SDK supports
 * in browsers only — this file's `.native.ts` sibling handles devices.
 *
 * Every product event goes through `track()`. Call sites never import a
 * vendor SDK directly, so swapping/adding a backend (PostHog later, per the
 * observability decision) is a one-file change.
 */

let analytics: Analytics | null = null;

// `isSupported()` guards environments without the measurement APIs (SSR,
// some embedded webviews). Resolve once; events before readiness are only
// dropped from GA, never from the Sentry breadcrumb trail.
const analyticsReady: Promise<void> = isSupported()
    .then(supported => {
        if (supported) analytics = getAnalytics(firebaseApp);
    })
    .catch(() => {
        // Unsupported environment — track() degrades to breadcrumbs + dev logs.
    });

/**
 * Record a product event. GA4 naming rules apply: snake_case, starts with a
 * letter, <=40 chars (all existing event names comply).
 */
export function track(event: string, params?: Record<string, unknown>): void {
    if (__DEV__) {
        // Keep the familiar console trail in development.
        console.log(`[Analytics] ${event}`, params ?? '');
    }
    // Breadcrumbs make crash reports self-explanatory ("what did they do
    // right before it broke?") — worth having on web too.
    addAnalyticsBreadcrumb(event, params);
    void analyticsReady.then(() => {
        if (analytics) {
            logEvent(analytics, event, params as Record<string, unknown> | undefined);
        }
    });
}
