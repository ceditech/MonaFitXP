# WorkoutAssist — Exercise Catalog Reference

This document has two parts:

- **Part 1 — Proposed Exercises (🔴 NOT YET IMPLEMENTED).** 15 candidate additions that close gaps versus competitors (posterior chain, full core, single-leg, carries, mobility/health). These are **not** in the app, the seed data, or the animation registry yet — they are a curated proposal for review.
- **Part 2 — Implemented Catalog (✅ live).** The 20 exercises currently seeded in `app/src/data/mocks/exerciseCatalog.json` (this half is generated from that file; last synced 2026-07-09).

> ⚠️ Everything under **Part 1** is a proposal only. Nothing there ships until it is added to the catalog JSON (and, where noted, given a new animation clip / equipment type).

---

# Part 1 — Proposed Exercises 🔴 (Not Yet Implemented)

_These 15 are recommendations, not live features. Each lists a **Status: 🔴 Proposed** row, plus an implementation note where a new animation clip or equipment type would be required. Animation keys marked "(reuses existing clip)" could ship with zero new 3D work via the existing `inferAnimationKey` mapping._

## Proposed — Contents

| # | Exercise | Primary Muscles | Difficulty | Fills Gap |
|---|----------|-----------------|-----------|-----------|
| P1 | [Romanian Deadlift (RDL)](#romanian-deadlift-rdl-proposed) | Hamstrings, Glutes | Intermediate | Hip hinge / posterior chain |
| P2 | [Hip Thrust](#hip-thrust-proposed) | Glutes, Hamstrings | Beginner | Glute loading (spine-friendly) |
| P3 | [Incline Bench Press](#incline-bench-press-proposed) | Upper Chest, Shoulders | Intermediate | Upper-chest development |
| P4 | [Barbell Row](#barbell-row-proposed) | Back, Biceps | Intermediate | Heavy bilateral horizontal pull |
| P5 | [Dips](#dips-proposed) | Lower Chest, Triceps | Intermediate | Compound pressing volume |
| P6 | [Leg Extension](#leg-extension-proposed) | Quads | Beginner | Direct quad isolation |
| P7 | [Hanging Leg Raise](#hanging-leg-raise-proposed) | Lower Abs, Hip Flexors | Intermediate | Dynamic core flexion |
| P8 | [Russian Twist](#russian-twist-proposed) | Obliques | Beginner | Core rotation |
| P9 | [Pallof Press](#pallof-press-proposed) | Core (anti-rotation) | Beginner | Anti-rotation (spine-sparing) |
| P10 | [Side Plank](#side-plank-proposed) | Obliques | Beginner | Anti-lateral-flexion core |
| P11 | [Bulgarian Split Squat](#bulgarian-split-squat-proposed) | Quads, Glutes | Intermediate | Single-leg strength/balance |
| P12 | [Farmer's Carry](#farmers-carry-proposed) | Grip, Traps, Core | Beginner | Loaded carry / grip (longevity) |
| P13 | [Kettlebell Swing](#kettlebell-swing-proposed) | Glutes, Hamstrings | Intermediate | Explosive hinge + conditioning |
| P14 | [Goblet Squat](#goblet-squat-proposed) | Quads, Glutes | Beginner | Beginner-safe squat entry |
| P15 | [Banded Hip Abduction](#banded-hip-abduction-proposed) | Glute Medius | Beginner | Hip/knee stability (prehab) |

---

## Romanian Deadlift (RDL) 🔴 Proposed

A hip-hinge movement performed with a controlled eccentric and minimal knee bend, lowering the bar along the thighs to a deep hamstring stretch just past the knees. It is the premier hamstring and glute developer, and it teaches the hip-hinge pattern that protects the lower back in everyday lifting.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Hamstrings, Glutes |
| **Muscle group** | Legs |
| **Type** | Weighted |
| **Equipment** | Barbell |
| **Difficulty** | Intermediate |
| **Proposed animation** | `deadlift` (reuses existing clip) |

**How to perform**

1. Stand tall holding a barbell against your thighs, feet hip-width apart, knees softly bent.
2. Push your hips straight back, keeping the bar dragging down the front of your legs.
3. Lower until you feel a strong stretch in your hamstrings — roughly mid-shin — with your back flat.
4. Keep the bar close and your spine neutral; stop the moment your lower back wants to round.
5. Drive your hips forward to stand tall, squeezing your glutes at the top.

> 💡 **Pro tip:** The movement comes from your hips, not your waist — think "push the wall behind you with your glutes," and let hamstring flexibility (not your back) set your depth.

---

## Hip Thrust 🔴 Proposed

A horizontal glute-loading exercise with your upper back on a bench and a barbell over the hips, driving to full hip extension. It loads the glutes harder than almost any other movement while sparing the lower back, making it a modern staple for both aesthetics and hip health.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Glutes, Hamstrings |
| **Muscle group** | Legs |
| **Type** | Weighted |
| **Equipment** | Barbell, Bench |
| **Difficulty** | Beginner |
| **Proposed animation** | `hipThrust` — **new clip recommended** (falls back to `generic`) |

**How to perform**

1. Sit on the floor with your upper back against a bench and a padded barbell over your hips.
2. Plant your feet flat, shoulder-width, so your shins are roughly vertical at the top of the rep.
3. Brace your core, tuck your chin, and drive through your heels to lift your hips.
4. Extend until your torso and thighs form a straight line, squeezing your glutes hard.
5. Lower under control until your hips are just above the floor, then repeat.

> 💡 **Pro tip:** Finish with your ribs down and glutes squeezed (a slight posterior tilt) rather than arching your lower back to reach the top.

---

## Incline Bench Press 🔴 Proposed

A pressing variation on a bench set to roughly 30–45°, shifting emphasis onto the upper chest and front delts. It fills the most common gap left by flat benching and builds a fuller, more balanced chest.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Upper Chest, Shoulders, Triceps |
| **Muscle group** | Chest |
| **Type** | Weighted |
| **Equipment** | Barbell, Bench |
| **Difficulty** | Intermediate |
| **Proposed animation** | `benchPress` (reuses existing clip) |

**How to perform**

1. Set the bench to about 30–45 degrees and lie back with your eyes under the bar.
2. Grip slightly wider than shoulder width and retract your shoulder blades.
3. Unrack the bar and hold it over your upper chest with straight arms.
4. Lower under control to just below your collarbone, elbows tucked to about 45 degrees.
5. Press back up and slightly back until your arms lock out.

> 💡 **Pro tip:** Keep the incline moderate — too steep turns it into a shoulder press and steals the work from your chest.

---

## Barbell Row 🔴 Proposed

A heavy bilateral horizontal pull performed bent at the hips, rowing a barbell to the lower ribs. It is a primary builder of mid-back thickness and overall pulling strength, complementing the lighter dumbbell and cable rows already in the catalog.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Back, Biceps |
| **Muscle group** | Back |
| **Type** | Weighted |
| **Equipment** | Barbell |
| **Difficulty** | Intermediate |
| **Proposed animation** | `row` (reuses existing clip) |

**How to perform**

1. Stand with feet hip-width apart and hinge forward to about a 45-degree torso angle, back flat.
2. Grip the bar just outside your knees with your arms hanging straight.
3. Brace hard and pull the bar toward your lower ribs, leading with your elbows.
4. Squeeze your shoulder blades together at the top.
5. Lower under control to a full stretch without letting your torso rise.

> 💡 **Pro tip:** Keep your torso angle fixed — if you're heaving upright to move the bar, the weight is too heavy and your lower back is doing the work.

---

## Dips 🔴 Proposed

A compound bodyweight press on parallel bars. Leaning the torso forward emphasizes the chest; staying upright emphasizes the triceps. Highly scalable (assisted to weighted) and joint-friendly when performed with control.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Lower Chest, Triceps, Shoulders |
| **Muscle group** | Chest |
| **Type** | Bodyweight |
| **Equipment** | Parallel bars (**new equipment type**) |
| **Difficulty** | Intermediate |
| **Proposed animation** | `pushup` (reuses existing clip) |

**How to perform**

1. Grip parallel bars and support yourself with arms straight and shoulders pulled down.
2. Lean your torso slightly forward and bend your elbows to lower.
3. Descend until your shoulders are roughly level with your elbows.
4. Keep your elbows tracking back rather than flaring wide.
5. Press back up powerfully to full arm extension.

> 💡 **Pro tip:** Don't sink past a comfortable shoulder stretch — extra depth stresses the shoulder joint for little added benefit.

---

## Leg Extension 🔴 Proposed

A seated machine isolation extending the knee against a padded roller. It targets the quads directly with no balance or lower-back demand, making it ideal for hypertrophy volume and controlled, rehab-style work.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Quads |
| **Muscle group** | Legs |
| **Type** | Weighted |
| **Equipment** | Machine |
| **Difficulty** | Beginner |
| **Proposed animation** | `legExtension` — **new clip recommended** (falls back to `generic`) |

**How to perform**

1. Sit in the machine with your back against the pad and shins behind the roller.
2. Align the machine's pivot with your knee joint.
3. Extend your knees to raise the pad until your legs are nearly straight.
4. Squeeze your quads at the top without snapping into a hard lockout.
5. Lower under control, resisting the weight on the way down.

> 💡 **Pro tip:** Own the lowering phase — a slow eccentric drives more growth than swinging the pad up and dropping it.

---

## Hanging Leg Raise 🔴 Proposed

A dynamic core-flexion movement hanging from a bar and raising the legs. It trains the lower abdominals and hip flexors through a large range while building grip and shoulder stability as a bonus. Adds the "dynamic flexion" dimension the plank lacks.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Lower Abs, Hip Flexors |
| **Muscle group** | Core |
| **Type** | Bodyweight |
| **Equipment** | Pull up bar |
| **Difficulty** | Intermediate |
| **Proposed animation** | `crunch` (reuses existing clip) |

**How to perform**

1. Hang from a bar with straight arms and shoulders actively engaged.
2. Brace your core to stop yourself swinging.
3. Raise your legs by curling your pelvis upward, not just lifting your thighs.
4. Bring your legs to at least parallel (higher for advanced).
5. Lower under control to a full hang without swinging into the next rep.

> 💡 **Pro tip:** Initiate by tucking your pelvis under — if you only lift with your hip flexors, your abs barely engage.

---

## Russian Twist 🔴 Proposed

A rotational core exercise twisting the torso side to side in a seated V-position, optionally holding a weight. It trains the obliques and rotational strength — a dimension the plank alone doesn't cover.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Obliques, Core |
| **Muscle group** | Core |
| **Type** | Bodyweight |
| **Equipment** | Bodyweight (optional weight) |
| **Difficulty** | Beginner |
| **Proposed animation** | `crunch` (reuses existing clip) |

**How to perform**

1. Sit with your knees bent and heels lightly on or just above the floor.
2. Lean back to about 45 degrees, keeping your back straight.
3. Hold your hands or a weight at your chest and brace your core.
4. Rotate your torso to reach toward one side, then the other.
5. Move deliberately, rotating from the ribcage rather than flailing your arms.

> 💡 **Pro tip:** Keep it controlled and rotate through your trunk — speed-swinging your arms turns it into momentum, not oblique work.

---

## Pallof Press 🔴 Proposed

An anti-rotation core exercise: you resist a cable's sideways pull as you press the handle straight out. It trains the core to resist rotation — one of the most functional, spine-sparing core stimuli, and a modern-safe alternative to sit-ups.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Core (anti-rotation), Obliques |
| **Muscle group** | Core |
| **Type** | Weighted |
| **Equipment** | Cable (or resistance band) |
| **Difficulty** | Beginner |
| **Proposed animation** | `pallof` — **new clip recommended** (falls back to `generic`) |

**How to perform**

1. Set a cable at chest height and stand side-on, gripping the handle with both hands.
2. Step away to create tension and hold the handle against your sternum.
3. Brace your core and press the handle straight out in front of you.
4. Resist the cable's attempt to twist you toward the machine — stay square.
5. Return to your chest under control, then repeat before switching sides.

> 💡 **Pro tip:** The goal is to *not* move — the further you press out, the harder your core has to fight the rotation.

---

## Side Plank 🔴 Proposed

An isometric hold on one forearm with the body in a side-lying straight line. It trains the obliques and lateral core stability, complementing the front plank's anti-extension role.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Obliques, Core |
| **Muscle group** | Core |
| **Type** | Bodyweight |
| **Equipment** | Bodyweight |
| **Difficulty** | Beginner |
| **Proposed animation** | `plank` (reuses existing clip) |

**How to perform**

1. Lie on your side with your elbow directly under your shoulder.
2. Stack your feet and lift your hips so your body forms a straight line.
3. Brace your core and squeeze your glutes.
4. Keep your top shoulder stacked over the bottom — don't rotate forward.
5. Hold for time, then switch sides.

> 💡 **Pro tip:** Push the floor away and keep your hips high — letting them sag switches off the obliques you're trying to train.

---

## Bulgarian Split Squat 🔴 Proposed

A single-leg squat with the rear foot elevated on a bench. It is one of the most effective unilateral leg builders, exposing and correcting left/right imbalances while sparing the lower back relative to heavy bilateral squats.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Quads, Glutes |
| **Muscle group** | Legs |
| **Type** | Weighted (or bodyweight) |
| **Equipment** | Dumbbell, Bench |
| **Difficulty** | Intermediate |
| **Proposed animation** | `lunge` (reuses existing clip) |

**How to perform**

1. Stand a stride's length in front of a bench and rest the top of one foot on it behind you.
2. Keep your torso tall and your weight on your front leg.
3. Lower straight down until your front thigh is about parallel to the floor.
4. Keep your front knee tracking over your foot.
5. Drive through your front heel to stand; finish all reps before switching legs.

> 💡 **Pro tip:** Set your front foot far enough forward that your knee stays over your ankle at the bottom — too close and your knee travels painfully past your toes.

---

## Farmer's Carry 🔴 Proposed

A loaded carry — simply walking with heavy weights at your sides. It builds grip, trap, and core strength plus total-body stability. Grip strength is *associated with* better long-term health markers in large population studies, making this as much a longevity exercise as a strength one.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Grip/Forearms, Traps, Core, Legs |
| **Muscle group** | Full Body |
| **Type** | Weighted |
| **Equipment** | Dumbbell (or kettlebell) |
| **Difficulty** | Beginner |
| **Proposed animation** | `carry` — **new clip recommended** (falls back to `run`) |

**How to perform**

1. Stand between two heavy dumbbells or kettlebells and pick them up with a flat back.
2. Brace your core, pull your shoulders down and back, and stand tall.
3. Walk with short, controlled steps, keeping the weights from swinging.
4. Keep your ribs down and torso upright — don't lean side to side.
5. Walk for the prescribed distance or time, then set the weights down safely.

> 💡 **Pro tip:** Squeeze the handles hard and stay tall — the work is as much about resisting the load pulling you down as it is about the walking.

---

## Kettlebell Swing 🔴 Proposed

An explosive hip-hinge where the kettlebell is propelled by a snap of the hips. It combines posterior-chain power with cardiovascular conditioning at low joint cost, making it one of the most efficient athletic and fat-loss movements.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Glutes, Hamstrings, Core |
| **Muscle group** | Full Body |
| **Type** | Cardio / Conditioning |
| **Equipment** | Kettlebell (**new equipment type**) |
| **Difficulty** | Intermediate |
| **Proposed animation** | `deadlift` (reuses existing clip; dedicated `swing` clip would read better) |

**How to perform**

1. Stand with feet shoulder-width, kettlebell on the floor about a foot in front of you.
2. Hinge at the hips, grip the bell, and hike it back between your legs.
3. Snap your hips forward explosively to float the bell up to chest height.
4. Keep your arms relaxed — the power comes from your hips, not a lift.
5. Let the bell fall back into the next hinge and repeat rhythmically.

> 💡 **Pro tip:** It's a hinge, not a squat or a front raise — the bell floats up on hip power, and your arms are just ropes guiding it.

---

## Goblet Squat 🔴 Proposed

A squat holding a single weight at chest height. The front-loaded position naturally encourages an upright torso and good depth, making it the safest, most beginner-friendly way to learn the squat pattern before loading a barbell.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Quads, Glutes |
| **Muscle group** | Legs |
| **Type** | Weighted |
| **Equipment** | Dumbbell (or kettlebell) |
| **Difficulty** | Beginner |
| **Proposed animation** | `squat` (reuses existing clip) |

**How to perform**

1. Hold a dumbbell or kettlebell vertically against your chest with both hands.
2. Stand with feet shoulder-width, toes slightly turned out.
3. Brace your core and squat down between your knees, keeping your chest tall.
4. Descend until your elbows brush the inside of your knees, or slightly deeper.
5. Drive through your whole foot to stand back up.

> 💡 **Pro tip:** Let the weight counterbalance you — holding it at your chest makes it far easier to stay upright and hit depth than a back squat.

---

## Banded Hip Abduction 🔴 Proposed

A glute-medius exercise moving the leg outward against a band (as a lateral walk or clamshell). It strengthens the often-neglected side glutes that stabilize the hip and knee — valuable for knee-valgus prevention, hip stability, and injury-resistant lower-body training.

| Attribute | Value |
|---|---|
| **Status** | 🔴 Proposed — not in the catalog yet |
| **Target muscles** | Glute Medius, Glutes |
| **Muscle group** | Legs |
| **Type** | Bodyweight (banded) |
| **Equipment** | Resistance band (**new equipment type**) |
| **Difficulty** | Beginner |
| **Proposed animation** | `hipAbduction` — **new clip recommended** (falls back to `generic`) |

**How to perform**

1. Loop a resistance band around your legs just above the knees or ankles.
2. Drop into a quarter-squat with feet hip-width and tension on the band.
3. Keep your chest up and core braced.
4. Step sideways, pushing against the band, without letting your knees cave inward.
5. Take controlled steps one way, then back, keeping constant tension.

> 💡 **Pro tip:** Keep your feet pointing forward and lead with your heel — letting your knees collapse inward defeats the entire purpose.

---

# Part 2 — Implemented Catalog ✅ (Live in the app — 20 exercises)

_Generated from `app/src/data/mocks/exerciseCatalog.json`. These are seeded and shipping today._

## Contents

| # | Exercise | Primary Muscles | Difficulty | Equipment |
|---|----------|-----------------|-----------|-----------|
| 1 | [Barbell Squat](#barbell-squat) | Quads, Glutes | Intermediate | Barbell |
| 2 | [Bench Press](#bench-press) | Chest, Triceps | Intermediate | Barbell |
| 3 | [Deadlift](#deadlift) | Back, Hamstrings | Advanced | Barbell |
| 4 | [Overhead Press](#overhead-press) | Shoulders | Intermediate | Barbell |
| 5 | [Pull Up](#pull-up) | Back, Biceps | Intermediate | Pull up bar |
| 6 | [Dumbbell Row](#dumbbell-row) | Back, Biceps | Beginner | Dumbbell |
| 7 | [Lunge](#lunge) | Quads, Glutes | Beginner | Bodyweight |
| 8 | [Push Up](#push-up) | Chest, Triceps | Beginner | Bodyweight |
| 9 | [Plank](#plank) | Core | Beginner | Bodyweight |
| 10 | [Bicep Curl](#bicep-curl) | Biceps | Beginner | Dumbbell |
| 11 | [Tricep Extension](#tricep-extension) | Triceps | Beginner | Cable |
| 12 | [Leg Press](#leg-press) | Quads | Beginner | Machine |
| 13 | [Lat Pulldown](#lat-pulldown) | Back | Beginner | Cable |
| 14 | [Seated Row](#seated-row) | Back | Beginner | Cable |
| 15 | [Face Pull](#face-pull) | Shoulders, Rear Delts | Beginner | Cable |
| 16 | [Calf Raise](#calf-raise) | Calves | Beginner | Machine |
| 17 | [Hamstring Curl](#hamstring-curl) | Hamstrings | Beginner | Machine |
| 18 | [Lateral Raise](#lateral-raise) | Shoulders | Beginner | Dumbbell |
| 19 | [Box Jump](#box-jump) | Legs | Intermediate | Box |
| 20 | [Burpee](#burpee) | Full Body | Intermediate | Bodyweight |

---

## Barbell Squat

A foundational compound lower-body lift where you lower your hips under a loaded barbell and drive back up. It builds total-leg and glute strength and is a cornerstone of nearly every strength program.

| Attribute | Value |
|---|---|
| **Target muscles** | Quads, Glutes |
| **Muscle group** | Legs |
| **Type** | Weighted |
| **Equipment** | Barbell |
| **Difficulty** | Intermediate |
| **Catalog ID** | `ex_001` |
| **Demo animation** | `squat` |

**How to perform**

1. Set the bar on a rack at upper-chest height and load it evenly. Step under it so it rests across your upper traps, not your neck.
2. Grip the bar just outside shoulder width, unrack it, and take two controlled steps back. Set feet shoulder-width apart, toes slightly out.
3. Take a big breath, brace your core, and sit down and back as if lowering into a chair.
4. Descend until your hip crease drops below the top of your knees, keeping your chest tall and knees tracking over your toes.
5. Drive through your whole foot to stand back up, exhaling near the top. Lock out hips and knees together.

> 💡 **Pro tip:** Keep your weight centered over mid-foot. If your heels lift or you tip forward, drop the load and rebuild.

---

## Bench Press

The classic horizontal pressing movement, lying on a bench and pushing a barbell away from your chest. It's the primary builder of chest, front-shoulder, and triceps pressing strength.

| Attribute | Value |
|---|---|
| **Target muscles** | Chest, Triceps |
| **Muscle group** | Chest |
| **Type** | Weighted |
| **Equipment** | Barbell |
| **Difficulty** | Intermediate |
| **Catalog ID** | `ex_002` |
| **Demo animation** | `benchPress` |

**How to perform**

1. Lie flat on the bench with eyes under the bar and feet planted firmly on the floor.
2. Grip the bar slightly wider than shoulder width and squeeze your shoulder blades down and together.
3. Unrack the bar and hold it over your chest with arms straight.
4. Lower the bar under control to the middle of your chest, keeping elbows at roughly a 45-degree angle to your torso.
5. Press the bar back up in a slight arc toward your face until your arms lock out.

> 💡 **Pro tip:** Drive your feet into the floor and keep your glutes on the bench. Full-body tension makes the press stronger and safer.

---

## Deadlift

A hip-hinge compound lift where you pull a loaded barbell from the floor to a standing lockout. It trains the entire posterior chain — back, glutes, and hamstrings — and is one of the most effective total-body strength builders.

| Attribute | Value |
|---|---|
| **Target muscles** | Back, Hamstrings |
| **Muscle group** | Back |
| **Type** | Weighted |
| **Equipment** | Barbell |
| **Difficulty** | Advanced |
| **Catalog ID** | `ex_003` |
| **Demo animation** | `deadlift` |

**How to perform**

1. Stand with mid-foot under the barbell, feet hip-width apart.
2. Hinge at the hips and grip the bar just outside your knees, arms straight.
3. Drop your hips, lift your chest, and pull the slack out of the bar so your lats engage.
4. Brace hard, then drive through the floor and stand tall, keeping the bar dragging close to your legs.
5. Lock out by squeezing your glutes, then reverse the motion under control to set the bar down.

> 💡 **Pro tip:** Keep the bar touching your body the entire lift. A bar that drifts forward rounds your back and kills your leverage.

---

## Overhead Press

A standing vertical press driving a barbell from the shoulders to overhead. It develops shoulder and triceps strength while demanding full-body bracing and stability.

| Attribute | Value |
|---|---|
| **Target muscles** | Shoulders |
| **Muscle group** | Shoulders |
| **Type** | Weighted |
| **Equipment** | Barbell |
| **Difficulty** | Intermediate |
| **Catalog ID** | `ex_004` |
| **Demo animation** | `overheadPress` |

**How to perform**

1. Set the bar at your front shoulders, hands just outside shoulder width, elbows pointing forward.
2. Stand tall with feet hip-width apart and brace your core and glutes.
3. Press the bar straight up, moving your head back slightly to clear a path.
4. Once the bar passes your forehead, push your head through so the bar finishes stacked over your mid-foot.
5. Lock out overhead, then lower under control back to your shoulders.

> 💡 **Pro tip:** Squeeze your glutes and pull your ribs down before pressing. This stops you leaning back and turning it into an incline press.

---

## Pull Up

A bodyweight vertical pull where you hang from a bar and lift your chin above it. It's a top-tier builder of back width (lats) and biceps, and a benchmark of relative strength.

| Attribute | Value |
|---|---|
| **Target muscles** | Back, Biceps |
| **Muscle group** | Back |
| **Type** | Bodyweight |
| **Equipment** | Pull up bar |
| **Difficulty** | Intermediate |
| **Catalog ID** | `ex_005` |
| **Demo animation** | `pullup` |

**How to perform**

1. Grip the bar with palms facing away, hands just wider than shoulders.
2. Hang with arms fully extended, then pull your shoulder blades down and back to start.
3. Drive your elbows down toward your ribs and pull your chest to the bar.
4. Lift until your chin clears the bar, keeping your core tight to avoid swinging.
5. Lower under control all the way back to a full hang before the next rep.

> 💡 **Pro tip:** Lead with your chest, not your chin. Think about pulling your elbows into your back pockets.

---

## Dumbbell Row

A single-arm horizontal pull performed braced on a bench, rowing a dumbbell toward your hip. It builds mid-back thickness and biceps while ironing out left/right imbalances.

| Attribute | Value |
|---|---|
| **Target muscles** | Back, Biceps |
| **Muscle group** | Back |
| **Type** | Weighted |
| **Equipment** | Dumbbell |
| **Difficulty** | Beginner |
| **Catalog ID** | `ex_006` |
| **Demo animation** | `row` |

**How to perform**

1. Place one knee and the same-side hand on a bench, back flat and roughly parallel to the floor.
2. Hold the dumbbell in your free hand with your arm hanging straight down.
3. Brace your core and pull the dumbbell up toward your hip, leading with your elbow.
4. Squeeze your back at the top with the dumbbell near your lower ribs.
5. Lower under control to a full stretch, then repeat before switching sides.

> 💡 **Pro tip:** Keep your torso still and rotation-free. The row comes from your back, not from twisting your body.

---

## Lunge

A single-leg movement where you step forward and lower until both knees bend to about 90 degrees. It trains the quads and glutes unilaterally, improving balance, coordination, and hip stability.

| Attribute | Value |
|---|---|
| **Target muscles** | Quads, Glutes |
| **Muscle group** | Legs |
| **Type** | Bodyweight |
| **Equipment** | Bodyweight |
| **Difficulty** | Beginner |
| **Catalog ID** | `ex_007` |
| **Demo animation** | `lunge` |

**How to perform**

1. Stand tall with feet hip-width apart and hands on your hips or at your sides.
2. Take a controlled step forward into a comfortable stride.
3. Lower straight down until both knees are bent to about 90 degrees, front shin vertical.
4. Keep your torso upright and your front knee tracking over your toes.
5. Push through your front heel to return to standing, then alternate legs.

> 💡 **Pro tip:** Drop straight down, not forward. Your front knee should stay stacked over your ankle, not shoot past your toes.

---

## Push Up

A bodyweight horizontal press performed in a plank position, lowering and pushing your chest away from the floor. It builds chest, shoulder, and triceps strength while reinforcing core stability.

| Attribute | Value |
|---|---|
| **Target muscles** | Chest, Triceps |
| **Muscle group** | Chest |
| **Type** | Bodyweight |
| **Equipment** | Bodyweight |
| **Difficulty** | Beginner |
| **Catalog ID** | `ex_008` |
| **Demo animation** | `pushup` |

**How to perform**

1. Start in a high plank with hands slightly wider than shoulders, body in a straight line.
2. Brace your core and squeeze your glutes so your hips do not sag.
3. Bend your elbows to about 45 degrees and lower your chest toward the floor.
4. Descend until your chest is just above the ground.
5. Press back up powerfully until your arms are straight, keeping your body rigid throughout.

> 💡 **Pro tip:** Keep your body one straight line from head to heels. No sagging hips, no piked hips.

---

## Plank

An isometric core hold in a straight-line plank position on the forearms. It develops deep core and trunk stability rather than movement, teaching you to brace under tension.

| Attribute | Value |
|---|---|
| **Target muscles** | Core |
| **Muscle group** | Core |
| **Type** | Bodyweight |
| **Equipment** | Bodyweight |
| **Difficulty** | Beginner |
| **Catalog ID** | `ex_009` |
| **Demo animation** | `plank` |

**How to perform**

1. Set your forearms on the floor with elbows directly under your shoulders.
2. Extend your legs behind you and rise onto your toes.
3. Form a straight line from head to heels and brace your core hard.
4. Squeeze your glutes and quads and keep breathing steadily.
5. Hold the position for time without letting your hips drop or pike.

> 💡 **Pro tip:** Actively pull your elbows toward your toes and tuck your ribs down. A plank is an active brace, not a passive hang.

---

## Bicep Curl

An isolation movement curling dumbbells toward the shoulders by bending at the elbow. It directly targets the biceps for arm size and elbow-flexion strength.

| Attribute | Value |
|---|---|
| **Target muscles** | Biceps |
| **Muscle group** | Arms |
| **Type** | Weighted |
| **Equipment** | Dumbbell |
| **Difficulty** | Beginner |
| **Catalog ID** | `ex_010` |
| **Demo animation** | `curl` |

**How to perform**

1. Stand tall holding a dumbbell in each hand, arms at your sides, palms facing forward.
2. Keep your elbows pinned to your sides and your upper arms still.
3. Curl the weights up by bending only at the elbow.
4. Squeeze your biceps hard at the top without swinging.
5. Lower under control until your arms are fully straight, then repeat.

> 💡 **Pro tip:** If your elbows drift forward or you rock your torso, the weight is too heavy. Strict reps build the biceps.

---

## Tricep Extension

A cable isolation exercise extending the forearms downward against resistance. It isolates the triceps — the muscle responsible for straightening the elbow and most of upper-arm mass.

| Attribute | Value |
|---|---|
| **Target muscles** | Triceps |
| **Muscle group** | Arms |
| **Type** | Weighted |
| **Equipment** | Cable |
| **Difficulty** | Beginner |
| **Catalog ID** | `ex_011` |
| **Demo animation** | `overheadPress` |

**How to perform**

1. Attach a rope or bar to a high cable pulley and grip it with both hands.
2. Stand tall, tuck your elbows to your sides, and start with your forearms parallel to the floor.
3. Keeping your upper arms locked in place, extend your forearms down until your arms are straight.
4. Squeeze your triceps hard at the bottom of the movement.
5. Slowly return to the start, letting your forearms rise without moving your elbows.

> 💡 **Pro tip:** Your elbows are the hinge. Pin them to your ribs so every rep isolates the triceps, not your shoulders.

---

## Leg Press

A machine-based leg press where you push a weighted platform away with your legs. It loads the quads and glutes heavily with strong back support, making it accessible for beginners and high-volume work.

| Attribute | Value |
|---|---|
| **Target muscles** | Quads |
| **Muscle group** | Legs |
| **Type** | Weighted |
| **Equipment** | Machine |
| **Difficulty** | Beginner |
| **Catalog ID** | `ex_012` |
| **Demo animation** | `squat` |

**How to perform**

1. Sit in the machine with your back flat against the pad and feet shoulder-width on the platform.
2. Release the safety handles and hold the platform with legs nearly straight, keeping a soft knee.
3. Lower the platform under control until your knees reach about 90 degrees.
4. Keep your lower back and hips glued to the seat throughout.
5. Drive through your whole foot to press the platform back up without locking your knees hard.

> 💡 **Pro tip:** Do not let your lower back round off the seat at the bottom. Stop the descent before your hips tuck under.

---

## Lat Pulldown

A cable vertical pull, drawing a wide bar down to the upper chest while seated. It builds back width and biceps and is an accessible progression toward the pull-up.

| Attribute | Value |
|---|---|
| **Target muscles** | Back |
| **Muscle group** | Back |
| **Type** | Weighted |
| **Equipment** | Cable |
| **Difficulty** | Beginner |
| **Catalog ID** | `ex_013` |
| **Demo animation** | `pullup` |

**How to perform**

1. Sit at the machine and grip the bar wider than shoulder width, palms facing away.
2. Secure your thighs under the pad and lean back very slightly.
3. Pull the bar down toward your upper chest, driving your elbows down and back.
4. Squeeze your shoulder blades together at the bottom.
5. Return the bar under control to a full stretch overhead before the next rep.

> 💡 **Pro tip:** Lead with your elbows and keep your chest proud. Avoid yanking the bar with just your arms.

---

## Seated Row

A seated cable horizontal pull, drawing a handle toward the torso. It develops mid-back thickness and grip while training strong scapular retraction.

| Attribute | Value |
|---|---|
| **Target muscles** | Back |
| **Muscle group** | Back |
| **Type** | Weighted |
| **Equipment** | Cable |
| **Difficulty** | Beginner |
| **Catalog ID** | `ex_014` |
| **Demo animation** | `row` |

**How to perform**

1. Sit facing the cable with feet braced and a slight bend in your knees.
2. Grab the handle, sit tall, and extend your arms with a light stretch in your back.
3. Pull the handle toward your belly, driving your elbows straight back.
4. Squeeze your shoulder blades together and keep your torso upright.
5. Extend your arms back out under control, keeping your chest tall throughout.

> 💡 **Pro tip:** Move from your back, not your lower spine. Keep your torso still rather than rocking for momentum.

---

## Face Pull

A cable movement pulling a rope toward the face with high, flaring elbows. It targets the rear delts and upper-back postural muscles — a key exercise for shoulder health and posture.

| Attribute | Value |
|---|---|
| **Target muscles** | Shoulders, Rear Delts |
| **Muscle group** | Shoulders |
| **Type** | Weighted |
| **Equipment** | Cable |
| **Difficulty** | Beginner |
| **Catalog ID** | `ex_015` |
| **Demo animation** | `row` |

**How to perform**

1. Set a rope on a cable pulley at roughly face height and grip both ends with thumbs back.
2. Step back to create tension and stand tall with arms extended.
3. Pull the rope toward your face, flaring the ends apart as you go.
4. Drive your elbows high and squeeze your rear delts and upper back.
5. Return the rope under control to the starting stretch.

> 💡 **Pro tip:** Aim the rope at your forehead and finish with your hands beside your ears. High elbows hit the rear delts best.

---

## Calf Raise

An isolation movement rising onto the balls of the feet against load. It trains the calves (gastrocnemius and soleus) through a full stretch-and-squeeze range.

| Attribute | Value |
|---|---|
| **Target muscles** | Calves |
| **Muscle group** | Legs |
| **Type** | Weighted |
| **Equipment** | Machine |
| **Difficulty** | Beginner |
| **Catalog ID** | `ex_016` |
| **Demo animation** | `calfRaise` |

**How to perform**

1. Stand with the balls of your feet on the machine platform, heels hanging off the edge.
2. Rise up under the pad or load and stand tall with a slight knee bend.
3. Lower your heels below the platform for a full stretch in your calves.
4. Press up onto your toes as high as possible.
5. Squeeze at the top for a beat, then lower slowly under control.

> 💡 **Pro tip:** Use a full range. A deep stretch at the bottom and a hard squeeze at the top beats short, bouncy reps.

---

## Hamstring Curl

A machine isolation exercise curling the heels toward the glutes. It isolates the hamstrings for knee-flexion strength and balanced leg development.

| Attribute | Value |
|---|---|
| **Target muscles** | Hamstrings |
| **Muscle group** | Legs |
| **Type** | Weighted |
| **Equipment** | Machine |
| **Difficulty** | Beginner |
| **Catalog ID** | `ex_017` |
| **Demo animation** | `deadlift` |

**How to perform**

1. Lie face down on the machine with the pad resting just above your heels.
2. Grip the handles and keep your hips pressed into the bench.
3. Curl your heels toward your glutes by contracting your hamstrings.
4. Squeeze hard at the top without lifting your hips off the pad.
5. Lower under control until your legs are nearly straight, then repeat.

> 💡 **Pro tip:** Keep your hips down. If they pop up, you are using your lower back instead of your hamstrings.

---

## Lateral Raise

A shoulder isolation movement raising dumbbells out to the sides to shoulder height. It targets the lateral (side) delts, the muscle most responsible for shoulder width.

| Attribute | Value |
|---|---|
| **Target muscles** | Shoulders |
| **Muscle group** | Shoulders |
| **Type** | Weighted |
| **Equipment** | Dumbbell |
| **Difficulty** | Beginner |
| **Catalog ID** | `ex_018` |
| **Demo animation** | `lateralRaise` |

**How to perform**

1. Stand tall with a dumbbell in each hand at your sides, palms facing in.
2. Keep a slight bend in your elbows and brace your core.
3. Raise the dumbbells out to your sides until they reach shoulder height.
4. Lead with your elbows and keep your wrists level with your hands.
5. Lower under control back to your sides without swinging.

> 💡 **Pro tip:** Keep the movement slow and lead with the elbows. Momentum steals the tension from your side delts.

---

## Box Jump

An explosive plyometric where you jump onto a raised box and stand tall. It develops lower-body power, rate of force development, and athletic explosiveness.

| Attribute | Value |
|---|---|
| **Target muscles** | Legs |
| **Muscle group** | Legs |
| **Type** | Cardio / Conditioning |
| **Equipment** | Box |
| **Difficulty** | Intermediate |
| **Catalog ID** | `ex_019` |
| **Demo animation** | `jumpingJack` |

**How to perform**

1. Stand facing a sturdy box a comfortable distance away, feet hip-width apart.
2. Hinge slightly and swing your arms back to load.
3. Explode upward by driving your arms up and extending your hips.
4. Land softly on the box with both feet flat and knees bent to absorb the impact.
5. Stand fully upright on the box, then step down one foot at a time to reset.

> 💡 **Pro tip:** Step down, do not jump down. Repeated hard landings off the box beat up your knees for no extra benefit.

---

## Burpee

A full-body conditioning movement chaining a squat, plank, push-up, and jump. It builds cardiovascular endurance and total-body work capacity with no equipment.

| Attribute | Value |
|---|---|
| **Target muscles** | Full Body |
| **Muscle group** | Full_body |
| **Type** | Cardio / Conditioning |
| **Equipment** | Bodyweight |
| **Difficulty** | Intermediate |
| **Catalog ID** | `ex_020` |
| **Demo animation** | `jumpingJack` |

**How to perform**

1. Stand tall with feet shoulder-width apart.
2. Drop into a squat and place your hands on the floor in front of you.
3. Kick your feet back into a high plank and lower your chest to the floor.
4. Press up and hop your feet back toward your hands.
5. Explode straight up into a jump with arms overhead, then land soft and repeat.

> 💡 **Pro tip:** Keep a braced core as you kick out and pace your breathing so form holds up as fatigue sets in.

