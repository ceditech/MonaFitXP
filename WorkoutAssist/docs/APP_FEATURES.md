# WorkoutAssist Roadmap Plan

## 1. Completed So Far

WorkoutAssist already has a solid MVP foundation:

- React Native / Expo app structure with Android, iOS, and web support.
- Firebase integration for Auth, Firestore, Cloud Functions, security rules, and indexes.
- Auth flow with welcome screen, guest mode, email sign-in, and email sign-up.
- Session and profile bootstrapping, including guest-to-account migration support.
- Onboarding wizard for goal, experience, equipment, schedule, injuries, session length, and timezone.
- Main tab navigation for Today, Plans, Exercises, History, and AI Coach.
- Today dashboard with active plan, streak/completion metrics, quick actions, and guest upgrade banner.
- Exercise catalog with search, muscle filters, equipment filters, and exercise detail navigation.
- Plan templates list with difficulty and days-per-week filters.
- Plan detail and create-plan flow with selectable workout days.
- Guided workout player with timer, set logging, rest timer, resume/save-exit behavior, and finish flow.
- Workout summary, workout history, and progress dashboard screens.
- Notification preference UI and persisted notification preference fields.
- Paywall UI with Free, Plus, and Pro tiers plus placeholder upgrade buttons.
- Entitlement provider and Pro-gated AI Coach placeholder.
- Firebase Cloud Functions for user initialization and workout-completion metrics aggregation.

## 2. In Progress

These areas exist in code but still need completion, verification, or production hardening:

- Workout player and summary are implemented, but resume behavior, UI polish, browser/device testing, and persistence verification still need to be completed.
- Create plan flow is implemented, but repository integration, validation, and browser/device testing still need verification.
- Home Today is implemented, but delivery/task tracking is stale and should be reconciled with the codebase.
- Entitlements and paywall gating exist, but real payment/subscription integration is not implemented.
- Notification preferences can be saved, but real push or local notification scheduling is deferred.
- AI Coach is routed and Pro-gated, but currently remains a placeholder.

## 3. Remaining To Implement

Key product and platform work still outstanding:

- Real payment integration for Plus and Pro subscriptions.
- Server-verified entitlement updates after successful purchase.
- Actual push/local reminder scheduling and notification permission handling.
- Fully functional AI Coach with chat, adaptive routines, form analysis, or plan recommendations.
- Custom workout builder.
- Nutrition tracking.
- 1-on-1 coaching workflow or integration.
- Stronger offline and resume testing for active workouts.
- Device-level QA for Android and iOS.
- CI/CD pipeline.
- Crashlytics or equivalent crash reporting.
- Production analytics backend.
- Remote Config defaults and safe fallback verification.
- Firebase App Check.
- Release smoke checks.
- User data deletion and compliance flow.

## 4. Improvements Needed

The biggest improvement needed is project hygiene: the delivery board and task files are stale. Several epics are marked as not started or incomplete even though the app already implements much of the functionality. The docs should be updated so product, engineering, and QA can trust the roadmap.

Additional improvements:

- Fix mojibake and encoding issues in UI strings, especially broken arrows, checkmarks, and emoji.
- Resolve the dependency mismatch between `react@19.1.0` and `react-test-renderer@19.2.0`.
- Remove or ignore generated runtime files such as `expo-dev.log` and temporary launcher scripts if they are not intended to be committed.
- Add automated tests for auth/session, repositories, workout logging, metrics, and entitlement gating.
- Replace console-only analytics with a real analytics pipeline.
- Harden Firestore rules for all expected read/write paths.
- Validate the full critical path: sign up, onboarding, create plan, start workout, log sets, finish workout, and verify history/progress updates.

## Suggested Roadmap Phases

### Phase 1: Stabilize MVP

- Update delivery board and task files to match actual implementation status.
- Fix encoding issues in visible UI strings.
- Resolve dependency mismatch and document the supported install command.
- Verify critical user flow end to end on web, Android, and iOS.
- Add baseline automated tests for auth, repositories, workout completion, and metrics.

### Phase 2: Production Readiness

- Harden Firestore rules and validate access boundaries.
- Add CI/CD, crash reporting, and analytics.
- Add Remote Config defaults and safe fallback behavior.
- Add App Check and release smoke testing.
- Document user data deletion and compliance process.

### Phase 3: Monetization

- Integrate payments for Plus and Pro.
- Add server-side purchase verification.
- Update entitlement documents from trusted backend events only.
- Replace placeholder upgrade toasts with real subscription flows.
- Verify paywall gates across premium templates and AI Coach.

### Phase 4: Engagement

- Implement real workout reminders.
- Add notification permission handling.
- Schedule local or push reminders based on saved preferences.
- Add reminder delivery evidence and QA coverage.

### Phase 5: Advanced Coaching

- Build the AI Coach beyond the current placeholder.
- Add adaptive plan recommendations.
- Add form analysis if supported by the product direction.
- Add custom workout builder.
- Expand roadmap items such as nutrition tracking and coaching workflows.
