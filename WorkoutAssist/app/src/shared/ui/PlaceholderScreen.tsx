
// app/src/shared/ui/PlaceholderScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from './ScreenContainer';
import { Button } from './Button';
import { Typography, Spacing, Colors } from './Theme';

interface Props {
    title: string;
    description?: string;
    nextRoute?: string;
    nextLabel?: string;
    navigation: any;
    action?: () => void;
    actionLabel?: string;
    onNextPress?: () => void;
}

export const PlaceholderScreen: React.FC<Props> = ({
    title,
    description,
    nextRoute,
    nextLabel = "Next Step",
    navigation,
    action,
    actionLabel,
    onNextPress
}) => {
    return (
        <ScreenContainer>
            <View style={styles.center}>
                <Text style={[Typography.h1, { marginBottom: Spacing.s }]}>{title}</Text>
                <Text style={[Typography.body, { textAlign: 'center', marginBottom: Spacing.xl }]}>
                    {description || "This screen is a placeholder for future implementation."}
                </Text>

                <View style={styles.todo}>
                    <Text style={Typography.caption}>TODO: View Prompt Implementation</Text>
                </View>

                {action && actionLabel && (
                    <Button title={actionLabel} onPress={action} style={{ marginBottom: Spacing.m }} variant="secondary" />
                )}

                {nextRoute && (
                    <Button
                        title={nextLabel}
                        onPress={() => {
                            if (onNextPress) onNextPress();
                            navigation.navigate(nextRoute);
                        }}
                    />
                )}
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    todo: {
        padding: Spacing.s,
        backgroundColor: '#FFE58F',
        marginBottom: Spacing.xl,
        borderRadius: 4,
    }
});
