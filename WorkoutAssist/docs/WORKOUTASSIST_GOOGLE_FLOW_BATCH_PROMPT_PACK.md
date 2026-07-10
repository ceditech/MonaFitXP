# WorkoutAssist / MonaFitXP — Google Flow Batch Prompt Pack

_35 exercises × 3 prompts = 105 ready-to-use prompts._

This prompt pack is designed for Google Flow, GPT image generation, or an MCP-driven image generation workflow. It creates a consistent 3D visual language for WorkoutAssist exercise education, exercise detail screens, and future animation planning.

## Global Style Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.
```

## Negative Prompt

```text
Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

## Recommended Output Folder

```text
app/assets/exercises/generated-3d/<exercise-slug>/
```

## Prompt Index

| # | ID | Status | Exercise | Group | Equipment | Animation Key |
|---:|---|---|---|---|---|---|
| 1 | `p1` | proposed | Romanian Deadlift (RDL) | Legs | Barbell | `deadlift` |
| 2 | `p2` | proposed | Hip Thrust | Legs | Barbell, Bench | `hipThrust` |
| 3 | `p3` | proposed | Incline Bench Press | Chest | Barbell, Bench | `benchPress` |
| 4 | `p4` | proposed | Barbell Row | Back | Barbell | `row` |
| 5 | `p5` | proposed | Dips | Chest | Parallel bars | `pushup` |
| 6 | `p6` | proposed | Leg Extension | Legs | Machine | `legExtension` |
| 7 | `p7` | proposed | Hanging Leg Raise | Core | Pull up bar | `crunch` |
| 8 | `p8` | proposed | Russian Twist | Core | Bodyweight or weight plate | `crunch` |
| 9 | `p9` | proposed | Pallof Press | Core | Cable or resistance band | `pallof` |
| 10 | `p10` | proposed | Side Plank | Core | Bodyweight | `plank` |
| 11 | `p11` | proposed | Bulgarian Split Squat | Legs | Dumbbell, Bench | `lunge` |
| 12 | `p12` | proposed | Farmer's Carry | Full Body | Dumbbell or kettlebell | `carry` |
| 13 | `p13` | proposed | Kettlebell Swing | Full Body | Kettlebell | `deadlift` |
| 14 | `p14` | proposed | Goblet Squat | Legs | Dumbbell or kettlebell | `squat` |
| 15 | `p15` | proposed | Banded Hip Abduction | Legs | Resistance band | `hipAbduction` |
| 16 | `ex_001` | implemented | Barbell Squat | Legs | Barbell | `squat` |
| 17 | `ex_002` | implemented | Bench Press | Chest | Barbell | `benchPress` |
| 18 | `ex_003` | implemented | Deadlift | Back | Barbell | `deadlift` |
| 19 | `ex_004` | implemented | Overhead Press | Shoulders | Barbell | `overheadPress` |
| 20 | `ex_005` | implemented | Pull Up | Back | Pull up bar | `pullup` |
| 21 | `ex_006` | implemented | Dumbbell Row | Back | Dumbbell, Bench | `row` |
| 22 | `ex_007` | implemented | Lunge | Legs | Bodyweight | `lunge` |
| 23 | `ex_008` | implemented | Push Up | Chest | Bodyweight | `pushup` |
| 24 | `ex_009` | implemented | Plank | Core | Bodyweight | `plank` |
| 25 | `ex_010` | implemented | Bicep Curl | Arms | Dumbbell | `curl` |
| 26 | `ex_011` | implemented | Tricep Extension | Arms | Cable | `overheadPress` |
| 27 | `ex_012` | implemented | Leg Press | Legs | Machine | `squat` |
| 28 | `ex_013` | implemented | Lat Pulldown | Back | Cable | `pullup` |
| 29 | `ex_014` | implemented | Seated Row | Back | Cable | `row` |
| 30 | `ex_015` | implemented | Face Pull | Shoulders | Cable | `row` |
| 31 | `ex_016` | implemented | Calf Raise | Legs | Machine | `calfRaise` |
| 32 | `ex_017` | implemented | Hamstring Curl | Legs | Machine | `deadlift` |
| 33 | `ex_018` | implemented | Lateral Raise | Shoulders | Dumbbell | `lateralRaise` |
| 34 | `ex_019` | implemented | Box Jump | Legs | Box | `jumpingJack` |
| 35 | `ex_020` | implemented | Burpee | Full Body | Bodyweight | `jumpingJack` |

---

## 1. Romanian Deadlift (RDL) (`p1`)

**Status:** proposed  
**Group:** Legs  
**Equipment:** Barbell  
**Difficulty:** Intermediate  
**Animation key:** `deadlift`

