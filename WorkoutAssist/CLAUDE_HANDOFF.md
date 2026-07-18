# Claude Handoff — WorkoutAssist / MonaFitXP

_Last updated: 2026-07-14. Written at ~84% context in the session that built the mocap-video pipeline, muscle infographics, and the exercise-detail carousel. Read this first in a new session, then pull the referenced memory files for full detail._

## Where things stand

**Visual-upgrade project (Phases 1–3) is largely shipped and verified live.** The exercise demo went from a blocky procedural mannequin to: (a) rigged GLB fallback, (b) muscle-colored anatomical infographics on **all 20 exercises**, (c) pre-rendered demo videos on **14 of 20 exercises**, (d) a working swipe/chevron carousel across the whole catalog on the detail screen.

Full narrative history — architecture decisions, every gotcha, exact tool params — lives in Claude's memory system (not this file, to avoid duplication):
- `rigged-glb-demos.md` — original Blender GLB pipeline (superseded by video for the exercises that have one, still the fallback)
- `mocap-video-pipeline.md` — **the main log**, Mixamo→Blender + fal/Seedance/Kling video pipeline, every round of fixes, exact model params
- `bash-env-split.md` — Bash tool ≠ user's real terminal for AppData/global caches (Playwright, npm -g, etc.) — matters if touching the Mixamo MCP again
- `competitive-features-2026-07.md` — the broader Jul 2026 feature build this sits inside

## ⚠️ One decision is parked — needs the user

**Bench Press has no shipped video.** Three Kling generations, each with a different flaw:
- v1/v2: consistent with the app's stage style, but the AI inflated the barbell plates to comic size and the head hangs slightly off the bench pad.
- v3: gorgeous cinematic close-up, correct plate sizes, head properly on the pad — but the camera moves and the style diverges from every other demo, plus a head-melt artifact near the bench edge in one frame.

Files exist for all three attempts (`art/fal/bench-kling*.mp4`), start frame at `C:/tmp/bench_start4.png` (may not survive a machine restart — regenerable from `art/blender/squat-video-stage-v2.blend` bench pose if needed), Blender scene has the `Bench` prop built.

**Ask the user which way to go before touching this again:**
1. Ship v3 (best single-clip quality, breaks visual consistency)
2. Ship v2 (consistent, visibly flawed plates)
3. More re-rolls (Seedance instead of Kling, or another Kling prompt)
4. Defer — leave bench on its infographic + 3D-fallback only (my standing recommendation, not yet confirmed)

## Working tree state (uncommitted — nothing has been committed this whole project)

Modified: `app/jest.setup.js`, `app/src/data/exerciseVideos.ts`, `app/src/features/catalog/ExerciseDetailScreen.tsx`, `app/src/features/catalog/components/VideoDemo.tsx`
Untracked (expected, not stray): `app/assets/videos/*.mp4` (14 files), `app/assets/muscles/*.jpg` (20 files), `art/fal/*.mp4` + `*.png` (generation history/backups), `art/mixamo/*.fbx`, `art/blender/*.blend`, `art/renders/*_png/` (gitignored intermediate frames — safe).

**Nothing has been committed in this whole multi-session project.** If starting fresh, check with the user before any `git add`/`git commit` — confirm what should actually go in vs. stay as local working files (e.g. the `art/` source tree is arguably not meant for the app repo history, that's a call for the user).

## Verified-working state (as of last check)

- Typecheck clean, `npx jest` → **11/11 suites, 97/97 tests** passing (fixed a previously-silent App-suite failure by mocking `expo-video`/`expo` in `jest.setup.js`)
- Web preview (`expo start --web` via `.claude/launch.json` config `expo-web`) drives cleanly; verified live: video playback, muscle infographics, and the new carousel (swipe + chevrons) across multiple exercises with zero console errors

## Immediate next steps (in likely priority order)

1. **Resolve the Bench Press decision above with the user.**
2. Native (Android/iOS) smoke test — everything so far has only been verified on web preview. GLB rendering, video playback, and IK/GL paths are unverified on-device.
3. Consider CDN migration for the video/image assets if the bundle grows further (currently ~3.5 MB video + 1.7 MB images — still fine to bundle, but was flagged as a future concern in `mocap-video-pipeline.md`).
4. The 5 machine exercises (Leg Press, Lat Pulldown, Seated Row, Face Pull, Hamstring Curl) + none of Box Jump's siblings remain infographic-only by deliberate design (poor video ROI) — not a bug, don't "fix" without discussing.

## Key reusable assets if extending the pipeline further

- `art/blender/seedance-posing-stage.blend` — the full posing rig: character + barbell + dumbbells + pull-up bar + bench + plyo box props, all IK-grip-corrected. Reuse this to pose any new exercise rather than rebuilding.
- Prop-attachment pattern (**important — don't regress**): props use `COPY_LOCATION` constraint with `head_tail=0.6` (palm center) and no rotation inheritance. Do NOT use `Child Of` directly to a hand bone — earlier attempts put dumbbells at the wrist and they twisted wildly with IK.
- Video-generation model choice: **Kling v3 (`fal-ai/kling-video/v3/pro/image-to-video`) beats Seedance for prompt adherence on arm/limb constraints** — use Kling by default for controlled-motion exercises.
- Screening rule: check 3+ frames (including mid-rep) of every generated video before encoding — 2 frames missed real defects earlier in this project.
