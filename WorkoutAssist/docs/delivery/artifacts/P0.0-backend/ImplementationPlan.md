# Implementation Plan - Firebase Foundation Wiring

## User Review Required
> [!IMPORTANT]
> This plan introduces the `firebase` JS SDK. Please ensure you have a valid Firebase project created in the Firebase Console. You will need to grab the configuration object (apiKey, authDomain, etc.) to populate `app/src/firebase/firebaseConfig.ts`.

## Proposed Changes

### Dependencies
- **[NEW]** `firebase` (latest v9+ modular SDK)
- **[VERIFIED]** `@react-native-async-storage/async-storage` (already exists)

### Configuration
#### [NEW] [firebaseConfig.ts](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/firebase/firebaseConfig.ts)
- Exports `firebaseConfig` object with placeholder values.
- Central place for user to paste their real credentials.

### Initialization
#### [NEW] [firebase.ts](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/firebase/firebase.ts)
- Initializes Firebase App.
- Initializes Auth with `reactNativeLocalPersistence` using AsyncStorage.
- Initializes Firestore.
- Exports `firebaseApp`, `auth`, `db`.

#### [NEW] [emulators.ts](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/firebase/emulators.ts)
- Helper function `connectToEmulators` to easily switch to local Firebase emulators for development.

## Verification Plan

### Automated Tests
- Import verification: Ensure `app/src/firebase/firebase.ts` imports without errors.
- Basic check: Log `firebaseApp` name (should be "[DEFAULT]") on app launch (temporary check).

### Manual Verification
1.  Run `npm install` (handled by agent).
2.  Paste real Firebase config into `app/src/firebase/firebaseConfig.ts`.
3.  (Optional) Run local emulators and uncomment emulator connection in `App.tsx` (not part of this task, but future proofing).
4.  Launch app (`npm run android`) and ensure no crash on startup.
