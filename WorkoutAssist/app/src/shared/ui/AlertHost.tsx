import React, { useCallback, useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from './Theme';
import { registerAlertHost, AlertPayload } from './showAlert';

/**
 * Renders the app's branded alert dialog. Mount exactly once, at the app root.
 *
 * Alerts are queued rather than overwritten. Two failures landing together used
 * to mean the second silently replaced the first; queueing means every message
 * is actually seen.
 *
 * ── On the glass effect ────────────────────────────────────────────────────
 * True backdrop blur has no cross-platform primitive. `backdrop-filter` is CSS,
 * and react-native-web passes it through, so web — the platform this app
 * deploys to — gets real glass. Native has no equivalent without adding
 * `expo-blur`, which is not currently a dependency.
 *
 * Rather than add one for a dialog, native degrades to the same translucent
 * fill and specular gradients minus the blur, which still reads as glass
 * against the scrim. If native ever needs true blur, `expo-blur`'s BlurView
 * drops in behind `styles.card` without touching anything else here.
 */

/** backdrop-filter is web-only and absent from RN's ViewStyle types. */
const webGlass = (css: string): ViewStyle =>
    Platform.OS === 'web'
        ? ({ backdropFilter: css, WebkitBackdropFilter: css } as unknown as ViewStyle)
        : {};

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
                style={[styles.scrim, webGlass('blur(6px)')]}
                activeOpacity={1}
                onPress={dismiss}
                accessible={false}
            >
                {/* Swallow presses on the card so it does not dismiss itself. */}
                <TouchableOpacity
                    style={[styles.card, webGlass('blur(28px) saturate(150%)')]}
                    activeOpacity={1}
                    onPress={() => {}}
                    accessible={false}
                >
                    {/* Specular sheen: light catching the top-left edge. Purely
                        decorative, so it must never intercept touches. */}
                    <LinearGradient
                        colors={['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.04)', 'transparent']}
                        locations={[0, 0.35, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.9, y: 1 }}
                        style={styles.sheen}
                        pointerEvents="none"
                    />
                    {/* Crisp 1px highlight along the top edge — the detail that
                        reads as "glass" rather than "translucent panel". */}
                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.topHighlight}
                        pointerEvents="none"
                    />

                    <Text style={styles.title} accessibilityRole="header" testID="alert-title">
                        {current?.title}
                    </Text>

                    {current?.message ? (
                        <Text style={styles.message} testID="alert-message">
                            {current.message}
                        </Text>
                    ) : null}

                    <TouchableOpacity
                        onPress={dismiss}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel="Dismiss"
                        testID="alert-dismiss"
                        style={styles.buttonWrap}
                    >
                        <LinearGradient
                            colors={['#A445C4', Colors.brandPurple, '#7A1D93']}
                            locations={[0, 0.5, 1]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.button}
                        >
                            {/* Gloss across the upper half of the button. */}
                            <LinearGradient
                                colors={['rgba(255,255,255,0.28)', 'transparent']}
                                style={styles.buttonGloss}
                                pointerEvents="none"
                            />
                            <Text style={styles.buttonText}>OK</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    scrim: {
        flex: 1,
        backgroundColor: 'rgba(8,8,18,0.62)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 380,
        // Translucent rather than solid — the blur behind it is what sells the
        // glass, and on native the transparency alone still separates it from
        // the scrim.
        backgroundColor: 'rgba(32,30,56,0.72)',
        borderRadius: 28,
        paddingVertical: 30,
        paddingHorizontal: 26,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.16)',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.5,
        shadowRadius: 32,
        elevation: 16,
    },
    sheen: {
        ...StyleSheet.absoluteFillObject,
    },
    topHighlight: {
        position: 'absolute',
        top: 0,
        left: 24,
        right: 24,
        height: 1,
    },
    title: {
        color: Colors.white,
        fontSize: 21,
        fontWeight: '700',
        letterSpacing: -0.4,
    },
    message: {
        color: 'rgba(255,255,255,0.72)',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 10,
    },
    buttonWrap: {
        marginTop: 26,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: Colors.brandPurple,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
        elevation: 8,
    },
    button: {
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        borderRadius: 16,
    },
    buttonGloss: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
});
