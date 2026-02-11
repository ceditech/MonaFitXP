# Tasks — P0.FNS-METRICS-ENTITLEMENTS: Cloud Functions for Metrics + Entitlements

## Build & Implementation
- [x] Initialize `functions/` with TypeScript
- [x] Implement `ensureEntitlementDoc` (Auth Trigger)
- [x] Implement `onWorkoutCompleted` (Firestore Trigger)
  - [x] Status transition logic
  - [x] Aggregation & PR logic
- [x] Update `FirestoreWorkoutRepository.ts`
- [x] Update Premium Gating UI

## Artifact 6 — Test Checklist
- [ ] Verify `entitlements/current` is created for new users.
- [ ] Verify `metrics/summary` is updated after workout completion.
- [ ] Verify PRs are updated in the background.
- [ ] Verify App reads metrics from server-side summary document.

## Artifact 7 — Evidence Checklist
- [ ] Recording: Cloud Function logs showing execution.
- [ ] Screenshot: Firestore Console showing `metrics/summary`.
- [ ] Screenshot: App "Progress" screen showing real data from server.
