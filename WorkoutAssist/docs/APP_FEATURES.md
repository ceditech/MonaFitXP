# WorkoutAssist / MonaFitXP — Feature Status

_Last reconciled with the codebase: 2026-07-18._

This document reflects the **actual** state of the code, not aspirational planning.
Status legend: ✅ Completed · 🟡 In progress / partial · 🔴 Not started · 🔧 Works, needs improvement.

**Verified at this reconciliation:** `npx jest` → 11 suites / 97 tests passing · `tsc --noEmit` clean · working tree clean (all visual-upgrade work committed through `c4aeecb`) · 15 demo videos + 20 muscle infographics present on disk and registered.

---

## A. Completed Features ✅

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

### 1.2 Robustness & correctness (Jul 2026)
- Test harness repaired: migrated to the `jest-expo` preset with AsyncStorage + Firebase SDK mocks (fixed 5 previously-broken suites); resolved the `react@19.1.0` / `react-test-renderer` version mismatch.
- Global `ErrorBoundary` wrapping the app (reused as the silent fallback boundary for optional visuals).
- Tiered access guard: `RequireTier` with `RequirePro` / `RequirePlus` wrappers (single gating implementation).
- **Entitlement schema unified** on `tier: 'free' | 'plus' | 'pro'`: fixed a bug where `isPro` was permanently false; added `isPlus`; legacy `plan` docs are normalized. Guests no longer trigger Firestore permission-denied errors.
- **Metrics correctness fixes** in the workout-completion function: real consecutive-day streak, and timezone-aware day bucketing. Logic extracted into pure, testable helpers.

### 1.3 Smart training tools (Jul 2026)
- Pure training library: Epley estimated 1RM + per-day e1RM timeline, progressive-overload suggestion (increase / hold / deload), barbell plate calculator, warm-up-set generator.
- Workout Player surfacing: last-performance overload suggestion chip (Plus-gated with upsell), plate-calculator sheet, warm-up suggestion.
- Progress dashboard: "Estimated 1RM" section with a Plus-gated per-exercise e1RM history chart.
- Repository support: `getLastExercisePerformance`, `getExerciseSetHistory`.

### 1.4 Gamification — XP, levels, badges (Jul 2026, server-authoritative)
- XP awarded per completed workout via `onWorkoutCompleted`: capped formula (base + sets + volume + PRs + streak), daily cap, retry idempotency, inside a transaction.
- Level curve and 10 achievable badges evaluated server-side.
- Stored at `users/{uid}/metrics/gamification` (client-write-denied — anti-cheat).
- Client UI: Level ring on Home, XP-gained card on the workout summary, badges grid on Progress.

### 1.5 Motion architecture & modern UI (Jul 2026)
- Three.js + GSAP motion architecture: lazily code-split, with a web `<canvas>` adapter and a native `expo-gl` adapter, SVG fallbacks, and reduce-motion / no-GL handling — animations never block the workout flow.
- **Procedural animated mannequin** performing 16 distinct exercise movements — no 3D asset files required. Remains the guaranteed fallback.
- **Rigged GLB demo** (squat) played via `THREE.AnimationMixer`, strictly opt-in with a hard procedural fallback.
- Rest-timer progress ring and celebration particle bursts on the summary (finish / PR / level-up).
- Web layout renders in a centered phone-width frame.

### 1.6 Richer exercise catalog (Jul 2026)
- Exercise schema extended (all optional, backward-compatible): `media`, `primaryMuscleGroup`, `muscleDiagram`, `isCustom`/`ownerUid`, `formTip`.
- **Custom exercises**: create / delete, per-user with validation rules; merged with the catalog in the repository layer.
- **Favorites**: star toggle + "Favorites" filter.
- `MuscleDiagram` SVG body-highlight component (fallback when no infographic exists).
- **"How to Perform" content for all 20 catalog exercises**: 5 structured coaching steps each plus a "Pro Tip" cue.

### 1.7 Sharing (Jul 2026)
- Shareable branded workout-summary card: native via `react-native-view-shot` + `expo-sharing`; web via canvas + Web Share API / PNG download.

