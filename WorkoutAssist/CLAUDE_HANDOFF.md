# Claude Handoff — WorkoutAssist / MonaFitXP

_Last updated: 2026-07-21. Read this first in a new session, then pull the referenced memory files for full detail._

## 🚀 THE APP IS LIVE

**https://workoutassist-6e273.web.app** — full stack deployed to Firebase project `workoutassist-6e273` (Blaze, billing enabled) on 2026-07-21.

| Layer | State |
|---|---|
| Web hosting | ✅ Firebase Hosting (free Spark product), 91 files, SPA rewrite, immutable asset caching |
| Firestore rules + indexes | ✅ Deployed — **fixed stale prod rules that were missing `customExercises` entirely** |
| Cloud Functions | ✅ `onWorkoutCompleted`, `ensureEntitlementDoc` (us-central1, nodejs20) |
| Catalog seed | ✅ 20 exercises + 4 plan templates, enriched fields (instructions/formTip/animationKey) |
| Observability | ✅ Sentry + GA4 (`G-NX4W2PEQXD`) verified transmitting |
| CI | ✅ 3 green jobs on every push (app, functions, Firestore rules) |

**Real accounts work end-to-end**: signup → `ensureEntitlementDoc` → rich catalog → workout → `onWorkoutCompleted` computes streak/PRs/XP server-side.

**⚠️ NOT yet verified in production:** the authenticated path has never been exercised live — no account has been created on prod. Deliberately left to the owner (avoids a junk user record). **This is the #1 next action.**

## Where things stand

**The visual-upgrade project (Phases 1–3) is complete, committed, and verified live on web.** The exercise demo went from a blocky procedural mannequin to:
- **demo videos on 15 of 20 exercises** (3.8 MB bundled),
- **muscle infographics on all 20** (1.7 MB),
- a **swipe/chevron carousel** across the whole catalog on the detail screen,
- a hardened fallback chain: **video → 3D GLB/procedural → poster → SVG diagram**.

**As of Jul 19 the app also RUNS ON ANDROID for the first time** — see "Native is now working" below. One **non-blocking product decision is parked**: whether the demo videos should also play inside the Workout Player, which today deliberately uses the interactive 3D scene instead (full rationale + trade-offs in `docs/APP_FEATURES.md` §D "PARKED PRODUCT DECISION"). Not a bug — do not "fix" it without a product call.

## ⛔ Hard constraint — $0 budget until revenue (Jul 2026)

The developer is bootstrapping: **no paid services, tiers, or subscriptions may be recommended or adopted until the app generates revenue.** Everything must run on free tiers — and the current stack deliberately does: Sentry (5K errors/mo free), GA4 (free), GitHub Free + public-repo Actions (unlimited CI), Expo local builds (no EAS cloud), bundled media (no CDN), free web hosting. Acknowledged exceptions only: **Google Play $25 one-time**, and **Firebase Blaze card-on-file** when Functions deploy (free quotas ≈ $0/mo; set a $1 budget alert). **Apple $99/yr is deferred** — Android + web PWA first. The media→CDN migration is deferred to *after first revenue*, overriding the old ~15–20 MB size trigger. If a paid option is materially better, present it only as a labeled "when revenue exists" upgrade — never the default.

Full narrative history — architecture decisions, every gotcha, exact tool params — lives in Claude's memory system (not duplicated here):
- `mocap-video-pipeline.md` — **the main log**: Mixamo→Blender + fal/Seedance/Kling pipeline, every round of fixes, exact model params
- `native-android-setup.md` — **read before ANY native work**: how to actually run the app on the emulator (fast path = no rebuild), the four blockers that made native unbuildable, and this machine's Windows build prerequisites. Mirrors the RUNBOOK below.
- `rigged-glb-demos.md` — the Blender GLB pipeline (still the fallback for exercises without a video)
- `rnweb-onlayout-unreliable.md` — **read before any layout/measurement work** (see Gotchas)
- `bash-env-split.md` — Bash tool ≠ the user's real terminal for AppData/global caches (matters if touching the Mixamo MCP)
- `competitive-features-2026-07.md` — the broader Jul 2026 feature build this sits inside

