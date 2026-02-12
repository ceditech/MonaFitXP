
/**
 * Standardized Firestore path for user entitlement records.
 * path: users/{uid}/entitlements/current
 */
export const ENTITLEMENT_DOC_PATH = (uid: string) => `users/${uid}/entitlements/current`;

export const ENTITLEMENTS_COLLECTION_PATH = (uid: string) => `users/${uid}/entitlements`;
