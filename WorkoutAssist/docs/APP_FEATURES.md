# WorkoutAssist / MonaFitXP — Feature Status

_Last reconciled with the codebase: 2026-07-08._

This document reflects the **actual** state of the code, not aspirational planning.
Status legend: ✅ Completed · 🟡 In progress / partial · 🔴 Not started.

---

## 1. Completed Features ✅

### 1.1 Core MVP (foundation)
- React Native / Expo app for Android, iOS, and web.
- Firebase integration: Auth, Firestore, Cloud Functions, security rules, indexes.
- Auth flow: welcome screen, guest mode, email sign-in, email sign-up.
- Session and profile bootstrapping, including guest-to-account workout migration.
- Onboarding wizard: goal, experience, equipment, schedule, injuries, session length, timezone.
- Main tab navigation: Today, Plans, Exercises, History, AI Coach.
- Today dashboard: active plan, streak/completion metrics, quick actions, guest upgrade banner.
- Exercise catalog: search, muscle filters, equipment filters, detail navigation.
- Plan templates list with difficulty and days-per-week filters.
- Plan detail and create-plan flow with selectable workout days.
- Guided workout player: session timer, set logging, rest timer, resume / save-exit, finish flow.
- Workout summary, workout history, and progress dashboard screens.
- Cloud Functions: user initialization, and workout-completion metrics aggregation (streak, weekly volume, PRs, volume history).

### 1.2 Robustness & correctness (added Jul 2026)
- Test harness repaired: migrated to the `jest-expo` preset with AsyncStorage + Firebase SDK mocks (fixed 5 previously-broken suites); resolved the `react@19.1.0` / `react-test-renderer` version mismatch.
- Global `ErrorBoundary` wrapping the app (reused as the silent fallback boundary for optional visuals).
- Tiered access guard: `RequireTier` with `RequirePro` / `RequirePlus` wrappers (single gating implementation).
- **Entitlement schema unified** on `tier: 'free' | 'plus' | 'pro'`: fixed a bug where `isPro` was permanently false (it read a field the backend never wrote); added `isPlus`; legacy `plan` docs are normalized. Guests no longer trigger Firestore permission-denied errors.
- **Metrics correctness fixes** in the workout-completion function: real consecutive-day streak (previously counted unique days), and timezone-aware day bucketing for streak and volume history. Logic extracted into pure, testable helpers.

### 1.3 Smart training tools (added Jul 2026)
- Pure training library: Epley estimated 1RM + per-day e1RM timeline, progressive-overload suggestion (increase / hold / deload), barbell plate calculator, warm-up-set generator.
- Workout Player surfacing: last-performance overload suggestion chip (Plus-gated with upsell), plate-calculator sheet, warm-up suggestion.
- Progress dashboard: "Estimated 1RM" section with a Plus-gated per-exercise e1RM history chart.
- Repository support: `getLastExercisePerformance`, `getExerciseSetHistory`.

### 1.4 Gamification — XP, levels, badges (added Jul 2026, server-authoritative)
- XP awarded per completed workout via the `onWorkoutCompleted` function: capped formula (base + sets + volume + PRs + streak), daily cap, and retry idempotency, inside a transaction.
- Level curve and 10 achievable badges evaluated server-side.
- Stored at `users/{uid}/metrics/gamification` (client-write-denied by existing rules — anti-cheat).
- Client UI: Level ring on Home, XP-gained card on the workout summary, badges grid on Progress.

### 1.5 Exercise animations & modern UI (added Jul 2026)
- Three.js + GSAP motion architecture: lazily code-split, with a web `<canvas>` adapter and a native `expo-gl` adapter, SVG fallbacks, and reduce-motion / no-GL handling — so animations never block the workout flow.
- **Procedural animated mannequin** performing 16 distinct exercise movements (squat, lunge, deadlift, bench, overhead press, row, curl, push-up, pull-up, plank, jumping jack, run, crunch, calf raise, lateral raise, generic) — no 3D asset files required.
- Shown as the form-demo hero on the redesigned Exercise Detail screen and in the Workout Player (animates the current exercise; pulses on set log, green on PR).
- Rest-timer progress ring (rest overlay) and celebration particle bursts on the summary (finish / PR / level-up).
- Web layout now renders in a centered phone-width frame (fixes the stretched desktop layout).

