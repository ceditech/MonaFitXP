import { Platform, Share } from 'react-native';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/firebase';

/**
 * Client wrappers for the account callables. Thin on purpose — the traversal and
 * the auth check live server-side (functions/src/account.ts); the client only
 * invokes and delivers.
 */

/** GDPR Art. 17. The server deletes the caller's own data + Auth record. */
export async function requestAccountDeletion(): Promise<void> {
    const fn = httpsCallable(functions, 'deleteAccount');
    await fn();
}

/** GDPR Art. 20. Returns the caller's full data tree as a plain object. */
export async function requestDataExport(): Promise<unknown> {
    const fn = httpsCallable<unknown, unknown>(functions, 'exportMyData');
    const res = await fn();
    return res.data;
}

/**
 * Hand the exported JSON to the user. Web downloads a file (the real Art. 20
 * deliverable on the platform this app ships to); native falls back to the OS
 * share sheet, which has no faithful "download" equivalent.
 */
export async function deliverExport(payload: unknown): Promise<void> {
    const json = JSON.stringify(payload, null, 2);
    const filename = `workoutassist-data-${new Date().toISOString().slice(0, 10)}.json`;

    if (Platform.OS === 'web') {
        const g = globalThis as any;
        const blob = new g.Blob([json], { type: 'application/json' });
        const url = g.URL.createObjectURL(blob);
        const a = g.document.createElement('a');
        a.href = url;
        a.download = filename;
        g.document.body.appendChild(a);
        a.click();
        a.remove();
        g.URL.revokeObjectURL(url);
        return;
    }

    await Share.share({ message: json, title: filename });
}
