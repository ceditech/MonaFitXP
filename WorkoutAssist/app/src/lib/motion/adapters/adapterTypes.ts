
import { SceneKind } from '../scenes/types';

export interface ThreeCanvasProps {
    kind: SceneKind;
    height: number;
}

/** Imperative handle exposed by both platform adapters. */
export interface ThreeCanvasHandle {
    command(name: string, payload?: unknown): void;
}
