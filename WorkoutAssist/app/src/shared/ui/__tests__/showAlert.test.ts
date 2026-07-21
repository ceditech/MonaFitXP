import { Platform, Alert } from 'react-native';
import { showAlert } from '../showAlert';

// The bug being pinned: react-native-web ships `class Alert { static alert() {} }`,
// so on web the RN Alert path is a silent no-op. These assert that web reaches the
// user by some other means, and that native still uses the real Alert.
describe('showAlert', () => {
    const originalOS = Platform.OS;
    let windowAlert: jest.Mock;
    let nativeAlert: jest.SpyInstance;
    let warn: jest.SpyInstance;

    beforeEach(() => {
        // This test environment provides `window` but no `window.alert`, so it is
        // assigned rather than spied on — which is precisely the case the guard in
        // showAlert exists to survive.
        windowAlert = jest.fn();
        (globalThis as any).alert = windowAlert;
        nativeAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
        warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
        delete (globalThis as any).alert;
        Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
    });

    const setPlatform = (os: string) =>
        Object.defineProperty(Platform, 'OS', { value: os, configurable: true });

    describe('on web', () => {
        beforeEach(() => setPlatform('web'));

        it('surfaces the message through window.alert', () => {
            showAlert('Sign Up Failed', 'An account with this email already exists.');
            expect(windowAlert).toHaveBeenCalledTimes(1);
            expect(windowAlert.mock.calls[0][0]).toContain('Sign Up Failed');
            expect(windowAlert.mock.calls[0][0]).toContain('already exists');
        });

        it('does not route through the no-op react-native Alert', () => {
            showAlert('Error', 'Failed to activate plan.');
            expect(nativeAlert).not.toHaveBeenCalled();
        });

        it('handles a title with no message', () => {
            showAlert('Selection Required');
            expect(windowAlert).toHaveBeenCalledWith('Selection Required');
        });

        it('falls back to console.warn when window.alert is unavailable', () => {
            delete (globalThis as any).alert;
            showAlert('Error', 'Something broke');
            expect(warn).toHaveBeenCalled();
            expect(warn.mock.calls[0][0]).toContain('Something broke');
        });
    });

    describe('on native', () => {
        beforeEach(() => setPlatform('ios'));

        it('delegates to the real react-native Alert', () => {
            showAlert('Error', 'Failed to save exercise.');
            expect(nativeAlert).toHaveBeenCalledWith('Error', 'Failed to save exercise.');
            expect(windowAlert).not.toHaveBeenCalled();
        });
    });
});
