import React, { useState, useEffect, useRef, useCallback } from 'react';
import { track } from '../../lib/analytics';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Image,
    StatusBar,
    useWindowDimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../shared/ui/Theme';
import { useWorkoutRepo } from '../../repositories';
import { useSession } from '../../session/SessionProvider';
import { Exercise } from '../../data/contracts/IWorkoutRepository';
import { Ionicons } from '@expo/vector-icons';
import { MuscleDiagram } from './components/MuscleDiagram';
import { ExerciseDemo } from '../../lib/motion/components/ExerciseDemo';
import { VideoDemo } from './components/VideoDemo';
import { inferAnimationKey, isAnimationKey } from '../../lib/motion/mannequin/poses';
import { getExerciseImage } from '../../data/exerciseImages';
import { getExerciseVideo } from '../../data/exerciseVideos';
import { getExerciseMuscleArt } from '../../data/exerciseMuscleArt';

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

/**
 * One carousel page: the full detail layout for a single exercise.
 * Only the ACTIVE page mounts the heavy demo (video player / 3D GL scene);
 * inactive neighbors render the lightweight poster fallback so swiping never
 * stacks multiple GL contexts or autoplaying videos.
 */
const DetailPage = ({ exercise, pageIndex, initiallyActive, bus }: {
    exercise: Exercise;
    pageIndex: number;
    initiallyActive: boolean;
    bus: { subscribe: (fn: (i: number) => void) => () => void };
}) => {
    // Each page tracks its own active state via the carousel bus, so page
    // changes never re-render the ScrollView subtree from the parent.
    const [isActive, setIsActive] = useState(initiallyActive);
    useEffect(() => bus.subscribe(i => setIsActive(i === pageIndex)), [bus, pageIndex]);

    const animationKey = isAnimationKey(exercise.media?.animationKey)
        ? exercise.media!.animationKey!
        : inferAnimationKey(exercise.name);
    const demoVideo = getExerciseVideo(exercise.id);
    const muscleArt = getExerciseMuscleArt(exercise.id);

    const posterFallback = getExerciseImage(exercise.id) ? (
        <Image
            source={getExerciseImage(exercise.id)!}
            style={styles.heroPoster}
            resizeMode="cover"
        />
    ) : (
        <View style={styles.demoFallback}>
            <MuscleDiagram
                primary={exercise.muscleDiagram?.primary || exercise.muscles || []}
                secondary={exercise.muscleDiagram?.secondary || []}
            />
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Form Demo Hero */}
            <View style={styles.heroWrap}>
                <LinearGradient
                    colors={['#2A1040', '#1A1A2E']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.hero}
                >
                    <View style={styles.demoBadge}>
                        <Ionicons name={demoVideo ? 'videocam-outline' : 'cube-outline'} size={12} color={Colors.brandOrange} />
                        <Text style={styles.demoBadgeText}>{demoVideo ? 'FORM DEMO' : '3D FORM DEMO'}</Text>
                    </View>
                    {!isActive ? (
                        posterFallback
                    ) : demoVideo ? (
                        <VideoDemo source={demoVideo} height={320} />
                    ) : (
                        <ExerciseDemo
                            animationKey={animationKey}
                            height={320}
                            fallback={posterFallback}
                        />
                    )}
                    {/* Meta chips floating over the hero bottom */}
                    <View style={styles.heroChips}>
                        {exercise.difficulty && (
                            <View style={[styles.badge, (styles as any)[exercise.difficulty]]}>
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
                    {muscleArt ? (
                        <View style={styles.muscleArt}>
                            <Image source={muscleArt} style={styles.muscleArtImage} resizeMode="contain" />
                        </View>
                    ) : (
                        <MuscleDiagram
                            primary={exercise.muscleDiagram?.primary || exercise.muscles || []}
                            secondary={exercise.muscleDiagram?.secondary || []}
                        />
                    )}
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
    );
};

export const ExerciseDetailScreen = ({ route, navigation }: any) => {
    const { exerciseId } = route.params || {};
    const repo = useWorkoutRepo();
    const { session } = useSession();
    const { width: windowWidth } = useWindowDimensions();
    // Page width MUST equal the carousel container's real width, which can be
    // narrower than the window (the web preview's device frame, split views,
    // safe areas, or a stale Dimensions value after a resize). Sizing a page
    // to the window instead of its container makes every page overflow — the
    // demo/muscle art spill off-screen and only a left slice shows (the bug
    // this screen regressed into). onLayout is unreliable in this RN-web build,
    // so we measure the container node directly (see the effect below) and fall
    // back to the reactive window width until the first measurement lands.
    const carouselRef = useRef<View>(null);
    const [measuredWidth, setMeasuredWidth] = useState(0);
    const width = measuredWidth || windowWidth;
    // Carousel state: the ordered catalog (library order) with the opened
    // exercise as the initial page. Falls back to a single page when the
    // exercise isn't in the list (e.g. stale link).
    const [exercises, setExercises] = useState<Exercise[] | null>(null);
    const [initialIndex, setInitialIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Active-page tracking deliberately lives OUTSIDE React state: on web,
    // any re-render of the ScrollView subtree resets its scroll offset,
    // killing the swipe. A ref + tiny pub/sub lets the header title and the
    // affected pages re-render themselves without touching the scroller.
    const pageIndexRef = useRef(0);
    const busRef = useRef<{ publish: (i: number) => void; subscribe: (fn: (i: number) => void) => () => void } | null>(null);
    if (!busRef.current) {
        const listeners = new Set<(i: number) => void>();
        busRef.current = {
            publish: (i: number) => listeners.forEach(l => l(i)),
            subscribe: (fn: (i: number) => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; },
        };
    }
    const bus = busRef.current;

    useEffect(() => {
        if (exerciseId) {
            track('exercise_detail_viewed', { exerciseId });
            loadExercises();
        } else {
            setError('No exercise selected');
            setLoading(false);
        }
    }, [exerciseId]);

    const loadExercises = async () => {
        try {
            setLoading(true);
            setError(null);
            // Same source & order as the Exercise Library screen, so swiping
            // moves through the exercises the way the user just saw them.
            const list = session.uid
                ? await repo.getMergedExercises(session.uid)
                : await repo.getExercises();
            const idx = list.findIndex(e => e.id === exerciseId);
            if (idx >= 0) {
                pageIndexRef.current = idx;
                setExercises(list);
                setInitialIndex(idx);
                return;
            }
            // Not in the list — resolve it directly (custom exercises live
            // under the user, not the global catalog).
            let data = await repo.getExercise(exerciseId);
            if (!data && exerciseId.startsWith('custom_') && session.uid) {
                const custom = await repo.listCustomExercises(session.uid);
                data = custom.find(e => e.id === exerciseId) || null;
            }
            if (data) {
                pageIndexRef.current = 0;
                setExercises([data]);
                setInitialIndex(0);
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

    // Paged ScrollView (not FlatList): RN-web's virtualized list resets its
    // scroll offset to 0 whenever a state update re-renders the list, which
    // breaks swiping. All pages stay mounted — they are lightweight because
    // only the active page mounts a video/GL demo.
    const scrollRef = useRef<ScrollView>(null);
    const offsetXRef = useRef(0);
    const lastLoggedIndex = useRef(-1);

    // Measure the carousel container's true width. onLayout / ResizeObserver do
    // not fire reliably in this RN-web build, so read the mounted node directly
    // (getBoundingClientRect on web, measure() on native). Re-measure on window
    // resize so the pages track the container instead of a stale window size.
    useEffect(() => {
        if (!exercises) return;
        const measure = () => {
            const node: any = carouselRef.current;
            if (!node) return;
            if (typeof node.getBoundingClientRect === 'function') {
                const w = node.getBoundingClientRect().width;
                if (w > 0) setMeasuredWidth(prev => (prev !== w ? w : prev));
            } else if (typeof node.measure === 'function') {
                node.measure((_x: number, _y: number, w: number) => {
                    if (w > 0) setMeasuredWidth(prev => (prev !== w ? w : prev));
                });
            }
        };
        measure();
        // A second pass after layout settles (scrollbar / fonts shift width).
        const raf = requestAnimationFrame(measure);
        // On web, follow real window resizes (native useWindowDimensions covers
        // native). globalThis avoids referencing the DOM-only `window` type.
        const g: any = globalThis as any;
        if (g && typeof g.addEventListener === 'function') {
            g.addEventListener('resize', measure);
            return () => { cancelAnimationFrame(raf); g.removeEventListener('resize', measure); };
        }
        return () => cancelAnimationFrame(raf);
    }, [exercises]);

    // Place the carousel on the opened exercise once the list is ready.
    useEffect(() => {
        if (!exercises) return;
        const x = width * initialIndex;
        offsetXRef.current = x;
        // Two passes: immediately and after layout settles (web needs both).
        scrollRef.current?.scrollTo({ x, animated: false });
        requestAnimationFrame(() => scrollRef.current?.scrollTo({ x, animated: false }));
    }, [exercises, initialIndex, width]);

    const onScroll = useCallback((e: any) => {
        const x = e.nativeEvent.contentOffset.x;
        offsetXRef.current = x;
        const page = Math.round(x / width);
        if (page !== pageIndexRef.current && page >= 0 && exercises && page < exercises.length) {
            pageIndexRef.current = page;
            bus.publish(page);
            if (lastLoggedIndex.current !== page) {
                lastLoggedIndex.current = page;
                track('exercise_detail_viewed', { exerciseId: exercises[page].id });
            }
        }
    }, [width, exercises, bus]);

    // Chevron navigation: swiping works natively on touch devices, but
    // desktop web has no drag-to-scroll — the arrows cover it (and drive the
    // exact same page pipeline through RN's scrollTo + onScroll).
    const goToPage = useCallback((page: number) => {
        if (!exercises || page < 0 || page >= exercises.length) return;
        // animated:false — smooth scrolling gets cancelled by the CSS
        // scroll-snap RN-web uses for pagingEnabled; instant works everywhere.
        scrollRef.current?.scrollTo({ x: width * page, animated: false });
        // Publish immediately so the title/pages react even before momentum
        // settles (onScroll will confirm with the same index).
        if (page !== pageIndexRef.current) {
            pageIndexRef.current = page;
            bus.publish(page);
            if (lastLoggedIndex.current !== page) {
                lastLoggedIndex.current = page;
                track('exercise_detail_viewed', { exerciseId: exercises[page].id });
            }
        }
    }, [width, exercises, bus]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.brandPurple} />
                </View>
            </SafeAreaView>
        );
    }

    if (error || !exercises || exercises.length === 0) {
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
                <CarouselTitle exercises={exercises} initialIndex={initialIndex} bus={bus} />
                <CarouselNav count={exercises.length} initialIndex={initialIndex} bus={bus} goToPage={goToPage} />
            </View>

            {/* This wrapper is what we measure (via carouselRef): its flex:1
                size equals the real container width, independent of the pages
                inside — so page width can never diverge from the viewport. */}
            <View ref={carouselRef} style={styles.carousel}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    style={styles.carousel}
                >
                    {exercises.map((item, index) => (
                        <View key={item.id} style={{ width }}>
                            <DetailPage
                                exercise={item}
                                pageIndex={index}
                                initiallyActive={index === initialIndex}
                                bus={bus}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

/** Prev/next chevrons that follow the carousel without re-rendering the screen. */
const CarouselNav = ({ count, initialIndex, bus, goToPage }: {
    count: number;
    initialIndex: number;
    bus: { subscribe: (fn: (i: number) => void) => () => void };
    goToPage: (page: number) => void;
}) => {
    const [index, setIndex] = useState(initialIndex);
    useEffect(() => bus.subscribe(setIndex), [bus]);
    return (
        <View style={styles.carouselNav}>
            <TouchableOpacity
                testID="carousel-prev"
                onPress={() => goToPage(index - 1)}
                disabled={index <= 0}
                style={styles.carouselNavBtn}
            >
                <Ionicons name="chevron-back" size={22} color={index <= 0 ? 'rgba(255,255,255,0.25)' : '#fff'} />
            </TouchableOpacity>
            <TouchableOpacity
                testID="carousel-next"
                onPress={() => goToPage(index + 1)}
                disabled={index >= count - 1}
                style={styles.carouselNavBtn}
            >
                <Ionicons name="chevron-forward" size={22} color={index >= count - 1 ? 'rgba(255,255,255,0.25)' : '#fff'} />
            </TouchableOpacity>
        </View>
    );
};

/** Header title that follows the carousel without re-rendering the screen. */
const CarouselTitle = ({ exercises, initialIndex, bus }: {
    exercises: Exercise[];
    initialIndex: number;
    bus: { subscribe: (fn: (i: number) => void) => () => void };
}) => {
    const [index, setIndex] = useState(initialIndex);
    useEffect(() => bus.subscribe(setIndex), [bus]);
    const exercise = exercises[Math.min(index, exercises.length - 1)];
    return <Text style={styles.headerTitle} numberOfLines={1}>{exercise.name}</Text>;
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
    carouselNav: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    carouselNavBtn: {
        width: 36,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
    },
    carousel: {
        flex: 1,
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
    heroPoster: {
        width: '100%',
        height: 320,
    },
    heroChips: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    muscleArt: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    muscleArtImage: {
        width: '100%',
        height: '100%',
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
