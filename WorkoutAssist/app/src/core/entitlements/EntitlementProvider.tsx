
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { useSession } from '../../session/SessionProvider';
import { db } from '../../firebase/firebase';
import {
    Entitlement,
    PlanTier,
    INITIAL_ENTITLEMENT_STATE,
    normalizeEntitlement,
    deriveIsPro,
    deriveIsPlus,
} from './entitlement.model';
import { ENTITLEMENT_DOC_PATH } from './entitlement.paths';

interface EntitlementContextValue {
    entitlement: Entitlement;
    tier: PlanTier;
    isPro: boolean;
    isPlus: boolean;
    loading: boolean;
    error: string | null;
}

const EntitlementContext = createContext<EntitlementContextValue | undefined>(undefined);

const DELAYED_FALLBACK_MS = 3000;

export const EntitlementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { session } = useSession();
    const { uid, mode } = session;

    const [entitlement, setEntitlement] = useState<Entitlement>(INITIAL_ENTITLEMENT_STATE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Guests have no Firebase auth — a Firestore subscription would only
        // produce permission-denied errors. They are always FREE tier.
        if (!uid || mode !== 'authenticated') {
            setEntitlement(INITIAL_ENTITLEMENT_STATE);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // Path Source of Truth: users/{uid}/entitlements/current
        const docRef = doc(db, ENTITLEMENT_DOC_PATH(uid));

        let receivedData = false;

        const unsubscribe = onSnapshot(
            docRef,
            (snapshot) => {
                receivedData = true;
                if (snapshot.exists()) {
                    setEntitlement(normalizeEntitlement(snapshot.data()));
                } else {
                    // Handle missing doc (e.g., right after signup)
                    console.warn(`[Entitlement] Doc missing at ${ENTITLEMENT_DOC_PATH(uid)}`);
                    setEntitlement(INITIAL_ENTITLEMENT_STATE);
                }
                setLoading(false);
            },
            (err) => {
                console.error('[Entitlement] Subscription error:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        // Race condition protection: if doc takes too long to appear (Cloud Function delay),
        // fallback to FREE so user isn't stuck on spinner forever.
        const fallbackTimer = setTimeout(() => {
            if (!receivedData && loading) {
                console.warn('[Entitlement] Falling back to FREE due to delay');
                setEntitlement(INITIAL_ENTITLEMENT_STATE);
                setLoading(false);
            }
        }, DELAYED_FALLBACK_MS);

        return () => {
            unsubscribe();
            clearTimeout(fallbackTimer);
        };
    }, [uid, mode]);

    const isPro = useMemo(() => deriveIsPro(entitlement), [entitlement]);
    const isPlus = useMemo(() => deriveIsPlus(entitlement), [entitlement]);

    return (
        <EntitlementContext.Provider
            value={{ entitlement, tier: entitlement.tier, isPro, isPlus, loading, error }}
        >
            {children}
        </EntitlementContext.Provider>
    );
};

export const useEntitlement = () => {
    const context = useContext(EntitlementContext);
    if (context === undefined) {
        throw new Error('useEntitlement must be used within an EntitlementProvider');
    }
    return context;
};
