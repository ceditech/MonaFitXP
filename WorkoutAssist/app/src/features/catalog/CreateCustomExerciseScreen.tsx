
import React, { useState } from 'react';
import { track } from '../../lib/analytics';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { showAlert } from '../../shared/ui/showAlert';
import { Colors } from '../../shared/ui/Theme';
import { useWorkoutRepo } from '../../repositories';
import { useSession } from '../../session/SessionProvider';
import { Exercise } from '../../data/contracts/IWorkoutRepository';

const MUSCLE_OPTIONS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Glutes', 'Core', 'Full Body'];
const TYPE_OPTIONS: Exercise['type'][] = ['weight', 'bodyweight', 'cardio'];
const EQUIPMENT_OPTIONS = ['barbell', 'dumbbell', 'cable', 'machine', 'pull_up_bar', 'none'];
const MAX_NAME_LENGTH = 80; // mirrors the Firestore rule

export const CreateCustomExerciseScreen = ({ navigation }: any) => {
    const repo = useWorkoutRepo();
    const { session } = useSession();
    const uid = session.uid;

    const [name, setName] = useState('');
    const [muscles, setMuscles] = useState<string[]>([]);
    const [type, setType] = useState<Exercise['type']>('weight');
    const [equipment, setEquipment] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    const toggle = (list: string[], value: string, setter: (v: string[]) => void) => {
        setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
    };

    const canSave = name.trim().length > 0 && name.trim().length <= MAX_NAME_LENGTH && muscles.length > 0;

    const handleSave = async () => {
        if (!uid || !canSave || saving) return;
        setSaving(true);
        try {
            await repo.createCustomExercise(uid, {
                name: name.trim(),
                muscles,
                type,
                equipment: equipment.length > 0 ? equipment : ['none'],
                primaryMuscleGroup: muscles[0]?.toLowerCase(),
            });
            track('custom_exercise_created');
            navigation.goBack();
        } catch (e) {
            console.error('[CreateCustomExercise] save error:', e);
            showAlert('Error', 'Failed to save exercise. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const Chip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
        <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>New Custom Exercise</Text>

                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Landmine Press"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    maxLength={MAX_NAME_LENGTH}
                />

                <Text style={styles.label}>Muscles (pick at least one)</Text>
                <View style={styles.chipWrap}>
                    {MUSCLE_OPTIONS.map(m => (
                        <Chip key={m} label={m} active={muscles.includes(m)} onPress={() => toggle(muscles, m, setMuscles)} />
                    ))}
                </View>

                <Text style={styles.label}>Type</Text>
                <View style={styles.chipWrap}>
                    {TYPE_OPTIONS.map(t => (
                        <Chip key={t} label={t} active={type === t} onPress={() => setType(t)} />
                    ))}
                </View>

                <Text style={styles.label}>Equipment</Text>
                <View style={styles.chipWrap}>
                    {EQUIPMENT_OPTIONS.map(eq => (
                        <Chip
                            key={eq}
                            label={eq.replace(/_/g, ' ')}
                            active={equipment.includes(eq)}
                            onPress={() => toggle(equipment, eq, setEquipment)}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
                    onPress={handleSave}
                    disabled={!canSave || saving}
                >
                    {saving
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.saveBtnText}>Create Exercise</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue,
    },
    scroll: {
        padding: 24,
        paddingBottom: 48,
    },
    title: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 24,
    },
    label: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
        marginTop: 20,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#fff',
        fontSize: 16,
    },
    chipWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
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
        textTransform: 'capitalize',
    },
    chipTextActive: {
        color: '#fff',
    },
    saveBtn: {
        backgroundColor: Colors.brandPurple,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 32,
    },
    saveBtnDisabled: {
        opacity: 0.4,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
});
