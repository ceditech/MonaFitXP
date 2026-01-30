# Tasks - Paywall Screen (Epic 0.8)

## Planning
- [x] Create 11-artifact implementation plan
- [x] Define pricing tiers (Free, Plus, Pro)
- [x] Design UI layout and component tree

## Navigation Updates
- [x] Update `Routes.ts` to add route params for Paywall
- [x] Verify route is correctly configured in RootNavigator

## UI Implementation
- [x] Replace placeholder `PaywallScreen.tsx`
- [x] Implement pricing card component
- [x] Implement Free tier card (current plan badge)
- [x] Implement Plus tier card (recommended badge)
- [x] Implement Pro tier card
- [x] Implement upgrade CTAs with placeholder toast
- [x] Implement "Not now" dismiss button
- [x] Add analytics events (3 total)

## Optional Enhancements
- [ ] Create `EntitlementService.ts` stub (deferred)
- [ ] Add responsive layout for tablet (deferred)

## Verification
- [ ] Browser test: Navigate to Paywall (manual required)
- [ ] Browser test: Verify all 3 pricing tiers display
- [ ] Browser test: Tap upgrade buttons → verify toast
- [ ] Browser test: Tap "Not now" → verify navigation back
- [ ] Verify analytics events in console

## Evidence
- [ ] Capture screenshots (5 total)
- [ ] Capture full flow recording
- [ ] Document console logs for analytics

## Delivery
- [ ] Update walkthrough with evidence
- [ ] Mark Epic 0.8 as complete in task.md
