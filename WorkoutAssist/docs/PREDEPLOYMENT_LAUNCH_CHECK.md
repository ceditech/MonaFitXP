# WorkoutAssist / MonaFitXP — Pre-Deployment & Launch Checklist

_A living checklist of what must be verified before shipping to production. Keep it updated as items are completed or added._
_Last updated: 2026-07-10._

**Status legend:** `[ ]` not started · `[~]` partial / in progress · `[x]` done.
This reflects the real state of the codebase — not aspirational planning.

---

## 0. Blockers — do not launch without these

- [ ] **Real payment integration** for Plus/Pro (currently a "Stripe flow coming soon" stub). No purchases can be made.
- [ ] **Server-side purchase verification** writing entitlements from trusted backend events only.
- [ ] **Firebase App Check** enabled (Auth, Firestore, Functions) to stop API abuse.
- [ ] **Firestore security rules reviewed and hardened** for every read/write path, then tested.
- [ ] **Crash reporting** wired (Crashlytics / Sentry) so production crashes are visible.
- [ ] **User data deletion / account deletion flow** (App Store & Play Store requirement).
- [ ] **Rotate all secrets** that touched development chats or logs (see §1).

---

## 1. Security & Secrets

- [x] `.env` is gitignored; no secrets committed (`.env.example` documents keys).
- [ ] **Rotate the BFL (Flux) API key** — it appeared in plaintext during development. Regenerate at `dashboard.bfl.ai` and update `.env`.
- [ ] Audit for any other keys/tokens in logs, chat history, or committed files.
- [ ] Confirm Firebase config in the client is the intended project and has no admin/service-account keys bundled.
- [ ] Service account keys live only in `secrets/` (gitignored) and CI secret stores — never in the repo.
- [ ] Restrict Firebase API keys (HTTP referrer / app restrictions in Google Cloud console).

## 2. Backend — Firebase (Firestore, Functions, Storage)

- [x] Metrics function (`onWorkoutCompleted`) computes summary/PRs/streak/volume + XP server-side.
- [x] XP/gamification doc is server-write-only (client denied by rules) — anti-cheat.
- [ ] **Review & test all Firestore rules** end-to-end (owner isolation, custom exercises, metrics/entitlements deny). Add rules unit tests (`@firebase/rules-unit-testing`).
- [ ] **Deploy Cloud Functions** and confirm `functions/lib/` is rebuilt (`npm run build`) — there is **no predeploy hook**, so stale `lib/` would ship old code.
- [ ] Verify Firestore composite indexes exist for all queries (deploy `firestore.indexes.json`).
- [ ] **Firestore re-seed**: run `npm run seed` so authenticated users get the enriched exercise fields (instructions, `formTip`, `animationKey`, `primaryMuscleGroup`). Guests already have them via the local mock.
- [ ] **Guest→account metrics migration bug**: `migrateGuestMetrics` writes to a server-only path and silently fails — fix or remove (see spawned task).
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
- [ ] Replace console-only analytics (`[Analytics] ...` logs) with a real pipeline (events: signup, onboarding, workout_completed, upgrade_clicked, level_up, etc.).
- [ ] Structured logging + alerting on Cloud Functions failures (metrics/XP already log `[Audit]`).
- [ ] Verify the global `ErrorBoundary` reports caught errors to the crash tool (`onError` hook).

## 6. CI/CD & Release

- [ ] CI pipeline: install, `tsc --noEmit`, `jest` (app + functions), lint on every PR.
- [ ] Automated builds via EAS Build (iOS + Android) and web deploy.
- [ ] EAS Update (OTA) channel strategy defined (prod/staging).
- [ ] Release smoke-test checklist run against a production build before promotion.
- [ ] Versioning / build numbers automated.

## 7. Testing & QA

- [x] Unit tests green: app **97/97**, functions **36/36**; `tsc` clean.
- [ ] **Native device QA (iOS + Android)** — the 3D exercise animations (expo-gl), share sheet, and full workout flow have only been verified on **web**.
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
- [ ] **🔖 CHECKPOINT — Migrate exercise art to Firebase Storage** (see §12 for full detail & triggers).
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
- [ ] Decide launch scope for the 15 **proposed** exercises (data + images staged but not in the live catalog).
- [ ] Plan templates reviewed for correctness and difficulty.
- [ ] AI Coach: ship a real experience or hide behind a flag (currently a static placeholder).

## 12. Known Issues & Cleanup

- [ ] **Tab-bar mojibake** — bottom tab icons render as broken `⏷` glyphs; replace with proper icons.
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
