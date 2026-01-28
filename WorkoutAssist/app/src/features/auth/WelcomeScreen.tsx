
// app/src/features/auth/WelcomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    StatusBar,
    SafeAreaView,
    Platform
} from 'react-native';
import { Button } from '../../shared/ui/Button';
import { Colors, Spacing, Typography } from '../../shared/ui/Theme';
import { useSession } from '../../session/SessionProvider';

// Logo component using SVG-like approach with standard RN components
const Logo = () => (
    <View style={styles.logoContainer}>
        <View style={styles.logoWA}>
            <Text style={styles.logoTextW}>W</Text>
            <View style={styles.logoTextAContainer}>
                <Text style={styles.logoTextA}>A</Text>
                <View style={[styles.logoDot, { backgroundColor: Colors.white }]} />
            </View>
        </View>
    </View>
);

export const WelcomeScreen = ({ navigation }: any) => {
    const { ensureGuestSession, session } = useSession();
    const isGuestLoading = session.isLoading;

    useEffect(() => {
        console.log('[Analytics] welcome_viewed');
    }, []);

    const handleContinueAsGuest = async () => {
        console.log('[Analytics] continue_as_guest_clicked');

        try {
            await ensureGuestSession();
            // Navigation handled by RootNavigator
        } catch (error) {
            console.error('Guest creation failed', error);
        }
    };

    const handleSignIn = () => {
        console.log('[Analytics] sign_in_clicked');
        navigation.navigate('SignIn');
    };

    const handleSignUp = () => {
        console.log('[Analytics] sign_up_clicked');
        navigation.navigate('SignUp');
    };

    return (
        <ImageBackground
            source={require('../../assets/mock/welcome_bg.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Branding Header */}
                    <View style={styles.header}>
                        <Logo />
                        <Text style={styles.title}>WorkoutAssist</Text>
                        <Text style={styles.tagline}>Your Fitness Journey Starts Here</Text>
                    </View>

                    {/* Actions Section */}
                    <View style={styles.actions}>
                        <Button
                            title="Continue as Guest"
                            onPress={handleContinueAsGuest}
                            isLoading={isGuestLoading}
                            style={styles.primaryButton}
                        />
                        <Button
                            title="Sign In"
                            onPress={handleSignIn}
                            variant="outline"
                            disabled={isGuestLoading}
                            style={styles.outlineButton}
                        />
                        <Button
                            title="Create Account"
                            onPress={handleSignUp}
                            variant="secondary"
                            disabled={isGuestLoading}
                            style={styles.secondaryButton}
                        />
                    </View>

                    {/* Footer Footnote */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            By using WorkoutAssist, you agree to our{' '}
                            <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
                            <Text style={styles.footerLink}>Privacy Policy</Text>.
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
    },
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
        justifyContent: 'space-between',
        paddingVertical: Platform.OS === 'web' ? Spacing.xl : Spacing.m,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
    },
    logoContainer: {
        marginBottom: Spacing.s,
    },
    logoWA: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    logoTextW: {
        fontSize: 100,
        fontWeight: '900',
        color: '#4FC3F7', // Cyan color from WA logo
        lineHeight: 110,
        letterSpacing: -5,
    },
    logoTextAContainer: {
        marginLeft: -25,
        alignItems: 'center',
    },
    logoTextA: {
        fontSize: 100,
        fontWeight: '900',
        color: Colors.brandOrange,
        lineHeight: 110,
    },
    logoDot: {
        width: 15,
        height: 15,
        borderRadius: 8,
        position: 'absolute',
        top: 15,
        left: 35,
    },
    title: {
        ...Typography.h1,
        color: Colors.white,
        fontSize: 48,
        letterSpacing: -1,
        marginTop: -10,
    },
    tagline: {
        ...Typography.body,
        color: '#81D4FA', // Secondary cyan
        fontWeight: '600',
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
    actions: {
        width: '100%',
        gap: Spacing.m,
        marginBottom: Spacing.xl,
    },
    primaryButton: {
        backgroundColor: Colors.brandOrange,
        shadowColor: Colors.brandOrange,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    outlineButton: {
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(26, 26, 46, 0.4)', // Semi-transparent dark blue
    },
    secondaryButton: {
        backgroundColor: Colors.brandPurple,
        shadowColor: Colors.brandPurple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    footerStatus: {
        // Space reserved handle any status messages
    },
    footer: {
        alignItems: 'center',
        marginBottom: Spacing.m,
    },
    footerText: {
        ...Typography.caption,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        paddingHorizontal: Spacing.m,
    },
    footerLink: {
        textDecorationLine: 'underline',
        color: 'rgba(255, 255, 255, 0.8)',
    },
});
