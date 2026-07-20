import { addAnalyticsBreadcrumb } from '../core/observability/sentry';

/**
 * NATIVE (iOS / Android) analytics backend.
 *
 * The Firebase **JS** SDK's analytics module is browser-only, so on device
 * events currently go to (a) Sentry breadcrumbs — visible on every crash
 * report — and (b) the dev console. That keeps the `track()` contract
 * identical across platforms while the real native backend is chosen.
 *
 * Follow-up (deliberately deferred, do NOT quietly bolt on here): wiring
 * GA4 on native means either `@react-native-firebase/analytics` (native
 * module: needs the Android app registered in Firebase, google-services.json,
 * config plugin + rebuild) or the GA4 Measurement Protocol (plain HTTPS,
 * needs an api_secret). Decision tracked in the launch-readiness plan.
 */
export function track(event: string, params?: Record<string, unknown>): void {
    if (__DEV__) {
        console.log(`[Analytics] ${event}`, params ?? '');
    }
    addAnalyticsBreadcrumb(event, params);
}
