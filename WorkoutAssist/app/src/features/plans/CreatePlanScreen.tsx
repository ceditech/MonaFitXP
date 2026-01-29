import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useWorkoutRepo } from '../../repositories';
import { useSession } from '../../session/SessionProvider';
import { Colors } from '../../shared/ui/Theme';
import { PlanTemplate, UserProfile } from '../../data/contracts/IWorkoutRepository';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CreatePlanScreen = ({ route, navigation }: any) => {
    const { templateId } = route.params;
    const repo = useWorkoutRepo();
    const { session } = useSession();
    const uid = session?.uid;

    const [isLoading, setIsLoading] = useState(true);
    const [template, setTemplate] = useState<PlanTemplate | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        console.log('[Analytics] create_plan_viewed', { templateId });
        loadData();
    }, [templateId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [tpl, prof] = await Promise.all([
                repo.getPlanTemplate(templateId),
                uid ? repo.getUserProfile(uid) : Promise.resolve(null)
            ]);

            if (tpl) {
                setTemplate(tpl);
                // Set default days
                const defaults = prof?.preferredDays || DAYS.slice(0, tpl.daysPerWeek);
                setSelectedDays(defaults);
            }
            if (prof) setProfile(prof);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDay = (day: string) => {
        setSelectedDays(prev => {
            const next = prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day];
            console.log('[Analytics] schedule_selected', { countDays: next.length });
            return next;
        });
    };

    const handleActivate = async () => {
        if (!uid || !template) return;
        if (selectedDays.length === 0) {
            Alert.alert('Selection Required', 'Please select at least one workout day.');
            return;
        }

        setIsSaving(true);
        try {
            const planId = await repo.createUserPlan(uid, {
                templateId: template.id,
                scheduleDays: selectedDays,
                createdAt: new Date().toISOString(),
                active: true
            });

            console.log('[Analytics] plan_created', { planId, templateId: template.id });
            console.log('[Analytics] plan_activated', { planId });

            // Success -> Back to Home Tab
            navigation.navigate('MainTabs', { screen: 'HomeToday' });
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to activate plan. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.brandPurple} />
            </View>
        );
    }

    const showNudge = template && selectedDays.length < template.daysPerWeek;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backBtnText}>{'←'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Set your schedule</Text>
                    <Text style={styles.subtitle}>
                        {template?.name} recommends training {template?.daysPerWeek} days per week.
                    </Text>
                </View>

                {/* Day Picker */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Workout Days</Text>
                    <View style={styles.dayGrid}>
                        {DAYS.map(day => {
                            const isSelected = selectedDays.includes(day);
                            return (
                                <TouchableOpacity
                                    key={day}
                                    style={[styles.dayCard, isSelected && styles.dayCardSelected]}
                                    onPress={() => toggleDay(day)}
                                >
                                    <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                                        {day}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    {showNudge && (
                        <View style={styles.nudgeBox}>
                            <Text style={styles.nudgeText}>
                                💡 Tip: Selecting {template?.daysPerWeek} days helps reach your goals faster.
                            </Text>
                        </View>
                    )}
                </View>

                {/* Preferences Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Selected Preferences</Text>
                    <View style={styles.prefItem}>
                        <Text style={styles.prefLabel}>Session Duration</Text>
                        <Text style={styles.prefValue}>{profile?.sessionMinutes || 45} mins</Text>
                    </View>
                    <View style={styles.prefItem}>
                        <Text style={styles.prefLabel}>Available Equipment</Text>
                        <Text style={styles.prefValue} numberOfLines={1}>
                            {(profile?.equipment && profile.equipment.length > 0)
                                ? profile.equipment.join(', ')
                                : 'Basics'}
                        </Text>
                    </View>
                    <Text style={styles.prefNote}>
                        Preferences are synced from your onboarding profile.
                    </Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.primaryBtn, isSaving && styles.btnDisabled]}
                    onPress={handleActivate}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.primaryBtnText}>Create & Activate Plan</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue || '#0a0a1a',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    backBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 8,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
        lineHeight: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 16,
    },
    dayGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    dayCard: {
        width: '22%',
        height: 48,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    dayCardSelected: {
        backgroundColor: Colors.brandPurple,
        borderColor: Colors.brandPurple,
    },
    dayText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 15,
        fontWeight: '700',
    },
    dayTextSelected: {
        color: '#fff',
    },
    nudgeBox: {
        marginTop: 16,
        backgroundColor: 'rgba(121, 82, 179, 0.1)',
        padding: 12,
        borderRadius: 12,
    },
    nudgeText: {
        color: Colors.brandPurple,
        fontSize: 13,
        fontWeight: '600',
    },
    prefItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 8,
    },
    prefLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        fontWeight: '600',
    },
    prefValue: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
        textAlign: 'right',
        marginLeft: 20,
    },
    prefNote: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: 40,
        backgroundColor: Colors.brandDarkBlue,
    },
    primaryBtn: {
        backgroundColor: Colors.brandPurple,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnDisabled: {
        opacity: 0.6,
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
});
