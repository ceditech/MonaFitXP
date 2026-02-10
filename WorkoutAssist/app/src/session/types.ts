
// app/src/session/types.ts

export type SessionMode = 'guest' | 'authenticated' | 'none';

export interface SessionState {
    uid: string | null;
    mode: SessionMode;
    isLoading: boolean;
    onboardingCompleted?: boolean;
    userProfile?: any; // Avoiding circular dependency if possible, or use a specific interface
}

export interface SessionContextValue {
    session: SessionState;
    ensureGuestSession: () => Promise<string>;
    signInEmailPass: (email: string, password: string) => Promise<void>;
    signUpEmailPass: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}
