
// NATIVE adapter: expo-gl GLView + expo-three Renderer.
// three is bridged to OpenGL-ES via expo-gl's WebGL implementation.

import React, { useImperativeHandle, useRef, forwardRef, useEffect } from 'react';
import { View, AppState } from 'react-native';
import { GLView } from 'expo-gl';
import type { ExpoWebGLRenderingContext } from 'expo-gl';
import { Renderer } from 'expo-three';
import { SceneManager } from '../SceneManager';
import { ThreeCanvasProps, ThreeCanvasHandle } from './adapterTypes';

const ThreeCanvas = forwardRef<ThreeCanvasHandle, ThreeCanvasProps>(({ kind, height }, ref) => {
    const managerRef = useRef<SceneManager | null>(null);
    const queueRef = useRef<{ name: string; payload?: unknown }[]>([]);
    const disposedRef = useRef(false);
    const frameRef = useRef(0);

    useImperativeHandle(ref, () => ({
        command(name, payload) {
            if (managerRef.current) {
                managerRef.current.command(name, payload);
            } else {
                queueRef.current.push({ name, payload });
            }
        },
    }), []);

    useEffect(() => {
        disposedRef.current = false;
        // Pause the frame loop while backgrounded (battery + GL safety).
        const sub = AppState.addEventListener('change', state => {
            if (state !== 'active') cancelAnimationFrame(frameRef.current);
        });
        return () => {
            disposedRef.current = true;
            cancelAnimationFrame(frameRef.current);
            managerRef.current?.dispose();
            managerRef.current = null;
            sub.remove();
        };
    }, []);

    const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
        // Present at runtime; missing from the expo-gl typings.
        const { drawingBufferWidth: width, drawingBufferHeight: glHeight } = gl as unknown as {
            drawingBufferWidth: number;
            drawingBufferHeight: number;
        };

        const renderer = new Renderer({ gl, alpha: true });
        renderer.setSize(width, glHeight);
        renderer.setClearColor(0x000000, 0); // transparent over the app bg

        const manager = new SceneManager(kind, width / glHeight);
        managerRef.current = manager;
        queueRef.current.splice(0).forEach(c => manager.command(c.name, c.payload));

        const loop = (now: number) => {
            if (disposedRef.current) return;
            manager.tick(now);
            renderer.render(manager.scene, manager.camera);
            gl.endFrameEXP();
            frameRef.current = requestAnimationFrame(loop);
        };
        frameRef.current = requestAnimationFrame(loop);
    };

    return (
        <View style={{ width: '100%', height }}>
            <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
        </View>
    );
});

ThreeCanvas.displayName = 'ThreeCanvas';
export default ThreeCanvas;
