
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { useSession } from '../../session/SessionProvider';
import { db } from '../../firebase/firebase';
import { Entitlement, INITIAL_ENTITLEMENT_STATE } from './entitlement.model';
import { ENTITLEMENT_DOC_PATH } from './entitlement.paths';

interface EntitlementContextValue {
    entitlement: Entitlement;
    isPro: boolean;
    loading: boolean;
    error: string | null;
}

const EntitlementContext = createContext<EntitlementContextValue | undefined>(undefined);

const DELAYED_FALLBACK_MS = 3000;

export const EntitlementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { session } = useSession();
    const { uid } = session;

    const [entitlement, setEntitlement] = useState<Entitlement>(INITIAL_ENTITLEMENT_STATE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!uid) {
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
                    setEntitlement(snapshot.data() as Entitlement);
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
    }, [uid]);

    const isPro = useMemo(() => {
        return entitlement.plan === 'PRO' && (entitlement.status === 'active' || entitlement.status === 'trialing');
    }, [entitlement]);

    return (
        <EntitlementContext.Provider value={{ entitlement, isPro, loading, error }}>
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
