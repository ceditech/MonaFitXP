
// app/src/shared/ui/ScreenContainer.tsx
import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from './Theme';

interface Props {
    children: React.ReactNode;
}

export const ScreenContainer: React.FC<Props> = ({ children }) => {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <View style={styles.content}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        padding: 16,
    },
});
