# WorkoutAssist / MonaFitXP — Pre-Deployment & Launch Checklist

_A living checklist of what must be verified before shipping to production. Keep it updated as items are completed or added._
_Last updated: 2026-07-21._ **The app is LIVE at https://workoutassist-6e273.web.app** (full backend + web deployed). Items below are now measured against a running production system, not a hypothetical launch.

**Status legend:** `[ ]` not started · `[~]` partial / in progress · `[x]` done.
This reflects the real state of the codebase — not aspirational planning.

---

## 0. Blockers — do not launch without these

- [~] **Real payment integration** for Plus/Pro — **not a launch blocker for the current free beta**: payments are feature-flagged OFF (`flags.paymentsEnabled=false`) and the UI shows an honest "launches soon" state. Becomes a blocker the moment you charge. Write entitlement tests BEFORE starting this.
- [~] **Server-side purchase verification** — deferred with payments above (same gate).
- [ ] **Firebase App Check** enabled (Auth, Firestore, Functions) — ⚠️ **now the most urgent open blocker**: as of 2026-07-21 the backend is publicly reachable, so this is the main abuse defense. Free.
- [x] **Firestore security rules reviewed and hardened** for every read/write path, then tested — audited 2026-07-20 (no privilege-escalation path: tier is read from the server-only `entitlements` doc) and pinned by **21 emulator-backed rules tests** that run in CI on every push.
- [x] **Crash reporting** wired — **Sentry** (free tier) initialised before root registration, `Sentry.wrap(App)`, and the global `ErrorBoundary.onError` reports render-phase crashes. Verified delivering to the dashboard.
- [ ] **User data deletion / account deletion flow** (App Store & Play Store requirement).

---

## 1. Security & Secrets

- [x] `.env` is gitignored; no secrets committed (`.env.example` documents keys).
- [x] ~~Rotate the BFL (Flux) API key~~ — **descoped 2026-07-20 (owner decision).** `.env` is gitignored and was never pushed; BFL is not called at runtime (the 35 hero images are already generated and bundled), so the blast radius is limited to BFL image credits. Rotate opportunistically at `dashboard.bfl.ai` if ever desired. **The BFL commercial-licensing question (§8) is unaffected and still open.**
- [ ] Audit for any other keys/tokens in logs, chat history, or committed files.
- [ ] Confirm Firebase config in the client is the intended project and has no admin/service-account keys bundled.
- [ ] Service account keys live only in `secrets/` (gitignored) and CI secret stores — never in the repo.
- [ ] Restrict Firebase API keys (HTTP referrer / app restrictions in Google Cloud console).

## 2. Backend — Firebase (Firestore, Functions, Storage)

- [x] Metrics function (`onWorkoutCompleted`) computes summary/PRs/streak/volume + XP server-side.
- [x] XP/gamification doc is server-write-only (client denied by rules) — anti-cheat.
- [ ] **Review & test all Firestore rules** end-to-end (owner isolation, custom exercises, metrics/entitlements deny). Add rules unit tests (`@firebase/rules-unit-testing`).
- [x] **Deploy Cloud Functions** — deployed 2026-07-21 (`onWorkoutCompleted`, `ensureEntitlementDoc`, us-central1). Built fresh first; **there is still no predeploy hook**, so always `npm run build` before deploying. Needs `FUNCTIONS_DISCOVERY_TIMEOUT=120` on this machine (see handoff runbook).
- [x] Firestore composite indexes deployed 2026-07-21.
- [x] **Firestore re-seed** — done 2026-07-21: 20 exercises + 4 plan templates, 0 errors. Production `ex_001` verified carrying 5-step instructions, `formTip`, `primaryMuscleGroup`, `media.animationKey`. Auth via `gcloud auth application-default login` (no service-account key needed).
- [x] **Guest→account metrics migration bug** — resolved 2026-07-20 by **removing** `migrateGuestMetrics`. It wrote client-side to `users/{uid}/metrics/**` which rules deny (anti-cheat), so it could only ever fail silently; and it was redundant because `onWorkoutCompleted` regenerates metrics server-side from the migrated workouts.
- [ ] Set Cloud Functions region, memory, and min-instances appropriately; confirm cold-start acceptable.
- [ ] Firebase Storage rules configured (currently unused — see §9 art migration).

## 3. Payments & Entitlements

- [x] Tier model unified on `tier: 'free'|'plus'|'pro'`; `isPro`/`isPlus` derive correctly; `RequireTier`/`RequirePlus` guards in place.
- [ ] Integrate a real payment provider (RevenueCat / Stripe / native IAP).
- [ ] Server verifies purchase receipts and writes the entitlement doc (never trust the client).
- [ ] Replace the upgrade stub in `UpgradeScreen` / `PaywallScreen` with the real flow.
- [ ] Verify gates across premium plan templates, AI Coach, and Plus-gated training tools.
- [ ] Test restore-purchases, expiry, refunds, and `past_due` handling.

