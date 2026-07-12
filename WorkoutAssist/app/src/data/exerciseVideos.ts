
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
    ex_001: require('../../assets/videos/squat-demo.mp4'),   // Barbell Squat
    ex_008: require('../../assets/videos/pushup-demo.mp4'),  // Push Up
    ex_009: require('../../assets/videos/plank-demo.mp4'),   // Plank
    ex_020: require('../../assets/videos/burpee-demo.mp4'),  // Burpee
};

export function getExerciseVideo(exerciseId: string): number | null {
    return VIDEO_BY_EXERCISE_ID[exerciseId] ?? null;
}
