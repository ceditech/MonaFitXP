import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    TextInput,
    Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutRepo } from '../../repositories';
import { useSession } from '../../session/SessionProvider';
import { Colors } from '../../shared/ui/Theme';
import { InProgressWorkout, PlanTemplate, Exercise, WorkoutSessionSet } from '../../data/contracts/IWorkoutRepository';
import { useLastPerformance } from './components/useLastPerformance';
import { SuggestionChip } from './components/SuggestionChip';
import { WarmupSuggestion } from './components/WarmupSuggestion';
import { PlateCalcSheet } from './components/PlateCalcSheet';
import { ExerciseDemo, ExerciseDemoHandle } from '../../lib/motion/components/ExerciseDemo';
import { RestTimerRing } from '../../lib/motion/components/RestTimerRing';
import { StaticOrb } from '../../lib/motion/fallbacks/StaticOrb';
import { inferAnimationKey, isAnimationKey } from '../../lib/motion/mannequin/poses';

export const WorkoutPlayerScreen = ({ route, navigation }: any) => {
    console.log('[WorkoutPlayerScreen] Mounting with params:', route.params);
    const { planId: routePlanId } = route.params || {};
    const repo = useWorkoutRepo();
    const { session } = useSession();
    const uid = session?.uid;
    console.log('[WorkoutPlayerScreen] UID:', uid, 'V_FIX_1');

    const [isLoading, setIsLoading] = useState(true);
    const [workout, setWorkout] = useState<InProgressWorkout | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [restRemaining, setRestRemaining] = useState(0);
    const [restTotal, setRestTotal] = useState(60);
    const [isResting, setIsResting] = useState(false);
    const demoRef = useRef<ExerciseDemoHandle>(null);

    // Confirmation modal state
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'end' | 'finish' | null>(null);

    const timerRef = useRef<any>(null);
    const restTimerRef = useRef<any>(null);

    useEffect(() => {
        loadWorkout();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (restTimerRef.current) clearInterval(restTimerRef.current);
        };
    }, []);

    const loadWorkout = async () => {
        if (!uid) {
            console.log('[WorkoutPlayerScreen] No UID, aborting');
            return;
        }
        setIsLoading(true);
        console.log('[WorkoutPlayerScreen] loadWorkout started');
        try {
            console.log('[WorkoutPlayerScreen] Fetching exercises and in-progress workout...');
            const [exs, existing] = await Promise.all([
                repo.getExercises(),
                repo.getInProgressWorkout(uid)
            ]);
            console.log('[WorkoutPlayerScreen] Fetched data:', { exerciseCount: exs.length, hasExisting: !!existing });
            setExercises(exs);

            let activeWorkout = existing;

            if (!activeWorkout && routePlanId) {
                console.log('[WorkoutPlayerScreen] No existing workout, starting new from planId:', routePlanId);
                const template = await repo.getPlanTemplate(routePlanId);
                if (template) {
                    console.log('[WorkoutPlayerScreen] Found template:', template.name);
                    const sets: WorkoutSessionSet[] = [];
                    template.blocks.forEach(block => {
                        for (let i = 0; i < block.sets; i++) {
                            sets.push({
                                exerciseId: block.exerciseId,
                                setIndex: i,
                                targetReps: block.reps,
                                targetWeight: 0
                            });
                        }
                    });

                    console.log('[WorkoutPlayerScreen] Starting workout in repo...');
                    await repo.startWorkout(uid, {
                        name: template.name,
                        planId: template.id,
                        startedAt: new Date().toISOString(),
                        status: 'in_progress',
                        cursor: { exerciseIndex: 0, setIndex: 0 },
                        sets
                    });

                    activeWorkout = await repo.getInProgressWorkout(uid);
                    console.log('[WorkoutPlayerScreen] Workout started via repo');
                } else {
                    console.log('[WorkoutPlayerScreen] Template NOT FOUND for id:', routePlanId);
                }
            }

            if (activeWorkout) {
                console.log('[WorkoutPlayerScreen] Finalizing active workout state');
                setWorkout(activeWorkout);

                // DEBUG: Log set count and exercise IDs
                const setExIds = activeWorkout.sets?.map(s => s.exerciseId) || [];
                const uniqueExIds = Array.from(new Set(setExIds));
                console.log('[WorkoutPlayerScreen] Workout sets count:', activeWorkout.sets?.length || 0);
                console.log('[WorkoutPlayerScreen] Unique exercise IDs:', uniqueExIds);

                if (uniqueExIds.length === 0) {
                    console.warn('[WorkoutPlayerScreen] WARNING: Workout has NO exercises/sets assigned.');
                }

                let calculatedElapsed: number;

                if (activeWorkout.pausedElapsedSeconds !== undefined) {
                    calculatedElapsed = activeWorkout.pausedElapsedSeconds;
                    console.log('[WorkoutPlayerScreen] === RESUMING FROM PAUSE ===');
                    console.log('Using stored elapsed time:', calculatedElapsed, 'seconds');
                } else {
                    const start = new Date(activeWorkout.startedAt).getTime();
                    const now = new Date().getTime();
                    calculatedElapsed = Math.floor((now - start) / 1000);

                    console.log('[WorkoutPlayerScreen] === RESUMING TIMER ===');
                    console.log('Workout startedAt:', activeWorkout.startedAt);
                    console.log('Current time:', new Date(now).toISOString());
                    console.log('Time difference (ms):', now - start);
                    console.log('Calculated elapsed:', calculatedElapsed, 'seconds');
                }

                setSecondsElapsed(calculatedElapsed);
                startTimer();
                console.log('[WorkoutPlayerScreen] Timer started');
            } else {
                console.log('[WorkoutPlayerScreen] No active workout found and could not start one. Calling goBack.');
                console.error('Error: No active plan or in-progress workout found.');
                navigation.goBack();
            }
        } catch (e) {
            console.error('[WorkoutPlayerScreen] loadWorkout error:', e);
        } finally {
            setIsLoading(false);
            console.log('[WorkoutPlayerScreen] loadWorkout finished');
        }
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setSecondsElapsed(prev => prev + 1);
        }, 1000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentExerciseIndex = workout?.cursor.exerciseIndex || 0;
    const planExercises = Array.from(new Set(workout?.sets.map(s => s.exerciseId)));
    const currentExerciseId = planExercises[currentExerciseIndex];
    const currentExercise = exercises.find(e => e.id === currentExerciseId);
    const currentSets = workout?.sets.filter(s => s.exerciseId === currentExerciseId) || [];

    // Training insights (last performance → suggestion + warm-ups). Optional & silent.
    const { lastSets } = useLastPerformance(uid, currentExerciseId);
    const [prefill, setPrefill] = useState<{ weight: number; reps: number } | null>(null);
    const [plateCalcWeight, setPlateCalcWeight] = useState<number | null>(null);
    const anySetCompleted = currentSets.some(s => !!s.completedAt);

    // Clear any applied suggestion when the exercise changes.
    useEffect(() => {
        setPrefill(null);
    }, [currentExerciseId]);

    const handleLogSet = async (setIndex: number, actualReps: number, actualWeight: number) => {
        if (!uid || !workout) return;

        const updatedSet: WorkoutSessionSet = {
            exerciseId: currentExerciseId,
            setIndex,
            targetReps: currentSets[setIndex].targetReps,
            targetWeight: currentSets[setIndex].targetWeight,
            actualReps,
            actualWeight,
            completedAt: new Date().toISOString()
        };

        await repo.logSet(uid, workout.id, updatedSet);

        // Update local state
        setWorkout(prev => {
            if (!prev) return null;
            const newSets = [...prev.sets];
            const idx = newSets.findIndex(s => s.exerciseId === currentExerciseId && s.setIndex === setIndex);
            if (idx >= 0) newSets[idx] = updatedSet;
            return { ...prev, sets: newSets };
        });

        console.log('[Analytics] set_logged', { exerciseId: currentExerciseId });

        // Demo-character pulse — 'pr' when this beats the last known top weight.
        const lastTopWeight = lastSets?.reduce((max, s) => Math.max(max, s.actualWeight || 0), 0) || 0;
        demoRef.current?.pulse(lastTopWeight > 0 && actualWeight > lastTopWeight ? 'pr' : 'normal');

        // Trigger Rest Timer
        startRest();
    };

    const startRest = (duration = 60) => {
        setRestRemaining(duration);
        setRestTotal(duration);
        setIsResting(true);
        console.log('[Analytics] rest_started');

        if (restTimerRef.current) clearInterval(restTimerRef.current);
        restTimerRef.current = setInterval(() => {
            setRestRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(restTimerRef.current!);
                    setIsResting(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const skipRest = () => {
        setIsResting(false);
        if (restTimerRef.current) clearInterval(restTimerRef.current);
        console.log('[Analytics] rest_skipped');
    };

    const handleNextExercise = async () => {
        if (!uid || !workout) return;
        const nextIdx = currentExerciseIndex + 1;
        if (nextIdx < planExercises.length) {
            const nextCursor = { exerciseIndex: nextIdx, setIndex: 0 };
            await repo.updateWorkoutCursor(uid, workout.id, nextCursor);
            setWorkout({ ...workout, cursor: nextCursor });
        }
    };

    const handlePrevExercise = async () => {
        if (!uid || !workout) return;
        const prevIdx = currentExerciseIndex - 1;
        if (prevIdx >= 0) {
            const prevCursor = { exerciseIndex: prevIdx, setIndex: 0 };
            await repo.updateWorkoutCursor(uid, workout.id, prevCursor);
            setWorkout({ ...workout, cursor: prevCursor });
        }
    };

    const handleFinish = () => {
        console.log('[WorkoutPlayerScreen] Finish button clicked');
        setConfirmAction('finish');
        setShowConfirmModal(true);
    };

    const handleEnd = () => {
        console.log('[WorkoutPlayerScreen] End button clicked');
        setConfirmAction('end');
        setShowConfirmModal(true);
    };

    const confirmModalAction = async () => {
        if (!uid || !workout) return;

        // Stop the timer
        if (timerRef.current) clearInterval(timerRef.current);
        if (restTimerRef.current) clearInterval(restTimerRef.current);

        if (confirmAction === 'finish') {
            try {
                await repo.completeWorkout(uid, workout.id);
                console.log('[Analytics] workout_completed', {
                    duration: secondsElapsed,
                    totalSets: workout.sets.filter(s => s.completedAt).length
                });
                setShowConfirmModal(false);
                navigation.navigate('WorkoutSummary', { workoutId: workout.id });
            } catch (e) {
                console.error('[WorkoutPlayerScreen] Error completing workout:', e);
            }
        } else if (confirmAction === 'end') {
            try {
                // Store the current elapsed time so it resumes from this exact point
                const updatedWorkout = { ...workout, pausedElapsedSeconds: secondsElapsed };

                console.log('[WorkoutPlayerScreen] === PAUSING TIMER ===');
                console.log('Storing elapsed time:', secondsElapsed, 'seconds');

                // Use repository method to ensure cache is properly updated
                await repo.updateInProgressWorkout(uid, updatedWorkout);

                setShowConfirmModal(false);
                navigation.goBack();
            } catch (e) {
                console.error('[WorkoutPlayerScreen] Error saving workout:', e);
            }
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.brandPurple} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.workoutName}>{workout?.name || 'Workout'}</Text>
                    <Text style={styles.timerText}>{formatTime(secondsElapsed)}</Text>
                </View>
                <TouchableOpacity style={styles.endBtn} onPress={handleEnd}>
                    <Text style={styles.endBtnText}>End</Text>
                </TouchableOpacity>
            </View>

            {(!workout || planExercises.length === 0) ? (
                <View style={styles.emptyWorkoutContainer}>
                    <Text style={styles.emptyWorkoutText}>No exercises found in this workout.</Text>
                    <TouchableOpacity
                        style={styles.navBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.navBtnText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={styles.scroll}>
                    {/* Exercise Info */}
                    <View style={styles.exerciseHeader}>
                        <Text style={styles.exerciseName}>{currentExercise?.name || 'Unknown Exercise'}</Text>
                        <Text style={styles.exerciseMeta}>
                            Exercise {currentExerciseIndex + 1} of {planExercises.length}
                        </Text>
                    </View>

                    {/* 3D form demo of the current exercise */}
                    <ExerciseDemo
                        ref={demoRef}
                        animationKey={isAnimationKey(currentExercise?.media?.animationKey)
                            ? currentExercise!.media!.animationKey!
                            : inferAnimationKey(currentExercise?.name || '')}
                        height={230}
                        fallback={<StaticOrb height={230} />}
                    />

                    {/* Training insights */}
                    <SuggestionChip
                        lastSets={lastSets}
                        onApply={(weight, reps) => setPrefill({ weight, reps })}
                    />
                    <WarmupSuggestion lastSets={lastSets} anySetCompleted={anySetCompleted} />

                    {/* Sets List */}
                    <View style={styles.setsList}>
                        {currentSets.map((set, idx) => (
                            <SetLoggerRow
                                key={`${set.exerciseId}-${set.setIndex}`}
                                set={set}
                                prefill={prefill}
                                onLog={(reps, weight) => handleLogSet(idx, reps, weight)}
                                onOpenPlateCalc={(weight) => setPlateCalcWeight(weight)}
                            />
                        ))}
                    </View>
                </ScrollView>
            )}

            {/* Footer Controls */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.navBtn, currentExerciseIndex === 0 && styles.btnDisabled]}
                    onPress={handlePrevExercise}
                    disabled={currentExerciseIndex === 0}
                >
                    <Text style={styles.navBtnText}>Previous</Text>
                </TouchableOpacity>

                {currentExerciseIndex === planExercises.length - 1 ? (
                    <TouchableOpacity style={[styles.navBtn, styles.finishBtn]} onPress={handleFinish}>
                        <Text style={styles.navBtnText}>Finish Workout</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.navBtn} onPress={handleNextExercise}>
                        <Text style={styles.navBtnText}>Next Exercise</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Rest Overlay */}
            {isResting && (
                <View style={styles.restOverlay}>
                    <View style={styles.restCard}>
                        <Text style={styles.restTitle}>Resting</Text>
                        <View style={styles.restRingWrap}>
                            <RestTimerRing progress={Math.min(restRemaining / restTotal, 1)} size={200} />
                            <View style={styles.restTimerOverlay}>
                                <Text style={styles.restTimer}>{restRemaining}s</Text>
                            </View>
                        </View>
                        <View style={styles.restActions}>
                            <TouchableOpacity style={styles.restBtn} onPress={() => setRestRemaining(prev => prev + 15)}>
                                <Text style={styles.restBtnText}>+15s</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.restBtn, styles.skipRestBtn]} onPress={skipRest}>
                                <Text style={styles.restBtnText}>Skip</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Plate Calculator */}
            <PlateCalcSheet
                visible={plateCalcWeight !== null}
                targetWeight={plateCalcWeight ?? 0}
                onClose={() => setPlateCalcWeight(null)}
            />

            {/* Confirmation Modal */}
            <Modal
                visible={showConfirmModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowConfirmModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {confirmAction === 'finish' ? 'Finish Workout' : 'End Workout'}
                        </Text>
                        <Text style={styles.modalMessage}>
                            {confirmAction === 'finish'
                                ? 'Are you sure you want to complete this session?'
                                : 'Save your progress and exit?'}
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnCancel]}
                                onPress={() => setShowConfirmModal(false)}
                            >
                                <Text style={styles.modalBtnTextCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnConfirm]}
                                onPress={confirmModalAction}
                            >
                                <Text style={styles.modalBtnTextConfirm}>
                                    {confirmAction === 'finish' ? 'Finish' : 'Save & Exit'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

interface SetLoggerRowProps {
    set: WorkoutSessionSet;
    prefill: { weight: number; reps: number } | null;
    onLog: (reps: number, weight: number) => void;
    onOpenPlateCalc: (weight: number) => void;
}

const SetLoggerRow = ({ set, prefill, onLog, onOpenPlateCalc }: SetLoggerRowProps) => {
    const [reps, setReps] = useState(set.actualReps?.toString() || set.targetReps.toString());
    const [weight, setWeight] = useState(set.actualWeight?.toString() || '0');
    const isCompleted = !!set.completedAt;

    // Apply a tapped suggestion to sets that haven't been logged yet.
    useEffect(() => {
        if (prefill && !isCompleted) {
            setWeight(prefill.weight.toString());
            setReps(prefill.reps.toString());
        }
    }, [prefill, isCompleted]);

    return (
        <View style={[styles.setRow, isCompleted && styles.setRowCompleted]}>
            <Text style={styles.setNumber}>SET {set.setIndex + 1}</Text>

            <View style={styles.setInputGroup}>
                <TextInput
                    style={styles.setInput}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholder="kg"
                    editable={!isCompleted}
                />
                <TouchableOpacity
                    onPress={() => onOpenPlateCalc(parseFloat(weight) || 0)}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                >
                    <Ionicons name="barbell-outline" size={16} color="rgba(255,255,255,0.35)" />
                </TouchableOpacity>
                <Text style={styles.setLabel}>kg</Text>
            </View>

            <View style={styles.setInputGroup}>
                <TextInput
                    style={styles.setInput}
                    value={reps}
                    onChangeText={setReps}
                    keyboardType="numeric"
                    placeholder="reps"
                    editable={!isCompleted}
                />
                <Text style={styles.setLabel}>reps</Text>
            </View>

            <TouchableOpacity
                style={[styles.logBtn, isCompleted && styles.logBtnCompleted]}
                onPress={() => onLog(parseInt(reps) || 0, parseInt(weight) || 0)}
                disabled={isCompleted}
            >
                <Text style={styles.logBtnText}>{isCompleted ? '✓' : 'Log'}</Text>
            </TouchableOpacity>
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
        backgroundColor: Colors.brandDarkBlue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    workoutName: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    timerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
    },
    endBtn: {
        backgroundColor: 'rgba(255,59,48,0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    endBtnText: {
        color: '#FF3B30',
        fontWeight: '700',
    },
    scroll: {
        flex: 1,
    },
    exerciseHeader: {
        padding: 24,
        alignItems: 'center',
    },
    exerciseName: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
    },
    exerciseMeta: {
        color: Colors.brandPurple,
        fontSize: 14,
        fontWeight: '700',
    },
    setsList: {
        paddingHorizontal: 16,
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        gap: 12,
    },
    setRowCompleted: {
        opacity: 0.6,
        backgroundColor: 'rgba(76, 175, 80, 0.05)',
    },
    setNumber: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        fontWeight: '800',
        width: 45,
    },
    setInputGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        paddingHorizontal: 8,
    },
    setInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        paddingVertical: 10,
        textAlign: 'center',
    },
    setLabel: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        fontWeight: '600',
    },
    logBtn: {
        backgroundColor: Colors.brandPurple,
        width: 60,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logBtnCompleted: {
        backgroundColor: '#4CAF50',
    },
    logBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
    },
    footer: {
        flexDirection: 'row',
        padding: 24,
        gap: 16,
        backgroundColor: Colors.brandDarkBlue,
    },
    navBtn: {
        flex: 1,
        height: 56,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    finishBtn: {
        backgroundColor: Colors.brandPurple,
    },
    btnDisabled: {
        opacity: 0.3,
    },
    navBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    restOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        zIndex: 100,
    },
    restCard: {
        width: '100%',
        backgroundColor: '#1a1a2e',
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    restTitle: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 16,
    },
    restRingWrap: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    restTimerOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    restTimer: {
        color: '#fff',
        fontSize: 56,
        fontWeight: '900',
    },
    restActions: {
        flexDirection: 'row',
        gap: 16,
    },
    restBtn: {
        flex: 1,
        height: 56,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipRestBtn: {
        backgroundColor: Colors.brandPurple,
    },
    restBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    emptyWorkoutContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyWorkoutText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 32,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '85%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalBtnCancel: {
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    modalBtnConfirm: {
        backgroundColor: Colors.brandPurple,
    },
    modalBtnTextCancel: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    modalBtnTextConfirm: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
