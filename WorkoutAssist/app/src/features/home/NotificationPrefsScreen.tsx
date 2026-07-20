
// app/src/features/home/NotificationPrefsScreen.tsx
import React, { useState, useEffect } from 'react';
import { track } from '../../lib/analytics';
import {
    View,
    Text,
    Switch,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    StyleSheet,
    TextInput
} from 'react-native';
import { useSession } from '../../session/SessionProvider';
import { useWorkoutRepo } from '../../repositories';
import { Colors } from '../../shared/ui/Theme';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const NotificationPrefsScreen = ({ navigation }: any) => {
    const { session } = useSession();
    const repo = useWorkoutRepo();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    const [remindersEnabled, setRemindersEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState('09:00');
    const [reminderDays, setReminderDays] = useState<string[]>([]);

    useEffect(() => {
        loadPreferences();
        track('notif_prefs_viewed', { uid: session.uid });
    }, []);

    const loadPreferences = async () => {
        if (!session.uid) return;

        try {
            setError(null);
            const profile = await repo.getUserProfile(session.uid);

            if (profile?.notificationPrefs) {
                setRemindersEnabled(profile.notificationPrefs.remindersEnabled);
                setReminderTime(profile.notificationPrefs.reminderTime);
                setReminderDays(profile.notificationPrefs.reminderDays);
            }
        } catch (err) {
            console.error('[NotificationPrefs] load error:', err);
            setError('Failed to load preferences');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (value: boolean) => {
        setRemindersEnabled(value);
        track('notif_toggle_changed', { enabled: value });
    };

    const handleTimeChange = (text: string) => {
        setReminderTime(text);
        track('notif_time_changed', { time: text });
    };

    const toggleDay = (day: string) => {
        const newDays = reminderDays.includes(day)
            ? reminderDays.filter(d => d !== day)
            : [...reminderDays, day];
        setReminderDays(newDays);
        track('notif_days_changed', { countDays: newDays.length });
    };

    const handleSave = async () => {
        if (!session.uid) return;

        setSaving(true);
        track('notif_prefs_saved', {
            remindersEnabled,
            reminderTime,
            dayCount: reminderDays.length
        });

        try {
            await repo.saveUserProfile(session.uid, {
                notificationPrefs: {
                    remindersEnabled,
                    reminderTime,
                    reminderDays
                }
            });

            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (err) {
            console.error('[NotificationPrefs] save error:', err);
            setError('Failed to save preferences');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (error && !remindersEnabled) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadPreferences}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Notification Preferences</Text>
                    <Text style={styles.subtitle}>Configure workout reminders</Text>
                </View>

                {/* Toggle Section */}
                <View style={styles.section}>
                    <View style={styles.toggleRow}>
                        <View>
                            <Text style={styles.toggleLabel}>Workout reminders</Text>
                            <Text style={styles.toggleHint}>Get notified on your workout days</Text>
                        </View>
                        <Switch
                            value={remindersEnabled}
                            onValueChange={handleToggle}
                            trackColor={{ false: 'rgba(255,255,255,0.1)', true: Colors.primary }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Time Picker (conditional) */}
                {remindersEnabled && (
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Reminder time</Text>
                        <TextInput
                            style={styles.timeInput}
                            value={reminderTime}
                            onChangeText={handleTimeChange}
                            placeholder="09:00"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            keyboardType="numbers-and-punctuation"
                        />
                    </View>
                )}

                {/* Day Chips (conditional) */}
                {remindersEnabled && (
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Reminder days</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
                            {DAYS.map(day => {
                                const isSelected = reminderDays.includes(day);
                                return (
                                    <TouchableOpacity
                                        key={day}
                                        style={[styles.dayChip, isSelected && styles.dayChipSelected]}
                                        onPress={() => toggleDay(day)}
                                    >
                                        <Text style={[styles.dayChipText, isSelected && styles.dayChipTextSelected]}>
                                            {day}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Preferences</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            {/* Toast */}
            {showToast && (
                <View style={styles.toast}>
                    <Text style={styles.toastText}>✓ Preferences saved</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
    },
    section: {
        marginBottom: 24,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    toggleHint: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 12,
    },
    timeInput: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#fff',
    },
    daysScroll: {
        flexDirection: 'row',
    },
    dayChip: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
    },
    dayChipSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    dayChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.6)',
    },
    dayChipTextSelected: {
        color: '#fff',
    },
    saveButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    errorText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    toast: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    toastText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
});
