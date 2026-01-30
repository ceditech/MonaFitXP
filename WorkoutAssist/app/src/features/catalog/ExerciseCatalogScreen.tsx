import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    ScrollView,
    StatusBar
} from 'react-native';
import { Colors } from '../../shared/ui/Theme';
import { useWorkoutRepo } from '../../repositories';
import { Exercise } from '../../data/contracts/IWorkoutRepository';
import { Ionicons } from '@expo/vector-icons';

const MUSCLE_GROUPS = [
    'All', 'Quads', 'Glutes', 'Chest', 'Triceps', 'Back',
    'Hamstrings', 'Shoulders', 'Biceps', 'Core', 'Legs', 'Full Body'
];

const EQUIPMENT_OPTIONS = [
    { id: 'barbell', label: 'Barbell' },
    { id: 'dumbbell', label: 'Dumbbell' },
    { id: 'cable', label: 'Cable' },
    { id: 'machine', label: 'Machine' },
    { id: 'pull_up_bar', label: 'Pull Up Bar' },
    { id: 'box', label: 'Box' },
    { id: 'none', label: 'Bodyweight' }
];

export const ExerciseCatalogScreen = ({ navigation }: any) => {
    const repo = useWorkoutRepo();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('[Analytics] catalog_viewed');
        loadExercises();
    }, []);

    const loadExercises = async () => {
        try {
            setLoading(true);
            const data = await repo.getExercises();
            setExercises(data);
        } catch (e) {
            console.error('[ExerciseCatalog] Load error:', e);
            setError('Failed to load exercises');
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            if (search.length > 0) {
                console.log(`[Analytics] search_performed: ${search.length}`);
            }
        }, 350);
        return () => clearTimeout(handler);
    }, [search]);

    const handleToggleEquipment = (id: string) => {
        const next = selectedEquipment.includes(id)
            ? selectedEquipment.filter(x => x !== id)
            : [...selectedEquipment, id];
        setSelectedEquipment(next);
        console.log(`[Analytics] filter_applied: equipmentCount=${next.length}`);
    };

    const handleSelectMuscle = (muscle: string) => {
        const next = muscle === 'All' ? null : muscle;
        setSelectedMuscle(next);
        console.log(`[Analytics] filter_applied: muscle=${next || 'all'}`);
    };

    const filteredExercises = useMemo(() => {
        return exercises.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(debouncedSearch.toLowerCase());
            const matchesMuscle = !selectedMuscle || ex.muscles.includes(selectedMuscle);
            const matchesEquipment = selectedEquipment.length === 0 ||
                selectedEquipment.some(eq => ex.equipment.includes(eq));
            return matchesSearch && matchesMuscle && matchesEquipment;
        });
    }, [exercises, debouncedSearch, selectedMuscle, selectedEquipment]);

    const handleOpenExercise = (id: string) => {
        console.log(`[Analytics] exercise_opened: ${id}`);
        navigation.navigate('ExerciseDetail', { exerciseId: id });
    };

    const renderItem = ({ item }: { item: Exercise }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleOpenExercise(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                <View style={styles.infoColumn}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <View style={styles.tagRow}>
                        {item.muscles.slice(0, 2).map(m => (
                            <View key={m} style={styles.muscleTag}>
                                <Text style={styles.tagText}>{m}</Text>
                            </View>
                        ))}
                        {item.difficulty && (
                            <View style={[styles.difficultyTag, styles[item.difficulty]]}>
                                <Text style={styles.tagText}>{item.difficulty}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.brandPurple} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Exercise Library</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={18} color="rgba(255,255,255,0.4)" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search exercises..."
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.4)" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.filtersWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterGroup}>
                    {MUSCLE_GROUPS.map(muscle => (
                        <TouchableOpacity
                            key={muscle}
                            style={[
                                styles.chip,
                                (selectedMuscle === muscle || (muscle === 'All' && !selectedMuscle)) && styles.chipActive
                            ]}
                            onPress={() => handleSelectMuscle(muscle)}
                        >
                            <Text style={[
                                styles.chipText,
                                (selectedMuscle === muscle || (muscle === 'All' && !selectedMuscle)) && styles.chipTextActive
                            ]}>{muscle}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterGroup}>
                    {EQUIPMENT_OPTIONS.map(eq => (
                        <TouchableOpacity
                            key={eq.id}
                            style={[
                                styles.chip,
                                selectedEquipment.includes(eq.id) && styles.chipActive
                            ]}
                            onPress={() => handleToggleEquipment(eq.id)}
                        >
                            <Text style={[
                                styles.chipText,
                                selectedEquipment.includes(eq.id) && styles.chipTextActive
                            ]}>{eq.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredExercises}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={64} color="rgba(255,255,255,0.1)" />
                        <Text style={styles.emptyText}>No exercises match your search.</Text>
                        {(search || selectedMuscle || selectedEquipment.length > 0) && (
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={() => {
                                    setSearch('');
                                    setSelectedMuscle(null);
                                    setSelectedEquipment([]);
                                }}
                            >
                                <Text style={styles.clearButtonText}>Clear All Filters</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />
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
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '800',
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
    },
    filtersWrapper: {
        marginBottom: 8,
    },
    filterGroup: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    chipActive: {
        backgroundColor: Colors.brandPurple,
        borderColor: Colors.brandPurple,
    },
    chipText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        fontWeight: '600',
    },
    chipTextActive: {
        color: '#fff',
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    infoColumn: {
        flex: 1,
    },
    exerciseName: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 8,
    },
    tagRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    muscleTag: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 6,
    },
    difficultyTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    beginner: {
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
    },
    intermediate: {
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
    },
    advanced: {
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
    clearButton: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    clearButtonText: {
        color: Colors.brandPurple,
        fontWeight: '700',
    }
});
