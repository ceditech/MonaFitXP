
import { Asset } from 'expo-asset';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationKey } from './poses';

/**
 * Registry of exercises that have a real rigged 3D asset (built in Blender,
 * exported as a skinned GLB with a baked animation clip). Only keys present
 * here use the GLB path; every other exercise renders the procedural
 * MannequinRig. Add a module here as each exercise's GLB is authored.
 */
const GLB_MODULES: Partial<Record<AnimationKey, number>> = {
    squat: require('../../../../assets/models/mannequin-squat.glb'),
};

export interface LoadedGlb {
    /** The glTF root (skinned mesh + armature) ready to add to a scene. */
    root: THREE.Object3D;
    /** First baked animation clip, or null if the asset has none. */
    clip: THREE.AnimationClip | null;
}

/** Whether a rigged GLB exists for this exercise. */
export function hasExerciseGlb(key: AnimationKey): boolean {
    return GLB_MODULES[key] != null;
}

/**
 * Resolve + parse the exercise's GLB. Works on web (http asset URL) and
 * native (expo-asset file:// localUri). Rejects on any failure so callers
 * can fall back to the procedural mannequin without a hard dependency on GL
 * asset loading succeeding on a given platform.
 */
export async function loadExerciseGlb(key: AnimationKey): Promise<LoadedGlb> {
    const mod = GLB_MODULES[key];
    if (mod == null) throw new Error(`No GLB asset registered for exercise "${key}"`);

    const asset = Asset.fromModule(mod);
    await asset.downloadAsync();
    const uri = asset.localUri ?? asset.uri;
    if (!uri) throw new Error(`GLB asset "${key}" has no resolvable URI`);

    const gltf = await new GLTFLoader().loadAsync(uri);
    return { root: gltf.scene, clip: gltf.animations[0] ?? null };
}

/** Release geometries, materials and skeletons held by a loaded GLB root. */
export function disposeGlb(root: THREE.Object3D): void {
    root.traverse(obj => {
        const mesh = obj as THREE.Mesh & { skeleton?: THREE.Skeleton };
        mesh.geometry?.dispose?.();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach(m => m.dispose());
        else mat?.dispose?.();
        mesh.skeleton?.dispose?.();
    });
}
