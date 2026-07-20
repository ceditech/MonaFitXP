/**
 * @format
 */

import 'react-native-get-random-values';
import { registerRootComponent } from 'expo';
// Sentry must initialize before the root component registers so startup
// crashes are captured too.
import { initSentry, Sentry } from './src/core/observability/sentry';
import App from './App';

initSentry();

// Sentry.wrap adds the touch-event breadcrumb trail and root profiler.
registerRootComponent(Sentry.wrap(App));