## Recently resolved (Jul 18)

**1. Carousel layout regression (was breaking every exercise).** Pages were sized from `useWindowDimensions()` — the *window* — so whenever the window ≠ the carousel container, every page overflowed ~3×: the video hero rendered as a black slice and the muscle art spilled off-screen. **Fixed** by measuring the container directly (ref + `getBoundingClientRect`), with window width only as a first-frame fallback. Verified at 320/375/500 px, on resize, and through chevron paging.

**2. Bench Press video — shipped, then regenerated properly.** v3 was shipped first, but it had two defects that the old notes hadn't captured: it opened with ~1.5 s of the character standing beside the **plyo box** before lying down, and its muscle coloring was on the **legs** (it had been generated from `bench_start4.png`, a standing-by-box frame with the squat/box color set). **Fixed** by recoloring a clean top-of-press frame with `fal-ai/nano-banana-pro/edit` (cyan pectorals; violet delts/triceps/serratus; legs cleared) and re-looping it through Kling v3 — no box, correct muscles, no head-melt artifact. Now `benchpress-demo.mp4` (347 KB).

## Native is now working (Jul 19) — and why it never was

**The app was scaffolded as a plain React Native project, with Expo added on top.** Native was therefore never buildable or runnable; web always worked because it never touches the native projects, which is exactly why ~2 weeks of web-only verification never caught it. The first Android smoke test hit **four independent blockers**, each masked by the previous — all now fixed and committed:

1. **`android/`+`ios/` came from the RN CLI template** — no Expo autolinking in `settings.gradle`. Fixed with `npx expo prebuild --clean --platform android`, after adding `android.package` to `app.json` (it was missing; without it prebuild invents a new applicationId and silently changes app identity).
2. **Dependency hoisting** put Expo native modules at versions SDK 54 rejects: `expo-file-system@13.2.1` (SDK-44 era, breaks the Gradle build) and `expo-font@57` (crashed the app at startup). Both pinned via `overrides` in `package.json` to `expo/bundledNativeModules.json` values. `expo install --fix` does NOT fix these — they're transitive.
3. **`babel.config.js` used `module:@react-native/babel-preset`** instead of `babel-preset-expo` (which wasn't even installed) — this mis-compiled Expo's `winter` polyfills and killed every launch with `ReferenceError: Property 'require' doesn't exist`.
4. **Firebase auth was web-only** (`getAuth` + `browserLocalPersistence`), so `onAuthStateChanged` never fired on device → infinite loading spinner. Fixed with the `firebase.native.ts` platform split.

`expo-three@8.0.0` is the common thread behind #2 and is the standing upgrade/replacement candidate.

## Verified-working state

- `npx jest` → **11/11 suites, 97/97 tests**; `tsc --noEmit` clean.
- **Web**: video playback, infographics, and the carousel drive cleanly with no console errors.
- **Android (emulator, dev build, Jul 19)** — verified live: Welcome → guest → Home, **tab-bar icons** (all 5 distinct, active tinted), **expo-video** playback (squat + regenerated bench press), the **carousel including its native `.measure()` path** and chevron paging, **expo-gl/three.js** 3D demos, and the id-keyed video registry (Leg Press correctly shows 3D, not the squat video).
- **Full workout loop verified on Android**: Start Workout → set logging → rest-timer overlay → Finish Workout → Summary → **Share Workout** (branded card captured via `react-native-view-shot`, handed to the Android share sheet by `expo-sharing`). **iOS remains entirely unverified** (no macOS host), and Android has only run on an emulator, not physical hardware.

## Deploy runbook (Firebase) — hard-won, don't rediscover these

Project `workoutassist-6e273`. All commands from `WorkoutAssist/`.

```bash
# 1. Rules + indexes
npx firebase deploy --only firestore:rules,firestore:indexes --project workoutassist-6e273

# 2. Functions — ALWAYS build first (there is no predeploy hook, stale lib/ would ship)
cd functions && npm run build && cd ..
FUNCTIONS_DISCOVERY_TIMEOUT=120 npx firebase deploy --only functions --project workoutassist-6e273

# 3. Web
cd app && npx expo export -p web && cd ..     # -> app/dist (gitignored, ~20MB, 91 files)
npx firebase deploy --only hosting --project workoutassist-6e273

# 4. Catalog seed (idempotent, set+merge, no deletes)
gcloud auth application-default login          # once; ADC, no service-account key needed
npm install                                    # root deps (firebase-admin) — easy to forget
GOOGLE_CLOUD_PROJECT=workoutassist-6e273 npm run seed
```

**Gotchas that cost real time:**
- **`FUNCTIONS_DISCOVERY_TIMEOUT=120` is required** on this machine. The default 10s fails with *"User code failed to load. Cannot determine backend specification."* The code is fine — it loads in ~300ms; the discovery handshake is just slow to come up here.
- **Never add `**/node_modules/**` to the hosting `ignore`.** `expo export` emits vendored icon fonts to `assets/node_modules/@expo/vector-icons/**`. That pattern silently drops 30 of 91 files; the SPA rewrite then answers the missing `.ttf` with `index.html`, the browser parses HTML as a font, and **every icon renders as a tofu box**. A comment in `firebase.json` guards this.
- **Verify UI changes with a screenshot, not just DOM metrics.** The tofu bug passed every DOM check (font "registered", glyphs measured 19×28 — that was the tofu box itself). Only the screenshot caught it.
- Fonts/assets are served `immutable, max-age=1yr`. Filenames are content-hashed so that's correct — but a *bad* deploy gets cached hard. If you see stale/broken assets, verify with `fetch(url, {cache:'reload'})` before assuming the server is wrong.
- The agent's shell **cannot run the Firestore emulator** (Java NIO `Selector.open()` fails, same root cause as Gradle) — run `npm run test:rules` from your own terminal with `JAVA_HOME` set to a **JDK 21+** (Android Studio's JBR works; PATH default is 17). CI runs it fine on Temurin 21.

