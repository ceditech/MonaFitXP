
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../../../shared/ui/Theme';

interface MuscleDiagramProps {
    /** Primary worked muscles (exercise.muscles or group ids). */
    primary: string[];
    /** Optional secondary muscles. */
    secondary?: string[];
}

// Palette
const BODY = '#2b2740';          // neutral body fill
const MUSCLE = '#3c3757';        // resting muscle (always visible → shows musculature)
const OUTLINE = 'rgba(255,255,255,0.10)';
const PRIMARY = Colors.brandOrange;   // #FF7A29
const SECONDARY = '#B06BE6';          // violet

/** Canonical muscle-region ids used by the SVG. */
type Region =
    | 'delts' | 'chest' | 'biceps' | 'forearms' | 'abs' | 'obliques' | 'quads'
    | 'traps' | 'lats' | 'triceps' | 'lowerback' | 'glutes' | 'hamstrings' | 'calves';

/** Map a muscle/group name (any casing) to the regions it should light. */
function regionsForName(name: string): Region[] {
    const n = name.toLowerCase();
    if (n.includes('quad')) return ['quads'];
    if (n.includes('glute')) return ['glutes'];
    if (n.includes('hamstring')) return ['hamstrings'];
    if (n.includes('calf') || n.includes('calv')) return ['calves'];
    if (n.includes('chest') || n.includes('pec')) return ['chest'];
    if (n.includes('lat') || n === 'back') return ['lats'];
    if (n.includes('trap')) return ['traps'];
    if (n.includes('lower back') || n.includes('erector')) return ['lowerback'];
    if (n.includes('rear delt') || n.includes('shoulder') || n.includes('delt')) return ['delts'];
    if (n.includes('bicep')) return ['biceps'];
    if (n.includes('tricep')) return ['triceps'];
    if (n.includes('forearm')) return ['forearms'];
    if (n.includes('core') || n.includes('ab') || n.includes('oblique')) return ['abs', 'obliques'];
    // Coarse groups
    if (n.includes('leg')) return ['quads', 'glutes', 'hamstrings', 'calves'];
    if (n.includes('arm')) return ['biceps', 'triceps', 'forearms'];
    if (n.includes('full body')) return ['chest', 'abs', 'quads', 'glutes', 'delts', 'lats'];
    return [];
}

function buildSet(names: string[]): Set<Region> {
    const s = new Set<Region>();
    names.forEach(nm => regionsForName(nm).forEach(r => s.add(r)));
    return s;
}

/**
 * Modern front + back anatomical muscle map. Always renders the full
 * musculature (resting tone) and lights up the worked muscles — primary in
 * brand orange, secondary in violet — like a clean fitness-app muscle chart.
 */
