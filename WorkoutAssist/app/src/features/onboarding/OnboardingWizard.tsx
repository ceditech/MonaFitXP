import React, { useState, useEffect } from 'react';
import { track } from '../../lib/analytics';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { showAlert } from '../../shared/ui/showAlert';
import { useSession } from '../../session/SessionProvider';
import { useWorkoutRepo } from '../../repositories';
import { UserProfile } from '../../data/contracts/IWorkoutRepository';
import { Colors } from '../../shared/ui/Theme';
import { useEntitlement } from '../../core/entitlements/EntitlementProvider';
import { selectPlanTemplate } from './selectPlanTemplate';
import { ConsentChoices, buildConsentRecord, mayStoreHealthData } from '../../core/consent/consent.model';
import { isValidDateOfBirth, meetsMinimumAge, MIN_AGE } from '../../core/age/age';


const STEPS = [
    { title: 'About you', sub: 'A couple of basics to get started' },
    { title: 'Goal', sub: 'What do you want to achieve?' },
    { title: 'Experience', sub: 'How long have you been training?' },
    { title: 'Equipment', sub: 'What are you working with?' },
    { title: 'Schedule', sub: 'When can you commit?' },
    { title: 'Permissions', sub: 'A few consents before we start' },
    { title: 'Bio', sub: 'Final details' }
];

const ABOUT_STEP = 0;
const GOAL_STEP = 1;
const EXPERIENCE_STEP = 2;
const EQUIPMENT_STEP = 3;
const SCHEDULE_STEP = 4;
const CONSENT_STEP = 5;
const BIO_STEP = 6;

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

