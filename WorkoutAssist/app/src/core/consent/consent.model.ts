import { LEGAL_VERSION } from '../../legal/content';

/**
 * Consent record — stored at users/{uid}/consents/current.
 *
 * Each consent is stored as a versioned entry, not a bare boolean, so that when a
 * document or the consent schema changes we can tell which version the user
 * agreed to and re-prompt only those on an older one. A boolean cannot answer
 * "did they accept the CURRENT privacy policy?".
 */

export interface ConsentEntry {
    granted: boolean;
    /** Version of the document/schema this decision was made against. */
    version: string;
    /** ISO timestamp of when the decision was recorded. */
    grantedAt: string;
}

export interface ConsentRecord {
    /** Acknowledged the health & safety disclaimer. Required to proceed. */
    healthDisclaimer: ConsentEntry;
    /** Accepted the privacy policy and terms of service. Required to proceed. */
    privacyPolicy: ConsentEntry;
    /**
     * GDPR Art. 9 explicit consent to process injury/health information.
     * Optional — if not granted, the app must not collect or store health data,
     * but must remain fully usable.
     */
    healthDataProcessing: ConsentEntry;
    /** Optional marketing/product emails. Default off. */
    marketing: ConsentEntry;
    updatedAt: string;
}

/** The user's raw choices from the consent step. */
export interface ConsentChoices {
    disclaimer: boolean;
    privacyTerms: boolean;
    healthData: boolean;
    marketing: boolean;
}

/** Bumped when the meaning of the health-data / marketing consents changes. */
export const CONSENT_SCHEMA_VERSION = 'v1';

/** The two required consents; onboarding cannot complete without both. */
export function hasRequiredConsents(choices: ConsentChoices): boolean {
    return choices.disclaimer && choices.privacyTerms;
}

/**
 * Build the stored record from the user's choices. Pure (time injectable) so the
 * versioning and shape can be unit-tested without Firestore.
 */
export function buildConsentRecord(
    choices: ConsentChoices,
    now: Date = new Date(),
): ConsentRecord {
    const at = now.toISOString();
    const entry = (granted: boolean, version: string): ConsentEntry => ({
        granted,
        version,
        grantedAt: at,
    });

    return {
        healthDisclaimer: entry(choices.disclaimer, LEGAL_VERSION.disclaimer),
        // One acceptance covers privacy + terms; keyed to the privacy version.
        privacyPolicy: entry(choices.privacyTerms, LEGAL_VERSION.privacy),
        healthDataProcessing: entry(choices.healthData, CONSENT_SCHEMA_VERSION),
        marketing: entry(choices.marketing, CONSENT_SCHEMA_VERSION),
        updatedAt: at,
    };
}
