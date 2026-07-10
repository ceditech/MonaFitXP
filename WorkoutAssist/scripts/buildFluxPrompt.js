/*
 * buildFluxPrompt.js — constructs a FLUX image prompt from an exercise's
 * structured fields. This replaces the prompt-pack's stored strings, which
 * over-specified per-muscle color coding (which FLUX ignores) and appended a
 * "Negative prompt:" block (a Stable Diffusion concept FLUX misreads).
 *
 * The winning structure (validated on Barbell Squat): brand-neon look, a
 * forced exercise position, forced realistic equipment, positive phrasing,
 * no negative block, no per-muscle color coding (the app's MuscleDiagram SVG
 * already handles muscle education).
 */

// The recognizable "captured at this moment" position, keyed by the exercise's
// animationKey (same keys the 3D mannequin uses — see app/src/lib/motion/mannequin/poses.ts).
const POSITION_BY_KEY = {
  squat: 'at the bottom of the squat: hips sunk clearly below the knees, thighs at or just below parallel to the floor, torso upright with a neutral spine, knees bent deeply and tracking out over the toes, feet flat and shoulder-width apart',
  lunge: 'at the bottom of a forward lunge: the front thigh parallel to the floor with a vertical front shin, the back knee lowered toward the ground, torso tall and upright',
  deadlift: 'at the mid-pull of a deadlift: hips hinged back, a flat neutral back, shins near vertical, both hands gripping a loaded barbell as it rises along the shins, chest up and shoulders just over the bar',
  benchPress: 'lying flat on a workout bench, feet planted on the floor, pressing a barbell upward from the chest with arms extending toward lockout',
  overheadPress: 'standing tall and pressing a barbell overhead to full lockout, arms extended straight above the head, core braced',
  row: 'hinged forward at the hips with a flat back, pulling the weight toward the lower ribs with the elbows driving back and shoulder blades squeezing together',
  curl: 'standing tall and curling the weight upward with the elbows pinned to the sides, forearms raised and biceps contracted',
  pushup: 'at the bottom of a push-up: the body in a straight rigid plank line from head to heels, chest hovering just above the floor, elbows bent at about forty-five degrees',
  pullup: 'at the top of a pull-up: hanging from an overhead bar with the chin above the bar, elbows driven down toward the ribs, body straight and controlled',
  plank: 'holding a forearm plank: the body in a straight line from head to heels, forearms flat on the floor, core braced and hips level',
  jumpingJack: 'mid jumping jack: arms raised out and overhead, feet jumped apart, dynamic and athletic',
  run: 'mid running stride: one knee driven up high, opposite arm swinging forward, dynamic athletic motion',
  crunch: 'lying on the back performing an abdominal crunch: knees bent, shoulders and upper back curled up off the floor',
  calfRaise: 'standing tall and risen up high onto the balls of the feet, heels lifted, calves fully contracted',
  lateralRaise: 'standing tall and raising dumbbells out to the sides up to shoulder height, arms wide with a slight bend at the elbows',
  generic: 'at the most recognizable and educational working position of the movement, with clean athletic form',
};

function equipmentClause(equipment) {
  const e = (equipment || '').toLowerCase();
  if (!e || e.includes('bodyweight') || e === 'none') {
    return 'This is a bodyweight exercise performed with no equipment.';
  }
  return `A realistic ${equipment} is shown, properly scaled and correctly positioned for the movement.`;
}

/** Build the FLUX hero prompt for an exercise (pack entry with the standard fields). */
function buildPrompt(ex) {
  const position = POSITION_BY_KEY[ex.animationKey] || POSITION_BY_KEY.generic;
  const camera = ex.camera || 'three-quarter side-front';
  const cues = ex.formCues ? ` (safe technique: ${ex.formCues})` : '';

  return [
    'A premium 3D fitness-app exercise visualization for a modern workout coaching app, lit with a bold neon color scheme of electric orange and violet-purple on a dark studio background.',

    'A clean anatomical 3D mannequin, gender-neutral, athletic proportions, smooth matte pearl-white body surface with tasteful muscle definition, wearing form-fitting matte charcoal athletic shorts, a blank featureless face, no logo, no watermark, no lettering.',

    `The mannequin is performing a ${ex.name}, captured ${position}. ${equipmentClause(ex.equipment)} A ${camera} camera angle clearly shows the working position and body mechanics.`,

    `Dramatic cinematic rim lighting in electric orange (#FF7A29) and violet-purple (#8E24AA) wraps the figure, with a subtle warm glow along the primary working muscles (${ex.primary}). The whole palette stays strictly within electric orange and violet-purple to match the app brand.`,

    `Scene: vertical 9:16 mobile composition, a dark graphite-to-midnight-blue studio gym background, a subtle reflective floor, ultra-detailed 3D render, sharp and correct human anatomy, correct joint angles, safe lifting technique${cues}, with generous clean negative space around the figure for app UI overlays.`,
  ].join('\n\n');
}

module.exports = { buildPrompt, POSITION_BY_KEY };
