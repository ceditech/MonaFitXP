# WorkoutAssist / MonaFitXP — Visual Upgrade Tooling Guide

_How to take the exercise visuals from "good procedural" to "competitive, modern, elegant" — the tools, their APIs/MCP availability, and cost. Focused on public-API / MCP-connectable options._
_Created: 2026-07-10._

---

## The key distinction: still image vs. real-time animation

The polished squat infographic that inspired this (4-panel storyboard + muscle-anatomy panel) is a **generated static image**, not a real-time animation. That splits the work into two different problems:

| Goal | Nature | Difficulty | Fix for |
|---|---|---|---|
| The **anatomy / muscle-target panel** look | Still image | Easy (tool already integrated) | The flat SVG `MuscleDiagram` |
| A **real animated mannequin** moving through the rep | Real-time rigged 3D | Harder (needs 3D character assets) | The blocky procedural demo |

**Strategy: hybrid.** Use image-gen for anatomy/target visuals; upgrade the live demo to a real rigged 3D character. Tools for each below.

---

## Track A — Realistic anatomy & muscle targets (still images)

Replaces the flat SVG diagram with an écorché muscle-map (cyan primary / purple secondary / gold stabilizer is a clean medical convention).

| Tool | API / MCP | Cost | Notes |
|---|---|---|---|
| **Flux (Black Forest Labs)** | Public API (our `scripts/flux-generate.js`) | **~$0.05 / image** | **Already integrated.** ⚠️ **TESTED 2026-07-10 — NOT suitable for accurate muscle maps.** Flux renders beautiful anatomical figures but cannot fill *specific named muscles* with *specific colors* (it produces decorative red/orange glow streaks regardless of the prompt). Great for decorative heroes; unreliable/inaccurate for muscle targeting. |
| **Nano Banana Pro (Google, via fal MCP)** | fal `fal-ai/nano-banana-pro` | ~$0.10–0.15 / image | ✅ **TESTED 2026-07-11 — SOLVES the muscle-map problem.** Correctly paints *named muscles* in *named colors* (cyan quads/glutes, violet hams/calves, gold abs/lower back) on écorché figures, front+back in one image. First success: `art/fal/squat-muscles-v2.png` → shipped as the Barbell Squat "Targets" panel (`app/assets/muscles/ex_001.jpg`, registry `src/data/exerciseMuscleArt.ts`). Prompt tip: say "flat full-bleed illustration, no device, no frame" or it renders a tablet mockup. |
| **BioDigital Human** | Public API | Free dev tier; **commercial = premium/enterprise** | **Medical-grade interactive 3D anatomy** with real muscle systems. The standout for the **PT/OT / therapy** segment — clinical credibility consumer apps lack. |
| **Sketchfab** | Public Download API | Many **free** CC-licensed anatomy models | Source a real muscular-anatomy model to render/highlight yourself. |

## Track B — Real animated 3D mannequin (per-exercise motion)

Keeps the existing **three.js + expo-gl** renderer (free; already supports rigged GLB + skeletal animation). Needs two assets: a **rigged model** + **per-exercise animation clips**.

| Tool | API / MCP | Cost | Role |
|---|---|---|---|
| **Blender + Blender-MCP** | **MCP connector for Claude** | **Free** | Standout MCP option: Claude can drive Blender to rig, animate, render, or export GLB. Most control, fully free. |
| **Mixamo (Adobe)** | No API (manual download) | **Free** | Free rigged characters + big mocap library (squats, lunges, presses). Classic free source. |
| **Ready Player Me** | Public API/SDK | **Free** tier | Instant rigged avatars via API — but stylized, not anatomical. |
| **Meshy AI** | Public API | Freemium, ~**$16–20/mo** | Image/text→3D with **auto-rig + animation**. Custom branded mannequin via API. |
| **Tripo AI / Rodin (Hyper3D)** | Public API | Credit-based, low | Text/image→3D model generation. |
| **DeepMotion (Animate 3D)** | Public API | ~**$12–20/mo** | **Video→3D mocap** + text-to-motion — precise exercise animations from reference clips. Best for form accuracy at scale. |

**Live muscle highlighting** (glowing working muscles on the moving 3D model) needs a model with segmented, named muscle meshes — **BioDigital** or a Sketchfab anatomy model.

---

## Cost tiers

- **Free:** three.js (have it), **Blender + Blender-MCP**, Mixamo, Ready Player Me, Sketchfab CC models.
- **Very low:** **Flux** (~$0.05/image, already wired), Meshy/Tripo/DeepMotion (~$12–20/mo).
- **Premium:** BioDigital Human (commercial) — uniquely valuable for the medical/therapy market.

## On MCP connectors
Only **Blender-MCP** is a true Claude MCP connector here. Everything else is a **public REST API** — not a blocker: any of them can be wrapped in a small integration script exactly like `scripts/flux-generate.js`. "Public API" and "usable by us" are equivalent in practice.

---

## Recommended sequence for this app

1. **Now, near-free:** Use **Flux** (integrated) to upgrade the **anatomy/target panels** to the écorché look — pennies per exercise, immediate visual jump. _(In progress — Track A #1.)_
2. **Next, free-but-effort:** Upgrade the live demo to a **real rigged character** via **Blender-MCP** (Claude-driven) or **Mixamo** (free clips) → export GLB → play in the existing three.js renderer. Start with the top ~10 exercises. _(**In progress — Track B #2.** First asset shipped: `app/assets/models/mannequin-squat.glb` — an **anatomical human figure holding a barbell** (19-bone rig, ellipsoid muscle masses, cyan quads/glutes + purple hams/calves, bar skinned to the chest) doing a looping 2s **front-rack** squat, built in Blender-MCP. (Behind-neck back-squat grip wasn't feasible with this shoulder rig without the bar clipping the torso — front rack reads cleanly.) Source: `art/blender/mannequin-rig.blend`. Player wired into `ExerciseDemoScene` via `mannequin/loadExerciseGlb.ts` + `THREE.AnimationMixer`, gated by `hasExerciseGlb(key)` with the procedural rig as a guaranteed fallback. Verified: GLTFLoader parse + mixer playback headless, typecheck, motion tests, **and live on web** (expo web preview → Barbell Squat → GLB loads + plays the rep, no errors). **Pending: native (Android/iOS expo-gl) smoke test** (file:// GLB load on device). Next exercises reuse the same `.blend` rig — re-pose, re-export, register the module in `loadExerciseGlb.ts`.)_
3. **PT/OT differentiator:** evaluate **BioDigital Human API** for medical-grade interactive anatomy — a feature Hevy/Strong don't have.
4. **Scale precise animations (50+ exercises):** **DeepMotion** (video→motion) or **Meshy** (API rig+animate) — low monthly, automatable.

## Setup note for Track B (Blender-MCP)
Blender-MCP is not a hosted service — it runs locally:
1. Install **Blender** (free, blender.org).
2. Install the **blender-mcp** server + its Blender add-on (open-source).
3. Connect it as an MCP server to Claude.
Once connected, Claude can build/rig/animate a figure and export a GLB for the app. Until then, the app-side GLB animation player can be scaffolded and an interim asset sourced from Mixamo.
