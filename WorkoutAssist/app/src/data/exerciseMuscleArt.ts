
/**
 * Registry of "muscles worked" anatomical panels (fal Nano Banana Pro
 * écorché renders: cyan = primary, violet = secondary/synergist,
 * gold = stabilizers — same convention as the app's muscle legend).
 *
 * Keyed by exercise id, like exerciseVideos.ts. When an exercise has art,
 * the Targets card shows it in place of the flat SVG MuscleDiagram.
 * Generation prompts + source PNGs live in art/fal/muscles/.
 */
const MUSCLE_ART_BY_EXERCISE_ID: Record<string, number> = {
    ex_001: require('../../assets/muscles/ex_001.jpg'), // Barbell Squat
    ex_002: require('../../assets/muscles/ex_002.jpg'), // Bench Press
    ex_003: require('../../assets/muscles/ex_003.jpg'), // Deadlift
    ex_004: require('../../assets/muscles/ex_004.jpg'), // Overhead Press
    ex_005: require('../../assets/muscles/ex_005.jpg'), // Pull Up
    ex_006: require('../../assets/muscles/ex_006.jpg'), // Dumbbell Row
    ex_007: require('../../assets/muscles/ex_007.jpg'), // Lunge
    ex_008: require('../../assets/muscles/ex_008.jpg'), // Push Up
    ex_009: require('../../assets/muscles/ex_009.jpg'), // Plank
    ex_010: require('../../assets/muscles/ex_010.jpg'), // Bicep Curl
    ex_011: require('../../assets/muscles/ex_011.jpg'), // Tricep Extension
    ex_012: require('../../assets/muscles/ex_012.jpg'), // Leg Press
    ex_013: require('../../assets/muscles/ex_013.jpg'), // Lat Pulldown
    ex_014: require('../../assets/muscles/ex_014.jpg'), // Seated Row
    ex_015: require('../../assets/muscles/ex_015.jpg'), // Face Pull
    ex_016: require('../../assets/muscles/ex_016.jpg'), // Calf Raise
    ex_017: require('../../assets/muscles/ex_017.jpg'), // Hamstring Curl
    ex_018: require('../../assets/muscles/ex_018.jpg'), // Lateral Raise
    ex_019: require('../../assets/muscles/ex_019.jpg'), // Box Jump
    ex_020: require('../../assets/muscles/ex_020.jpg'), // Burpee
};

export function getExerciseMuscleArt(exerciseId: string): number | null {
    return MUSCLE_ART_BY_EXERCISE_ID[exerciseId] ?? null;
}
