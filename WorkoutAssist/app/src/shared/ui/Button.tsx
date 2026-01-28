
// app/src/shared/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Colors, Spacing } from './Theme';

interface Props {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    style?: ViewStyle;
    isLoading?: boolean;
    disabled?: boolean;
}

export const Button: React.FC<Props> = ({
    title,
    onPress,
    variant = 'primary',
    style,
    isLoading = false,
    disabled = false
}) => {
    const isDisabled = disabled || isLoading;

    return (
        <TouchableOpacity
            style={[
                styles.base,
                styles[variant],
                style,
                isDisabled && styles.disabled
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={isDisabled}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : Colors.primary} />
            ) : (
                <Text style={[
                    styles.text,
                    styles[`text_${variant}`],
                    isDisabled && styles.text_disabled
                ]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        paddingVertical: Spacing.m,
        paddingHorizontal: Spacing.l,
        borderRadius: 25, // Pill shaped as per screenshot
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    primary: {
        backgroundColor: Colors.brandOrange, // Updated to brand orange
    },
    secondary: {
        backgroundColor: Colors.brandPurple,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colors.border,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 18,
        fontWeight: '700',
    },
    text_primary: {
        color: '#FFFFFF',
    },
    text_secondary: {
        color: '#FFFFFF',
    },
    text_outline: {
        color: '#FFFFFF',
    },
    text_ghost: {
        color: '#FFFFFF',
    },
    text_disabled: {
        color: 'rgba(255, 255, 255, 0.5)',
    },
});
