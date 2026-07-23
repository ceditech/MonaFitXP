import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../app/navigation/Routes';
import { LEGAL_DOCS } from '../../legal/content';
import { Colors } from '../../shared/ui/Theme';

interface Props {
    navigation: NativeStackNavigationProp<MainStackParamList, 'Legal'>;
    route: RouteProp<MainStackParamList, 'Legal'>;
}

/** Renders any of the legal documents (privacy / terms / disclaimer) by route param. */
export const LegalScreen: React.FC<Props> = ({ route }) => {
    const doc = LEGAL_DOCS[route.params.doc];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>{doc.title}</Text>
                <Text style={styles.meta}>
                    Version {doc.version} · Effective {doc.effectiveDate}
                </Text>

                {doc.intro ? <Text style={styles.intro}>{doc.intro}</Text> : null}

                {doc.sections.map((section, i) => (
                    <View key={i} style={styles.section}>
                        {section.heading ? (
                            <Text style={styles.heading}>{section.heading}</Text>
                        ) : null}
                        {section.body.map((para, j) => (
                            <Text key={j} style={styles.paragraph}>
                                {para}
                            </Text>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a1a' },
    scroll: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 48 },
    title: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
    meta: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6 },
    intro: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 15,
        lineHeight: 23,
        marginTop: 18,
    },
    section: { marginTop: 24 },
    heading: { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 10 },
    paragraph: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 15,
        lineHeight: 23,
        marginBottom: 10,
    },
});
