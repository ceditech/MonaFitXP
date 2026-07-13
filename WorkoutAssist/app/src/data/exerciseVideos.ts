
/**
 * Registry of exercises that ship a pre-rendered demo video (Mixamo mocap →
 * Blender render → H.264 MP4 loop; pipeline in docs/VISUAL_UPGRADE_TOOLING.md).
 *
 * Keyed by EXERCISE ID, not AnimationKey: several exercises share an
 * animation key (e.g. Leg Press infers `squat`), and a barbell-squat video on
 * a leg-press screen would be wrong. An id only appears here when a video
 * authored for that exact movement exists.
 *
 * Phase 3 bundles these locally; at scale they move to CDN + cache.
 */
const VIDEO_BY_EXERCISE_ID: Record<string, number> = {
    ex_001: require('../../assets/videos/squat-demo.mp4'),    // Barbell Squat (mocap)
    ex_003: require('../../assets/videos/deadlift-demo.mp4'), // Deadlift (posed + AI interpolated)
    ex_004: require('../../assets/videos/ohp-demo.mp4'),      // Overhead Press (posed + AI interpolated)
    ex_006: require('../../assets/videos/row-demo.mp4'),      // Dumbbell Row (posed + AI interpolated)
    ex_007: require('../../assets/videos/lunge-demo.mp4'),    // Lunge (posed + AI interpolated)
    ex_008: require('../../assets/videos/pushup-demo.mp4'),   // Push Up (mocap)
    ex_009: require('../../assets/videos/plank-demo.mp4'),    // Plank (mocap)
    ex_010: require('../../assets/videos/curl-demo.mp4'),     // Bicep Curl (posed + AI interpolated)
    ex_016: require('../../assets/videos/calfraise-demo.mp4'),// Calf Raise (posed + AI interpolated)
    ex_020: require('../../assets/videos/burpee-demo.mp4'),   // Burpee (mocap)
};

export function getExerciseVideo(exerciseId: string): number | null {
    return VIDEO_BY_EXERCISE_ID[exerciseId] ?? null;
}
