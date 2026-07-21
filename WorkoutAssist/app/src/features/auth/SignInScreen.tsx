
// app/src/features/auth/SignInScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { showAlert } from '../../shared/ui/showAlert';
import { LinearGradient } from 'expo-linear-gradient';
import { useSession } from '../../session/SessionProvider';
import { AuthBackground } from './components/AuthBackground';

export const SignInScreen = ({ navigation }: any) => {
    const { signInEmailPass } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            await signInEmailPass(email.trim(), password);
            // Navigation will be handled by RootNavigator based on session state
        } catch (error: any) {
            const errorMessage = error.message || 'Sign in failed. Please try again.';
            setError(errorMessage);
            showAlert('Sign In Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <AuthBackground>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.content}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to continue your fitness journey</Text>
                        </View>

                        {/* Error Message */}
                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>⚠️ {error}</Text>
                            </View>
                        ) : null}

                        {/* Form */}
                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="your.email@example.com"
                                    placeholderTextColor="#666"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setError('');
                                    }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!loading}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#666"
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setError('');
                                    }}
                                    secureTextEntry
                                    editable={!loading}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleSignIn}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={loading ? ['#555', '#555'] : ['#007AFF', '#0051D5']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.buttonGradient}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.buttonText}>Sign In</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Footer Links */}
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.linkButton}
                                onPress={() => navigation.navigate('SignUp')}
                                disabled={loading}
                            >
                                <Text style={styles.linkText}>
                                    Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.linkButton}
                                onPress={() => navigation.navigate('Welcome')}
                                disabled={loading}
                            >
                                <Text style={styles.secondaryLinkText}>← Back to Welcome</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </AuthBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0f',
    },
    scrollContent: {
        flexGrow: 1,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        maxWidth: 480,
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#999',
        lineHeight: 24,
    },
    errorContainer: {
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 59, 48, 0.3)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        lineHeight: 20,
    },
    form: {
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    button: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
        shadowOpacity: 0,
    },
    buttonGradient: {
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    footer: {
        alignItems: 'center',
        gap: 16,
    },
    linkButton: {
        paddingVertical: 8,
    },
    linkText: {
        color: '#999',
        fontSize: 15,
        textAlign: 'center',
    },
    linkTextBold: {
        color: '#007AFF',
        fontWeight: '600',
    },
    secondaryLinkText: {
        color: '#666',
        fontSize: 14,
    },
});
