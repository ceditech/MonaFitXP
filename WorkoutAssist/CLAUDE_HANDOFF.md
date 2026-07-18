# Claude Handoff — WorkoutAssist / MonaFitXP

_Last updated: 2026-07-18. Read this first in a new session, then pull the referenced memory files for full detail._

## Where things stand

**The visual-upgrade project (Phases 1–3) is complete, committed, and verified live on web.** The exercise demo went from a blocky procedural mannequin to:
- **demo videos on 15 of 20 exercises** (3.8 MB bundled),
- **muscle infographics on all 20** (1.7 MB),
- a **swipe/chevron carousel** across the whole catalog on the detail screen,
- a hardened fallback chain: **video → 3D GLB/procedural → poster → SVG diagram**.

**There is no parked decision anymore.** The Bench Press question from the previous handoff is resolved (see below). Working tree is clean through commit `c4aeecb`.

Full narrative history — architecture decisions, every gotcha, exact tool params — lives in Claude's memory system (not duplicated here):
- `mocap-video-pipeline.md` — **the main log**: Mixamo→Blender + fal/Seedance/Kling pipeline, every round of fixes, exact model params
- `rigged-glb-demos.md` — the Blender GLB pipeline (still the fallback for exercises without a video)
- `rnweb-onlayout-unreliable.md` — **read before any layout/measurement work** (see Gotchas)
- `bash-env-split.md` — Bash tool ≠ the user's real terminal for AppData/global caches (matters if touching the Mixamo MCP)
- `competitive-features-2026-07.md` — the broader Jul 2026 feature build this sits inside

## Recently resolved (Jul 18)

**1. Carousel layout regression (was breaking every exercise).** Pages were sized from `useWindowDimensions()` — the *window* — so whenever the window ≠ the carousel container, every page overflowed ~3×: the video hero rendered as a black slice and the muscle art spilled off-screen. **Fixed** by measuring the container directly (ref + `getBoundingClientRect`), with window width only as a first-frame fallback. Verified at 320/375/500 px, on resize, and through chevron paging.

**2. Bench Press video — shipped, then regenerated properly.** v3 was shipped first, but it had two defects that the old notes hadn't captured: it opened with ~1.5 s of the character standing beside the **plyo box** before lying down, and its muscle coloring was on the **legs** (it had been generated from `bench_start4.png`, a standing-by-box frame with the squat/box color set). **Fixed** by recoloring a clean top-of-press frame with `fal-ai/nano-banana-pro/edit` (cyan pectorals; violet delts/triceps/serratus; legs cleared) and re-looping it through Kling v3 — no box, correct muscles, no head-melt artifact. Now `benchpress-demo.mp4` (347 KB).

## Verified-working state

- `npx jest` → **11/11 suites, 97/97 tests**; `tsc --noEmit` clean.
- Web preview (`expo start --web` via `.claude/launch.json` config `expo-web`) drives cleanly: video playback, infographics, and the carousel across multiple exercises with no console errors.
- **Native (Android/iOS) is still entirely unverified** — see next steps.

## Immediate next steps (priority order)

1. **Native (Android/iOS) smoke test** — the single largest untested surface. GLB rendering, `expo-video` playback, expo-gl, the share sheet, and the carousel have only ever run on web.
2. **Plan the media → Firebase Storage / CDN migration.** Bundled media is now ~12.9 MB (7.4 art + 3.8 video + 1.7 infographics); the documented trigger is ~15–20 MB, so this is coming due. Do it during production-readiness when Storage rules are set up anyway — not during feature work.
3. **Production readiness** (nothing exists yet): CI/CD, crash reporting, real analytics, App Check, Remote Config, data-deletion flow.
4. **Quick win:** tab-bar icons — `RootNavigator.tsx` sets only `title` per `Tab.Screen`, no `tabBarIcon`, so the bar shows placeholder/mojibake glyphs.

See `docs/APP_FEATURES.md` (reconciled 2026-07-18) for the full A/B/C/D breakdown of implemented / in-progress / remaining / needs-improvement.

## Gotchas — do not regress these

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
