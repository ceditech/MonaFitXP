import React, { useState, useEffect } from 'react';
import { track } from '../../lib/analytics';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useSession } from '../../session/SessionProvider';
import { useWorkoutRepo } from '../../repositories';
import { UserProfile } from '../../data/contracts/IWorkoutRepository';
import { Colors } from '../../shared/ui/Theme';
import { useEntitlement } from '../../core/entitlements/EntitlementProvider';
import { selectPlanTemplate } from './selectPlanTemplate';


const STEPS = [
    { title: 'Goal', sub: 'What do you want to achieve?' },
    { title: 'Experience', sub: 'How long have you been training?' },
    { title: 'Equipment', sub: 'What are you working with?' },
    { title: 'Schedule', sub: 'When can you commit?' },
    { title: 'Bio', sub: 'Final details' }
];

const GOALS = [
    { id: 'strength', label: 'Strength', sub: 'Master the big lifts' },
    { id: 'hypertrophy', label: 'Hypertrophy', sub: 'Build muscle mass' },
    { id: 'fat_loss', label: 'Fat Loss', sub: 'Lean down with cardio/weights' },
    { id: 'mobility', label: 'Mobility', sub: 'Move better, feel better' }
];

const EXPERIENCE = [
    { id: 'beginner', label: 'Beginner', sub: '0-6 months experience' },
    { id: 'intermediate', label: 'Intermediate', sub: '6-24 months experience' },
    { id: 'advanced', label: 'Advanced', sub: '2+ years experience' }
];

