import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Image,
    StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../shared/ui/Theme';
import { useWorkoutRepo } from '../../repositories';
import { useSession } from '../../session/SessionProvider';
import { Exercise } from '../../data/contracts/IWorkoutRepository';
import { Ionicons } from '@expo/vector-icons';
import { MuscleDiagram } from './components/MuscleDiagram';
import { ExerciseDemo } from '../../lib/motion/components/ExerciseDemo';
import { inferAnimationKey, isAnimationKey } from '../../lib/motion/mannequin/poses';

export const ExerciseDetailScreen = ({ route, navigation }: any) => {
    const { exerciseId } = route.params || {};
    const repo = useWorkoutRepo();
    const { session } = useSession();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (exerciseId) {
            console.log(`[Analytics] exercise_detail_viewed: ${exerciseId}`);
            loadExercise();
        } else {
            setError('No exercise selected');
            setLoading(false);
        }
    }, [exerciseId]);

    const loadExercise = async () => {
        try {
            setLoading(true);
            setError(null);
            let data = await repo.getExercise(exerciseId);
            // Custom exercises live under the user, not the global catalog.
            if (!data && exerciseId.startsWith('custom_') && session.uid) {
                const custom = await repo.listCustomExercises(session.uid);
                data = custom.find(e => e.id === exerciseId) || null;
            }
            if (data) {
                setExercise(data);
            } else {
                setError('Exercise not found');
            }
        } catch (e) {
            console.error('[ExerciseDetail] Load error:', e);
            setError('Failed to load exercise details');
        } finally {
            setLoading(false);
        }
    };

    const renderInstructions = (instructions: string | string[] | undefined) => {
        if (!instructions) return <Text style={styles.bodyText}>No instructions available.</Text>;

        const steps = Array.isArray(instructions)
            ? instructions
            : instructions.split('\n').filter(s => s.trim().length > 0);

        return steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
            </View>
        ));
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.brandPurple} />
                </View>
            </SafeAreaView>
        );
    }

    if (error || !exercise) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Ionicons name="alert-circle-outline" size={64} color="rgba(255,255,255,0.2)" />
                    <Text style={styles.errorText}>{error || 'Something went wrong'}</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{exercise.name}</Text>
                <View style={styles.headerIcon} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* 3D Form Demo Hero */}
                <View style={styles.heroWrap}>
                    <LinearGradient
                        colors={['#2A1040', '#1A1A2E']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={styles.hero}
                    >
                        <View style={styles.demoBadge}>
                            <Ionicons name="cube-outline" size={12} color={Colors.brandOrange} />
                            <Text style={styles.demoBadgeText}>3D FORM DEMO</Text>
                        </View>
                        <ExerciseDemo
                            animationKey={isAnimationKey(exercise.media?.animationKey)
                                ? exercise.media!.animationKey!
                                : inferAnimationKey(exercise.name)}
                            height={320}
                            fallback={
                                <View style={styles.demoFallback}>
                                    <MuscleDiagram
                                        primary={exercise.muscleDiagram?.primary
                                            || (exercise.primaryMuscleGroup ? [exercise.primaryMuscleGroup] : [])}
                                        secondary={exercise.muscleDiagram?.secondary || []}
                                    />
                                </View>
                            }
                        />
                        {/* Meta chips floating over the hero bottom */}
                        <View style={styles.heroChips}>
                            {exercise.difficulty && (
                                <View style={[styles.badge, styles[exercise.difficulty]]}>
                                    <Text style={styles.badgeText}>{exercise.difficulty}</Text>
                                </View>
                            )}
                            <View style={styles.typeBadge}>
                                <Text style={styles.badgeText}>{exercise.type}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Target muscles & equipment */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Targets</Text>
                    <View style={styles.targetsCard}>
                        <MuscleDiagram
                            primary={exercise.muscleDiagram?.primary
                                || (exercise.primaryMuscleGroup ? [exercise.primaryMuscleGroup] : [])}
                            secondary={exercise.muscleDiagram?.secondary || []}
                        />
                        <View style={styles.chipCloud}>
                            {exercise.muscles.map(m => (
                                <View key={m} style={styles.muscleChip}>
                                    <Text style={styles.chipText}>{m}</Text>
                                </View>
                            ))}
                            {exercise.equipment.map(e => (
                                <View key={e} style={styles.equipmentChip}>
                                    <Text style={styles.chipText}>{e}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Instructions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How to Perform</Text>
                    {renderInstructions(exercise.instructions)}

                    {exercise.formTip ? (
                        <View style={styles.tipCard}>
                            <View style={styles.tipIcon}>
                                <Ionicons name="bulb" size={16} color={Colors.brandOrange} />
                            </View>
                            <View style={styles.tipBody}>
                                <Text style={styles.tipLabel}>PRO TIP</Text>
                                <Text style={styles.tipText}>{exercise.formTip}</Text>
                            </View>
                        </View>
                    ) : null}
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
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
        padding: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroWrap: {
        padding: 16,
    },
    hero: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(142, 36, 170, 0.3)',
        paddingBottom: 14,
    },
    demoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderWidth: 1,
        borderColor: 'rgba(255, 122, 41, 0.35)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 12,
        marginBottom: -30,
        zIndex: 2,
    },
    demoBadgeText: {
        color: Colors.brandOrange,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    demoFallback: {
        height: 320,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroChips: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    targetsCard: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        gap: 12,
    },
    mediaNote: {
        color: 'rgba(255,255,255,0.4)',
        marginTop: 12,
        fontSize: 14,
        fontWeight: '500',
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    beginner: { backgroundColor: 'rgba(76, 175, 80, 0.6)' },
    intermediate: { backgroundColor: 'rgba(255, 152, 0, 0.6)' },
    advanced: { backgroundColor: 'rgba(244, 67, 54, 0.6)' },
    chipCloud: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    muscleChip: {
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderColor: 'rgba(124, 58, 237, 0.3)',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    equipmentChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    chipText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 20,
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.brandPurple,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        marginTop: 2,
    },
    stepNumberText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
    },
    stepText: {
        flex: 1,
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        lineHeight: 24,
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        backgroundColor: 'rgba(255, 122, 41, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 122, 41, 0.3)',
        borderRadius: 16,
        padding: 14,
        marginTop: 8,
    },
    tipIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 122, 41, 0.18)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipBody: {
        flex: 1,
    },
    tipLabel: {
        color: Colors.brandOrange,
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1,
        marginBottom: 3,
    },
    tipText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },
    errorText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
    backButton: {
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    bodyText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
    },
    bottomSpacer: {
        height: 60,
    }
});
