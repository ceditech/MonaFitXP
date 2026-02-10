# Implementation Plan — P0.FS-WORKOUTS: Firestore Workouts + Sets

This plan outlines the migration of workout execution, logging, and history from local/mock storage to Firestore for authenticated users.

## Artifact 1 — Firestore Schema

We will use a sub-collection for workout sets to ensure scalability and better auditing.

### Collection: `users/{uid}/workouts/{workoutId}`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Document ID |
| `planId` | string | ID of the plan template (if any) |
| `workoutName` | string | Name of the workout |
| `status` | string | `in_progress`, `completed`, or `abandoned` |
| `startedAt` | timestamp | Start time of the workout |
| `endedAt` | timestamp | End time of the workout |
| `cursor` | object | `{ exerciseIndex: number, setIndex: number }` |
| `summary` | object | `{ durationSeconds: number, totalSets: number, totalVolume: number }` |
| `createdAt` | timestamp | Server timestamp |
| `updatedAt` | timestamp | Server timestamp |

### Sub-collection: `users/{uid}/workouts/{workoutId}/sets/{setId}`
| Field | Type | Description |
| :--- | :--- | :--- |
| `setId` | string| Deterministic ID (e.g., `ex_0_set_1`) or generated |
| `exerciseId` | string | ID from exercise catalog |
| `setIndex` | number | Sequential index for the exercise |
| `target` | object | `{ reps: number, weight?: number }` |
| `actual` | object | `{ reps: number, weight: number, rpe?: number }` |
| `completedAt`| timestamp | Time set was finished |
| `createdAt` | timestamp | Server timestamp |
| `updatedAt` | timestamp | Server timestamp |

---

## Artifact 2 — FirestoreWorkoutRepo Method Specs

| Method | Role | Firestore Action |
| :--- | :--- | :--- |
| `getInProgressWorkout` | Resume support | Query `workouts` where `status == 'in_progress'`, order by `startedAt desc`, limit 1. Fetch `sets` sub-collection. |
| `startWorkout` | Begin session | Create doc in `workouts`. |
| `logSet` | Record data | Upsert doc in `workouts/{id}/sets`. |
| `updateWorkoutCursor` | Progress sync | Update `cursor` field in `workouts/{id}`. |
| `completeWorkout` | Finalize | Transaction: Set `status=completed`, update `endedAt`, calculate/store `summary`. |
| `listWorkouts` | History | Query `workouts` where `status == completed`, order by `startedAt desc`. |
| `getWorkout` | Detail view | Fetch `workouts/{id}` + all `sets`. |

---

## Artifact 3 — Implementation Plan (Step-by-Step)

1. **Schema Refactor**: Modify `FirestoreWorkoutRepository.ts` to use `collection(db, 'users', uid, 'workouts', workoutId, 'sets')` instead of the `sets` array in the workout document.
2. **Resume Logic**: Update `getInProgressWorkout` to fetch the workout AND its sets sub-collection to reconstruct the `InProgressWorkout` object for the UI.
3. **Logging**: Update `logSet` to use a deterministic ID (`exerciseIndex_setIndex`) for the set document to ensure idempotency.
4. **Summary Logic**: Implement volume and duration calculation in `completeWorkout` before updating the document.
5. **Cursor Sync**: Ensure `updateWorkoutCursor` is calling Firestore correctly.
6. **Backward Compatibility**: Ensure `InProgressWorkout` type remains the same to avoid touching UI screens.

---

## Artifact 4 — File Plan

- **[MODIFY] [FirestoreWorkoutRepository.ts](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/data/workouts/FirestoreWorkoutRepository.ts)**: Primary implementation of the `IWorkoutRepository` methods.
- **[MODIFY] [IWorkoutRepository.ts](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/data/contracts/IWorkoutRepository.ts)**: (Optional) Minor tweaks to types if needed, though goal is minimal change.

---

## Artifact 5 — Minimal Screen Touchpoints

- **`WorkoutPlayerScreen.tsx`**: Already uses `repo.logSet`, `repo.updateWorkoutCursor`, and `repo.completeWorkout`. No changes expected.
- **`HomeTodayScreen.tsx`**: Uses `repo.getInProgressWorkout`. No changes expected.
- **`WorkoutHistoryScreen.tsx`**: Uses `repo.getHistory`. No changes expected.

---

## Acceptance Criteria

- [ ] Authenticated users can start/resume workouts with Firestore persistence.
- [ ] Sets are stored in a dedicated sub-collection.
- [ ] Workout summary (volume, duration) is correctly calculated on completion.
- [ ] Guest Mode remains fully functional (not calling Firestore).
- [ ] Security rules are respected (assuming existing rules cover the sub-collection if written as `users/{uid}/workouts/{id}/sets`).
