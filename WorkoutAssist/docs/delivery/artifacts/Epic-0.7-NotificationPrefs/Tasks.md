# Tasks - Notification Preferences (Epic 0.7)

## Planning
- [x] Create 11-artifact implementation plan
- [x] Define notification preferences data structure
- [x] Design UI flow and component tree

## Repository Updates
- [x] Add `getUserProfile` method to `IWorkoutRepository`
- [x] Add `saveUserProfile` method to `IWorkoutRepository`
- [x] Extend `UserProfile` interface with `notificationPrefs` field
- [x] Implement `getUserProfile` in `MockWorkoutRepository` (already existed)
- [x] Implement `saveUserProfile` in `MockWorkoutRepository` (already existed)

## UI Implementation
- [x] Replace placeholder `NotificationPrefsScreen.tsx`
- [x] Implement toggle for "Workout reminders"
- [x] Implement time picker for reminder time
- [x] Implement day chips for multi-select
- [x] Implement save button with loading state
- [x] Implement toast/snackbar for success feedback
- [x] Add analytics events (5 total)

## Navigation
- [x] Add navigation row in `SettingsScreen.tsx` (already existed)
- [x] Verify route is correctly configured (already in Routes.ts)

## Verification
- [ ] Browser test: Navigate from Settings → NotificationPrefs (manual testing required)
- [ ] Browser test: Toggle reminders on/off
- [ ] Browser test: Select multiple days
- [ ] Browser test: Save and verify persistence
- [ ] Browser test: Reload and verify prefill
- [ ] Verify analytics events in console

## Evidence
- [ ] Capture screenshots (6 total)
- [ ] Capture full flow recording
- [ ] Document console logs for analytics

## Delivery
- [ ] Update walkthrough with evidence
- [ ] Mark Epic 0.7 as complete in task.md
