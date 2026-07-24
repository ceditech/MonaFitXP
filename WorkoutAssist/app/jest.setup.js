// Official AsyncStorage jest mock — fixes suites that transitively import
// @react-native-async-storage/async-storage (SessionProvider, guestStore, App).
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock the Firebase web SDK — it ships mixed ESM/CJS builds that jest cannot
// parse, and unit tests must never talk to real Firebase. A cached Proxy keeps
// this future-proof: any named import resolves to a stable jest.fn(). Functions
// that must return something meaningful are special-cased. Individual test files
// can still override with their own jest.mock (theirs is hoisted and wins).
const makeFirebaseModuleMock = (overrides = {}) => {
  const cache = new Map(Object.entries(overrides));
  return new Proxy(
    { __esModule: true },
    {
      get(target, prop) {
        if (prop in target) return target[prop];
        if (typeof prop !== 'string') return undefined;
        if (!cache.has(prop)) cache.set(prop, jest.fn());
        return cache.get(prop);
      },
    },
  );
};

// Mock expo-video — its native module isn't available in the jest env
// (App transitively imports it via ExerciseDetailScreen → VideoDemo).
jest.mock('expo-video', () => ({
  __esModule: true,
  useVideoPlayer: jest.fn(() => ({
    loop: false,
    muted: false,
    playing: false,
    status: 'idle',
    play: jest.fn(),
    pause: jest.fn(),
  })),
  VideoView: () => null,
}));
// `useEvent` from expo drives VideoDemo's status tracking.
jest.mock('expo', () => ({
  __esModule: true,
  useEvent: jest.fn(() => ({ status: 'idle' })),
}));

jest.mock('firebase/app', () => makeFirebaseModuleMock({ initializeApp: jest.fn(() => ({})) }));
jest.mock('firebase/auth', () =>
  makeFirebaseModuleMock({
    getAuth: jest.fn(() => ({ currentUser: null })),
    onAuthStateChanged: jest.fn(() => jest.fn()), // returns unsubscribe
    setPersistence: jest.fn(() => Promise.resolve()),
  }),
);
jest.mock('firebase/firestore', () =>
  makeFirebaseModuleMock({
    getFirestore: jest.fn(() => ({})),
    onSnapshot: jest.fn(() => jest.fn()), // returns unsubscribe
    serverTimestamp: jest.fn(() => 'mock-server-timestamp'),
  }),
);
jest.mock('firebase/functions', () =>
  makeFirebaseModuleMock({
    getFunctions: jest.fn(() => ({})),
    httpsCallable: jest.fn(() => jest.fn(() => Promise.resolve({ data: {} }))),
  }),
);
jest.mock('firebase/app-check', () =>
  makeFirebaseModuleMock({
    initializeAppCheck: jest.fn(() => ({})),
    ReCaptchaV3Provider: jest.fn(function ReCaptchaV3Provider() {}),
  }),
);

// Sentry: the native module doesn't exist in jest; keep the surface our
// code touches (init/wrap/captureException/addBreadcrumb) as no-ops.
jest.mock('@sentry/react-native', () => ({
  __esModule: true,
  init: jest.fn(),
  wrap: (component) => component,
  captureException: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

// firebase/analytics is browser-only; tests resolve the .native analytics
// facade, but mock it defensively in case a web-platform test imports it.
jest.mock('firebase/analytics', () =>
  makeFirebaseModuleMock({
    isSupported: jest.fn(() => Promise.resolve(false)),
    getAnalytics: jest.fn(() => ({})),
    logEvent: jest.fn(),
  }),
);