**Suggested files**
- `p1_romanian-deadlift-rdl_storyboard_v1.png` (storyboard)
- `p1_romanian-deadlift-rdl_hero_v1.png` (hero)
- `p1_romanian-deadlift-rdl_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Romanian Deadlift (RDL).
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Romanian Deadlift (RDL): start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Romanian Deadlift (RDL). Use 3/4 side view. Highlight primary muscles (Hamstrings, Glutes) in luminous cyan / aqua-blue, secondary muscles (Spinal erectors, core, forearms) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: hip hinge, bar close to legs, neutral spine, soft knees, no lower-back rounding. Difficulty level: Intermediate. Muscle group: Legs. Existing/proposed animation key: deadlift.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Romanian Deadlift (RDL).
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Romanian Deadlift (RDL). Use 3/4 side view. Highlight primary muscles (Hamstrings, Glutes) in luminous cyan / aqua-blue, secondary muscles (Spinal erectors, core, forearms) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: hip hinge, bar close to legs, neutral spine, soft knees, no lower-back rounding. Difficulty level: Intermediate. Muscle group: Legs. Existing/proposed animation key: deadlift.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Romanian Deadlift (RDL).
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Romanian Deadlift (RDL), focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 side view. Highlight primary muscles (Hamstrings, Glutes) in luminous cyan / aqua-blue, secondary muscles (Spinal erectors, core, forearms) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: hip hinge, bar close to legs, neutral spine, soft knees, no lower-back rounding. Difficulty level: Intermediate. Muscle group: Legs. Existing/proposed animation key: deadlift.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 2. Hip Thrust (`p2`)

**Status:** proposed  
**Group:** Legs  
**Equipment:** Barbell, Bench  
**Difficulty:** Beginner  
**Animation key:** `hipThrust`

**Suggested files**
- `p2_hip-thrust_storyboard_v1.png` (storyboard)
- `p2_hip-thrust_hero_v1.png` (hero)
- `p2_hip-thrust_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Hip Thrust.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Hip Thrust: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Hip Thrust. Use side view. Highlight primary muscles (Glutes, Hamstrings) in luminous cyan / aqua-blue, secondary muscles (Core, adductors, lower-back stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell, Bench. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: ribs down, chin tucked, glutes squeezed, shins vertical at top. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: hipThrust.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Hip Thrust.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Hip Thrust. Use side view. Highlight primary muscles (Glutes, Hamstrings) in luminous cyan / aqua-blue, secondary muscles (Core, adductors, lower-back stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell, Bench. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: ribs down, chin tucked, glutes squeezed, shins vertical at top. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: hipThrust.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Hip Thrust.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Hip Thrust, focused on the target region and showing how the highlighted muscles support the movement. Use side view. Highlight primary muscles (Glutes, Hamstrings) in luminous cyan / aqua-blue, secondary muscles (Core, adductors, lower-back stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell, Bench. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: ribs down, chin tucked, glutes squeezed, shins vertical at top. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: hipThrust.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 3. Incline Bench Press (`p3`)

**Status:** proposed  
**Group:** Chest  
**Equipment:** Barbell, Bench  
**Difficulty:** Intermediate  
**Animation key:** `benchPress`

**Suggested files**
- `p3_incline-bench-press_storyboard_v1.png` (storyboard)
- `p3_incline-bench-press_hero_v1.png` (hero)
- `p3_incline-bench-press_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Incline Bench Press.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Incline Bench Press: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Incline Bench Press. Use elevated 3/4 front view. Highlight primary muscles (Upper Chest, Shoulders, Triceps) in luminous cyan / aqua-blue, secondary muscles (Scapular stabilizers, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell, Bench. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: moderate incline, shoulder blades retracted, elbows tucked around 45 degrees. Difficulty level: Intermediate. Muscle group: Chest. Existing/proposed animation key: benchPress.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Incline Bench Press.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Incline Bench Press. Use elevated 3/4 front view. Highlight primary muscles (Upper Chest, Shoulders, Triceps) in luminous cyan / aqua-blue, secondary muscles (Scapular stabilizers, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell, Bench. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: moderate incline, shoulder blades retracted, elbows tucked around 45 degrees. Difficulty level: Intermediate. Muscle group: Chest. Existing/proposed animation key: benchPress.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Incline Bench Press.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Incline Bench Press, focused on the target region and showing how the highlighted muscles support the movement. Use elevated 3/4 front view. Highlight primary muscles (Upper Chest, Shoulders, Triceps) in luminous cyan / aqua-blue, secondary muscles (Scapular stabilizers, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell, Bench. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: moderate incline, shoulder blades retracted, elbows tucked around 45 degrees. Difficulty level: Intermediate. Muscle group: Chest. Existing/proposed animation key: benchPress.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 4. Barbell Row (`p4`)

**Status:** proposed  
**Group:** Back  
**Equipment:** Barbell  
**Difficulty:** Intermediate  
**Animation key:** `row`

**Suggested files**
- `p4_barbell-row_storyboard_v1.png` (storyboard)
- `p4_barbell-row_hero_v1.png` (hero)
- `p4_barbell-row_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Barbell Row.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Barbell Row: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Barbell Row. Use 3/4 rear-side view. Highlight primary muscles (Back, Biceps) in luminous cyan / aqua-blue, secondary muscles (Rear delts, core, spinal erectors) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: fixed torso angle, flat back, bar path to lower ribs, no heaving. Difficulty level: Intermediate. Muscle group: Back. Existing/proposed animation key: row.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Barbell Row.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Barbell Row. Use 3/4 rear-side view. Highlight primary muscles (Back, Biceps) in luminous cyan / aqua-blue, secondary muscles (Rear delts, core, spinal erectors) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: fixed torso angle, flat back, bar path to lower ribs, no heaving. Difficulty level: Intermediate. Muscle group: Back. Existing/proposed animation key: row.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Barbell Row.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Barbell Row, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 rear-side view. Highlight primary muscles (Back, Biceps) in luminous cyan / aqua-blue, secondary muscles (Rear delts, core, spinal erectors) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: fixed torso angle, flat back, bar path to lower ribs, no heaving. Difficulty level: Intermediate. Muscle group: Back. Existing/proposed animation key: row.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 5. Dips (`p5`)

**Status:** proposed  
**Group:** Chest  
**Equipment:** Parallel bars  
**Difficulty:** Intermediate  
**Animation key:** `pushup`

**Suggested files**
- `p5_dips_storyboard_v1.png` (storyboard)
- `p5_dips_hero_v1.png` (hero)
- `p5_dips_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Dips.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Dips: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Dips. Use 3/4 front-side view. Highlight primary muscles (Lower Chest, Triceps, Shoulders) in luminous cyan / aqua-blue, secondary muscles (Core, scapular stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Parallel bars. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: shoulders down, elbows track back, torso slightly forward, avoid excessive depth. Difficulty level: Intermediate. Muscle group: Chest. Existing/proposed animation key: pushup.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Dips.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Dips. Use 3/4 front-side view. Highlight primary muscles (Lower Chest, Triceps, Shoulders) in luminous cyan / aqua-blue, secondary muscles (Core, scapular stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Parallel bars. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: shoulders down, elbows track back, torso slightly forward, avoid excessive depth. Difficulty level: Intermediate. Muscle group: Chest. Existing/proposed animation key: pushup.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Dips.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Dips, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 front-side view. Highlight primary muscles (Lower Chest, Triceps, Shoulders) in luminous cyan / aqua-blue, secondary muscles (Core, scapular stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Parallel bars. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: shoulders down, elbows track back, torso slightly forward, avoid excessive depth. Difficulty level: Intermediate. Muscle group: Chest. Existing/proposed animation key: pushup.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 6. Leg Extension (`p6`)

**Status:** proposed  
**Group:** Legs  
**Equipment:** Machine  
**Difficulty:** Beginner  
**Animation key:** `legExtension`

**Suggested files**
- `p6_leg-extension_storyboard_v1.png` (storyboard)
- `p6_leg-extension_hero_v1.png` (hero)
- `p6_leg-extension_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Leg Extension.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Leg Extension: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Leg Extension. Use front-side 3/4 view. Highlight primary muscles (Quads) in luminous cyan / aqua-blue, secondary muscles (Hip stabilizers, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Machine. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: machine pivot aligned with knee, controlled eccentric, no hard knee snap. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: legExtension.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Leg Extension.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Leg Extension. Use front-side 3/4 view. Highlight primary muscles (Quads) in luminous cyan / aqua-blue, secondary muscles (Hip stabilizers, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Machine. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: machine pivot aligned with knee, controlled eccentric, no hard knee snap. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: legExtension.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Leg Extension.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Leg Extension, focused on the target region and showing how the highlighted muscles support the movement. Use front-side 3/4 view. Highlight primary muscles (Quads) in luminous cyan / aqua-blue, secondary muscles (Hip stabilizers, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Machine. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: machine pivot aligned with knee, controlled eccentric, no hard knee snap. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: legExtension.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 7. Hanging Leg Raise (`p7`)

**Status:** proposed  
**Group:** Core  
**Equipment:** Pull up bar  
**Difficulty:** Intermediate  
**Animation key:** `crunch`

**Suggested files**
- `p7_hanging-leg-raise_storyboard_v1.png` (storyboard)
- `p7_hanging-leg-raise_hero_v1.png` (hero)
- `p7_hanging-leg-raise_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Hanging Leg Raise.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Hanging Leg Raise: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Hanging Leg Raise. Use vertical centered front 3/4 view. Highlight primary muscles (Lower Abs, Hip Flexors) in luminous cyan / aqua-blue, secondary muscles (Grip, shoulders, lats) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Pull up bar. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: pelvis tuck, no swinging, shoulders engaged, controlled descent. Difficulty level: Intermediate. Muscle group: Core. Existing/proposed animation key: crunch.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Hanging Leg Raise.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Hanging Leg Raise. Use vertical centered front 3/4 view. Highlight primary muscles (Lower Abs, Hip Flexors) in luminous cyan / aqua-blue, secondary muscles (Grip, shoulders, lats) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Pull up bar. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: pelvis tuck, no swinging, shoulders engaged, controlled descent. Difficulty level: Intermediate. Muscle group: Core. Existing/proposed animation key: crunch.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Hanging Leg Raise.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Hanging Leg Raise, focused on the target region and showing how the highlighted muscles support the movement. Use vertical centered front 3/4 view. Highlight primary muscles (Lower Abs, Hip Flexors) in luminous cyan / aqua-blue, secondary muscles (Grip, shoulders, lats) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Pull up bar. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: pelvis tuck, no swinging, shoulders engaged, controlled descent. Difficulty level: Intermediate. Muscle group: Core. Existing/proposed animation key: crunch.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 8. Russian Twist (`p8`)

**Status:** proposed  
**Group:** Core  
**Equipment:** Bodyweight or weight plate  
**Difficulty:** Beginner  
**Animation key:** `crunch`

**Suggested files**
- `p8_russian-twist_storyboard_v1.png` (storyboard)
- `p8_russian-twist_hero_v1.png` (hero)
- `p8_russian-twist_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Russian Twist.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Russian Twist: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Russian Twist. Use 3/4 front view. Highlight primary muscles (Obliques, Core) in luminous cyan / aqua-blue, secondary muscles (Hip flexors, rectus abdominis) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight or weight plate. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: rotate from ribcage, back straight, controlled tempo, avoid arm-only swinging. Difficulty level: Beginner. Muscle group: Core. Existing/proposed animation key: crunch.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Russian Twist.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Russian Twist. Use 3/4 front view. Highlight primary muscles (Obliques, Core) in luminous cyan / aqua-blue, secondary muscles (Hip flexors, rectus abdominis) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight or weight plate. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: rotate from ribcage, back straight, controlled tempo, avoid arm-only swinging. Difficulty level: Beginner. Muscle group: Core. Existing/proposed animation key: crunch.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Russian Twist.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Russian Twist, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 front view. Highlight primary muscles (Obliques, Core) in luminous cyan / aqua-blue, secondary muscles (Hip flexors, rectus abdominis) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight or weight plate. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: rotate from ribcage, back straight, controlled tempo, avoid arm-only swinging. Difficulty level: Beginner. Muscle group: Core. Existing/proposed animation key: crunch.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 9. Pallof Press (`p9`)

**Status:** proposed  
**Group:** Core  
**Equipment:** Cable or resistance band  
**Difficulty:** Beginner  
**Animation key:** `pallof`

**Suggested files**
- `p9_pallof-press_storyboard_v1.png` (storyboard)
- `p9_pallof-press_hero_v1.png` (hero)
- `p9_pallof-press_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Pallof Press.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Pallof Press: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Pallof Press. Use 3/4 front-side view. Highlight primary muscles (Core anti-rotation, Obliques) in luminous cyan / aqua-blue, secondary muscles (Shoulders, glutes, stance stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable or resistance band. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: torso square, ribs down, no twisting, cable pulls sideways while body resists. Difficulty level: Beginner. Muscle group: Core. Existing/proposed animation key: pallof.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Pallof Press.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Pallof Press. Use 3/4 front-side view. Highlight primary muscles (Core anti-rotation, Obliques) in luminous cyan / aqua-blue, secondary muscles (Shoulders, glutes, stance stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable or resistance band. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: torso square, ribs down, no twisting, cable pulls sideways while body resists. Difficulty level: Beginner. Muscle group: Core. Existing/proposed animation key: pallof.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Pallof Press.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Pallof Press, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 front-side view. Highlight primary muscles (Core anti-rotation, Obliques) in luminous cyan / aqua-blue, secondary muscles (Shoulders, glutes, stance stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable or resistance band. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: torso square, ribs down, no twisting, cable pulls sideways while body resists. Difficulty level: Beginner. Muscle group: Core. Existing/proposed animation key: pallof.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 10. Side Plank (`p10`)

**Status:** proposed  
**Group:** Core  
**Equipment:** Bodyweight  
**Difficulty:** Beginner  
**Animation key:** `plank`

**Suggested files**
- `p10_side-plank_storyboard_v1.png` (storyboard)
- `p10_side-plank_hero_v1.png` (hero)
- `p10_side-plank_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Side Plank.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Side Plank: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Side Plank. Use side view. Highlight primary muscles (Obliques, Core) in luminous cyan / aqua-blue, secondary muscles (Shoulder stabilizers, glute medius) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: elbow under shoulder, hips high, body straight, no forward rotation. Difficulty level: Beginner. Muscle group: Core. Existing/proposed animation key: plank.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Side Plank.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Side Plank. Use side view. Highlight primary muscles (Obliques, Core) in luminous cyan / aqua-blue, secondary muscles (Shoulder stabilizers, glute medius) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: elbow under shoulder, hips high, body straight, no forward rotation. Difficulty level: Beginner. Muscle group: Core. Existing/proposed animation key: plank.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Side Plank.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Side Plank, focused on the target region and showing how the highlighted muscles support the movement. Use side view. Highlight primary muscles (Obliques, Core) in luminous cyan / aqua-blue, secondary muscles (Shoulder stabilizers, glute medius) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: elbow under shoulder, hips high, body straight, no forward rotation. Difficulty level: Beginner. Muscle group: Core. Existing/proposed animation key: plank.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 11. Bulgarian Split Squat (`p11`)

**Status:** proposed  
**Group:** Legs  
**Equipment:** Dumbbell, Bench  
**Difficulty:** Intermediate  
**Animation key:** `lunge`

**Suggested files**
- `p11_bulgarian-split-squat_storyboard_v1.png` (storyboard)
- `p11_bulgarian-split-squat_hero_v1.png` (hero)
- `p11_bulgarian-split-squat_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Bulgarian Split Squat.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Bulgarian Split Squat: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Bulgarian Split Squat. Use 3/4 side view. Highlight primary muscles (Quads, Glutes) in luminous cyan / aqua-blue, secondary muscles (Hamstrings, calves, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell, Bench. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: front knee tracks over foot, torso tall, vertical descent, stable stride length. Difficulty level: Intermediate. Muscle group: Legs. Existing/proposed animation key: lunge.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Bulgarian Split Squat.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Bulgarian Split Squat. Use 3/4 side view. Highlight primary muscles (Quads, Glutes) in luminous cyan / aqua-blue, secondary muscles (Hamstrings, calves, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell, Bench. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: front knee tracks over foot, torso tall, vertical descent, stable stride length. Difficulty level: Intermediate. Muscle group: Legs. Existing/proposed animation key: lunge.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Bulgarian Split Squat.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Bulgarian Split Squat, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 side view. Highlight primary muscles (Quads, Glutes) in luminous cyan / aqua-blue, secondary muscles (Hamstrings, calves, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell, Bench. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: front knee tracks over foot, torso tall, vertical descent, stable stride length. Difficulty level: Intermediate. Muscle group: Legs. Existing/proposed animation key: lunge.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 12. Farmer's Carry (`p12`)

**Status:** proposed  
**Group:** Full Body  
**Equipment:** Dumbbell or kettlebell  
**Difficulty:** Beginner  
**Animation key:** `carry`

**Suggested files**
- `p12_farmers-carry_storyboard_v1.png` (storyboard)
- `p12_farmers-carry_hero_v1.png` (hero)
- `p12_farmers-carry_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Farmer's Carry.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Farmer's Carry: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Farmer's Carry. Use low 3/4 front view. Highlight primary muscles (Grip/Forearms, Traps, Core, Legs) in luminous cyan / aqua-blue, secondary muscles (Shoulders, upper back, glutes) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell or kettlebell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: shoulders level, ribs down, no side lean, weights do not swing. Difficulty level: Beginner. Muscle group: Full Body. Existing/proposed animation key: carry.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Farmer's Carry.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Farmer's Carry. Use low 3/4 front view. Highlight primary muscles (Grip/Forearms, Traps, Core, Legs) in luminous cyan / aqua-blue, secondary muscles (Shoulders, upper back, glutes) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell or kettlebell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: shoulders level, ribs down, no side lean, weights do not swing. Difficulty level: Beginner. Muscle group: Full Body. Existing/proposed animation key: carry.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Farmer's Carry.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Farmer's Carry, focused on the target region and showing how the highlighted muscles support the movement. Use low 3/4 front view. Highlight primary muscles (Grip/Forearms, Traps, Core, Legs) in luminous cyan / aqua-blue, secondary muscles (Shoulders, upper back, glutes) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell or kettlebell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: shoulders level, ribs down, no side lean, weights do not swing. Difficulty level: Beginner. Muscle group: Full Body. Existing/proposed animation key: carry.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 13. Kettlebell Swing (`p13`)

**Status:** proposed  
**Group:** Full Body  
**Equipment:** Kettlebell  
**Difficulty:** Intermediate  
**Animation key:** `deadlift`

**Suggested files**
- `p13_kettlebell-swing_storyboard_v1.png` (storyboard)
- `p13_kettlebell-swing_hero_v1.png` (hero)
- `p13_kettlebell-swing_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Kettlebell Swing.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Kettlebell Swing: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Kettlebell Swing. Use 3/4 side view. Highlight primary muscles (Glutes, Hamstrings, Core) in luminous cyan / aqua-blue, secondary muscles (Grip, lats, shoulders) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Kettlebell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: hip hinge not squat, arms relaxed, glutes power the bell, neutral spine. Difficulty level: Intermediate. Muscle group: Full Body. Existing/proposed animation key: deadlift.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Kettlebell Swing.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Kettlebell Swing. Use 3/4 side view. Highlight primary muscles (Glutes, Hamstrings, Core) in luminous cyan / aqua-blue, secondary muscles (Grip, lats, shoulders) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Kettlebell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: hip hinge not squat, arms relaxed, glutes power the bell, neutral spine. Difficulty level: Intermediate. Muscle group: Full Body. Existing/proposed animation key: deadlift.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Kettlebell Swing.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Kettlebell Swing, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 side view. Highlight primary muscles (Glutes, Hamstrings, Core) in luminous cyan / aqua-blue, secondary muscles (Grip, lats, shoulders) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Kettlebell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: hip hinge not squat, arms relaxed, glutes power the bell, neutral spine. Difficulty level: Intermediate. Muscle group: Full Body. Existing/proposed animation key: deadlift.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 14. Goblet Squat (`p14`)

**Status:** proposed  
**Group:** Legs  
**Equipment:** Dumbbell or kettlebell  
**Difficulty:** Beginner  
**Animation key:** `squat`

**Suggested files**
- `p14_goblet-squat_storyboard_v1.png` (storyboard)
- `p14_goblet-squat_hero_v1.png` (hero)
- `p14_goblet-squat_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Goblet Squat.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Goblet Squat: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Goblet Squat. Use front 3/4 view. Highlight primary muscles (Quads, Glutes) in luminous cyan / aqua-blue, secondary muscles (Core, upper back, calves) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell or kettlebell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: chest tall, knees track over toes, weight counterbalances, whole-foot pressure. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: squat.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Goblet Squat.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Goblet Squat. Use front 3/4 view. Highlight primary muscles (Quads, Glutes) in luminous cyan / aqua-blue, secondary muscles (Core, upper back, calves) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell or kettlebell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: chest tall, knees track over toes, weight counterbalances, whole-foot pressure. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: squat.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Goblet Squat.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Goblet Squat, focused on the target region and showing how the highlighted muscles support the movement. Use front 3/4 view. Highlight primary muscles (Quads, Glutes) in luminous cyan / aqua-blue, secondary muscles (Core, upper back, calves) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell or kettlebell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: chest tall, knees track over toes, weight counterbalances, whole-foot pressure. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: squat.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 15. Banded Hip Abduction (`p15`)

**Status:** proposed  
**Group:** Legs  
**Equipment:** Resistance band  
**Difficulty:** Beginner  
**Animation key:** `hipAbduction`

**Suggested files**
- `p15_banded-hip-abduction_storyboard_v1.png` (storyboard)
- `p15_banded-hip-abduction_hero_v1.png` (hero)
- `p15_banded-hip-abduction_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Banded Hip Abduction.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Banded Hip Abduction: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Banded Hip Abduction. Use 3/4 front-side view. Highlight primary muscles (Glute Medius, Glutes) in luminous cyan / aqua-blue, secondary muscles (Quads, hip stabilizers, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Resistance band. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: knees do not cave inward, feet forward, lead with heel, hips level. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: hipAbduction.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Banded Hip Abduction.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Banded Hip Abduction. Use 3/4 front-side view. Highlight primary muscles (Glute Medius, Glutes) in luminous cyan / aqua-blue, secondary muscles (Quads, hip stabilizers, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Resistance band. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: knees do not cave inward, feet forward, lead with heel, hips level. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: hipAbduction.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Banded Hip Abduction.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Banded Hip Abduction, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 front-side view. Highlight primary muscles (Glute Medius, Glutes) in luminous cyan / aqua-blue, secondary muscles (Quads, hip stabilizers, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Resistance band. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: knees do not cave inward, feet forward, lead with heel, hips level. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: hipAbduction.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 16. Barbell Squat (`ex_001`)

**Status:** implemented  
**Group:** Legs  
**Equipment:** Barbell  
**Difficulty:** Intermediate  
**Animation key:** `squat`

**Suggested files**
- `ex_001_barbell-squat_storyboard_v1.png` (storyboard)
- `ex_001_barbell-squat_hero_v1.png` (hero)
- `ex_001_barbell-squat_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Barbell Squat.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Barbell Squat: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Barbell Squat. Use 3/4 side-front view. Highlight primary muscles (Quads, Glutes) in luminous cyan / aqua-blue, secondary muscles (Hamstrings, calves, core, lower back) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: mid-foot balance, knees track over toes, chest tall, neutral spine. Difficulty level: Intermediate. Muscle group: Legs. Existing/proposed animation key: squat.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Barbell Squat.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Barbell Squat. Use 3/4 side-front view. Highlight primary muscles (Quads, Glutes) in luminous cyan / aqua-blue, secondary muscles (Hamstrings, calves, core, lower back) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: mid-foot balance, knees track over toes, chest tall, neutral spine. Difficulty level: Intermediate. Muscle group: Legs. Existing/proposed animation key: squat.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Barbell Squat.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Barbell Squat, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 side-front view. Highlight primary muscles (Quads, Glutes) in luminous cyan / aqua-blue, secondary muscles (Hamstrings, calves, core, lower back) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: mid-foot balance, knees track over toes, chest tall, neutral spine. Difficulty level: Intermediate. Muscle group: Legs. Existing/proposed animation key: squat.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 17. Bench Press (`ex_002`)

**Status:** implemented  
**Group:** Chest  
**Equipment:** Barbell  
**Difficulty:** Intermediate  
**Animation key:** `benchPress`

**Suggested files**
- `ex_002_bench-press_storyboard_v1.png` (storyboard)
- `ex_002_bench-press_hero_v1.png` (hero)
- `ex_002_bench-press_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Bench Press.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Bench Press: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Bench Press. Use elevated 3/4 view. Highlight primary muscles (Chest, Triceps) in luminous cyan / aqua-blue, secondary muscles (Anterior deltoids, scapular stabilizers, leg drive) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: feet planted, shoulder blades retracted, elbows around 45 degrees, controlled bar path. Difficulty level: Intermediate. Muscle group: Chest. Existing/proposed animation key: benchPress.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Bench Press.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Bench Press. Use elevated 3/4 view. Highlight primary muscles (Chest, Triceps) in luminous cyan / aqua-blue, secondary muscles (Anterior deltoids, scapular stabilizers, leg drive) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: feet planted, shoulder blades retracted, elbows around 45 degrees, controlled bar path. Difficulty level: Intermediate. Muscle group: Chest. Existing/proposed animation key: benchPress.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Bench Press.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Bench Press, focused on the target region and showing how the highlighted muscles support the movement. Use elevated 3/4 view. Highlight primary muscles (Chest, Triceps) in luminous cyan / aqua-blue, secondary muscles (Anterior deltoids, scapular stabilizers, leg drive) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: feet planted, shoulder blades retracted, elbows around 45 degrees, controlled bar path. Difficulty level: Intermediate. Muscle group: Chest. Existing/proposed animation key: benchPress.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 18. Deadlift (`ex_003`)

**Status:** implemented  
**Group:** Back  
**Equipment:** Barbell  
**Difficulty:** Advanced  
**Animation key:** `deadlift`

**Suggested files**
- `ex_003_deadlift_storyboard_v1.png` (storyboard)
- `ex_003_deadlift_hero_v1.png` (hero)
- `ex_003_deadlift_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Deadlift.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Deadlift: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Deadlift. Use 3/4 side view. Highlight primary muscles (Back, Hamstrings) in luminous cyan / aqua-blue, secondary muscles (Glutes, traps, forearms, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: bar close to shins, lats engaged, neutral spine, glutes lock out. Difficulty level: Advanced. Muscle group: Back. Existing/proposed animation key: deadlift.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Deadlift.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Deadlift. Use 3/4 side view. Highlight primary muscles (Back, Hamstrings) in luminous cyan / aqua-blue, secondary muscles (Glutes, traps, forearms, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: bar close to shins, lats engaged, neutral spine, glutes lock out. Difficulty level: Advanced. Muscle group: Back. Existing/proposed animation key: deadlift.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Deadlift.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Deadlift, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 side view. Highlight primary muscles (Back, Hamstrings) in luminous cyan / aqua-blue, secondary muscles (Glutes, traps, forearms, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: bar close to shins, lats engaged, neutral spine, glutes lock out. Difficulty level: Advanced. Muscle group: Back. Existing/proposed animation key: deadlift.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 19. Overhead Press (`ex_004`)

**Status:** implemented  
**Group:** Shoulders  
**Equipment:** Barbell  
**Difficulty:** Intermediate  
**Animation key:** `overheadPress`

**Suggested files**
- `ex_004_overhead-press_storyboard_v1.png` (storyboard)
- `ex_004_overhead-press_hero_v1.png` (hero)
- `ex_004_overhead-press_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Overhead Press.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Overhead Press: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Overhead Press. Use 3/4 front-side view. Highlight primary muscles (Shoulders) in luminous cyan / aqua-blue, secondary muscles (Triceps, core, glutes, upper chest) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: ribs down, glutes squeezed, head moves through, vertical bar path. Difficulty level: Intermediate. Muscle group: Shoulders. Existing/proposed animation key: overheadPress.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Overhead Press.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Overhead Press. Use 3/4 front-side view. Highlight primary muscles (Shoulders) in luminous cyan / aqua-blue, secondary muscles (Triceps, core, glutes, upper chest) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: ribs down, glutes squeezed, head moves through, vertical bar path. Difficulty level: Intermediate. Muscle group: Shoulders. Existing/proposed animation key: overheadPress.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Overhead Press.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Overhead Press, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 front-side view. Highlight primary muscles (Shoulders) in luminous cyan / aqua-blue, secondary muscles (Triceps, core, glutes, upper chest) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Barbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: ribs down, glutes squeezed, head moves through, vertical bar path. Difficulty level: Intermediate. Muscle group: Shoulders. Existing/proposed animation key: overheadPress.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 20. Pull Up (`ex_005`)

**Status:** implemented  
**Group:** Back  
**Equipment:** Pull up bar  
**Difficulty:** Intermediate  
**Animation key:** `pullup`

**Suggested files**
- `ex_005_pull-up_storyboard_v1.png` (storyboard)
- `ex_005_pull-up_hero_v1.png` (hero)
- `ex_005_pull-up_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Pull Up.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Pull Up: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Pull Up. Use vertical front 3/4 view. Highlight primary muscles (Back, Biceps) in luminous cyan / aqua-blue, secondary muscles (Forearms, core, lower traps) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Pull up bar. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: no swinging, lead with chest, elbows to ribs, full range. Difficulty level: Intermediate. Muscle group: Back. Existing/proposed animation key: pullup.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Pull Up.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Pull Up. Use vertical front 3/4 view. Highlight primary muscles (Back, Biceps) in luminous cyan / aqua-blue, secondary muscles (Forearms, core, lower traps) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Pull up bar. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: no swinging, lead with chest, elbows to ribs, full range. Difficulty level: Intermediate. Muscle group: Back. Existing/proposed animation key: pullup.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Pull Up.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Pull Up, focused on the target region and showing how the highlighted muscles support the movement. Use vertical front 3/4 view. Highlight primary muscles (Back, Biceps) in luminous cyan / aqua-blue, secondary muscles (Forearms, core, lower traps) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Pull up bar. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: no swinging, lead with chest, elbows to ribs, full range. Difficulty level: Intermediate. Muscle group: Back. Existing/proposed animation key: pullup.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 21. Dumbbell Row (`ex_006`)

**Status:** implemented  
**Group:** Back  
**Equipment:** Dumbbell, Bench  
**Difficulty:** Beginner  
**Animation key:** `row`

**Suggested files**
- `ex_006_dumbbell-row_storyboard_v1.png` (storyboard)
- `ex_006_dumbbell-row_hero_v1.png` (hero)
- `ex_006_dumbbell-row_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Dumbbell Row.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Dumbbell Row: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Dumbbell Row. Use 3/4 side view. Highlight primary muscles (Back, Biceps) in luminous cyan / aqua-blue, secondary muscles (Rear delts, core anti-rotation) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell, Bench. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: flat back, torso still, row toward hip, no twisting. Difficulty level: Beginner. Muscle group: Back. Existing/proposed animation key: row.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Dumbbell Row.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Dumbbell Row. Use 3/4 side view. Highlight primary muscles (Back, Biceps) in luminous cyan / aqua-blue, secondary muscles (Rear delts, core anti-rotation) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell, Bench. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: flat back, torso still, row toward hip, no twisting. Difficulty level: Beginner. Muscle group: Back. Existing/proposed animation key: row.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Dumbbell Row.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Dumbbell Row, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 side view. Highlight primary muscles (Back, Biceps) in luminous cyan / aqua-blue, secondary muscles (Rear delts, core anti-rotation) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell, Bench. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: flat back, torso still, row toward hip, no twisting. Difficulty level: Beginner. Muscle group: Back. Existing/proposed animation key: row.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 22. Lunge (`ex_007`)

**Status:** implemented  
**Group:** Legs  
**Equipment:** Bodyweight  
**Difficulty:** Beginner  
**Animation key:** `lunge`

**Suggested files**
- `ex_007_lunge_storyboard_v1.png` (storyboard)
- `ex_007_lunge_hero_v1.png` (hero)
- `ex_007_lunge_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Lunge.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Lunge: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Lunge. Use 3/4 side-front view. Highlight primary muscles (Quads, Glutes) in luminous cyan / aqua-blue, secondary muscles (Hamstrings, calves, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: vertical descent, front knee tracks over toes, torso upright, push through front heel. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: lunge.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Lunge.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Lunge. Use 3/4 side-front view. Highlight primary muscles (Quads, Glutes) in luminous cyan / aqua-blue, secondary muscles (Hamstrings, calves, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: vertical descent, front knee tracks over toes, torso upright, push through front heel. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: lunge.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Lunge.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Lunge, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 side-front view. Highlight primary muscles (Quads, Glutes) in luminous cyan / aqua-blue, secondary muscles (Hamstrings, calves, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: vertical descent, front knee tracks over toes, torso upright, push through front heel. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: lunge.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 23. Push Up (`ex_008`)

**Status:** implemented  
**Group:** Chest  
**Equipment:** Bodyweight  
**Difficulty:** Beginner  
**Animation key:** `pushup`

**Suggested files**
- `ex_008_push-up_storyboard_v1.png` (storyboard)
- `ex_008_push-up_hero_v1.png` (hero)
- `ex_008_push-up_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Push Up.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Push Up: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Push Up. Use low 3/4 side view. Highlight primary muscles (Chest, Triceps) in luminous cyan / aqua-blue, secondary muscles (Anterior deltoids, core, glutes) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: straight line head to heels, elbows around 45 degrees, no sagging hips. Difficulty level: Beginner. Muscle group: Chest. Existing/proposed animation key: pushup.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Push Up.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Push Up. Use low 3/4 side view. Highlight primary muscles (Chest, Triceps) in luminous cyan / aqua-blue, secondary muscles (Anterior deltoids, core, glutes) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: straight line head to heels, elbows around 45 degrees, no sagging hips. Difficulty level: Beginner. Muscle group: Chest. Existing/proposed animation key: pushup.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Push Up.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Push Up, focused on the target region and showing how the highlighted muscles support the movement. Use low 3/4 side view. Highlight primary muscles (Chest, Triceps) in luminous cyan / aqua-blue, secondary muscles (Anterior deltoids, core, glutes) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: straight line head to heels, elbows around 45 degrees, no sagging hips. Difficulty level: Beginner. Muscle group: Chest. Existing/proposed animation key: pushup.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 24. Plank (`ex_009`)

**Status:** implemented  
**Group:** Core  
**Equipment:** Bodyweight  
**Difficulty:** Beginner  
**Animation key:** `plank`

**Suggested files**
- `ex_009_plank_storyboard_v1.png` (storyboard)
- `ex_009_plank_hero_v1.png` (hero)
- `ex_009_plank_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Plank.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Plank: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Plank. Use 3/4 side view. Highlight primary muscles (Core) in luminous cyan / aqua-blue, secondary muscles (Shoulders, glutes, quads, lower back stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: ribs down, glutes squeezed, elbows under shoulders, active brace. Difficulty level: Beginner. Muscle group: Core. Existing/proposed animation key: plank.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Plank.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Plank. Use 3/4 side view. Highlight primary muscles (Core) in luminous cyan / aqua-blue, secondary muscles (Shoulders, glutes, quads, lower back stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: ribs down, glutes squeezed, elbows under shoulders, active brace. Difficulty level: Beginner. Muscle group: Core. Existing/proposed animation key: plank.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Plank.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Plank, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 side view. Highlight primary muscles (Core) in luminous cyan / aqua-blue, secondary muscles (Shoulders, glutes, quads, lower back stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: ribs down, glutes squeezed, elbows under shoulders, active brace. Difficulty level: Beginner. Muscle group: Core. Existing/proposed animation key: plank.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 25. Bicep Curl (`ex_010`)

**Status:** implemented  
**Group:** Arms  
**Equipment:** Dumbbell  
**Difficulty:** Beginner  
**Animation key:** `curl`

**Suggested files**
- `ex_010_bicep-curl_storyboard_v1.png` (storyboard)
- `ex_010_bicep-curl_hero_v1.png` (hero)
- `ex_010_bicep-curl_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Bicep Curl.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Bicep Curl: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Bicep Curl. Use 3/4 front view. Highlight primary muscles (Biceps) in luminous cyan / aqua-blue, secondary muscles (Brachialis, forearms, core posture) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: elbows pinned, no swinging, full extension, squeeze top. Difficulty level: Beginner. Muscle group: Arms. Existing/proposed animation key: curl.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Bicep Curl.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Bicep Curl. Use 3/4 front view. Highlight primary muscles (Biceps) in luminous cyan / aqua-blue, secondary muscles (Brachialis, forearms, core posture) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: elbows pinned, no swinging, full extension, squeeze top. Difficulty level: Beginner. Muscle group: Arms. Existing/proposed animation key: curl.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Bicep Curl.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Bicep Curl, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 front view. Highlight primary muscles (Biceps) in luminous cyan / aqua-blue, secondary muscles (Brachialis, forearms, core posture) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: elbows pinned, no swinging, full extension, squeeze top. Difficulty level: Beginner. Muscle group: Arms. Existing/proposed animation key: curl.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 26. Tricep Extension (`ex_011`)

**Status:** implemented  
**Group:** Arms  
**Equipment:** Cable  
**Difficulty:** Beginner  
**Animation key:** `overheadPress`

**Suggested files**
- `ex_011_tricep-extension_storyboard_v1.png` (storyboard)
- `ex_011_tricep-extension_hero_v1.png` (hero)
- `ex_011_tricep-extension_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Tricep Extension.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Tricep Extension: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Tricep Extension. Use 3/4 side-front view. Highlight primary muscles (Triceps) in luminous cyan / aqua-blue, secondary muscles (Forearms, shoulders, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: elbows fixed at ribs, hinge at elbow only, no shoulder swing. Difficulty level: Beginner. Muscle group: Arms. Existing/proposed animation key: overheadPress.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Tricep Extension.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Tricep Extension. Use 3/4 side-front view. Highlight primary muscles (Triceps) in luminous cyan / aqua-blue, secondary muscles (Forearms, shoulders, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: elbows fixed at ribs, hinge at elbow only, no shoulder swing. Difficulty level: Beginner. Muscle group: Arms. Existing/proposed animation key: overheadPress.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Tricep Extension.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Tricep Extension, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 side-front view. Highlight primary muscles (Triceps) in luminous cyan / aqua-blue, secondary muscles (Forearms, shoulders, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: elbows fixed at ribs, hinge at elbow only, no shoulder swing. Difficulty level: Beginner. Muscle group: Arms. Existing/proposed animation key: overheadPress.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 27. Leg Press (`ex_012`)

**Status:** implemented  
**Group:** Legs  
**Equipment:** Machine  
**Difficulty:** Beginner  
**Animation key:** `squat`

**Suggested files**
- `ex_012_leg-press_storyboard_v1.png` (storyboard)
- `ex_012_leg-press_hero_v1.png` (hero)
- `ex_012_leg-press_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Leg Press.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Leg Press: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Leg Press. Use 3/4 side view. Highlight primary muscles (Quads) in luminous cyan / aqua-blue, secondary muscles (Glutes, calves, hamstrings) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Machine. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: lower back on pad, knees track over toes, stop before hips tuck. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: squat.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Leg Press.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Leg Press. Use 3/4 side view. Highlight primary muscles (Quads) in luminous cyan / aqua-blue, secondary muscles (Glutes, calves, hamstrings) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Machine. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: lower back on pad, knees track over toes, stop before hips tuck. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: squat.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Leg Press.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Leg Press, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 side view. Highlight primary muscles (Quads) in luminous cyan / aqua-blue, secondary muscles (Glutes, calves, hamstrings) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Machine. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: lower back on pad, knees track over toes, stop before hips tuck. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: squat.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 28. Lat Pulldown (`ex_013`)

**Status:** implemented  
**Group:** Back  
**Equipment:** Cable  
**Difficulty:** Beginner  
**Animation key:** `pullup`

**Suggested files**
- `ex_013_lat-pulldown_storyboard_v1.png` (storyboard)
- `ex_013_lat-pulldown_hero_v1.png` (hero)
- `ex_013_lat-pulldown_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Lat Pulldown.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Lat Pulldown: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Lat Pulldown. Use 3/4 front-side view. Highlight primary muscles (Back) in luminous cyan / aqua-blue, secondary muscles (Biceps, forearms, rear delts) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: lead with elbows, chest proud, slight lean, no jerking. Difficulty level: Beginner. Muscle group: Back. Existing/proposed animation key: pullup.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Lat Pulldown.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Lat Pulldown. Use 3/4 front-side view. Highlight primary muscles (Back) in luminous cyan / aqua-blue, secondary muscles (Biceps, forearms, rear delts) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: lead with elbows, chest proud, slight lean, no jerking. Difficulty level: Beginner. Muscle group: Back. Existing/proposed animation key: pullup.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Lat Pulldown.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Lat Pulldown, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 front-side view. Highlight primary muscles (Back) in luminous cyan / aqua-blue, secondary muscles (Biceps, forearms, rear delts) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: lead with elbows, chest proud, slight lean, no jerking. Difficulty level: Beginner. Muscle group: Back. Existing/proposed animation key: pullup.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 29. Seated Row (`ex_014`)

**Status:** implemented  
**Group:** Back  
**Equipment:** Cable  
**Difficulty:** Beginner  
**Animation key:** `row`

**Suggested files**
- `ex_014_seated-row_storyboard_v1.png` (storyboard)
- `ex_014_seated-row_hero_v1.png` (hero)
- `ex_014_seated-row_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Seated Row.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Seated Row: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Seated Row. Use 3/4 front-side view. Highlight primary muscles (Back) in luminous cyan / aqua-blue, secondary muscles (Biceps, rear delts, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: torso upright, elbows back, shoulder blades squeeze, no rocking. Difficulty level: Beginner. Muscle group: Back. Existing/proposed animation key: row.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Seated Row.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Seated Row. Use 3/4 front-side view. Highlight primary muscles (Back) in luminous cyan / aqua-blue, secondary muscles (Biceps, rear delts, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: torso upright, elbows back, shoulder blades squeeze, no rocking. Difficulty level: Beginner. Muscle group: Back. Existing/proposed animation key: row.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Seated Row.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Seated Row, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 front-side view. Highlight primary muscles (Back) in luminous cyan / aqua-blue, secondary muscles (Biceps, rear delts, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: torso upright, elbows back, shoulder blades squeeze, no rocking. Difficulty level: Beginner. Muscle group: Back. Existing/proposed animation key: row.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 30. Face Pull (`ex_015`)

**Status:** implemented  
**Group:** Shoulders  
**Equipment:** Cable  
**Difficulty:** Beginner  
**Animation key:** `row`

**Suggested files**
- `ex_015_face-pull_storyboard_v1.png` (storyboard)
- `ex_015_face-pull_hero_v1.png` (hero)
- `ex_015_face-pull_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Face Pull.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Face Pull: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Face Pull. Use 3/4 front shoulder-level view. Highlight primary muscles (Shoulders, Rear Delts) in luminous cyan / aqua-blue, secondary muscles (Rotator cuff, traps, upper back) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: elbows high, external rotation, rope toward forehead, posture tall. Difficulty level: Beginner. Muscle group: Shoulders. Existing/proposed animation key: row.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Face Pull.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Face Pull. Use 3/4 front shoulder-level view. Highlight primary muscles (Shoulders, Rear Delts) in luminous cyan / aqua-blue, secondary muscles (Rotator cuff, traps, upper back) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: elbows high, external rotation, rope toward forehead, posture tall. Difficulty level: Beginner. Muscle group: Shoulders. Existing/proposed animation key: row.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Face Pull.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Face Pull, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 front shoulder-level view. Highlight primary muscles (Shoulders, Rear Delts) in luminous cyan / aqua-blue, secondary muscles (Rotator cuff, traps, upper back) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Cable. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: elbows high, external rotation, rope toward forehead, posture tall. Difficulty level: Beginner. Muscle group: Shoulders. Existing/proposed animation key: row.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 31. Calf Raise (`ex_016`)

**Status:** implemented  
**Group:** Legs  
**Equipment:** Machine  
**Difficulty:** Beginner  
**Animation key:** `calfRaise`

**Suggested files**
- `ex_016_calf-raise_storyboard_v1.png` (storyboard)
- `ex_016_calf-raise_hero_v1.png` (hero)
- `ex_016_calf-raise_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Calf Raise.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Calf Raise: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Calf Raise. Use lower-body 3/4 side view. Highlight primary muscles (Calves) in luminous cyan / aqua-blue, secondary muscles (Ankle stabilizers, foot muscles) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Machine. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: full stretch, high squeeze, controlled tempo, no bouncing. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: calfRaise.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Calf Raise.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Calf Raise. Use lower-body 3/4 side view. Highlight primary muscles (Calves) in luminous cyan / aqua-blue, secondary muscles (Ankle stabilizers, foot muscles) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Machine. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: full stretch, high squeeze, controlled tempo, no bouncing. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: calfRaise.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Calf Raise.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Calf Raise, focused on the target region and showing how the highlighted muscles support the movement. Use lower-body 3/4 side view. Highlight primary muscles (Calves) in luminous cyan / aqua-blue, secondary muscles (Ankle stabilizers, foot muscles) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Machine. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: full stretch, high squeeze, controlled tempo, no bouncing. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: calfRaise.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 32. Hamstring Curl (`ex_017`)

**Status:** implemented  
**Group:** Legs  
**Equipment:** Machine  
**Difficulty:** Beginner  
**Animation key:** `deadlift`

**Suggested files**
- `ex_017_hamstring-curl_storyboard_v1.png` (storyboard)
- `ex_017_hamstring-curl_hero_v1.png` (hero)
- `ex_017_hamstring-curl_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Hamstring Curl.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Hamstring Curl: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Hamstring Curl. Use 3/4 side view. Highlight primary muscles (Hamstrings) in luminous cyan / aqua-blue, secondary muscles (Calves, glutes, hip stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Machine. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: hips stay down, knee flexion only, slow eccentric. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: deadlift.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Hamstring Curl.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Hamstring Curl. Use 3/4 side view. Highlight primary muscles (Hamstrings) in luminous cyan / aqua-blue, secondary muscles (Calves, glutes, hip stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Machine. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: hips stay down, knee flexion only, slow eccentric. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: deadlift.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Hamstring Curl.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Hamstring Curl, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 side view. Highlight primary muscles (Hamstrings) in luminous cyan / aqua-blue, secondary muscles (Calves, glutes, hip stabilizers) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Machine. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: hips stay down, knee flexion only, slow eccentric. Difficulty level: Beginner. Muscle group: Legs. Existing/proposed animation key: deadlift.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 33. Lateral Raise (`ex_018`)

**Status:** implemented  
**Group:** Shoulders  
**Equipment:** Dumbbell  
**Difficulty:** Beginner  
**Animation key:** `lateralRaise`

**Suggested files**
- `ex_018_lateral-raise_storyboard_v1.png` (storyboard)
- `ex_018_lateral-raise_hero_v1.png` (hero)
- `ex_018_lateral-raise_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Lateral Raise.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Lateral Raise: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Lateral Raise. Use 3/4 front view. Highlight primary muscles (Shoulders) in luminous cyan / aqua-blue, secondary muscles (Upper traps, supraspinatus, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: lead with elbows, wrists neutral, slight elbow bend, no swinging. Difficulty level: Beginner. Muscle group: Shoulders. Existing/proposed animation key: lateralRaise.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Lateral Raise.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Lateral Raise. Use 3/4 front view. Highlight primary muscles (Shoulders) in luminous cyan / aqua-blue, secondary muscles (Upper traps, supraspinatus, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: lead with elbows, wrists neutral, slight elbow bend, no swinging. Difficulty level: Beginner. Muscle group: Shoulders. Existing/proposed animation key: lateralRaise.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Lateral Raise.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Lateral Raise, focused on the target region and showing how the highlighted muscles support the movement. Use 3/4 front view. Highlight primary muscles (Shoulders) in luminous cyan / aqua-blue, secondary muscles (Upper traps, supraspinatus, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Dumbbell. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: lead with elbows, wrists neutral, slight elbow bend, no swinging. Difficulty level: Beginner. Muscle group: Shoulders. Existing/proposed animation key: lateralRaise.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 34. Box Jump (`ex_019`)

**Status:** implemented  
**Group:** Legs  
**Equipment:** Box  
**Difficulty:** Intermediate  
**Animation key:** `jumpingJack`

**Suggested files**
- `ex_019_box-jump_storyboard_v1.png` (storyboard)
- `ex_019_box-jump_hero_v1.png` (hero)
- `ex_019_box-jump_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Box Jump.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Box Jump: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Box Jump. Use low 3/4 front-side view. Highlight primary muscles (Legs) in luminous cyan / aqua-blue, secondary muscles (Glutes, calves, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Box. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: land soft, knees track, step down safely, control impact. Difficulty level: Intermediate. Muscle group: Legs. Existing/proposed animation key: jumpingJack.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Box Jump.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Box Jump. Use low 3/4 front-side view. Highlight primary muscles (Legs) in luminous cyan / aqua-blue, secondary muscles (Glutes, calves, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Box. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: land soft, knees track, step down safely, control impact. Difficulty level: Intermediate. Muscle group: Legs. Existing/proposed animation key: jumpingJack.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Box Jump.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Box Jump, focused on the target region and showing how the highlighted muscles support the movement. Use low 3/4 front-side view. Highlight primary muscles (Legs) in luminous cyan / aqua-blue, secondary muscles (Glutes, calves, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Box. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: land soft, knees track, step down safely, control impact. Difficulty level: Intermediate. Muscle group: Legs. Existing/proposed animation key: jumpingJack.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

---

## 35. Burpee (`ex_020`)

**Status:** implemented  
**Group:** Full Body  
**Equipment:** Bodyweight  
**Difficulty:** Intermediate  
**Animation key:** `jumpingJack`

**Suggested files**
- `ex_020_burpee_storyboard_v1.png` (storyboard)
- `ex_020_burpee_hero_v1.png` (hero)
- `ex_020_burpee_muscle_closeup_v1.png` (muscleCloseup)

### Storyboard Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Burpee.
Asset type: STORYBOARD IMAGE for animation planning and coaching education.

Create a 4-panel vertical storyboard showing the Burpee: start position, mid-motion phase, peak/contraction position, and a close-up anatomy panel for Burpee. Use multi-frame vertical 3/4 view. Highlight primary muscles (Full Body) in luminous cyan / aqua-blue, secondary muscles (Chest, shoulders, quads, glutes, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: brace during kickback, soft landing, controlled pacing, maintain form under fatigue. Difficulty level: Intermediate. Muscle group: Full Body. Existing/proposed animation key: jumpingJack.

Add clear panel separation, motion arrows, and a small clean coaching cue area. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Hero Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Burpee.
Asset type: HERO IMAGE for the Exercise Detail screen and Workout Player.

Create one powerful, clean 3D hero frame showing the most recognizable and educational position of the Burpee. Use multi-frame vertical 3/4 view. Highlight primary muscles (Full Body) in luminous cyan / aqua-blue, secondary muscles (Chest, shoulders, quads, glutes, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: brace during kickback, soft landing, controlled pacing, maintain form under fatigue. Difficulty level: Intermediate. Muscle group: Full Body. Existing/proposed animation key: jumpingJack.

Keep the mannequin centered with enough negative space for app UI overlays such as set count, timer, form cue chip, or loading state. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```

### Muscle Close-up Prompt

```text
Create a premium 3D fitness-app exercise visualization for WorkoutAssist / MonaFitXP. Use a realistic but clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface, visible but tasteful muscle definition, no facial distraction, no logo, no watermark, no brand text.

Use an original WorkoutAssist color palette that is intentionally different from the provided references:
- Primary working muscles glow in luminous cyan / aqua-blue.
- Secondary muscles glow in deep violet / indigo.
- Stabilizer muscles glow in soft gold.
- Joint-safety alignment guides use thin white-blue lines.
- Motion paths use ultraviolet and electric blue arcs.
- Avoid red/orange/green muscle-highlight colors.

Scene style: vertical 9:16 mobile-first composition, dark graphite-to-midnight-blue studio background, premium cinematic lighting, subtle floor reflection, clean gym environment, realistic equipment scale, no clutter. The image should feel like a high-end fitness coaching app asset.

Quality requirements: ultra-detailed 3D render, sharp anatomy, correct joint positions, safe exercise form, realistic equipment, clear movement mechanics, and enough negative space for future app overlays.

Exercise: Burpee.
Asset type: MUSCLE CLOSE-UP IMAGE for anatomy education and premium coaching overlays.

Create a detailed 3D anatomy close-up for the Burpee, focused on the target region and showing how the highlighted muscles support the movement. Use multi-frame vertical 3/4 view. Highlight primary muscles (Full Body) in luminous cyan / aqua-blue, secondary muscles (Chest, shoulders, quads, glutes, core) in deep violet / indigo, and stabilizers in soft gold. Equipment must be realistic and properly scaled: Bodyweight. Add tasteful ultraviolet/electric-blue motion guides and thin white-blue alignment lines that teach safe technique.

Coaching accuracy requirements: brace during kickback, soft landing, controlled pacing, maintain form under fatigue. Difficulty level: Intermediate. Muscle group: Full Body. Existing/proposed animation key: jumpingJack.

Include a small inset or partial-body context view linking the close-up to the actual exercise. The result should be polished, modern, animation-ready, mobile-first, and suitable for a competitive fitness app.

Negative prompt: bad anatomy, distorted limbs, extra fingers, broken joints, unsafe exercise form, incorrect equipment use, messy background, unreadable labels, watermarks, brand logos, red/orange/green muscle highlights, cartoon style, exaggerated bodybuilder proportions, cropped limbs, low-resolution textures, confusing camera angles.
```
