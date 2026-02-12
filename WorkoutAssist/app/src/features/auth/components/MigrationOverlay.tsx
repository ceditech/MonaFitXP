import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { useSession } from '../../../session/SessionProvider';
import { db } from '../../../firebase/firebase';
import { migrateGuestWorkoutsToUser } from '../../../lib/migrateGuestToAccount';
import * as GuestStore from '../../../lib/guestStore';
import { Colors } from '../../../shared/ui/Theme';
import { Ionicons } from '@expo/vector-icons';

/**
 * MigrationOverlay monitors the migration state and provides UI feedback
 * after a user authenticates.
 */
export const MigrationOverlay: React.FC = () => {
    const { session } = useSession();
    const [status, setStatus] = useState<GuestStore.MigrationState>({ status: 'idle' });
    const [visible, setVisible] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    const refreshStatus = useCallback(async () => {
        const state = await GuestStore.getMigrationState();
        setStatus(state);

        const isVisible = state.status === 'pending' || state.status === 'failed';
        if (isVisible !== visible) {
            setVisible(isVisible);
            Animated.timing(fadeAnim, {
                toValue: isVisible ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, fadeAnim]);

    const runMigration = useCallback(async () => {
        if (session.mode === 'authenticated' && session.uid) {
            const currentState = await GuestStore.getMigrationState();

            // Only trigger if we have data to migrate and haven't completed/started yet
            const workouts = await GuestStore.readGuestWorkouts();
            if (workouts.length === 0) return;

            if (currentState.status === 'idle' || currentState.status === 'failed') {
                try {
                    await migrateGuestWorkoutsToUser({
                        uid: session.uid,
                        firestore: db
                    });
                } catch (error) {
                    console.error('[MigrationOverlay] Migration triggered error', error);
                } finally {
                    await refreshStatus();
                }
            }
        }
    }, [session.mode, session.uid, refreshStatus]);

    // Initial trigger and polling
    useEffect(() => {
        runMigration();
        refreshStatus();

        // Polling as a fallback since storage updates might happen outside of React
        const interval = setInterval(refreshStatus, 2000);
        return () => clearInterval(interval);
    }, [runMigration, refreshStatus]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.content}>
                {status.status === 'pending' ? (
                    <View style={styles.row}>
                        <ActivityIndicator color={Colors.brandPurple} style={styles.icon} />
                        <Text style={styles.text}>Importing your guest workouts...</Text>
                    </View>
                ) : status.status === 'failed' ? (
                    <View style={styles.errorContainer}>
                        <View style={styles.row}>
                            <Ionicons name="alert-circle" size={20} color="#ff4444" style={styles.icon} />
                            <Text style={styles.errorText}>
                                Import failed: {status.lastError || 'Unknown error'}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.retryBtn} onPress={runMigration}>
                            <Ionicons name="refresh" size={14} color="#fff" style={styles.retryIcon} />
                            <Text style={styles.retryText}>Retry Import</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 9999,
        backgroundColor: 'rgba(10, 20, 40, 0.95)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    content: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
    },
    text: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    errorContainer: {
        flexDirection: 'column',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
    },
    retryBtn: {
        backgroundColor: Colors.brandPurple,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginTop: 10,
        marginLeft: 32,
    },
    retryIcon: {
        marginRight: 6,
    },
    retryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
});