## Run the app locally — RUNBOOK (start here if you need the app running)

Paths on this machine: SDK `C:\Users\CedricYovodevi\AppData\Local\Android\Sdk`, AVD `Medium_Phone_API_36.1`, package `com.workoutassist`.

### Web (fastest — no native toolchain at all)
```bash
cd app && npx expo start --web        # http://localhost:8081
```

### Android — FAST PATH (no rebuild; use this ~90% of the time)
**The APK persists on the emulator across restarts.** If you only changed JS/TS you do **not** need Gradle, `subst`, or a rebuild — just Metro + a JS reload:
```bash
SDK="$LOCALAPPDATA/Android/Sdk"

# 1. boot the emulator (background; ~60-90s to finish booting)
"$SDK/emulator/emulator.exe" -avd Medium_Phone_API_36.1 -no-snapshot-load -no-boot-anim &

# 2. wait until it is actually ready
"$SDK/platform-tools/adb.exe" wait-for-device
until [ "$("$SDK/platform-tools/adb.exe" shell getprop sys.boot_completed | tr -d '\r')" = "1" ]; do sleep 3; done

# 3. start Metro (from app/)
cd app && npx expo start          # add --clear after ANY babel/metro config change

# 4. point the device at Metro, then launch the already-installed app
"$SDK/platform-tools/adb.exe" reverse tcp:8081 tcp:8081
"$SDK/platform-tools/adb.exe" shell am start -n com.workoutassist/.MainActivity
```
`adb reverse` is the step that gets forgotten — without it the app cannot reach Metro and sits on a blank/splash screen.

**Driving and observing it (all of this works from an agent shell):**
```bash
adb exec-out screencap -p > shot.png          # screenshot — USE THIS (see gotcha below)
adb logcat -d -s ReactNativeJS:V | tail -30   # JS console output
adb shell dumpsys activity activities | grep -m1 topResumedActivity   # what is foreground
adb shell input tap <x> <y>                   # tap; coords come from the screencap
```

