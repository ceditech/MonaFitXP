import { Platform, Alert } from 'react-native';
import { showAlert, registerAlertHost } from '../showAlert';

describe('showAlert', () => {
    const originalOS = Platform.OS;
    let platformAlert: jest.Mock;
    let nativeAlert: jest.SpyInstance;
    let warn: jest.SpyInstance;

    beforeEach(() => {
        // This environment provides `window` but no `window.alert`, so it is
        // assigned rather than spied on — the same case the guard survives.
        platformAlert = jest.fn();
        (globalThis as any).alert = platformAlert;
        nativeAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
        warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        registerAlertHost(null);
        jest.restoreAllMocks();
        delete (globalThis as any).alert;
        Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
    });

    const setPlatform = (os: string) =>
        Object.defineProperty(Platform, 'OS', { value: os, configurable: true });

    describe('with the in-app host mounted (the normal path)', () => {
        it('dispatches to the host instead of any platform alert', () => {
            const host = jest.fn();
            registerAlertHost(host);
            setPlatform('web');

            showAlert('Sign Up Failed', 'An account with this email already exists.');

            expect(host).toHaveBeenCalledWith({
                title: 'Sign Up Failed',
                message: 'An account with this email already exists.',
            });
            expect(platformAlert).not.toHaveBeenCalled();
            expect(nativeAlert).not.toHaveBeenCalled();
        });

        it('uses the host on native too, so both platforms look identical', () => {
            const host = jest.fn();
            registerAlertHost(host);
            setPlatform('ios');

            showAlert('Error', 'Failed to activate plan.');

            expect(host).toHaveBeenCalledTimes(1);
            expect(nativeAlert).not.toHaveBeenCalled();
        });

        it('stops dispatching once the host unmounts', () => {
            const host = jest.fn();
            registerAlertHost(host);
            registerAlertHost(null);
            setPlatform('web');

            showAlert('Error', 'after unmount');

            expect(host).not.toHaveBeenCalled();
            expect(platformAlert).toHaveBeenCalled(); // fell back
        });
    });

    describe('fallback when no host is mounted', () => {
        it('uses window.alert on web rather than the no-op RN Alert', () => {
            setPlatform('web');
            showAlert('Error', 'Something broke');
            expect(platformAlert).toHaveBeenCalledTimes(1);
            expect(platformAlert.mock.calls[0][0]).toContain('Something broke');
            expect(nativeAlert).not.toHaveBeenCalled();
        });

        it('uses the real Alert on native', () => {
            setPlatform('ios');
            showAlert('Error', 'Failed to save exercise.');
            expect(nativeAlert).toHaveBeenCalledWith('Error', 'Failed to save exercise.');
            expect(platformAlert).not.toHaveBeenCalled();
        });

        it('warns rather than throwing when no alert exists at all', () => {
            setPlatform('web');
            delete (globalThis as any).alert;
            showAlert('Error', 'Something broke');
            expect(warn).toHaveBeenCalled();
            expect(warn.mock.calls[0][0]).toContain('Something broke');
        });
    });
});
