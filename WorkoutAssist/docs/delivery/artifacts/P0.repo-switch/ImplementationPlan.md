# Implementation Plan - Auth + Repository Switching (P0.REPO-SWITCH)

## Architecture Overview

### Session Management
**Current**: `SessionProvider` supports guest mode only (`mode: 'guest' | 'none'`)
**New**: Add `'authenticated'` mode with Firebase Auth state listener

```
┌─────────────────────────────────────────────────────────────┐
│                      SessionProvider                         │
│  - onAuthStateChanged listener                              │
│  - session.mode: 'guest' | 'authenticated' | 'none'         │
│  - session.uid: from auth.currentUser or guest UID          │
│  - Actions: signInEmailPass, signUpEmailPass, signOut       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      RepoProvider                            │
│  - Returns MockWorkoutRepo when mode=='guest'               │
│  - Returns FirestoreWorkoutRepo when mode=='authenticated'  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────┬──────────────────────────────────────┐
│  MockWorkoutRepo     │    FirestoreWorkoutRepo              │
│  (AsyncStorage)      │    (Firestore collections)           │
│  - JSON fixtures     │    - planTemplates/{id}              │
│  - Guest data        │    - exerciseCatalog/{id}            │
└──────────────────────┴──────────────────────────────────────┘
```

### Repository Switching Strategy
- **Hook**: `useWorkoutRepo()` returns the appropriate repo based on session mode
- **Screens**: All screens use `useWorkoutRepo()` (no direct Firestore access)
- **Backward Compatibility**: Guest mode continues to work with MockWorkoutRepo

## Proposed Changes

### Session Layer
#### [MODIFY] [types.ts](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/session/types.ts)
- Change `SessionMode` to include `'authenticated'` (already has it, but ensure it's used)
- Add auth actions to `SessionContextValue`:
  - `signInEmailPass(email, password)`
  - `signUpEmailPass(email, password)`
  - Update `signOut()` to handle Firebase auth

#### [MODIFY] [SessionProvider.tsx](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/session/SessionProvider.tsx)
- Add `onAuthStateChanged` listener in `useEffect`
- When `auth.currentUser` exists: set `mode: 'authenticated'`, `uid: currentUser.uid`
- When no auth user: check for guest UID (existing logic)
- Implement `signInEmailPass`, `signUpEmailPass`, `signOut` using Firebase Auth SDK
- Handle auth errors with friendly messages

---

### Repository Layer
#### [NEW] [FirestoreWorkoutRepository.ts](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/data/workouts/FirestoreWorkoutRepository.ts)
Implements `IWorkoutRepository` with Firestore for catalog reads:
- `getExercises()`: `getDocs(collection(db, "exerciseCatalog"))`
- `getExercise(id)`: `getDoc(doc(db, "exerciseCatalog", id))`
- `getPlanTemplates()`: `getDocs(collection(db, "planTemplates"))`
- `getPlanTemplate(id)`: `getDoc(doc(db, "planTemplates", id))`
- **User data methods**: Stub implementations (throw "Not implemented" or return null) for now
- Use `query()` + `limit(100)` for list operations

#### [NEW] [RepoProvider.tsx](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/data/RepoProvider.tsx)
- Context: `WorkoutRepoContext`
- Provider: Instantiates `MockWorkoutRepo` or `FirestoreWorkoutRepo` based on `session.mode`
- Hook: `useWorkoutRepo()` returns the active repository

#### [MODIFY] [App.tsx](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/App.tsx)
- Wrap `RootNavigator` with `<RepoProvider>`

---

### Auth Screens
#### [MODIFY] [SignInScreen.tsx](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/features/auth/SignInScreen.tsx)
- Add email/password input fields
- Call `signInEmailPass(email, password)` from `useSession()`
- Show loading state and error messages
- Navigate to Main on success

#### [MODIFY] [SignUpScreen.tsx](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/features/auth/SignUpScreen.tsx)
- Add email/password input fields (with confirm password)
- Call `signUpEmailPass(email, password)` from `useSession()`
- Show loading state and error messages
- Navigate to Main on success

---

### Catalog Screens (Update to use hook)
#### [MODIFY] Catalog screens that currently instantiate MockWorkoutRepo directly
- Replace direct instantiation with `const repo = useWorkoutRepo()`
- Ensure screens work with both Mock and Firestore repos

## Verification Plan

### Automated Tests
*   **TypeScript Compilation**: Run `npx tsc --noEmit` to verify no type errors

### Manual Verification

#### Guest Mode (Existing Flow)
1.  Start app in guest mode
2.  Navigate to Exercise Catalog → Verify exercises load from JSON
3.  Navigate to Plan Templates → Verify templates load from JSON
4.  Start a workout → Verify it works end-to-end
5.  **Expected**: No Firestore access, all data from AsyncStorage/JSON

#### Authenticated Mode (New Flow)
1.  Navigate to Sign Up screen
2.  Enter email/password → Create account
3.  **Expected**: Navigate to Main, `session.mode === 'authenticated'`
4.  Navigate to Exercise Catalog → Verify exercises load from Firestore
5.  Navigate to Plan Templates → Verify templates load from Firestore
6.  Sign Out → **Expected**: Return to Welcome screen

#### Error Handling
1.  Try signing in with invalid credentials → **Expected**: Friendly error message
2.  Try signing up with existing email → **Expected**: Friendly error message

### Evidence Checklist
- [ ] Screenshot: Guest mode Exercise Catalog (JSON data)
- [ ] Screenshot: Sign Up screen with form
- [ ] Screenshot: Authenticated Exercise Catalog (Firestore data)
- [ ] Recording: Full auth flow (Sign Up → Catalog → Sign Out)

## User Review Required
> [!IMPORTANT]
> **Breaking Change**: This introduces a new dependency on Firebase Auth. Users must have network connectivity to sign in/up.
> 
> **Guest Mode Preserved**: Existing guest flows remain unchanged and do not require network access.
