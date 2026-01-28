
// app/src/app/context/SessionContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { GuestSessionManager } from './GuestSessionManager';

interface SessionContextType {
    uid: string | null;
    isLoading: boolean;
    createGuest: () => Promise<void>;
    signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({} as SessionContextType);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [uid, setUid] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        const session = await GuestSessionManager.getSession();
        if (session.uid) {
            setUid(session.uid);
        }
        setIsLoading(false);
    };

    const createGuest = async () => {
        setIsLoading(true);
        const newUid = await GuestSessionManager.createGuestSession();
        setUid(newUid);
        setIsLoading(false);
    };

    const signOut = async () => {
        await GuestSessionManager.clearSession();
        setUid(null);
    };

    return (
        <SessionContext.Provider value={{ uid, isLoading, createGuest, signOut }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
