import { Platform } from 'react-native';

// initAppCheck reads recaptchaV3SiteKey at import time, so each test resets the
// module registry and re-requires with the desired config. The App Check mock
// must therefore be fetched from the SAME (post-reset) registry as the code
// under test — a top-level import would be a different instance.
const setup = (os: string, siteKey: string) => {
    jest.resetModules();
    Object.defineProperty(Platform, 'OS', { value: os, configurable: true });
    jest.doMock('../firebaseConfig', () => ({ firebaseConfig: {}, recaptchaV3SiteKey: siteKey }));
    jest.doMock('firebase/app-check', () => ({
        initializeAppCheck: jest.fn(() => ({})),
        ReCaptchaV3Provider: jest.fn(function ReCaptchaV3Provider() {}),
    }));
    const { initAppCheck } = require('../appCheck');
    const { initializeAppCheck } = require('firebase/app-check');
    return { initAppCheck, initializeAppCheck };
};

describe('initAppCheck', () => {
    const originalOS = Platform.OS;
    afterEach(() => {
        Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
    });

    it('does nothing on native, even with a key set', () => {
        const { initAppCheck, initializeAppCheck } = setup('ios', 'key-123');
        initAppCheck({});
        expect(initializeAppCheck).not.toHaveBeenCalled();
    });

    it('does nothing on web when no key is configured', () => {
        const { initAppCheck, initializeAppCheck } = setup('web', '');
        initAppCheck({});
        expect(initializeAppCheck).not.toHaveBeenCalled();
    });

    it('initializes App Check on web when a key is configured', () => {
        const { initAppCheck, initializeAppCheck } = setup('web', 'key-123');
        initAppCheck({});
        expect(initializeAppCheck).toHaveBeenCalledTimes(1);
    });

    it('never throws if initialization fails', () => {
        const { initAppCheck, initializeAppCheck } = setup('web', 'key-123');
        (initializeAppCheck as jest.Mock).mockImplementationOnce(() => {
            throw new Error('recaptcha unavailable');
        });
        expect(() => initAppCheck({})).not.toThrow();
    });
});
