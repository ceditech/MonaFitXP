
export type PlanType = 'FREE' | 'PRO';
export type EntitlementStatus = 'active' | 'inactive' | 'trialing' | 'past_due';

export interface Entitlement {
    plan: PlanType;
    status: EntitlementStatus;
    limits?: {
        workoutsPerMonth?: number;
        aiGenerationsPerMonth?: number;
    };
    updatedAt?: any; // Firestore Timestamp
    source?: 'system' | 'stripe' | 'admin';
}

export const INITIAL_ENTITLEMENT_STATE: Entitlement = {
    plan: 'FREE',
    status: 'inactive',
};
