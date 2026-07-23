import { buildConsentRecord, hasRequiredConsents, ConsentChoices } from '../consent.model';
import { LEGAL_VERSION } from '../../../legal/content';

const choices = (over: Partial<ConsentChoices> = {}): ConsentChoices => ({
    disclaimer: true,
    privacyTerms: true,
    healthData: true,
    marketing: false,
    ...over,
});

describe('hasRequiredConsents', () => {
    it('requires both disclaimer and privacy/terms', () => {
        expect(hasRequiredConsents(choices())).toBe(true);
        expect(hasRequiredConsents(choices({ disclaimer: false }))).toBe(false);
        expect(hasRequiredConsents(choices({ privacyTerms: false }))).toBe(false);
    });

    it('does not require the optional consents', () => {
        expect(hasRequiredConsents(choices({ healthData: false, marketing: false }))).toBe(true);
    });
});

describe('buildConsentRecord', () => {
    const now = new Date('2026-07-22T12:00:00.000Z');

    it('records each choice with a version and timestamp', () => {
        const rec = buildConsentRecord(choices({ marketing: true }), now);

        expect(rec.healthDisclaimer).toEqual({
            granted: true, version: LEGAL_VERSION.disclaimer, grantedAt: now.toISOString(),
        });
        expect(rec.privacyPolicy).toEqual({
            granted: true, version: LEGAL_VERSION.privacy, grantedAt: now.toISOString(),
        });
        expect(rec.marketing.granted).toBe(true);
        expect(rec.updatedAt).toBe(now.toISOString());
    });

    it('stores declined consents as granted:false, not omitted', () => {
        const rec = buildConsentRecord(choices({ healthData: false, marketing: false }), now);
        expect(rec.healthDataProcessing.granted).toBe(false);
        expect(rec.healthDataProcessing.version).toBeDefined();
        expect(rec.marketing.granted).toBe(false);
    });

    it('ties the privacy consent to the current privacy policy version', () => {
        // If the policy is bumped, new consents must record the new version so
        // stale acceptances can be detected and re-prompted.
        const rec = buildConsentRecord(choices(), now);
        expect(rec.privacyPolicy.version).toBe(LEGAL_VERSION.privacy);
    });
});
