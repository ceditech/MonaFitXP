import * as Sentry from '@sentry/react-native';
import type { ErrorInfo } from 'react';

/**
 * Sentry crash/error reporting — initialized once from the app entry point
 * (index.js), before the root component registers.
 *
 * The DSN is a public client identifier (it can only ingest events, never
 * read them), so committing it is safe and is what Sentry's own docs do.
 * Project: e-deal-express-llc / react-native.
 */
const SENTRY_DSN =
    'https://c39d99637e169d0a3a79a422aefa4706@o4511765291139072.ingest.us.sentry.io/4511765453537280';

export function initSentry(): void {
    Sentry.init({
        dsn: SENTRY_DSN,
        // Dev events flow to a separate environment so production stays
        // clean but the integration is still verifiable in dev builds —
        // important here, where native runs are debug builds on an emulator.
        environment: __DEV__ ? 'development' : 'production',
        // Keep performance tracing cheap until there's traffic worth tracing.
        tracesSampleRate: __DEV__ ? 1.0 : 0.2,
        // Note: source-map upload (readable prod stack traces) is wired at
        // build time and needs SENTRY_AUTH_TOKEN — deferred to the CI phase.
        // Until a `prebuild --clean` regenerates android/, native builds are
        // unaffected by the @sentry/react-native expo plugin in app.json.
    });
}

/**
 * Hook for the global ErrorBoundary: report render-phase crashes that React
 * caught (Sentry's own handlers only see *uncaught* JS errors).
 */
export function reportBoundaryError(error: Error, info: ErrorInfo): void {
    Sentry.captureException(error, {
        contexts: {
            react: { componentStack: info.componentStack ?? 'unavailable' },
        },
    });
}

/** Breadcrumb trail: lets crash reports show what the user did beforehand. */
export function addAnalyticsBreadcrumb(
    event: string,
    params?: Record<string, unknown>,
): void {
    Sentry.addBreadcrumb({
        category: 'analytics',
        message: event,
        data: params,
        level: 'info',
    });
}

/** Re-export for the entry point's `Sentry.wrap(App)`. */
export { Sentry };
