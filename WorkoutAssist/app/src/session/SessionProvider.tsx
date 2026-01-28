
// app/src/session/SessionProvider.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionState, SessionContextValue, SessionMode } from './types';
import { sessionStorage } from './sessionStorage';

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<SessionState>({
        uid: null,
        mode: 'none',
        isLoading: true,
    });

    useEffect(() => {
        bootstrapAsync();
    }, []);

    const bootstrapAsync = async () => {
        try {
            const guestUid = await sessionStorage.getGuestUid();
            if (guestUid) {
                setState({
                    uid: guestUid,
                    mode: 'guest',
                    isLoading: false,
                });
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        } catch (e) {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    };

    const ensureGuestSession = async (): Promise<string> => {
        setState(prev => ({ ...prev, isLoading: true }));

        let uid = await sessionStorage.getGuestUid();
        if (!uid) {
            uid = sessionStorage.generateUid();
            await sessionStorage.saveGuestUid(uid);
        }

        setState({
            uid,
            mode: 'guest',
            isLoading: false,
        });

        return uid;
    };

    const signOut = async () => {
        await sessionStorage.removeGuestUid();
        setState({
            uid: null,
            mode: 'none',
            isLoading: false,
        });
    };

    return (
        <SessionContext.Provider value={{ session: state, ensureGuestSession, signOut }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
