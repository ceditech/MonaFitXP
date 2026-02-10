# Tasks — P0.FS-WORKOUTS: Firestore Workouts + Sets

## Build & Implementation
- [x] Initial Research & Schema Design
- [/] Refactor `FirestoreWorkoutRepository.ts`
  - [ ] Update `startWorkout` (Sub-collection prep)
  - [ ] Implement `logSet` (Sub-collection write)
  - [ ] Update `getInProgressWorkout` (Composite fetch)
  - [ ] Update `completeWorkout` (Summary calculation)
  - [ ] Implement `listWorkouts` / `getHistory` updates

## Artifact 6 — Test Checklist

### Guest Mode (MockRepo)
- [ ] Verify workout starts and saves to LocalStorage.
- [ ] Verify workout resumes after app reload.
- [ ] Verify history shows mock data.

### Authenticated Mode (FirestoreRepo)
- [ ] Verify `users/{uid}/workouts` document is created on start.
- [ ] Verify `users/{uid}/workouts/{id}/sets` documents are created on logging a set.
- [ ] Verify `getInProgressWorkout` correctly reassembles the workout object (including sets).
- [ ] Verify `completeWorkout` updates status and computes summary.
- [ ] Verify `getHistory` reads the new summary format.

---

## Artifact 7 — Evidence Checklist

- [ ] Screenshot: Firestore Console showing `workouts` document with `summary`.
- [ ] Screenshot: Firestore Console showing `sets` sub-collection.
- [ ] Recording: Workout session flow (Start -> Log Sets -> Complete -> View History).
- [ ] Recording: Resume flow (Start -> Close App -> Reopen -> Resume).
