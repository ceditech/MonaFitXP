
// app/src/features/auth/SignUpScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { showAlert } from '../../shared/ui/showAlert';
import { LinearGradient } from 'expo-linear-gradient';
import { useSession } from '../../session/SessionProvider';
import { AuthBackground } from './components/AuthBackground';

export const SignUpScreen = ({ navigation }: any) => {
    const { signUpEmailPass } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        setError('');

        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await signUpEmailPass(email.trim(), password);
            // Navigation will be handled by RootNavigator based on session state
        } catch (error: any) {
            const errorMessage = error.message || 'Sign up failed. Please try again.';
            setError(errorMessage);
            showAlert('Sign Up Failed', errorMessage);
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
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Start your fitness transformation today</Text>
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
                                    placeholder="At least 6 characters"
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

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Re-enter your password"
                                    placeholderTextColor="#666"
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        setError('');
                                    }}
                                    secureTextEntry
                                    editable={!loading}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleSignUp}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={loading ? ['#555', '#555'] : ['#34C759', '#28A745']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.buttonGradient}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.buttonText}>Create Account</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Footer Links */}
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.linkButton}
                                onPress={() => navigation.navigate('SignIn')}
                                disabled={loading}
                            >
                                <Text style={styles.linkText}>
                                    Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
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
        shadowColor: '#34C759',
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
        color: '#34C759',
        fontWeight: '600',
    },
    secondaryLinkText: {
        color: '#666',
        fontSize: 14,
    },
});
