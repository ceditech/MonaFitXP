
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors } from '../../shared/ui/Theme';

export const WorkoutSummaryScreen = ({ route, navigation }: any) => {
    const { workoutId } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Workout Complete!</Text>
                <Text style={styles.subtitle}>ID: {workoutId}</Text>

                <TouchableOpacity
                    style={styles.doneBtn}
                    onPress={() => navigation.navigate('MainTabs', { screen: 'HomeToday' })}
                >
                    <Text style={styles.doneBtnText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.brandDarkBlue || '#0a0a1a',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 8,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
        marginBottom: 40,
    },
    doneBtn: {
        backgroundColor: Colors.brandPurple,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 20,
    },
    doneBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    }
});
