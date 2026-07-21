import React, { useCallback, useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors } from './Theme';
import { registerAlertHost, AlertPayload } from './showAlert';

/**
 * Renders the app's branded alert dialog. Mount exactly once, at the app root.
 *
 * Replaces the browser's native alert(), which was a stopgap to make failures
 * visible at all: it is unbranded, unstyled, blocks the JS thread, and has no
 * equivalent on native — so the app would have looked like two different
 * products depending on platform.
 *
 * Alerts are queued rather than overwritten. Two failures landing together used
 * to mean the second silently replaced the first; queueing means every message
 * is actually seen.
 */
export const AlertHost: React.FC = () => {
    const [queue, setQueue] = useState<AlertPayload[]>([]);
    const current = queue[0];

    useEffect(() => {
        registerAlertHost(payload => setQueue(q => [...q, payload]));
        return () => registerAlertHost(null);
    }, []);

    const dismiss = useCallback(() => setQueue(q => q.slice(1)), []);

    // Escape-to-dismiss is expected on web; on native the hardware back button
    // is handled by Modal's onRequestClose instead.
    useEffect(() => {
        if (Platform.OS !== 'web' || !current) return;
        const g = globalThis as {
            addEventListener?: (t: string, h: (e: any) => void) => void;
            removeEventListener?: (t: string, h: (e: any) => void) => void;
        };
        if (typeof g?.addEventListener !== 'function') return;
        const onKey = (e: any) => {
            if (e?.key === 'Escape') dismiss();
        };
        g.addEventListener('keydown', onKey);
        return () => g.removeEventListener?.('keydown', onKey);
    }, [current, dismiss]);

    return (
        <Modal
            visible={!!current}
            transparent
            animationType="fade"
            onRequestClose={dismiss}
            accessibilityViewIsModal
            testID="alert-host-modal"
        >
            {/* Tapping the scrim dismisses, matching platform convention. */}
            <TouchableOpacity
                style={styles.scrim}
                activeOpacity={1}
                onPress={dismiss}
                accessible={false}
            >
                {/* Swallow presses on the card so it does not dismiss itself. */}
                <TouchableOpacity
                    style={styles.card}
                    activeOpacity={1}
                    onPress={() => {}}
                    accessible={false}
                >
                    <Text style={styles.title} accessibilityRole="header" testID="alert-title">
                        {current?.title}
                    </Text>

                    {current?.message ? (
                        <Text style={styles.message} testID="alert-message">
                            {current.message}
                        </Text>
                    ) : null}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={dismiss}
                        accessibilityRole="button"
                        accessibilityLabel="Dismiss"
                        testID="alert-dismiss"
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    scrim: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: Colors.brandDarkBlue,
        borderRadius: 24,
        paddingVertical: 28,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        // Elevation reads as "above the app" on both platforms.
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.45,
        shadowRadius: 24,
        elevation: 12,
    },
    title: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    message: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        lineHeight: 23,
        marginTop: 10,
    },
    button: {
        marginTop: 24,
        backgroundColor: Colors.brandPurple,
        borderRadius: 14,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.brandPurple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 17,
        fontWeight: '700',
    },
});
