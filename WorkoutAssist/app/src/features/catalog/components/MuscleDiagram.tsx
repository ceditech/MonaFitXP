
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Ellipse } from 'react-native-svg';
import { Colors } from '../../../shared/ui/Theme';

interface MuscleDiagramProps {
    /** Region ids (lowercase): chest, back, shoulders, arms, core, legs, full_body. */
    primary: string[];
    secondary?: string[];
}

const PRIMARY_COLOR = Colors.brandOrange;
const SECONDARY_COLOR = 'rgba(255, 122, 41, 0.35)';
const BODY_COLOR = 'rgba(255,255,255,0.12)';

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '_');

/**
 * Stylized front-view body diagram with highlightable regions. This is the
 * media slot that a future 3D form demo (Exercise.media.animationKey) will
 * replace — kept intentionally simple until then.
 */
export const MuscleDiagram: React.FC<MuscleDiagramProps> = ({ primary, secondary = [] }) => {
    const prim = new Set(primary.map(normalize));
    const sec = new Set(secondary.map(normalize));

    const fillFor = (...regions: string[]) => {
        if (prim.has('full_body')) return PRIMARY_COLOR;
        if (regions.some(r => prim.has(r))) return PRIMARY_COLOR;
        if (regions.some(r => sec.has(r))) return SECONDARY_COLOR;
        return BODY_COLOR;
    };

    return (
        <View style={styles.container}>
            <Svg width={110} height={170} viewBox="0 0 110 170">
                {/* Head */}
                <Circle cx={55} cy={16} r={11} fill={BODY_COLOR} />
                {/* Shoulders */}
                <Circle cx={31} cy={40} r={8} fill={fillFor('shoulders')} />
                <Circle cx={79} cy={40} r={8} fill={fillFor('shoulders')} />
                {/* Chest / upper torso (front) — 'back' highlights the same zone */}
                <Rect x={38} y={32} width={34} height={26} rx={7} fill={fillFor('chest', 'back')} />
                {/* Core */}
                <Rect x={41} y={60} width={28} height={26} rx={7} fill={fillFor('core')} />
                {/* Arms */}
                <Rect x={20} y={48} width={11} height={38} rx={5.5} fill={fillFor('arms', 'biceps', 'triceps')} />
                <Rect x={79} y={48} width={11} height={38} rx={5.5} fill={fillFor('arms', 'biceps', 'triceps')} />
                {/* Legs */}
                <Rect x={39} y={89} width={13} height={52} rx={6.5} fill={fillFor('legs', 'quads', 'hamstrings', 'glutes')} />
                <Rect x={58} y={89} width={13} height={52} rx={6.5} fill={fillFor('legs', 'quads', 'hamstrings', 'glutes')} />
                {/* Calves */}
                <Ellipse cx={45.5} cy={152} rx={6} ry={12} fill={fillFor('legs', 'calves')} />
                <Ellipse cx={64.5} cy={152} rx={6} ry={12} fill={fillFor('legs', 'calves')} />
            </Svg>
            <View style={styles.legend}>
                <View style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: PRIMARY_COLOR }]} />
                    <Text style={styles.legendText}>Primary</Text>
                </View>
                {secondary.length > 0 && (
                    <View style={styles.legendRow}>
                        <View style={[styles.legendDot, { backgroundColor: SECONDARY_COLOR }]} />
                        <Text style={styles.legendText}>Secondary</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    legend: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '600',
    },
});