### Android — REBUILD PATH (only when native deps/config change)
Needed after: adding/removing a native module, `app.json` plugin changes, `expo prebuild`, or edits to the dependency `overrides`.
```cmd
subst W: C:\Users\CedricYovodevi\sources\repo\SaaS-App\MonaFitXP\WorkoutAssist
W:
cd W:\app
npx expo run:android
```
- **`subst` is mandatory** (MAX_PATH) and is **per-logon-session — it disappears on reboot**, so re-run it each time.
- **Must run in the user's own terminal**, not an agent shell (see Gotchas below).
- If `expo prebuild --clean` was run, first recreate `app/android/local.properties` containing `sdk.dir=C\:\\Users\\CedricYovodevi\\AppData\\Local\\Android\\Sdk` — `--clean` deletes it every time.

### Troubleshooting — every failure actually hit, and its fix
| Symptom | Cause → Fix |
|---|---|
| `Unable to establish loopback connection` (Gradle **or** Firestore emulator) | McAfee firewall blocking Java's NIO `Selector.open()` → allow both `java.exe`, or disable that firewall. **Also fails in agent shells regardless of McAfee** — the user must run these. |
| `Filename longer than 260 characters` | MAX_PATH → `subst W:` and build from `W:\app`. |
| `SDK location not found` | `app/android/local.properties` missing (deleted by `prebuild --clean`) → recreate it with `sdk.dir`. |
| `ReferenceError: Property 'require' doesn't exist` + `AppRegistryBinding::startSurface failed` | `babel.config.js` not using `babel-preset-expo` → fix it, then **`expo start --clear`** (a stale cache keeps reproducing it). |
| Instant crash; logcat shows `NoSuchMethodError: getDirectConverter` | `expo-font` hoisted to v57 → keep the `overrides` block in `app/package.json`. |
| Gradle: `Plugin with id 'maven' not found` | `expo-file-system` hoisted to v13 (SDK-44 era) → same `overrides` block. |
| App hangs forever on the loading spinner | Firebase auth taking the web path → `src/firebase/firebase.native.ts` must exist (`initializeAuth` + AsyncStorage persistence). |
| Expo Go fails with a `require` error | **This is a bare/prebuilt project — Expo Go cannot run it.** Use the dev build (`expo run:android`). |
| Blank screen, never connects to Metro | forgot `adb reverse tcp:8081 tcp:8081`, or Metro isn't running / 8081 is taken. |
| `Port 8081 already in use` | kill the stale Metro: `netstat -ano \| grep :8081` then `taskkill //F //PID <pid>`. |
| `firebase-tools no longer supports Java version before 21` | PATH default is JDK 17 → `set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"` **and** `set "PATH=%JAVA_HOME%\bin;%PATH%"` (JAVA_HOME alone is not enough; firebase-tools resolves `java` from PATH). |

**The gotcha that cost the most time:** *verify UI with a screenshot, not DOM/metric checks.* The tab-icon "tofu box" bug passed every programmatic check — the font reported as registered and glyphs measured 19×28, which was the tofu box itself. Only `adb exec-out screencap` (and a browser screenshot on web) revealed it.

## Building natively on this machine (Windows) — prerequisites

Native builds fail without these; see `native-android-setup.md` for the full diagnosis.

- **MAX_PATH**: the repo root is 69 chars and ninja embeds full source paths, so builds die with `Filename longer than 260 characters`. Work around it with `subst W: <repo root>` and build from `W:\app`. **`subst` is per-logon-session — it disappears on reboot.** Durable fixes: enable `LongPathsEnabled` or move the repo somewhere short.
- **McAfee's firewall blocks Java's NIO `Selector.open()`**, which made every Gradle run fail with `Unable to establish loopback connection`. Allow both `java.exe` (JDK 17 launcher + Android Studio JBR daemon), or disable that firewall.
- **`android/local.properties`** (gitignored, holds `sdk.dir`) is **deleted by every `expo prebuild --clean`** — recreate it, or set `ANDROID_HOME` permanently.
- **Agent shells cannot run Gradle here** (same `Selector.open()` failure, even unsandboxed). `adb`, Metro, and node work fine from them — so the working split is **the user builds, the agent verifies via adb**.

## Immediate next steps (priority order)

