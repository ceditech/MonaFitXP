import { Platform } from 'react-native';
import { canUseGL, __resetGlCacheForTests } from '../capabilities';

describe('canUseGL', () => {
    afterEach(() => {
        __resetGlCacheForTests();
        delete (globalThis as any).document;
    });

    it('returns true on native platforms', () => {
        // jest-expo runs as native (ios/android) by default
        expect(Platform.OS).not.toBe('web');
        expect(canUseGL()).toBe(true);
    });

    it('caches the probe result', () => {
        expect(canUseGL()).toBe(canUseGL());
    });
});
