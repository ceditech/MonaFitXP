
import { AnimationKey } from '../lib/motion/mannequin/poses';

/**
 * Registry of exercises that ship a pre-rendered demo video (Mixamo mocap →
 * Blender render → H.264 MP4 loop). Keyed by AnimationKey, same convention
 * as the rigged-GLB registry in lib/motion/mannequin/loadExerciseGlb.ts.
 *
 * Phase 1 proof bundles the squat locally; at scale these move to CDN with
 * on-demand caching (see docs/VISUAL_UPGRADE_TOOLING.md).
 */
const VIDEO_MODULES: Partial<Record<AnimationKey, number>> = {
    squat: require('../../assets/videos/squat-demo.mp4'),
};

export function getExerciseVideo(key: AnimationKey): number | null {
    return VIDEO_MODULES[key] ?? null;
}