## 4. Notifications & Engagement

- [x] Notification preference UI + persisted fields exist.
- [ ] Install/configure real scheduling (`expo-notifications`) + permission handling.
- [ ] Schedule local/push reminders from saved preferences; capture delivery evidence.

## 5. Observability — Crash reporting, Analytics, Logging

- [ ] Crash reporting (Crashlytics / Sentry) on native + web.
- [x] Analytics pipeline — all 47 `console.log('[Analytics] …')` call sites migrated to a `track()` facade: **Firebase Analytics/GA4** (`G-NX4W2PEQXD`) on web + Sentry breadcrumbs. Verified transmitting from production. **Native GA4 backend is still an open decision** (Firebase JS analytics is browser-only; native currently only gets Sentry breadcrumbs).
- [ ] Structured logging + alerting on Cloud Functions failures (metrics/XP already log `[Audit]`).
- [x] Global `ErrorBoundary.onError` reports render-phase crashes to Sentry.

## 6. CI/CD & Release

- [x] CI pipeline — GitHub Actions, 3 jobs green on every push: app (tsc + 97 tests), functions (build + 36 tests), **Firestore rules (21 emulator tests on Temurin 21)**. Lint not yet wired.
- [ ] Automated builds — **local Android builds only until revenue** ($0 budget; EAS cloud builds and Apple's $99/yr are "when revenue exists" upgrades). Web deploy via a free tier (Firebase Hosting free / Cloudflare Pages).
- [ ] EAS Update (OTA) channel strategy defined (prod/staging).
- [ ] Release smoke-test checklist run against a production build before promotion.
- [ ] Versioning / build numbers automated.

## 7. Testing & QA

- [x] Unit tests green: app **97/97**, functions **36/36**; `tsc` clean.
- [~] **Native device QA (iOS + Android)** — **Android now verified on an emulator (2026-07-19)**: expo-gl 3D demos, `expo-video` playback, the exercise-detail carousel *including its native `.measure()` path*, tab icons, and search all confirmed working. Getting there required fixing four structural blockers (the project had been scaffolded as plain React Native, not Expo — see `CLAUDE_HANDOFF.md` §"Native is now working"). The full workout → summary → **share sheet** loop is also verified (`react-native-view-shot` + `expo-sharing`). **Remaining:** **physical-device** Android QA and **iOS entirely** (no macOS host).
- [ ] **Native build prerequisites on Windows** — `MAX_PATH` needs a `subst` drive or `LongPathsEnabled`; McAfee's firewall blocks Java's NIO `Selector.open()` and breaks Gradle outright; `expo prebuild --clean` deletes `android/local.properties`. Document these in onboarding before another dev tries to build.
- [ ] Backfill tests for new features (training lib, XP/gamification, entitlements, repositories, share-card) — intentionally deferred; pure logic was written test-ready.
- [ ] End-to-end critical path on all platforms: sign up → onboarding → create plan → start workout → log sets → finish → verify history/progress/XP.
- [ ] Offline & resume testing for active workouts.
- [ ] Low-end Android GL fallback (reduce-motion, no-GL → SVG) verified on device.

## 8. Compliance & Legal

- [ ] User data deletion / account deletion flow (store requirement).
- [ ] Privacy Policy & Terms of Service finalized and linked (Welcome screen links exist — confirm they resolve).
- [ ] Data export (GDPR/CCPA) if in scope.
- [ ] App Store / Play Store privacy nutrition labels & data-safety forms.
- [ ] Health/fitness disclaimer ("consult a professional") shown where appropriate.
- [ ] Third-party content/licensing cleared (exercise imagery is AI-generated originals — confirm BFL license terms permit commercial use).

## 9. Performance & Assets

- [x] Three.js lazy-chunked (kept out of the initial web bundle); pixel ratio clamped; SVG/reduce-motion fallbacks.
- [x] Exercise hero images bundled as JPEGs (`app/assets/exercises/`, ~7.4MB / 35 images).
- [x] Demo videos bundled (`app/assets/videos/`, **3.8MB / 15 files**, 720×720 H.264); only the active carousel page mounts a player.
- [x] Muscle infographics bundled (`app/assets/muscles/`, **1.7MB / 20 files**).
- [ ] **🔖 CHECKPOINT — Migrate exercise art + video to Firebase Storage** (see §12). Bundled media is ~12.9MB (7.4 art + 3.8 video + 1.7 infographics). **⛔ Deferred to AFTER FIRST REVENUE ($0-budget constraint, Jul 2026)** — this overrides the old ~15–20MB size trigger. Bundled media works offline and costs nothing; revisit only if the store binary size becomes a conversion problem.
- [ ] Measure production bundle size (native binary + web initial load); set budgets.
- [ ] Image/asset optimization pass if bundle grows.
- [ ] Verify `react@19.1.0` / dependency alignment holds for the production install.

## 10. Config & Environments

- [ ] Firebase Remote Config defaults + safe fallback behavior.
- [ ] Separate Firebase projects (or environments) for staging vs production.
- [ ] All environment-specific values externalized (no hardcoded prod endpoints).
- [ ] Feature flags for incomplete features (AI Coach, payments) so they can be hidden at launch.

## 11. Content & Data

- [x] 20 exercises with full instructions + Pro Tips + animation keys + hero images.
- [x] Demo videos on **15 of 20** exercises; muscle infographics on **all 20**. The 5 machine exercises (Leg Press, Lat Pulldown, Seated Row, Face Pull, Hamstring Curl) are infographic-only **by deliberate product decision** — not a gap.
- [ ] Bench Press demo video is stylistically inconsistent with the other 14 (cinematic close-up on dark vs. wide shot on the branded stage). Anatomically correct as of 2026-07-18; cosmetic polish only.
- [ ] Decide launch scope for the 15 **proposed** exercises (data + images staged but not in the live catalog).
- [ ] Plan templates reviewed for correctness and difficulty.
- [ ] AI Coach: ship a real experience or hide behind a flag (currently a static placeholder).

## 12. Known Issues & Cleanup

- [x] **Tab-bar icons** — root cause was no `tabBarIcon` at all in `RootNavigator.tsx` (only `title`), so React Navigation rendered placeholder glyphs. Fixed 2026-07-19 with a typed `TAB_ICONS` map (Ionicons, filled when focused); verified on web **and** on the Android emulator.
- [ ] **Dependency overrides are a workaround, not a fix** — `package.json` pins `expo-file-system` and `expo-font` because `expo-three@8.0.0` and `@expo/vector-icons` hoist SDK-incompatible versions. Upgrading/replacing `expo-three` would remove the need; until then, do not delete the `overrides` block (native build breaks, then crashes at startup).
- [ ] **`onLayout` is unreliable on react-native-web 0.21 in this app** (does not fire at mount or on resize). Any container measurement must use ref + `getBoundingClientRect` (web) / `.measure()` (native) — the pattern established in `ExerciseDetailScreen`. Do not "simplify" it back to `onLayout`/`useWindowDimensions`; that was the cause of the Jul-18 carousel overflow regression.
- [ ] Remove/ignore any generated runtime files not meant to be committed.
- [ ] `flux-output/` (dev image scratch) is gitignored — confirm it stays out of releases.

---

## Revisit Checkpoints (deferred decisions)

### 🔖 Migrate exercise art from bundled assets → Firebase Storage

**Current state:** All 35 Flux hero images are bundled in `app/assets/exercises/` and referenced via static `require()` in `app/src/data/exerciseImages.ts` (~7.4MB, ~200KB each). Nothing is in Firebase Storage; `media.thumbnailUrl` is unused. This was the pragmatic choice — works offline, works for guest (mock) users, no Storage/rules setup.

**Migrate when ANY of these becomes true:**
1. **Art payload grows past ~15–20MB** — e.g. adding the 15 proposed exercises to the live catalog, adding storyboard/muscle-closeup variants (~100+ images), or growing the catalog past ~50–75 exercises.
2. **You need to update art without an app release** — frequent re-generation, palette changes, seasonal/regional art.
3. **User-created content needs images** — custom/AI-generated exercise imagery can't be bundled and forces Storage.
4. **Install size matters** — optimizing store conversion, or the native binary approaches concern territory (three.js + assets + art).
5. **Remote control of art** — A/B testing or Remote-Config-driven imagery.

**Recommended timing:** during the **Production Readiness** phase (§2/§9), when Storage rules are being set up anyway. Do **not** do it during active feature iteration — it adds a network dependency and rules surface for no current benefit.

**Migration steps (when triggered):**
1. Upload `app/assets/exercises/*.jpg` to a `exercise-images/` path in Firebase Storage.
2. Add a **public-read** Storage rule for that path (images aren't sensitive); lock writes to admin.
3. Write download URLs into each exercise's `media.thumbnailUrl` (seed JSON + Firestore re-seed).
4. Switch `getExerciseImage` to a **hybrid** — prefer the remote URL, fall back to the bundled asset (keeps offline support):
   ```ts
   return exercise?.media?.thumbnailUrl
     ? { uri: exercise.media.thumbnailUrl }   // Storage/CDN
     : EXERCISE_IMAGES[exerciseId];            // bundled fallback (offline-safe)
   ```
5. Optionally add a caching layer (`expo-image` handles disk cache) and drop the least-used bundled images to shrink the binary.

**No lock-in:** `getExerciseImage` is a single resolver, so today's bundled setup does not make this migration harder later.