### 1.8 Pre-rendered demo media & detail carousel (Jul 10–18, 2026) — **new since last reconciliation**
- **Demo videos on 15 of 20 exercises** (`app/assets/videos/`, 3.8 MB, 720×720 H.264 loops), served via `expo-video` and registered **by exercise ID** in `exerciseVideos.ts` (id-keyed deliberately — several exercises share an `animationKey`, so key-based lookup showed the wrong movement).
- Production pipeline: Mixamo mocap → Blender (anatomical écorché character, muscle-painted, branded stage) → render, plus an AI path (fal: Kling v3 / Seedance / nano-banana-pro) for movements Mixamo lacks. Documented in `VISUAL_UPGRADE_TOOLING.md` + Claude memory.
- **AI muscle infographics on all 20 exercises** (`app/assets/muscles/`, 1.7 MB), id-keyed, shown on the Targets card over the SVG diagram when present.
- **Exercise-detail carousel**: swipe + header chevrons page through the entire catalog; all pages stay mounted but only the **active** page mounts a video/GL demo (one GL context / autoplaying video at a time).
- Demo hero fallback chain: **video → 3D GLB/procedural scene → poster image → SVG muscle diagram**, so a missing asset never breaks the screen.
- **Carousel layout regression fixed (Jul 18)**: pages were sized from `useWindowDimensions()` (the *window*), which overflowed ~3× whenever the window ≠ the carousel container. Now the container is measured directly via ref + `getBoundingClientRect` (RN-web's `onLayout`/ResizeObserver does not fire reliably in this build), with window width as a first-frame fallback.

---

## B. In Progress / Partial 🟡

- **Monetization** — Paywall UI, all three tiers, entitlement provider, and Plus/Pro gating are live, and the entitlement doc is secured for server-only writes. **Missing:** real payment integration (`UpgradeScreen` logs *"Stripe flow coming soon"*; `PaywallScreen` shows *"Coming soon! Payment integration pending."*) and a server-side purchase-verification function. No payment SDK is installed.
- **AI Coach** — routed and Pro-gated, but `AICoachScreen.tsx` (120 lines) is still a **static placeholder** (`chatPlaceholder`, no chat, no logic).
- **Notifications** — preference UI and persisted preference fields exist, but there is **no scheduling or permission handling**; `expo-notifications` is still **not installed**.
- **Native (Android / iOS) verification** — the 3D scenes, demo videos, share sheet, and the new carousel have been verified on **web only**. Native device/emulator smoke testing is pending. This is the single largest untested surface.
- **Firestore re-seed** — enriched exercise fields are in the local seed file (so guest/mock users have them); a `npm run seed` re-seed is needed for authenticated users.

---

## C. Remaining To Implement 🔴

### Product features
- Real payment integration for Plus and Pro + server-verified entitlement updates on purchase.
- Actual push / local reminder scheduling and notification-permission handling.
- Fully functional AI Coach (chat, adaptive routines, form analysis, plan recommendations).
- **Custom workout / plan builder** — assemble a plan from arbitrary exercises. Distinct from custom *exercise* creation (done) and from the template-based `CreatePlanScreen` (done).
- Nutrition tracking.
- 1-on-1 coaching workflow or integration.

### Platform & production readiness
- CI/CD pipeline (no `.github/workflows` exists).
- Crash reporting (Crashlytics / Sentry) — no SDK installed.
- Production analytics backend (analytics are `console.log('[Analytics] …')` only).
- Remote Config defaults and safe fallback verification.
- Firebase App Check.
- Release smoke checks.
- User data deletion and compliance flow.
- Device-level QA for Android and iOS.

---

## D. Works, But Needs Improvement 🔧

Things that are **shipped and functional** but carry known debt, cost, or quality gaps. None of these are regressions — they are conscious trade-offs to revisit.

### Media & assets
- **Bundled media is now ~12.9 MB** (7.4 MB exercise hero art + 3.8 MB demo videos + 1.7 MB muscle infographics). The documented migration trigger in `PREDEPLOYMENT_LAUNCH_CHECK.md` §12 is "art payload past ~15–20 MB" — **we are close**. Plan the Firebase Storage / CDN migration during production-readiness, not during feature work. `getExerciseImage` / `getExerciseVideo` are single resolvers, so there is no lock-in.
- **5 of 20 exercises have no demo video** — the machine exercises (Leg Press, Lat Pulldown, Seated Row, Face Pull, Hamstring Curl). **Deliberate** (poor video ROI); they fall back to infographic + 3D demo. Do not "fix" without a product decision.
- **Bench Press video is stylistically inconsistent** — it is a cinematic close-up on a dark background, whereas the other 14 are wide shots on the branded purple stage. Its muscle glow also reads slightly bright/detached and the chest cyan sits centrally rather than spread across both pecs. Anatomically correct as of Jul 18; cosmetic polish only.
- Videos and infographics are **bundled**, so updating art requires an app release.

### Platform / technical debt
- **Tab-bar icons are missing** — `RootNavigator.tsx` defines only `title` for each `Tab.Screen`, no `tabBarIcon`, so the bar falls back to placeholder/mojibake glyphs. Small, high-visibility polish item.
- **`onLayout` is unreliable on react-native-web 0.21** in this app (does not fire at mount or on resize). Any future container measurement must use the ref + `getBoundingClientRect` pattern established in `ExerciseDetailScreen`. Documented so it is not rediscovered the hard way.
- **Analytics are console-only** — the event call sites exist and are well-placed, so swapping in a real pipeline is a contained change, but nothing is currently collected.
- **Carousel mounts all pages** (only the active one mounts heavy media). Fine at 20 exercises; revisit windowing if the catalog grows substantially, since RN-web's virtualized list resets scroll offset on re-render (the reason `FlatList` was rejected).

### Testing
- **Coverage gaps on newer features** — training lib, XP/gamification, entitlements, repositories, share-card, and the carousel have **no automated tests**. Intentionally deferred; pure logic was written test-ready. The 97 passing tests cover the older surface.
- No end-to-end test of the critical path (sign up → plan → workout → history → XP).

---

## E. Suggested Next Phases

### Phase A — Production readiness
CI/CD, crash reporting, real analytics, Remote Config, App Check, release smoke checks, data-deletion/compliance. Fold the **media → Storage/CDN migration** in here (§D) while Storage rules are being set up anyway.

### Phase B — Monetization
Payment integration (Plus/Pro), server-side purchase verification, entitlement updates from trusted backend events only, replace the upgrade stub, verify gates across premium templates and AI Coach.

### Phase C — Engagement
Real reminder scheduling + permission handling based on saved preferences, with delivery evidence.

### Phase D — Advanced coaching
Build the AI Coach beyond the placeholder, adaptive plan recommendations, custom workout/plan builder, then nutrition tracking and coaching workflows.

### Ongoing / quick wins
Native device QA (largest untested surface) · tab-bar icons · backfill automated tests · Bench Press video style polish.
