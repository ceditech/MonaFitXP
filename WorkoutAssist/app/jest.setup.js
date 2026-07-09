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
