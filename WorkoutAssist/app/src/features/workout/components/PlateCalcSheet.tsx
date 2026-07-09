
import React, { useMemo, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../shared/ui/Theme';
import { platesFor, DEFAULT_BAR_WEIGHT } from '../../../lib/training';

interface PlateCalcSheetProps {
    visible: boolean;
    targetWeight: number;
    onClose: () => void;
}

const BAR_OPTIONS = [20, 15, 10];

/**
 * Per-side barbell plate breakdown for a target weight. Free feature,
 * opened from the barbell icon on a set row.
 */
export const PlateCalcSheet: React.FC<PlateCalcSheetProps> = ({ visible, targetWeight, onClose }) => {
    const [barWeight, setBarWeight] = useState(DEFAULT_BAR_WEIGHT);
    const breakdown = useMemo(() => platesFor(targetWeight, barWeight), [targetWeight, barWeight]);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>Plate Calculator</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                            <Ionicons name="close" size={22} color="rgba(255,255,255,0.6)" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.target}>{targetWeight} kg</Text>

                    <View style={styles.barRow}>
                        {BAR_OPTIONS.map(bar => (
                            <TouchableOpacity
                                key={bar}
                                style={[styles.barBtn, barWeight === bar && styles.barBtnActive]}
                                onPress={() => setBarWeight(bar)}
                            >
                                <Text style={[styles.barBtnText, barWeight === bar && styles.barBtnTextActive]}>
                                    {bar}kg bar
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {breakdown ? (
                        <>
                            <Text style={styles.perSideLabel}>Per side</Text>
                            <View style={styles.platesRow}>
                                {breakdown.platesPerSide.length === 0 ? (
                                    <Text style={styles.barOnly}>Bar only</Text>
                                ) : (
                                    breakdown.platesPerSide.map((plate, i) => (
                                        <View key={`${plate}-${i}`} style={[styles.plate, plateStyle(plate)]}>
                                            <Text style={styles.plateText}>{plate}</Text>
                                        </View>
                                    ))
                                )}
                            </View>
                            {breakdown.remainder !== 0 && (
                                <Text style={styles.remainder}>
                                    Closest loadable: {breakdown.achievableWeight}kg
                                    ({breakdown.remainder > 0 ? '-' : '+'}{Math.abs(breakdown.remainder)}kg)
                                </Text>
                            )}
                        </>
                    ) : (
                        <Text style={styles.remainder}>Weight is below the bar ({barWeight}kg)</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};

/** Bigger plates render bigger, mimicking real iron. */
const plateStyle = (plate: number) => {
    const size = plate >= 20 ? 56 : plate >= 10 ? 48 : plate >= 5 ? 40 : 32;
    return { width: size, height: size, borderRadius: size / 2 };
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    card: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#1a1a2e',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    target: {
        color: '#fff',
        fontSize: 40,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 16,
    },
    barRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 20,
    },
    barBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    barBtnActive: {
        backgroundColor: Colors.brandPurple,
    },
    barBtnText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '700',
    },
    barBtnTextActive: {
        color: '#fff',
    },
    perSideLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
        marginBottom: 10,
    },
    platesRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        minHeight: 60,
    },
    plate: {
        backgroundColor: Colors.brandPurple,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    plateText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '800',
    },
    barOnly: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        fontWeight: '600',
    },
    remainder: {
        color: Colors.brandOrange,
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 12,
    },
});
