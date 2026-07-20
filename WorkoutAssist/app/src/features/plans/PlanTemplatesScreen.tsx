import React, { useState, useEffect, useMemo } from 'react';
import { track } from '../../lib/analytics';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { useWorkoutRepo } from '../../repositories';
import { Colors } from '../../shared/ui/Theme';
import { PlanTemplate } from '../../data/contracts/IWorkoutRepository';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const FREQUENCIES = ['All', '3', '4', '5'];

export const PlanTemplatesScreen = ({ navigation }: any) => {
    const repo = useWorkoutRepo();
    const [isLoading, setIsLoading] = useState(true);
    const [templates, setTemplates] = useState<PlanTemplate[]>([]);

    // Filters
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [selectedFreq, setSelectedFreq] = useState('All');

    useEffect(() => {
        track('plan_templates_viewed');
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            const data = await repo.getPlanTemplates();
            setTemplates(data);
        } catch (error) {
            console.error('Failed to load templates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTemplates = useMemo(() => {
        return templates.filter(t => {
            const levelMatch = selectedLevel === 'All' || t.difficulty === selectedLevel;
            const freqMatch = selectedFreq === 'All' || t.daysPerWeek.toString() === selectedFreq;
            return levelMatch && freqMatch;
        });
    }, [templates, selectedLevel, selectedFreq]);

    const handleFilterLevel = (level: string) => {
        setSelectedLevel(level);
        track('plan_filter_applied', { level, daysPerWeek: selectedFreq });
    };

    const handleFilterFreq = (freq: string) => {
        setSelectedFreq(freq);
        track('plan_filter_applied', { level: selectedLevel, daysPerWeek: freq });
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.title}>Choose a Plan</Text>

            <Text style={styles.filterTitle}>Experience Level</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {LEVELS.map(l => (
                    <TouchableOpacity
                        key={l}
                        style={[styles.filterChip, selectedLevel === l && styles.filterChipActive]}
                        onPress={() => handleFilterLevel(l)}
                    >
                        <Text style={[styles.filterText, selectedLevel === l && styles.filterTextActive]}>{l}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.filterTitle}>Days Per Week</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {FREQUENCIES.map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterChip, selectedFreq === f && styles.filterChipActive]}
                        onPress={() => handleFilterFreq(f)}
                    >
                        <Text style={[styles.filterText, selectedFreq === f && styles.filterTextActive]}>{f === 'All' ? 'All' : `${f} Days`}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderPlanItem = ({ item }: { item: PlanTemplate }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => {
                track('plan_template_opened', { templateId: item.id });
                navigation.navigate('PlanTemplateDetail', { templateId: item.id });
            }}
        >
            {item.isPremium && (
                <View style={styles.premiumBadge}>
                    <Text style={styles.premiumText}>PREMIUM</Text>
                </View>
            )}
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSub} numberOfLines={2}>{item.shortDescription}</Text>

                <View style={styles.cardMeta}>
                    <View style={styles.metaBadge}>
                        <Text style={styles.metaBadgeText}>{item.difficulty.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.metaText}>• {item.daysPerWeek} Days/Week</Text>
                </View>

                {item.equipment && item.equipment.length > 0 && (
                    <View style={styles.equipmentRow}>
                        {item.equipment.slice(0, 3).map(eq => (
                            <View key={eq} style={styles.eqChip}>
                                <Text style={styles.eqText}>{eq}</Text>
                            </View>
                        ))}
                        {item.equipment.length > 3 && <Text style={styles.eqMore}>+{item.equipment.length - 3}</Text>}
                    </View>
                )}
            </View>
            <View style={styles.cardArrow}>
                <Text style={{ color: Colors.brandPurple, fontSize: 24 }}>{'>'}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No plans match your filters</Text>
            <Text style={styles.emptySub}>Try adjusting your experience level or frequency.</Text>
            <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => {
                    setSelectedLevel('All');
                    setSelectedFreq('All');
                }}
            >
                <Text style={styles.clearBtnText}>Clear All Filters</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.brandPurple} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={filteredTemplates}
                keyExtractor={item => item.id}
                ListHeaderComponent={renderHeader}
                renderItem={renderPlanItem}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
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
        backgroundColor: Colors.brandDarkBlue || '#0a0a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    header: {
        paddingTop: 20,
        marginBottom: 24,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 24,
    },
    filterTitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginTop: 8,
    },
    filterScroll: {
        marginBottom: 16,
    },
    filterChip: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    filterChipActive: {
        backgroundColor: Colors.brandPurple,
        borderColor: Colors.brandPurple,
    },
    filterText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 15,
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#fff',
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    premiumBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FFB74D',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderBottomLeftRadius: 12,
    },
    premiumText: {
        color: '#000',
        fontSize: 9,
        fontWeight: '900',
    },
    cardContent: {
        flex: 1,
        padding: 20,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
    },
    cardSub: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    metaBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    metaBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
    },
    metaText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        fontWeight: '600',
    },
    equipmentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    eqChip: {
        backgroundColor: 'rgba(142, 36, 170, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    eqText: {
        color: Colors.brandPurple,
        fontSize: 11,
        fontWeight: '600',
    },
    eqMore: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 11,
        fontWeight: '700',
    },
    cardArrow: {
        paddingRight: 20,
    },
    emptyContainer: {
        paddingTop: 60,
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptySub: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 15,
        textAlign: 'center',
        paddingHorizontal: 40,
        marginBottom: 24,
    },
    clearBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
    },
    clearBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
});
