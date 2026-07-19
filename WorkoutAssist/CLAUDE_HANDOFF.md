# Claude Handoff — WorkoutAssist / MonaFitXP

_Last updated: 2026-07-19. Read this first in a new session, then pull the referenced memory files for full detail._

## Where things stand

**The visual-upgrade project (Phases 1–3) is complete, committed, and verified live on web.** The exercise demo went from a blocky procedural mannequin to:
- **demo videos on 15 of 20 exercises** (3.8 MB bundled),
- **muscle infographics on all 20** (1.7 MB),
- a **swipe/chevron carousel** across the whole catalog on the detail screen,
- a hardened fallback chain: **video → 3D GLB/procedural → poster → SVG diagram**.

**As of Jul 19 the app also RUNS ON ANDROID for the first time** — see "Native is now working" below. One **non-blocking product decision is parked**: whether the demo videos should also play inside the Workout Player, which today deliberately uses the interactive 3D scene instead (full rationale + trade-offs in `docs/APP_FEATURES.md` §D "PARKED PRODUCT DECISION"). Not a bug — do not "fix" it without a product call.

Full narrative history — architecture decisions, every gotcha, exact tool params — lives in Claude's memory system (not duplicated here):
- `mocap-video-pipeline.md` — **the main log**: Mixamo→Blender + fal/Seedance/Kling pipeline, every round of fixes, exact model params
- `native-android-setup.md` — **read before ANY native work**: the four blockers that made native unbuildable, plus this machine's Windows build prerequisites
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

## Building natively on this machine (Windows) — prerequisites

Native builds fail without these; see `native-android-setup.md` for the full diagnosis.

- **MAX_PATH**: the repo root is 69 chars and ninja embeds full source paths, so builds die with `Filename longer than 260 characters`. Work around it with `subst W: <repo root>` and build from `W:\app`. **`subst` is per-logon-session — it disappears on reboot.** Durable fixes: enable `LongPathsEnabled` or move the repo somewhere short.
- **McAfee's firewall blocks Java's NIO `Selector.open()`**, which made every Gradle run fail with `Unable to establish loopback connection`. Allow both `java.exe` (JDK 17 launcher + Android Studio JBR daemon), or disable that firewall.
- **`android/local.properties`** (gitignored, holds `sdk.dir`) is **deleted by every `expo prebuild --clean`** — recreate it, or set `ANDROID_HOME` permanently.
- **Agent shells cannot run Gradle here** (same `Selector.open()` failure, even unsandboxed). `adb`, Metro, and node work fine from them — so the working split is **the user builds, the agent verifies via adb**.

## Immediate next steps (priority order)

1. **iOS bring-up** (needs a macOS host) and Android QA on **physical hardware** — the remaining native gaps. Re-verifying Android needs only Metro + `adb reverse tcp:8081 tcp:8081`; the APK persists across emulator restarts, so no rebuild/`subst`/Gradle.
2. **Plan the media → Firebase Storage / CDN migration.** Bundled media is ~12.9 MB (7.4 art + 3.8 video + 1.7 infographics); the documented trigger is ~15–20 MB, so this is coming due. Do it during production-readiness when Storage rules are set up anyway — not during feature work.
3. **Production readiness** (nothing exists yet): CI/CD, crash reporting, real analytics, App Check, Remote Config, data-deletion flow.
4. **Upgrade or replace `expo-three@8.0.0`** to remove the dependency-override workarounds.

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
