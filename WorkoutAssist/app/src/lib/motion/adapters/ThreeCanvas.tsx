
// WEB adapter (Metro picks ThreeCanvas.native.tsx on iOS/Android).
// Raw <canvas> + THREE.WebGLRenderer appended into an RN-web View.
// DOM APIs accessed via globalThis casts — the RN tsconfig has no DOM lib.

import React, { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { View, PixelRatio } from 'react-native';
import * as THREE from 'three';
import { SceneManager } from '../SceneManager';
import { ThreeCanvasProps, ThreeCanvasHandle } from './adapterTypes';

const ThreeCanvas = forwardRef<ThreeCanvasHandle, ThreeCanvasProps>(({ kind, height }, ref) => {
    const hostRef = useRef<any>(null);
    const managerRef = useRef<SceneManager | null>(null);
    // Commands sent before the scene is ready are queued, not dropped.
    const queueRef = useRef<{ name: string; payload?: unknown }[]>([]);

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
        const doc = (globalThis as any).document;
        const hostNode = hostRef.current as any; // rn-web View renders a div
        if (!doc || !hostNode) return;

        let disposed = false;
        let frameId = 0;
        let renderer: THREE.WebGLRenderer | null = null;
        let manager: SceneManager | null = null;

        const canvas = doc.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        hostNode.appendChild(canvas);

        const setup = () => {
            const width = hostNode.clientWidth || 300;
            const pixelRatio = Math.min(PixelRatio.get(), 2); // clamp for low-end devices

            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(width, height, false);

            manager = new SceneManager(kind, width / height);
            managerRef.current = manager;
            queueRef.current.splice(0).forEach(c => manager!.command(c.name, c.payload));

            const loop = (now: number) => {
                if (disposed) return;
                manager!.tick(now);
                renderer!.render(manager!.scene, manager!.camera);
                frameId = requestAnimationFrame(loop);
            };
            frameId = requestAnimationFrame(loop);
        };

        const teardown = () => {
            cancelAnimationFrame(frameId);
            managerRef.current = null;
            manager?.dispose();
            manager = null;
            renderer?.dispose();
            renderer = null;
        };

        // GL context loss: stop cleanly, rebuild on restore.
        const onLost = (e: any) => { e.preventDefault?.(); teardown(); };
        const onRestored = () => { if (!disposed) setup(); };
        canvas.addEventListener('webglcontextlost', onLost, false);
        canvas.addEventListener('webglcontextrestored', onRestored, false);

        // Track container resizes.
        const ResizeObserverCtor = (globalThis as any).ResizeObserver;
        const observer = ResizeObserverCtor
            ? new ResizeObserverCtor(() => {
                const w = hostNode.clientWidth || 300;
                renderer?.setSize(w, height, false);
                managerRef.current?.setAspect(w / height);
            })
            : null;
        observer?.observe(hostNode);

        setup();

        return () => {
            disposed = true;
            observer?.disconnect();
            canvas.removeEventListener('webglcontextlost', onLost);
            canvas.removeEventListener('webglcontextrestored', onRestored);
            teardown();
            canvas.remove?.();
        };
    }, [kind, height]);

    return <View ref={hostRef} style={{ width: '100%', height }} />;
});

ThreeCanvas.displayName = 'ThreeCanvas';
export default ThreeCanvas;
