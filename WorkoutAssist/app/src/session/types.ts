
// app/src/session/types.ts

export type SessionMode = 'guest' | 'authenticated' | 'none';

export interface SessionState {
    uid: string | null;
    mode: SessionMode;
    isLoading: boolean;
}

export interface SessionContextValue {
    session: SessionState;
    ensureGuestSession: () => Promise<string>;
    signInEmailPass: (email: string, password: string) => Promise<void>;
    signUpEmailPass: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}
