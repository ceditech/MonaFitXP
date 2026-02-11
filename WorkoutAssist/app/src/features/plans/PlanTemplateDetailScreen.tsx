import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    ImageBackground
} from 'react-native';
import { useWorkoutRepo } from '../../repositories';
import { useSession } from '../../session/SessionProvider';
import { Colors } from '../../shared/ui/Theme';
import { PlanTemplate, Exercise } from '../../data/contracts/IWorkoutRepository';

export const PlanTemplateDetailScreen = ({ route, navigation }: any) => {
    const { templateId } = route.params;
    const repo = useWorkoutRepo();
    const { session } = useSession();

    const [isLoading, setIsLoading] = useState(true);
    const [template, setTemplate] = useState<PlanTemplate | null>(null);
    const [exercises, setExercises] = useState<Record<string, Exercise>>({});
    const [entitlement, setEntitlement] = useState<{ tier: string }>({ tier: 'free' });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('[Analytics] plan_template_detail_viewed', { templateId });
        loadData();
    }, [templateId]);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [tpl, exList, ent] = await Promise.all([
                repo.getPlanTemplate(templateId),
                repo.getExercises(),
                session.uid ? repo.getEntitlement(session.uid) : Promise.resolve({ tier: 'free' })
            ]);

            if (!tpl) {
                setError('Template not found');
            } else {
                setTemplate(tpl);
                const exMap = exList.reduce((acc, ex) => ({ ...acc, [ex.id]: ex }), {});
                setExercises(exMap);
                setEntitlement(ent);
            }
        } catch (e) {
            console.error(e);
            setError('Failed to load plan details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChoosePlan = async () => {
        if (!template) return;

        console.log('[Analytics] choose_plan_clicked', { templateId });

        // Premium Gating Logic
        const isGuest = session?.mode === 'guest' || session?.mode === 'none';
        const isPremiumUser = entitlement.tier !== 'free';

        if (template.isPremium && (isGuest || !isPremiumUser)) {
            console.log('[Analytics] paywall_redirected', {
                templateId,
                source: 'premium_plan_detail',
                isGuest,
                tier: entitlement.tier
            });
            navigation.navigate('Paywall', { source: 'premium_template', templateId: template.id });
        } else {
            navigation.navigate('CreatePlan', { templateId: template.id });
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.brandPurple} />
            </View>
        );
    }

    if (error || !template) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorTitle}>{error || 'Something went wrong'}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.retryBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backBtnText}>{'←'}</Text>
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{template.name}</Text>
                        <View style={styles.badgeRow}>
                            <View style={[styles.badge, { backgroundColor: Colors.brandPurple }]}>
                                <Text style={styles.badgeText}>{template.difficulty.toUpperCase()}</Text>
                            </View>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{template.daysPerWeek} DAYS/WEEK</Text>
                            </View>
                            {template.isPremium && (
                                <View style={[styles.badge, styles.premiumBadge]}>
                                    <Text style={[styles.badgeText, { color: '#000' }]}>PREMIUM</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About this plan</Text>
                    <Text style={styles.description}>{template.shortDescription}</Text>
                </View>

                {/* Equipment */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Equipment Needed</Text>
                    <View style={styles.eqRow}>
                        {template.equipment.map(eq => (
                            <View key={eq} style={styles.eqChip}>
                                <Text style={styles.eqText}>{eq}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Weekly Preview */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Weekly Preview</Text>
                    <Text style={styles.sectionSub}>Here is a summary of the exercises included in this template:</Text>

                    <View style={styles.blockContainer}>
                        {template.blocks.map((block, idx) => {
                            const ex = exercises[block.exerciseId];
                            return (
                                <View key={block.exerciseId + idx} style={styles.exItem}>
                                    <View style={styles.exIconContainer}>
                                        <Text style={styles.exIcon}>🏋️</Text>
                                    </View>
                                    <View style={styles.exDetails}>
                                        <Text style={styles.exName}>{ex?.name || 'Unknown Exercise'}</Text>
                                        <Text style={styles.exMeta}>{block.sets} Sets × {block.reps} Reps</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.primaryBtn} onPress={handleChoosePlan}>
                    <Text style={styles.primaryBtnText}>
                        {template.isPremium ? 'Unlock This Plan' : 'Choose This Plan'}
                    </Text>
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
    errorContainer: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorIcon: {
        fontSize: 64,
        marginBottom: 20,
    },
    errorTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 24,
    },
    retryBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
    },
    retryBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
    },
    header: {
        paddingTop: 20,
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
    titleContainer: {
        flex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '900',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    premiumBadge: {
        backgroundColor: '#FFB74D',
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 12,
        letterSpacing: 0.2,
    },
    description: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        lineHeight: 26,
    },
    eqRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    eqChip: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    eqText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
    },
    sectionSub: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        marginBottom: 16,
    },
    blockContainer: {
        gap: 12,
    },
    exItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    exIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    exIcon: {
        fontSize: 20,
    },
    exDetails: {
        flex: 1,
    },
    exName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    exMeta: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
        fontWeight: '600',
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
        shadowColor: Colors.brandPurple,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
});
