# Tasks - Auth + Repository Switching (P0.REPO-SWITCH)

## Session Layer
- [ ] Update `SessionProvider` with Firebase Auth listener <!-- id: 0 -->
- [ ] Add `signInEmailPass`, `signUpEmailPass` actions <!-- id: 1 -->
- [ ] Update `signOut` to handle Firebase auth <!-- id: 2 -->

## Repository Layer
- [ ] Create `FirestoreWorkoutRepository` (catalog reads only) <!-- id: 3 -->
- [ ] Create `RepoProvider` with switching logic <!-- id: 4 -->
- [ ] Wrap `App.tsx` with `RepoProvider` <!-- id: 5 -->

## Auth Screens
- [ ] Implement `SignInScreen` with email/password form <!-- id: 6 -->
- [ ] Implement `SignUpScreen` with email/password form <!-- id: 7 -->

## Verification
- [ ] Test Guest Mode (existing flow) <!-- id: 8 -->
- [ ] Test Authenticated Mode (new flow) <!-- id: 9 -->
- [ ] Test error handling (invalid credentials) <!-- id: 10 -->