const EQUIPMENT = [
    'Dumbbells', 'Barbell', 'Kettlebell', 'Bench',
    'Cable Machine', 'Resistance Bands', 'Pull-up Bar', 'Cardio Machine'
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const INJURIES = [
    { id: 'knees', label: 'Knees' },
    { id: 'lower_back', label: 'Lower Back' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'wrists', label: 'Wrists' },
    { id: 'neck', label: 'Neck' }
];

export const OnboardingWizard = ({ navigation }: any) => {
    const { session, refreshProfile } = useSession();
    const repo = useWorkoutRepo();
    const { tier } = useEntitlement();

    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<UserProfile>>({
        goal: undefined,
        experience: undefined,
        equipment: [],
        daysPerWeek: 3,
        preferredDays: [],
        injuryFlags: [],
        sessionMinutes: 45,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    useEffect(() => {
        loadProfile();
        track('onboarding_started');
    }, []);

    const loadProfile = async () => {
        if (!session.uid) return;
        try {
            const profile = await repo.getUserProfile(session.uid);
            if (profile) {
                if (profile.onboardingCompleted) {
                    console.log('[OnboardingWizard] Already completed, navigating home');
                    navigation.replace('MainTabs', { screen: 'HomeToday' });
                    return;
                }
                setFormData(prev => ({ ...prev, ...profile }));
            }
        } catch (error) {
            console.error('[OnboardingWizard] loadProfile failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            track('onboarding_step_completed', { step: currentStep, title: STEPS[currentStep].title });
            setCurrentStep(s => s + 1);
        } else {
            handleFinish();
        }
    };

    const handleBack = () => {
        setCurrentStep(s => Math.max(0, s - 1));
    };

    const handleSkip = async () => {
        track('onboarding_skipped');
        setIsSaving(true);
        try {
            // Record the skip rather than leaving onboardingCompleted false on its
            // own. RootNavigator mounts the wizard whenever onboarding is not
            // finished, so without this marker "Skip" re-showed the wizard on every
            // single launch — there was no way to dismiss it short of completing it.
            await repo.saveUserProfile(session.uid!, {
                onboardingCompleted: false,
                onboardingSkippedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            // Push the flag into session state now; otherwise the navigator still
            // has the stale value and bounces straight back to the wizard.
            await refreshProfile();
            navigation.replace('MainTabs', { screen: 'HomeToday' });
        } catch (error) {
            Alert.alert('Error', 'Failed to save progress. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFinish = async () => {
        track('onboarding_completed');
        if (!session.uid) return;

        setIsSaving(true);
        try {
            // 1. Save User Profile
            await repo.saveUserProfile(session.uid, {
                ...formData,
                onboardingCompleted: true,
            });

            // 2. Create and Activate a starting plan.
            // Ranked on difficulty/schedule/equipment (and goal once templates
            // carry one), with premium templates excluded for free users.
            const templates = await repo.getPlanTemplates();
            const { template: goalTemplate, reason, score } = selectPlanTemplate(
                templates,
                formData,
                tier,
            );

            if (!goalTemplate) {
                // Not fatal — the user still gets an account and can pick a plan
                // manually. Logged because it means the catalog is empty or
                // entirely gated, which is a seeding/config problem.
                console.warn(`[OnboardingWizard] No plan template assigned (${reason}), tier=${tier}`);
            }

            if (goalTemplate) {
                console.log(`[OnboardingWizard] Selected plan "${goalTemplate.name}" (score=${score})`);
                const planId = await repo.createUserPlan(session.uid, {
                    templateId: goalTemplate.id,
                    scheduleDays: formData.preferredDays || ['Mon', 'Wed', 'Fri'],
                    createdAt: new Date().toISOString(),
                    active: true
                });
                await repo.activatePlan(session.uid, planId);
            }

            // 3. Refresh session profile to update app state and trigger RootNavigator redirect
            await refreshProfile();

            // Note: If RootNavigator redirect doesn't happen immediately, 
            // the replacement provides a fallback.
            navigation.replace('MainTabs', { screen: 'HomeToday' });
        } catch (error) {
            console.error('[OnboardingWizard] handleFinish failed:', error);
            Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleMultiSelect = (key: keyof UserProfile, value: string) => {
        const currentArr = (formData[key] as string[]) || [];
        if (currentArr.includes(value)) {
            setFormData({ ...formData, [key]: currentArr.filter(i => i !== value) });
        } else {
            setFormData({ ...formData, [key]: [...currentArr, value] });
        }
    };

    if (isLoading || isSaving) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.brandPurple} />
                <Text style={styles.loadingText}>{isSaving ? 'Finishing setup...' : 'Loading your journey...'}</Text>
            </View>
        );
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Goal
                return (
                    <View style={styles.stepInner}>
                        {GOALS.map(g => (
                            <TouchableOpacity
                                key={g.id}
                                activeOpacity={0.7}
                                style={[styles.card, formData.goal === g.id && styles.cardSelected]}
                                onPress={() => setFormData({ ...formData, goal: g.id as any })}
                            >
                                <View style={styles.cardInfo}>
                                    <Text style={[styles.cardTitle, formData.goal === g.id && styles.textSelected]}>{g.label}</Text>
                                    <Text style={styles.cardSub}>{g.sub}</Text>
                                </View>
                                {formData.goal === g.id && <Text style={{ color: Colors.brandPurple, fontSize: 24, fontWeight: 'bold' }}>✓</Text>}
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case 1: // Experience
                return (
                    <View style={styles.stepInner}>
                        {EXPERIENCE.map(e => (
                            <TouchableOpacity
                                key={e.id}
                                activeOpacity={0.7}
                                style={[styles.card, formData.experience === e.id && styles.cardSelected]}
                                onPress={() => setFormData({ ...formData, experience: e.id as any })}
                            >
                                <View style={styles.cardInfo}>
                                    <Text style={[styles.cardTitle, formData.experience === e.id && styles.textSelected]}>{e.label}</Text>
                                    <Text style={styles.cardSub}>{e.sub}</Text>
                                </View>
                                {formData.experience === e.id && <Text style={{ color: Colors.brandPurple, fontSize: 24, fontWeight: 'bold' }}>✓</Text>}
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case 2: // Equipment
                return (
                    <View style={styles.stepInner}>
                        <Text style={styles.stepHeaderLabel}>Select what you have access to:</Text>
                        <View style={styles.wrapContainer}>
                            {EQUIPMENT.map(e => (
                                <TouchableOpacity
                                    key={e}
                                    activeOpacity={0.7}
                                    style={[styles.chip, formData.equipment?.includes(e) && styles.chipSelected]}
                                    onPress={() => toggleMultiSelect('equipment', e)}
                                >
                                    <Text style={[styles.chipText, formData.equipment?.includes(e) && styles.chipTextSelected]}>{e}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );
            case 3: // Schedule
                return (
                    <View style={styles.stepInner}>
                        <View style={styles.selectionCard}>
                            <Text style={styles.label}>How many days per week?</Text>
                            <View style={styles.counterRow}>
                                <TouchableOpacity
                                    onPress={() => setFormData({ ...formData, daysPerWeek: Math.max(1, (formData.daysPerWeek || 3) - 1) })}
                                    style={styles.counterBtn}
                                >
                                    <Text style={styles.counterBtnText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.counterVal}>{formData.daysPerWeek}</Text>
                                <TouchableOpacity
                                    onPress={() => setFormData({ ...formData, daysPerWeek: Math.min(7, (formData.daysPerWeek || 3) + 1) })}
                                    style={styles.counterBtn}
                                >
                                    <Text style={styles.counterBtnText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={[styles.label, { marginTop: 32 }]}>Preferred Training Days</Text>
                        <Text style={styles.cardSub}>Try to match your {formData.daysPerWeek} goal days</Text>
                        <View style={styles.daysRow}>
                            {WEEKDAYS.map(day => (
                                <TouchableOpacity
                                    key={day}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.dayCircle,
                                        formData.preferredDays?.includes(day) && styles.dayCircleSelected
                                    ]}
                                    onPress={() => toggleMultiSelect('preferredDays', day)}
                                >
                                    <Text style={[styles.dayText, formData.preferredDays?.includes(day) && styles.dayTextSelected]}>
                                        {day[0]}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );
            case 4: // Bio
                return (
                    <View style={styles.stepInner}>
                        <Text style={styles.label}>Any focus areas or minor injuries?</Text>
                        <View style={styles.wrapContainer}>
                            {INJURIES.map(i => (
                                <TouchableOpacity
                                    key={i.id}
                                    activeOpacity={0.7}
                                    style={[styles.chip, formData.injuryFlags?.includes(i.id) && styles.chipSelected]}
                                    onPress={() => toggleMultiSelect('injuryFlags', i.id)}
                                >
                                    <Text style={[styles.chipText, formData.injuryFlags?.includes(i.id) && styles.chipTextSelected]}>{i.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={[styles.selectionCard, { marginTop: 32 }]}>
                            <Text style={styles.label}>Target session length (min)</Text>
                            <View style={styles.counterRow}>
                                <TouchableOpacity
                                    onPress={() => setFormData({ ...formData, sessionMinutes: Math.max(20, (formData.sessionMinutes || 45) - 5) })}
                                    style={styles.counterBtn}
                                >
                                    <Text style={styles.counterBtnText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.counterVal}>{formData.sessionMinutes}</Text>
                                <TouchableOpacity
                                    onPress={() => setFormData({ ...formData, sessionMinutes: Math.min(90, (formData.sessionMinutes || 45) + 5) })}
                                    style={styles.counterBtn}
                                >
                                    <Text style={styles.counterBtnText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.metaText}>Auto-detected Timezone: {formData.timezone}</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    const isStepValid = () => {
        if (currentStep === 0) return !!formData.goal;
        if (currentStep === 1) return !!formData.experience;
        return true;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressIndicator, { width: `${((currentStep + 1) / STEPS.length) * 100}%` }]} />
                </View>
                <View style={styles.headerContent}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.stepTitle}>{STEPS[currentStep].title}</Text>
                        <Text style={styles.stepSub}>{STEPS[currentStep].sub}</Text>
                    </View>
                    <TouchableOpacity onPress={handleSkip} style={styles.skipBtnContainer}>
                        <Text style={styles.skipBtn}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {renderStepContent()}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.navBtn, currentStep === 0 && styles.navBtnDisabled]}
                    onPress={handleBack}
                    disabled={currentStep === 0}
                >
                    <Text style={[styles.navBtnText, { fontSize: 24, marginRight: 8 }]}>{'<'}</Text>
                    <Text style={[styles.navBtnText, currentStep === 0 && styles.navBtnTextDisabled]}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.primaryBtn, !isStepValid() && styles.primaryBtnDisabled]}
                    onPress={handleNext}
                    disabled={!isStepValid()}
                >
                    <Text style={styles.primaryBtnText}>
                        {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
                    </Text>
                    {currentStep < STEPS.length - 1 && <Text style={{ color: 'white', fontSize: 20, marginLeft: 8 }}>{'>'}</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue || '#0a0a1a',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue || '#0a0a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
    },
    header: {
        paddingTop: 64,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        marginBottom: 24,
        overflow: 'hidden',
    },
    progressIndicator: {
        height: '100%',
        backgroundColor: Colors.brandPurple,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    stepTitle: {
        color: '#fff',
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    stepSub: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 17,
        marginTop: 6,
    },
    skipBtnContainer: {
        padding: 8,
        marginRight: -8,
    },
    skipBtn: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
        fontWeight: '600',
    },
    scroll: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    stepInner: {
        marginTop: 12,
    },
    stepHeaderLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        marginBottom: 16,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    cardSelected: {
        borderColor: Colors.brandPurple,
        backgroundColor: 'rgba(142, 36, 170, 0.15)',
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 19,
        fontWeight: '700',
    },
    textSelected: {
        color: '#fff',
    },
    cardSub: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 15,
        marginTop: 4,
    },
    selectionCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    wrapContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
        marginTop: 8,
    },
    chip: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        margin: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    chipSelected: {
        backgroundColor: Colors.brandPurple,
        borderColor: Colors.brandPurple,
    },
    chipText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 15,
        fontWeight: '600',
    },
    chipTextSelected: {
        color: '#fff',
    },
    label: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 6,
        alignSelf: 'flex-start',
        marginTop: 12,
    },
    counterBtn: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterBtnText: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '300',
    },
    counterVal: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        marginHorizontal: 28,
        minWidth: 24,
        textAlign: 'center',
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    dayCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    dayCircleSelected: {
        backgroundColor: Colors.brandPurple,
        borderColor: Colors.brandPurple,
    },
    dayText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
        fontWeight: '700',
    },
    dayTextSelected: {
        color: '#fff',
    },
    metaText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 13,
        marginTop: 48,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        padding: 24,
        paddingBottom: 48,
        backgroundColor: Colors.brandDarkBlue,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        gap: 16,
    },
    navBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    navBtnDisabled: {
        opacity: 0,
    },
    navBtnText: {
        color: Colors.brandPurple,
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 4,
    },
    navBtnTextDisabled: {
        color: '#444',
    },
    primaryBtn: {
        flex: 1,
        backgroundColor: Colors.brandPurple,
        borderRadius: 18,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: Colors.brandPurple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryBtnDisabled: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        shadowOpacity: 0,
        elevation: 0,
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