// Health data (GDPR Art. 9), so firestore.rules pins these ids to a closed
// vocabulary. Adding an entry here WITHOUT adding it to validInjuryFlags() in
// firestore.rules makes the profile write fail with a permission error.
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
        name: '',
        dateOfBirth: '',
        goal: undefined,
        experience: undefined,
        equipment: [],
        daysPerWeek: 3,
        preferredDays: [],
        injuryFlags: [],
        sessionMinutes: 45,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const [consent, setConsent] = useState<ConsentChoices>({
        disclaimer: false,
        privacyTerms: false,
        healthData: false,
        marketing: false,
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
            showAlert('Error', 'Failed to save progress. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFinish = async () => {
        track('onboarding_completed');
        if (!session.uid) return;

        setIsSaving(true);
        try {
            // 0. Record consent — the legal basis for everything that follows.
            // A failure here must NOT trap the user in onboarding (a single
            // subcollection write shouldn't brick account setup — e.g. if the
            // consents rules haven't deployed yet), so it is caught, not thrown.
            // The compliance guarantee is preserved separately below: health data
            // is stored only when consent was granted AND actually recorded.
            let consentRecorded = false;
            try {
                await repo.saveConsents(session.uid, buildConsentRecord(consent));
                consentRecorded = true;
            } catch (consentErr) {
                console.error('[OnboardingWizard] saveConsents failed; proceeding without storing health data', consentErr);
            }

            const profileToSave: Partial<UserProfile> = {
                ...formData,
                onboardingCompleted: true,
            };
            if (!mayStoreHealthData(consent, consentRecorded)) {
                profileToSave.injuryFlags = [];
            }

            // 1. Save User Profile
            await repo.saveUserProfile(session.uid, profileToSave);

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
            showAlert('Error', 'Failed to complete onboarding. Please try again.');
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
            case ABOUT_STEP:
                return renderAboutStep();
            case GOAL_STEP: // Goal
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
            case EXPERIENCE_STEP: // Experience
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
            case EQUIPMENT_STEP: // Equipment
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
            case SCHEDULE_STEP: // Schedule
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
            case CONSENT_STEP:
                return renderConsentStep();
            case BIO_STEP: // Bio
                return (
                    <View style={styles.stepInner}>
                        {consent.healthData ? (
                            <>
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
                            </>
                        ) : (
                            // Health-data consent was declined — do not collect injury
                            // information. The app stays fully usable without it.
                            <Text style={styles.cardSub}>
                                You chose not to share health information, so we won’t ask about
                                injuries. You can change this anytime in Settings.
                            </Text>
                        )}

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

    // Derived age gate: a valid DOB that meets the minimum age.
    const dob = formData.dateOfBirth || '';
    const dobEntered = dob.length > 0;
    const dobValid = dobEntered && isValidDateOfBirth(dob);
    const ageOk = dobValid && meetsMinimumAge(dob);
    const ageBlocked = dobValid && !ageOk; // valid date, but under the minimum age

    const isStepValid = () => {
        // Entry gate: a real name and a valid, old-enough DOB are required to
        // leave the first step. Under-16s cannot pass.
        if (currentStep === ABOUT_STEP) return !!formData.name?.trim() && ageOk;
        if (currentStep === GOAL_STEP) return !!formData.goal;
        if (currentStep === EXPERIENCE_STEP) return !!formData.experience;
        // Required consents must both be granted to leave the consent step.
        if (currentStep === CONSENT_STEP) return consent.disclaimer && consent.privacyTerms;
        return true;
    };

    const renderAboutStep = () => (
        <View style={styles.stepInner}>
            <Text style={styles.label}>What should we call you?</Text>
            <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={t => setFormData({ ...formData, name: t })}
                placeholder="Your name"
                placeholderTextColor="rgba(255,255,255,0.25)"
                autoCapitalize="words"
                testID="about-name"
            />

            <Text style={[styles.label, { marginTop: 28 }]}>Date of birth</Text>
            <Text style={styles.cardSub}>You must be at least {MIN_AGE} to use WorkoutAssist.</Text>
            <TextInput
                style={[styles.input, ageBlocked && styles.inputError]}
                value={formData.dateOfBirth}
                onChangeText={t => setFormData({ ...formData, dateOfBirth: t })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="rgba(255,255,255,0.25)"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numbers-and-punctuation"
                testID="about-dob"
            />

            {dobEntered && !dobValid && (
                <Text style={styles.inputHint}>Enter a valid date as YYYY-MM-DD.</Text>
            )}
            {ageBlocked && (
                <View style={styles.blockCard} testID="age-block">
                    <Text style={styles.blockTitle}>Sorry — you’re not old enough yet</Text>
                    <Text style={styles.blockBody}>
                        WorkoutAssist is only available to people {MIN_AGE} and older. You can’t
                        create an account right now.
                    </Text>
                </View>
            )}
        </View>
    );

    const renderConsentRow = (
        key: keyof ConsentChoices,
        label: React.ReactNode,
        required: boolean,
    ) => {
        const checked = consent[key];
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.consentRow}
                onPress={() => setConsent(c => ({ ...c, [key]: !c[key] }))}
                testID={`consent-${key}`}
            >
                <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                    {checked && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.consentText}>{label}</Text>
                    {required && <Text style={styles.consentRequired}>Required</Text>}
                </View>
            </TouchableOpacity>
        );
    };

    const legalLink = (text: string, doc: 'privacy' | 'terms' | 'disclaimer') => (
        <Text style={styles.legalLink} onPress={() => navigation.navigate('Legal', { doc })}>
            {text}
        </Text>
    );

    const renderConsentStep = () => (
        <View style={styles.stepInner}>
            {renderConsentRow(
                'disclaimer',
                <>I have read and understand the {legalLink('Health & Safety Disclaimer', 'disclaimer')}.</>,
                true,
            )}
            {renderConsentRow(
                'privacyTerms',
                <>I accept the {legalLink('Privacy Policy', 'privacy')} and {legalLink('Terms of Service', 'terms')}.</>,
                true,
            )}
            {renderConsentRow(
                'healthData',
                <>Use my injury and health information to personalize and keep my workouts safe.</>,
                false,
            )}
            {renderConsentRow(
                'marketing',
                <>Send me occasional product updates and tips by email.</>,
                false,
            )}
            <Text style={styles.metaText}>
                You can change these anytime in Settings.
            </Text>
        </View>
    );

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
                    {/* No Skip on the first step — it is the age gate. Allowing a
                        skip here would let an under-16 bypass the eligibility check. */}
                    {currentStep !== ABOUT_STEP && (
                        <TouchableOpacity onPress={handleSkip} style={styles.skipBtnContainer}>
                            <Text style={styles.skipBtn}>Skip</Text>
                        </TouchableOpacity>
                    )}
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
    consentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        padding: 16,
        marginBottom: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
        marginRight: 14,
        marginTop: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.brandPurple,
        borderColor: Colors.brandPurple,
    },
    checkboxTick: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
    },
    consentText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 15,
        lineHeight: 22,
    },
    consentRequired: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 4,
        letterSpacing: 0.5,
    },
    legalLink: {
        color: Colors.brandPurple,
        fontWeight: '700',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        color: '#fff',
        fontSize: 16,
        paddingHorizontal: 16,
        height: 52,
        marginTop: 10,
    },
    inputError: {
        borderColor: '#FF5252',
    },
    inputHint: {
        color: '#FFB4B4',
        fontSize: 13,
        marginTop: 8,
    },
    blockCard: {
        backgroundColor: 'rgba(255,82,82,0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,82,82,0.4)',
        padding: 16,
        marginTop: 20,
    },
    blockTitle: {
        color: '#FF8A80',
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 6,
    },
    blockBody: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        lineHeight: 20,
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
