/**
 * Legal content — single source of truth for the in-app Privacy Policy, Terms of
 * Service, and Health Disclaimer.
 *
 * ⚠️ DRAFT. These are good-faith templates written to match what the app actually
 * collects and does. They are NOT a substitute for legal review — have counsel
 * review them before a public launch, especially the health-data (GDPR Art. 9)
 * handling. Everything a reviewer or you must fill in lives in LEGAL_CONFIG below,
 * so there is exactly one place to edit.
 *
 * Versioning: each doc carries a `version`. Consent records
 * (users/{uid}/consents/current) store the version the user accepted, so when a
 * document changes you bump its version here and can re-prompt only users on an
 * older one. Bump the version whenever the substance changes.
 */

export const LEGAL_CONFIG = {
    appName: 'WorkoutAssist',
    // TODO(owner): the legal entity or individual operating the app.
    companyName: '[Your legal name or company]',
    // TODO(owner): a monitored contact address for privacy/data requests.
    contactEmail: '[privacy@yourdomain.com]',
    // TODO(owner): the governing-law jurisdiction for the Terms.
    jurisdiction: '[Your country / state]',
    // Bump when any document's substance changes.
    effectiveDate: '2026-07-22',
};

export type LegalDocKey = 'privacy' | 'terms' | 'disclaimer';

export interface LegalSection {
    heading?: string;
    /** Each string is a paragraph or bullet; rendered in order. */
    body: string[];
}

export interface LegalDoc {
    key: LegalDocKey;
    title: string;
    version: string;
    effectiveDate: string;
    intro?: string;
    sections: LegalSection[];
}

/** The version each consent toggle records. Keep in step with the docs below. */
export const LEGAL_VERSION: Record<LegalDocKey, string> = {
    privacy: 'v1',
    terms: 'v1',
    disclaimer: 'v1',
};

const A = LEGAL_CONFIG.appName;
const CO = LEGAL_CONFIG.companyName;
const EMAIL = LEGAL_CONFIG.contactEmail;

export const PRIVACY_POLICY: LegalDoc = {
    key: 'privacy',
    title: 'Privacy Policy',
    version: LEGAL_VERSION.privacy,
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    intro: `This policy explains what ${A} collects, why, and the choices and rights you have. ${CO} is the data controller.`,
    sections: [
        {
            heading: 'Information we collect',
            body: [
                'Account: your email address, and a display name if you provide one.',
                'Fitness profile: your goal, experience level, available equipment, weekly schedule, preferred training days, target session length, and time zone.',
                'Health information: any injury or focus areas you select, and — where applicable — your date of birth. This is special-category (health) data and we process it only with your explicit consent (see "Legal bases").',
                'Activity: the workouts, exercises, sets, reps, weights, and dates you log, and progress metrics we derive from them.',
                'Technical and usage data: app analytics (via Google Analytics) and crash diagnostics (via Sentry), which include device and event information but are not used to identify you personally.',
            ],
        },
        {
            heading: 'How we use your information',
            body: [
                'To provide the service: create your account, generate and personalize training plans, and track your progress.',
                'For safety: tailor recommendations to your experience and injury information so we do not suggest inappropriate exercises.',
                'To maintain and improve the app: diagnose crashes and understand which features are used.',
            ],
        },
        {
            heading: 'Legal bases (GDPR)',
            body: [
                'Contract: processing needed to provide the service you asked for.',
                'Consent: for health information (Art. 9(2)(a)) and for any optional marketing. You can withdraw consent at any time.',
                'Legitimate interests: keeping the app secure and improving it, balanced against your rights.',
            ],
        },
        {
            heading: 'Who we share it with',
            body: [
                'Service providers who process data on our behalf: Google Firebase (authentication, database, functions, hosting), Google Analytics, and Sentry (crash reporting).',
                'Your data is stored on Google Cloud infrastructure in the United States.',
                'We do not sell your personal data, and we do not use your health information to target third-party advertising.',
            ],
        },
        {
            heading: 'Retention',
            body: [
                'We keep your data while your account is active. When you delete your account, your profile and all associated data are permanently removed.',
            ],
        },
        {
            heading: 'Your rights',
            body: [
                'You can access and export your data, and permanently delete your account and all its data, from Settings → Data & Privacy.',
                'Depending on where you live, you may also have rights to correct data or object to certain processing. Contact us to exercise these.',
                `To make a request or ask a question, contact ${EMAIL}.`,
            ],
        },
        {
            heading: 'Children',
            body: [
                `${A} is not intended for children under 16. We do not knowingly collect data from children under 16, and the app is designed to prevent it.`,
            ],
        },
        {
            heading: 'Changes',
            body: [
                'If we make material changes to this policy we will update the version and, where required, ask you to review the changes.',
            ],
        },
    ],
};

export const TERMS_OF_SERVICE: LegalDoc = {
    key: 'terms',
    title: 'Terms of Service',
    version: LEGAL_VERSION.terms,
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    intro: `These terms govern your use of ${A}. By creating an account or using the app, you agree to them.`,
    sections: [
        {
            heading: 'Eligibility',
            body: ['You must be at least 16 years old to use the app.'],
        },
        {
            heading: 'Your account',
            body: [
                'You are responsible for keeping your login secure and for activity under your account.',
                'Provide accurate information, particularly health information, so the app can give you safe recommendations.',
            ],
        },
        {
            heading: 'Acceptable use',
            body: [
                'Do not misuse the service, attempt to access other users’ data, disrupt the service, or use it for any unlawful purpose.',
            ],
        },
        {
            heading: 'Not medical advice',
            body: [
                `${A} provides general fitness information, not medical advice. See the Health Disclaimer. Always consult a qualified professional before starting a new exercise program.`,
            ],
        },
        {
            heading: 'The service is provided “as is”',
            body: [
                'We work to keep the app available and accurate, but we provide it without warranties. To the extent permitted by law, we are not liable for indirect or consequential damages arising from your use of the app.',
            ],
        },
        {
            heading: 'Termination',
            body: [
                'You may delete your account at any time from Settings. We may suspend or end access if these terms are violated.',
            ],
        },
        {
            heading: 'Governing law',
            body: [`These terms are governed by the laws of ${LEGAL_CONFIG.jurisdiction}.`],
        },
        {
            heading: 'Contact',
            body: [`Questions about these terms: ${EMAIL}.`],
        },
    ],
};

export const HEALTH_DISCLAIMER: LegalDoc = {
    key: 'disclaimer',
    title: 'Health & Safety Disclaimer',
    version: LEGAL_VERSION.disclaimer,
    effectiveDate: LEGAL_CONFIG.effectiveDate,
    intro: `${A} is a fitness tool, not a medical service. Please read this before you train.`,
    sections: [
        {
            body: [
                'The content in this app is for general informational and educational purposes only and is not medical advice.',
                'Consult a physician or qualified health professional before beginning any exercise program, especially if you have an injury, a medical condition, are pregnant, or have been inactive.',
                'Stop exercising and seek medical attention if you feel pain, dizziness, shortness of breath, or any other warning sign.',
                'You are responsible for exercising within your own limits. By using the app you accept the inherent risks of physical exercise.',
                'In an emergency, call your local emergency number immediately.',
            ],
        },
    ],
};

export const LEGAL_DOCS: Record<LegalDocKey, LegalDoc> = {
    privacy: PRIVACY_POLICY,
    terms: TERMS_OF_SERVICE,
    disclaimer: HEALTH_DISCLAIMER,
};
