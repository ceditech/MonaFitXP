/**
 * Firestore security-rules tests.
 *
 * Kept OUT of the default jest run (jest.config.js only roots at <rootDir>/src)
 * because these require the Firestore emulator to be running. Use:
 *   npm run test:rules
 * which wraps this config in `firebase emulators:exec`.
 *
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/rules-tests'],
  testMatch: ['**/*.test.ts'],
  // Rules round-trips through the emulator are slower than pure unit tests.
  testTimeout: 20000,
};