export const MuscleDiagram: React.FC<MuscleDiagramProps> = ({ primary, secondary = [] }) => {
    const prim = buildSet(primary);
    const sec = buildSet(secondary);

    const fill = (r: Region) => (prim.has(r) ? PRIMARY : sec.has(r) ? SECONDARY : MUSCLE);
    const glow = (r: Region) => (prim.has(r) || sec.has(r) ? 0.9 : 0);

    // A muscle shape: resting fill + (when active) a soft wider halo underneath.
    const M = (r: Region, node: React.ReactNode, halo?: React.ReactNode) => (
        <React.Fragment key={r + Math.random()}>
            {glow(r) > 0 && halo}
            {node}
        </React.Fragment>
    );

    return (
        <View style={styles.container}>
            <Svg width="100%" height={300} viewBox="0 0 340 380">
                <Defs>
                    <LinearGradient id="body" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#312c49" />
                        <Stop offset="1" stopColor="#241f38" />
                    </LinearGradient>
                </Defs>

                {/* ===================== FRONT (left figure, center x=90) ===================== */}
                {/* base body */}
                <Circle cx={90} cy={30} r={16} fill="url(#body)" stroke={OUTLINE} />
                <Path d="M74 44 Q90 52 106 44 L112 70 Q90 84 68 70 Z" fill="url(#body)" />
                {/* torso */}
                <Path d="M64 66 Q90 60 116 66 L120 150 Q90 164 60 150 Z" fill="url(#body)" stroke={OUTLINE} />
                {/* upper arms */}
                <Path d="M64 70 Q52 74 50 92 L46 132 Q54 136 60 132 L66 92 Z" fill="url(#body)" />
                <Path d="M116 70 Q128 74 130 92 L134 132 Q126 136 120 132 L114 92 Z" fill="url(#body)" />
                {/* forearms */}
                <Path d="M46 130 L42 176 Q49 180 55 176 L59 130 Z" fill="url(#body)" />
                <Path d="M134 130 L138 176 Q131 180 125 176 L121 130 Z" fill="url(#body)" />
                {/* thighs */}
                <Path d="M62 152 L58 250 Q74 256 88 250 L88 156 Z" fill="url(#body)" />
                <Path d="M118 152 L122 250 Q106 256 92 250 L92 156 Z" fill="url(#body)" />
                {/* shins */}
                <Path d="M60 252 L64 350 Q76 354 84 350 L86 256 Z" fill="url(#body)" />
                <Path d="M120 252 L116 350 Q104 354 96 350 L94 256 Z" fill="url(#body)" />

                {/* muscles (front) */}
                {M('delts',
                    <><Ellipse cx={62} cy={74} rx={12} ry={10} fill={fill('delts')} /><Ellipse cx={118} cy={74} rx={12} ry={10} fill={fill('delts')} /></>,
                    <><Ellipse cx={62} cy={74} rx={16} ry={13} fill={PRIMARY} opacity={0.18} /><Ellipse cx={118} cy={74} rx={16} ry={13} fill={PRIMARY} opacity={0.18} /></>)}
                {M('chest',
                    <><Path d="M70 84 Q78 80 88 84 L88 104 Q78 108 70 102 Z" fill={fill('chest')} /><Path d="M110 84 Q102 80 92 84 L92 104 Q102 108 110 102 Z" fill={fill('chest')} /></>,
                    <Ellipse cx={90} cy={94} rx={26} ry={16} fill={PRIMARY} opacity={0.16} />)}
                {M('biceps',
                    <><Ellipse cx={55} cy={104} rx={7} ry={16} fill={fill('biceps')} /><Ellipse cx={125} cy={104} rx={7} ry={16} fill={fill('biceps')} /></>)}
                {M('forearms',
                    <><Ellipse cx={49} cy={152} rx={6} ry={18} fill={fill('forearms')} /><Ellipse cx={131} cy={152} rx={6} ry={18} fill={fill('forearms')} /></>)}
                {M('abs',
                    <Path d="M80 110 Q90 108 100 110 L98 150 Q90 156 82 150 Z" fill={fill('abs')} />,
                    <Ellipse cx={90} cy={132} rx={16} ry={26} fill={PRIMARY} opacity={0.16} />)}
                {M('obliques',
                    <><Path d="M74 116 L78 148 Q74 150 71 146 L70 120 Z" fill={fill('obliques')} /><Path d="M106 116 L102 148 Q106 150 109 146 L110 120 Z" fill={fill('obliques')} /></>)}
                {M('quads',
                    <><Ellipse cx={74} cy={200} rx={13} ry={42} fill={fill('quads')} /><Ellipse cx={106} cy={200} rx={13} ry={42} fill={fill('quads')} /></>,
                    <><Ellipse cx={74} cy={200} rx={17} ry={47} fill={PRIMARY} opacity={0.16} /><Ellipse cx={106} cy={200} rx={17} ry={47} fill={PRIMARY} opacity={0.16} /></>)}

                {/* ===================== BACK (right figure, center x=250) ===================== */}
                <Circle cx={250} cy={30} r={16} fill="url(#body)" stroke={OUTLINE} />
                <Path d="M234 44 Q250 52 266 44 L272 70 Q250 84 228 70 Z" fill="url(#body)" />
                <Path d="M224 66 Q250 60 276 66 L280 150 Q250 164 220 150 Z" fill="url(#body)" stroke={OUTLINE} />
                <Path d="M224 70 Q212 74 210 92 L206 132 Q214 136 220 132 L226 92 Z" fill="url(#body)" />
                <Path d="M276 70 Q288 74 290 92 L294 132 Q286 136 280 132 L274 92 Z" fill="url(#body)" />
                <Path d="M206 130 L202 176 Q209 180 215 176 L219 130 Z" fill="url(#body)" />
                <Path d="M294 130 L298 176 Q291 180 285 176 L281 130 Z" fill="url(#body)" />
                <Path d="M222 152 L218 250 Q234 256 248 250 L248 156 Z" fill="url(#body)" />
                <Path d="M278 152 L282 250 Q266 256 252 250 L252 156 Z" fill="url(#body)" />
                <Path d="M220 252 L224 350 Q236 354 244 350 L246 256 Z" fill="url(#body)" />
                <Path d="M280 252 L276 350 Q264 354 256 350 L254 256 Z" fill="url(#body)" />

                {/* muscles (back) */}
                {M('traps',
                    <Path d="M234 60 Q250 56 266 60 L262 84 Q250 90 238 84 Z" fill={fill('traps')} />,
                    <Ellipse cx={250} cy={72} rx={24} ry={16} fill={PRIMARY} opacity={0.16} />)}
                {M('delts',
                    <><Ellipse cx={222} cy={74} rx={12} ry={10} fill={fill('delts')} /><Ellipse cx={278} cy={74} rx={12} ry={10} fill={fill('delts')} /></>)}
                {M('lats',
                    <><Path d="M232 88 Q244 92 246 118 L238 132 Q228 120 226 96 Z" fill={fill('lats')} /><Path d="M268 88 Q256 92 254 118 L262 132 Q272 120 274 96 Z" fill={fill('lats')} /></>,
                    <Ellipse cx={250} cy={110} rx={28} ry={22} fill={PRIMARY} opacity={0.14} />)}
                {M('triceps',
                    <><Ellipse cx={215} cy={104} rx={7} ry={16} fill={fill('triceps')} /><Ellipse cx={285} cy={104} rx={7} ry={16} fill={fill('triceps')} /></>)}
                {M('lowerback',
                    <Path d="M240 128 Q250 124 260 128 L258 150 Q250 154 242 150 Z" fill={fill('lowerback')} />)}
                {M('glutes',
                    <><Path d="M234 156 Q246 152 250 168 Q248 184 234 182 Q226 172 230 160 Z" fill={fill('glutes')} /><Path d="M266 156 Q254 152 250 168 Q252 184 266 182 Q274 172 270 160 Z" fill={fill('glutes')} /></>,
                    <Ellipse cx={250} cy={170} rx={26} ry={18} fill={PRIMARY} opacity={0.16} />)}
                {M('hamstrings',
                    <><Ellipse cx={234} cy={210} rx={13} ry={40} fill={fill('hamstrings')} /><Ellipse cx={266} cy={210} rx={13} ry={40} fill={fill('hamstrings')} /></>,
                    <><Ellipse cx={234} cy={210} rx={17} ry={45} fill={PRIMARY} opacity={0.14} /><Ellipse cx={266} cy={210} rx={17} ry={45} fill={PRIMARY} opacity={0.14} /></>)}
                {M('calves',
                    <><Ellipse cx={233} cy={300} rx={10} ry={32} fill={fill('calves')} /><Ellipse cx={267} cy={300} rx={10} ry={32} fill={fill('calves')} /></>,
                    <><Ellipse cx={233} cy={300} rx={14} ry={37} fill={PRIMARY} opacity={0.14} /><Ellipse cx={267} cy={300} rx={14} ry={37} fill={PRIMARY} opacity={0.14} /></>)}
            </Svg>

            {/* view labels */}
            <View style={styles.viewLabels}>
                <Text style={styles.viewLabel}>FRONT</Text>
                <Text style={styles.viewLabel}>BACK</Text>
            </View>

            {/* legend */}
            <View style={styles.legend}>
                <View style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: PRIMARY }]} />
                    <Text style={styles.legendText}>Primary</Text>
                </View>
                {secondary.length > 0 && (
                    <View style={styles.legendRow}>
                        <View style={[styles.legendDot, { backgroundColor: SECONDARY }]} />
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
        width: '100%',
        paddingVertical: 8,
    },
    viewLabels: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginTop: -8,
    },
    viewLabel: {
        color: 'rgba(255,255,255,0.35)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
    },
    legend: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 10,
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
    },
    legendText: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 12,
        fontWeight: '600',
    },
});