1. **Verify the authenticated flow on production.** Sign up on https://workoutassist-6e273.web.app with a real email, then confirm: `users/{uid}/entitlements/current` was created by `ensureEntitlementDoc`; the catalog loads with Pro Tips; completing a workout makes `onWorkoutCompleted` write `users/{uid}/metrics/summary` + `metrics/gamification`. Check `firebase functions:log`. **Nothing else should ship before this passes.**
2. **Firebase App Check** (free) — the backend is now publicly reachable and this is the main abuse defense. Still an open §0 blocker.
3. **Node.js 20 → 22 + `firebase-functions` v5 → v6.** Runtime is **decommissioned 2026-10-30**; after that functions cannot deploy. v6 has breaking changes, so do it while nothing urgent depends on it.
4. **Compliance for a public beta**: privacy policy + ToS that actually resolve, health disclaimer, and the account-deletion flow (also a store requirement, and now meaningful since real accounts exist).
5. **Get real users on it** and let their behaviour decide payments vs. AI Coach. Entitlement tests must be written *before* any payments work.
6. **Deferred by choice** (do not resurrect without a trigger): media→CDN migration (after first revenue), iOS bring-up (needs a macOS host), Android physical-device QA, `expo-three@8` upgrade (would remove the dependency overrides).

See `docs/APP_FEATURES.md` (reconciled 2026-07-19) for the full A/B/C/D breakdown of implemented / in-progress / remaining / needs-improvement.

## Gotchas — do not regress these

- **`babel.config.js` must use `babel-preset-expo`**, never `module:@react-native/babel-preset`. The RN preset mis-compiles Expo's `winter` polyfills and breaks *every* native launch. Any babel change requires `expo start --clear`.
- **Do not remove the `overrides` block in `package.json`** (`expo-file-system`, `expo-font`). Without it npm hoists SDK-incompatible versions and native either fails to build or crashes at startup.
- **`src/firebase/firebase.native.ts` is load-bearing** — deleting it (or "unifying" it back into `firebase.ts`) restores the infinite-spinner hang on device. Web and native intentionally initialize auth differently.
- **`onLayout` does NOT fire reliably on react-native-web 0.21 here** (neither at mount nor on resize). Measure containers with a ref + `getBoundingClientRect` (web) / `.measure()` (native) and a `resize` listener. This is what makes the carousel correct — don't "simplify" it back to `onLayout` or `useWindowDimensions`.
- **Video registry is keyed by exercise ID, not `animationKey`.** Several exercises share an animation key, so key-based lookup showed the wrong movement (Leg Press played the squat video).
- **Carousel uses a plain paged `ScrollView`, not `FlatList`** — RN-web's virtualized list resets scroll offset to 0 on any re-render. Active-page tracking lives in a ref + pub/sub bus, never parent state, for the same reason. Chevron `scrollTo` must be `animated: false` (CSS scroll-snap cancels smooth scrolling).
- **Only the active carousel page mounts a video/GL demo** — keep it that way; stacking GL contexts or autoplaying videos will tank the screen.
- **Blender prop attachment**: props use a `COPY_LOCATION` constraint with `head_tail=0.6` (palm center) and no rotation inheritance. Do **not** use `Child Of` on a hand bone — it puts props at the wrist and twists them with IK.
- **Screen every generated video at 3+ frames including mid-rep** before encoding. Two-frame checks have missed real defects twice (the bench box-intro shipped this way).

## Key reusable assets

- `art/blender/seedance-posing-stage.blend` — the posing rig (character + barbell + dumbbells + pull-up bar + props, IK-grip-corrected). **Note:** it currently sits in the Dumbbell Row pose and contains no bench or box objects; the bench-press lying pose is *not* saved anywhere.
- **Cheapest fix for wrong muscle coloring on an existing demo:** recolor one frame with `fal-ai/nano-banana-pro/edit` (pass `image_urls` as an **array** — a single `image_url` 422s) and re-loop via Kling v3 with the same frame as start *and* end. Far cheaper than re-posing in Blender when a good pose already exists in a prior render.
- **Model choice:** Kling v3 (`fal-ai/kling-video/v3/pro/image-to-video`) beats Seedance for prompt adherence on limb constraints.
- **ffmpeg** lives at `~/mcp-tools/mixamo-mcp/.venv/.../imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe` (there is no system ffmpeg). App encode recipe: `-vf scale=720:720 -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -an -movflags +faststart`.
