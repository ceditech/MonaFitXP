# Implementation Plan — P0.FNS-METRICS-ENTITLEMENTS

This mission implements backend-driven analytics and entitlement management using Firebase Cloud Functions. By moving these computations to the server, we ensure data integrity and security, preventing clients from manipulating their own metrics or premium status.

## User Review Required

> [!IMPORTANT]
> **Firestore Rules Strictness**: This implementation relies on the fact that `metrics` and `entitlements` collections are **read-only** for users. Attempting to write to these from the client app will fail after this change.

## Proposed Changes

### Cloud Functions Triggers + Logic

#### 1. `onWorkoutCompleted`
*   **Trigger**: Firestore `onUpdate` on `users/{uid}/workouts/{workoutId}`.
*   **Logic**:
    *   Detect transition to `status === "completed"`.
    *   Fetch workout sets from sub-collection.
    *   Compute totals: `durationSeconds`, `totalSets`, `totalVolume`.
    *   Update Personal Records (PRs) in `users/{uid}/stats/prs`.
    *   Aggregate `streakDays`, `workoutsThisWeek`, and `weeklyVolume`.
*   **Output**: Writes/merges to `users/{uid}/metrics/summary`.

#### 2. `ensureEntitlementDoc`
*   **Trigger**: Auth `onCreate`.
*   **Logic**:
    *   Initialize `users/{uid}/entitlements/current` with `tier: "free"`.
    *   Ensure the base `users/{uid}` document exists.

---

### Data Shapes

#### Metrics Summary (`users/{uid}/metrics/summary`)
```typescript
{
  streakDays: number;
  workoutsThisWeek: number;
  weeklyVolume: number;
  prs: {
    exerciseId: string;
    bestWeight: number;
    bestReps: number;
    achievedAt: Timestamp;
  }[];
  updatedAt: Timestamp;
}
```

#### Entitlements (`users/{uid}/entitlements/current`)
```typescript
{
  tier: "free" | "premium";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### File Plan

#### [NEW] `functions/`
*   `src/index.ts`: Main entry point for functions.
*   `src/metrics.ts`: Logic for `onWorkoutCompleted`.
*   `src/auth.ts`: Logic for `ensureEntitlementDoc`.
*   `package.json`: Dependencies and deploy scripts.

#### [MODIFY] `app/src/data/workouts/FirestoreWorkoutRepository.ts`
*   Refactor `getMetrics`: Read from `metrics/summary` instead of computing on-the-fly.
*   Implement `getEntitlement`: Fetch from `entitlements/current`.

#### [MODIFY] `app/src/features/premium/PremiumGuard.tsx` (or similar)
*   Integrate entitlement check to gate premium features.

---

## Verification Plan

### Automated Tests
*   `firebase emulators:start`: Test triggers locally using the Firestore emulator.
*   Manual trigger of workout completion via Firebase Console or App.

### Manual Verification
1.  Complete a workout in the app.
2.  Observe `metrics/summary` document being created/updated by the Cloud Function.
3.  Sign up a new user.
4.  Verify `entitlements/current` is automatically created.
5.  Check "Progress" screen to ensure it reads the server-side metrics.
