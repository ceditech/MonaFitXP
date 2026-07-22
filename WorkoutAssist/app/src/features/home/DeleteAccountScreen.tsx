import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../app/navigation/Routes';
import { useSession } from '../../session/SessionProvider';
import { Colors } from '../../shared/ui/Theme';
import { showAlert } from '../../shared/ui/showAlert';
import { requestAccountDeletion, requestDataExport, deliverExport } from '../../data/accountApi';

const CONFIRM_WORD = 'DELETE';

interface Props {
    navigation: NativeStackNavigationProp<MainStackParamList>;
}

/**
 * Irreversible account deletion (GDPR Art. 17). A typed-word confirmation is used
 * instead of a simple button because the native Alert with buttons is a no-op on
 * web (the platform this ships to) and because "type DELETE" is the accepted
 * pattern for destructive, unrecoverable actions — it forces intent.
 */
export const DeleteAccountScreen: React.FC<Props> = ({ navigation }) => {
    const { signOut } = useSession();
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const canDelete = confirmText.trim().toUpperCase() === CONFIRM_WORD && !isDeleting;

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const data = await requestDataExport();
            await deliverExport(data);
        } catch (e) {
            showAlert('Export failed', 'Could not export your data. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleDelete = async () => {
        if (!canDelete) return;
        setIsDeleting(true);
        try {
            await requestAccountDeletion();
            // The Auth record is gone server-side; clear local session so the app
            // returns to the signed-out state rather than holding a dead token.
            await signOut();
            // No navigation needed — RootNavigator swaps to the auth stack once the
            // session clears. This runs only if that hasn't happened yet.
        } catch (e) {
            setIsDeleting(false);
            showAlert(
                'Deletion failed',
                'Your account could not be deleted. Please try again or contact support.',
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.iconCircle}>
                    <Ionicons name="warning-outline" size={32} color="#FF5252" />
                </View>

                <Text style={styles.title}>Delete your account</Text>
                <Text style={styles.body}>
                    This permanently deletes your profile, workouts, plans, custom exercises,
                    stats, and progress. It cannot be undone.
                </Text>

                <TouchableOpacity
                    style={styles.exportBtn}
                    onPress={handleExport}
                    disabled={isExporting || isDeleting}
                >
                    {isExporting ? (
                        <ActivityIndicator color={Colors.brandPurple} />
                    ) : (
                        <>
                            <Ionicons name="download-outline" size={18} color={Colors.brandPurple} />
                            <Text style={styles.exportText}>Export my data first</Text>
                        </>
                    )}
                </TouchableOpacity>

                <Text style={styles.confirmLabel}>
                    Type {CONFIRM_WORD} to confirm
                </Text>
                <TextInput
                    style={styles.input}
                    value={confirmText}
                    onChangeText={setConfirmText}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    placeholder={CONFIRM_WORD}
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    editable={!isDeleting}
                    testID="delete-confirm-input"
                />

                <TouchableOpacity
                    style={[styles.deleteBtn, !canDelete && styles.deleteBtnDisabled]}
                    onPress={handleDelete}
                    disabled={!canDelete}
                    testID="delete-confirm-button"
                >
                    {isDeleting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.deleteText}>Delete account permanently</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => navigation.goBack()}
                    disabled={isDeleting}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a1a' },
    scroll: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48 },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,82,82,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
    body: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 15,
        lineHeight: 22,
        marginTop: 12,
    },
    exportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(142,36,170,0.12)',
        borderRadius: 14,
        height: 50,
        marginTop: 28,
        borderWidth: 1,
        borderColor: 'rgba(142,36,170,0.4)',
    },
    exportText: { color: Colors.brandPurple, fontSize: 15, fontWeight: '700' },
    confirmLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 32,
        marginBottom: 10,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 2,
        paddingHorizontal: 18,
        height: 54,
    },
    deleteBtn: {
        backgroundColor: '#E53935',
        borderRadius: 16,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    deleteBtnDisabled: { backgroundColor: 'rgba(229,57,53,0.3)' },
    deleteText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    cancelBtn: { height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
    cancelText: { color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: '600' },
});
