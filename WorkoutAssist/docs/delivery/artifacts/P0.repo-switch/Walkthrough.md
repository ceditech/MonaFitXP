# Walkthrough - Auth + Repository Switching

## Changes Made
*   **Modified `SessionProvider`**: Added Firebase Auth state listener (`onAuthStateChanged`), implemented `signInEmailPass`, `signUpEmailPass`, and updated `signOut` to handle both guest and authenticated modes
*   **Created `FirestoreWorkoutRepository`**: Firestore-backed catalog reads (`getExercises`, `getPlanTemplates`, etc.), stub implementations for user data methods
*   **Created `RepoProvider`**: Context provider that switches between `MockWorkoutRepository` (guest) and `FirestoreWorkoutRepository` (authenticated) based on `session.mode`
*   **Implemented `SignInScreen`**: Email/password form with Firebase Auth integration, loading states, and error handling
*   **Implemented `SignUpScreen`**: Email/password form with confirmation, validation, and Firebase Auth integration
*   **Updated `App.tsx`**: Wrapped `RootNavigator` with `RepoProvider`

## Architecture
```
SessionProvider (Auth State)
      ↓
RepoProvider (Repo Selection)
      ↓
Screens → useWorkoutRepo() → MockRepo OR FirestoreRepo
```

## Testing Instructions

### Guest Mode
1.  Open app → Tap "Continue as Guest"
2.  Navigate to Exercise Catalog
3.  **Expected**: Exercises load from JSON fixtures (no network required)

### Authenticated Mode
1.  Open app → Tap "Sign Up"
2.  Enter email/password → Submit
3.  **Expected**: Navigate to Main screen
4.  Navigate to Exercise Catalog
5.  **Expected**: Exercises load from Firestore (network required)
6.  Tap Settings → Sign Out
7.  **Expected**: Return to Welcome screen

## Verification Results
*   [x] TypeScript compilation passed (no errors)
*   [ ] Guest mode works (no regressions) - User testing required
*   [ ] Sign Up flow works - User testing required
*   [ ] Sign In flow works - User testing required
*   [ ] Firestore catalog reads work - User testing required
*   [ ] Sign Out works - User testing required

## Key Implementation Details

### Auth Error Mapping
Firebase Auth errors are mapped to user-friendly messages in `SessionProvider.tsx`:
- `auth/invalid-email` → "Invalid email address."
- `auth/user-not-found` → "No account found with this email."
- `auth/wrong-password` → "Incorrect password."
- `auth/email-already-in-use` → "An account with this email already exists."
- `auth/weak-password` → "Password should be at least 6 characters."

### Repository Switching Logic
```typescript
// RepoProvider.tsx
const repo = useMemo(() => {
    if (session.mode === 'authenticated') {
        return new FirestoreWorkoutRepository();
    } else {
        return new MockWorkoutRepository();
    }
}, [session.mode]);
```

### Firestore Catalog Reads
```typescript
// FirestoreWorkoutRepository.ts
async getExercises(): Promise<Exercise[]> {
    const q = query(collection(db, 'exerciseCatalog'), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise));
}
```