### 1.6 Richer exercise catalog (added Jul 2026)
- Exercise schema extended (all optional, backward-compatible): `media` (thumbnail/video/animationKey), `primaryMuscleGroup`, `muscleDiagram`, `isCustom`/`ownerUid`, `formTip`.
- **Custom exercises**: create / delete, per-user (`users/{uid}/customExercises`) with validation rules; merged with the catalog in the repository layer.
- **Favorites**: star toggle + "Favorites" filter (`favoriteExerciseIds` on the profile).
- `MuscleDiagram` SVG body-highlight component (the slot future form-demo art can replace).
- Create-custom-exercise screen.
- **"How to Perform" content for all 20 catalog exercises**: 5 structured coaching steps each plus a highlighted "Pro Tip" cue.

### 1.7 Sharing (added Jul 2026)
- Shareable branded workout-summary card: native path via `react-native-view-shot` + `expo-sharing`; web path via canvas + Web Share API / PNG download.

---

## 2. In Progress / Partial 🟡

- **Monetization** — Paywall UI, all three tiers, entitlement provider, and Plus/Pro gating are live, and the entitlement document is secured for server-only writes. **Missing:** real payment integration (the upgrade action is a "Stripe flow coming soon" stub) and a server-side purchase-verification function.
- **AI Coach** — routed and Pro-gated, but the screen is still a **static placeholder** (no chat, no logic).
- **Notifications** — preference UI and persisted preference fields exist, but there is **no real scheduling or permission handling** (`expo-notifications` is not installed).
- **Native (Android / iOS) verification** — the new 3D exercise scenes and the share sheet have been verified on **web only**; native device/emulator smoke testing is pending.
- **Firestore re-seed** — the enriched exercise fields (instructions, `formTip`, `animationKey`, `primaryMuscleGroup`) are in the local seed file, so guest/mock users have them now; a `npm run seed` re-seed is needed for authenticated users to get them from Firestore.

---

## 3. Remaining To Implement 🔴

### Product features
- Real payment integration for Plus and Pro subscriptions + server-verified entitlement updates on purchase.
- Actual push / local reminder scheduling and notification-permission handling.
- Fully functional AI Coach (chat, adaptive routines, form analysis, plan recommendations).
- **Custom workout / plan builder** (assemble a plan from arbitrary exercises — distinct from custom *exercise* creation, which is done).
- Nutrition tracking.
- 1-on-1 coaching workflow or integration.

### Platform & production readiness
- CI/CD pipeline.
- Crash reporting (Crashlytics / Sentry equivalent).
- Production analytics backend (analytics are currently `console.log` only).
- Remote Config defaults and safe fallback verification.
- Firebase App Check.
- Release smoke checks.
- User data deletion and compliance flow.
- Device-level QA for Android and iOS.

### Quality / hygiene
- Automated tests for the new features (training lib, XP/gamification, entitlements, repositories) — **intentionally deferred** by the team for now; pure logic was written test-ready.
- **Fix tab-bar mojibake**: the bottom tab icons render as broken `⏷` glyphs (an encoding/icon issue) and should be replaced with proper icons.
- Replace console-only analytics with a real pipeline.

---

## 4. Suggested Next Phases

### Phase A — Production readiness
CI/CD, crash reporting, real analytics, Remote Config, App Check, release smoke checks, data-deletion/compliance.

### Phase B — Monetization
Payment integration (Plus/Pro), server-side purchase verification, entitlement updates from trusted backend events only, replace the upgrade stub, verify gates across premium templates and AI Coach.

### Phase C — Engagement
Real reminder scheduling + permission handling based on saved preferences, with delivery evidence.

### Phase D — Advanced coaching
Build the AI Coach beyond the placeholder, adaptive plan recommendations, custom workout/plan builder, then nutrition tracking and coaching workflows.

### Ongoing
Native device QA of the 3D animations and sharing; backfill automated tests; fix the tab-bar icon glyphs.
