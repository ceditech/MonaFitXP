import { TextStyle } from 'react-native';

export const Colors = {
    primary: '#007AFF',
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#6C6C70',
    border: '#C6C6C8',
    danger: '#FF3B30',
    success: '#34C759',
    // Brand Colors
    brandOrange: '#FF7A29',
    brandOrangeLight: '#FFB26B',
    brandPurple: '#8E24AA',
    brandPurpleDark: '#4A148C',
    brandDarkBlue: '#1A1A2E',
    white: '#FFFFFF',
    transparentWhite: 'rgba(255, 255, 255, 0.7)',
};

export const Spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
};

export const Typography: { [key: string]: TextStyle } = {
    h1: { fontSize: 32, fontWeight: '700' },
    h2: { fontSize: 24, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: '400' },
    caption: { fontSize: 14, color: Colors.textSecondary },
};
