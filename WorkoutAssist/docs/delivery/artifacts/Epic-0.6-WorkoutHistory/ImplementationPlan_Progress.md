# Implementation Plan — Progress Dashboard (Epic 0.6)

Build the `ProgressDashboardScreen` to visualize user achievements, streaks, and personal records.

## Artifact 1 — UI Flow Map
- **Entry**: Navigated via the "History" tab (depending on final tab layout, usually a sibling to History or accessible from Profile). In this app shell, it's a standalone screen in the Main stack.
- **Interactions**:
  - Tap a **Personal Record (PR)** item -> Navigate to `ExerciseDetailScreen` with `{ exerciseId }`.
  - Pull-to-refresh to reload metrics.
- **Exit**: System back or "Back" arrow returns to previous screen.

## Artifact 2 — UI Spec (Layout + States)
- **Header**: "Progress" (Center-aligned in Top Bar).
- **KPI Section**:
  - Horizontal grid of 3 cards:
    - **Streak**: Icon (Flame) + "X days".
    - **This Week**: Icon (Calendar) + "X workouts".
    - **Volume**: Icon (Barbell) + "X kg/lbs".
- **Personal Records Section**:
  - Subheading: "Personal Records".
  - Vertical list of top 5 PR items:
    - Left: Exercise Name.
    - Right: Best Weight/Reps + Date.
- **States**:
  - **Loading**: Centered ActivityIndicator.
  - **Empty**: Illustration or large icon + "Log your first workout to see progress!".
  - **Error**: Error message + "Retry" button.

## Artifact 3 — Component Tree
- `ProgressDashboardScreen` (Feature Screen)
  - `SafeAreaView`
    - `ScrollView` (with RefreshControl)
      - `StatsGrid` (Layout Component)
        - `StatTile` (Presentational)
      - `PRSection` (Feature Component)
        - `SectionHeader`
        - `PRList`
          - `PRListItem` (Navigable)
      - `EmptyState` (Conditional)

## Artifact 4 — Navigation Contract
- **Screen Name**: `ProgressDashboard`
- **Params**: `undefined`
- **Outgoing**:
  - `ExerciseDetail`: `{ exerciseId: string }`

## Artifact 5 — Firestore Reads/Writes
- **Reads**:
  - `repo.getMetrics(uid)`: In production, hits `users/{uid}/metrics/summary`.
- **Writes**:
  - None on this screen (Read-only).
  - *Note*: `repo.completeWorkout(uid, id)` updates these counters.

## Artifact 6 — Firestore Schema Diff
> [!NOTE]
> This is a virtual diff for the mock implementation.
```json
// Path: users/{uid}/metrics/summary
{
  "streakDays": 5,
  "workoutsThisWeek": 3,
  "weeklyVolume": 12500,
  "prs": [
    {
      "exerciseId": "ex_001",
      "bestWeight": 100,
      "bestReps": 5,
      "achievedAt": "2024-03-20T10:00:00Z"
    }
  ]
}
```

## Artifact 7 — Security Rules Diff
```js
match /users/{userId}/metrics/summary {
  allow read: if request.auth != null && request.auth.uid == userId;
}
```

## Artifact 8 — Implementation Plan (React Native)
1. **Repository Extension**:
   - Ensure `MockWorkoutRepository` returns meaningful test data from `metrics.json`.
   - Update `completeWorkout` in `MockWorkoutRepository` to simulate metric updates.
2. **Screen Development**:
   - Implement `ProgressDashboardScreen.tsx` using `useWorkoutRepo`.
   - Fetch metrics on mount.
   - Use `useSession` for UID.
3. **Data Mapping**:
   - Join PR `exerciseId` with `exerciseCatalog.json` to get exercise names.
4. **Styling**:
   - Use `Colors` from `Theme.ts`.
   - Use card elevations and consistent spacing (16px gutters).

## Artifact 9 — Analytics Events
- `progress_viewed`: Logged when screen opens.
- `pr_opened`: Logged when a PR item is tapped, including `exerciseId`.

## Artifact 10 — Test Checklist
- [ ] Verify streak displays correctly from mock data.
- [ ] Verify PR list shows display names (not IDs).
- [ ] Verify navigation to `ExerciseDetail` works for PR items.
- [ ] Verify loading spinner shows while fetching.
- [ ] Verify empty state shows if `prs` array is empty.

## Artifact 11 — Evidence Checklist
- **EVID-P0.6-Progress-001**: Dashboard view with KPI cards and PR list.
- **EVID-P0.6-Progress-002**: PR tap navigating to Bench Press detail.
- **EVID-P0.6-Progress-003**: Pull-to-refresh visual confirmation.

## Acceptance Criteria
- Screen follows the provided Figma design (implied by layout spec).
- Metrics are fetched via the repository pattern.
- App handles missing data gracefully (Empty State).
- Navigation back to parent screen is seamless.
