
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
    signOut: () => Promise<void>;
}
