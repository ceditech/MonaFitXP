
// app/src/session/SessionProvider.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionState, SessionContextValue, SessionMode } from './types';
import { sessionStorage } from './sessionStorage';
import { auth } from '../firebase/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<SessionState>({
        uid: null,
        mode: 'none',
        isLoading: true,
    });

    useEffect(() => {
        // Listen to Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
            if (user) {
                // Authenticated user
                setState({
                    uid: user.uid,
                    mode: 'authenticated',
                    isLoading: false,
                });
            } else {
                // No authenticated user, check for guest session
                await bootstrapGuestSession();
            }
        });

        return () => unsubscribe();
    }, []);

    const bootstrapGuestSession = async () => {
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

    const signInEmailPass = async (email: string, password: string): Promise<void> => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will handle state update
        } catch (error: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw new Error(mapAuthError(error.code));
        }
    };

    const signUpEmailPass = async (email: string, password: string): Promise<void> => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will handle state update
        } catch (error: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw new Error(mapAuthError(error.code));
        }
    };

    const signOut = async () => {
        if (state.mode === 'authenticated') {
            await firebaseSignOut(auth);
            // onAuthStateChanged will handle state update
        } else if (state.mode === 'guest') {
            await sessionStorage.removeGuestUid();
            setState({
                uid: null,
                mode: 'none',
                isLoading: false,
            });
        }
    };

    return (
        <SessionContext.Provider value={{
            session: state,
            ensureGuestSession,
            signInEmailPass,
            signUpEmailPass,
            signOut
        }}>
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

// Helper to map Firebase Auth error codes to friendly messages
function mapAuthError(code: string): string {
    switch (code) {
        case 'auth/invalid-email':
            return 'Invalid email address.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        default:
            return 'Authentication failed. Please try again.';
    }
}
