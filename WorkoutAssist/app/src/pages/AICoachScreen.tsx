
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors } from '../shared/ui/Theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RequirePro } from '../core/guards/RequirePro';

const AICoachContent = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.botIcon}>
                        <MaterialCommunityIcons name="robot" size={48} color="#fff" />
                    </View>
                    <Text style={styles.title}>AI Fitness Coach</Text>
                    <Text style={styles.subtitle}>Your personalized training partner</Text>
                </View>

                <View style={styles.chatPlaceholder}>
                    <View style={styles.messageBubble}>
                        <Ionicons name="chatbubble" size={20} color={Colors.brandPurple} />
                        <Text style={styles.messageText}>How can I help you with your workout today?</Text>
                    </View>

                    <View style={[styles.messageBubble, styles.systemBubble]}>
                        <Text style={styles.systemText}>AI Coach is ready to analyze your form and adjust your plan.</Text>
                    </View>
                </View>

                <View style={styles.comingSoon}>
                    <Text style={styles.comingSoonText}>Form analysis and adaptive routines coming in the next update!</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export const AICoachScreen = () => {
    return (
        <RequirePro>
            <AICoachContent />
        </RequirePro>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue,
    },
    scrollContent: {
        padding: 24,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    botIcon: {
        backgroundColor: Colors.brandPurple,
        padding: 20,
        borderRadius: 30,
        marginBottom: 16,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 16,
        marginTop: 4,
    },
    chatPlaceholder: {
        width: '100%',
        marginBottom: 40,
    },
    messageBubble: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 16,
        borderRadius: 20,
        borderBottomLeftRadius: 4,
        marginBottom: 16,
        alignItems: 'center',
    },
    messageText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 12,
        flex: 1,
    },
    systemBubble: {
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 4,
        marginLeft: 40,
    },
    systemText: {
        color: Colors.brandPurple,
        fontSize: 14,
        fontWeight: '600',
    },
    comingSoon: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    comingSoonText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
