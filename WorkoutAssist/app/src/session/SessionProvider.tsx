
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
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

/**
 * Shape returned by syncUserProfile. Deliberately open-ended — the Firestore doc
 * carries far more than the session needs — but the fields the session actually
 * reads are named so a typo or a missing plumb-through is a compile error rather
 * than a silently undefined value.
 */
interface SyncedProfile {
    onboardingCompleted?: boolean;
    onboardingSkippedAt?: string;
    [key: string]: any;
}

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
                const profile = await syncUserProfile(user.uid);
                setState({
                    uid: user.uid,
                    mode: 'authenticated',
                    isLoading: false,
                    onboardingCompleted: profile.onboardingCompleted,
                    onboardingSkippedAt: profile.onboardingSkippedAt,
                    userProfile: profile
                });
            } else {
                // No authenticated user, check for guest session
                await bootstrapGuestSession();
            }
        });

        return () => unsubscribe();
    }, []);

    const syncUserProfile = async (uid: string): Promise<SyncedProfile> => {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            const defaults = {
                uid,
                name: 'Fitness Enthusiast',
                onboardingCompleted: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };
            await setDoc(userRef, defaults);
            return defaults;
        }
    };

    const refreshProfile = async () => {
        if (state.uid && state.mode === 'authenticated') {
            const profile = await syncUserProfile(state.uid);
            setState(prev => ({
                ...prev,
                onboardingCompleted: profile.onboardingCompleted,
                onboardingSkippedAt: profile.onboardingSkippedAt,
                userProfile: profile
            }));
        }
    };

    const bootstrapGuestSession = async () => {
        try {
            const guestUid = await sessionStorage.getGuestUid();
            if (guestUid) {
                setState({
                    uid: guestUid,
                    mode: 'guest',
                    isLoading: false,
                    onboardingCompleted: true, // Guest mode skips core onboarding
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
            onboardingCompleted: true
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
        // Clear any stored guest session FIRST, before firebaseSignOut fires
        // onAuthStateChanged(null) → bootstrapGuestSession. Otherwise a lingering
        // guest uid gets restored as a guest session, which also renders the main
        // navigator — so signing out (or deleting an account) never leaves the
        // current screen. That was the cause of the Delete Account spinner hang.
        try {
            await sessionStorage.removeGuestUid();
        } catch (e) {
            console.warn('[Session] removeGuestUid failed during signOut', e);
        }

        // Use the live SDK state, not React `state.mode` (which can be stale, and
        // is already null when the user was deleted server-side).
        try {
            if (auth.currentUser) {
                await firebaseSignOut(auth);
            }
        } catch (e) {
            console.warn('[Session] firebaseSignOut failed; clearing local session anyway', e);
        }

        // Land deterministically on the fully signed-out state rather than waiting
        // on onAuthStateChanged, which may not fire (deleted user) or may keep the
        // previous mode (bootstrapGuestSession's no-guest branch).
        setState({ uid: null, mode: 'none', isLoading: false });
    };

    return (
        <SessionContext.Provider value={{
            session: state,
            ensureGuestSession,
            signInEmailPass,
            signUpEmailPass,
            signOut,
            refreshProfile
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
